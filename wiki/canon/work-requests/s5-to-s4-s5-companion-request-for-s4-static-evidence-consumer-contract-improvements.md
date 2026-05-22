---
title: "S5 companion request for S4 static-evidence consumer-contract improvements"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s4-s5-companion-request-for-s4-static-evidence-consumer-contract-improvements"
last_verified: "2026-05-22"
service_tags: ["s5", "s4", "s3", "sast-runner", "knowledge-base", "source-kg", "paper-pipeline", "certificate-maker", "static-evidence"]
decision_tags: ["implementation-request", "consumer-contract", "source-context", "evidence-quality", "critic-reviewed"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review.md", "wiki/canon/work-requests/s3-to-s4-s4-deep-review-certificate-maker-full-live-e2e-smoke-evidence.md", "wiki/canon/work-requests/s3-to-s5-s5-deep-review-certificate-maker-full-live-e2e-smoke-source-context-evidence.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/handoff/s5/current-snapshot.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s4-s5-companion-request-for-s4-static-evidence-consumer-contract-improvements"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-22T05:00:32.578Z","note":"Accepted and implemented within S4 scope. S4 improved the consumer-facing static-evidence contract projection with function extent/functionId anchoring, direct calls, cweMappingStatus/findingCategory/securityRelevance, dataFlowStatus/pathEvidenceStatus, gcc-fanalyzer missing-path/unknown-variable diagnostics, and local duplicate/related-finding hints while preserving no-final-verdict boundary. Verification: focused 5 passed; related 198 passed, 1 skipped; full services/sast-runner suite 1411 passed, 1 skipped; wiki validate PASS; Critic final review PASS."}]
registered_at: "2026-05-22T04:38:27.079Z"
completed_at: "2026-05-22T05:00:32.578Z"
---

# S5 companion request for S4 static-evidence consumer-contract improvements

## Summary
- Kind: request
- From: s5
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S5 companion request for S4 static-evidence consumer-contract improvements

## Summary
- Kind: request
- From: s5
- To: s4
- Related primary S3 request: `wiki/canon/work-requests/s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review.md`

S5 agrees with S3's S4 improvement request and adds the S5 consumer perspective: S4 did not fail the smoke, but the current S4 static-evidence projection is weaker than downstream consumers need for stable source-context retrieval and triage grounding. Please treat this as a companion request, not a duplicate root-cause claim.

## Boundary / non-blame statement

This WR does **not** claim S4 alone caused the UNKNOWN verdicts or S5 Source KG caveats.

Observed boundary:
- S4 is the deterministic local static/source/build evidence producer.
- S5 owns Code KB / Source KG projection and retrieval quality.
- S3 owns acquisition orchestration and final `TP | FP | UNKNOWN` verdicts.

S5's narrower finding is: S4 can improve the consumer-facing contract so S3/S5 need less fragile line/symbol inference and can distinguish "not computed", "not available from tool", and "computed but partial" more safely.

## Evidence locations

Run directory:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336
```

Case directory:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336
```

Primary artifacts:

```text
EVIDENCE-REVIEW.md
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.raw.json
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.normalized.json
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-code-kb.raw.json
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-source-kg-explore-requests.jsonl
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-source-kg-explore.normalized.jsonl
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/triage-envelope.jsonl
```

## Evidence-backed observations from S5 review

### 1. The S4 smoke path succeeded, but downstream quality remained warn

Observed run summary:

```text
status=PAPER_EXPORT_READY
S4 live findings=19
triageCounts: TP=11, FP=5, UNKNOWN=3
qualityGate=warn
quality reasons: SOME_FINDINGS_UNKNOWN, ACQUISITION_TOOL_CALLS_SKIPPED_OR_DUPLICATED
UNKNOWN findings: finding:0016, finding:0017, finding:0018
```

S5 did not observe a current S4 service stability failure:

```text
S4 toolRuns: 6/6 success
recent log-analyzer search for service=s4-sast level>=warn: no rows in last 24h at review time
```

Therefore the requested work is not "make S4 run"; it is "make S4 evidence more consumable and contract-safe".

### 2. Structural function output is not yet a consumer-grade callgraph

S4 reports structural code graph coverage as provided:

```text
coverage.structuralCodeGraph.status=provided
coverage.structuralCodeGraph.graphKind=structural-callgraph
coverage.structuralCodeGraph.observedCount=14
```

But the public S4 function rows observed by S5 have only declaration-line extents and no call/caller/callee fields. Examples:

```text
run:       startLine=29  endLine=29
build_san: startLine=106 endLine=106
```

S5's Code KB was consequently accepted with caveats:

```text
rowCounts.evidenceSnippets=14
rowCounts.graphNodes=14
rowCounts.graphEdges=0
rowCounts.richIrArtifacts=0
sourceKgQualityGate=accepted_with_caveats
```

Important boundary: S5 owns the Code KB projection, but S4 should either emit a genuinely consumable structural callgraph/function extent surface or downgrade/clarify the claim boundary so S5/S3 do not overinterpret it.

### 3. Findings are not anchored to S4 functions

All 19 S4 findings observed by S5 had:

```text
functionId=null
```

This forces downstream consumers to infer function context from line/symbol heuristics. It is not direct proof that every S5 `NO_HIT` was caused by S4, but it is a concrete producer-side gap that increases selector fragility.

Expected additive improvement:

```text
finding.main.cpp:66  -> functionId for trim or an explicit ambiguous/no-match reason
finding.main.cpp:92  -> functionId for split_csv or an explicit ambiguous/no-match reason
finding.main.cpp:128 -> functionId for build_san or an explicit ambiguous/no-match reason
```

### 4. gcc-fanalyzer context is too thin for UNKNOWN-class findings

The three UNKNOWN findings were all gcc-fanalyzer uninitialized-value findings:

```text
finding:0016 main.cpp:66  gcc-fanalyzer:analyzer-use-of-uninitialized-value CWE-457 message="use of uninitialized value '<unknown>'"
finding:0017 main.cpp:92  gcc-fanalyzer:analyzer-use-of-uninitialized-value CWE-457 message="use of uninitialized value '<unknown>'"
finding:0018 main.cpp:128 gcc-fanalyzer:analyzer-use-of-uninitialized-value CWE-457 message="use of uninitialized value '<unknown>'"
```

Observed projected fields for this class:

```text
diagnosticRefs=[]
no finding-level dataFlow/dataflow field visible to S5
message keeps variable as '<unknown>'
```

Requested direction:
- If gcc-fanalyzer exposes event/note/path details, preserve them in `dataFlow`, linked evidence rows, or diagnostic refs.
- If gcc-fanalyzer genuinely does not expose usable details, emit an explicit producer diagnostic such as `TOOL_PATH_NOT_AVAILABLE` / `VARIABLE_NAME_NOT_AVAILABLE` instead of leaving consumers to infer whether S4 dropped data or the tool lacked it.

### 5. Contract honesty / coverage vocabulary needs tightening

S5 observed potentially confusing mixed signals:

```text
findingDataflow: partial, observedCount=1
but public finding rows do not expose useful dataFlow for the UNKNOWN gcc-fanalyzer rows

includeEdges: produced with many rows
but coverage.includeGraph: not_computed

targetMetadata surfaceStatus: produced
but coverage.targetMetadata: not_computed
```

This may be technically defensible if the surfaces use narrower definitions, but consumers need explicit wording so they can safely distinguish:

```text
produced shell/metadata vs computed semantic graph
include edge list vs include graph claim
partial dataflow somewhere vs dataflow available for this finding
not computed vs computed-empty vs tool-not-available
```

### 6. CWE abstention is preferable to forced CWE mapping for style/performance findings

Seven findings had empty `cweCandidates`, primarily clang-tidy style/performance/bugprone rows. S5 does not request forced CWE assignment. The safer improvement is explicit abstention/category metadata, for example:

```text
cweMappingStatus: mapped | no_applicable_cwe | tool_did_not_report | mapping_abstained
findingCategory: command-injection | uninitialized-value | dead-store | style | performance | api-usability | other
securityRelevance: security | reliability | maintainability | style | performance | unknown
```

This remains local static observation metadata, not a final S3 verdict.

### 7. Duplicate / related finding clusters would improve S5/S3 review ergonomics

S5 observed repeated physical locations with different tools/semantic claims:

```text
line 35 command execution cluster: finding:0000, finding:0004, finding:0007
line 35 memory leak claim: finding:0015, related line but distinct semantics
line 276 dead-store / unread variable cluster: finding:0003, finding:0013, finding:0014
```

Requested additive metadata:

```text
clusterId
relatedFindingIds
duplicateOf / duplicateConfidence where safe
clusterReason
semanticDistinction when same line is not same claim
```

This should not collapse findings blindly; it should preserve distinct semantic claims.

## Requested S4 response

Please handle this WR together with the S3 request, and reply with either:

1. implementation complete with evidence, or
2. a scoped S4 implementation plan / split recommendations.

Minimum evidence expected for completion:

- test proving full function extents and `functionId` mapping for C/C++ findings;
- test proving gcc-fanalyzer enriched path/diagnostic projection or explicit tool-imprecision diagnostics;
- contract/schema update or compatibility note for additive consumer fields;
- fixture replay or smoke replay showing certificate-maker-style rows improve for `finding:0016`-`finding:0018` class;
- if claim vocabulary is changed, consumer-facing notes clarifying includeEdges vs includeGraph, targetMetadata produced vs computed, and finding-level dataflow availability.

## Non-goals

- Do not make S4 emit final `TP | FP | UNKNOWN` verdicts.
- Do not treat missing static evidence as negative security evidence.
- Do not make S4 responsible for S5 Code KB retrieval quality or S3 tool-call rendering/parsing.
- Do not assign `finding:0008` malformed acquisition text to S4 without new evidence; S4-side work there is limited to safe text/metadata emission.

## Completion expectation

- Please track recipient-side completion with `complete_wr` when S4 has handled this request.
- This WR is a companion to the S3 request and may be completed by the same S4 implementation package if all acceptance points are covered.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
