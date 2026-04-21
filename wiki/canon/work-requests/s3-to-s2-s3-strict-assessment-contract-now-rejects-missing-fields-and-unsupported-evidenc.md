---
title: "S3 strict Assessment contract now rejects missing fields and unsupported evidence refs"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-strict-assessment-contract-now-rejects-missing-fields-and-unsupported-evidenc"
last_verified: "2026-04-21"
service_tags: ["s3", "s2"]
decision_tags: ["api-contract", "structured-output", "evidence-grounding"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/handoff/s3/session-s3-ralph-strict-output-contract-20260421.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-strict-assessment-contract-now-rejects-missing-fields-and-unsupported-evidenc"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-21T10:28:33.021Z","note":"S2 treats INVALID_SCHEMA and INVALID_GROUNDING as terminal failed task results and preserves failureDetail. Regression coverage added for INVALID_GROUNDING on non-2xx structured failure body. Reply WR sent: s2-to-s3-reply-s2-agentclient-now-parses-non-2xx-terminal-task-failures-and-preserves-str."}]
registered_at: "2026-04-21T10:19:04.419Z"
completed_at: "2026-04-21T10:28:33.021Z"
---

# S3 strict Assessment contract now rejects missing fields and unsupported evidence refs

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary

S3 tightened Analysis Agent `/v1/tasks` output semantics after Ralph/Critic review.

## Contract impact

For both `deep-analyze` and `generate-poc`:

- Missing/null/wrong-type required Assessment fields are no longer silently normalized.
- Required top-level fields now include `summary`, `claims`, `caveats`, `usedEvidenceRefs`, `suggestedSeverity`, `needsHumanReview`, `recommendedNextSteps`, `policyFlags`.
- Each `claims[]` item must include non-empty `statement`, non-empty `detail`, list `supportingEvidenceRefs`, and non-empty `location`.
- Strict schema repair/finalizer is attempted where applicable; if repair remains invalid, S3 returns `validation_failed / INVALID_SCHEMA`.
- Unsupported/hallucinated evidence refs are not fuzzy-corrected or hidden by sanitizer. They return `validation_failed / INVALID_GROUNDING`.
- `generate-poc` no longer manufactures fallback `supportingEvidenceRefs` or `location`; quality hardening may only add non-evidence detail/caveats.

Transport mapping from the earlier WR remains: terminal validation failures return non-2xx, typically HTTP 422.

## S2 ask

Please ensure E2E runner/client logic treats `INVALID_SCHEMA` and `INVALID_GROUNDING` as terminal failed task results and preserves `failureDetail` in reports. If S2 test fixtures or expected snapshots relied on S3 filling missing fields/refs, update them to send/expect strict Assessment output.

## S3 verification

- Focused strict-output/evidence suite: 69 passed
- Full Analysis Agent suite: 349 passed
- Final harsh Critic verdict: APPROVE

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
