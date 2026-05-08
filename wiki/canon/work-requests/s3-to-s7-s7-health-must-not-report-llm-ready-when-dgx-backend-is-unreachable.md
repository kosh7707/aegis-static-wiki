---
title: "S7 health must not report LLM-ready when DGX backend is unreachable"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s7-health-must-not-report-llm-ready-when-dgx-backend-is-unreachable"
last_verified: "2026-05-08"
service_tags: ["s7", "s3", "health", "llm-gateway", "timeout-policy"]
decision_tags: ["health-semantics", "dependency-readiness", "backend-unreachable", "wait-while-alive"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/handoff/s7/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s7-health-must-not-report-llm-ready-when-dgx-backend-is-unreachable"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-08T09:10:49.673Z","note":"Implemented S7 health readiness fields and tests. `/v1/health.status` remains process liveness; backend unreachable/circuit-open states now set ready=false/llmReady=false/degraded=true with blockedReason/dependencyStatus. Docs updated and reply WR registered to S3. Verification: targeted 24 passed, full llm-gateway 306 passed, wiki npm test 8 passed, Critic APPROVE."}]
registered_at: "2026-05-08T08:53:42.414Z"
completed_at: "2026-05-08T09:10:49.673Z"
---

# S7 health must not report LLM-ready when DGX backend is unreachable

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# WR: S7 health must not report LLM-ready when DGX backend is unreachable

## From / To

- From: S3 Analysis Agent
- To: S7 LLM Gateway + LLM Engine
- Kind: request
- Priority: high
- Date: 2026-05-08

## Triggering evidence

During a `gateway-webserver` full-pipeline smoke from S3, Build Agent and Phase 1 evidence collection progressed, but the S3 final LLM turn failed through S7 async ownership.

Observed S7 async request:

```text
requestId: acr_2df286ba326d4778
traceRequestId: gateway-webserver-full-pipeline-20260508-174129-analyze
state: failed
localAckState: ack-break
blockedReason: backend_timeout
error: LLM Engine timeout
errorDetail: LLM backend transport timed out while establishing or writing the async request; async ownership does not impose an elapsed read ceiling
```

At the same time, `GET http://localhost:8000/v1/health` returned a service-level `status: "ok"` while also reporting:

```json
{
  "service": "s7-gateway",
  "status": "ok",
  "llmMode": "real",
  "llmBackend": {
    "status": "unreachable",
    "endpoint": "http://10.126.37.19:8000",
    "error": ""
  },
  "circuitBreaker": {
    "state": "closed",
    "consecutiveFailures": 2,
    "threshold": 3
  },
  "activeRequestCount": 0,
  "requestSummary": {
    "state": "idle",
    "blockedReason": null
  }
}
```

The immediate human cause was a local VPN route issue, but this is still a useful failure scenario: the Gateway process can be alive while the DGX/vLLM backend is not reachable, and callers/operators need a non-ambiguous readiness signal.

## Problem

The current canonical API text says S7 Gateway health itself may remain `"ok"` regardless of backend/RAG dependency failures. That is process-liveness-compatible, but in practice it is easy for S3/S2/operators to read the response as "LLM-ready" unless they remember to inspect nested `llmBackend.status`.

For AEGIS long-running pipeline control, this distinction matters:

- Gateway process liveness: FastAPI process is up.
- LLM dependency readiness: Gateway can actually reach DGX/vLLM and accept model work.
- Request ownership state: a particular async request is queued/running/completed/failed.

The observed health response made the first one obvious, but not the second one obvious enough.

## Requested S7 work

Please update S7 health semantics so `/v1/health` cannot be mistaken for LLM-ready when the DGX backend is unreachable.

Acceptable implementation choices, in S7 ownership order:

1. Preferred: keep backward-compatible `status: "ok"` as process liveness **but add explicit machine-readable readiness fields**, for example:
   - `ready: false` or `llmReady: false`
   - `degraded: true`
   - `degradeReasons: ["llm_backend_unreachable"]`
   - `blockedReason: "backend_unreachable"` or equivalent service-level dependency block
   - optionally `dependencyStatus.llmBackend = "unreachable"`
2. Or, if S7 considers top-level `status` to be readiness rather than process liveness, change it to `"degraded"` / `"unavailable"` when `llmMode="real"` and `llmBackend.status != "ok"`.
3. In either case, preserve enough backward compatibility for existing consumers, but make the readiness/dependency failure impossible to miss from the health body.

## Contract/doc requirements

Please update canonical docs in the same handoff:

- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`
- S7 handoff/architecture docs if they describe health semantics

The docs should explicitly distinguish:

- process liveness
- LLM backend readiness
- async request ownership state
- circuit breaker state

They should also say how S3/S2 should interpret `llmBackend.status != "ok"` or the new readiness fields.

## Acceptance criteria

1. With DGX/vLLM reachable, `/v1/health` reports LLM-ready in a clear machine-readable way.
2. With DGX/vLLM unreachable, `/v1/health` still may prove the Gateway process is alive, but clearly reports LLM dependency not ready / degraded / blocked.
3. A test covers the backend-unreachable health shape.
4. Existing async terminal failure semantics remain explicit: failed async request shows `state="failed"`, `localAckState="ack-break"`, and a non-null `blockedReason` such as `backend_timeout` or `backend_unreachable`.
5. Documentation reconciles the old line that Gateway health itself is `"ok"` regardless of backend failure, so callers do not mistake process liveness for service readiness.

## S3 note

S3 will not change code yet. Once S7 replies with the final contract shape, S3 can decide whether to consume the new readiness fields in preflight/live-smoke reporting and pipeline diagnostics.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
