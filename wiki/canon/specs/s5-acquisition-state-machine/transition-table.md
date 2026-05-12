---
title: "S5 Acquisition State Machine Transition Table"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/s5-acquisition-state-machine/readme.md"
last_verified: "2026-05-11"
service_tags: ["s5", "s3", "knowledge-base", "state-machine", "transition-table"]
decision_tags: ["transition-table", "implementation-facing", "state-machine", "durable-ledger"]
related_pages: ["wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s5-acquisition-state-machine/target-context-lifecycle.md", "wiki/canon/specs/s5-acquisition-state-machine/acquisition-run-statechart.md", "wiki/canon/specs/s5-acquisition-state-machine/item-acquisition-lifecycle.md", "wiki/canon/specs/s5-acquisition-state-machine/projection-lifecycle.md", "wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md"]
---

# S5 Acquisition State Machine Transition Table

Implementation-facing transition rows for the S5 acquisition state-machine family.

---

## 1. Target context transitions

| From | Event/guard | To | Required action | S3-visible effect |
|---|---|---|---|---|
| `BundleReceived` | request body is not object | `RejectedInputInsufficient` | Record rejection if possible | `input_insufficient`, `do_not_use` |
| `IdentityValidating` | missing project/target/build identity | `RejectedInputInsufficient` | Do not synthesize global target; persist diagnostic only if safe | No `targetKnowledgeId` |
| `IdentityValidating` | identity ok | `ContextHashComputed` | Normalize bundle and compute hash | `targetContextInputHash` available |
| `ContextHashComputed` | same target/build/hash exists | `VersionReused` | Return existing version, update `lastIngestedAt` | `results.reused=true` |
| `ContextHashComputed` | new/changed input | `VersionCreated` | Insert version, link superseded version | New `targetContextVersion` |
| `LedgerCommitted` | no graph/vector material | `Ready` | Mark projection not required | Target-scoped acquisition allowed |
| `LedgerCommitted` | projection material present | `ProjectionPlanned` | Create projection jobs/states | Ingest may return projection pending/debt |
| `Projecting` | all projections synced | `Ready` | Mark projection states synced | Graph/vector-dependent surfaces usable |
| `Projecting` | any projection partial/failed | `ReadyWithProjectionDebt` | Persist projection diagnostics | Empty graph/vector result cannot be negative evidence |
| `Ready/ReadyWithProjectionDebt` | newer version committed | `Superseded` | Keep auditable old version | Acquisitions must show bound version |

---

## 2. Acquisition run transitions

| From | Event/guard | To | Required action | S3-visible effect |
|---|---|---|---|---|
| `RequestReceived` | target missing/unknown | `RejectedInputInsufficient` | Persist request diagnostic if requestId exists | `input_insufficient` |
| `ContextResolved` | scope invalid | `RejectedInputInsufficient` | Persist run/item diagnostic when target known | `input_insufficient` item/envelope |
| `ScopeNormalizing` | scope valid | `RunRecorded` | Insert acquisition run with `runStatus=accepted` | `acquisitionId` allocated |
| `AcquisitionPlanning` | required provider/index unavailable | `NotReadyTerminal` | Terminal envelope with `not_ready` | Not no-hit |
| `AcquisitionPlanning` | plan ready | `Acquiring` | Mark run running, record method plan | Methods visible |
| `Acquiring` | provider/index returns | `ItemReducing` | Normalize provider observations | Item classification begins |
| `Acquiring` | target-context graph/vector projection deadline exceeded | `TimeoutTerminal` | Return ingest `AcquisitionEnvelopeV1` with `TARGET_CONTEXT_GRAPH_PROJECTION_TIMEOUT`; do not mark projection ready | Not no-hit |
| `Acquiring` | CVE provider deadline exceeded | `TimeoutTerminal` | Return top-level and per-item CVE `AcquisitionEnvelopeV1` with `CVE_PROVIDER_TIMEOUT` | Not no-hit |
| `Acquiring` | provider/index unexpected failure | `ErrorTerminal` | Persist/return error envelope when target context is known | Not no-hit |
| `ItemReducing` | all items classified | `EnvelopeClassifying` | Aggregate top-level envelope from items | Mixed outcomes preserved |
| `EnvelopeClassifying` | envelope built | `LedgerCommitting` | Persist envelope/items/provider observations | Replayable/auditable |
| `LedgerCommitting` | no projection needed | `Completed` | `runStatus=completed` | Check acquisition status/policy |
| `LedgerCommitting` | projection needed | `ProjectionSyncPlanned` | Create projection jobs | Query indexes may lag |
| `ProjectionSyncing` | synced | `Completed` | Mark projection state synced | Normal projection-dependent use |
| `ProjectionSyncing` | partial/failed | `CompletedWithProjectionDebt` | Persist projection debt | Empty projection query not negative evidence |

---

## 3. Item transitions

| From | Event/guard | To | Required action | Wire mapping |
|---|---|---|---|---|
| `InputChecked` | missing required item field | `InputInsufficient` | Diagnostic with missing/invalid fields | `input_insufficient` |
| `InputChecked` | conflicting evidence | `ConflictingEvidence` | Preserve conflicting refs/diagnostics | `conflicting_evidence` |
| `InputChecked` | usable | `MethodPlanned` | Persist methods required for no-hit | `methodsAttempted` seed |
| `MethodPlanned` | provider/index unavailable | `NotReady` | Diagnostic provider/index missing | `not_ready` |
| `Acquiring` | primary unavailable but fallback allowed | `FallbackPlanned` | Add `fallbackTrace` with confidence impact | Caveat/policy lowered |
| `ResultClassified` | hit found | `CompletedHit` | Store result refs/payload | `completed_hit` |
| `ResultClassified` | no result and required methods complete | `CompletedNoHit` | Store completed methods | `completed_no_hit` + `scoped_no_hit_record_only` |
| `ResultClassified` | no result only after broad fallback | `FallbackNoResult` | Store fallback and caveat | `incomplete_acquisition` + `do_not_use_as_negative_evidence` |
| `ResultClassified` | stale cache only | `StaleCacheOnly` | Store cache timestamp/TTL/freshness | `stale_cache_only` |
| `Acquiring` | partial provider failure | `IncompleteAcquisition` | Store provider error/partial state | `incomplete_acquisition` |
| `Acquiring` | timeout | `Timeout` | Store timeout/deadline | `timeout` |
| `Acquiring` | unexpected error | `Error` | Store error diagnostic | `error` |

---

## 4. Projection transitions

| From | Event/guard | To | Required action | Dependent query rule |
|---|---|---|---|---|
| `Pending` | worker starts | `Projecting` | Increment attempt, mark start | Not no-hit safe |
| `Projecting` | all records projected | `Synced` | Store projected counts/hash | Empty results may be scoped no-hit if methods also complete |
| `Projecting` | some records failed | `Partial` | Store expected/projected counts and errors | Empty results not negative evidence |
| `Projecting` | projection failed | `Failed` | Store error and retry metadata | Surface should be `not_ready`/`incomplete` |
| `Synced` | source version superseded | `Stale` | Mark stale by sourceVersionHash mismatch | Empty results not negative evidence until reprojected |
| `Partial/Failed` | retry available | `Retrying` | Schedule idempotent retry | Progress/diagnostic only |
| `Retrying` | retry starts | `Projecting` | Repeat projection from ledger source | Projection remains non-authoritative |
| `Retrying` | retry exhausted/disabled | `Abandoned` | Store terminal projection debt | Requires human/operator or requeue |

---

## 5. Implementation guardrails

- Never derive `completed_no_hit` from `runStatus` alone.
- Never count `completed_no_hit` as a hit when aggregating mixed item states; `partial_hit` requires at least one real `completed_hit`.
- Never derive acquisition truth from Neo4j/Qdrant alone; derive from ledger and use projection state for query eligibility.
- Never allow S2 writes to mutate S5 acquisition run/item/provider/projection rows.
- Persist terminal envelopes before returning success where feasible.
- When persistence fails after provider results, return `error` or `incomplete_acquisition`; do not return a non-durable `completed_no_hit` as if it were auditable.
- For compatibility endpoints that remain response-owned, mark them outside the canonical durable S3 target-aware path unless they also persist to the S5 ledger.
