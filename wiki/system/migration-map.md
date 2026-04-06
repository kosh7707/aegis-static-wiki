---
title: "Migration map"
page_type: "system-migration-map"
canonical: false
source_refs:
  - "../../../.omx/plans/prd-aegis-static-wiki.md"
  - "SOURCE_DOCS_ROOT (default: sibling AEGIS/docs)"
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
| docs/AEGIS.md | wiki/canon/charter/aegis.md | charter | canonicalized | migrated into canonical wiki |
| docs/api/adapter-api.md | wiki/canon/api/adapter-api.md | api | canonicalized | migrated into canonical wiki |
| docs/api/analysis-agent-api.md | wiki/canon/api/analysis-agent-api.md | api | canonicalized | migrated into canonical wiki |
| docs/api/build-agent-api.md | wiki/canon/api/build-agent-api.md | api | canonicalized | migrated into canonical wiki |
| docs/api/knowledge-base-api.md | wiki/canon/api/knowledge-base-api.md | api | canonicalized | migrated into canonical wiki |
| docs/api/llm-engine-api.md | wiki/canon/api/llm-engine-api.md | api | canonicalized | migrated into canonical wiki |
| docs/api/llm-gateway-api.md | wiki/canon/api/llm-gateway-api.md | api | canonicalized | migrated into canonical wiki |
| docs/api/sast-runner-api.md | wiki/canon/api/sast-runner-api.md | api | canonicalized | migrated into canonical wiki |
| docs/api/shared-models.md | wiki/canon/api/shared-models.md | api | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/architecture.md | wiki/canon/handoff/s1/architecture.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/qa-guide.md | wiki/canon/handoff/s1/qa-guide.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/README.md | wiki/canon/handoff/s1/readme.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/roadmap.md | wiki/canon/roadmap/s1-roadmap.md | roadmap | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-1.md | wiki/canon/handoff/s1/session-1.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-10.md | wiki/canon/handoff/s1/session-10.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-11.md | wiki/canon/handoff/s1/session-11.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-12.md | wiki/canon/handoff/s1/session-12.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-13.md | wiki/canon/handoff/s1/session-13.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-15.md | wiki/canon/handoff/s1/session-15.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-2.md | wiki/canon/handoff/s1/session-2.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-3.md | wiki/canon/handoff/s1/session-3.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-4.md | wiki/canon/handoff/s1/session-4.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-5.md | wiki/canon/handoff/s1/session-5.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-6.md | wiki/canon/handoff/s1/session-6.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-7.md | wiki/canon/handoff/s1/session-7.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-8.md | wiki/canon/handoff/s1/session-8.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s1-handoff/session-9.md | wiki/canon/handoff/s1/session-9.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/api-endpoints.md | wiki/canon/handoff/s2/api-endpoints.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/architecture.md | wiki/canon/handoff/s2/architecture.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/README.md | wiki/canon/handoff/s2/readme.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/roadmap.md | wiki/canon/roadmap/s2-roadmap.md | roadmap | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-1.md | wiki/canon/handoff/s2/session-1.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-10.md | wiki/canon/handoff/s2/session-10.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-11.md | wiki/canon/handoff/s2/session-11.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-12.md | wiki/canon/handoff/s2/session-12.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-13.md | wiki/canon/handoff/s2/session-13.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-14.md | wiki/canon/handoff/s2/session-14.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-15.md | wiki/canon/handoff/s2/session-15.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-2.md | wiki/canon/handoff/s2/session-2.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-3.md | wiki/canon/handoff/s2/session-3.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-4.md | wiki/canon/handoff/s2/session-4.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-5.md | wiki/canon/handoff/s2/session-5.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-6.md | wiki/canon/handoff/s2/session-6.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-7.md | wiki/canon/handoff/s2/session-7.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-8.md | wiki/canon/handoff/s2/session-8.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s2-handoff/session-9.md | wiki/canon/handoff/s2/session-9.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/README.md | wiki/canon/handoff/s3/readme.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/roadmap.md | wiki/canon/roadmap/s3-roadmap.md | roadmap | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-10.md | wiki/canon/handoff/s3/session-10.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-11.md | wiki/canon/handoff/s3/session-11.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-12.md | wiki/canon/handoff/s3/session-12.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-13.md | wiki/canon/handoff/s3/session-13.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-14.md | wiki/canon/handoff/s3/session-14.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-15.md | wiki/canon/handoff/s3/session-15.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-16.md | wiki/canon/handoff/s3/session-16.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-17.md | wiki/canon/handoff/s3/session-17.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-18.md | wiki/canon/handoff/s3/session-18.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-19.md | wiki/canon/handoff/s3/session-19.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-20.md | wiki/canon/handoff/s3/session-20.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-21.md | wiki/canon/handoff/s3/session-21.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-22.md | wiki/canon/handoff/s3/session-22.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-23.md | wiki/canon/handoff/s3/session-23.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-24.md | wiki/canon/handoff/s3/session-24.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-25.md | wiki/canon/handoff/s3/session-25.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-5.md | wiki/canon/handoff/s3/session-5.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-6.md | wiki/canon/handoff/s3/session-6.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-7.md | wiki/canon/handoff/s3/session-7.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-8.md | wiki/canon/handoff/s3/session-8.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s3-handoff/session-9.md | wiki/canon/handoff/s3/session-9.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/build-snapshot-consumer-seam.md | wiki/canon/handoff/s4/build-snapshot-consumer-seam.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/README.md | wiki/canon/handoff/s4/readme.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/roadmap.md | wiki/canon/roadmap/s4-roadmap.md | roadmap | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-1.md | wiki/canon/handoff/s4/session-1.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-2.md | wiki/canon/handoff/s4/session-2.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-3.md | wiki/canon/handoff/s4/session-3.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-4.md | wiki/canon/handoff/s4/session-4.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-5.md | wiki/canon/handoff/s4/session-5.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-6.md | wiki/canon/handoff/s4/session-6.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-7.md | wiki/canon/handoff/s4/session-7.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-8.md | wiki/canon/handoff/s4/session-8.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s4-handoff/session-9.md | wiki/canon/handoff/s4/session-9.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/architecture.md | wiki/canon/handoff/s5/architecture.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/README.md | wiki/canon/handoff/s5/readme.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/roadmap.md | wiki/canon/roadmap/s5-roadmap.md | roadmap | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-1.md | wiki/canon/handoff/s5/session-1.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-10.md | wiki/canon/handoff/s5/session-10.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-11.md | wiki/canon/handoff/s5/session-11.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-12.md | wiki/canon/handoff/s5/session-12.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-13.md | wiki/canon/handoff/s5/session-13.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-14.md | wiki/canon/handoff/s5/session-14.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-15.md | wiki/canon/handoff/s5/session-15.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-16.md | wiki/canon/handoff/s5/session-16.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-17.md | wiki/canon/handoff/s5/session-17.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-18.md | wiki/canon/handoff/s5/session-18.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-19.md | wiki/canon/handoff/s5/session-19.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-2.md | wiki/canon/handoff/s5/session-2.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-20.md | wiki/canon/handoff/s5/session-20.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-3.md | wiki/canon/handoff/s5/session-3.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-4.md | wiki/canon/handoff/s5/session-4.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-5.md | wiki/canon/handoff/s5/session-5.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-6.md | wiki/canon/handoff/s5/session-6.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-7.md | wiki/canon/handoff/s5/session-7.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-8.md | wiki/canon/handoff/s5/session-8.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s5-handoff/session-9.md | wiki/canon/handoff/s5/session-9.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s6-handoff/README.md | wiki/canon/handoff/s6/readme.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s6-handoff/roadmap.md | wiki/canon/roadmap/s6-roadmap.md | roadmap | canonicalized | migrated into canonical wiki |
| docs/s6-handoff/session-1.md | wiki/canon/handoff/s6/session-1.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s6-handoff/session-2.md | wiki/canon/handoff/s6/session-2.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s6-handoff/session-3.md | wiki/canon/handoff/s6/session-3.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/architecture.md | wiki/canon/handoff/s7/architecture.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/llm-engine-ops.md | wiki/canon/handoff/s7/llm-engine-ops.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/README.md | wiki/canon/handoff/s7/readme.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/roadmap.md | wiki/canon/roadmap/s7-roadmap.md | roadmap | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-1.md | wiki/canon/handoff/s7/session-1.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-10.md | wiki/canon/handoff/s7/session-10.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-11.md | wiki/canon/handoff/s7/session-11.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-2.md | wiki/canon/handoff/s7/session-2.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-3.md | wiki/canon/handoff/s7/session-3.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-4.md | wiki/canon/handoff/s7/session-4.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-5.md | wiki/canon/handoff/s7/session-5.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-6.md | wiki/canon/handoff/s7/session-6.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-7.md | wiki/canon/handoff/s7/session-7.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-8.md | wiki/canon/handoff/s7/session-8.md | handoff | canonicalized | migrated into canonical wiki |
| docs/s7-handoff/session-9.md | wiki/canon/handoff/s7/session-9.md | handoff | canonicalized | migrated into canonical wiki |
| docs/specs/adapter.md | wiki/canon/specs/adapter.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/analysis-agent.md | wiki/canon/specs/analysis-agent.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/backend.md | wiki/canon/specs/backend.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/build-agent.md | wiki/canon/specs/build-agent.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/ecu-simulator.md | wiki/canon/specs/ecu-simulator.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/frontend.md | wiki/canon/specs/frontend.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/knowledge-base.md | wiki/canon/specs/knowledge-base.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/llm-engine.md | wiki/canon/specs/llm-engine.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/llm-gateway.md | wiki/canon/specs/llm-gateway.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/observability.md | wiki/canon/specs/observability.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/sast-runner.md | wiki/canon/specs/sast-runner.md | specs | canonicalized | migrated into canonical wiki |
| docs/specs/technical-overview.md | wiki/canon/specs/technical-overview.md | specs | canonicalized | migrated into canonical wiki |
| docs/work-requests/s2-to-all-omx-memory-discipline.md | wiki/canon/work-requests/s2-to-all-omx-memory-discipline.md | work-requests | canonicalized | migrated into canonical wiki |
| docs/work-requests/s2-to-s1-backend-contract-alignment.md | wiki/canon/work-requests/s2-to-s1-backend-contract-alignment.md | work-requests | canonicalized | migrated into canonical wiki |
| docs/work-requests/s2-to-s1-contract-lockdown-fyi.md | wiki/canon/work-requests/s2-to-s1-contract-lockdown-fyi.md | work-requests | canonicalized | migrated into canonical wiki |
| docs/work-requests/s3-to-s3-prompt-enhancement-backlog.md | wiki/canon/work-requests/s3-to-s3-prompt-enhancement-backlog.md | work-requests | canonicalized | migrated into canonical wiki |
| docs/work-requests/s4-to-s2-build-path-boundary-inversion-notice.md | wiki/canon/work-requests/s4-to-s2-build-path-boundary-inversion-notice.md | work-requests | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_00_project_direction.md | wiki/canon/feedback/26.03.25/aegis_00_project_direction.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_review_index.md | wiki/canon/feedback/26.03.25/aegis_review_index.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_S1_frontend_QA_review.md | wiki/canon/feedback/26.03.25/aegis_s1_frontend_qa_review.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_S2_backend_orchestrator_review.md | wiki/canon/feedback/26.03.25/aegis_s2_backend_orchestrator_review.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_S3_agents_review.md | wiki/canon/feedback/26.03.25/aegis_s3_agents_review.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_S4_sast_runner_review.md | wiki/canon/feedback/26.03.25/aegis_s4_sast_runner_review.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_S5_knowledge_base_review.md | wiki/canon/feedback/26.03.25/aegis_s5_knowledge_base_review.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_S6_dynamic_analysis_review.md | wiki/canon/feedback/26.03.25/aegis_s6_dynamic_analysis_review.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.25/AEGIS_S7_llm_gateway_review.md | wiki/canon/feedback/26.03.25/aegis_s7_llm_gateway_review.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.26/(WR)S3_agent_architecture_review_request.md | wiki/canon/feedback/26.03.26/(wr)s3_agent_architecture_review_request.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.26/(WR)S4_sast_runner_review_request.md | wiki/canon/feedback/26.03.26/(wr)s4_sast_runner_review_request.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.26/(WR)S5_etl_pipeline_overview.md | wiki/canon/feedback/26.03.26/(wr)s5_etl_pipeline_overview.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.26/S3_agent_architecture_feedback.md | wiki/canon/feedback/26.03.26/s3_agent_architecture_feedback.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.26/S4_sast_runner_feedback.md | wiki/canon/feedback/26.03.26/s4_sast_runner_feedback.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/26.03.26/S5_etl_pipeline_feedback.md | wiki/canon/feedback/26.03.26/s5_etl_pipeline_feedback.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/agent_service_architecture_overview.md | wiki/canon/feedback/agent_service_architecture_overview.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/README_ecu_platform_docs.md | wiki/canon/feedback/readme_ecu_platform_docs.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/S1_frontend_working_guide.md | wiki/canon/feedback/s1_frontend_working_guide.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/S2_backend_adapter_simulator_working_guide.md | wiki/canon/feedback/s2_backend_adapter_simulator_working_guide.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/S3_agentic_sast_design_feedback.md | wiki/canon/feedback/s3_agentic_sast_design_feedback.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/S3_llm_gateway_working_guide.md | wiki/canon/feedback/s3_llm_gateway_working_guide.md | feedback | canonicalized | migrated into canonical wiki |
| docs/외부피드백/S5_etl_pipeline_feedback.md | wiki/canon/feedback/s5_etl_pipeline_feedback.md | feedback | canonicalized | migrated into canonical wiki |
