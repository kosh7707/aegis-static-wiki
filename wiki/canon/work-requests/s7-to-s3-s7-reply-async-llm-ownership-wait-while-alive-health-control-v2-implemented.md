---
title: "S7 reply — async LLM ownership wait-while-alive health-control v2 implemented"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-reply-async-llm-ownership-wait-while-alive-health-control-v2-implemented"
last_verified: "2026-05-08"
service_tags: ["s7", "s3", "llm-gateway", "timeout-policy", "async-ownership", "health-control-v2"]
decision_tags: ["health-control-v2", "elapsed-time-not-abort", "ack-liveness", "async-ownership"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s7-implement-wait-while-alive-async-llm-ownership-per-health-control-v2.md", "wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/session-omx-1778205195183-z7dmmz.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-reply-async-llm-ownership-wait-while-alive-health-control-v2-implemented"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T02:50:09.116Z","note":"S3 문서 검토 only로 S7 reply를 소비함. 확인 범위: canonical reply WR, S7 LLM Gateway API 문서, S7 session evidence. S7 문서는 /v1/chat finite compatibility 유지, /v1/async-chat-requests long-running ownership surface, queued/running + phase-advancing|transport-only continue semantics, explicit terminal abort states, active lease refresh, result retention을 반영한다. 기록된 증거: targeted 59 passed, full S7 suite 301 passed, wiki validation 8 passed, Critic APPROVE. 코드 재검증은 요청 범위 밖이라 수행하지 않음."}]
registered_at: "2026-05-08T02:39:23.397Z"
completed_at: "2026-05-08T02:50:09.116Z"
---

# S7 reply — async LLM ownership wait-while-alive health-control v2 implemented

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S7 reply — async LLM ownership wait-while-alive health-control v2 implemented

## Summary
- Kind: reply
- From: S7
- To: S3
- Date: 2026-05-08

S7 implemented the S7-owned producer side of the health-control v2 async LLM ownership contract.

## Implemented

- `/v1/chat` remains the finite synchronous compatibility surface with `X-Timeout-Seconds` default/max 1800s.
- `/v1/async-chat-requests` is now documented and implemented as the production long-running LLM ownership surface.
- Async backend POST no longer imposes a fixed elapsed read ceiling; S7 keeps finite connect/write/pool transport bounds but uses unbounded backend read while the non-streaming backend attempt remains live.
- Active async records refresh `expiresAt` while `queued`/`running`, so active ownership lease age does not become an abort signal.
- Long non-streaming inference continues to report `running + transport-only` when S7 owns a live attempt but cannot prove token-level progress.
- True terminal conditions remain explicit: backend/connect/transport/circuit/backend HTTP failures, parser/strict-json/response-contract breaks, cancel, and terminal expiry all surface with state/detail/`blockedReason` as applicable.
- Result retrieval remains available after long completion within terminal retention semantics.

## Verification

Recorded in `wiki/canon/handoff/s7/session-omx-1778205195183-z7dmmz.md`.

- Targeted S7 async/API contract tests: `59 passed in 0.89s`.
- Full S7 llm-gateway suite: `301 passed in 6.38s`.
- `git diff --check` clean for S7 code and edited wiki docs.
- Wiki validation: `npm test` → `8 passed`.
- Critic reviewed the plan and implementation evidence and returned APPROVE.

## S3 guidance

S3 can now update its consumer poller for the S7 async LLM path: continue on `queued`/`running` with `localAckState=phase-advancing|transport-only` and no `blockedReason`; abort on `failed`, `cancelled`, `expired`, `localAckState=ack-break`, non-null `blockedReason`, explicit cancel, or unrecoverable ownership loss.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
