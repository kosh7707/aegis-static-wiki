---
title: "S5 support needed: context coverage diagnostics and exploratory Source KG query surface for S3 iterative analysis"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-s5-support-needed-context-coverage-diagnostics-and-exploratory-source-kg-query-s"
last_verified: "2026-05-21"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "paper-pipeline", "traceaudit", "source-code-kg", "tool-use"]
decision_tags: ["work-request", "analysis-quality", "evidence-ux", "source-kg-coverage", "iterative-tool-use"]
related_pages: ["wiki/canon/handoff/s3/session-s3-20260521-analysis-agent-quality-interview.md", "wiki/canon/handoff/s3/session-s3-20260521-certmaker-rerun-openvpn-mss.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-s5-support-needed-context-coverage-diagnostics-and-exploratory-source-kg-query-s"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-21T10:36:35.060Z","note":"Implemented and verified in S5. S3 should consume retrieve_finding_context.contextCoverage (coverageStatus, requestedAnchors, returnedSpans, tri-state lineOverlap, diagnostics) and the new POST /v1/paper/source-kg/explore / explore_source_kg endpoint. Non-overlap now returns surfaceStatus=partial with contextCoverage.coverageStatus=non_overlapping and diagnostic S5_PAPER_CONTEXT_NON_OVERLAPPING. Verification: 60 passed in 130.04s for paper API + freeze gate; compileall passed."}]
registered_at: "2026-05-21T10:16:59.162Z"
completed_at: "2026-05-21T10:36:35.060Z"
---

# S5 support needed: context coverage diagnostics and exploratory Source KG query surface for S3 iterative analysis

## Summary
- Kind: request
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S3 needs S5 support for the next TraceAudit/certificate-maker quality hardening pass. The transport/orchestration issue is resolved, but the latest certificate-maker rerun finished with `PAPER_EXPORT_READY` while every triage verdict was `UNKNOWN`.

This WR is **not** asking S5 to take over the S3 root cause. S3 owns the manifest-generator and analysis-agent runner/tool-policy fixes. S5 support is needed for two adjacent surfaces:

1. **Context coverage diagnostics**: when S3 asks for context anchored at a finding line or function, S5 should make it obvious whether returned Source KG snippets actually overlap the requested anchor.
2. **Exploratory Source KG query surface**: S3's intended tool-use pattern is not one-shot retrieval. The analysis agent should be able to start from "suspicious but insufficient evidence" and iteratively query S5 to expand source/function/call-graph context step by step.

# Evidence locations

Primary rerun root:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-174803
```

Primary case:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-174803/cases/case-bt-0001-certificate-maker-traceaudit-ce2367faad1e
```

Important artifacts under the case directory:

```text
findings.jsonl
triage-envelope.jsonl
llm-transcript.raw.jsonl
s5-finding-context.raw.jsonl
evidence-ledger.jsonl
audit-packets/
```

Related S3 interview/session evidence:

```text
wiki/canon/handoff/s3/session-s3-20260521-analysis-agent-quality-interview.md
wiki/canon/handoff/s3/session-s3-20260521-certmaker-rerun-openvpn-mss.md
```

Concrete observed mismatch:

```text
Requested/finding anchors included main.cpp:35, main.cpp:110, main.cpp:119, main.cpp:276, etc.
Returned Source KG context effectively pointed at main.cpp:1-24.
All 19 verdicts were UNKNOWN.
UNKNOWN reasons: UNKNOWN_INSUFFICIENT_CONTEXT=14, UNKNOWN_CLAIM_BOUNDARY=5.
```

Observed tool-call accounting from `llm-transcript.raw.jsonl`:

```text
19 findings total
retrieve_finding_context=20
retrieve_generic_threat_context=20
list_evidence_rows=22
finding:0016 duplicated required retrievals in round 2 and S3 skipped them as duplicate_tool_call
```

# Requested S5 work

## A. Coverage diagnostic / contract hardening

Please add or expose a diagnostic that lets S3 distinguish:

- returned source context overlaps requested file+line/function anchor;
- returned source context is same file but non-overlapping;
- returned source context is partial/degraded;
- no selectable Source KG context exists;
- Source KG exists but cannot satisfy the specific anchor.

Suggested shape is flexible, but S3 needs machine-readable fields equivalent to:

```json
{
  "coverageStatus": "covered|partial|non_overlapping|not_available|error",
  "requestedAnchor": { "path": "main.cpp", "line": 35, "function": "run" },
  "returnedSpans": [{ "path": "main.cpp", "startLine": 1, "endLine": 24, "nodeId": "..." }],
  "lineOverlap": false,
  "diagnostics": [{ "code": "SOURCE_KG_CONTEXT_NON_OVERLAPPING", "message": "..." }]
}
```

This should prevent a response that is structurally `produced` from being over-read as useful evidence when it does not overlap the finding anchor.

## B. Exploratory Source KG query surface for iterative S3 tool use

Please assess and implement/propose S5 endpoints or paper-context fields that S3 can safely expose as LLM tools for bounded iterative investigation. Needed capabilities:

- source slice by `path + line/range`;
- function body by symbol or `path + line`;
- callers/callees for a function node;
- symbol/reference lookup;
- neighborhood expansion around the current anchor;
- optional argument/data-flow neighborhood if S5 already has enough graph data, otherwise return an explicit `not_available` diagnostic rather than fabricating.

The intended S3 behavior is:

1. find starts suspicious but insufficient;
2. ask S5 for the immediate source/function context;
3. if still insufficient, ask for callers/callees or nearby source spans;
4. repeat within a bounded budget;
5. record the tool timeline and explain why the final verdict remains `UNKNOWN` if evidence is still insufficient.

# Acceptance criteria

S5-side acceptance criteria:

- S3 can tell, per finding, whether Source KG context overlaps the requested anchor.
- Non-overlap/partial Source KG context is surfaced as a diagnostic, not silently treated as adequate context.
- S3 has a documented exploratory query surface or explicit reply explaining which capabilities already exist and which require follow-up.
- Any new S5 response fields are documented in the canonical S5 API/spec pages owned by S5.
- Verification evidence references the certificate-maker case path above or a smaller deterministic fixture that reproduces the `main.cpp:1-24` vs finding-line mismatch.

S3 will separately handle:

- fixing `/home/kosh/aegis-for-paper/scripts/experiments/generate-traceaudit-case-manifest.py` so C/C++ brace-next-line functions are extracted correctly;
- changing `services/analysis-agent/app/paper/runner.py` to per-finding acquisition → finalizer → validate → append artifacts;
- adding human-readable per-finding evidence summaries and quality gates.

# Constraints / boundaries

- Do not infer TP/FP from S5 hit/no-hit/partial status. S5 evidence remains contextual support, not final verdict authority.
- Do not start or stop services as part of triage unless the user explicitly authorizes it.
- If implementation work is needed, S5 should stay within `services/knowledge-base/**` and S5-owned docs/API surfaces.
- Please reply with the exact fields/endpoints S3 should consume and any limitations S3 must encode in its tool policy.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
