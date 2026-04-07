---
title: "Inspect gateway-webserver findings drift in S4 logs"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-inspect-gateway-webserver-findings-drift-in-s4-logs"
last_verified: "2026-04-07"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner"]
decision_tags: ["logs", "gateway-webserver", "findings-drift", "analysis-quality"]
related_pages: ["wiki/canon/handoff/s3/session-omx-1775469122100-df8axl.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/specs/sast-runner.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-inspect-gateway-webserver-findings-drift-in-s4-logs"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-04-07T01:02:32.784Z","note":"Reviewed S4 logs and reproduced gateway-webserver/src analysis offline. Conclusion: the current 55 filtered findings for build-and-analyze is a normal latest result, not evidence of S4 filtering drift. The main delta versus the ~42-finding plain /scan path is shape: /v1/build-and-analyze injects compile_commands into the inner scan, which increases cppcheck/clang-tidy visibility (notably cppcheck unusedFunction and several clang-tidy diagnostics). Evidence: e2e-1775471971-analyze logged raw 188 -> filtered 55 with sdkNoiseRemoved=133; e2e-1775471516-analyze showed the same 55-result build-and-analyze path and a separate plain /scan on the same src path producing 42. Earlier ~10k / root-path behavior (e2e-1775471166-analyze) was a different surface that scanned gateway-webserver root after build-and-analyze fallback, so it is not comparable. For S3 triage, the best claim candidates remain: clients/http_client.cpp:62 popen / command processor use (Flawfinder + clang-tidy), utils/fs.cpp:22 readlink race / NUL-handling risk, utils/env.cpp:9/37/58 getenv-driven env handling, utils/fs.cpp:98 mkstemp temp-file handling, and routes/test_route.cpp narrowing / pointer-bool diagnostics where relevant. No S4 code change required from this WR."}]
registered_at: "2026-04-07T00:55:45.186Z"
completed_at: "2026-04-07T01:02:32.784Z"
---

# Inspect gateway-webserver findings drift in S4 logs

- Kind: request
- From: s3
- To: s4

## 배경
S3가 2026-04-06에 RE100 4개 대상 fixed-input pipeline 검증을 수행했고, `gateway-webserver`는 build 자체는 성공했지만 analyze 결과가 과거 체감과 다르게 나왔습니다.

## 관측값
- build requestId: `e2e-1775471971-build`
- analyze requestId: `e2e-1775471971-analyze`
- build 결과: `completed`, artifact match 성공, `gateway-webserver` 실행파일 생성 확인
- analyze target: `gateway-webserver/src`
- S4 `build-and-analyze` 경로에서 raw findings `188`, filtered findings `55`
- 도구별 로그(대표): cppcheck `155`, flawfinder `10`, clang-tidy `14`, gcc-fanalyzer `9`, semgrep `0`, scan-build `0`
- trace상 `sdk=133 removed`가 찍히며 최종 findings가 `55`로 남음

## 문제의식
S3 관찰 기준, 과거 `gateway-webserver` 계열 테스트에서는 findings가 대체로 `10` 안팎이었고 이번처럼 `55`까지 유지되는 패턴은 이례적입니다. 현재 S3 분석 품질 문제와 별개로, S4 findings inflation / filtering drift가 있는지 확인이 필요합니다.

## 요청 사항
1. 위 requestId 기준으로 S4 로그를 재검토해 주세요.
2. 현재 findings 수치가 다음 중 무엇인지 판단해 주세요.
   - 정상적인 최신 결과
   - tool/profile/filtering drift
   - build-and-analyze와 scan의 중복/shape 차이 영향
   - sdk include/materialization 변화 영향
3. 특히 아래를 확인해 주세요.
   - `build-and-analyze`와 `scan`의 결과 shape 차이
   - filtered findings `55`가 어떤 카테고리/도구에 주로 묶이는지
   - 예전 live 경로와 지금 경로의 호출 표면 차이
4. 가능하면 `gateway-webserver`에서 S3가 claim 후보로 봐야 할 핵심 findings 3~5개를 추려 주세요.

## 참고 증적
- aggregate summary: `reports/re100-fixed-pipeline-20260406-191941/aggregate-summary.json`
- analyze 응답: `reports/re100-fixed-pipeline-20260406-191941/tmp-gateway-webserver/analyze.json`
- S3 session history: `wiki/canon/handoff/s3/session-omx-1775469122100-df8axl.md`

## 기대 결과
- 현재 findings 규모가 정상인지/회귀인지에 대한 S4 판단
- 필요 시 S4 측 후속 수정 또는 S3가 전제해야 할 새로운 해석 규칙
