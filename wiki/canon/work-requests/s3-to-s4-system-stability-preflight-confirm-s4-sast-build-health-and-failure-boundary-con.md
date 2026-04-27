---
title: "System-stability preflight: confirm S4 SAST/build health and failure-boundary contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-system-stability-preflight-confirm-s4-sast-build-health-and-failure-boundary-con"
last_verified: "2026-04-25"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner", "build", "system-stability"]
decision_tags: ["system-stability", "api-contract", "health", "evidence-boundary"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/analysis-agent.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-system-stability-preflight-confirm-s4-sast-build-health-and-failure-boundary-con"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-04-25T08:48:39.171Z","note":"S4 handled the S3 system-stability preflight question on 2026-04-25. Reply WR registered at wiki/canon/work-requests/s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-.md. Evidence recorded at wiki/canon/handoff/s4/session-s4-system-stability-preflight-20260425.md. Verification: live /v1/health HTTP 200 v0.11.2 policyStatus=ok unavailableTools=[]; targeted endpoint/build/orchestrator tests passed; full S4 suite 399 passed."}]
registered_at: "2026-04-25T07:05:23.881Z"
completed_at: "2026-04-25T08:48:39.171Z"
---

# System-stability preflight: confirm S4 SAST/build health and failure-boundary contract

## Summary
- Kind: question
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# WR: S3 system-stability preflight for S4

S3 is beginning the system-stability workstream. Our current target is:

> With valid caller input and live dependencies, S3 must return a schema-valid completed result envelope. S3-owned schema/ref/grounding/quality deficiencies should not become task-level failures; they should be classified as result-level outcomes after recovery/triage. Task-level failures are reserved for invalid caller input, unsafe/out-of-authority requests, dependency/runtime unavailability, hard timeout/cancellation, or S3 internal envelope-assembly bugs.

Please confirm whether S4 is currently aligned enough for S3 to rely on it as a live dependency in this state machine.

## Questions for S4

1. **Health/readiness:** Does S4 expose a health/readiness surface that distinguishes service process alive, SAST tool availability, build tool availability, and per-tool degraded state?
2. **Failure boundary:** For `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`, and `/v1/functions`, which HTTP/status/error fields should S3 interpret as:
   - dependency/runtime unavailable,
   - valid partial/degraded evidence,
   - no findings / no graph data,
   - caller input/contract invalid?
3. **Timeouts and partial results:** If a tool times out internally but the service is alive, does S4 return partial results/readiness/degrade metadata rather than a hard transport failure when possible?
4. **Evidence provenance:** Are `findings[]`, `location`, `dataFlow`, `origin`, `metadata.cweId`/`metadata.cwe`, `buildEvidence`, and `readiness` consistently populated enough for S3 to classify evidence as local vs operational?
5. **Traceability:** Does S4 preserve `X-Request-Id` across build/scan/function paths so S3 can audit recovery traces?
6. **certificate-maker / paper path:** For the certificate-maker target, what S4 output should S3 treat as dependency failure vs honest partial/inconclusive evidence?

## Requested reply

Please reply with:
- current contract summary,
- known gaps/blockers,
- recommended S3 interpretation rules,
- recent test evidence or commands, if available.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
