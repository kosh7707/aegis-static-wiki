---
title: "S5 pre-freeze review requested for S3-led paper pipeline Code KB and retrieval producer contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p"
last_verified: "2026-05-19"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "paper-pipeline", "source-code-kg"]
decision_tags: ["paper-api", "pre-freeze-review", "consensus", "code-kb", "threat-kb", "retrieval-evidence", "reproducibility-bundle"]
related_pages: ["wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/work-requests/s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-19T02:03:22.235Z","note":"S5 replied with ACK_WITH_CORRECTIONS after Critic PASS_WITH_CHANGES validation. Reply registered at wiki/canon/work-requests/s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce.md."}]
registered_at: "2026-05-18T03:53:45.299Z"
completed_at: "2026-05-19T02:03:22.235Z"
---

# S5 pre-freeze review requested for S3-led paper pipeline Code KB and retrieval producer contract

## Summary
- Kind: question
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Purpose

S3 is preparing to freeze a **paper-oriented S3/S4/S5 pipeline contract**. This WR asks S5 to critically review the S5-facing portion before S3 turns it into an implementation contract.

**This is not an implementation-start WR. Do not begin implementation from this WR alone.**

If S5 sees a lane-local blocker, wrong assumption, missing constraint, better boundary, or unsafe wording, reply now. If the direction is acceptable, a short ACK is enough.

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

## S5-facing proposed role

S5 is the **contextual knowledge / Code KB / retrieval evidence producer**.

Important boundary:

- S5's **Threat KB** and target-scoped **Code KB / Source Code KG** are separate layers.
- Threat KB is a target-independent knowledge layer.
- When S3 gives S5 a build target path/context, S5's setup responsibility is to form or validate the target-scoped Code KB / Source Code KG retrieval substrate for that target's internal source files.
- S5 does not build a new per-target Threat KB.

S5 receives from S3:

- `caseId` / `buildTargetId`;
- build target source path or source context pointer;
- target metadata and experiment provenance;
- after S4 evidence is available: S4 finding IDs, source anchors, CWE/rule IDs, tool messages, library identities, symbols/functions, and S3 query intents.

S5 provides raw producer artifacts to S3:

- target Code KB readiness/summary;
- Source Code KG / code retrieval readiness diagnostics;
- finding-level context bundles;
- Threat KB / CVE / library context where requested;
- retrieval traces with query, normalized query, corpus/index versions, hit IDs, scores, selected snippets, discarded-hit reasons;
- no-hit / partial / timeout / ambiguous / input-insufficient / error separation;
- stable knowledge evidence IDs;
- raw artifact checksum/provenance;
- producer schemas/versioned contract fragments.

S5 should not provide or imply:

- final TP/FP/UNKNOWN triage;
- final source-level vulnerability verdict;
- SAST execution or compile-context generation;
- `KB no-hit = safe`;
- `KB hit = vulnerable`;
- S4 structural/static evidence replacement;
- S3 claim-boundary enforcement replacement.

## Reproducibility bundle ownership expectation

S3 / paper harness owns:

- normalized S5 views;
- join keys and canonical row shapes;
- normalization scripts/reports;
- aggregate JSONL;
- scoring/oracle artifacts;
- top-level schemas and ID/join contracts;
- `environment.lock.json` aggregation;
- root checksums and `README_REPRODUCE.md`.

S5 owns:

- raw S5 producer output;
- S5 raw producer schemas;
- S5 provenance fragment, e.g. `component-provenance/s5.lock.json`;
- raw artifact checksums/provenance;
- stable S5 producer IDs;
- Threat KB corpus/index version and Code KB/Source Code KG index/provenance fragments.

## Requested S5 response

Please reply with one of:

- **ACK**: S5 can follow this direction; no material objection.
- **ACK_WITH_CORRECTIONS**: mostly acceptable, but the reply lists required corrections.
- **BLOCKER**: S5 sees a contract or feasibility problem that must be resolved before freeze.

Please focus on material S5-local issues only. Implementation planning can wait for a later WR after S3/S4/S5 consensus is reconciled.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
