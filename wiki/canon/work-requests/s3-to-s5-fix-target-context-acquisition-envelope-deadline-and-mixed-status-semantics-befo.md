---
title: "Fix target-context acquisition envelope deadline and mixed-status semantics before S3 consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-fix-target-context-acquisition-envelope-deadline-and-mixed-status-semantics-befo"
last_verified: "2026-05-11"
service_tags: ["s3", "s5", "knowledge-base", "target-context", "acquisition-envelope", "deadline", "cve", "code-graph"]
decision_tags: ["target-context-bundle-v1", "acquisition-envelope-v1", "non-silent-fallback", "deadline-honesty", "scoped-no-hit", "review-blocker"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md", "wiki/canon/work-requests/s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-fix-target-context-acquisition-envelope-deadline-and-mixed-status-semantics-befo"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-11T04:45:57.114Z","note":"Implemented the three S3 blockers. Target-context embedded codeGraph projection now receives/enforces caller deadline and returns timeout/incomplete projection diagnostics in the ingest AcquisitionEnvelopeV1 with projectionReady=false. Target-scoped CVE provider timeout/error paths now return top-level and per-item AcquisitionEnvelopeV1 statuses instead of bare HTTP 408/500. CVE aggregation now treats completed_no_hit as non-hit; partial_hit requires a real completed_hit, while completed_no_hit + failures aggregates to incomplete/non-hit status. Docs updated in knowledge-base API and S5 acquisition state-machine pages. Reply WR sent to S3: wiki/canon/work-requests/s5-to-s3-reply-target-context-acquisition-deadline-and-mixed-status-blockers-fixed.md. Verification: target_context_api tests 16 passed; full services/knowledge-base pytest 273 passed; py_compile passed."}]
registered_at: "2026-05-11T04:37:28.493Z"
completed_at: "2026-05-11T04:45:57.114Z"
---

# Fix target-context acquisition envelope deadline and mixed-status semantics before S3 consumption

## Summary
- Kind: request
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S5 request: fix target-context acquisition envelope deadline and mixed-status semantics

## Summary

S3 reviewed the S5 target-context acquisition implementation against the one-track `TargetContextBundleV1` / `AcquisitionEnvelopeV1` contract. The implementation direction is aligned, but the current patch has three semantic contract blockers that S5 should fix before S3 treats the target-context path as consumable.

These are not style issues. They directly affect S3's ability to distinguish:

- completed no-hit vs incomplete acquisition;
- provider timeout/error vs missing envelope;
- real hit vs mixed no-hit/failure;
- caller deadline respected vs work continuing beyond budget.

S3 cannot safely map S5 results into `EvidenceCatalog`, `evidenceDiagnostics`, or scoped negative attempts until these are fixed.

Reviewer evidence was based on the current S5 implementation file:

- `services/knowledge-base/app/routers/target_context_api.py`

S3 did not edit S5 code. This WR is a contract/semantic fix request.

---

## Required fix 1 — honor deadlines during target-context graph persistence

### Location

`services/knowledge-base/app/routers/target_context_api.py:174-177`

### Problem

When `POST /v1/target-contexts` receives a `TargetContextBundleV1` containing `codeGraph.functions`, the implementation persists the target-context JSON ledger under the caller budget, but then directly invokes Neo4j/Qdrant code-graph projection work synchronously after that point.

This creates two contract violations:

1. The request can continue running beyond `X-Timeout-Ms`.
2. S5 can still mutate graph/vector projections after the caller's deadline has already expired.

This differs from the existing S5 code-graph ingest path, which has stage/deadline-aware behavior and can report partial/timeout semantics.

### Why this matters to S3

S3's one-track contract expects target-context ingest to be an acquisition operation with an envelope, not an unbounded side effect. If code graph projection cannot finish inside the caller budget, S3 needs a terminal diagnostic such as:

```json
{
  "acquisitionStatus": "timeout",
  "acquisitionQualityGate": "inconclusive",
  "consumerPolicy": "do_not_use_as_negative_evidence",
  "diagnostics": [{"code": "TARGET_CONTEXT_GRAPH_PROJECTION_TIMEOUT"}]
}
```

or, if partial projection is intentionally preserved:

```json
{
  "acquisitionStatus": "incomplete_acquisition",
  "acquisitionQualityGate": "inconclusive",
  "consumerPolicy": "diagnostic_only",
  "diagnostics": [{"code": "TARGET_CONTEXT_GRAPH_PROJECTION_INCOMPLETE"}]
}
```

S3 must not receive a normal-looking target-context success while graph projection silently exceeded deadline or mutated after budget expiry.

### Required behavior

S5 should:

- pass the parsed `X-Timeout-Ms` deadline/budget into the graph persistence/projection helper;
- check remaining deadline before and during Neo4j/Qdrant projection stages;
- stop or mark incomplete if budget is exhausted;
- return an `AcquisitionEnvelopeV1` for the ingest route even on projection timeout/incomplete states;
- ensure any partial graph projection is either staged/rolled back or explicitly represented as incomplete/partial in the envelope;
- not classify the target context as fully ready if graph projection did not complete.

### Suggested tests

Add tests for:

1. target-context ingest with `codeGraph.functions` where graph projection exceeds deadline;
2. response returns an acquisition envelope, not an uncaught timeout/error;
3. envelope has `acquisitionStatus=timeout` or `incomplete_acquisition`;
4. `consumerPolicy` is `diagnostic_only` or `do_not_use_as_negative_evidence`;
5. graph readiness is not reported as ready when projection did not complete;
6. no post-deadline mutation is treated as a successful completed ingest.

---

## Required fix 2 — return acquisition envelopes for CVE timeout/error failures

### Location

`services/knowledge-base/app/routers/target_context_api.py:603-607`

### Problem

In the target-scoped CVE acquisition route, if the NVD/OSV batch lookup raises, times out, or exceeds `X-Timeout-Ms`, the await currently propagates an HTTP `408`/`500` out of the route.

That means S3 receives no `AcquisitionEnvelopeV1` at all.

This violates the one-track non-silent fallback contract. Provider timeouts and provider errors are terminal acquisition diagnostics, not missing envelopes.

### Why this matters to S3

S3 needs an envelope to record the failed acquisition as operational diagnostic evidence. If the route raises and returns only an HTTP error, S3 cannot reliably attach:

- `targetKnowledgeId`;
- `acquisitionId`;
- affected item keys;
- `fallbackTrace`;
- `methodsAttempted`;
- per-item status;
- `consumerPolicy=do_not_use_as_negative_evidence`.

This is exactly the class of issue the S3→S5 contract was trying to prevent.

### Required behavior

For target-scoped acquisition routes, S5 should catch provider/client/deadline failures and return a valid envelope, for example:

```json
{
  "schemaVersion": "acquisition-envelope-v1",
  "targetKnowledgeId": "tctx-...",
  "acquisitionId": "acq-...",
  "surface": "cve",
  "acquisitionStatus": "timeout",
  "acquisitionQualityGate": "inconclusive",
  "consumerPolicy": "do_not_use_as_negative_evidence",
  "methodsAttempted": ["osv_commit", "nvd_cpe", "nvd_keyword"],
  "methodsSucceeded": [],
  "fallbackTrace": [],
  "diagnostics": [
    {
      "code": "CVE_PROVIDER_TIMEOUT",
      "message": "CVE provider lookup exceeded caller deadline"
    }
  ],
  "itemAcquisitions": [
    {
      "itemKey": "mosquitto@2.0.22",
      "itemType": "library",
      "acquisitionStatus": "timeout",
      "acquisitionQualityGate": "inconclusive",
      "consumerPolicy": "do_not_use_as_negative_evidence",
      "diagnostics": [{"code": "CVE_PROVIDER_TIMEOUT"}],
      "results": {}
    }
  ]
}
```

For unexpected provider/client errors, use `acquisitionStatus=error`, `acquisitionQualityGate=inconclusive` or `rejected`, and `consumerPolicy=do_not_use_as_negative_evidence`.

### Required non-goal

S5 should not turn target-scoped CVE provider failure into:

- `completed_no_hit`;
- empty `cves=[]` without diagnostic status;
- plain HTTP `408`/`500` with no acquisition envelope.

### Suggested tests

Add tests for:

1. NVD/OSV timeout during target-scoped CVE acquisition;
2. provider/client exception during target-scoped CVE acquisition;
3. response body remains `AcquisitionEnvelopeV1`;
4. top-level and per-item statuses are `timeout` or `error`;
5. `consumerPolicy=do_not_use_as_negative_evidence`;
6. S3 can distinguish this from completed no-hit.

---

## Required fix 3 — do not aggregate no-hit plus failures as a hit

### Location

`services/knowledge-base/app/routers/target_context_api.py:528-529`

### Problem

For a CVE batch containing mixed item states, the current top-level aggregation condition treats `completed_no_hit` as a positive outcome. As a result, a batch like:

```text
item A: completed_no_hit
item B: input_insufficient / timeout / not_ready / error
```

can produce top-level:

```json
{
  "acquisitionStatus": "partial_hit"
}
```

This is semantically wrong. There is no real hit in the batch.

`partial_hit` should mean at least one item produced an actual `completed_hit`, while other items are incomplete/caveated. A completed no-hit is not a hit.

### Why this matters to S3

S3 uses top-level acquisition status to summarize an acquisition call and item-level status to build diagnostics. If no item has a real hit, S5 must not advertise a hit at the aggregate level.

Otherwise S3 may overstate knowledge acquisition quality and incorrectly prioritize or caveat claims.

### Required aggregation semantics

S5 should aggregate item states roughly as follows:

| Item mix | Top-level `acquisitionStatus` |
|---|---|
| one or more `completed_hit`, all others successful/caveated | `completed_hit` or `partial_hit` depending on whether all items were complete |
| one or more `completed_hit` plus timeout/error/input_insufficient | `partial_hit` |
| all completed no-hit | `completed_no_hit` |
| completed no-hit plus timeout/error/input_insufficient/not_ready | `incomplete_acquisition` or equivalent non-hit/inconclusive status |
| all input insufficient | `input_insufficient` |
| all timeout | `timeout` |
| all not ready | `not_ready` |
| conflicting item evidence | `conflicting_evidence` if conflict is material |

Important rule:

```text
completed_no_hit must never count as a hit.
```

### Required behavior

S5 should:

- compute `has_real_hit` only from item statuses with `completed_hit`;
- compute `has_no_hit` separately from `completed_no_hit`;
- compute `has_incomplete_or_failure` from `timeout`, `not_ready`, `error`, `input_insufficient`, `incomplete_acquisition`, `stale_cache_only`, etc.;
- return `partial_hit` only if `has_real_hit` is true and at least one other item is incomplete/caveated;
- return `completed_no_hit` only when all relevant items completed no-hit under their explicit scopes;
- return `incomplete_acquisition` or similarly non-negative/inconclusive status when no-hit is mixed with failures.

### Suggested tests

Add tests for mixed batch aggregation:

1. `completed_hit + timeout` → top-level `partial_hit`;
2. `completed_no_hit + timeout` → top-level `incomplete_acquisition` or equivalent non-hit status;
3. `completed_no_hit + input_insufficient` → non-hit/inconclusive, not `partial_hit`;
4. all `completed_no_hit` → `completed_no_hit`;
5. all `input_insufficient` → `input_insufficient`;
6. `completed_hit + completed_no_hit` → probably `partial_hit` or `completed_hit` depending on S5's aggregate policy, but must remain clear through `itemAcquisitions[]`.

---

## S3 acceptance criteria for this fix WR

S3 will consider this WR handled when S5 provides evidence that:

1. Target-context graph projection is deadline-aware and cannot silently complete after caller budget as a successful ready ingest.
2. Target-scoped CVE timeout/error paths return `AcquisitionEnvelopeV1`, not only HTTP error envelopes.
3. Mixed item aggregation does not classify no-hit + failures as `partial_hit`.
4. `itemAcquisitions[]` remains authoritative for per-item status.
5. `completed_no_hit` remains scoped and is never treated as a positive hit.
6. Timeout/error/not-ready/input-insufficient states carry `consumerPolicy=do_not_use_as_negative_evidence` or `diagnostic_only`.
7. Tests cover the cases listed above.
8. S5 docs update the target-context/acquisition envelope semantics if those docs already exist in the patch.

## S3 consumption stance until fixed

Until these are fixed, S3 should not consume the target-scoped S5 acquisition path as authoritative. S3 may continue treating the implementation as experimental and should not map its top-level acquisition statuses into final S3 evidence semantics.

## Completion expectation

Please reply to S3 with:

1. Which aggregation vocabulary S5 chose for no-hit + failure mixtures.
2. How target-context graph persistence now honors `X-Timeout-Ms`.
3. How CVE provider timeout/error is converted into acquisition envelopes.
4. Test evidence.
5. Documentation updates, if any.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
