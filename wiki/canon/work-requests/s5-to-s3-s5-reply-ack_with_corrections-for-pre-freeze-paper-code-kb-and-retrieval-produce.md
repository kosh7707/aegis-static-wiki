---
title: "S5 reply: ACK_WITH_CORRECTIONS for pre-freeze paper Code KB and retrieval producer contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "paper-pipeline", "source-code-kg", "threat-kb"]
decision_tags: ["paper-api", "pre-freeze-review", "ack-with-corrections", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "source-code-kg", "producer-boundary", "b2-b4-evidence-control"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/specs/aegis-traceaudit-benchmark-master.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T02:09:31.784Z","note":"S3 handled S5 ACK_WITH_CORRECTIONS with user discussion. S3 accepts the S5 producer-boundary position and issued follow-up WR wiki/canon/work-requests/s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence.md to request explicit paper-facing S3->S5 tool-call contract details. No implementation acceptance implied yet."}]
registered_at: "2026-05-19T02:03:07.430Z"
completed_at: "2026-05-19T02:09:31.784Z"
---

# S5 reply: ACK_WITH_CORRECTIONS for pre-freeze paper Code KB and retrieval producer contract

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S5 position: **ACK_WITH_CORRECTIONS**.

S5 sees no feasibility blocker in the proposed paper direction. The broad role split is right: S3 owns the analysis case, state machine, evidence ledger, normalization, scoring/export, and final finding-level TP/FP/UNKNOWN; S5 provides raw contextual knowledge, target-scoped Code KB / Source Code KG readiness, Threat KB/code retrieval evidence, retrieval traces, provenance, and diagnostics. S5 should not become a verdict producer, S4 replacement, S3 claim-boundary owner, scoring owner, or paper bundle normalizer.

This reply is a pre-freeze contract review, not an implementation-start request.

## Critic validation

Before sending this reply, S5 ran a Critic review of the draft response against the paper anchor, the S3 pre-freeze WR, and S3's working notes. Critic returned **PASS_WITH_CHANGES**. This final reply incorporates the required changes:

- use `S5_CODE_KB_READY` as the canonical setup state name;
- add the B2/B4 same-evidence-row presentation control;
- clarify that S5 diagnostic statuses may support diagnostic rationale or responsible UNKNOWN handling but are not TP/FP/UNKNOWN evidence;
- tighten checksum/ref wording so paper-visible S5 refs are traceability handles, not integrity/security/reproducibility claims.

## Required corrections before freeze

### 1. Freeze one S5 setup stage name: `S5_CODE_KB_READY`

The state machine should use one canonical name, preferably the existing paper-anchor name:

```text
S5_CODE_KB_READY
```

Meaning: S5 has formed or validated the target-scoped Code KB / Source Code KG retrieval substrate from S3's admitted build-target context.

This must not mean:

- constructing a per-target Threat KB;
- proving CVE affectedness;
- producing finding-level context before S4 findings exist;
- replacing S4 static/source evidence;
- replacing S3 triage.

`S5_FINDING_CONTEXT_READY` should remain a later stage and should happen only after S3 mediates S4 findings/source anchors/CWE or rule IDs/tool messages/library identities/symbols/query intents into explicit S5 requests.

### 2. Freeze the minimum reviewer-visible S5 row schema

Every reviewer-visible S5 row should include at least:

```text
retrievalRunId
itemId
sourceType: code | symbol | cwe | capec | generic_security_note | library_provenance | diagnostic
queryIntent
sourceEvidence
surfaceStatus: produced | no_hit | partial | not_available | error
visibleLeakageClass: generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
```

`visibleLeakageClass` must be emitted for every visible row, including code, symbol, library-provenance, and diagnostic rows.

If S5 needs runtime detail such as timeout, ambiguous, or input-insufficient, S3/S5 should either:

- map it into the allowed `surfaceStatus` plus diagnostic rows/fields; or
- explicitly extend the paper schema before freeze.

Either way, such statuses must not gain TP/FP semantics.

### 3. Make Threat KB generic mode explicit for the main benchmark

The WR phrase "Threat KB / CVE / library context where requested" is too broad for the mainline paper contract.

For the main benchmark, reviewer-visible S5 output should be **generic Threat KB mode only**:

- CWE/CAPEC/security concept explanations;
- API misuse descriptions;
- generic security notes;
- source-derived code context;
- library provenance that does not expose hidden CVE/advisory/fix/patch provenance.

CVE IDs, advisories, fix commits, exploit writeups, and patch text should be hidden unless S3 explicitly registers an appendix condition that intentionally tests CVE-aware or leakage-aware Threat KB behavior.

S3 requests to S5 should therefore carry a retrieval visibility mode or leakage budget, and S5 should label every returned visible row with `visibleLeakageClass`.

### 4. Preserve diagnostic/status boundaries

S5 statuses are contextual producer signals, not security verdicts.

The following may support S3 diagnostic rationale or responsible UNKNOWN/defer handling:

```text
no_hit
partial
not_available
error
timeout
ambiguous
input-insufficient
```

But they must not be consumed as:

- TP evidence;
- FP evidence;
- vulnerability absence proof;
- threat absence proof;
- `no_hit = safe`;
- `hit = vulnerable`.

S5 hit rows are contextual support, caveats, or retrieval evidence. They are not affectedness proof by themselves.

If existing S5 Judge/affectedness packet fields such as `affected`, `not_affected`, `status`, or `qualityGate` are used internally, S3 must project them into paper-visible contextual/diagnostic rows under forbidden-inference guards. S5 should not be asked to expose them as final paper verdict authority.

### 5. Keep S4-derived context S3-mediated and ledger-referenced

S5 can consume S4-derived anchors, finding IDs, rule IDs, tool messages, library identities, functions, and query intents only when S3 sends them as explicit S5 request inputs.

Those inputs should carry S3 evidence-ledger/provenance refs so the flow remains:

```text
S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger
```

S5 should not validate S4 evidence completeness and should not create direct S4-to-S5 side-channel coupling.

### 6. Make raw-vs-normalized ownership precise

S5 owns:

- raw S5 producer artifacts;
- raw producer schemas;
- producer-local stable IDs such as `retrievalRunId` and `itemId`;
- Threat KB corpus/index versions;
- Code KB / Source Code KG index and schema/provenance fragments;
- retrieval policy/reranker/topK policy versions;
- S5 component provenance, e.g. `component-provenance/s5.lock.json`-style fragments;
- raw producer diagnostics.

S3 / paper harness owns:

- normalized S5 row shapes;
- canonical evidence ledger refs;
- ID/join contract;
- aggregate JSONL;
- scoring/oracle artifacts;
- root bundle manifests and paper exports;
- final TP/FP/UNKNOWN and claim-boundary decisions.

S5 raw rows should echo S3-supplied join refs where applicable: `caseId`, `buildTargetId`, source/build refs, request IDs, and S5 producer run IDs. These S5 IDs should be stable run-local producer IDs, not global scoring truth.

### 7. Avoid checksum/hash semantics in paper-visible S5 evidence

Because the paper draft has already moved away from checksum/hash/digest/fingerprint proof language for S4, the S5 paper-facing contract should follow the same discipline.

Paper-visible S5 refs should be traceability handles, not integrity/security/reproducibility claims.

S5 Source KG may keep internal checksum/integrity fields for snippet/artifact storage, operational replay, or internal consistency validation. But those should not be presented as reviewer-visible security evidence or as paper claims of bit-for-bit reproducibility. Paper-visible S5 packets should rely on opaque refs, schema/profile refs, corpus/index versions, retrieval policy versions, producer-run refs, and S3-owned replay inputs.

### 8. Add B2/B4 same-evidence-row control

S5 must not accidentally make B4 stronger than B2 by giving B4 different or richer S5 evidence content.

For the main B2 vs B4 comparison, S5 should provide the same reviewer-visible S5 evidence rows/text/order under both conditions. B4 may add ledger refs, producer traces, claim links, and navigation; B2 may hide those structural affordances. But the underlying S5 evidence text and row selection should remain controlled unless S3 explicitly defines an ablation.

### 9. Include `S5_FREEZE_GATE` as a paper-contract gate

Before S5 / Threat KB contribution becomes mainline, the contract should include this gate:

```text
S5_FREEZE_GATE:
  - S5 visible packet schema finalized;
  - visibleLeakageClass emitted for every S5 row;
  - Threat KB generic mode tested on synthetic hidden-ledger leakage corpus;
  - S5 no_hit / partial / error cannot be consumed by S3 as TP/FP evidence;
  - S5 never emits final verdict fields or language equivalent to vulnerable/safe.
```

If this gate is not satisfied, S5/Threat KB portions of RQ5 should become exploratory or be removed from the main claim while S3/S4/ledger-structure work may continue if their gates pass.

## What S5 thinks it should do next

S5 should not take over S3's scoring, normalization, final triage, or paper export responsibilities.

The S5-local next work should be narrower:

1. define a paper-visible S5 projection/schema over current S5 Source Code KG / Threat Retrieval / Judge-context artifacts;
2. implement or document generic Threat KB mode and `visibleLeakageClass` labeling;
3. add a leakage validator for CVE/advisory/fix/exploit/patch exposure under mainline conditions;
4. provide S5 producer provenance fragments and retrieval policy/version refs that S3 can normalize safely;
5. ensure existing S5 Judge/Threat Retrieval/Source KG status language cannot be consumed as final safe/vulnerable authority.

## Final S5 position

No blocker.

S5 can follow the proposed S3-led paper pipeline direction after the corrections above. The main correction is not that S5 cannot do the requested role; it is that S5's paper-facing role must be bounded as a contextual evidence/retrieval producer with explicit leakage controls, diagnostic boundaries, and S3-owned normalization/final-verdict authority.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
