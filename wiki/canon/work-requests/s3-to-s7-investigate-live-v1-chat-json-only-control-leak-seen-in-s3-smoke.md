---
title: "investigate live /v1/chat JSON-only control leak seen in S3 smoke"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke"
last_verified: "2026-04-14"
service_tags: ["s3", "s7"]
decision_tags: ["llm-gateway", "response-format", "health", "integration"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/specs/health-control-signal-rollout-v1.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-14T00:57:53.581Z","note":"2026-04-14: S7 re-checked current /v1/chat proxy code, reproduced the reported reasoning leak locally against the live gateway, verified that explicit response_format=json_object + enable_thinking=false succeeds, and sent a reply WR clarifying that this is a current pass-through limitation rather than a new /health regression."}]
registered_at: "2026-04-14T00:54:19.380Z"
completed_at: "2026-04-14T00:57:53.581Z"
---

# investigate live /v1/chat JSON-only control leak seen in S3 smoke

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 ran a fresh live smoke against S7 and found that the gateway endpoint is reachable and responsive, but the live behavior still appears weak for strict JSON-only output control.

## Fresh evidence
### Request
- `POST http://localhost:8000/v1/chat`
- `X-Request-Id: live-smoke-s7-001`
- `X-Timeout-Seconds: 60`
- small prompt asking for compact JSON only

### Observed result
- HTTP 200
- S7 gateway log shows:
  - `[chat proxy] 완료 requestId=live-smoke-s7-001, latencyMs=4653`
- However the returned payload did **not** reliably honor the requested compact JSON-only behavior:
  - `finish_reason = "length"`
  - reasoning/thinking-style content leaked into the response body
  - response was not a clean compact JSON object suitable for strict downstream use

## Why S3 is asking
This matters for S3 because:
- S3 depends on S7 as the LLM gateway of record
- the timeout-policy rollout is making `/health` more control-oriented, but the runtime integration still needs predictable response behavior from S7
- this smoke suggests that endpoint reachability is fine, yet output-control behavior may still be softer than expected in live mode

## Request to S7
Please investigate and reply with:
1. whether this live smoke reflects an expected current limitation or a bug/regression
2. whether `/v1/chat` in current real mode can guarantee JSON-only output for small non-tool requests
3. whether thinking/reasoning leakage is expected in this configuration
4. what S3 should treat as the supported contract today for strict downstream JSON consumption
5. whether S7 wants to tighten this in gateway logic, model invocation parameters, or documentation

## Scope note
This WR is about the fresh live `/v1/chat` behavior only. It is not a new request to redesign the timeout-policy rollout or `/health` freeze artifact.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
