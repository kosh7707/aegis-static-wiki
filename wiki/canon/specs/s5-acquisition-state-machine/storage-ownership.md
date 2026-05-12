---
title: "S5 Storage Ownership"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/s5-acquisition-state-machine/readme.md"
  - "User S5 storage discussion, 2026-05-11"
last_verified: "2026-05-11"
service_tags: ["s5", "s2", "s3", "knowledge-base", "storage", "neo4j", "qdrant"]
decision_tags: ["storage-ownership", "sql-ledger-source-of-truth", "s5-owned-db", "s2-boundary", "projection-not-ledger"]
related_pages: ["wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s5-acquisition-state-machine/projection-lifecycle.md", "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/backend.md"]
---

# S5 Storage Ownership

> Decision: S5 owns a durable SQL ledger. Neo4j and Qdrant are projections. S2 DB is not S5 acquisition source of truth.

---

## 1. Ownership matrix

| Store | Owner | Role | May be source of truth for acquisition? |
|---|---|---|---:|
| S5 SQL ledger | S5 | Target contexts, acquisition runs/items, provider observations, projection states | Yes |
| Neo4j | S5 | Graph projection/query index for threat/code relationships | No |
| Qdrant | S5 | Vector projection/query index for threat/code semantic search | No |
| S2 DB | S2 | Project/workflow/report/user-facing orchestration | No |
| S5 provider caches | S5 | Performance/freshness cache for external providers | No, unless copied into provider observation rows |
| Logs | Each service | Operational trace/debugging | No |

S2 may store references such as `targetKnowledgeId`, `targetContextVersion`, `acquisitionId`, and evidence/report IDs. S2 must not be required to reconstruct S5 acquisition truth.

---

## 2. Physical deployment choices

The decision is about logical ownership, not necessarily separate hardware.

Acceptable alpha option:

```text
services/knowledge-base/data/s5-ledger.sqlite
AEGIS_KB_LEDGER_URL=sqlite:///data/s5-ledger.sqlite
```

Acceptable production options:

```text
postgres database: aegis_s5_knowledge
```

or

```text
shared postgres cluster
  schema: s2_app
  schema: s5_ledger   <-- owned/migrated only by S5
```

Not acceptable:

```text
S5 acquisition rows live only in S2 application tables.
Neo4j/Qdrant are treated as authoritative historical acquisition ledgers.
JSON files remain the only durable acquisition history after alpha.
```

---

## 3. Minimal ledger entities

```mermaid
erDiagram
    TARGET_CONTEXT ||--o{ TARGET_CONTEXT_VERSION : has
    TARGET_CONTEXT_VERSION ||--o{ ACQUISITION_RUN : scopes
    ACQUISITION_RUN ||--o{ ACQUISITION_ITEM : contains
    ACQUISITION_RUN ||--o{ PROVIDER_OBSERVATION : records
    ACQUISITION_ITEM ||--o{ PROVIDER_OBSERVATION : may_reference
    TARGET_CONTEXT_VERSION ||--o{ PROJECTION_STATE : drives
    ACQUISITION_RUN ||--o{ PROJECTION_STATE : may_drive
    PROJECTION_STATE ||--o{ PROJECTION_JOB : updates

    TARGET_CONTEXT {
      string targetKnowledgeId PK
      string projectId
      string targetId
      int latestVersion
      datetime createdAt
      datetime updatedAt
    }
    TARGET_CONTEXT_VERSION {
      string targetContextVersionId PK
      string targetKnowledgeId FK
      int version
      string inputHash
      json bundleJson
      int supersedesVersion
      datetime createdAt
    }
    ACQUISITION_RUN {
      string acquisitionId PK
      string targetContextVersionId FK
      string surface
      string scopeHash
      string runStatus
      string acquisitionStatus
      string qualityGate
      string consumerPolicy
      datetime createdAt
      datetime completedAt
    }
    ACQUISITION_ITEM {
      string acquisitionItemId PK
      string acquisitionId FK
      string itemKey
      string itemType
      string acquisitionStatus
      string consumerPolicy
      json resultJson
    }
    PROVIDER_OBSERVATION {
      string observationId PK
      string acquisitionId FK
      string provider
      string method
      string status
      datetime observedAt
      json payloadJson
    }
    PROJECTION_STATE {
      string projectionStateId PK
      string sourceKind
      string sourceId
      string projectionTarget
      string state
      string sourceVersionHash
    }
    PROJECTION_JOB {
      string projectionJobId PK
      string projectionStateId FK
      string state
      int attemptCount
    }
```

---

## 4. Boundary rules

### S5 ledger

- Owns `TargetContextBundleV1` normalized bundle snapshots.
- Owns `AcquisitionEnvelopeV1` terminal snapshots.
- Owns per-item status and fallback/diagnostic history.
- Owns provider observation provenance and cache freshness decisions.
- Owns projection state and retry history.

### Neo4j

- Stores graph projections of target context, code graph, threat relations, CVE/library relationships, and acquired facts when useful for graph queries.
- Must carry ledger IDs/provenance so every graph fact can trace back to ledger source.
- Must not be the only place where acquisition outcome or fallback diagnostics live.

### Qdrant

- Stores vector projections of threat/code/acquisition text embeddings where useful for semantic retrieval.
- Must include payload pointers to ledger IDs, target context version, and projection version.
- Must not decide freshness or historical truth by itself.

### S2 DB

- Stores user/project/workflow/report state.
- May store S5 refs for report traceability.
- Must call S5 API to inspect acquisition truth.

---

## 5. Migration from current implementation

Current implementation:

```text
data/target-contexts.json = target context version bootstrap store
acquisition envelopes = response-owned/transient
```

Target implementation:

```text
S5 SQL ledger stores both target context versions and acquisition envelopes/items.
Current JSON file becomes dev-only, migrated, or wrapped by a repository interface.
```

Recommended migration path:

1. Introduce `LedgerRepository` interface with SQLite implementation.
2. Move target context store behind the repository.
3. Persist every target-scoped acquisition run and item envelope.
4. Add projection state rows for Neo4j/Qdrant writes.
5. Add read APIs for acquisition history/status.
6. Retire JSON store or make it an explicit local-dev fallback only.
