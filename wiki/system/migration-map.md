---
title: "Migration map"
page_type: "system-migration-map"
canonical: false
source_refs:
  - "../../../.omx/plans/prd-aegis-static-wiki.md"
  - "/home/kosh/projects/AEGIS-codex-safety-20260403/docs"
last_verified: "2026-04-05"
service_tags: ["platform"]
decision_tags: ["migration", "cutover"]
related_pages:
  - "./taxonomy.md"
  - "./index.md"
---

# Migration Map

This file is the authoritative old-path to new-path ledger during phased cutover.

## Status meanings
- `planned` — target location agreed but not migrated yet
- `mirrored` — copied over, but old location may still be transitional
- `canonicalized` — new wiki path is canonical for the bucket/page

## Bucket cutover rule
Cutover should happen by bucket, not file-by-file. Once a bucket is canonicalized, old locations should become pointer or redirect stubs rather than active canonical content.

| old path | new path | bucket | status | notes |
|---|---|---|---|---|
| docs/AEGIS.md | wiki/canon/charter/aegis.md | charter | canonicalized | global platform charter |
| docs/specs/adapter.md | wiki/canon/specs/adapter.md | specs | canonicalized | seed migration |
| docs/specs/analysis-agent.md | wiki/canon/specs/analysis-agent.md | specs | canonicalized | seed migration |
| docs/specs/backend.md | wiki/canon/specs/backend.md | specs | canonicalized | seed migration |
| docs/specs/build-agent.md | wiki/canon/specs/build-agent.md | specs | canonicalized | seed migration |
| docs/specs/ecu-simulator.md | wiki/canon/specs/ecu-simulator.md | specs | canonicalized | seed migration |
| docs/specs/frontend.md | wiki/canon/specs/frontend.md | specs | canonicalized | seed migration |
| docs/specs/knowledge-base.md | wiki/canon/specs/knowledge-base.md | specs | canonicalized | seed migration |
| docs/specs/llm-engine.md | wiki/canon/specs/llm-engine.md | specs | canonicalized | seed migration |
| docs/specs/llm-gateway.md | wiki/canon/specs/llm-gateway.md | specs | canonicalized | seed migration |
| docs/specs/observability.md | wiki/canon/specs/observability.md | specs | canonicalized | seed migration |
| docs/specs/sast-runner.md | wiki/canon/specs/sast-runner.md | specs | canonicalized | seed migration |
| docs/specs/technical-overview.md | wiki/canon/specs/technical-overview.md | specs | canonicalized | seed migration |
| docs/api/adapter-api.md | wiki/canon/api/adapter-api.md | api | canonicalized | seed migration |
| docs/api/analysis-agent-api.md | wiki/canon/api/analysis-agent-api.md | api | canonicalized | seed migration |
| docs/api/build-agent-api.md | wiki/canon/api/build-agent-api.md | api | canonicalized | seed migration |
| docs/api/knowledge-base-api.md | wiki/canon/api/knowledge-base-api.md | api | canonicalized | seed migration |
| docs/api/llm-engine-api.md | wiki/canon/api/llm-engine-api.md | api | canonicalized | seed migration |
| docs/api/llm-gateway-api.md | wiki/canon/api/llm-gateway-api.md | api | canonicalized | seed migration |
| docs/api/sast-runner-api.md | wiki/canon/api/sast-runner-api.md | api | canonicalized | seed migration |
| docs/api/shared-models.md | wiki/canon/api/shared-models.md | api | canonicalized | seed migration |
| docs/s*-handoff/** | wiki/canon/handoff/** | handoff | planned | bucket migration pending |
| docs/work-requests/** | wiki/canon/work-requests/** | work-requests | planned | bucket migration pending |
| docs/외부피드백/** | wiki/canon/feedback/** | feedback | planned | bucket migration pending |
| docs/*-handoff/roadmap.md | wiki/canon/roadmap/** | roadmap | planned | bucket migration pending |
