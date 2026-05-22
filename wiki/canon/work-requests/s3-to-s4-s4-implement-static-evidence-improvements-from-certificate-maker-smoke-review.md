---
title: "S4 implement static-evidence improvements from certificate-maker smoke review"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review"
last_verified: "2026-05-22"
service_tags: ["s3", "s4", "sast-runner", "paper-pipeline", "certificate-maker", "static-evidence", "gcc-fanalyzer"]
decision_tags: ["implementation-request", "evidence-quality", "paper-readiness"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-deep-review-certificate-maker-full-live-e2e-smoke-evidence.md", "wiki/canon/work-requests/s3-to-s5-s5-deep-review-certificate-maker-full-live-e2e-smoke-source-context-evidence.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review"
wr_kind: "request"
status: "open"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: []
registered_at: "2026-05-22T04:36:21.582Z"
---

# S4 implement static-evidence improvements from certificate-maker smoke review

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S3 reviewed the full live certificate-maker e2e smoke evidence and Critic-checked the S4-side improvement signals. Please implement or plan S4-owned static-evidence improvements so the next paper smoke gives S3/S5 enough producer-side grounding for gcc-fanalyzer findings, function anchoring, and review readability.

Important boundary: this WR does **not** claim S4 alone caused the UNKNOWN verdicts. The evidence supports a narrower conclusion: S4's current projection loses useful producer-side context, especially for gcc-fanalyzer, which likely increases UNKNOWN risk when S5 caller/call-site context is also incomplete.

## Primary evidence locations

Run directory:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336
```

Reviewer entrypoints:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/EVIDENCE-REVIEW.md
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/finding-review-table.csv
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/evidence-review-summary.json
```

S4 evidence artifact:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.raw.json
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.normalized.json
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/findings.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/triage-envelope.jsonl
```

Source under review:

```text
/home/kosh/aegis-for-paper/datasets/build-targets-v1/targets/bt-0001-certificate_maker/source/main.cpp
```

Relevant S4 code surfaces observed by S3:

```text
/home/kosh/AEGIS/services/sast-runner/app/scanner/gcc_analyzer_runner.py
/home/kosh/AEGIS/services/sast-runner/app/scanner/paper_static_evidence.py
/home/kosh/AEGIS/services/sast-runner/app/scanner/static_evidence_contract.py
```

## Evidence-backed observations

Run result:

```text
status=PAPER_EXPORT_READY
S4 live findings=19
triageCounts: TP=11, FP=5, UNKNOWN=3
qualityGate=warn
qualityGate reasons: SOME_FINDINGS_UNKNOWN, ACQUISITION_TOOL_CALLS_SKIPPED_OR_DUPLICATED
UNKNOWN findings: finding:0016, finding:0017, finding:0018
```

The three UNKNOWN findings are all:

```text
gcc-fanalyzer:analyzer-use-of-uninitialized-value
UNKNOWN_INSUFFICIENT_CONTEXT
```

In S4 projected evidence, these rows preserve location/CWE but not enough analyzer path detail:

```text
finding:0016 main.cpp:66 message="use of uninitialized value '<unknown>'" functionId=null diagnosticRefs=[]
finding:0017 main.cpp:92 message="use of uninitialized value '<unknown>'" functionId=null diagnosticRefs=[]
finding:0018 main.cpp:128 message="use of uninitialized value '<unknown>'" functionId=null diagnosticRefs=[]
```

S4 function rows exist for `trim`, `split_csv`, and `build_san`, but their locations are declaration-line-only rather than full body ranges:

```text
trim: startLine=51 endLine=51; actual body in source is approximately 51-67
split_csv: startLine=90 endLine=90; actual body is approximately 90-104
build_san: startLine=106 endLine=106; actual body is approximately 106-129
```

The S4 static evidence contract reports `findingDataflow` as partial, but the S3-observed projected finding rows do not expose useful `dataFlow` for the UNKNOWN gcc-fanalyzer findings. S3 observed that `gcc_analyzer_runner.py` can collect note lines into `dataFlow`, while `paper_static_evidence.py` projection does not appear to surface that field in the public finding rows.

Duplicate/related finding clusters are visible but not represented as first-class S4 metadata. Examples:

```text
line 35 command processor / command injection cluster: finding:0000, finding:0004, finding:0007
line 35 leak finding: finding:0015 (related physical line but distinct semantic claim)
line 276 dead-store cluster: finding:0003, finding:0013, finding:0014
```

`finding:0008` triggered a malformed-looking requested tool string downstream (`explore_source_kg\n</parameter`). S3/Critic do **not** treat this as S4 root cause from the current artifact. It is more likely S3/S7 tool-call rendering/parsing territory, but S4 can still add defensive downstream-safe escaping for messages containing C++ types/angle brackets.

## Requested S4 implementation / design work

Please address these S4-owned improvements, or reply with a scoped implementation plan if any item needs a follow-up split.

### 1. Preserve gcc-fanalyzer enriched diagnostic evidence

For gcc-fanalyzer findings, especially CWE-457 / `analyzer-use-of-uninitialized-value`, preserve more than the short warning text:

- analyzer note/event chain when present;
- raw diagnostic excerpt or bounded stderr excerpt;
- variable/symbol name if available;
- `dataFlow` / path steps;
- diagnostic evidence rows linked through `diagnosticRefs` or dedicated evidence refs;
- explicit reason when gcc-fanalyzer produced no notes/path details.

Acceptance signal: future S4 artifact for findings like `0016`-`0018` should not leave S3 with only `use of uninitialized value '<unknown>'` plus a line number.

### 2. Link findings to functions and emit full function extents

Populate `functionId` for findings when a finding line falls within a known function range. Emit full function body ranges, not declaration-only rows.

For certificate-maker, expected examples include:

```text
main.cpp:66  -> trim      range around 51-67
main.cpp:92  -> split_csv range around 90-104
main.cpp:128 -> build_san range around 106-129
```

This is not a final verdict feature. It is anchoring metadata so S3/S5 can request more accurate `source_slice`, `function_body`, and caller/call-site context.

### 3. Add duplicate / related finding cluster metadata

Add first-class metadata such as `clusterId`, `duplicateOf`, `relatedFindings`, and `clusterReason` where S4 can safely identify overlapping static observations.

Examples to preserve carefully:

- `finding:0000`, `finding:0004`, `finding:0007`: likely same command processor / command-injection surface at `main.cpp:35`.
- `finding:0015`: same physical line but memory-leak semantic claim, so it should be related but not blindly collapsed into the command-injection cluster.
- `finding:0003`, `finding:0013`, `finding:0014`: dead-store / unread variable overlap around `main.cpp:276`.

### 4. Add local category / security-relevance metadata without final verdicting

S4 should not emit TP/FP/UNKNOWN or final security verdicts. However, S4 can provide local classification metadata to help S3 triage and paper review:

```text
findingCategory: command-injection | memory-leak | uninitialized-value | dead-store | style | performance | api-usability | other
securityRelevance: security | reliability | maintainability | style | performance | unknown
producerConfidence or evidenceStrength: optional, local-tool-observation only
```

This should remain within S4's claim boundary: local static observation metadata, not final vulnerability judgment.

### 5. Consider downstream-safe message escaping as a defensive layer

For messages containing C++ template/type angle brackets or XML-like fragments, provide a downstream-safe text form or escaped field. This is a secondary hardening item; the observed `finding:0008` malformed tool call is not assigned to S4 as root cause.

## Acceptance criteria

Please reply with one of:

1. implementation complete with evidence, or
2. scoped S4 implementation plan / split WR recommendations.

Minimum completion evidence should include:

- updated S4 tests for gcc-fanalyzer enriched projection;
- test proving function body extents and `functionId` mapping for a C/C++ fixture;
- test or fixture proving cluster metadata preserves related-but-not-identical findings;
- contract/schema update or compatibility note for any new additive fields;
- a rerun or fixture replay showing certificate-maker-style S4 artifact has improved rows for the `0016`-`0018` class.

## Non-goals

- Do not make S4 emit final TP/FP/UNKNOWN verdicts.
- Do not treat empty/missing S4 evidence as negative security evidence.
- Do not collapse same-line findings across different semantic claims without preserving distinction.
- Do not attribute the S3/S7 malformed tool-call issue to S4 unless new evidence proves it.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
