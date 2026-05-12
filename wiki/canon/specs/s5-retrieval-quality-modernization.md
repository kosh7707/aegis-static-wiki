---
title: "S5 Retrieval Quality Modernization"
page_type: "canonical-spec"
canonical: true
source_refs:
  - ".omx/research/s5-modernization-models-and-retrieval-20260511.md"
  - ".omx/reports/s5-retrieval-quality-lab-20260511.json"
last_verified: "2026-05-11"
service_tags: ["s5"]
decision_tags: ["retrieval-policy-v1", "lexical-signal-v1", "retrieval-quality-lab-v1", "etl-source-coverage-delta", "model-registry-v1"]
related_pages: ["wiki/canon/specs/knowledge-base.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/roadmap/s5-knowledge-acquisition-modernization-one-track.md"]
---

# S5 Retrieval Quality Modernization

2026-05-11 S5 modernization applies a deterministic retrieval-quality upgrade to `services/knowledge-base/**`.

## Applied contract

- `top_k` means final returned count.
- `candidate_pool_k` means the broader internal exact/vector/graph/lexical pool used before rerank/truncation.
- Runtime traces expose `candidatePoolSize`, `candidatePoolPolicy`, `topKPolicy`, `rerankerPolicy`, `modelPolicy`, `lexicalSignals`, and per-hit `scoreBreakdown`.
- Keyword/lexical, embedding-only, and global embedding misses remain unsafe no-hit bases and cannot become negative evidence.

## Runtime default

S5 keeps the existing dependency-stable embedding model for this goal and records modern candidates in `app/graphrag/model_registry.py`. The default reranker is deterministic and method-aware, not model-backed.

## Lexical signal scope

`app/graphrag/lexical_signals.py` normalizes C/C++ identifiers, namespaces, paths, macros, dangerous API tokens, package/CVE aliases, and embedded/ICS terms. Signals are weak/contextual candidate-generation and ranking signals only.

## ETL source coverage delta

`CAPEC`, `ATTACK_ICS`, and `ATTACK_ENTERPRISE` move from manifest-only declarations to completed sample fixture coverage through CAPEC-88, ATT&CK ICS T0807, and ATT&CK Enterprise T1059 raw fixtures. This is sample fixture coverage, not production-scale full ingestion.

## Offline quality lab

`app/evaluation/retrieval_quality_lab.py` and `fixtures/retrieval-quality-lab-v1/manifest.json` provide an offline quality report with method/queryIntent/corpus/profile breakdowns. Offline metrics stay outside runtime observations.
