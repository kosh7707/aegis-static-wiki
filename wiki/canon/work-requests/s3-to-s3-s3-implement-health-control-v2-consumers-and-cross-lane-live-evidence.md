---
title: "S3 implement health-control v2 consumers and cross-lane live evidence"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s3-s3-implement-health-control-v2-consumers-and-cross-lane-live-evidence"
last_verified: "2026-05-08"
service_tags: ["s3", "analysis-agent", "build-agent", "timeout-policy", "health-control-v2", "live-test"]
decision_tags: ["health-control-v2", "elapsed-time-not-abort", "ack-liveness", "s3-consumer", "cross-lane-evidence"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/api/sast-runner-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s3-s3-implement-health-control-v2-consumers-and-cross-lane-live-evidence"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T03:47:59.817Z","note":"S3 health-control v2 consumers implemented and verified. Removed fixed S7 async poll-deadline aborts from Analysis/Build LlmCaller and analysis eval runner; added S4 durable ownership consumers for SAST scan, Phase 1 build-and-analyze, and Build Agent try_build; added wait_while_alive ToolExecutor bypass; added Build Agent /v1/health activeRequestCount/requestSummary; preserved completed-envelope-vs-clean-success semantics. Verification: analysis full 585 passed, build full 388 passed, focused blocker suite 66 passed, compileall/diff-check PASS, Critic PASS. Canonical docs updated: analysis-agent API, build-agent API, build-agent spec, S3 handoff/session evidence."}]
registered_at: "2026-05-08T02:09:13.558Z"
completed_at: "2026-05-08T03:47:59.817Z"
---

# S3 implement health-control v2 consumers and cross-lane live evidence

## Summary
- Kind: request
- From: s3
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 registers its own bounded implementation/evidence work for `health-control-signal-rollout-v2.md`. This WR exists because the v2 spec creates required S3-owned consumer changes in both Analysis Agent and Build Agent.

## Routing
Canonical spec to read first:
- `wiki/canon/specs/health-control-signal-rollout-v2.md`

Related API/spec docs to update during implementation:
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/api/build-agent-api.md`
- `wiki/canon/specs/build-agent.md`
- and any S3 sections in S7/S4 API docs that become stale after producer implementation.

## Dependencies / sequencing
This WR should be implemented after S7 and S4 confirm the producer-side contracts needed by v2:
- S7 async ownership wait-while-alive behavior for long LLM generation.
- S4 build/scan/build-and-analyze health or ownership/result behavior for long compile/scan windows.

S3 may write mocked/failing tests before producer completion, but live pass evidence must wait for S7/S4 readiness.

## Required S3 implementation scope
1. Remove fixed async LLM poll-deadline abort from the S3 wait-while-alive path; keep short connect/status/result call timeouts and retry polling while owner state is alive/non-blocked.
2. Analysis Agent: convert SAST NDJSON inactivity timeout into a health-verification suspicion path before abort.
3. Analysis Agent: avoid relying only on blocking `/v1/build-and-analyze` transport timeout when S4 provides ownership/status/result or health-aware recovery.
4. Build Agent: add `/v1/health` requestSummary fields aligned with the v1/v2 glossary.
5. Build Agent: replace `try_build` finite blocking semantics with S4 build ownership/status/result or a documented health-aware wait-while-alive strategy.
6. Build Agent: ensure ToolExecutor or equivalent dispatch does not cut off a healthy long build at 120 seconds while S4 reports alive/non-blocked.
7. Preserve existing result semantics: completed envelope is not clean success; consumers must inspect `cleanPass`, `buildOutcome`, `analysisOutcome`, `qualityOutcome`, and `pocOutcome`.

## Documentation requirements
- Update S3 canonical API/spec docs when implementation changes land.
- Remove or clearly mark stale statements that imply current finite elapsed cutoffs are the target behavior.
- Link back to `health-control-signal-rollout-v2.md` from affected S3 docs.

## Cross-lane live evidence ownership
S3 owns the final cross-lane evidence packet after S7/S4/S3 implementation is ready. Evidence should include:
- a long-running S7 async LLM test beyond the former fixed poll deadline or a controlled accelerated equivalent proving age-only non-abort;
- a long-running S4 build/scan test showing S3 continues while S4 reports alive/non-blocked;
- Build Agent and Analysis Agent tests showing local finite cutoffs no longer terminate healthy downstream work;
- explicit ack-break/failed/blocked tests showing abort still chains correctly;
- wiki/session evidence references for the commands/logs.

## Acceptance expectations
- Unit/contract tests cover continue/abort interpreter logic.
- Live or accelerated integration tests prove long-but-alive completion instead of timeout.
- Canonical docs and WR completion notes no longer contradict the implemented behavior.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
