---
title: "S3 now depends on S7 strict JSON behavior for deep-analyze structured finalizer"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-now-depends-on-s7-strict-json-behavior-for-deep-analyze-structured-finalizer"
last_verified: "2026-04-21"
service_tags: ["s3", "s7", "analysis-agent", "llm-gateway"]
decision_tags: ["structured-output", "strict-json", "api-contract"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-now-depends-on-s7-strict-json-behavior-for-deep-analyze-structured-finalizer"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-21T06:51:46.913Z","note":"S7 recipient-side handling complete: reviewed S3 notice on strict JSON dependency; verified current S7 code preserves X-AEGIS-Strict-JSON/request response_format controls, fail-closed 502 behavior for invalid strict JSON, reasoning scrub/content normalization, requestId propagation, and async ownership strict-json path. Focused verification passed: cd services/llm-gateway && .venv/bin/python3 -m pytest -q tests/test_contract_endpoints.py tests/test_async_chat_manager.py tests/test_contract_input_validation.py => 47 passed."}]
registered_at: "2026-04-21T06:40:20.589Z"
completed_at: "2026-04-21T06:51:46.913Z"
---

# S3 now depends on S7 strict JSON behavior for deep-analyze structured finalizer

## Summary
- Kind: notice
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# WR/Notice: S3 structured finalizer depends on S7 strict JSON mode

## Context
S3 updated Analysis Agent structured-output handling on 2026-04-21. Repeated non-JSON `deep-analyze` final content is no longer silently converted into a completed deterministic fallback.

New S3 path:
1. normal agent loop final content
2. one structured retry if final content is non-JSON
3. if still non-JSON, a separate strict structured finalizer call with tools disabled
4. validation through S3 `ResultAssembler` / schema / evidence validators
5. failure if finalizer still does not produce valid Assessment JSON

## S7 dependency
The finalizer call uses the existing S3 `LlmCaller` tool-less path, which sets strict JSON request semantics (`response_format={"type":"json_object"}` / `X-AEGIS-Strict-JSON`) and prefers S7 async ownership when available.

## Request / awareness
Please keep S7 strict JSON behavior stable for tool-less `/v1/chat` and async ownership result retrieval. In particular:
- Do not downgrade/ignore `response_format=json_object` or `X-AEGIS-Strict-JSON` on finalizer-style requests.
- If strict JSON cannot be honored, prefer explicit retryable failure over HTTP 200 natural-language content.
- Preserve requestId propagation so S3 can trace structured finalizer calls.

## Compatibility
No new S7 endpoint is required by this S3 change. This is a dependency notice on existing strict JSON semantics.

## S3 verification
- Full analysis-agent suite: 332 passed.
- Focused AgentLoop/generate-poc tests: 28 passed.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
