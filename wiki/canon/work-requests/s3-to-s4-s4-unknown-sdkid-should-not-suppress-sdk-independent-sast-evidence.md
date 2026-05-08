---
title: "S4: unknown sdkId should not suppress SDK-independent SAST evidence"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s4-unknown-sdkid-should-not-suppress-sdk-independent-sast-evidence"
last_verified: "2026-05-08"
service_tags: ["s3-analysis-agent", "s4-sast-runner", "gateway-webserver", "quality-gate"]
decision_tags: ["sdk-contract", "degraded-mode", "evidence-acquisition", "no-overfit"]
related_pages: ["wiki/canon/decisions/s3-analysis-qg-generalization-principle-20260508.md", "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s4-unknown-sdkid-should-not-suppress-sdk-independent-sast-evidence"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-08T07:17:43.570Z","note":"Resolved by S4 API contract update and implementation: explicit none/non-registered/S4-local sdkId modes, non-registered sdkDescriptor deterministic resolver, unknown bare sdkId fail-fast, tests and reply WR registered."}]
registered_at: "2026-05-08T05:59:56.668Z"
completed_at: "2026-05-08T07:17:43.570Z"
---

# S4: unknown sdkId should not suppress SDK-independent SAST evidence

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## 요청 배경
S3 gateway-webserver full-pipeline baseline에서 과거에는 잡히던 `popen`/CWE-78 RCE claim이 이번에는 `claims=[]`, `analysisOutcome=no_accepted_claims`, `qualityOutcome=repair_exhausted`, `termination_reason=no_new_evidence`로 종료되었습니다.

S3 측 추적 결과, 실제 취약 코드가 사라진 것이 아니라 S4 SAST evidence acquisition이 조용히 비어 버린 것이 핵심 원인으로 보입니다.

## 재현/증거
- 분석 report: `/home/kosh/AEGIS/reports/gateway-webserver-full-pipeline-20260508-135919`
- S3 analyze request: `gateway-webserver-full-pipeline-20260508-135919-analyze`
- 분석 대상 소스에는 여전히 위험 sink가 존재합니다.
  - `/home/kosh/AEGIS/uploads/build-agent-stabilization-datasets/gateway-webserver/src/clients/http_client.cpp:62`
  - `FILE* pipe = popen(cmd.c_str(), "r");`
- S4에 `projectPath + buildProfile.sdkId="ti-am335x-08.02.00.24"` 형태로 직접 `/v1/scan`을 호출하면 S4는 HTTP 400으로 거부했습니다.
  - `SDK_NOT_FOUND`
  - `Unknown sdkId 'ti-am335x-08.02.00.24'. Register it in sdk-registry.json or omit sdkId for native/non-SDK builds.`
- 반대로 SDK 정보를 제거하고 같은 파일/프로젝트를 `flawfinder`로 스캔하면 S4는 즉시 finding을 생성합니다.
  - `ruleId=flawfinder:shell/popen`
  - `severity=error`
  - `cweId=CWE-78`
  - `file=src/clients/http_client.cpp`
  - `line=62`

## S3 관점의 문제 정의
현재 S4가 모르는 `sdkId`가 들어오면 SDK 독립적인 SAST까지 전체가 막히는 것으로 보입니다. 그러나 `flawfinder`, 단순 source/regex/semgrep 계열 rule은 SDK registry resolution 없이도 실행 가능합니다. `sdkId`는 build-aware analyzer/metadata enrichment에는 필요할 수 있지만, source-only SAST의 mandatory gate가 되면 안 됩니다.

이 때문에 S3에서는 다음 연쇄가 발생했습니다.
1. S4 SAST evidence가 비어 있음/실행 실패
2. S3 Phase 1 dangerous-caller 보강도 SAST finding 기반이라 스킵됨
3. Phase 2가 `code_graph.callers` no-hit만 반복
4. `code.read_file` fallback 없이 `no_new_evidence`로 종료
5. 최종 사용자에게는 `status=completed` + `claims=[]`처럼 보이는 조용한 evidence-acquisition failure가 됨

## 요청 사항
S4에서 unknown `sdkId` 처리 정책을 조정해 주세요.

권장 동작:
1. `sdkId`를 알 수 없어도 `projectPath` 또는 `files[]`가 유효하면 SDK-independent SAST는 계속 실행
   - 최소 `flawfinder`
   - 가능하면 SDK 불필요 Semgrep/source rules
2. SDK/build-aware 도구만 degraded/ skipped 처리
   - `clang-tidy`, `scan-build`, `gcc-fanalyzer`, metadata extraction 등 SDK/compile context가 필요한 도구
3. 응답에는 partial/degraded 상태를 명확히 남김
   - unknown sdkId가 있었음을 `execution.toolResults`/`errorDetail`/`degradeReasons` 중 적절한 위치에 보존
   - 전체 HTTP 400으로 종료하지 말고, 실행 가능한 tool 결과가 있으면 200/partial 또는 S4 표준 degraded 응답으로 반환
4. `/v1/scan`과 `/v1/build-and-analyze` 양쪽에서 일관된 정책 적용
5. regression test 추가
   - unknown sdkId + C/C++ source containing `popen(non_literal)`
   - expected: response contains `flawfinder:shell/popen` or equivalent CWE-78 finding, while SDK-dependent tools are marked degraded/skipped

## 비목표 / 주의
- gateway-webserver 이름/경로/문자열 특수처리는 금지입니다.
- 이번 fixture는 regression evidence일 뿐이며, 목표는 범용 SAST degradation policy입니다.
- S3도 별도 후속으로 SAST failure와 no-finding을 구분하고 source fallback을 강화할 예정입니다. 다만 S4에서 SDK-independent SAST를 막지 않는 것이 1차 upstream fix입니다.

## 완료 기준
- Unknown sdkId가 들어와도 source-only SAST가 가능한 입력에서는 전체 스캔이 조용히 비지 않음
- `http_client.cpp:62 popen(cmd.c_str(), "r")` 류 source-only sink가 finding으로 반환됨
- SDK 관련 문제는 degraded metadata로 관측 가능
- 관련 테스트/로그 증적을 WR reply에 첨부

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
