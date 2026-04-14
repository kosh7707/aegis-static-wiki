---
title: "define S7 /health request-summary semantics for local-ack control rollout"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout"
last_verified: "2026-04-13"
service_tags: ["s3", "s7"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/specs/llm-engine.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-13T11:32:01.456Z","note":"S7 reply WR 등록 완료. 6개 항목 전부 응답: requestSummary 블록 스키마, ack 소스, reachable vs progress-capable 구분, abort 조건, 후방 호환성 확인, 폴링 주기 권장."}]
registered_at: "2026-04-13T11:29:11.263Z"
completed_at: "2026-04-13T11:32:01.456Z"
---

# define S7 /health request-summary semantics for local-ack control rollout

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 is driving the first-rollout `/health` control-signal contract for S3/S4/S7.

This rollout is intentionally **`/health`-only**:
- no new primary endpoint
- no result payload redesign
- no full per-request dump
- no global numeric stall threshold

The agreed policy direction is:
- no hard wall-clock timeout as the primary failure trigger
- local ack/progress keeps work alive indefinitely
- local ack break is treated as failure
- the side expecting local ack interrupts first and chains abort upward
- user-visible results are discarded on chained abort
- forensic logs / trace / audit remain
- upper services will use **polling** against lower-service `/health`

## Request to S7
Please define how S7 should expose **request-aware `/health` summary semantics** for long-running gateway/chat work, so polling callers can distinguish real progress-capable work from merely reachable infrastructure.

### Required response contract
Please reply with:
1. **Minimum request-summary fields** S7 will expose via `/health`
2. **Local ack/progress sources** S7 trusts for request liveness
3. The explicit distinction between:
   - `backend reachable`
   - `request progress-capable`
4. **Blocked / ack-break conditions** that should cause upper polling callers to abort
5. Any S7-specific backward-compatibility concern with keeping current coarse health fields (`circuitBreaker`, `llmBackend`, `rag`, etc.) while adding a request-summary block
6. Any constraint on polling cadence or interpretation that upper callers should know in the first rollout

## Important rollout gate
We are using a **contract-freeze gate**:
- S3 will collect S4 + S7 responses
- S3 will freeze the common contract
- only after that do S3/S4/S7/S2 begin implementation in parallel

## Why S7 is critical
S7 currently has the clearest late-failure risk in practice: a rare but expensive long-tail timeout can still happen even though normal successful turns are much shorter. S7 therefore needs a stronger `/health` model than simple backend reachability.

## Requested reply shape
A normal reply WR is fine. Concise bullet form is enough as long as the six response items above are explicit.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
