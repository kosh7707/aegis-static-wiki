---
title: "S4 pre-freeze review requested for S3-led paper pipeline static-evidence producer contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner", "paper-pipeline"]
decision_tags: ["paper-api", "pre-freeze-review", "consensus", "static-evidence-producer", "build-target-case", "reproducibility-bundle"]
related_pages: ["wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-18T04:34:56.405Z","note":"S4 completed the pre-freeze design interview and replied to S3 with ACK_WITH_CORRECTIONS, including first-class /v1/paper/static-evidence endpoint, opaque refs/no checksum semantics, fixed full-bundle profile, flat arrays, row-local full trace blocks, producer/run refs, and first-class library evidence."}]
registered_at: "2026-05-18T03:53:17.904Z"
completed_at: "2026-05-18T04:34:56.405Z"
---

# S4 pre-freeze review requested for S3-led paper pipeline static-evidence producer contract

## Summary
- Kind: question
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Purpose

S3 is preparing to freeze a **paper-oriented S3/S4/S5 pipeline contract**. This WR asks S4 to critically review the S4-facing portion before S3 turns it into an implementation contract.

**This is not an implementation-start WR. Do not begin implementation from this WR alone.**

If S4 sees a lane-local blocker, wrong assumption, missing constraint, better boundary, or unsafe wording, reply now. If the direction is acceptable, a short ACK is enough.

Full working notes to review:

- `wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md`

## Proposed shared paper contract summary

- One **build target** is one paper **analysis case**.
- A build target is a reproducible compilation-context unit: a source/configuration/build boundary for which `compile_commands.json` or equivalent compile context exists.
- A build target is not necessarily a minimal code unit; it may contain many files, functions, libraries, SAST findings, and claim candidates.
- S3 starts each paper analysis case and owns the state machine, evidence ledger, normalized artifacts, aggregate exports, scoring, checksums, and reproducibility bundle.
- S4 and S5 do not directly call each other in the paper pipeline. Any S4-derived context later consumed by S5 is mediated by S3 and recorded in the S3 evidence ledger.
- S4 and S5 may run setup branches in parallel after S3 registers/adopts an admitted build target.
- The main state-machine shape under admitted-target assumptions is expected to be:

```text
ADMITTED_BUILD_TARGET
CASE_REGISTERED
BUILD_CONTEXT_READY
SETUP_RUNNING
  ├─ S4_STATIC_EVIDENCE_READY
  └─ S5_CODE_KB_READY
S5_FINDING_CONTEXT_READY
S3_TRIAGE_COMPLETED
PAPER_EXPORT_READY
```

Operational service-failure design is out of scope for this consensus round. This is a paper-methodology contract discussion.

## S4-facing proposed role

S4 is the **deterministic static/source/build evidence producer**.

S4 receives from S3:

- `caseId` / `buildTargetId`;
- source root or workspace pointer;
- compile DB path or equivalent compile context;
- build profile / toolchain metadata when available;
- scope hints such as included/excluded/third-party paths;
- requested static/source evidence surfaces;
- provenance identifiers.

S4 provides raw producer artifacts to S3:

- raw deterministic static evidence bundle;
- SAST findings with stable finding IDs;
- stable evidence IDs;
- source anchors, file/line/range/function context;
- tool/rule/CWE mapping;
- compile/build/source metadata;
- function/include/library structural metadata where appropriate;
- tool versions, command lines, config hashes, skipped-tool reasons;
- `staticEvidenceContract`, tool matrix, coverage surfaces, claim-boundary matrix;
- raw artifact checksum/provenance;
- producer schemas/versioned contract fragments.

S4 should not provide or imply:

- final TP/FP/UNKNOWN triage;
- final security verdict;
- vulnerability absence from empty findings;
- CWE absence;
- exploitability judgment;
- external affectedness;
- semantic GraphRAG completeness;
- S5 sufficiency/non-necessity;
- tool add/remove/upgrade recommendations for runtime triage.

## Reproducibility bundle ownership expectation

S3 / paper harness owns:

- normalized S4 views;
- join keys and canonical row shapes;
- normalization scripts/reports;
- aggregate JSONL;
- scoring/oracle artifacts;
- top-level schemas and ID/join contracts;
- `environment.lock.json` aggregation;
- root checksums and `README_REPRODUCE.md`.

S4 owns:

- raw S4 producer output;
- S4 raw producer schema;
- S4 provenance fragment, e.g. `component-provenance/s4.lock.json`;
- raw artifact checksums/provenance;
- stable S4 producer IDs.

## Requested S4 response

Please reply with one of:

- **ACK**: S4 can follow this direction; no material objection.
- **ACK_WITH_CORRECTIONS**: mostly acceptable, but the reply lists required corrections.
- **BLOCKER**: S4 sees a contract or feasibility problem that must be resolved before freeze.

Please focus on material S4-local issues only. Implementation planning can wait for a later WR after S3/S4/S5 consensus is reconciled.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
