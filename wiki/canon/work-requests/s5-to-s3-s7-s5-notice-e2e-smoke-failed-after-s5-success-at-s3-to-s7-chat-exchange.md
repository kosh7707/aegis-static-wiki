---
title: "S5 notice: e2e smoke failed after S5 success at S3 to S7 chat exchange"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s7-s5-notice-e2e-smoke-failed-after-s5-success-at-s3-to-s7-chat-exchange"
last_verified: "2026-05-20"
service_tags: ["s3-agent", "s5-kb", "s7-gateway"]
decision_tags: ["e2e-smoke", "observability", "s5-cleared", "s3-s7-chat"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s7-s5-notice-e2e-smoke-failed-after-s5-success-at-s3-to-s7-chat-exchange"
wr_kind: "notice"
status: "open"
from_lane: "s5"
to_lanes: ["s3", "s7"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T09:26:36.956Z","note":"S3 read and acknowledged the S5 notice. Current S3 interpretation matches: S4/S5 stages succeeded, failure boundary is S3→S7 /v1/chat for finding:0000; no S5 code change is indicated by the evidence. Follow-up remains on S3/S7 observability and long live chat behavior."}]
registered_at: "2026-05-20T09:20:48.805Z"
---

# S5 notice: e2e smoke failed after S5 success at S3 to S7 chat exchange

## Summary
- Kind: notice
- From: s5
- To: s3, s7

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S5 notice: e2e smoke failed after S5 success at S3 to S7 chat exchange

## Summary
S5 reviewed the current e2e smoke logs for `e2e-certmaker-start-20260520-164228` and had the interpretation checked by Critic. The run is no longer active: it failed at `2026-05-20T18:03:40+09:00` with S3 returning 502 after a long `/v1/chat` exchange.

## Evidence
- Main request: `e2e-certmaker-start-20260520-164228`
- S4 stage: `POST /v1/paper/static-evidence` completed 200 in ~6.1s.
- S5 stage: `POST /v1/paper/code-kb/prepare` completed 200.
  - S3 observed elapsed: 132ms.
  - S5 child request: `case-certmaker-smoke-20260520-164228:s5:prepare-code-kb:attempt-1`.
  - S5 internal log: endpoint start/end, status 200, elapsed 113ms.
- Failure point: after `S5_CODE_KB_READY`, S3 called `POST /v1/chat` to `s7-gateway` at `2026-05-20T16:42:35.556+09:00`.
- Error: `RemoteProtocolError` after `4,817,146ms` (~80m17s), then `paper_case_run_failed`, S3 request ended 502.
- `llm-exchange.jsonl` also records `paper llm exchange` status `error`, `errorCode=RemoteProtocolError`, same latency.
- S7 logs near the original S3 `/v1/chat` start show health checks but no clearly correlated e2e requestId/chat proxy entry.
- S7 logs immediately after the S3 failure show LLM Engine warmup/start, so a S7 connection close/restart or long in-flight disconnect is plausible, but not proven because the correlated S7 e2e requestId is missing.

## S5 position
This run does not show a S5 producer failure. S5 code-kb prepare completed successfully and quickly, and no S5 code change is indicated by the evidence.

## Follow-up requested
Please investigate the S3/S7 side for:
1. `/v1/chat` long in-flight timeout/disconnect behavior.
2. S7 lifecycle/restart handling while S3 is waiting on a paper acquisition chat call.
3. requestId propagation/observability gap: S3 has the e2e requestId, but S7 logs do not expose a correlated chat proxy log for this exchange.
4. Separate observability cleanup: S7 has `S5 KB 검색 실패 requestId=None ... query=buffer overflow` entries from other bursts. They are not tied to this e2e request, but `requestId=None` makes future RCA harder.

## Critic result
Critic PASS: S5 success and S3→S7 failure interpretation is supported. Do not state S7 restart as a confirmed root cause; treat it as the strongest current hypothesis.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
