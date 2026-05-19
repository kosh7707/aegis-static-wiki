---
title: "S5 define paper-facing S3 tool-call contract for Code KB and retrieval evidence"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence"
last_verified: "2026-05-19"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "paper-pipeline", "code-kb", "source-code-kg", "threat-kb"]
decision_tags: ["paper-api", "s5-freeze-gate", "tool-call-contract", "generic-threat-kb", "visible-leakage-class", "producer-boundary", "b2-b4-evidence-control"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-19T02:17:53.850Z","note":"S5 accepted the paper-facing three-call tool contract with scope: new S5 paper endpoints/tool surface should be implemented later, backed by existing Source Code KG/acquisition/Threat Retrieval internals, with S5_FREEZE_GATE still open until implementation/tests. Reply registered at wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md."}]
registered_at: "2026-05-19T02:09:25.092Z"
completed_at: "2026-05-19T02:17:53.850Z"
---

# S5 define paper-facing S3 tool-call contract for Code KB and retrieval evidence

## Summary
- Kind: request
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

S3 read S5's ACK_WITH_CORRECTIONS reply for the pre-freeze paper Code KB / retrieval producer contract and discussed it with the user.

S3 accepts the core S5 position:

- S5 is a contextual evidence / retrieval producer for the paper pipeline.
- S5 should not become the final TP/FP/UNKNOWN verdict producer, S4 replacement, S3 claim-boundary owner, scoring owner, normalization owner, or paper bundle exporter.
- S3 owns analysis case orchestration, normalized paper rows, evidence ledger refs, final finding-level TP/FP/UNKNOWN, B2/B4 packet controls, scoring/oracle artifacts, and paper export.

This WR is **not** an implementation-start request. It asks S5 to turn the agreed semantic boundary into an explicit paper-facing S3 tool-call contract that S3 can consume later.

## Request

Please define the minimal paper-facing S5 callable API/tool-call contract that S3's analysis agent can use for the TraceAudit paper pipeline.

S3 expects at least the following calls or S5-approved semantic equivalents:

### 1. `prepare_code_kb`

Purpose: build-target / analysis-case setup.

Expected role:

```text
S3 admitted build target -> S5 target-scoped Code KB / Source Code KG readiness
```

This corresponds to the setup state:

```text
S5_CODE_KB_READY
```

Please specify:

- tool/endpoint name;
- sync vs async behavior;
- idempotency/retry expectation;
- required and optional request fields;
- response schema;
- status/error model;
- example request;
- example response;
- producer provenance/version refs returned to S3.

Expected request concepts include, but are not limited to:

```text
caseId
buildTargetId
sourceRootRef
compileCommandsRef or compileContextRef
visibilityMode
leakageBudget
requestId/idempotency key
```

Expected response concepts include, but are not limited to:

```text
codeKbRunId or retrievalRunId
status: produced | partial | not_available | error
codeKbRef
sourceKgRef
producerProvenance
policy/schema/index version refs
diagnostics[]
```

### 2. `retrieve_finding_context`

Purpose: finding-level Code KB / Source KG contextual retrieval after S3 has S4 findings/source anchors.

Expected flow:

```text
S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger
```

S5 should consume S4-derived anchors only when S3 sends them explicitly. S5 should not create a direct S4-to-S5 side channel and should not validate S4 completeness.

Please specify request/response schema and examples.

Expected request concepts include, but are not limited to:

```text
caseId
buildTargetId
findingId
s3EvidenceRefs[]
file/function/source anchors
ruleId
cweCandidates[]
toolMessage
libraryIdentity
queryIntent
visibilityMode
leakageBudget
topK / retrievalProfile
requestId/idempotency key
```

Expected response row concepts include the paper-visible minimum S5 row shape:

```text
retrievalRunId
itemId
sourceType: code | symbol | cwe | capec | generic_security_note | library_provenance | diagnostic
queryIntent
sourceEvidence
surfaceStatus: produced | no_hit | partial | not_available | error
visibleLeakageClass: generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
text/snippet/context
producerTrace or producer provenance refs
diagnostics[]
```

### 3. `retrieve_generic_threat_context`

Purpose: generic Threat KB context for CWE/API/library misuse/security concepts under main benchmark leakage controls.

Main benchmark mode must be **generic Threat KB mode only**:

- CWE/CAPEC/security concept explanations;
- API misuse descriptions;
- generic security notes;
- source-derived code context;
- library provenance that does not expose hidden CVE/advisory/fix/patch provenance.

CVE IDs, advisories, fix commits, exploit writeups, and patch text must stay hidden unless S3 explicitly registers an appendix condition that intentionally tests CVE-aware or leakage-aware Threat KB behavior.

Please specify request/response schema and examples.

Expected request concepts include, but are not limited to:

```text
caseId
findingId
cweCandidates[]
apiNames[]
libraryIdentity
queryIntent
visibilityMode: generic
forbiddenLeakageClasses:
  - cve_id
  - fix_commit
  - advisory
  - exploit_writeup
  - patch_text
requestId/idempotency key
```

Expected response concepts include:

```text
retrievalRunId
rows[] with sourceType cwe | capec | generic_security_note | library_provenance | diagnostic
visibleLeakageClass
surfaceStatus
sourceEvidence
text/context
producer provenance/version refs
diagnostics[]
```

## Boundaries S3 wants preserved

The contract must preserve the S5 producer boundary:

```text
S5 hit      != vulnerable
S5 no_hit   != safe
S5 error    != FP
S5 partial  != final UNKNOWN by itself
S5 CWE note != affectedness proof
```

S5 status/diagnostic fields may support S3 diagnostic rationale or responsible UNKNOWN/defer handling, but they must not be consumed or exposed as TP/FP/UNKNOWN evidence.

If current S5 internals include Judge/affectedness/status/qualityGate vocabulary, the paper-facing projection should not expose those fields as final safe/vulnerable authority. S3 prefers contextual/retrieval/diagnostic wording for paper-visible S5 rows.

## B2/B4 evidence control requirement

For the main B2 vs B4 comparison, S5 should make it possible for S3 to render B2 and B4 from the **same underlying S5 evidence rows/text/order**.

B4 may add ledger refs, producer traces, claim links, and navigation. B2 may hide those structural affordances. S5 should not make B4 stronger by returning richer or different S5 evidence content unless S3 explicitly defines an ablation.

## S5_FREEZE_GATE linkage

Please state whether the proposed tool-call contract satisfies or leaves open each S5_FREEZE_GATE item:

```text
S5_FREEZE_GATE:
  - S5 visible packet schema finalized;
  - visibleLeakageClass emitted for every S5 row;
  - Threat KB generic mode tested on synthetic hidden-ledger leakage corpus;
  - S5 no_hit / partial / error cannot be consumed by S3 as TP/FP evidence;
  - S5 never emits final verdict fields or language equivalent to vulnerable/safe.
```

If any item is not yet satisfied, please identify the remaining S5-local work and whether it blocks mainline RQ5 or only the Threat KB/S5-context portions.

## Expected deliverable

A reply WR is sufficient for now. Please include:

1. proposed callable API/tool names;
2. request and response schemas;
3. example payloads;
4. status/error/idempotency/retry semantics;
5. S5 producer provenance/version fields;
6. leakage controls and `visibleLeakageClass` behavior;
7. explicit forbidden-inference / non-verdict language;
8. any disagreement with the proposed three-call split.

If S5 believes the call split should differ, please propose the narrower replacement shape while preserving the same paper-facing semantics.

## Completion expectation

Recipient-side handling should be tracked through `complete_wr`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
