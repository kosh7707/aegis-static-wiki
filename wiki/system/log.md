---
title: "AEGIS static wiki log"
page_type: "system-log"
canonical: false
source_refs:
  - "../../../.omx/plans/prd-aegis-static-wiki-next-phase.md"
last_verified: "2026-04-05"
service_tags: ["platform"]
decision_tags: ["migration", "maintenance", "mcp"]
related_pages:
  - "./index.md"
  - "./migration-map.md"
  - "./writing-guide.md"
---

# Log

## [2026-04-05] bootstrap | repo spine initialized
- Created repo structure for canonical and context page families.
- Added AGENTS.md, README.md, schema guidance, and page templates.
- Added validation and seed-migration tooling.

## [2026-04-05] ingest | charter + specs + api seed migration
- Canonicalized `docs/AEGIS.md` into `wiki/canon/charter/aegis.md`.
- Canonicalized `docs/specs/**` into `wiki/canon/specs/**`.
- Canonicalized `docs/api/**` into `wiki/canon/api/**`.
- Added initial context pages that capture canonicality and retrieval decisions.

## [2026-04-05] migration | handoff bucket
- Migrated 95 canonical pages into wiki/canon/handoff.
- Updated migration-map.md and rebuilt the content index.

## [2026-04-05] migration | roadmap bucket
- Migrated 7 canonical pages into wiki/canon/roadmap.
- Updated migration-map.md and rebuilt the content index.

## [2026-04-05] migration | work-requests bucket
- Migrated 13 canonical pages into wiki/canon/work-requests.
- Updated migration-map.md and rebuilt the content index.

## [2026-04-05] migration | feedback bucket
- Migrated 22 canonical pages into wiki/canon/feedback.
- Updated migration-map.md and rebuilt the content index.

## [2026-04-05] maintenance | authoritative control files
- Promoted wiki/system/index.md, wiki/system/log.md, and wiki/system/writing-guide.md to authoritative control files.
- Aligned maintenance guidance with typed MCP operations.

## [2026-04-05] mcp | typed read-write wiki server
- Implemented typed MCP operations for list/read/search/backlinks/recent-changes/migration lookup.
- Implemented constrained write operations: write_page, append_log_entry, update_index, and record_migration_transition.

## [2026-04-06] migration | active AEGIS docs resync
- Resynced 163 canonical pages from /home/kosh/AEGIS/docs.
- Added newly discovered handoff/work-request pages and rebuilt migration-map.md plus index.md.

## [2026-04-06] maintenance | wiki-first governance cutover
- Updated the wiki instructions to make aegis-static-wiki the preferred agent-facing documentation surface.
- Removed stale absolute provenance paths from context/system control pages where they were not needed.

## [2026-04-06] maintenance | post-cutover residual docs validation model
- Rebased wiki validation/tests onto migration-map coverage plus the intentional AEGIS local residual docs surface.
- Added session-history and test-evidence policy pages plus MCP tools for session evidence recording.

## [2026-04-06] mcp | register_wr | s2-to-s3-wr-mcp-live-smoke
- Registered request WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-wr-mcp-live-smoke.md

## [2026-04-06] mcp | complete_wr | s2-to-s3-wr-mcp-live-smoke
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-06] mcp | register_wr | s2-to-s3-wr-mcp-smoke-test
- Registered request WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-wr-mcp-smoke-test.md

## [2026-04-06] mcp | complete_wr | s2-to-s3-wr-mcp-smoke-test
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-06] mcp | register_wr | s2-to-all-global-notice
- Registered notice WR for all
- Path: wiki/canon/work-requests/s2-to-all-global-notice.md

## [2026-04-06] mcp | complete_wr | s2-to-all-global-notice
- Lane s2 completed recipient-side handling
- Status: open

## [2026-04-06] mcp | register_wr | s1-to-s2-list_my_open_wrs-s1-wr
- Registered question WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-list_my_open_wrs-s1-wr.md

## [2026-04-06] mcp | register_wr | s2-to-s2-wr-mcp-canonical-smoke-test
- Registered request WR for s2
- Path: wiki/canon/work-requests/s2-to-s2-wr-mcp-canonical-smoke-test.md

## [2026-04-06] mcp | complete_wr | s2-to-s2-wr-mcp-canonical-smoke-test
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-06] mcp | register_wr | s2-to-s3-s4-wr-mcp-multi-recipient-smoke-test
- Registered request WR for s3, s4
- Path: wiki/canon/work-requests/s2-to-s3-s4-wr-mcp-multi-recipient-smoke-test.md

## [2026-04-06] mcp | register_wr | s2-to-all-wr-mcp-to-all-smoke-test
- Registered notice WR for all
- Path: wiki/canon/work-requests/s2-to-all-wr-mcp-to-all-smoke-test.md

## [2026-04-06] mcp | complete_wr | s2-to-s3-s4-wr-mcp-multi-recipient-smoke-test
- Lane s3 completed recipient-side handling
- Status: open

## [2026-04-06] mcp | complete_wr | s2-to-all-wr-mcp-to-all-smoke-test
- Lane s5 completed recipient-side handling
- Status: open

## [2026-04-06] mcp | register_wr | s1-to-s1-qa-s1-qa-qa
- Registered request WR for s1-qa
- Path: wiki/canon/work-requests/s1-to-s1-qa-s1-qa-qa.md

## [2026-04-06] mcp | register_wr | s1-qa-to-s1-s1-qa---s1-qa-p0-baseline-p1
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-s1-qa---s1-qa-p0-baseline-p1.md

## [2026-04-07] mcp | complete_wr | s1-qa-to-s1-s1-qa---s1-qa-p0-baseline-p1
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s3-to-s4-inspect-gateway-webserver-findings-drift-in-s4-logs
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-inspect-gateway-webserver-findings-drift-in-s4-logs.md

## [2026-04-07] mcp | register_wr | s3-to-s5-inspect-gateway-webserver-s5-context-logs-for-analysis-drift
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-inspect-gateway-webserver-s5-context-logs-for-analysis-drift.md

## [2026-04-07] mcp | complete_wr | s3-to-s5-inspect-gateway-webserver-s5-context-logs-for-analysis-drift
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | complete_wr | s3-to-s4-inspect-gateway-webserver-findings-drift-in-s4-logs
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts.md

## [2026-04-07] mcp | register_wr | s4-to-s3-confirm-s4-exploitability-consumer-minimum-field-set-and-normalization-expectati
- Registered request WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-confirm-s4-exploitability-consumer-minimum-field-set-and-normalization-expectati.md

## [2026-04-07] mcp | register_wr | s1-to-s2-ws-static-analysis
- Registered question WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-ws-static-analysis.md

## [2026-04-07] mcp | register_wr | s2-to-s1-reply-ws-static-analysis-removed-ws-analysis-is-the-canonical-progress-channel
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-ws-static-analysis-removed-ws-analysis-is-the-canonical-progress-channel.md

## [2026-04-07] mcp | complete_wr | s1-to-s2-ws-static-analysis
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | complete_wr | s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | complete_wr | s2-to-s1-reply-ws-static-analysis-removed-ws-analysis-is-the-canonical-progress-channel
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | complete_wr | s4-to-s3-confirm-s4-exploitability-consumer-minimum-field-set-and-normalization-expectati
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s2-to-s1-websocket-progress-completion-ux-handoff-after-s2-contract-hardening
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-websocket-progress-completion-ux-handoff-after-s2-contract-hardening.md

## [2026-04-07] mcp | register_wr | s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md

## [2026-04-07] mcp | complete_wr | s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s5-to-s2-aegis-static-wiki-read_page-wiki-prefix
- Registered request WR for s2
- Path: wiki/canon/work-requests/s5-to-s2-aegis-static-wiki-read_page-wiki-prefix.md

## [2026-04-07] mcp | register_wr | s4-to-s2-s3-prepare-for-s4-omission-policy-contract-changes-on-v1-scan-and-v1-build-and-anal
- Registered request WR for s2, s3
- Path: wiki/canon/work-requests/s4-to-s2-s3-prepare-for-s4-omission-policy-contract-changes-on-v1-scan-and-v1-build-and-anal.md

## [2026-04-07] mcp | complete_wr | s5-to-s2-aegis-static-wiki-read_page-wiki-prefix
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | complete_wr | s4-to-s2-s3-prepare-for-s4-omission-policy-contract-changes-on-v1-scan-and-v1-build-and-anal
- Lane s3 completed recipient-side handling
- Status: open

## [2026-04-07] mcp | register_wr | s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md

## [2026-04-07] mcp | register_wr | s2-to-s1-sdk-upload-request-shape-examples-for-s1-archive-.bin-folder-with-relativepath
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-sdk-upload-request-shape-examples-for-s1-archive-.bin-folder-with-relativepath.md

## [2026-04-07] mcp | register_wr | s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2
- Registered request WR for s4
- Path: wiki/canon/work-requests/s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2.md

## [2026-04-07] Identified adjacent S4 contract drift after omission-policy WR handling | s2
- S2 verified omission-policy recipient fixes and then confirmed adjacent drift: S2 still uses legacy /v1/sdk-registry and old /v1/build request shape while current S4 canonical docs describe upstream-owned SDK registry and caller-materialized build contract.
- Registered follow-up WR to S4 requesting migration-path clarification before S2 stages build/sdk compatibility changes.

## [2026-04-07] mcp | complete_wr | s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | complete_wr | s2-to-s1-sdk-upload-request-shape-examples-for-s1-archive-.bin-folder-with-relativepath
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s4-to-s2-reply-s4-build-sdk-migration-truth-is-runtime-aligned-with-canonical-docs-no-v1-
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s4-to-s2-reply-s4-build-sdk-migration-truth-is-runtime-aligned-with-canonical-docs-no-v1-.md

## [2026-04-07] mcp | complete_wr | s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | complete_wr | s4-to-s2-reply-s4-build-sdk-migration-truth-is-runtime-aligned-with-canonical-docs-no-v1-
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s1-qa-to-s1-untitled
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-untitled.md

## [2026-04-07] mcp | complete_wr | s1-qa-to-s1-untitled
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s1-qa-to-s1-websocket-overviewpage
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-websocket-overviewpage.md

## [2026-04-07] mcp | complete_wr | s1-qa-to-s1-websocket-overviewpage
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s1-qa-to-s1-notification-dropdown
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-notification-dropdown.md

## [2026-04-07] mcp | complete_wr | s1-qa-to-s1-notification-dropdown
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-07] mcp | register_wr | s1-qa-to-s2-aegis-58-design.md
- Registered question WR for s2
- Path: wiki/canon/work-requests/s1-qa-to-s2-aegis-58-design.md.md

## [2026-04-07] mcp | register_wr | s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba
- Registered reply WR for s1-qa
- Path: wiki/canon/work-requests/s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba.md

## [2026-04-07] mcp | complete_wr | s1-qa-to-s2-aegis-58-design.md
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-08] mcp | register_wr | s1-qa-to-s1-aegis-ibm-carbon-nvidia
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md

## [2026-04-08] maintenance | context project scenario flow page added
- Added wiki/context/project/end-to-end-scenarios.md as a synthesized cross-service scenario guide.
- Positioned it as a routing aid to canonical technical-overview/backend/api-endpoints/shared-models surfaces.
- Planned routing entrypoint is wiki/system/index.md via deterministic index rebuild.

## [2026-04-08] maintenance | technical overview linked to scenario flow page
- Added an explicit routing hint from wiki/canon/specs/technical-overview.md to wiki/context/project/end-to-end-scenarios.md.
- This compensates for the current deterministic index rebuild not surfacing the new project-context page.

## [2026-04-08] maintenance | expanded scenario-page routing hints across S2 surfaces
- Added explicit routing hints to wiki/canon/handoff/s2/readme.md, wiki/canon/handoff/s2/api-endpoints.md, wiki/canon/specs/backend.md, and wiki/canon/api/shared-models.md.
- Updated related_pages metadata on those pages to include wiki/context/project/end-to-end-scenarios.md.
- Backlink count for the scenario page increased from 2 to 6 canonical/session references.

## [2026-04-08] mcp | complete_wr | s1-qa-to-s1-aegis-ibm-carbon-nvidia
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-08] mcp | register_wr | s1-qa-to-s1-carbon
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-carbon.md

## [2026-04-08] mcp | register_wr | s1-qa-to-s1-qa-qa-stitch-mcp
- Registered notice WR for s1-qa
- Path: wiki/canon/work-requests/s1-qa-to-s1-qa-qa-stitch-mcp.md

## [2026-04-08] mcp | register_wr | s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep.md

## [2026-04-08] Ran S2 self-test sweep against canonical API contract and identified coverage gaps | S2 API contract audit
- Verified backend suite (356 tests), focused contract suite (124 tests), backend/shared typecheck all passing
- Conservative literal-scan of 97 documented REST endpoints found 49 still lacking direct request-level test coverage
- Largest uncovered surfaces: adapters/settings, analysis status/results/summary/poc, dynamic-analysis, dynamic-test, file content/download/delete, health, gate override, approval detail, report dynamic/test

## [2026-04-08] Refined route-family gap evidence for undocumented test coverage holes | S2 API contract audit
- Endpoint-family scan over backend test files showed zero direct request-level references for adapters/settings, dynamic-analysis, dynamic-test, analysis status/results/summary/poc, file detail/download/delete, and report dynamic/test surfaces
- Controller test directory currently contains only analysis-validation.test.ts and health.controller.test.ts, confirming most uncovered route families lack dedicated controller tests too
- Health is partially covered at controller unit level via GET / mounted router test, but not by an app-level GET /health contract test

## [2026-04-08] mcp | register_wr | s5-to-s3-s5-api-66-shape
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-api-66-shape.md

## [2026-04-08] mcp | register_wr | s5-to-s2-s5-api-x-timeout-ms
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s5-to-s2-s5-api-x-timeout-ms.md

## [2026-04-08] Added first contract-test batch for previously uncovered S2 API surfaces | S2 API contract audit
- Expanded create-test-app harness to mount missing contract surfaces and lightweight fake services for dynamic-analysis/dynamic-test/health/adapters/settings/sdk-profiles
- Added request-level contract tests for health, file content/download/delete, adapters, settings, sdk-profiles, analysis status/results/summary/poc, dynamic-analysis, and dynamic-test
- Conservative endpoint literal scan improved from 49 unmatched documented REST endpoints to 17 unmatched after the new batch

## [2026-04-08] mcp | register_wr | s3-to-s2-runtime-rollout-still-pending-as-of-2026-04-08-live-s3-services-continue-to-expo
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-runtime-rollout-still-pending-as-of-2026-04-08-live-s3-services-continue-to-expo.md

## [2026-04-08] Closed request-level REST contract coverage gap across the documented S2 API surface | S2 API contract audit
- Second contract-test batch covered project update/delete, adapter delete, SDK delete, source clone/delete, dynamic-analysis detail/delete, auth logout, finding summary, gate run detail/override, approval detail, target libraries, and report dynamic/test
- Conservative endpoint scan improved from 17 unmatched documented REST endpoints to 0 unmatched
- One concrete contract drift remains: GET /api/dynamic-analysis/sessions/:id currently returns a composite payload { session, alerts, recentMessages } while the canonical API doc still describes DynamicAnalysisSession-only detail

## [2026-04-08] mcp | complete_wr | s5-to-s3-s5-api-66-shape
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-08] mcp | register_wr | s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-.md

## [2026-04-08] mcp | register_wr | s2-to-s5-s2-acknowledged-s5-project-memory-x-timeout-ms-clarification-on-2026-04-08
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s2-to-s5-s2-acknowledged-s5-project-memory-x-timeout-ms-clarification-on-2026-04-08.md

## [2026-04-08] mcp | complete_wr | s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-08] mcp | complete_wr | s3-to-s2-runtime-rollout-still-pending-as-of-2026-04-08-live-s3-services-continue-to-expo
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-08] mcp | complete_wr | s5-to-s2-s5-api-x-timeout-ms
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-08] Processed all currently open S2 WRs and posted recipient-side replies | S2 WR sweep
- Handled both S3 WRs: updated S2 build-resolve consumer alignment, restarted live build-agent/analysis-agent runtime, and verified live health + strict-v1 response echo
- Handled S5 timeout-header notice as acknowledged/no-code-change
- Recorded reply WRs to S3 and S5 and marked all three incoming WRs complete for lane s2

## [2026-04-08] mcp | complete_wr | s2-to-s5-s2-acknowledged-s5-project-memory-x-timeout-ms-clarification-on-2026-04-08
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-04-08] mcp | complete_wr | s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-
- Lane s3 completed recipient-side handling
- Status: completed
