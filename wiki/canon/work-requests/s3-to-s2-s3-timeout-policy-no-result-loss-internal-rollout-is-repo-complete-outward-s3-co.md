---
title: "S3 timeout-policy / no-result-loss internal rollout is repo-complete; outward S3 contract unchanged"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-timeout-policy-no-result-loss-internal-rollout-is-repo-complete-outward-s3-co"
last_verified: "2026-04-14"
service_tags: ["s2", "s3", "analysis-agent", "build-agent", "timeout-policy", "async-ownership"]
decision_tags: ["contract-sync", "implementation-status", "notice"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/specs/health-control-signal-rollout-v1.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-timeout-policy-no-result-loss-internal-rollout-is-repo-complete-outward-s3-co"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-14T06:31:39.449Z","note":"Reviewed the notice against current S2 integration surfaces and canonical S3 API docs on 2026-04-14. The rollout is internal to S3; no new S2-facing public contract delta or migration work is required from this notice. Recipient handling complete."}]
registered_at: "2026-04-14T06:16:39.679Z"
completed_at: "2026-04-14T06:31:39.449Z"
---

# S3 timeout-policy / no-result-loss internal rollout is repo-complete; outward S3 contract unchanged

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S3의 timeout-policy / no-result-loss 관련 **내부 rollout**은 현재 repo 기준으로 정리 완료 상태다.

핵심만 먼저 말하면:
- **S3 outward/public contract에 추가 delta는 없다.**
- 최근 변화는 주로 **S3 내부 consumer-side hardening** 이다.
- S2는 기존 canonical S3 계약서를 그대로 integration 기준으로 보면 된다.

## 현재 S3 완료 상태
### 1. health-control 정렬
- elapsed wall-clock time alone으로 S3가 로컬 abort를 내리지 않도록 정렬됨
- Analysis Agent `/v1/health` request-summary는 `phase-advancing / transport-only / ack-break` 의미를 사용

### 2. S5 runtime semantics 소비
- `408 TIMEOUT` 과 `503 KB_NOT_READY`를 구분해서 소비
- code-graph ingest `status/readiness/warnings`를 실제로 읽음
- code graph / GraphRAG readiness에 따라 phase-2 graph tool 노출과 dangerous-callers 실행을 조정

### 3. S7 async ownership 소비
- tool-less LLM 호출은 새 async ownership surface를 우선 사용
- unavailable이면 sync `/v1/chat` fallback
- unsupported async surface(404/405/501)는 짧은 cooldown으로 기억해서 반복 probe를 줄임
- 이 패턴은 현재 S3 주요 내부 경로에 반영됨:
  - Analysis Agent agent loop
  - `generate-poc`
  - Build Agent agent loop
  - Analysis Agent legacy `RealLlmClient` / `TaskPipeline`
  - Analysis Agent `eval_runner`

## S2가 알아야 할 contract point
### outward/public contract 관점
S2가 호출하는 S3 outward surface는 추가로 바뀌지 않았다.

여전히 canonical reference:
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/api/build-agent-api.md`

즉, 이번 notice는 **새 endpoint나 새 요청 body를 요구하는 migration notice가 아니다.**

### practical integration meaning
S2는 이미 알고 있는 S3 contract를 그대로 사용하면 되고,
최근 S3 변화는 주로 다음에 해당한다:
- lower-service timeout/ready semantics를 더 정직하게 소비
- no-result-loss 방향으로 내부 LLM 호출 전략 정리
- false negative / premature abort를 줄이기 위한 내부 fallback/cooldown 보강

## verification snapshot
repo-level fresh verification 기준:
- `services/analysis-agent` full suite: **319 passed**
- `services/build-agent` full suite: **235 passed**

추가 focused verification들도 계속 green 유지 중.

## known remaining gap
- live runtime smoke는 아직 별도다.
- 현재 localhost runtime 서비스가 떠 있지 않은 시점에서는 repo-level green만 확인된 상태다.
- 프로젝트 규칙상 S3는 명시적 허가 없이 서비스 기동 스크립트를 실행하지 않았다.

## Bottom line
S2 관점에서 지금 필요한 행동은:
- **새 S3 public contract를 따라잡는 것 아님**
- 기존 canonical S3 contract를 계속 기준으로 삼고,
- 필요하면 S2 자신의 orchestration continuation/recovery slice를 이어가면 된다.

새 outward delta가 생기면 S3가 별도 WR로 다시 고지하겠다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
