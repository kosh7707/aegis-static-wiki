---
title: "S5 Knowledge Base — Roadmap"
page_type: "canonical-roadmap"
canonical: true
source_refs:
  - "docs/s5-handoff/roadmap.md"
  - "wiki/canon/handoff/s5/session-s5-freeze-gate-implementation-20260520.md"
  - "wiki/canon/handoff/s5/session-s5-paper-observability-alignment-20260520.md"
  - "wiki/canon/handoff/s5/session-s5-log-analyzer-traceability-20260520.md"
last_verified: "2026-05-20"
service_tags: ["s5", "knowledge-base", "paper-context", "source-code-kg", "threat-kb", "observability"]
decision_tags: ["current-state", "post-freeze-gate", "e2e-smoke", "producer-boundary"]
related_pages: ["wiki/canon/specs/s5-current-implementation-snapshot-20260520.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/work-requests/s5-to-s3-s5-notice-e2e-smoke-ready-for-s5-paper-context-producer-scope.md", "wiki/canon/work-requests/s5-to-s3-s5-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-before-e.md"]
---

# S5 Knowledge Base — Roadmap

> Current as of 2026-05-20. This roadmap supersedes the older 2026-04 immediate-work list. Historical roadmap entries remain represented in older session pages and the one-track modernization plan.

## Current status

S5 is e2e-smoke ready for the S5-owned producer/context-provider boundary.

```text
S5 paper producer freeze gate: pass
S3 consumer execution status: pending_s3_owned_validation
Canonical JSONL/log-analyzer traceability: pass
Open S5 WRs at refresh: none
```

Use [[wiki/canon/specs/s5-current-implementation-snapshot-20260520]] as the active current-state snapshot.

---

## Immediate next work

| # | Work | Priority | Trigger / stop condition |
|---|---|---|---|
| 1 | Support S3 e2e smoke on S5 paper-context endpoints | High | Triggered by S3 smoke failures/WRs. Stop when S3 can consume S5 context rows/diagnostics without contract mismatch. |
| 2 | Preserve S5 producer boundary during smoke fixes | High | Any fix must keep `S5 hit != vulnerable`, `S5 no_hit != safe`, and no final TP/FP/UNKNOWN authority. |
| 3 | Keep canonical JSONL traceability intact | High | Any new paper endpoint/change must preserve `/home/kosh/AEGIS/logs/aegis-knowledge-base.jsonl`, `service=s5-kb`, numeric levels, requestId, lifecycle rows, and `log-analyzer.trace_request` visibility. |
| 4 | Coordinate commit hygiene for runtime/test artifacts | Medium | S2 owns commits. `services/knowledge-base/data/s5-ledger.sqlite` may be a local runtime/test artifact and must be reviewed before repository commit. |
| 5 | Add shared CI placement for `scripts/paper-freeze-gate.py` only if requested by S2/S3 | Medium | Current wrapper passes locally; broader CI ownership is outside S5 producer gate unless requested. |

---

## Recently completed — 2026-05-20

| Work | Result |
|---|---|
| S5 Paper Context API hard-now implementation | `GET /v1/contracts/paper-context` and `POST /v1/paper/{code-kb/prepare,finding-context/retrieve,threat-context/generic}` implemented. |
| S5_FREEZE_GATE | `s5FreezeGate=pass`, `validationSuiteVersion=s5-paper-freeze-gate-v1`, `missingValidationItems=[]`; S3 consumer execution remains pending/S3-owned. |
| Paper observability alignment | Paper endpoints emit request-id lifecycle logs with S5 producer/retrieval IDs where applicable. |
| No absolute paper timeout semantics | `X-Timeout-Ms` optional/positive-only compatibility hint; not a semantic terminal deadline. |
| Canonical JSONL/log-analyzer proof | Live proof request IDs appeared in `/home/kosh/AEGIS/logs/aegis-knowledge-base.jsonl`; `log-analyzer.trace_request` found all proof IDs. |
| S3 readiness notice/reply WRs | S5 sent e2e-smoke readiness notice and canonical logging traceability reply. |

Verification evidence retained in current docs/session history:

```text
Paper/freeze/observability focused: 53 passed
S5 freeze wrapper: pass
Full S5 service-root suite: 765 passed
Paper observability/API focused after live log proof: 18 passed in 37.47s
git diff --check -- services/knowledge-base: pass
```

---

## Near-term post-smoke candidates

These are deliberately gated by actual S3/S4 smoke evidence rather than speculative redesign.

| Candidate | Why | Guardrail |
|---|---|---|
| Paper context schema refinements | If S3 finds consumer-shape holes during e2e smoke | Must update `wiki/canon/api/s5-paper-context-api.md` and tests first. |
| Source KG fixture/dataset hardening | If S3 needs stronger prepared-context examples or reproducible target cases | Must not synthesize readiness from paths alone. |
| Generic Threat KB row quality improvements | If smoke reveals low-value rows for paper packets | Must preserve generic visibility and hidden CVE/fix/advisory redaction. |
| Freeze-gate fixture export ergonomics | If S3 wants automated fixture import | Must keep S3 consumer execution S3-owned. |
| Broader benchmark/golden-set expansion | If paper metrics need stronger RQ evidence | Must not treat offline quality labels as runtime final verdicts. |

---

## Longer-term backlog

| Work | Status | Notes |
|---|---|---|
| Code graph multi-snapshot coexistence | Backlog | Current code graph remains effectively project-active/snapshot-seam oriented; multi-snapshot persistence needs a separate design. |
| Graph-aware benchmark oracle expansion | Backlog | Existing graph-aware compare proved Neo4j uplift; post-smoke evidence should drive next oracle additions. |
| Source-specific ETL partial build/cache fallback | Backlog | Historical all-or-nothing ETL limitation remains lower priority than paper smoke. |
| Source integrity/checksum expansion | Backlog/partially addressed in Source KG contracts | Preserve redaction and payload-budget policies. |
| Large-project code graph stress validation | Backlog | RE100-scale historical evidence is not enough for large target claims. |

---

## Historical completed milestones

- 2026-04-02 to 2026-04-07: Qdrant file/server support, benchmark framework, graph-aware compare, threat-search readiness hardening, provenance seam, optional provenance warning noise reduction.
- 2026-05-11 to 2026-05-12: acquisition modernization, evidence-grounded Threat KB, Source Code KG/Judge contracts, retrieval quality modernization.
- 2026-05-19 to 2026-05-20: TraceAudit paper-context API, S5_FREEZE_GATE, observability alignment, canonical JSONL/log-analyzer readiness.
