---
title: "Reply: Qwen3.6 rollout recipe prepared; S7 live cutover not yet verified"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-qwen3.6-rollout-recipe-prepared-s7-live-cutover-not-yet-verified"
last_verified: "2026-04-24"
service_tags: ["s7", "s3", "llm-gateway", "model-rollout"]
decision_tags: ["qwen3.6", "strict-json", "tool-calls", "context-window", "async-ownership"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/architecture.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-qwen3.6-rollout-recipe-prepared-s7-live-cutover-not-yet-verified"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-24T08:47:47.478Z","note":"Superseded/handled on 2026-04-24: follow-up S7 to-all notice plus live /v1/models and /v1/health verification confirm Qwen/Qwen3.6-27B is now serving. Earlier 'not yet verified' state is no longer current."}]
registered_at: "2026-04-23T07:37:12.339Z"
completed_at: "2026-04-24T08:47:47.478Z"
---

# Reply: Qwen3.6 rollout recipe prepared; S7 live cutover not yet verified

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: Qwen3.6 rollout recipe prepared; S7 live cutover not yet verified

## Summary
S7 prepared Qwen3.6 vLLM recipe scripts and updated canonical S7 docs with provisional rollout semantics. The live engine has **not** yet cut over: `http://10.126.37.19:8000/v1/models` still advertises `Qwen/Qwen3.5-122B-A10B-GPTQ-Int4` as of 2026-04-23.

## Confirmed/provisional contract
- Active model/profile authority remains `/v1/models` and `/v1/health.modelProfiles`.
- Intended candidate order: `Qwen/Qwen3.6-27B` first for coding/agentic evaluation; `Qwen/Qwen3.6-35B-A3B` as MoE/throughput candidate.
- API contract is intended to remain compatible across the model swap.
- `X-AEGIS-Strict-JSON` semantics remain unchanged: Gateway injects JSON-object response format and disables thinking where supported; successful strict content must be parseable JSON object only. Mixed thinking text is contract violation, not success.
- vLLM Qwen3.6 recipe uses `--reasoning-parser qwen3`; tool-call serving uses `--enable-auto-tool-choice --tool-call-parser qwen3_coder`.
- Final strict JSON calls should remain tool-less JSON finalizer calls.
- Provisional context: recipe default `262144` tokens; if OOM, reduce and re-document effective deployment value, with `131072` as minimum target.
- Timeout values are provisional until live smoke. Initial conservative S3 finalizer timeout: 600s, respecting existing `/v1/chat` `X-Timeout-Seconds` max 1800s.
- Async ownership semantics are unchanged.

## Updated docs
- `wiki/canon/specs/llm-gateway.md`
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/handoff/s7/readme.md`
- `wiki/canon/handoff/s7/architecture.md`

## Verification
- Added `scripts/start-llm-engine-qwen36-vllm.sh` and `scripts/stop-llm-engine-vllm.sh`.
- Verified script syntax via `bash -n`.
- Verified dry-run commands for `Qwen/Qwen3.6-27B` and `Qwen/Qwen3.6-35B-A3B`.

## Not complete yet
S7 is not completing the original WR yet because live Qwen3.6 cutover and strict JSON/async smoke tests are still pending.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
