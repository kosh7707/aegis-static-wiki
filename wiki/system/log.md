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
- Resynced 163 canonical pages from the AEGIS repo `docs/` directory.
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

## [2026-04-08] mcp | register_wr | s2-to-s1-s1-qa-s2-websocket-recovery-hardening-landed-on-2026-04-08-please-validate-s1-reconnec
- Registered request WR for s1, s1-qa
- Path: wiki/canon/work-requests/s2-to-s1-s1-qa-s2-websocket-recovery-hardening-landed-on-2026-04-08-please-validate-s1-reconnec.md

## [2026-04-08] Registered S1/S1-QA WR after websocket recovery hardening | S2 websocket audit
- WS hardening changed late-subscribe behavior for /ws/upload and /ws/analysis in a consumer-visible but non-breaking way
- Requested S1/S1-QA validation of reconnect/progress UX against the updated snapshot-on-subscribe behavior

## [2026-04-08] mcp | complete_wr | s1-qa-to-s1-carbon
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-08] mcp | complete_wr | s2-to-s1-s1-qa-s2-websocket-recovery-hardening-landed-on-2026-04-08-please-validate-s1-reconnec
- Lane s1 completed recipient-side handling
- Status: open

## [2026-04-08] mcp | register_wr | s1-qa-to-s1-s1-qa-deep-design-review-of-design-reference-v3-v4-reject-v3-baseline-treat-v4-a
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-s1-qa-deep-design-review-of-design-reference-v3-v4-reject-v3-baseline-treat-v4-a.md

## [2026-04-08] mcp | register_wr | s1-qa-to-s1-s1-qa-deep-design-review-v3-reject-as-baseline-v4-provisional-only-after-cleanup
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-s1-qa-deep-design-review-v3-reject-as-baseline-v4-provisional-only-after-cleanup.md

## [2026-04-08] mcp | complete_wr | s1-qa-to-s1-s1-qa-deep-design-review-v3-reject-as-baseline-v4-provisional-only-after-cleanup
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-09] mcp | register_wr | s1-qa-to-s1-s1-qa-follow-up-review-of-v5-design-reference-strongest-candidate-so-far-but-not
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-s1-qa-follow-up-review-of-v5-design-reference-strongest-candidate-so-far-but-not.md

## [2026-04-09] mcp | register_wr | s1-qa-to-s1-s1-qa-follow-up-design-review-of-v5-strongest-candidate-so-far-but-not-final
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-s1-qa-follow-up-design-review-of-v5-strongest-candidate-so-far-but-not-final.md

## [2026-04-09] mcp | complete_wr | s1-qa-to-s1-s1-qa-follow-up-review-of-v5-design-reference-strongest-candidate-so-far-but-not
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-09] mcp | register_wr | s1-to-s1-aegis-design.md-v2-v6
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-to-s1-aegis-design.md-v2-v6.md

## [2026-04-09] mcp | complete_wr | s1-qa-to-s1-s1-qa-follow-up-design-review-of-v5-strongest-candidate-so-far-but-not-final
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-09] mcp | register_wr | s2-to-s6-s6-reactivation-for-dynamic-analysis-phase-2-prep-adapter-simulator-gap-inventor
- Registered request WR for s6
- Path: wiki/canon/work-requests/s2-to-s6-s6-reactivation-for-dynamic-analysis-phase-2-prep-adapter-simulator-gap-inventor.md

## [2026-04-09] mcp | complete_wr | s2-to-s6-s6-reactivation-for-dynamic-analysis-phase-2-prep-adapter-simulator-gap-inventor
- Lane s6 completed recipient-side handling
- Status: completed

## [2026-04-09] mcp | complete_wr | s1-to-s1-aegis-design.md-v2-v6
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-09] mcp | register_wr | s2-to-s3-s4-race-test-wr
- Registered request WR for s3, s4
- Path: wiki/canon/work-requests/s2-to-s3-s4-race-test-wr.md

## [2026-04-09] mcp | complete_wr | s2-to-s3-s4-race-test-wr
- Lane s3 completed recipient-side handling
- Status: open

## [2026-04-09] mcp | register_wr | s2-to-s1-s1-qa-s2-backend-project-crud-hardening-landed-on-2026-04-09-please-wire-s1-edit-delet
- Registered request WR for s1, s1-qa
- Path: wiki/canon/work-requests/s2-to-s1-s1-qa-s2-backend-project-crud-hardening-landed-on-2026-04-09-please-wire-s1-edit-delet.md

## [2026-04-09] implemented backend project CRUD hardening slice | s2
- Validated blank-name rejection for PUT /api/projects/:id.
- Added blocker-aware project deletion with uploads/{projectId} quarantine/restore semantics.
- Registered S1/S1-QA WR to wire edit/delete UI against the new backend semantics.

## [2026-04-09] docs | s4 canonical docs refresh
- Updated S4 readme/roadmap/spec/api/build-snapshot docs against current services/sast-runner codebase.
- Aligned test count (376), Semgrep rule count (39 across 9 YAML files), default concurrency (2), health backward-compatibility notes, and canonical wiki links.

## [2026-04-09] docs | s4-owned-docs-refresh
- Updated S4-owned canonical docs: readme, roadmap, spec, API contract, build-snapshot consumer seam.
- Reconciled rule count to 39 across 9 YAML files, test count to 376 across 23 test files, and documented /v1/health backward-compatible top-level semgrep field plus policy surface.

## [2026-04-09] synced S2-owned canonical docs for project CRUD hardening | s2
- Updated S2 readme/architecture/api-endpoints/backend roadmap/spec and shared-models to match the new backend project delete semantics.
- Documented blank-name validation, blocker-aware 409 responses, uploads/{projectId} quarantine/restore flow, current test counts, and the S1/S1-QA UI handoff WR.

## [2026-04-09] mcp | register_wr | s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-.md

## [2026-04-09] mcp | register_wr | s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t.md

## [2026-04-10] canonical docs aligned to DashboardPage-based frontend contract | s1-frontend-docs-contract
- Updated core-3 + architecture + qa-guide to match DashboardPage runtime reality, no mounted StatusBar, and no navbar search.
- Codified page-per-directory, ownership split, and token→semantic→component CSS layering using DashboardPage as reference specimen.

## [2026-04-10] Removed Electron shell and documented the web-only frontend architecture | services/frontend
- deleted services/frontend/src/main runtime
- removed electron dependency and desktop scripts
- removed window.api/preload bridge fallback from renderer api core
- updated canonical S1 docs and rebuilt wiki index

## [2026-04-10] Removed Electron shell and finalized web-only frontend runtime | services/frontend
- Deleted src/main runtime/preload files
- Removed electron dependency and dev:main/build:main scripts
- Removed window.api/preload bridge usage in renderer API core
- Updated canonical S1 docs to reflect browser-native architecture
- Verified typecheck/build/tests and Electron grep no-match

## [2026-04-10] Flattened the frontend runtime tree under src and removed the legacy nested renderer path from code/config/docs | services/frontend
- Moved runtime modules from src/renderer/** to src/**
- Moved test bootstrap to src/test/setup.ts
- Updated canonical S1 docs and local design/tooling references

## [2026-04-10] Dismantled the generic src/components namespace and rehomed ownership into layouts/shared/page-local structure | services/frontend
- Moved layout-owned assets (Navbar, Sidebar, ErrorBoundary) under src/layouts
- Promoted reusable UI and finding/detail views into src/shared
- Moved page-local report/files/static/dynamic pieces under page-owned components and removed StatusBar

## [2026-04-10] updated | s2-runtime-reset-scripts
- Documented scripts/backend DB utility roles in S2 handoff docs.
- Clarified reset-db.sh as DB-only and reset-runtime-state.sh as DB+uploads reset path.
- Updated S2 handoff last_verified dates to 2026-04-10.

## [2026-04-10] mcp | register_wr | s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss.md

## [2026-04-10] mcp | complete_wr | s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-10] mcp | complete_wr | s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-10] Implemented visible navbar notifications and sticky SDK upload progress; filed follow-up WR for pre-registration upload-failure notification gap | frontend-notification-progress-hardening
- commit 8588f84
- completed S2→S1 SDK progress WRs
- new WR: s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss

## [2026-04-10] Finalized navbar notification consumer + SDK progress hardening with reconnect dedupe and binary validation guard | frontend-notification-progress-hardening
- commit 0b0d3b7
- targeted tests 21/21
- full frontend suite 429 tests passed

## [2026-04-10] mcp | complete_wr | s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-10] mcp | register_wr | s2-to-s1-reply-pre-registration-sdk-upload-failures-now-emit-project-notifications-sdk_fa
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-pre-registration-sdk-upload-failures-now-emit-project-notifications-sdk_fa.md

## [2026-04-13] mcp | register_wr | s2-to-s1-consume-new-sdk-install-log-contract-and-live-observability-signals-for-project-
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-consume-new-sdk-install-log-contract-and-live-observability-signals-for-project-.md

## [2026-04-13] mcp | complete_wr | s2-to-s1-consume-new-sdk-install-log-contract-and-live-observability-signals-for-project-
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | register_wr | s3-to-s2-confirm-explicit-build-agent-ux-step
- Registered question WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-confirm-explicit-build-agent-ux-step.md

## [2026-04-13] mcp | register_wr | s2-to-s3-reply-canonical-analysis-user-journey-now-uses-explicit-build-preparation-before
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-reply-canonical-analysis-user-journey-now-uses-explicit-build-preparation-before.md

## [2026-04-13] mcp | register_wr | s2-to-s1-align-future-analysis-ux-copy-and-flow-with-explicit-build-preparation-then-quic
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-align-future-analysis-ux-copy-and-flow-with-explicit-build-preparation-then-quic.md

## [2026-04-13] mcp | complete_wr | s3-to-s2-confirm-explicit-build-agent-ux-step
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-13] canonical analysis user journey rewritten around explicit build-preparation and explicit Deep request | s2
- Updated technical-overview, backend spec, end-to-end scenarios, and S2 handoff docs to describe source upload + SDK upload + explicit build-preparation + explicit Quick + explicit Deep.
- Replied to S3 WR about the build-agent UX step and issued S1 alignment WR.
- Marked S3->S2 build-agent UX WR completed from the S2 recipient perspective.

## [2026-04-13] canonical analysis journey corrected to include Quick-stage S5 GraphRAG formation | s2
- Patched the 2026-04-13 canonical user journey rewrite to add the omitted S5 GraphRAG/code-graph formation step inside Quick.
- Updated both the S3 reply WR and the S1 alignment WR so downstream lanes receive the corrected flow.

## [2026-04-13] mcp | register_wr | s2-to-s4-prepare-explicit-build-preparation-and-one-shot-quick-scan-contract-for-the-new-
- Registered request WR for s4
- Path: wiki/canon/work-requests/s2-to-s4-prepare-explicit-build-preparation-and-one-shot-quick-scan-contract-for-the-new-.md

## [2026-04-13] mcp | register_wr | s2-to-s5-prepare-quick-stage-code-graph-and-graphrag-capability-contract-for-the-new-anal
- Registered request WR for s5
- Path: wiki/canon/work-requests/s2-to-s5-prepare-quick-stage-code-graph-and-graphrag-capability-contract-for-the-new-anal.md

## [2026-04-13] mcp | register_wr | s2-to-s3-prepare-build-agent-and-analysis-agent-contract-split-for-explicit-build-prep-th
- Registered request WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-prepare-build-agent-and-analysis-agent-contract-split-for-explicit-build-prep-th.md

## [2026-04-13] mcp | register_wr | s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared.md

## [2026-04-13] mcp | complete_wr | s2-to-s5-prepare-quick-stage-code-graph-and-graphrag-capability-contract-for-the-new-anal
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-04-13] Implemented explicit build-preparation readiness contract for Quick orchestration | S4
- Added /v1/build readiness contract (ready/partial/not-ready) and surfaced it in BuildResponse.
- compile_commands.json without user-target entries now fails with category compile-commands-no-user-entries.
- Refreshed S4 canon docs to define explicit Quick as /v1/build ready -> /v1/scan one-shot.

## [2026-04-13] mcp | complete_wr | s2-to-s4-prepare-explicit-build-preparation-and-one-shot-quick-scan-contract-for-the-new-
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | register_wr | s3-to-s2-build-prep-and-deep-contract-split-implemented-for-explicit-step-flow
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-build-prep-and-deep-contract-split-implemented-for-explicit-step-flow.md

## [2026-04-13] mcp | complete_wr | s2-to-s3-prepare-build-agent-and-analysis-agent-contract-split-for-explicit-build-prep-th
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | complete_wr | s2-to-s3-reply-canonical-analysis-user-journey-now-uses-explicit-build-preparation-before
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | register_wr | s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4.md

## [2026-04-13] Sent S4→S2 reply WR for explicit build-preparation/Quick contract | S4
- Registered reply WR wiki/canon/work-requests/s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4.md.
- Updated S4 handoff/readme and roadmap to point to the reply WR and confirm no open WRs remain.

## [2026-04-13] Updated canonical handoff/roadmap for explicit build-preparation contract split | S3
- Refreshed wiki/canon/handoff/s3/readme.md to document buildPreparation and Deep explicit-step aliases.
- Refreshed wiki/canon/roadmap/s3-roadmap.md with 2026-04-13 completed work and next priorities.

## [2026-04-13] mcp | complete_wr | s3-to-s2-build-prep-and-deep-contract-split-implemented-for-explicit-step-flow
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | complete_wr | s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | complete_wr | s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-13] S2 additive explicit-step migration advanced with build-preparation endpoints and quick graphing phase | s2
- Added additive build-preparation endpoints on the pipeline surface and kept legacy run behavior intact.
- Explicit Quick now expects prepared compile_commands for target-scoped runs, and analysis progress now exposes quick_graphing while S5 graph context is ingested.

## [2026-04-13] S2 legacy /analysis/run now behaves as a Quick alias during explicit-step migration | s2
- Changed /api/analysis/run to dispatch the explicit Quick path rather than the old public auto Quick→Deep chain.
- Kept additive /pipeline/prepare*, /analysis/quick, /analysis/deep surfaces and verified them with fresh targeted + full backend tests.

## [2026-04-13] mcp | register_wr | s2-to-s1-adopt-explicit-build-preparation-then-quick-then-deep-ux-on-the-new-s2-additive-
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-adopt-explicit-build-preparation-then-quick-then-deep-ux-on-the-new-s2-additive-.md

## [2026-04-13] S2 closing-doc polish removed remaining explicit-step wording drift in analysis recovery docs | s2
- Updated the shared-models recovery matrix to say explicit Quick / explicit Deep analysis.
- Updated S2 api-endpoints WS row and end-to-end scenario wording to stop implying the old Quick→Deep auto-follow-up model.

## [2026-04-13] mcp | register_wr | s3-to-s4-define-s4-health-request-summary-mapping-for-local-ack-control-rollout
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-define-s4-health-request-summary-mapping-for-local-ack-control-rollout.md

## [2026-04-13] mcp | register_wr | s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout.md

## [2026-04-13] mcp | register_wr | s3-to-s2-first-rollout-of-timeout-policy-redesign-is-health-only-with-polling-semantics
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-first-rollout-of-timeout-policy-redesign-is-health-only-with-polling-semantics.md

## [2026-04-13] mcp | register_wr | s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request.md

## [2026-04-13] mcp | complete_wr | s3-to-s2-first-rollout-of-timeout-policy-redesign-is-health-only-with-polling-semantics
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | complete_wr | s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-13] processed timeout-policy redesign notice as pre-freeze impact analysis only | s2
- Verified current S2 /health aggregation collapses child responses into ok/degraded/unreachable.
- Verified service clients only expose point-in-time checkHealth() with no orchestration polling loop.
- Verified analysis/pipeline orchestration lacks ack-break chained-abort handling and documented deferred implementation until contract freeze.

## [2026-04-13] mcp | register_wr | s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics
- Registered question WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics.md

## [2026-04-13] mcp | register_wr | s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio.md

## [2026-04-13] mcp | register_wr | s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics.md

## [2026-04-13] mcp | complete_wr | s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-13] processed S3 follow-up WR on /health local-ack semantics | s7
- Bootstrapped S7 lane from docs + canonical wiki and verified current gateway code shape before replying.
- Registered reply WR: wiki/canon/work-requests/s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics.md.
- Marked recipient-side completion for wiki/canon/work-requests/s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics.md.
- Clarified that elapsedMs is informational only and first rollout cannot prove fine-grained progress inside non-streaming llm-inference.

## [2026-04-13] mcp | register_wr | s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md

## [2026-04-13] mcp | complete_wr | s3-to-s4-define-s4-health-request-summary-mapping-for-local-ack-control-rollout
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-04-13] Implemented /health request-summary control signal and replied to S3 WR | S4
- Added additive /v1/health requestSummary + activeRequestCount contract mapped from existing scan lifecycle/runtime callbacks.
- Sent reply WR wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md and completed the originating S3→S4 WR.

## [2026-04-13] mcp | register_wr | s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout.md

## [2026-04-13] mcp | complete_wr | s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | complete_wr | s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | complete_wr | s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-13] mcp | complete_wr | s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-13] Implemented Analysis Agent /health request-summary control signal for rollout v1 | S3
- Added additive activeRequestCount/requestSummary control-signal block to Analysis Agent /v1/health.
- Mapped S3 local progress events into health summary tracking and aligned docs/spec/handoff/roadmap with the frozen rollout contract.

## [2026-04-14] mcp | register_wr | s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke.md

## [2026-04-14] mcp | register_wr | s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not.md

## [2026-04-14] mcp | complete_wr | s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-14] processed S3 WR on live /v1/chat JSON-only leak behavior | s7
- Verified current /v1/chat implementation is pass-through and does not enforce JSON-only mode or disable thinking by itself.
- Reproduced the reported reasoning leak against the live gateway, then verified a caller-controlled success case with response_format=json_object + enable_thinking=false.
- Registered reply WR wiki/canon/work-requests/s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not.md and completed the originating S3->S7 WR.

## [2026-04-14] mcp | complete_wr | s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] Reviewed S7 live /v1/chat reply and accepted current pass-through limitation contract | S3
- Confirmed the live JSON-only control leak is not a /health rollout regression.
- Accepted S7 guidance: prefer /v1/tasks for strict structured output, or explicitly set response_format=json_object + enable_thinking=false on /v1/chat and parse message.content only.

## [2026-04-14] mcp | register_wr | s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat.md

## [2026-04-14] mcp | register_wr | s3-to-s4-clarify-why-live-s4-v1-health-does-not-expose-request-summary-fields-yet
- Registered question WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-clarify-why-live-s4-v1-health-does-not-expose-request-summary-fields-yet.md

## [2026-04-14] mcp | register_wr | s7-to-s3-reply-opt-in-strict-json-mode-implemented-for-v1-chat-in-repo-runtime-rollout-st
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-opt-in-strict-json-mode-implemented-for-v1-chat-in-repo-runtime-rollout-st.md

## [2026-04-14] mcp | complete_wr | s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-14] implemented opt-in strict JSON mode for /v1/chat | s7
- Added X-AEGIS-Strict-JSON activation in services/llm-gateway/app/routers/tasks.py.
- Strict mode now forces response_format=json_object and enable_thinking=false, validates/normalizes message.content, scrubs reasoning, and returns 502 on strict-contract violations.
- Updated canonical S7 API/spec docs and replied to the S3 implementation WR.
- Live localhost gateway still showed stale pre-restart behavior, so runtime rollout/restart remains pending.

## [2026-04-14] refreshed S7 handoff docs for session end | s7
- Updated wiki/canon/handoff/s7/readme.md with 2026-04-14 strict JSON mode status, 188-test baseline, and runtime restart pending note.
- Updated wiki/canon/handoff/s7/architecture.md with strict JSON mode architecture notes, test count refresh, and X-AEGIS-Strict-JSON observability mention.
- Updated wiki/canon/roadmap/s7-roadmap.md so the next-session top priority is live gateway rollout/restart verification for strict JSON mode.

## [2026-04-14] mcp | register_wr | s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m.md

## [2026-04-14] mcp | complete_wr | s3-to-s4-clarify-why-live-s4-v1-health-does-not-expose-request-summary-fields-yet
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-04-14] Clarified live /v1/health drift as runtime lag and replied to S3 follow-up WR | S4
- Confirmed current S4 worktree/canonical contract includes activeRequestCount + requestSummary and full pytest still passes.
- Fresh runtime evidence from this workspace showed no current localhost:9000 listener and logs contained live-smoke-s4-001 completion followed by SAST Runner shutting down.

## [2026-04-14] Refreshed S4 handoff docs for session end | S4
- Updated S4 handoff/readme and roadmap last_verified + last update dates to 2026-04-14.
- Confirmed S4 open WR count remains zero at session end.

## [2026-04-14] Updated S3 canonical docs for /health rollout and caller-side strict JSON guard | S3
- Refreshed analysis-agent API/spec plus S3 handoff/roadmap to 2026-04-14 state.
- Recorded freeze artifact publication, S3 /health request-summary rollout, and S7 strict JSON opt-in caller guard follow-up.

## [2026-04-14] mcp | complete_wr | s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s7-to-s3-reply-opt-in-strict-json-mode-implemented-for-v1-chat-in-repo-runtime-rollout-st
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] refreshed session-closing S2 handoff docs before whole-tree commit/push | s2
- Updated S2 handoff readme and roadmap to record the frozen timeout-policy rollout WR as the next active post-freeze task.
- User requested whole-tree commit/push across both AEGIS and aegis-static-wiki, including non-S2-owned dirty changes.

## [2026-04-14] mcp | register_wr | s3-to-s4-follow-up-request-clarify-next-step-wait-while-alive-contract-for-s4-build-scan-
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-follow-up-request-clarify-next-step-wait-while-alive-contract-for-s4-build-scan-.md

## [2026-04-14] mcp | register_wr | s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte.md

## [2026-04-14] mcp | register_wr | s3-to-s2-follow-up-request-keep-s2-orchestration-aligned-with-s3-timeout-inventory-while-
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-follow-up-request-keep-s2-orchestration-aligned-with-s3-timeout-inventory-while-.md

## [2026-04-14] mcp | register_wr | s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat.md

## [2026-04-14] mcp | complete_wr | s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | register_wr | s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif.md

## [2026-04-14] mcp | complete_wr | s3-to-s4-follow-up-request-clarify-next-step-wait-while-alive-contract-for-s4-build-scan-
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-04-14] Implemented wait-while-alive follow-up coverage for build surfaces | s4-sast-runner
- Extended `/v1/health` request-summary tracking across `/v1/scan`, `/v1/build`, and `/v1/build-and-analyze`.
- Added additive `localAckState` semantics (`phase-advancing`, `transport-only`, `ack-break`) and build subprocess aliveness signaling.
- Completed S3 follow-up WR and sent reply WR with verification evidence (67 focused tests, 385 full tests).

## [2026-04-14] mcp | register_wr | s2-to-s3-reply-s2-implemented-request-aware-health-interpretation-and-inventoried-timeout
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-reply-s2-implemented-request-aware-health-interpretation-and-inventoried-timeout.md

## [2026-04-14] mcp | register_wr | s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon
- Registered question WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon.md

## [2026-04-14] mcp | complete_wr | s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s3-to-s2-follow-up-request-keep-s2-orchestration-aligned-with-s3-timeout-inventory-while-
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s3-reply-s2-implemented-request-aware-health-interpretation-and-inventoried-timeout
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | register_wr | s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini.md

## [2026-04-14] mcp | complete_wr | s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | register_wr | s7-to-s3-phase-2-proposal-new-async-ownership-surface-for-no-result-loss-inference-path-p
- Registered question WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-phase-2-proposal-new-async-ownership-surface-for-no-result-loss-inference-path-p.md

## [2026-04-14] mcp | register_wr | s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme
- Registered reply WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme.md

## [2026-04-14] mcp | complete_wr | s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s7-to-s3-phase-2-proposal-new-async-ownership-surface-for-no-result-loss-inference-path-p
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | register_wr | s5-to-s2-s3-s5-runtime-semantics-aligned-on-2026-04-14-real-timeout-enforcement-kb_not_ready
- Registered notice WR for s2, s3
- Path: wiki/canon/work-requests/s5-to-s2-s3-s5-runtime-semantics-aligned-on-2026-04-14-real-timeout-enforcement-kb_not_ready.md

## [2026-04-14] mcp | complete_wr | s5-to-s2-s3-s5-runtime-semantics-aligned-on-2026-04-14-real-timeout-enforcement-kb_not_ready
- Lane s3 completed recipient-side handling
- Status: open

## [2026-04-14] mcp | register_wr | s7-to-s3-reply-async-ownership-surface-implemented-in-s7-repo-with-reviewed-state-model-a
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-async-ownership-surface-implemented-in-s7-repo-with-reviewed-state-model-a.md

## [2026-04-14] mcp | complete_wr | s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s1-qa-to-s1-s1-qa-deep-design-review-of-design-reference-v3-v4-reject-v3-baseline-treat-v4-a
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s1-adopt-explicit-build-preparation-then-quick-then-deep-ux-on-the-new-s2-additive-
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s1-reply-pre-registration-sdk-upload-failures-now-emit-project-notifications-sdk_fa
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s1-s1-qa-s2-backend-project-crud-hardening-landed-on-2026-04-09-please-wire-s1-edit-delet
- Lane s1 completed recipient-side handling
- Status: open

## [2026-04-14] mcp | complete_wr | s1-qa-to-s1-qa-qa-stitch-mcp
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s1-to-s1-qa-s1-qa-qa
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s1-s1-qa-s2-websocket-recovery-hardening-landed-on-2026-04-08-please-validate-s1-reconnec
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s7-to-s3-reply-async-ownership-surface-implemented-in-s7-repo-with-reviewed-state-model-a
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | register_wr | s3-to-s2-no-new-s3-public-api-contract-delta-in-the-latest-s3-slices-recent-changes-are-i
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-no-new-s3-public-api-contract-delta-in-the-latest-s3-slices-recent-changes-are-i.md

## [2026-04-14] mcp | register_wr | s3-to-s2-s3-timeout-policy-no-result-loss-internal-rollout-is-repo-complete-outward-s3-co
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-timeout-policy-no-result-loss-internal-rollout-is-repo-complete-outward-s3-co.md

## [2026-04-14] mcp | complete_wr | s3-to-s2-no-new-s3-public-api-contract-delta-in-the-latest-s3-slices-recent-changes-are-i
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s3-to-s2-s3-timeout-policy-no-result-loss-internal-rollout-is-repo-complete-outward-s3-co
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | register_wr | s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a
- Registered request WR for s1, s1-qa
- Path: wiki/canon/work-requests/s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a.md

## [2026-04-14] mcp | register_wr | s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against
- Registered request WR for s1-qa
- Path: wiki/canon/work-requests/s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against.md

## [2026-04-14] mcp | register_wr | s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r.md

## [2026-04-14] completed BuildTarget-only analysis cutover | s2
- Final backend verification: 25 files / 458 tests passed
- Final frontend verification: 71 files / 499 tests passed
- Architect review approved; S1 and S1-QA handoff WRs issued.

## [2026-04-14] mcp | register_wr | s2-to-s1-s1-qa-buildtarget-terminology-cutover-is-complete-on-active-s2-frontend-surfaces-updat
- Registered notice WR for s1, s1-qa
- Path: wiki/canon/work-requests/s2-to-s1-s1-qa-buildtarget-terminology-cutover-is-complete-on-active-s2-frontend-surfaces-updat.md

## [2026-04-14] mcp | register_wr | s2-to-s3-build-agent-canonical-target-locator-fields-are-now-buildtargetpath-buildtargetn
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-build-agent-canonical-target-locator-fields-are-now-buildtargetpath-buildtargetn.md

## [2026-04-14] mcp | complete_wr | s2-to-s3-build-agent-canonical-target-locator-fields-are-now-buildtargetpath-buildtargetn
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-14] mcp | complete_wr | s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a
- Lane s1 completed recipient-side handling
- Status: open

## [2026-04-14] mcp | complete_wr | s2-to-s1-s1-qa-buildtarget-terminology-cutover-is-complete-on-active-s2-frontend-surfaces-updat
- Lane s1 completed recipient-side handling
- Status: open

## [2026-04-15] mcp | register_wr | s2-to-s8-sync-to-the-merged-s8-baseline-and-use-wr-git-pull-reply-flow-for-next-handoffs
- Registered request WR for s8
- Path: wiki/canon/work-requests/s2-to-s8-sync-to-the-merged-s8-baseline-and-use-wr-git-pull-reply-flow-for-next-handoffs.md

## [2026-04-15] mcp | register_wr | s2-to-s8-post-merge-s8-follow-up-pull-latest-main-then-fix-the-reviewed-container-workspa
- Registered request WR for s8
- Path: wiki/canon/work-requests/s2-to-s8-post-merge-s8-follow-up-pull-latest-main-then-fix-the-reviewed-container-workspa.md

## [2026-04-18] Verified MonitoringView refactor and converted additional static-analysis hotspots | S1 frontend handoff cleanup
- MonitoringView rewrite validated with typecheck, targeted DynamicAnalysisPage test, full test suite, and production build.
- Converted AgentResultPanel and LatestAnalysisTab away from utility-heavy styling into handoff CSS classes in app-shell.css.
- Remaining prominent hotspots now center on SourceTreeView and other StaticAnalysis leaf views.

## [2026-04-18] Converted SourceTreeView and FileTreeNode to handoff CSS structure | S1 frontend handoff cleanup
- SourceTreeView now uses named handoff classes for summary, tree, preview, code, and finding surfaces instead of utility-heavy layout strings.
- FileTreeNode was normalized to ftree-* structural classes so StaticAnalysis tree rendering shares the same handoff styling layer.
- Fresh verification stayed green across typecheck, targeted DynamicAnalysis/StaticAnalysis tests, full frontend tests, and production build.

## [2026-04-18] Converted AnalysisResultsView to handoff CSS structure | S1 frontend handoff cleanup
- AnalysisResultsView and its file-coverage/filter/grouped-result surfaces now use named handoff classes in app-shell.css instead of utility-heavy layout strings.
- Fresh verification stayed green across typecheck, targeted StaticAnalysis and DynamicAnalysis tests, full frontend tests, and production build.
- Remaining prominent cleanup now centers on SourceUploadView and TwoStageProgressView.

## [2026-04-18] Converted SourceUploadView and TwoStageProgressView to handoff CSS structure | S1 frontend handoff cleanup
- SourceUploadView now uses named handoff classes for upload summary, actions, tabs, dropzone, and git-clone form surfaces.
- TwoStageProgressView now uses named handoff classes for status banners, staged progress timeline, error state, CTA row, and handoff notice.
- Fresh verification stayed green across typecheck, targeted StaticAnalysis and DynamicAnalysis tests, full frontend tests, and production build.

## [2026-04-18] Converted remaining shared helper surfaces to handoff CSS structure | S1 frontend handoff cleanup
- ConnectionStatusBanner, ConfirmDialog, and SeveritySummary now use named handoff classes rather than utility-heavy layout strings.
- Fresh verification stayed green across typecheck, targeted StaticAnalysis and DynamicAnalysis tests, full frontend tests, and production build.
- Major StaticAnalysis and shared-helper hotspots are now cleared; only lower-priority residual utility strings remain.

## [2026-04-18] Converted shared badge helpers to handoff CSS classes while preserving test contracts | S1 frontend handoff cleanup
- SeverityBadge, FindingStatusBadge, SourceBadge, and TargetStatusBadge now map to named handoff CSS classes instead of inline utility-style token strings.
- Legacy badge class hooks required by existing tests were preserved alongside the new handoff classes to keep compatibility while moving styling into app-shell.css.
- Fresh verification stayed green across typecheck, focused shared-ui tests, targeted StaticAnalysis and DynamicAnalysis tests, full frontend tests, and production build.

## [2026-04-18] Converted final low-priority shared-ui surfaces in this wave and re-verified | S1 frontend handoff cleanup
- Spinner, BackButton, and PageHeader now use named handoff classes for their residual layout/styling hooks.
- Fresh verification stayed green across typecheck, focused shared-ui tests, targeted StaticAnalysis and DynamicAnalysis tests, full frontend tests, and production build.
- Remaining residual utility strings are now mostly limited to secondary analytics/summary helpers like DonutChart, SeverityBar, FindingSummary, TargetProgressStepper, AdapterSelector, and StateTransitionDialog.

## [2026-04-18] Converted summary and stepper shared-ui helpers to handoff CSS classes | S1 frontend handoff cleanup
- DonutChart, FindingSummary, SeverityBar, and TargetProgressStepper now use named handoff CSS classes for layout, legends, tracks, and stateful markers instead of utility-heavy strings.
- Fresh verification stayed green across typecheck, focused shared-ui tests, targeted StaticAnalysis and DynamicAnalysis tests, full frontend tests, and production build.
- Remaining lower-priority cleanup now concentrates on AdapterSelector, StateTransitionDialog, TrendChart, and scattered minor utility strings.

## [2026-04-18] Converted remaining secondary helper surfaces to handoff CSS classes | S1 frontend handoff cleanup
- AdapterSelector, StateTransitionDialog, and TrendChart were moved onto named handoff CSS classes; dialog and adapter selection layouts no longer rely on utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused StateTransitionDialog/ui-components tests, targeted StaticAnalysis and DynamicAnalysis tests, full frontend tests, and production build.
- What remains is now mostly minor scattered utility strings and small inline presentation details rather than major product surfaces.

## [2026-04-18] Converted remaining residual StatCard styling to handoff CSS classes | S1 frontend handoff cleanup
- StatCard no longer depends on inline typography/layout styling; it now uses named handoff classes while preserving dynamic color and click/accent behavior.
- Fresh verification stayed green across typecheck, focused Dashboard/StaticAnalysis/DynamicAnalysis tests, full frontend tests, and production build.
- Remaining cleanup is now almost entirely limited to scattered minor utility strings and inline presentation details rather than shared surfaces.

## [2026-04-18] Converted a final dashboard/overview residual slice and re-verified | S1 frontend handoff cleanup
- ActivityEventCard and RecentActivitySection no longer rely on inline presentation styles for the timeline icon/load-more area; those hooks moved into dashboard CSS.
- OverviewPage no longer uses an inline utility grid definition for its main split layout; the layout now uses a named handoff class in app-shell.css.
- Fresh verification stayed green across typecheck, focused Dashboard/Overview/StaticAnalysis/DynamicAnalysis tests, full frontend tests, and production build.

## [2026-04-18] Converted key overview leaf surfaces to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- OverviewSectionHeader, SecurityPostureSection, TrendSummaryCard, OverviewMetaPanel, and overviewModel SDK tone classes were moved onto named handoff CSS classes.
- Fresh verification stayed green across typecheck, focused Overview/Dashboard/StaticAnalysis/DynamicAnalysis tests, full frontend tests, and production build.
- Remaining cleanup is now mostly minor scattered utility strings in lower-priority overview/dashboard leaves rather than structural or shared surfaces.

## [2026-04-18] Converted additional overview leaf surfaces to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- OverviewEmptyState, OverviewActivityPanel, and BuildTargetsSection were moved onto named handoff CSS classes instead of utility-heavy layout strings.
- Fresh verification stayed green across typecheck, focused Overview/Dashboard/StaticAnalysis/DynamicAnalysis tests, full frontend tests, and production build.
- Remaining cleanup is now mostly cosmetic/local low-priority utility strings rather than structural/shared surfaces.

## [2026-04-19] Converted another dashboard/overview residual slice and re-verified | S1 frontend handoff cleanup
- OverviewBottomGrid now uses named handoff classes for full-width actions and target summary badges instead of utility-heavy class strings.
- ProjectExplorer table gate cells no longer rely on inline text-align styling; alignment moved into dashboard CSS.
- Fresh verification stayed green across typecheck, focused Overview/Dashboard/StaticAnalysis/DynamicAnalysis tests, full frontend tests, and production build.

## [2026-04-19] Removed remaining inline tone styling from Overview security posture cards and re-verified | S1 frontend handoff cleanup
- SecurityPostureSection now uses severity-specific handoff classes instead of inline border/color styles for the posture cards and labels.
- Fresh verification stayed green across typecheck, focused Overview/Dashboard/StaticAnalysis/DynamicAnalysis tests, full frontend tests, and production build.
- Remaining cleanup is now mostly small scattered utility strings and inline presentation details in low-priority leaves rather than reusable surfaces.

## [2026-04-19] Converted analysis-history toolbar and runs table to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- AnalysisHistoryToolbar and AnalysisHistoryRunsTable now use named handoff CSS classes for filters, stat cards, status pills, severity summaries, and table surface styling instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused AnalysisHistory/Overview/Dashboard/StaticAnalysis/DynamicAnalysis tests, full frontend tests, and production build.
- Remaining cleanup is now mostly scattered cosmetic utility strings and inline presentation details in lower-priority leaves rather than reusable surfaces.

## [2026-04-19] Deduped analysis-history handoff CSS block and re-verified clean build | S1 frontend handoff cleanup
- A duplicated analysis-history CSS block in app-shell.css was removed to restore a single canonical definition set.
- Fresh verification stayed green across typecheck, the full frontend test suite, and production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings rather than reusable or structural surfaces.

## [2026-04-19] Converted DynamicTestResultsView to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- DynamicTestResultsView now uses named handoff CSS classes for stats, metadata tiles, finding cards, IO rows, and expanded LLM-analysis panels instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused DynamicTestPage, FileDetailPage, and OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now mostly FileDetailSourcePanel plus smaller cosmetic utility strings and inline presentation details in lower-priority leaves/modals.

## [2026-04-19] Converted FileDetailSourcePanel to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- FileDetailSourcePanel now uses named handoff CSS classes for code rows, preview surface, markdown tabs, empty state, maximize control, and fullscreen dialog shell instead of utility-heavy class strings and inline highlight styling.
- Fresh verification stayed green across typecheck, focused FileDetailPage, DynamicTestPage, and OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now mostly minor scattered utility strings and inline presentation details in low-priority leaves and modals rather than reusable or structural surfaces.

## [2026-04-19] Converted file-detail and dynamic-test result surfaces to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- FileDetailSourcePanel now uses named handoff CSS classes for code rows, preview surface, markdown tabs, empty state, maximize control, and fullscreen dialog shell.
- DynamicTestResultsView now uses named handoff CSS classes for stats, metadata tiles, finding cards, IO rows, and expanded LLM-analysis panels.
- Fresh verification stayed green across typecheck, focused FileDetailPage/DynamicTestPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Converted DynamicTestRunningView to handoff CSS classes, added focused regression coverage, and re-verified | S1 frontend handoff cleanup
- DynamicTestRunningView now uses named handoff CSS classes for progress layout, chart empty state, chart SVG styling, and live findings log rows instead of utility-heavy class strings.
- Added focused regression coverage for DynamicTestRunningView before the cleanup to lock in the running-state UI contract.
- Fresh verification stayed green across typecheck, focused component/page tests, the full frontend suite, and a production build.

## [2026-04-19] Converted DynamicTestHistoryView to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- DynamicTestHistoryView now uses named handoff CSS classes for loading shell, empty-state workspace surface, checklist chips, history rows, strategy/metric copy, and delete-action reveal instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused DynamicTestPage, DynamicTestRunningView, FileDetailPage, and OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings rather than structural/shared surfaces.

## [2026-04-19] Converted OverallStatusTab and child summary cards to handoff CSS classes, with regression coverage | S1 frontend handoff cleanup
- Added focused regression coverage for OverallStatusTab before the cleanup to lock in period switching and linked-item behavior.
- OverallStatusTab, TopFilesCard, TopRulesCard, and RecentRunsList now use named handoff CSS classes for distribution bars, ranked rows, recent-run badges, and section grids instead of utility-heavy strings.
- Fresh verification stayed green across typecheck, focused StaticAnalysis/Overview/Dashboard tests, the full frontend suite, and a production build.

## [2026-04-19] Converted FileDetailHeader to handoff CSS classes, added focused regression coverage, and re-verified | S1 frontend handoff cleanup
- Added focused FileDetailHeader regression coverage before cleanup to lock in metadata badge rendering and download action behavior.
- FileDetailHeader now uses named handoff CSS classes for the identity row, icon shell, title/path stack, download action, and metadata/vulnerability badges instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused FileDetailHeader/FileDetailPage/DynamicTestPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Converted TargetSelectDialog to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- TargetSelectDialog now uses named handoff CSS classes for dialog shell, target rows, selection indicator, title/path stack, SDK label, and footer action layout instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused TargetSelectDialog/StaticAnalysis/Overview/Dashboard tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings rather than structural/shared surfaces.

## [2026-04-19] Converted BuildTargetCreateDialog to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- BuildTargetCreateDialog now uses named handoff CSS classes for dialog shell, field stack, included-path section, help copy, selection summary, and footer layout instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused BuildTargetCreateDialog/FilesPage/FileDetailPage/DynamicTestPage/OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted quality-gate card/rule presentation to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- Quality gate presentation constants now resolve to named handoff badge/banner/rule classes instead of utility-heavy strings, and QualityGateCard/QualityGateRuleResultRow now use structural handoff classes for headers, overrides, action forms, and rule copy.
- Fresh verification stayed green across typecheck, focused QualityGate/Overview/Dashboard/StaticAnalysis tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings rather than structural/shared surfaces.

## [2026-04-19] Converted SettingsBackendSection to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- SettingsBackendSection now uses named handoff CSS classes for the title row, icon shell, input/status indicator stack, button row, result message, and reset action instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused Settings/Overview/Dashboard tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Added focused BuildTargetRow coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added focused BuildTargetRow regression coverage before cleanup to lock in ready/failed action behavior and action-lock handling.
- BuildTargetRow now uses named handoff CSS classes for the status shell, metadata chips, build-command block, stepper spacing, and action rail instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused BuildTargetRow plus FilesPage/FileDetailPage/DynamicTestPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Converted SettingsThemeSection to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- SettingsThemeSection now uses named handoff CSS classes for the title row, icon shell, description stack, and theme option pill group instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused Settings/Overview/Dashboard tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted settings API/platform panels to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- SettingsApiAccessSection now uses named handoff CSS classes for info surfaces and status badge styling instead of utility-heavy class strings.
- SettingsPlatformSection now uses named handoff CSS classes for title row, metadata rows, version pill, and license badge instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused Settings/Overview/Dashboard tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused BuildTargetSection coverage, converted its wrapper surfaces to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct BuildTargetSection regression coverage for loading, add-form, and target/log/edit-dialog states before the cleanup.
- BuildTargetSection now uses named handoff CSS classes for its main card shell, title row, add-form wrapper, field stack, form actions, loading state, and empty state instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused BuildTargetSection/FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Converted TargetLibraryPanel to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- TargetLibraryPanel now uses named handoff CSS classes for its loading shell, header row, count summary, library rows, version/path/modified-file copy, and save/cancel action bar instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused TargetLibraryPanel plus FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted BuildLogViewer to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- BuildLogViewer now uses named handoff CSS classes for the dialog shell, header row, title/status line, action cluster, log body, preformatted content, and empty state instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused BuildLogViewer plus FilesPage/FileDetailPage/OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Added focused coverage for BuildTargetActionBar/BuildTargetSectionSummary, converted them to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for BuildTargetActionBar and BuildTargetSectionSummary before cleanup to lock in action-enablement and pipeline/ready-summary behavior.
- BuildTargetActionBar and BuildTargetSectionSummary now use named handoff CSS classes for action row, running/ready banners, and count/failure copy instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused files/settings/overview tests, the full frontend suite, and a production build.

## [2026-04-19] Converted FileUploadView to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- FileUploadView now uses named handoff CSS classes for the existing-file picker rows, upload dropzone, newly added file list, and selected-file footer summary instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused FileUploadView/StaticAnalysis/Overview/Dashboard tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted BuildProfileForm to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- BuildProfileForm now uses named handoff CSS classes for field stacks, field labels, advanced-toggle chevron state, and advanced textarea/input field wrappers instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused BuildProfileForm plus FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted CustomReportModal to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- CustomReportModal now uses named handoff CSS classes for its modal shell, header/copy, field stack, textarea/select controls, and footer action bar instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused CustomReportModal/Settings/Overview tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted SdkUploadForm to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- SdkUploadForm now uses named handoff CSS classes for field stacks, labels, mode pills, upload zones, file preview list, and footer actions instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused SdkUploadForm/Settings/Overview tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted ErrorBoundary fallback surface to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- ErrorBoundary fallback UI now uses named handoff CSS classes for the shell, icon, title, description, and action button spacing instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused ErrorBoundary/Settings/Overview tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted quality-gate sidebar/banner residual surfaces to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- QualityGateStatusBanner now uses named handoff CSS classes for its body, copy block, title, and timestamp while continuing to reuse the centralized status-class mapping.
- QualityGateSidebar now uses named handoff CSS classes for the scroll container/body and the disabled guide action instead of residual utility-heavy classes.
- Fresh verification stayed green across typecheck, focused QualityGate/Overview/Dashboard tests, the full frontend suite, and a production build.

## [2026-04-19] Added direct BuildTargetTreeSelector coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for BuildTargetTreeSelector before cleanup to lock in folder/file rendering, file toggling, folder cascade toggling, and disabled behavior.
- BuildTargetTreeSelector now uses named handoff CSS classes for rows, checkboxes, indent/chevron/icons, names, counts, and the tree container instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused BuildTargetTreeSelector/FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused ReportFindingsSection coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for ReportFindingsSection to lock in its empty-state and populated table rendering before cleanup.
- ReportFindingsSection now uses named handoff CSS classes for card shell, table head cells, title/location block, and evidence badge/empty copy instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused ReportFindingsSection/ReportPage/Settings/Overview tests, the full frontend suite, and a production build.

## [2026-04-19] Converted ReportFiltersPanel to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- ReportFiltersPanel now uses named handoff CSS classes for the card shell, title, filter field stack, select widths, and action row instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused ReportPage/Settings/Overview tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Added focused ReportModuleBreakdown coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for ReportModuleBreakdown to lock in empty-state and populated row rendering before cleanup.
- ReportModuleBreakdown now uses named handoff CSS classes for the card shell, table head cells, module title/key block, and status badge styling instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused ReportModuleBreakdown/ReportPage/Settings/Overview tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused report list coverage, converted report runs/approvals/audit sections to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for ReportRunsSection, ReportApprovalsSection, and ReportAuditLogSection before the cleanup to lock in empty/populated list rendering and status-badge behavior.
- Those report list surfaces now use named handoff CSS classes for card shells, row layouts, metadata groups, timestamps, and status badges instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused report/settings/overview tests, the full frontend suite, and a production build.

## [2026-04-19] Converted project-settings content/general/danger/placeholder surfaces to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- ProjectSettingsContent now uses a named handoff class for tab panels, and the general/placeholder/danger sections now rely on named handoff CSS classes for card shells, headers, form grids, labels, and danger-copy layout instead of residual utility-heavy classes.
- Fresh verification stayed green across typecheck, focused ProjectSettingsPage/Settings/Overview tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Added focused FilesLanguageSummary coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for FilesLanguageSummary to lock in summary-segment and legend rendering before cleanup.
- FilesLanguageSummary now uses named handoff CSS classes for its card shell, summary bar, segment blocks, and legend items instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused FilesLanguageSummary/FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused StaticAnalysisEmptyState coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for StaticAnalysisEmptyState to lock in the empty-state copy, checklist, and CTA behavior before cleanup.
- StaticAnalysisEmptyState now uses named handoff CSS classes for the shell, card, copy block, eyebrow, title, description, checklist, and CTA row instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused StaticAnalysisEmptyState/StaticAnalysis/Overview tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused FilesBuildTargetPanel coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for FilesBuildTargetPanel to lock in target-row rendering and build-log action behavior before cleanup.
- FilesBuildTargetPanel now uses named handoff CSS classes for the card shell, title row, target rows, target name/path, and build-log action state instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused FilesBuildTargetPanel/FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Converted file-detail vulnerability/history list sections to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- FileDetailVulnerabilitiesSection and FileDetailAnalysisHistorySection now use named handoff CSS classes for card shells, section headers, list wrappers, titles, source/location/time metadata, and empty-state copy instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused FileDetailPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Added focused AnalysisProgressView coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for AnalysisProgressView to lock in progress percentage, step labels, and current-step copy before cleanup.
- AnalysisProgressView now uses named handoff CSS classes for the shell, spinner, stepper, progress bar, and message copy instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused AnalysisProgressView/StaticAnalysis/Overview tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused ActiveAnalysisBanner coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for ActiveAnalysisBanner to lock in phase text, chunk progress, metadata line, and action buttons before cleanup.
- ActiveAnalysisBanner now uses named handoff CSS classes for the card shell, status line, action cluster, and progress track/fill instead of utility-heavy class strings.
- Fresh verification stayed green across typecheck, focused ActiveAnalysisBanner/StaticAnalysis/Overview tests, the full frontend suite, and a production build.

## [2026-04-19] Converted small settings/static-analysis wrapper surfaces to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- SettingsHeaderActions now uses a named handoff class for its action cluster instead of a utility-heavy inline flex/gap string.
- StaticAnalysisUploadScreen now uses a named handoff shell class instead of the page-enter spacing utility combination.
- Fresh verification stayed green across typecheck, focused SettingsPage/StaticAnalysisPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Converted ApprovalDecisionDialog to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- ApprovalDecisionDialog now uses named handoff CSS classes for the modal shell, header, description, body, textarea, and footer action bar instead of residual utility-heavy strings.
- Fresh verification stayed green across typecheck, focused Approvals/Settings/Overview tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Converted StaticDashboard wrapper/action/tab surfaces to handoff CSS classes and re-verified | S1 frontend handoff cleanup
- StaticDashboard now uses named handoff CSS classes for the page shell, header action cluster, tabs wrapper, tabs list, and tab triggers instead of residual utility-heavy classes.
- Fresh verification stayed green across typecheck, focused StaticAnalysisPage and OverviewPage tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Added focused AsyncAnalysisProgressView coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for AsyncAnalysisProgressView to lock in running/completed titles, chunk progress, and manual result-action visibility before cleanup.
- AsyncAnalysisProgressView now uses named handoff CSS classes for the shell, spinner/title, stepper, chunk-progress copy, progress bar, error box, actions, and handoff card instead of utility-heavy strings.
- Fresh verification stayed green across typecheck, focused AsyncAnalysisProgressView/StaticAnalysisPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused RunDetailView coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for RunDetailView to lock in summary rendering, grouped findings, and legacy-result/finding click interactions before cleanup.
- RunDetailView now uses named handoff CSS classes for the page shell, summary stats row, metadata line, grouped file cards, and finding row layout instead of utility-heavy strings.
- Fresh verification stayed green across typecheck, focused RunDetailView/StaticAnalysisPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused HighlightedCode coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for HighlightedCode to lock in empty-state copy, line-number rendering, and highlight-line class application before cleanup.
- HighlightedCode now uses named handoff CSS classes for the shell, empty copy, code lines, highlighted line state, line numbers, and line text instead of utility-heavy strings and inline highlight styling.
- Fresh verification stayed green across typecheck, focused HighlightedCode/FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-19] Added focused VulnerabilityKeyboardHint coverage, converted it to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for VulnerabilityKeyboardHint to lock in the shortcut hint copy and keycap rendering before cleanup.
- VulnerabilityKeyboardHint now uses named handoff CSS classes for the shell, inline copy, and keycap instead of a residual utility-heavy class string.
- Fresh verification stayed green across typecheck, focused VulnerabilitiesPage/SettingsPage tests, the full frontend suite, and a production build.

## [2026-04-19] Refined DynamicTestConfigView field and count surfaces onto handoff CSS classes and re-verified | S1 frontend handoff cleanup
- DynamicTestConfigView no longer relies on inherited build-profile utility label/width helpers for target and count fields; it now uses dedicated dynamic-test field classes.
- Fresh verification stayed green across typecheck, focused DynamicTest/Files/Settings/Overview tests, the full frontend suite, and a production build.
- Remaining cleanup is now primarily cosmetic/local low-priority utility strings and inline presentation details rather than structural/shared surfaces.

## [2026-04-19] Added focused FilesSourceWorkspace coverage, converted residual wrappers to handoff CSS classes, and re-verified | S1 frontend handoff cleanup
- Added direct regression coverage for FilesSourceWorkspace to lock in empty-preview copy, loading state, and finding-row interaction before cleanup.
- FilesSourceWorkspace now uses named handoff CSS classes for the tree padding wrapper, empty-preview copy/title/text, preview language badge, and error preview copy instead of residual utility-heavy strings.
- Fresh verification stayed green across typecheck, focused FilesSourceWorkspace/FilesPage/SettingsPage/OverviewPage tests, the full frontend suite, and a production build.

## [2026-04-20] mcp | register_wr | s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds.md

## [2026-04-20] mcp | register_wr | s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card.md

## [2026-04-20] mcp | register_wr | s1-to-s1-qa-s1-s1-qa-reply-mock-adherence-wr-dashboard-kpi-live-signal-ds
- Registered reply WR for s1-qa
- Path: wiki/canon/work-requests/s1-to-s1-qa-s1-s1-qa-reply-mock-adherence-wr-dashboard-kpi-live-signal-ds.md

## [2026-04-20] mcp | complete_wr | s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | register_wr | s1-to-s1-qa-s1-s1-qa-reply-v2-deep-audit-wr-activity-api-attention-affordance-token-proxy
- Registered reply WR for s1-qa
- Path: wiki/canon/work-requests/s1-to-s1-qa-s1-s1-qa-reply-v2-deep-audit-wr-activity-api-attention-affordance-token-proxy.md

## [2026-04-20] mcp | complete_wr | s1-qa-to-s1-s1-qa-s1-v2-deep-audit-wr-activity-feed-attention-card
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | register_wr | s1-to-s2-s1-s2-signup-organization-verify-password-reset-api-auth-surface
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-s1-s2-signup-organization-verify-password-reset-api-auth-surface.md

## [2026-04-20] mcp | complete_wr | s1-to-s1-qa-s1-s1-qa-reply-mock-adherence-wr-dashboard-kpi-live-signal-ds
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | complete_wr | s1-to-s1-qa-s1-s1-qa-reply-v2-deep-audit-wr-activity-api-attention-affordance-token-proxy
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | complete_wr | s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | complete_wr | s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | complete_wr | s2-to-s1-s1-qa-buildtarget-terminology-cutover-is-complete-on-active-s2-frontend-surfaces-updat
- Lane s1-qa completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | register_wr | s1-to-s2-s1-s2-repo-portable-s2-wiki-home-kosh
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-s1-s2-repo-portable-s2-wiki-home-kosh.md

## [2026-04-20] mcp | register_wr | s1-to-s3-s1-s3-repo-portable-analysis-agent-build-agent
- Registered request WR for s3
- Path: wiki/canon/work-requests/s1-to-s3-s1-s3-repo-portable-analysis-agent-build-agent.md

## [2026-04-20] mcp | register_wr | s1-to-s4-s1-s4-repo-portable-sast-runner-baseline
- Registered request WR for s4
- Path: wiki/canon/work-requests/s1-to-s4-s1-s4-repo-portable-sast-runner-baseline.md

## [2026-04-20] mcp | register_wr | s1-to-s5-s1-s5-repo-portable-s5-architecture
- Registered request WR for s5
- Path: wiki/canon/work-requests/s1-to-s5-s1-s5-repo-portable-s5-architecture.md

## [2026-04-20] mcp | register_wr | s1-to-s7-s1-s7-repo-portable-llm-gateway-readme
- Registered request WR for s7
- Path: wiki/canon/work-requests/s1-to-s7-s1-s7-repo-portable-llm-gateway-readme.md

## [2026-04-20] mcp | register_wr | s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration.md

## [2026-04-20] mcp | complete_wr | s1-to-s2-s1-s2-signup-organization-verify-password-reset-api-auth-surface
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-20] implemented lifecycle-first auth/member-management v1 and replied to S1 | s2
- Updated canonical backend-owned auth docs: shared-models, s2 api-endpoints, backend spec, s2 readme, s2 roadmap.
- Completed the S1->S2 auth surface WR from the S2 recipient perspective.
- Registered reply WR to S1 with org-code registration, no-invite lifecycle, rememberMe, password-reset, and integration guidance.

## [2026-04-20] mcp | complete_wr | s2-to-s1-reply-auth-member-management-v1-landed-on-2026-04-20-adopt-org-code-registration
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-20] mcp | register_wr | s1-to-s2-reply-s1-auth-surface-wired-to-s2-v1-contract-org-code-signup-rememberme-login-p
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-reply-s1-auth-surface-wired-to-s2-v1-contract-org-code-signup-rememberme-login-p.md

## [2026-04-20] Implemented non-production org/admin fixture seeding and password-reset dev bridge | S2 auth mock-to-real bridge
- Seeded signup org fixtures aligned with design mock codes: ACME-KR-SEC, HYUNDAI-AVSEC, LG-EV-SECOPS.
- Seeded org-admin fixture accounts acme-admin, hyundai-admin, lges-admin with default password override via AEGIS_AUTH_DEV_ADMIN_PASSWORD.
- Added GET /api/auth/dev/password-reset/latest?email= backed by SQLite dev_password_reset_deliveries for SMTP-free mock/E2E reset flows.
- Revalidated shared/backend typecheck, backend vitest (479 passed), and backend build.

## [2026-04-20] mcp | register_wr | s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid
- Registered request WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md

## [2026-04-20] Registered canonical WR for mock-to-real auth implementation/QA handoff | S2→S1 auth mock bridge WR
- Registered S2→S1 WR with seeded org codes, org-admin credentials, and non-production password-reset bridge guidance.
- WR path: wiki/canon/work-requests/s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid.md

## [2026-04-20] mcp | complete_wr | s2-to-s1-s2-s1-auth-mock-to-real-bridge-landed-use-seeded-org-codes-admins-dev-reset-brid
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-20] fixed optional sdkId scan crash and added NDJSON traceback logging | s4
- Guarded SDK resolver helpers so buildProfile without sdkId skips SDK path/compiler resolution instead of raising PosixPath/NoneType.
- Added regression tests for resolver optional-sdk behavior, /v1/scan success with buildProfile lacking sdkId, and NDJSON internal-error logging.
- Verified full services/sast-runner pytest suite passes after the fix.

## [2026-04-20] mcp | register_wr | s1-to-s2-reply-auth-happy-path-qa-green-signup-approve-rememberme-password-reset-via-dev-
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-reply-auth-happy-path-qa-green-signup-approve-rememberme-password-reset-via-dev-.md

## [2026-04-20] tightened analysis-path sdkId validation to explicit SDK_NOT_FOUND domain error | s4
- Added route-level validation so buildProfile/scanProfile sdkId values that are absent from both sdk-registry and SDK root fail fast with SDK_NOT_FOUND 400.
- Preserved native/non-SDK behavior by allowing buildProfile without sdkId to proceed normally.
- Updated canonical API/spec docs to document optional sdkId semantics and the new SDK_NOT_FOUND error.

## [2026-04-20] mcp | register_wr | s4-to-s2-s3-legacy-buildprofile.sdkid-custom-sentinel-removed-from-s4-analysis-path-omit-sdk
- Registered notice WR for s2, s3
- Path: wiki/canon/work-requests/s4-to-s2-s3-legacy-buildprofile.sdkid-custom-sentinel-removed-from-s4-analysis-path-omit-sdk.md

## [2026-04-20] removed legacy custom sdkId sentinel from analysis-path contract | s4
- Deleted runtime acceptance of buildProfile/scanProfile sdkId="custom"; callers must now omit sdkId for native/non-SDK builds.
- Added regression coverage so sdkId omission succeeds while both nonexistent and custom now fail with SDK_NOT_FOUND 400.
- Published a notice WR to S2/S3 describing the migration and updated canonical S4 API/spec/handoff docs.

## [2026-04-20] mcp | register_wr | s1-to-s2-request-return-full-registrationrequest-from-approve-reject-lookup-and-consider-
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-request-return-full-registrationrequest-from-approve-reject-lookup-and-consider-.md

## [2026-04-20] enabled hot reload by default in start-sast-runner script | s4
- scripts/start-sast-runner.sh now starts uvicorn with --reload --reload-dir app by default.
- Set SAST_HOT_RELOAD=0 to opt out and run a single-process server.
- Verified script syntax with bash -n; did not execute the start script.

## [2026-04-20] mcp | register_wr | s1-to-s2-buildtarget-quick-preflight-contract-gap-runtime-returns-sdkchoicestate-but-cano
- Registered question WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-buildtarget-quick-preflight-contract-gap-runtime-returns-sdkchoicestate-but-cano.md

## [2026-04-21] mcp | register_wr | s3-to-s2-s3-structured-finalization-contract-update-consume-structured_finalizer-policy-f
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-structured-finalization-contract-update-consume-structured_finalizer-policy-f.md

## [2026-04-21] mcp | register_wr | s3-to-s7-s3-now-depends-on-s7-strict-json-behavior-for-deep-analyze-structured-finalizer
- Registered notice WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-now-depends-on-s7-strict-json-behavior-for-deep-analyze-structured-finalizer.md

## [2026-04-21] mcp | complete_wr | s3-to-s7-s3-now-depends-on-s7-strict-json-behavior-for-deep-analyze-structured-finalizer
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-21] tightened async strict JSON terminal failure contract for S3 structured finalizer | s7
- S7 now preserves explicit retryable terminal failure details for async ownership strict JSON violations instead of only marking the async request failed.
- Added status/result fields: error, errorDetail, retryable; strict JSON violations use blockedReason=strict_json_contract_violation and retryable=true.
- Updated canonical S7 API/spec/handoff/roadmap docs and rebuilt wiki index.
- Verified focused suite: 48 passed; full services/llm-gateway suite: 206 passed.

## [2026-04-21] mcp | register_wr | s7-to-s3-reply-async-strict-json-terminal-failure-contract-tightened-for-s3-structured-fi
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-async-strict-json-terminal-failure-contract-tightened-for-s3-structured-fi.md

## [2026-04-21] enabled hot reload by default in start-llm-gateway script | s7
- scripts/start-llm-gateway.sh now builds a uvicorn command with --reload --reload-dir app by default.
- Set S7_HOT_RELOAD=0 or AEGIS_HOT_RELOAD=0 to opt out.
- AEGIS_PRINT_CMD=1 prints the command without starting the service; AEGIS_LLM_GATEWAY_PORT can override port 8000.
- Verified syntax and printed command shapes; did not execute the start script as a running service.

## [2026-04-21] mcp | register_wr | s2-to-s1-reply-buildtarget-quick-preflight-uses-canonical-sdkchoicestate
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-buildtarget-quick-preflight-uses-canonical-sdkchoicestate.md

## [2026-04-21] mcp | complete_wr | s1-to-s2-buildtarget-quick-preflight-contract-gap-runtime-returns-sdkchoicestate-but-cano
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | register_wr | s2-to-s1-reply-registrationrequest-responses-normalized-to-full-shape-with-populated-org-
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-registrationrequest-responses-normalized-to-full-shape-with-populated-org-.md

## [2026-04-21] mcp | complete_wr | s1-to-s2-request-return-full-registrationrequest-from-approve-reject-lookup-and-consider-
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s1-to-s2-reply-auth-happy-path-qa-green-signup-approve-rememberme-password-reset-via-dev-
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s1-to-s2-reply-s1-auth-surface-wired-to-s2-v1-contract-org-code-signup-rememberme-login-p
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | register_wr | s2-to-s3-reply-s2-preserves-structured_finalizer-policy-flag-and-treats-validation_failed
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-reply-s2-preserves-structured_finalizer-policy-flag-and-treats-validation_failed.md

## [2026-04-21] mcp | complete_wr | s3-to-s2-s3-structured-finalization-contract-update-consume-structured_finalizer-policy-f
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s4-to-s2-s3-legacy-buildprofile.sdkid-custom-sentinel-removed-from-s4-analysis-path-omit-sdk
- Lane s2 completed recipient-side handling
- Status: open

## [2026-04-21] Resolved S2 recipient-side actions for S1/S3/S4 WR backlog | S2 WR backlog triage and implementation
- Canonicalized BuildTarget.sdkChoiceState as S1 Quick preflight field and sent S2→S1 reply.
- Normalized RegistrationRequest lookup/approve/reject response shape with populated organizationCode/organizationName and sent S2→S1 reply.
- Acknowledged and completed S1 auth wiring and happy-path QA replies.
- Confirmed S3 structured_finalizer handling with regression coverage and sent S2→S3 reply.
- Handled S4 sdkId=custom notice by stripping the sentinel from outgoing S4 scan payloads.
- Critic review approved; full backend verification passed: 27 files / 482 tests.

## [2026-04-21] mcp | register_wr | s2-to-s1-s2-api-contract-delta-notice-buildtarget-sdkchoicestate-full-registrationrequest
- Registered notice WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-api-contract-delta-notice-buildtarget-sdkchoicestate-full-registrationrequest.md

## [2026-04-21] mcp | register_wr | s2-to-s3-s2-consumer-alignment-notice-s4-native-scans-now-omit-legacy-sdkid-custom-sentin
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-s2-consumer-alignment-notice-s4-native-scans-now-omit-legacy-sdkid-custom-sentin.md

## [2026-04-21] Registered outbound WR notices for lanes affected by S2 API contract changes | S2 contract delta outbound notices
- S2→S1 notice registered for BuildTarget.sdkChoiceState, full RegistrationRequest responses, and structured_finalizer display hint.
- S2→S3 notice registered for S4 native scan sdkId custom sentinel omission alignment.
- These notices supplement the narrower reply WRs already sent while closing the S2 backlog.

## [2026-04-21] mcp | complete_wr | s2-to-s3-reply-s2-preserves-structured_finalizer-policy-flag-and-treats-validation_failed
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s7-to-s3-reply-async-strict-json-terminal-failure-contract-tightened-for-s3-structured-fi
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s2-to-s3-s2-consumer-alignment-notice-s4-native-scans-now-omit-legacy-sdkid-custom-sentin
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s2-to-s1-s2-api-contract-delta-notice-buildtarget-sdkchoicestate-full-registrationrequest
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s2-to-s1-reply-buildtarget-quick-preflight-uses-canonical-sdkchoicestate
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s2-to-s1-reply-registrationrequest-responses-normalized-to-full-shape-with-populated-org-
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-21] implemented structured S4 observability summaries | s4
- Added Scan execution summary, Build execution summary, and Request terminal summary structured log events.
- Added startup runtime configuration and ready-for-traffic logs including hotReload/config/tool-policy fields.
- Updated start-sast-runner hot reload env export/print behavior and canonical S4 docs.

## [2026-04-21] mcp | register_wr | s3-to-s2-s3-v1-tasks-terminal-failures-now-return-non-2xx-http-status
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-v1-tasks-terminal-failures-now-return-non-2xx-http-status.md

## [2026-04-21] Aligned terminal task failures with non-2xx HTTP statuses | S3 Analysis Agent /v1/tasks HTTP status contract
- Changed S3 router so `completed` returns HTTP 200, `validation_failed` returns 422, budget failures 413, timeouts 504, and model errors 503.
- Added `X-AEGIS-Task-Ok` and `X-AEGIS-Task-Status` response headers for machine-readable task outcome.
- Added regression coverage for deep-analyze `INVALID_SCHEMA` terminal validation failure returning HTTP 422 instead of HTTP 200.
- Updated `wiki/canon/api/analysis-agent-api.md` and `wiki/canon/specs/analysis-agent.md`; sent S2 notice WR.

## [2026-04-21] Hardened deep-analyze against missing caveats/usedEvidenceRefs | S3 Deep required Assessment fields
- ResultAssembler now normalizes missing/non-list top-level `caveats` to `[]` before schema validation, so optional-content-required-schema omissions do not become terminal invalid output.
- Missing `usedEvidenceRefs` is inferred from claim-level `supportingEvidenceRefs` when possible, then sanitized/validated through the existing evidence pipeline.
- Deep finalizer and Phase 1 prompts now explicitly require `caveats` and `usedEvidenceRefs` to be emitted as `[]` when empty.
- Regression tests added; focused tests 20 passed, full analysis-agent suite 339 passed.

## [2026-04-21] Added strict rerun/finalizer path for schema-valid JSON with broken claims structure | S3 Deep malformed claims strict schema repair
- AgentLoop now probes parsed final JSON for schema errors before result assembly.
- Harmless required optional-content omissions are normalized for the probe, but malformed core structures such as non-dict `claims[]` trigger one strict structured finalizer repair call.
- The repaired output still goes through ResultAssembler, schema validation, evidence sanitizer, and evidence validation.
- Regression added for `claims` emitted as a string; focused tests 19 passed and full analysis-agent suite 340 passed.

## [2026-04-21] Completed Ralph hardening with Critic approval | S3 strict structured output and evidence grounding
- Deep and generate-poc now attempt strict repair for missing/null/wrong-type required fields and malformed claim objects rather than silently normalizing them.
- SchemaValidator requires all Assessment top-level fields plus claim statement/detail/supportingEvidenceRefs/location, with list element type checks and non-empty claim text/location checks.
- ResultAssembler and generate-poc validate raw evidence before sanitizer; unsupported/hallucinated refs produce INVALID_GROUNDING instead of completed output.
- Evidence sanitizer no longer fuzzy-corrects unsupported refs; generate-poc no longer injects fallback evidence refs or locations.
- Final Critic verdict: APPROVE. Post-deslop focused suite: 69 passed; full analysis-agent suite: 349 passed.

## [2026-04-21] mcp | register_wr | s3-to-s2-s3-strict-assessment-contract-now-rejects-missing-fields-and-unsupported-evidenc
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-strict-assessment-contract-now-rejects-missing-fields-and-unsupported-evidenc.md

## [2026-04-21] mcp | register_wr | s2-to-s3-reply-s2-agentclient-now-parses-non-2xx-terminal-task-failures-and-preserves-str
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-reply-s2-agentclient-now-parses-non-2xx-terminal-task-failures-and-preserves-str.md

## [2026-04-21] mcp | complete_wr | s3-to-s2-s3-v1-tasks-terminal-failures-now-return-non-2xx-http-status
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-21] mcp | complete_wr | s3-to-s2-s3-strict-assessment-contract-now-rejects-missing-fields-and-unsupported-evidenc
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-21] Aligned AgentClient with non-2xx strict Assessment failure contract | S2 S3 task failure transport alignment
- Handled S3 WRs for /v1/tasks terminal non-2xx failures and strict Assessment INVALID_SCHEMA/INVALID_GROUNDING semantics.
- AgentClient now parses structured non-2xx failure JSON and returns AgentResponseFailure preserving failureCode/failureDetail/audit.
- Verified backend typecheck, client contract test (38 passed), full backend vitest (483 passed), and backend build.

## [2026-04-21] mcp | complete_wr | s2-to-s3-reply-s2-agentclient-now-parses-non-2xx-terminal-task-failures-and-preserves-str
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-21] Fixed repair retry preserving invalid JSON shape | S3 generate-poc deterministic schema scaffold repair
- Verified failing evidence package SHA256 3be1d77d58e73444613be02043c30566bf33edffa6097c477ad5bff2aaf56f8a and log trace for req-e2e-poc-stable10-20260421-192806-09.
- generate-poc schema repair now builds a deterministic Assessment scaffold before retry and merges LLM refinement without permitting required key deletion or invalid shape preservation.
- Scaffold preserves summary/claim statement/detail and restores location/supportingEvidenceRefs/usedEvidenceRefs from trusted input claim or request evidence refs where possible.
- Regression added for initial and repair outputs both containing only summary+claims; focused suite 60 passed, full analysis-agent suite 350 passed.

## [2026-04-22] Implemented evidence-catalog based deep/generate-poc hardening with Critic approval | S3 certificate-maker hot15 reliability implementation
- Added S3 evidence catalog lifecycle from request refs, Phase 1 evidence, and AgentLoop tool results.
- Deep false-negative claims=[] now triggers quality retry and deterministic repair only for complete same-path command-injection evidence bundles; incomplete evidence fails INVALID_GROUNDING.
- Deep claim missing location/supporting refs can be repaired from catalog evidence; no project-specific certificate-maker hardcoding or first-N ref fallback remains.
- generate-poc scaffold repair now preserves required shape; strict_json_contract_violation has enriched exception metadata and bounded retry handling.
- Focused suite 86 passed; full analysis-agent suite 369 passed; Critic approved. Partial exact hot run first 3 attempts passed, exact 15/15 remains to be run.

## [2026-04-22] planning | s3 hot15 deep-analyze schema/grounding repair ralplan approved
- Created deliberate RALPLAN for certificate-maker hot15 12/15 remaining S3 failures.
- Architect iterated on structured-finalizer alignment, narrow knowledge-ref cleanup, invalid-ref preservation, severity inference, bundle coherence, and analysis-agent-only scope; re-approved.
- Critic iterated on post-cleanup category/coherence grounding gate; final critic approved.
- Artifacts: .omx/plans/ralplan-s3-hot15-deep-grounding-repair.md, .omx/plans/prd-s3-hot15-deep-grounding-repair.md, .omx/plans/test-spec-s3-hot15-deep-grounding-repair.md

## [2026-04-22] implementation | s3 hot15 deep-analyze schema/grounding repair implemented
- Scope: services/analysis-agent only.
- Implemented prompt/finalizer alignment: all strict Assessment fields listed; finalizer excludes knowledge refs from grounding refs.
- Implemented deterministic deep final canonicalization before strict validation: safe metadata scaffold, exact CWE-shaped contextual knowledge cleanup, local ref sync, and command-injection category/coherence grounding gate.
- Added regressions for metadata scaffold, knowledge ref cleanup/repopulation, SAST-only after strip, mismatched CWE, fake mixed refs, typo knowledge refs, unrelated path refs, unrelated caller refs, system/shell/exec marker handling, and plain execution false positives.
- Verification: focused PRD set 92 passed; full analysis-agent 387 passed; compileall passed; git diff --check -- services/analysis-agent passed; Architect post-deslop APPROVE.
- Exact certificate-maker hot15 E2E not run in this session.

## [2026-04-22] mcp | register_wr | s1-to-s1-redesign-qualitygatepage-onto-canonical-analyst-s-console-vocab
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-to-s1-redesign-qualitygatepage-onto-canonical-analyst-s-console-vocab.md

## [2026-04-22] mcp | register_wr | s1-to-s1-redesign-approvalspage-as-canonical-triage-queue
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-to-s1-redesign-approvalspage-as-canonical-triage-queue.md

## [2026-04-22] implementation | s3 hot15 fail-fast regression fixed after first rerun failure
- User reran certificate-maker fail-fast hot15 base hot15-20260422-163238; run 01 failed Stage 5 deep-analyze with INVALID_GROUNDING: insufficient_command_injection_grounding.
- Root cause: precomputed Quick path supplied SAST and S5 dangerous-callers but no deterministic source/input-path ref when the LLM made zero code.read_file calls; the new coherence gate rejected the claim.
- Fix: deep_analyze_handler now ingests command-injection SAST source files from trusted projectPath into EvidenceCatalog before prompt/result assembly; ResultAssembler can repopulate partial local command-injection refs from a complete coherent bundle but still blocks incoherent local refs.
- Verification after fix: source/result/evidence subset 46 passed; focused PRD set 94 passed; full analysis-agent 389 passed; compileall and git diff --check passed; Architect approved. Exact hot15 rerun not performed in this session after the fix.

## [2026-04-22] mcp | register_wr | s1-to-s1-redesign-reportpage-onto-analyst-s-document-tone
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-to-s1-redesign-reportpage-onto-analyst-s-document-tone.md

## [2026-04-22] mcp | register_wr | s1-to-s1-redesign-analysishistorypage-run-table-onto-canonical-run-row-status-vocab
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-to-s1-redesign-analysishistorypage-run-table-onto-canonical-run-row-status-vocab.md

## [2026-04-22] mcp | register_wr | s1-to-s1-projectsettingspage-phase-2-polish-after-canonical-baseline
- Registered request WR for s1
- Path: wiki/canon/work-requests/s1-to-s1-projectsettingspage-phase-2-polish-after-canonical-baseline.md

## [2026-04-22] cleanup | s3 hot15 slop cleanup after critic review
- User stopped hot15 patch-chasing and requested removal of slop/patchy code before design discussion.
- Strict Critic reviewed current dirty diff and classified it as hot15/CWE-78 semantic slop: low-confidence demotion, same-root popen collapse, generate-poc next-step injection, and associated tests.
- Applied cleanup by restoring the dirty S3 files: result_assembler.py, generate_poc_handler.py, test_result_assembler.py, test_generate_poc_handler.py.
- Verification after cleanup: focused tests 79 passed; full analysis-agent 389 passed; compileall/diff-check passed; strict Critic final APPROVE; working tree clean for services/analysis-agent/global per critic.
- Next discussion should focus on final-output failure retry policy rather than CWE-78 semantic hotfixing.

## [2026-04-22] audit | s3 head-level slop audit after dirty cleanup
- User noted a one-commit rollback is insufficient; audited current HEAD after dirty diff cleanup.
- Working tree is clean and tests pass, but HEAD contains command-injection/CWE-78-specific semantic repair in ResultAssembler, AgentLoop false-negative retry, EvidenceCatalog command_injection_bundle, and deep handler source ingestion.
- Audit artifact: .omx/context/s3-head-slop-audit-20260422T085916Z.md
- Recommendation: stop hot15 patch chasing; plan final-output full retry and generic root-cause/evidence-role normalization boundaries.

## [2026-04-22] audit | s3 deeper history audit found slop spans e408 d134 662
- User clarified rollback must go further back than HEAD~1/2. Read-only git history audit found path-relevant S3 drift across e408c8a, d134b6c, and 6628a0a.
- e408c8a introduced EvidenceCatalog/CommandInjectionBundle, ResultAssembler deterministic command-injection repair, AgentLoop command-injection false-negative retry, and strict-json/generate-poc scaffold mixed together.
- d134b6c expanded canonicalization/knowledge-ref cleanup/coherence logic.
- 6628a0a added deep_analyze_handler command-injection source-file ingestion and partial ref repopulation.
- Candidate pre-drift baseline for affected S3 semantic repair is e408c8a^, but useful strict-json/generate-poc schema work must be separated from CWE-78 semantic repair before any surgical revert.
- Artifact: .omx/context/s3-deep-history-audit-20260422T090500Z.md

## [2026-04-22] audit | s3 two-day change audit requested by user
- User clarified S3 test/debug changes began at least two days earlier and each S3 change since then must be audited.
- Fresh audit enumerated S3 path commits since 2026-04-20: 495f8a1, 69d5ea4, 6b116e4, e408c8a, d134b6c, 6628a0a.
- Finding: explicit deep-analyze CWE-78 semantic repair decision path starts at e408c8a and is expanded by d134b6c/6628a0a, but 69d5ea4 and 6b116e4 also contain related Build/generate-poc/structured-output work that must be hunk-classified before any cleanup.
- Fresh evidence: focused tests 68 passed; full analysis-agent 389 passed; compileall/diff-check passed; Critic approved rollback-by-HEAD~1/2 is insufficient.
- Artifact: .omx/context/s3-two-day-change-audit-20260422T091000Z.md

## [2026-04-22] planning | s3 final-output cleanup ralplan approved
- Consensus plan approved after Architect and Critic iterations.
- Plan audits all S3 changes since 2026-04-20, not only HEAD~1/2.
- Decision: surgical cleanup, retain EvidenceCatalog metadata-only, remove CommandInjectionBundle/semantic completeness APIs, remove ResultAssembler command-injection semantic repair, remove AgentLoop command-injection retry, remove deep handler command-injection source ingest, and clean generate-poc command-injection quality gates.
- Live hot15 intentionally not a cleanup gate; next design step is generic final-output full retry/root-cause normalization.
- Artifacts: .omx/plans/ralplan-s3-final-output-clean-refactor.md, .omx/plans/prd-s3-final-output-clean-refactor.md, .omx/plans/test-spec-s3-final-output-clean-refactor.md

## [2026-04-22] implementation | s3 final-output cleanup executed
- Executed approved S3 cleanup/refactor plan; live hot15 intentionally not used as gate.
- Removed production CWE-78/command-injection semantic drift: ResultAssembler semantic repair/gates, AgentLoop command-injection retry, deep handler source ingest, EvidenceCatalog bundle/completeness APIs, generate-poc command-injection/CN/shell quote quality gates.
- Retained EvidenceCatalog as metadata-only and preserved generic structured-output/schema/evidence/HTTP reliability behavior.
- Verification: focused cleanup suite 55 passed; integration-ish suite 37 passed; full analysis-agent 355 passed; compileall and diff-check passed; production-forbidden grep no output; fixture grep only intentional absence assertion.
- Strict Critic approved; Architect approved and post-deslop approved.

## [2026-04-22] implementation | s3 final-output semantic drift cleanup completed
- Scope: services/analysis-agent final-output cleanup. This did not attempt full S3 all-code deslop or build-agent/agent-shared refactor.
- Removed production CWE-78/command-injection/certificate-maker/hot15 semantic drift from ResultAssembler, AgentLoop, EvidenceCatalog, deep_analyze_handler, and generate_poc_handler.
- Verification: focused cleanup suite 55 passed; integration-ish suite 37 passed; full analysis-agent 355 passed; compileall and diff-check passed; production-forbidden grep no output; fixture grep only intentional command_injection_bundle absence assertion.
- Strict Critic approved. Architect approved and post-deslop approved.
- Live hot15 intentionally not run because cleanup success criterion is removal of semantic drift, not target-specific E2E pass.

## [2026-04-22] S3 owned-code AI slop cleanup verified | s3-owned-code-ai-slop-cleanup-20260422
- Ralph + ai-slop-cleaner cleanup covered S3-owned analysis-agent, build-agent, agent-shared, and S3 start scripts.
- Full regression evidence: analysis-agent 353 passed; build-agent 243 passed; compileall and diff-check passed.
- Generated/cross-lane artifacts removed, dead legacy analysis pipeline/client seam removed, build-agent boundary issues hardened, production mock/unittest.mock usage removed.

## [2026-04-23] spec-draft | S3 claim-evidence state machine draft pages
- Created wiki/canon/specs/s3-claim-evidence-state-machine/readme.md as the canonical draft surface for S3 claim/evidence/retry/quality state-machine work.
- Created wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md with the first TaskRun Mermaid statechart, state definitions, terminal semantics draft, and transition-table sketch.
- Design intent: avoid certificate-maker/CWE-78 patching by defining generic EvidenceRef, retry, grounding, and quality controller contracts first.

## [2026-04-23] spec-draft | S3 EvidenceRef and EvidenceSlot contract
- Created wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md.
- Defined local, knowledge, derived, and operational evidence classes for S3 grounding.
- Defined conservative claim-ref policy: claims[].supportingEvidenceRefs must be local or derived-from-local in v1; knowledge refs may be used in usedEvidenceRefs only if present in the S3 evidence ledger and allowed set.
- Added EvidenceSlot catalog, lifecycle Mermaid, draft required-slot policy by vulnerability family, ref repair rules, and required fixture tests.
- Updated the S3 Claim-Evidence State Machine root page to link the new evidence contract and make retry-repair-policy.md the next page.

## [2026-04-23] spec-draft | S3 claim-evidence state machine page family completed with Critic approval
- Completed draft page family under wiki/canon/specs/s3-claim-evidence-state-machine/: readme, taskrun-statechart, evidence-ref-and-slots, retry-repair-policy, claim-lifecycle, quality-gates, poc-lifecycle, invariants, transition-table, implementation-work-packages, api-contract-decisions.
- Critic agent 019db8d4-8dea-72e0-8a29-9a0ec35328ff first returned REVISE; fixes applied for v1 usedEvidenceRefs policy, no-accepted-claim semantics, typed quality/no-accepted API gate, explicit audited ref repair, accepted-claim-only PoC precondition, and caveated quality pass semantics.
- Critic final verdict: APPROVE with no remaining blocking issues; non-blocking wording cleanups applied.
- Verification: markdown fence parity checked for all pages; suspicious stale wording scan passed after cleanup.

## [2026-04-23] verification | S3 claim-evidence state machine architect/deslop verification
- Architect verification approved the page family as coherent and safe as a planning/specification surface.
- Scoped deslop verification on the state-machine wiki pages passed duplicate heading, stale ambiguity, and markdown fence parity checks.
- Additional test evidence appended to wiki/canon/handoff/s3/session-s3-claim-evidence-state-machine-20260423.md.

## [2026-04-23] spec-revision | S3 claim-evidence state machine outcome/quality separation rewrite
- Revised the S3 claim-evidence state-machine wiki family to separate task-level completion from result-level quality/outcome.
- New decision: valid caller input + live LLM/runtime should produce schema-valid completed response; schema/ref/grounding/quality/PoC deficiencies go through RecoveryTriage and become analysisOutcome/qualityOutcome/pocOutcome rather than task failure.
- Task-level failure is now reserved for invalid caller input, unsafe/out-of-authority request, unavailable runtime/dependency, hard timeout/cancellation, or internal envelope-assembly failure.
- Critic final verdict: APPROVE after fixes; Architect final verdict: APPROVED as planning/spec surface with WP0/API-S2 alignment required before implementation/default exposure.

## [2026-04-23] Ran S7 pytest suite and legacy static-explain integration test | s7 llm-gateway test plate
- pytest: 206 passed in 2.89s
- legacy integration: temporary gateway on port 8199, static-explain completed against Qwen/Qwen3.5-122B-A10B-GPTQ-Int4 in 33209ms
- integration warning: RAG disabled, ragHits=0

## [2026-04-23] mcp | register_wr | s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio.md

## [2026-04-23] work-request | S3 to S7 Qwen3.6 rollout semantics confirmation
- Registered canonical WR wiki/canon/work-requests/s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio.md.
- WR asks S7 to confirm Qwen3.6 model/profile identity, strict JSON and thinking-output handling, tool-call parser compatibility, effective context limits, latency/timeout profile, async ownership compatibility, and canonical S7 wiki/API updates.
- Purpose: let S3 implement RecoveryTriage / QualityGate / outcome-classification controller without stale Qwen3.5 assumptions.

## [2026-04-23] Added Qwen3.6 vLLM engine start/stop recipe scripts for S7 | s7 qwen3.6 vllm recipe
- Added scripts/start-llm-engine-qwen36-vllm.sh and scripts/stop-llm-engine-vllm.sh.
- Documented Qwen3.6 vLLM recipe in wiki/canon/handoff/s7/architecture.md.
- Verified bash syntax and dry-run commands for Qwen/Qwen3.6-27B and Qwen/Qwen3.6-35B-A3B.
- Current active engine still advertises Qwen/Qwen3.5-122B-A10B-GPTQ-Int4 because the endpoint is remote and not controllable from this container via local process management.

## [2026-04-23] Documented provisional Qwen3.6 rollout semantics for S3 dependency WR | s7 qwen3.6 contract docs for s3 wr
- Updated wiki/canon/specs/llm-gateway.md with active-not-switched status, strict JSON, tool-call, context, timeout, async compatibility notes.
- Updated wiki/canon/api/llm-gateway-api.md with API-compatible Qwen3.6 rollout note.
- Updated wiki/canon/handoff/s7/readme.md with rollout status and pending verification gates.
- Did not complete S3 WR because live Qwen3.6 cutover is not yet verified.

## [2026-04-23] mcp | register_wr | s7-to-s3-reply-qwen3.6-rollout-recipe-prepared-s7-live-cutover-not-yet-verified
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-qwen3.6-rollout-recipe-prepared-s7-live-cutover-not-yet-verified.md

## [2026-04-24] autopilot-resume-verified | s7-qwen-hard-retest
- S7 hard benchmark harness resumed after interruption.
- Added bubblewrap-isolated hidden-test scorer and rescore utility.
- Verified services/llm-gateway tests: 235 passed.
- Recorded hard no-thinking rescored comparison: 35B-A3B=0.68, 27B-origin=0.68, 122B=0.5467; recommendation route-by-workload.
- Endpoint healthy on Qwen/Qwen3.6-35B-A3B, vLLM 0.19.1.

## [2026-04-24] S7 switched LLM Engine serving default to Qwen/Qwen3.6-27B after sequential benchmark evidence favored 27B for reasoning quality/stability. | S7 Qwen3.6-27B serving cutover
- DGX Spark vLLM container cleaned and relaunched with recipe qwen3.6-27b-origin.
- Verified /health=200 and /v1/models id/root=Qwen/Qwen3.6-27B max_model_len=131072.
- Updated S7 cutover session page and llm-engine canonical note; local llm-gateway default model now Qwen/Qwen3.6-27B.
- Benchmark evidence root: services/llm-gateway/bench/results/sequential-rebench-20260423T221050Z.

## [2026-04-24] mcp | register_wr | s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b
- Registered notice WR for all
- Path: wiki/canon/work-requests/s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b.md

## [2026-04-24] S7 completed S3 Qwen3.6 rollout semantics confirmation | s7-qwen36-27b-s3-wr
- Live default confirmed as Qwen/Qwen3.6-27B with Gateway profile Qwen/Qwen3.6-27B-default and contextLimit/max_model_len 131072.
- Updated wiki/canon/specs/llm-gateway.md, wiki/canon/api/llm-gateway-api.md, and wiki/canon/handoff/s7/readme.md.
- Verification evidence recorded in wiki/canon/handoff/s7/session-s7-qwen27-s3-wr-20260424.md.

## [2026-04-24] mcp | complete_wr | s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b
- Lane s1 completed recipient-side handling
- Status: open

## [2026-04-24] mcp | register_wr | s7-to-s3-reply-qwen3.6-27b-rollout-semantics-confirmed-for-s3-strict-json-tool-call-conte
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-reply-qwen3.6-27b-rollout-semantics-confirmed-for-s3-strict-json-tool-call-conte.md

## [2026-04-24] mcp | complete_wr | s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-24] mcp | complete_wr | s7-to-s3-reply-qwen3.6-rollout-recipe-prepared-s7-live-cutover-not-yet-verified
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-24] mcp | register_wr | s5-to-s3-reply-gateway-webserver-s5-context-drift-check-found-no-s5-drift-or-memory-bias
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-reply-gateway-webserver-s5-context-drift-check-found-no-s5-drift-or-memory-bias.md

## [2026-04-24] mcp | complete_wr | s3-to-s5-inspect-gateway-webserver-s5-context-logs-for-analysis-drift
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-04-24] work-request-completed | S2 handled S7 Qwen3.6-27B default-model notice
- Completed WR wiki/canon/work-requests/s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b.md for lane s2.
- Updated S2/platform canonical docs that contained historical Qwen3.5 default references.
- Updated S2 AgentClient contract-test fixture modelProfile to Qwen/Qwen3.6-27B.
- Verification: shared/backend tsc diagnostics 0 errors; backend client-contract vitest 38 passed.

## [2026-04-24] mcp | complete_wr | s7-to-s3-reply-qwen3.6-27b-rollout-semantics-confirmed-for-s3-strict-json-tool-call-conte
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-24] mcp | register_wr | s3-to-s2-s3-analysis-agent-state-machine-result-outcome-contract-will-become-default-afte
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-state-machine-result-outcome-contract-will-become-default-afte.md

## [2026-04-25] mcp | register_wr | s1-to-designer-design-system-readme.md-7-handoff-s1-bootstrap.md
- Registered request WR for designer
- Path: wiki/canon/work-requests/s1-to-designer-design-system-readme.md-7-handoff-s1-bootstrap.md.md

## [2026-04-25] mcp | complete_wr | s3-to-s2-s3-analysis-agent-state-machine-result-outcome-contract-will-become-default-afte
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-25] work-request-completed | S2 completed S3 Analysis Agent outcome contract WR
- WR: wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-state-machine-result-outcome-contract-will-become-default-afte.md
- S2 persisted and propagated S3 result outcome fields: analysisOutcome, qualityOutcome, pocOutcome, recoveryTrace.
- Clean Deep pass now requires completed + accepted_claims + accepted; non-clean valid S3 envelopes become completed results with warning/review signals.
- Updated canonical docs: wiki/canon/api/shared-models.md, wiki/canon/specs/backend.md, wiki/canon/handoff/s2/readme.md, wiki/canon/handoff/s2/api-endpoints.md.
- Evidence recorded in wiki/canon/handoff/s2/session-s2-s3-outcome-contract-20260425.md.

## [2026-04-25] mcp | register_wr | s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption
- Registered notice WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption.md

## [2026-04-25] work-request-registered | S2 notified S1 about Deep outcome UI contract
- Registered notify-style WR: wiki/canon/work-requests/s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption.md
- S1 should avoid treating status=completed as clean Deep pass without inspecting cleanPass / analysisOutcome / qualityOutcome.

## [2026-04-25] mcp | complete_wr | s1-to-s1-projectsettingspage-phase-2-polish-after-canonical-baseline
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | complete_wr | s1-to-s1-redesign-analysishistorypage-run-table-onto-canonical-run-row-status-vocab
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | complete_wr | s1-to-s1-redesign-reportpage-onto-analyst-s-document-tone
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] S3 research positioning report completed | s3/aegis-for-paper
- Report artifact: /home/kosh/aegis-for-paper/artifacts/aegis-research-positioning-report-2026-04-25.md
- Session history: wiki/canon/handoff/s3/session-019dbff3-5f14-7ad3-811c-963d3732e78b.md
- Core framing: contract-governed claim-evidence state machine for static-analysis warning triage; empirical evidence remains pending.

## [2026-04-25] Clarified S7 live model identity and DGX cleanup state | s7-qwen36-27b-noquant-doc-cleanup
- S7 docs now state current live model is original dense Qwen/Qwen3.6-27B, not Qwen/Qwen3.6-27B-FP8, with no vLLM --quantization override.
- Updated canonical llm-engine spec, llm-engine ops, S7 architecture, S7 handoff, llm-gateway spec, and llm-gateway API note; updated benchmark docs/targets in services/llm-gateway.
- DGX verification: vLLM process command serves Qwen/Qwen3.6-27B with max_model_len 131072 and no FP8/quantization flags; only Qwen3.6-27B HF cache remains.

## [2026-04-25] mcp | register_wr | s3-to-s4-system-stability-preflight-confirm-s4-sast-build-health-and-failure-boundary-con
- Registered question WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-system-stability-preflight-confirm-s4-sast-build-health-and-failure-boundary-con.md

## [2026-04-25] mcp | register_wr | s3-to-s5-system-stability-preflight-confirm-s5-kb-graphrag-readiness-and-evidence-role-se
- Registered question WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-system-stability-preflight-confirm-s5-kb-graphrag-readiness-and-evidence-role-se.md

## [2026-04-25] mcp | register_wr | s3-to-s7-system-stability-preflight-confirm-s7-llm-ownership-timeout-and-strict-json-fail
- Registered question WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-system-stability-preflight-confirm-s7-llm-ownership-timeout-and-strict-json-fail.md

## [2026-04-25] mcp | register_wr | s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics.md

## [2026-04-25] S3 system-stability code review and WR fanout | S3 Analysis Agent / Build Agent / agent-shared
- Reviewed S3-owned code against claim-evidence state machine invariants.
- Registered system-stability preflight WRs to S4, S5, and S7.
- Verification: analysis-agent tests 359 passed; build-agent tests 243 passed.
- Local artifact: /home/kosh/AEGIS/.omx/reviews/s3-system-stability-code-review-20260425.md

## [2026-04-25] mcp | register_wr | s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a.md

## [2026-04-25] mcp | complete_wr | s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-25] S2 completed S1 SDK progress contract WR and registered reply WR | S2 SDK upload progress API contract WR completed
- Incoming WR: wiki/canon/work-requests/s1-to-s2-sdk-stepper-mapping-eta-retry-phase-specific-detail-filename-semantics.md
- Reply WR: wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a.md
- Updated canonical API docs for SDK phase mapping, ETA/timing absence, message/fileName semantics, retry/log/troubleshooting behavior, and artifact-kind phase flows.
- Verification: SDK/API Vitest 157 passed; backend/shared tsc and build passed; architect verification approved after correcting progress-vs-log wording.

## [2026-04-25] mcp | register_wr | s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea.md

## [2026-04-25] mcp | register_wr | s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac.md

## [2026-04-25] mcp | complete_wr | s2-to-s1-s2-reply-sdk-upload-progress-contract-answers-for-stepper-timing-retry-log-and-a
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | complete_wr | s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | register_wr | s2-to-s1-s2-reply-deep-outcome-cleanpass-ui-contract-for-outcome-enums-recoverytrace-ws-c
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-reply-deep-outcome-cleanpass-ui-contract-for-outcome-enums-recoverytrace-ws-c.md

## [2026-04-25] mcp | complete_wr | s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-25] S2 completed S1 Deep outcome UI contract WR and registered reply WR | S2 Deep outcome / cleanPass contract WR completed
- Incoming WR: wiki/canon/work-requests/s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac.md
- Reply WR: wiki/canon/work-requests/s2-to-s1-s2-reply-deep-outcome-cleanpass-ui-contract-for-outcome-enums-recoverytrace-ws-c.md
- Updated canonical docs for outcome enum copy, cleanPass derivation/display, recoveryTrace schema/display, WS/REST consistency, backwards/forward compatibility, and S1 surface priority guidance.
- Verification: targeted backend tests 98 passed; backend/shared tsc and build passed; docs sanity grep passed.

## [2026-04-25] S3 system-stability overhaul RALPLAN approved | S3 Analysis Agent / Build Agent / agent-shared
- Deliberate RALPLAN consensus completed with Architect APPROVE and Critic APPROVE.
- Created PRD: /home/kosh/AEGIS/.omx/plans/prd-s3-system-stability-overhaul-20260425.md
- Created test spec: /home/kosh/AEGIS/.omx/plans/test-spec-s3-system-stability-overhaul-20260425.md
- Created consumer migration matrix: /home/kosh/AEGIS/.omx/plans/s3-system-stability-consumer-migration-matrix.md

## [2026-04-25] mcp | register_wr | s3-to-s2-s3-system-stability-agent-v1.1-response-schema-and-build-agent-compatibility-gat
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-system-stability-agent-v1.1-response-schema-and-build-agent-compatibility-gat.md

## [2026-04-25] S3 WP0 system-stability contract update | Analysis Agent agent-v1.1 and Build Agent build-v1.1 compatibility gate
- Updated canonical Analysis Agent API/spec with agent-v1.1 response schema semantics, cleanPass/evaluationVerdict/contextualEvidenceRefs/evidenceDiagnostics/qualityGate, and advisory timeout policy.
- Updated state-machine API decisions to promote contextualEvidenceRefs and pin deadline semantics.
- Updated Build Agent API with build-v1.1 proposal/compatibility-gate note while preserving v1.0.0 semantics.
- Registered S2 notice WR for consumer migration.

## [2026-04-25] mcp | register_wr | s2-to-s1-s2-reply-sdk-second-follow-up-a1-o2-decisions-for-timing-detail-retry-logs-lifec
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-second-follow-up-a1-o2-decisions-for-timing-detail-retry-logs-lifec.md

## [2026-04-25] mcp | complete_wr | s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-25] S2 completed all open S1 WRs after Critic review | S2 Critic-approved Deep outcome and SDK follow-up WR completion
- Critic verdict: APPROVED for completed Deep outcome/cleanPass state and SDK follow-up overclaim coverage.
- Completed WR: wiki/canon/work-requests/s1-to-s2-sdk-2026-04-25-reply-eta-phase-timing-structured-detail-retry-endpoint-log-strea.md
- Reply WR: wiki/canon/work-requests/s2-to-s1-s2-reply-sdk-second-follow-up-a1-o2-decisions-for-timing-detail-retry-logs-lifec.md
- Updated docs: wiki/canon/api/shared-models.md §4.5.1, wiki/canon/handoff/s2/api-endpoints.md, wiki/canon/specs/backend.md.
- Verification: post-deslop targeted backend tests 255 passed; backend/shared tsc and builds passed.

## [2026-04-25] implementation_verified | S3 system-stability overhaul implemented
- Implemented agent-v1.1 Analysis Agent response schema additions: cleanPass, evaluationVerdict, contextualEvidenceRefs, evidenceDiagnostics, qualityGate, extended recoveryTrace.
- Added thin state-machine kernel and role-aware evidence catalog/validator; knowledge refs are contextual only.
- Bounded S7 async ownership polling in shared LLM caller and exposed deadline health/config fields.
- Preserved Build Agent v1 semantics while adding build-v1.1 proposal/outcome fields and health disclosure.
- Verification: analysis-agent tests 388 passed; build-agent tests 247 passed; git diff --check clean; no certificate-maker production logic.

## [2026-04-25] mcp | register_wr | s3-to-s4-s5-s7-s3-system-stability-contract-implemented-dependency-readiness-failure-boundary-f
- Registered notice WR for s4, s5, s7
- Path: wiki/canon/work-requests/s3-to-s4-s5-s7-s3-system-stability-contract-implemented-dependency-readiness-failure-boundary-f.md

## [2026-04-25] mcp | complete_wr | s5-to-s3-reply-gateway-webserver-s5-context-drift-check-found-no-s5-drift-or-memory-bias
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | register_wr | s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-.md

## [2026-04-25] mcp | complete_wr | s3-to-s4-system-stability-preflight-confirm-s4-sast-build-health-and-failure-boundary-con
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | complete_wr | s3-to-s4-s5-s7-s3-system-stability-contract-implemented-dependency-readiness-failure-boundary-f
- Lane s4 completed recipient-side handling
- Status: open

## [2026-04-25] mcp | register_wr | s4-to-s3-reply-s4-notice-specific-acknowledgement-for-s3-system-stability-contract
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-s4-notice-specific-acknowledgement-for-s3-system-stability-contract.md

## [2026-04-25] Installed DGX Qwen27 start/stop/restart control script | s7-qwen27-vllm-control-script
- Created /home/accslab/aegis-llm-engine/bin/qwen27-vllm and symlink /home/accslab/qwen27-vllm on DGX Spark.
- The script supports start, stop, restart, status, health, models, logs, and ps; it validates the current original dense Qwen/Qwen3.6-27B no-quantization identity.
- Real restart verification passed and S7 wiki ops/spec/handoff docs were updated.

## [2026-04-25] mcp | register_wr | s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-after-s1-clarification
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-after-s1-clarification.md

## [2026-04-25] mcp | complete_wr | s3-to-s2-s3-system-stability-agent-v1.1-response-schema-and-build-agent-compatibility-gat
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-25] completed | S2 SDK follow-up implementation and WR reply
- Implemented SDK ETA/phase timing/history/detail, structured errors/retryability, server-side retry, quota, log pagination/download, metrics, and app-level WS heartbeat in S2-owned code.
- Updated canonical shared-models, S2 endpoint handoff, backend spec, and SDK troubleshooting runbook.
- Registered reply WR: wiki/canon/work-requests/s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-after-s1-clarification.md.
- Completed incoming S1 SDK follow-up WR and S3 system-stability notice for lane s2.
- Verification: shared build, backend typecheck/build, targeted SDK/WS/contract tests, and full backend tests all passed.

## [2026-04-25] mcp | register_wr | s7-to-s3-s7-reply-system-stability-async-timeout-strict-json-failure-boundary-contract-co
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-reply-system-stability-async-timeout-strict-json-failure-boundary-contract-co.md

## [2026-04-25] mcp | complete_wr | s3-to-s7-system-stability-preflight-confirm-s7-llm-ownership-timeout-and-strict-json-fail
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-25] completed_s3_wr_response | s7 system-stability WR response
- Updated wiki/canon/api/llm-gateway-api.md with S3 system-stability interpretation contract.
- Updated wiki/canon/specs/llm-gateway.md with S3 boundary confirmation.
- Registered S7→S3 reply WR and completed both S3→S7/S3→S4,S5,S7 WRs for S7 lane.

## [2026-04-25] mcp | register_wr | s5-to-s3-reply-s5-kb-graphrag-readiness-and-evidence-role-semantics-for-s3-system-stabili
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-reply-s5-kb-graphrag-readiness-and-evidence-role-semantics-for-s3-system-stabili.md

## [2026-04-25] mcp | complete_wr | s3-to-s5-system-stability-preflight-confirm-s5-kb-graphrag-readiness-and-evidence-role-se
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-04-25] certificate-maker E2E smoke passed after Build Agent artifact discovery patch | S3 certificate-maker smoke
- Initial smoke failed with EXPECTED_ARTIFACTS_MISMATCH because successful CMake build emitted build/certificate-maker while strict verifier searched only the generated script buildDir.
- Patched services/build-agent/app/core/result_assembler.py and added regression test in services/build-agent/tests/test_result_assembler.py.
- Rerun s3-system-stability-smoke-rerun-20260425-182537 passed all stages; PoC quality warning retained as next QualityGate hardening input.

## [2026-04-25] mcp | complete_wr | s2-to-s1-s2-reply-sdk-second-follow-up-a1-o2-decisions-for-timing-detail-retry-logs-lifec
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | complete_wr | s2-to-s1-s2-implemented-sdk-second-follow-up-runtime-surfaces-after-s1-clarification
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | complete_wr | s2-to-s1-s2-reply-deep-outcome-cleanpass-ui-contract-for-outcome-enums-recoverytrace-ws-c
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | register_wr | s1-to-designer-canonical-handoff-components-nav.css-.nav-icon-.badge---severity-critical-doctri
- Registered request WR for designer
- Path: wiki/canon/work-requests/s1-to-designer-canonical-handoff-components-nav.css-.nav-icon-.badge---severity-critical-doctri.md

## [2026-04-25] mcp | complete_wr | s1-to-s1-redesign-qualitygatepage-onto-canonical-analyst-s-console-vocab
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] mcp | complete_wr | s1-to-s1-redesign-approvalspage-as-canonical-triage-queue
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-25] Verified completed-outcome routing before certificate-maker hot-20 | S3 stability/QualityGate separation
- Critic first pass blocked hot-20 due Build Agent treating QualityGate/build-domain deficiencies as task failures.
- Patched Analysis Agent and Build Agent so alive-runtime, normal-input output deficiencies complete with inconclusive/quality diagnostics rather than internal task failure.
- Fresh verification: analysis-agent tests 392 passed; build-agent tests 249 passed; diff check clean.
- Session artifact: wiki/canon/handoff/s3/session-s3-stability-qualitygate-separation-20260425.md

## [2026-04-26] Completed three-run certificate-maker E2E loop after service restart | S3 certificate-maker hot3 stability smoke
- Counted base: hot3-20260426-155046.
- Operational result: 3/3 attempts passed stages 2–6; build, S4 scan, S5 ingest, S3 deep-analyze, and S3 generate-poc all completed.
- Health: 8/8 snapshots OK for S7, S3 analysis, S3 build, S4, S5, S2 backend, S1 frontend; final curl health HTTP 200 for all.
- Logs: zero errors; five s3-agent recovery warnings, all recovered.
- Quality watchpoints: PoC cleanPass=false in all runs, rubrics [6,4,4], one deep accepted_with_caveats. Stability goal met; QualityGate improvement remains.
- Report: /home/kosh/aegis-for-paper/.stability-runs/hot3-20260426-155046-hot3-stability-report.md

## [2026-04-26] mcp | register_wr | s1-to-s2-s1-s2-qualitygate-approvals-mock-h1-h2-h3-h4-h6-h7
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-s1-s2-qualitygate-approvals-mock-h1-h2-h3-h4-h6-h7.md

## [2026-04-26] mcp | register_wr | s2-to-s1-s2-s1-qualitygate-approvals-mock-h1-h7-h5-optional-snapshot
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-s1-qualitygate-approvals-mock-h1-h7-h5-optional-snapshot.md

## [2026-04-26] mcp | complete_wr | s1-to-s2-s1-s2-qualitygate-approvals-mock-h1-h2-h3-h4-h6-h7
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-26] S2 implemented S1 mock-absorption contract fields and replied | S2 QualityGate/Approvals contract WR
- Incoming WR completed: wiki/canon/work-requests/s1-to-s2-s1-s2-qualitygate-approvals-mock-h1-h2-h3-h4-h6-h7.md
- Reply WR: wiki/canon/work-requests/s2-to-s1-s2-s1-qualitygate-approvals-mock-h1-h7-h5-optional-snapshot.md
- Verification: shared build, backend typecheck, targeted vitest 225 tests, full backend 488 tests passed

## [2026-04-26] mcp | register_wr | s3-to-s2-s3-agent-shared-retirement-requires-bootstrap-charter-ownership-cleanup
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-agent-shared-retirement-requires-bootstrap-charter-ownership-cleanup.md

## [2026-04-26] mcp | complete_wr | s2-to-s1-s2-s1-qualitygate-approvals-mock-h1-h7-h5-optional-snapshot
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-04-26] completed | S3 producer/critic/orchestrator refactor Ralph completion
- Ralph session 019dc924-5195-79a3-a74c-dc63888cee82 completed with architect APPROVED.
- Build result assembler now delegates final build outcome/category to app.quality.build_quality_gate; regression test proves runtime delegation.
- Final evidence recorded in wiki/canon/handoff/s3/session-019dc924-5195-79a3-a74c-dc63888cee82.md.

## [2026-04-27] mcp | complete_wr | s3-to-s2-s3-agent-shared-retirement-requires-bootstrap-charter-ownership-cleanup
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-27] updated | S3 shared runtime retirement documentation cleanup
- Updated canonical charter, S3 handoff, S3 roadmap, state-machine specs, Analysis Agent spec, and Build Agent spec to reflect service-local runtime ownership.
- Updated local docs/AEGIS.md bootstrap ownership map to remove the retired shared runtime path from active S3 owned paths.
- Removed two dead imports in Analysis Agent discovered during post-refactor review.

## [2026-04-27] mcp | register_wr | s1-to-designer-canonical-tokens.css-paperlogy-unified-mono-drift-design.md-1-4-vs-geist-mono
- Registered request WR for designer
- Path: wiki/canon/work-requests/s1-to-designer-canonical-tokens.css-paperlogy-unified-mono-drift-design.md-1-4-vs-geist-mono.md

## [2026-04-27] mcp | register_wr | s1-to-designer-dynamicanalysispage-terminal-aesthetic---console-fg--bg--bg-hi--green--amber--re
- Registered request WR for designer
- Path: wiki/canon/work-requests/s1-to-designer-dynamicanalysispage-terminal-aesthetic---console-fg--bg--bg-hi--green--amber--re.md

## [2026-04-27] mcp | complete_wr | s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-27] mcp | complete_wr | s4-to-s3-reply-s4-notice-specific-acknowledgement-for-s3-system-stability-contract
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-27] mcp | complete_wr | s5-to-s3-reply-s5-kb-graphrag-readiness-and-evidence-role-semantics-for-s3-system-stabili
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-27] mcp | complete_wr | s7-to-s3-s7-reply-system-stability-async-timeout-strict-json-failure-boundary-contract-co
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-27] completed | S3 WR inbox cleanup
- Completed recipient-side handling for four stale S3 inbound replies: two S4 system-stability confirmations, one S5 KB/GraphRAG readiness reply, and one S7 async/strict-JSON boundary reply.
- Rechecked S3 inbox after completion: no open S3 WRs remain.

## [2026-04-27] Updated S7 implementation and handoff docs to align chat/async LLM exchange logging and Gateway error/requestId contracts. | S7 llm exchange audit contract correction
- services/llm-gateway/app/routers/tasks.py now logs full request and response payloads for /v1/chat and /v1/async-chat-requests into llm-exchange.jsonl.
- Gateway-originated chat/async errors now use the structured observability error envelope while preserving top-level compatibility fields.
- GET/control endpoints now preserve or generate X-Request-Id response headers.
- Verified with services/llm-gateway pytest: 238 passed.
- Updated wiki/canon/handoff/s7/architecture.md Observability notes.

## [2026-04-27] Consensus-approved S3 paper remediation plan created | s3-paper-remediation-ralplan
- Generated `.omx/plans/prd-s3-paper-remediation-complete-20260427.md` and companion test spec from the complete OMC artifact set.
- Architect and Critic final reviews approved after iterations on WP-0a wiki-first gate, Option A public claim-status surface, and expanded test matrix.
- Session evidence recorded at `wiki/canon/handoff/s3/session-s3-paper-remediation-ralplan-20260427.md`.

## [2026-04-27] mcp | register_wr | s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice.md

## [2026-04-27] s3-wp0a-contract-gate | S3 Analysis Agent claim diagnostics and accepted-only claims contract gate
- Updated canonical Analysis Agent API/spec and state-machine pages for WP-0a before schema-changing code.
- Registered S3→S2 notice WR: wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice.md.
- Public surface fixed: result.claims[] accepted final claims only; non-accepted lifecycle states in result.claimDiagnostics/audit.

## [2026-04-27] mcp | register_wr | s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement.md

## [2026-04-27] s3-wp1-claim-diagnostics-contract-refinement | S3 Analysis Agent claimDiagnostics object shape fixed
- Updated Analysis Agent API page to record WP-1 claimDiagnostics object shape with lifecycleCounts/nonAcceptedClaims.
- Registered S3→S2 follow-up notice WR: wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement.md.

## [2026-04-27] mcp | register_wr | s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md

## [2026-04-27] WP-8/WP-9 Build Agent contract gate completed | S3 Build Agent build-v1.1 active contract
- Updated canonical Build Agent API/spec to mark build-v1.1 as active default response schema rather than proposal-only.
- Documented EXPECTED_ARTIFACTS_MISMATCH as completed build-domain outcome with cleanPass=false and buildDiagnostics.
- Registered S3→S2 notice WR for consumer handling of cleanPass/buildDiagnostics.
- Verification: services/build-agent full pytest → 252 passed in 0.56s.

## [2026-04-27] WP-20 canonical docs/session evidence sync started | S3 paper-remediation documentation sync
- Updated S3 state-machine implementation work packages with actual Ralph execution order.
- Updated S3 handoff with 2026-04-27 paper-remediation status, implemented surfaces, verification snapshot, and WR pointers.
- Next: final verification bundle, Critic/Architect review, deslop pass, and post-deslop rerun.

## [2026-04-27] Post-review fixes applied | S3 paper-remediation Critic/Architect blocker fixes
- Wired deterministic acquisition planner into live deep-analyze prompt construction after Phase 1/catalog ingestion and readiness gating.
- Fixed negative-ref diagnostics so eref-negative-* cannot be reported as available local evidence or fallback-local.
- Added configurable PoC quality repair cap and BudgetManager repair projection helper with tests.
- Verification after fixes: analysis focused suite 82 passed; analysis full suite 439 passed in 4.68s.

## [2026-04-27] Final verification and canonical session evidence recorded | S3 paper-remediation final evidence
- Final verification: analysis-agent 440 passed in 4.63s; build-agent 254 passed in 0.49s; compileall passed; active shared-runtime grep passed; wiki validate PASS; git diff --check passed.
- Recorded canonical session history and appended test evidence under wiki/canon/handoff/s3/session-omx-1777019958462-zau7uq.md.
- Closed Critic/Architect blocker fixes for WP-4 planner wiring, negative-ref diagnostic honesty, WP-5 PoC repair budget/config/repairHint, and WP-20 session evidence.

## [2026-04-27] S3 recorded final pre-deslop regression/session evidence for paper-remediation Ralph run | S3 paper-remediation final evidence closeout
- Analysis Agent pytest: 440 passed in 4.63s.
- Build Agent pytest: 254 passed in 0.49s.
- compileall, active-code shared-runtime grep, wiki validate, and git diff --check passed.
- Canonical session/test evidence recorded at wiki/canon/handoff/s3/session-omx-1777019958462-zau7uq.md.

## [2026-04-27] S3 fixed refreshed Critic/Architect blockers before final Ralph review | S3 closeout blocker fixes
- Claim lifecycle now derives family-specific required evidence slots and deep quality gate rejects unfilled slot claims.
- generate-poc success latency/log telemetry now runs after bounded quality repair loop.
- Analysis Agent canonical spec now aligns recoverable deficiencies with completed result-level outcomes.

## [2026-04-27] S3 refreshed canonical session evidence after closeout blocker fixes | S3 canonical session evidence refreshed
- Session artifact now records focused closeout suite 58 passed and Analysis Agent 443 passed after family-slot/PoC telemetry fixes.
- Build Agent 254-pass evidence and static/wiki/diff checks were re-attached to the canonical session page.

## [2026-04-27] S3 refreshed closeout session evidence after direct slot-test reinforcement | S3 final slot-test evidence refreshed
- Focused closeout suite: 64 passed in 0.85s.
- Analysis Agent full suite: 449 passed in 4.94s.
- Build Agent full suite: 254 passed in 0.50s.
- compileall, active shared-runtime grep, wiki validate, and git diff --check passed.

## [2026-04-27] S3 fixed final canonical doc drift before closeout approval | S3 final wiki drift fix
- Build Agent spec verification count updated from 252 to 254 passed in 0.50s.
- Analysis Agent API body header updated to 2026-04-27 and claimDiagnostics example aligned with family-specific missing slots.

## [2026-04-27] S3 aligned S3 handoff Build Agent verification count with canonical session/spec evidence | S3 handoff count drift fixed
- S3 handoff now records Build Agent final full suite as 254 passed in 0.50s.
- wiki validate, wiki diff-check, and AEGIS git diff-check passed after the correction.

## [2026-04-27] mcp | register_wr | s2-to-s1-reply-projectlistitem-owner-field-implemented-for-dashboard-project-explorer
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-projectlistitem-owner-field-implemented-for-dashboard-project-explorer.md

## [2026-04-27] mcp | complete_wr | s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-27] mcp | complete_wr | s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-27] mcp | complete_wr | s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-04-27] S3 completed Ralph mandatory deslop pass and post-deslop verification | S3 post-deslop final verification
- Scoped cleanup removed redundant local json imports in generate_poc_handler.py only.
- Post-deslop Analysis Agent suite: 449 passed in 4.64s.
- Post-deslop Build Agent suite: 254 passed in 0.50s.
- compileall, active shared-runtime grep, wiki validate, wiki diff-check, and git diff-check passed.

## [2026-04-27] S2 implemented ProjectListItem.owner, preserved S3 claim/evidence diagnostics, and aligned Build Agent cleanPass handling | S2 project owner and S3 diagnostics/build-v1.1 WR handling
- Project owner: authenticated POST /api/projects persists req.user profile; GET /api/projects omits owner for migrated/unowned rows.
- Analysis diagnostics: claimDiagnostics/evidenceDiagnostics are persisted and returned on AnalysisResult.
- Build Agent v1.1: completed cleanPass=false now becomes resolve_failed pipeline outcome; SDK analysis only consumes clean completed payloads.
- S1 reply WR registered: wiki/canon/work-requests/s2-to-s1-reply-projectlistitem-owner-field-implemented-for-dashboard-project-explorer.md.

## [2026-04-27] S3 removed stale pre-closeout Analysis Agent verification count from handoff summary | S3 final handoff stale pre-review count removed
- S3 handoff now only advertises final post-deslop Analysis Agent verification: 449 passed in 4.64s.
- wiki validate and diff checks passed after the edit.

## [2026-04-28] mcp | register_wr | s3-to-s2-s3-generate-poc-quality-repair-exhaustion-now-reports-poc_inconclusive
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-generate-poc-quality-repair-exhaustion-now-reports-poc_inconclusive.md

## [2026-04-28] completed | s3 post-ralplan followup defects
- S3 Ralph completed F-1..F-7 implementation and post-deslop verification.
- Focused regression 105 passed; analysis-agent 475 passed; build-agent 254 passed; compileall ok; wiki validate PASS.
- Final architect sign-off APPROVED.
- Legacy self-followup WR normalized from wr_kind=followup to wr_kind=request and marked completed because complete_wr could not resolve the legacy entry.

## [2026-04-28] Updated S3 handoff/spec/state-machine docs for post-fix polish closeout | S3 wiki canonical docs
- Recorded current verification counts: analysis-agent 492 passed, build-agent 254 passed, compileall PASS.
- Clarified generate-poc bounded quality-repair exhaustion as poc_inconclusive + repair_exhausted.
- Kept immediate unsafe/ref/grounding-deficient PoC as poc_rejected.

## [2026-04-28] Updated S7 canonical docs with DGX Qwen3.6-27B vLLM 0.20.0 HF-fresh image, MTP=1 serving recipe, benchmark/BFCL evidence, cleanup/runbook references, and API contract notes that MTP is transparent to callers. | S7 documentation refresh for Qwen3.6 vLLM 0.20.0 MTP backend
- Updated S7 handoff, LLM Engine spec/API, LLM Engine ops, LLM Gateway spec, and S7 architecture docs.
- Documented current image qwen36-vllm:hf-fresh, recipe qwen3.6-27b-origin.yaml, max_model_len=131072, MTP speculative config, BFCL 24/25 before/after MTP, and strict bwrap A/B throughput 7.638 -> 15.132 tok/s.
- Referenced DGX runbook /home/accslab/spark-vllm-docker/docs/QWEN36_VLLM_RUNBOOK_20260428.md and S7 session evidence pages.

## [2026-04-28] mcp | register_wr | s3-to-s7-s3-requires-thinking-on-llm-gateway-semantics-for-hotn-clarify-remove-s7-thinkin
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-requires-thinking-on-llm-gateway-semantics-for-hotn-clarify-remove-s7-thinkin.md

## [2026-04-28] Handled S3 hotN WR by changing S7 Gateway thinking semantics: RealLlmClient and forwarded chat/async requests now default to enable_thinking=true, strict JSON no longer forces thinking off, and /v1/chat/log diagnostics expose effective thinking mode. | S7 thinking default set to enable_thinking=true for Gateway/Engine calls
- Code changed under services/llm-gateway only: real client default, app bootstrap, task pipeline fallback, chat forwarding controls, exchange log effectiveThinking, X-AEGIS-Effective-Thinking response header, focused contract tests.
- Docs updated: llm-gateway API/spec, llm-engine spec, S7 readme, S7 architecture.
- Verification: 239 llm-gateway tests passed; py_compile passed; live thinking-on smoke returned AEGIS_OK with reasoning present; live strict JSON thinking-on smoke returned compact JSON with X-AEGIS-Effective-Thinking=true.

## [2026-04-28] mcp | complete_wr | s3-to-s7-s3-requires-thinking-on-llm-gateway-semantics-for-hotn-clarify-remove-s7-thinkin
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-04-28] ralplan-approved | S3 Pass-A semantic defect remediation plan
- Created final PRD and test spec under /home/kosh/AEGIS/.omx/plans for S3 Pass-A semantic defects.
- Architect verdict: APPROVE after Phase 0a contract/wiki/WR gate, contract-safe WP-4, ownership map, evidence closeout, and Build Agent parity corrections.
- Critic verdict: APPROVE after concrete Build Agent active targets/tests, WP-4 anti-synthetic-local guard, DPA→WP matrix, DPA-18→WP-12 ownership, and system-stability fallback/hotN_script_absent evidence rule were added.
- Session history recorded at wiki/canon/handoff/s3/session-s3-pass-a-ralplan-20260428.md.

## [2026-04-28] mcp | register_wr | s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only.md

## [2026-04-28] completed | S3 Pass-A semantic remediation
- Implemented WPs 1-17 for S3 Pass-A semantic defect remediation.
- Final verification: Analysis Agent 520 passed; Build Agent 260 passed; compileall PASS; system-stability eval 6 passed.
- Critic follow-up approved after NHR accepted-only and recovery audit_order blockers were fixed.
- Notice WR registered to S2 for claimDiagnostics lifecycle proof fields and generate-poc accepted-only lifecycle behavior.

## [2026-04-29] mcp | register_wr | s7-to-s2-s2-caller-update-required-for-s7-v1-tasks-caller-owned-generation-contract
- Registered request WR for s2
- Path: wiki/canon/work-requests/s7-to-s2-s2-caller-update-required-for-s7-v1-tasks-caller-owned-generation-contract.md

## [2026-04-29] mcp | register_wr | s7-to-s3-s3-generation-controls-alignment-after-s7-caller-owned-contract
- Registered request WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s3-generation-controls-alignment-after-s7-caller-owned-contract.md

## [2026-04-29] mcp | register_wr | s7-to-s3-s3-llm-readiness-follow-up-required-after-s7-generation-observability-update
- Registered request WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s3-llm-readiness-follow-up-required-after-s7-generation-observability-update.md

## [2026-04-29] mcp | register_wr | s7-to-s5-s5-s7-rag-policy-alignment-for-llm-gateway-task-pipeline-enrichment
- Registered request WR for s5
- Path: wiki/canon/work-requests/s7-to-s5-s5-s7-rag-policy-alignment-for-llm-gateway-task-pipeline-enrichment.md

## [2026-04-29] Recorded S7 temperature-policy closeout evidence | s7 temperature-policy Ralph closeout
- Updated `wiki/canon/handoff/s7/session-omx-1777438836294-vm2fva.md` with hidden-default zero-gate, pytest, compileall evidence.
- Kept P2/P4/P15 and cross-lane dependencies as open-risk where S7 cannot close unilaterally.

## [2026-04-29] Completed S7 Ralph evidence closeout for temperature policy | s7 temperature-policy Ralph complete
- Architect approved S7 evidence closeout before deslop.
- Post-deslop hidden-default zero gate passed.
- Post-deslop S7 pytest passed: 267 passed in 6.19s.
- Post-deslop compileall passed for S7 app/tests.

## [2026-04-29] Applied S7 temperature-policy review follow-up fixes | s7 review follow-up M1-M3
- M1 resolved by documenting `/v1/chat` and `/v1/async-chat-requests` sampling omission as a transient caller-migration gap in canonical wiki docs, preserving pass-through semantics.
- M2 resolved by extracting shared generation observability helpers.
- M3 resolved by adding bounded `aegis_llm_tool_choice_total` metric and tests.
- m1 resolved by documenting why `SamplingPreset` excludes max_tokens.

## [2026-04-29] Completed S7 review follow-up with post-deslop verification | s7 M1-M3 Ralph follow-up complete
- M1 documented as chat/async transient sampling gap, preserving pass-through semantics.
- M2 shared generation observability helper retained after cleanup.
- M3 bounded tool_choice metric retained after cleanup.
- Post-deslop verification passed: focused 7 tests, full S7 268 tests, compileall, wiki validation, hidden-default gate.

## [2026-04-29] mcp | register_wr | s7-to-s2-s7-gateway-generation-control-contract-updated-s2-callers-must-follow-wiki-contr
- Registered request WR for s2
- Path: wiki/canon/work-requests/s7-to-s2-s7-gateway-generation-control-contract-updated-s2-callers-must-follow-wiki-contr.md

## [2026-04-29] mcp | register_wr | s7-to-s3-s7-gateway-generation-control-contract-updated-s3-chat-callers-must-send-full-tu
- Registered request WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-gateway-generation-control-contract-updated-s3-chat-callers-must-send-full-tu.md

## [2026-04-29] mcp | register_wr | s3-to-s2-s3-optional-generation-control-constraints-are-additive-public-api-fields
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-optional-generation-control-constraints-are-additive-public-api-fields.md

## [2026-04-29] mcp | complete_wr | s7-to-s3-s7-gateway-generation-control-contract-updated-s3-chat-callers-must-send-full-tu
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-29] mcp | complete_wr | s7-to-s3-s3-generation-controls-alignment-after-s7-caller-owned-contract
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-29] mcp | complete_wr | s7-to-s3-s3-llm-readiness-follow-up-required-after-s7-generation-observability-update
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-04-29] S3 completed S7 caller-owned generation-control WR implementation and docs/WR closeout | S3 generation-controls / P16-P17 readiness
- Analysis Agent full suite: 556 passed in 5.63s.
- Build Agent full suite: 299 passed in 0.57s.
- Compileall PASS; hidden temperature=0.3 static guard PASS.
- S3→S2 additive public constraints notice registered.
- Three S7→S3 WRs completed for S3 lane.

## [2026-04-29] S3 generation-controls reverify tightened P11/P7 and refreshed evidence | s3-generation-controls-reverify
- Re-read temperature-policy-analysis-20260428-s3-summary.md and temperature-policy-analysis-20260428.md.
- Added S3-local TimeoutDefaults and wired caller/eval/config defaults to the 1800/600/120s policy.
- Added P7 preset-rationale comments for Generate-PoC and structured finalizer call sites.
- Verification: analysis-agent 558 passed; build-agent 301 passed; compileall PASS; hidden temperature guard PASS; static coverage guard 274 hits.

## [2026-05-02] mcp | complete_wr | s7-to-s2-s2-caller-update-required-for-s7-v1-tasks-caller-owned-generation-contract
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-02] mcp | complete_wr | s7-to-s2-s7-gateway-generation-control-contract-updated-s2-callers-must-follow-wiki-contr
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-02] mcp | complete_wr | s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-02] mcp | complete_wr | s3-to-s2-s3-generate-poc-quality-repair-exhaustion-now-reports-poc_inconclusive
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-02] mcp | complete_wr | s3-to-s2-s3-optional-generation-control-constraints-are-additive-public-api-fields
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-02] S2 updated implementation and canonical API docs after contract drift audit | S2 API contract drift audit
- Patched LlmTaskClient to send the full S7 /v1/tasks caller-owned generation tuple with S2 defaults while preserving caller overrides.
- Patched SDK project-scoped delete to reject cross-project deletion with 404.
- Updated canonical S2/shared/backend API docs for S7 controls, S3 diagnostic outcome semantics, WS subscribe-time snapshots, and SDK delete scope.
- Verification passed targeted backend tests, full backend test suite, and shared/backend builds.

## [2026-05-03] S3 closed P10/P16/P18/P19 follow-up items and added readiness regression gate | S3 temperature-policy follow-up closeout
- Analysis Agent full suite: 562 passed in 6.30s
- Build Agent full suite: 302 passed in 0.60s
- compileall over S3 app/eval paths: PASS
- Local S3 LLM readiness gate: PASS
- Canonical S3 handoff/specs updated with topK=-1 alignment and scalar-temperature deprecation milestone

## [2026-05-03] S3 addressed P16 boundary delimiter neutralization, P10 policy rationale, and eval_runner gate coverage | S3 follow-up defense-in-depth closure
- Boundary delimiters in untrusted tool/source content are neutralized before LLM wrapping.
- P10 comments and S3 handoff document why required tool_choice lasts until first successful tool call.
- S3 readiness gates now include analysis-agent eval/eval_runner.py P6 tuple coverage.
- Verification: analysis-agent 565 passed; build-agent 304 passed; compileall PASS; S3 readiness gate PASS.

## [2026-05-03] One certificate-maker E2E spot run failed at Build Agent Stage 2 | S3 certificate-maker spot run
- Run ID: s3-cert-maker-spot-20260503-015411
- Preflight passed for S3-Agent, S3-Build, S4-SAST, S5-KB, S7-Gateway.
- Stage 2 Build Agent returned HTTP 200 completed non-clean envelope: buildResult.success=false, artifactVerification.matched=false, failureCode=BUILD_SCRIPT_SYNTHESIS_FAILED.
- Build logs: finishReason=tool_calls, toolCallCount=0, responseType=content, empty response classified as output deficient.
- Stages 3-6 not run.

## [2026-05-03] Three Build-Agent-only certificate-maker probes show stochastic empty tool_calls under tool_choice=required | S3 certificate-maker Build Agent tool-call probe
- Base run: s3-cert-maker-toolcall-probe-20260503-030111
- Attempt 01: finishReason=tool_calls, raw message.tool_calls=[], audit tool_call_count=0, cleanPass=false.
- Attempt 02: finishReason=tool_calls, raw message.tool_calls=[], audit tool_call_count=0, cleanPass=false.
- Attempt 03: required first turn produced list_files; subsequent tools executed; audit tool_call_count=7; cleanPass=true.
- Conclusion: tool_choice=required itself can work, but current model/gateway behavior sometimes returns empty tool_calls with finishReason=tool_calls.

## [2026-05-04] recorded non-dynamic API contract audit | wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md
- Scope excluded dynamic analysis and S3 implementation internals per user instruction.
- Report records S1/S2 clone payload drift, S2 PoC outcome drift, and S7 tool_choice guard gap.
- No product code changes were made for this audit.

## [2026-05-06] S2 implemented PoC facade outcome forwarding for S1 WR | s2-poc-facade-outcomes
- POST /api/analysis/poc now returns pocOutcome, qualityOutcome, cleanPass, and optional claimDiagnostics on completed S3 envelopes.
- Updated canonical shared-models PoC facade contract and shared TypeScript DTO/model types.
- Verification: targeted PoC contract tests, shared/backend builds, and full backend Vitest passed.

## [2026-05-06] mcp | register_wr | s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui.md

## [2026-05-06] mcp | register_wr | s5-to-s7-reply-s5-accepts-s7-task-pipeline-rag-enrichment-policy-as-context-only-kb-usage
- Registered reply WR for s7
- Path: wiki/canon/work-requests/s5-to-s7-reply-s5-accepts-s7-task-pipeline-rag-enrichment-policy-as-context-only-kb-usage.md

## [2026-05-06] mcp | complete_wr | s7-to-s5-s5-s7-rag-policy-alignment-for-llm-gateway-task-pipeline-enrichment
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | complete_wr | s5-to-s7-reply-s5-accepts-s7-task-pipeline-rag-enrichment-policy-as-context-only-kb-usage
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | register_wr | s7-to-s3-s3-caller-follow-up-for-s7-tool_choice-guard-and-response-contract-enforcement
- Registered request WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s3-caller-follow-up-for-s7-tool_choice-guard-and-response-contract-enforcement.md

## [2026-05-06] Updated S3 canonical handoff/API docs for non-dynamic API audit follow-up and ToolIntent runtime-dispatch supersession | S3 documentation
- Updated wiki/canon/handoff/s3/readme.md with 2026-05-06 ToolIntent/P10 supersession and non-dynamic audit follow-up.
- Updated wiki/canon/api/analysis-agent-api.md and wiki/canon/api/build-agent-api.md with tool_choice policy: no required, ToolIntent runtime dispatch for mandatory acquisition.
- Recorded remaining S7 defense-in-depth risk and S3 optional caller-side contract-violation hardening gap.

## [2026-05-06] Updated S4 SAST Runner wiki docs with current test inventory and audit evidence clarification | S4 documentation refresh
- wiki/canon/handoff/s4/readme.md: test inventory now says 399 tests / 24 files with 2026-05-06 collect-only evidence
- wiki/canon/specs/sast-runner.md: service overview test count updated from 382 to 399
- wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md: S4 verification row now notes selector caveat and separate build/readiness verification commands
- wiki/system/index.md rebuilt via update_index

## [2026-05-06] mcp | complete_wr | s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b
- Lane s7 completed recipient-side handling
- Status: open

## [2026-05-06] mcp | register_wr | s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla.md

## [2026-05-06] mcp | complete_wr | s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | complete_wr | s7-to-s3-s3-caller-follow-up-for-s7-tool_choice-guard-and-response-contract-enforcement
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-06] completed | S3 / S7 tool_choice response-contract WR closeout
- Closed wiki/canon/work-requests/s7-to-s3-s3-caller-follow-up-for-s7-tool_choice-guard-and-response-contract-enforcement.md for lane s3.
- Analysis/Build service-local LlmCaller now rejects unsupported required/named tool_choice before HTTP dispatch, preserves reasoning diagnostics, and maps empty tool_calls/reasoning-only/async response_contract violations to retryable LlmContractViolationError.
- Verification recorded in wiki/canon/handoff/s3/session-omx-1778037641464-duha0m.md: analysis full 579 passed, build full 318 passed, focused suites and compileall passed.

## [2026-05-06] mcp | register_wr | s2-to-s1-reply-nonacceptedclaim-typed-export-is-available-from-aegis-shared-for-poc-claim
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-nonacceptedclaim-typed-export-is-available-from-aegis-shared-for-poc-claim.md

## [2026-05-06] mcp | complete_wr | s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-06] S2 completed S1 WR for typed NonAcceptedClaim export | s2-nonacceptedclaim-typed-export
- Added @aegis/shared NonAcceptedClaim lifecycle/evidence/revision types and narrowed AgentClaimDiagnosticsSummary.nonAcceptedClaims to NonAcceptedClaim[].
- Kept S3 status as canonical lifecycle-stage field and rejectionCode as open optional string.
- POST /api/analysis/poc forwards populated claimDiagnostics.nonAcceptedClaims[] unchanged and is contract-tested.
- Updated canonical shared-models, analysis-agent API vocabulary notes, and S2 handoff docs.
- Verification passed: shared/backend builds, targeted PoC/diagnostics contract tests, full backend suite 28 files / 498 tests, LSP diagnostics 0, diff check, Critic APPROVED.
- Completed WR wiki/canon/work-requests/s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla.md and registered S2 reply WR.

## [2026-05-06] mcp | register_wr | s3-to-s7-s3-reply-caller-side-tool_choice-guard-and-response-contract-enforcement-complet
- Registered reply WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-reply-caller-side-tool_choice-guard-and-response-contract-enforcement-complet.md

## [2026-05-06] registered | S3 reply to S7 caller-side tool_choice WR
- Registered reply WR: wiki/canon/work-requests/s3-to-s7-s3-reply-caller-side-tool_choice-guard-and-response-contract-enforcement-complet.md
- Reply summarizes S3 caller allowlist, reasoning diagnostics, retryable response-contract handling, and verification evidence.

## [2026-05-06] mcp | register_wr | s7-to-s3-s3-clarify-live-s7-first-turn-tool-call-smoke-evidence-for-tool_choice-follow-up
- Registered question WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s3-clarify-live-s7-first-turn-tool-call-smoke-evidence-for-tool_choice-follow-up.md

## [2026-05-06] mcp | complete_wr | s3-to-s7-s3-reply-caller-side-tool_choice-guard-and-response-contract-enforcement-complet
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-06] S2 added runtime schema validation for typed claimDiagnostics | s2-claim-diagnostics-runtime-validation
- Added services/backend/src/lib/claim-diagnostics.ts runtime guard for AgentClaimDiagnosticsSummary / NonAcceptedClaim shape.
- AnalysisResultDAO rejects malformed new claimDiagnostics writes and omits malformed historical/manual rows on read.
- POST /api/analysis/poc omits malformed optional claimDiagnostics rather than exposing untyped nonAcceptedClaims records.
- Updated shared-models, S2 handoff docs, and S2 reply WR with validation policy.
- Verification passed: shared/backend build, targeted DAO tests 5, targeted PoC/diagnostics tests 5, full backend suite 28 files / 501 tests, LSP 0, diff check.

## [2026-05-06] mcp | register_wr | s2-to-s1-notice-poc-claimdiagnostics-now-has-s2-runtime-validation-and-malformed-diagnost
- Registered notice WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-notice-poc-claimdiagnostics-now-has-s2-runtime-validation-and-malformed-diagnost.md

## [2026-05-06] S2 sent S1 follow-up WR for claimDiagnostics runtime validation policy | s2-to-s1-claim-diagnostics-validation-notice
- Registered S2→S1 notice WR: wiki/canon/work-requests/s2-to-s1-notice-poc-claimdiagnostics-now-has-s2-runtime-validation-and-malformed-diagnost.md
- Clarifies malformed claimDiagnostics are omitted rather than exposed as untyped records.
- Clarifies S1 should gate NonAcceptedClaimsList on claimDiagnostics?.nonAcceptedClaims?.length and must not treat absent diagnostics as clean success.

## [2026-05-06] verified | S4 full pytest verification
- services/sast-runner full pytest gate passed: 399 passed in 11.08s.
- Updated S4 API/spec/handoff wiki docs from collect-only wording to full pytest evidence.

## [2026-05-06] mcp | register_wr | s3-to-s7-s3-reply-live-s7-first-turn-tool-call-smoke-evidence-recorded
- Registered reply WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-reply-live-s7-first-turn-tool-call-smoke-evidence-recorded.md

## [2026-05-06] mcp | complete_wr | s7-to-s3-s3-clarify-live-s7-first-turn-tool-call-smoke-evidence-for-tool_choice-follow-up
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-06] completed | S3 live S7 first-turn tool-call smoke evidence
- Analysis live smoke requestId=s3-analysis-live-tool-smoke-20260506-144632: finishReason=tool_calls, tool=knowledge_search, S7 trace HTTP 200 upstream chat/completions.
- Build live smoke requestId=s3-build-live-tool-smoke-20260506-144657: finishReason=tool_calls, tool=try_build, S7 trace HTTP 200 upstream chat/completions.
- Registered reply WR wiki/canon/work-requests/s3-to-s7-s3-reply-live-s7-first-turn-tool-call-smoke-evidence-recorded.md and completed S7 question WR.

## [2026-05-06] mcp | complete_wr | s3-to-s7-s3-reply-live-s7-first-turn-tool-call-smoke-evidence-recorded
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | complete_wr | s2-to-s1-reply-nonacceptedclaim-typed-export-is-available-from-aegis-shared-for-poc-claim
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | complete_wr | s2-to-s1-notice-poc-claimdiagnostics-now-has-s2-runtime-validation-and-malformed-diagnost
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | register_wr | s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-.md

## [2026-05-06] registered | S3→S2 Build Agent scriptHintPath contract request
- Registered WR wiki/canon/work-requests/s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-.md
- Requested S2 alignment to replace inline scriptHintText/buildScriptHintText with uploaded-project-relative build.scriptHintPath.
- S3 intends to remove inline hint legacy after S2 confirms/adjusts the API shape.

## [2026-05-06] mcp | register_wr | s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve.md

## [2026-05-06] mcp | complete_wr | s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | register_wr | s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented.md

## [2026-05-06] mcp | complete_wr | s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-06] completed | S3 Build Agent scriptHintPath contract implementation
- Implemented S2-reviewed build.scriptHintPath contract in Build Agent.
- Removed inline script hint aliases and made scriptHintPath effective-BuildTarget-root-relative.
- Verification: focused 27 passed, build-agent full 334 passed, compileall/diff-check PASS, wiki npm test 8 passed.
- Reply WR: wiki/canon/work-requests/s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented.md

## [2026-05-06] approved | S3 Build Agent scriptHintPath Critic re-review
- Initial Critic review rejected scriptHintPath implementation for missing runtime direct-exec guard, weak reference-only test, and raw prompt boundary.
- S3 fixed TryBuildTool generated-script-only enforcement, build_dir wiring, untrusted-source prompt wrapping, and tests.
- Fresh verification: focused 57 passed, full build-agent 339 passed, compileall/diff-check PASS.
- Follow-up Critic verdict: PASS; no blockers/non-blockers for release/tagging from this review pass.

## [2026-05-06] mcp | register_wr | s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h.md

## [2026-05-06] S3 registered final WR reply to S2 after Critic PASS on build.scriptHintPath implementation | S3 to S2 build.scriptHintPath final reply
- WR: wiki/canon/work-requests/s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h.md
- Post-Critic hardening includes request-scoped TryBuildTool guard against direct uploaded/reference script execution and untrusted prompt boundary wrapping for script hint content.
- Verification evidence: focused build-agent tests 57 passed; full build-agent suite 339 passed; compileall and git diff --check passed.
- Critic re-review verdict: PASS / no blockers.

## [2026-05-06] mcp | register_wr | s2-to-s1-s2-notice-buildtarget-scripthintpath-is-available-for-uploaded-build-script-sele
- Registered notice WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-notice-buildtarget-scripthintpath-is-available-for-uploaded-build-script-sele.md

## [2026-05-06] S2 implemented positive scriptHintPath support after S3 contract freeze | S2 BuildTarget scriptHintPath implementation
- Added S1-facing BuildTarget.scriptHintPath and target create/update plumbing.
- S2 validates effective-BuildTarget-root-relative uploaded script hints and forwards them to S3 Build Agent as context.trusted.build.scriptHintPath.
- Updated S2 canonical shared-models/api-endpoints/architecture docs and sent S2->S1 notice WR.

## [2026-05-06] mcp | complete_wr | s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-06] mcp | complete_wr | s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-06] S2 acknowledged S3 post-Critic runtime guard hardening | S2 reviewed S3 scriptHintPath Critic pass reply
- Confirmed S3 now runtime-rejects direct uploaded script execution and chained uploaded script execution.
- Confirmed S2 implementation emits canonical context.trusted.build.scriptHintPath only and does not emit inline aliases.
- Completed the follow-up S3->S2 reply WR for S2.

## [2026-05-06] S2 completed Critic-driven implementation review/fix for BuildTarget scriptHintPath. | S2 BuildTarget scriptHintPath Critic pass
- Fixed stale scriptHintPath invariant on relativePath-only BuildTarget updates by revalidating existing hints against the new effective BuildTarget root.
- Added service/API/pipeline tests for validator edge cases, stale update rejection, and isolated BuildTarget emission.
- Verification passed: targeted backend scriptHint suites, shared/backend builds, full backend test suite, git diff --check.
- Critic sub-agent 019dfc40-2f5e-7b62-85ec-dd69a42a3acd returned PASS with no blockers.

## [2026-05-06] mcp | complete_wr | s2-to-s1-s2-notice-buildtarget-scripthintpath-is-available-for-uploaded-build-script-sele
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-06] Created canonical Build Agent state/outcome contract page for stabilization test oracle | S3 Build Agent state/outcome contract
- Page: wiki/canon/specs/build-agent-state-machine.md
- Defines task status vs build result outcome, canonical states/transitions, cleanPass=true conditions, completed_non_clean boundaries, task-level failure boundary, scriptHintPath/generated-script invariant, ToolIntent/tool_choice invariant, and stabilization test oracle.
- Purpose: anchor upcoming Build Agent multi-dataset stabilization beyond certificate-maker.

## [2026-05-06] Critic reviewed Build Agent state/outcome contract; S3 fixed documentation blockers and received PASS | S3 Build Agent state/outcome contract Critic PASS
- Initial Critic verdict: REJECT due to nonexistent `failed` status, S4-unavailable semantics mismatch, and stale build-agent.md `tool_choice=required` wording.
- First fix aligned docs to ToolIntent/runtime dispatch and S4 tool-result semantics; second Critic pass rejected representative use of reserved `unsafe_output`/`empty_result` and budget exhaustion as completed_non_clean.
- Final fixes narrowed representative runtime statuses to completed/validation_failed/timeout/model_error/budget_exceeded, documented unsafe_output/empty_result as reserved only, and mapped loop exhaustion to budget_exceeded while preserving output-deficient completed_non_clean when assembly succeeds.
- Final Critic verdict: PASS, no blockers. Pages touched: wiki/canon/specs/build-agent-state-machine.md, wiki/canon/specs/build-agent.md, wiki/canon/api/build-agent-api.md.

## [2026-05-06] Staged local gitignored Build Agent multi-dataset inputs under AEGIS uploads for upcoming stabilization runner work | S3 Build Agent stabilization datasets staged
- Dataset root: /home/kosh/AEGIS/uploads/build-agent-stabilization-datasets
- Cases: certificate-maker, cjson, libexpat, redis
- Manifest: /home/kosh/AEGIS/uploads/build-agent-stabilization-datasets/manifest.json
- Original inputs were copied, not destructively moved; generated build artifacts and .git directories were excluded/cleaned.
- scriptHintPath reference files: certificate-maker build.sh, cjson .aegis/build-script-hint.sh, libexpat expat/.aegis/build-script-hint.sh, redis .aegis/build-script-hint.sh.

## [2026-05-06] Implemented and Critic-validated Build Agent multi-dataset stabilization runner/test oracle | S3 Build Agent stabilization test system
- Changed files: services/build-agent/scripts/stabilization_runner.py; services/build-agent/tests/test_stabilization_runner.py
- Runner defaults to dry-run; live Build Agent POSTs require explicit --live.
- Dry-run against staged 4-case manifest passed and generated strict build-req.json for certificate-maker/cjson/libexpat/redis.
- Verification: focused 14 passed; full build-agent suite 353 passed; compileall and git diff --check passed.
- Critic final verdict: PASS; no blockers.

## [2026-05-07] mcp | register_wr | s3-to-s2-s3-build-agent-sdk-materialization-descriptor-producer-contract
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-build-agent-sdk-materialization-descriptor-producer-contract.md

## [2026-05-07] update | wiki/canon/specs/build-agent.md
- Clarified hot11 anti-overfit gate execution: canonical 11 cases remain under cases[], renamed controls may live under controls[], and live proof must run stabilization_runner.py with --include-controls.

## [2026-05-07] verification | Build Agent SDK materialization hot11 final
- Documented deterministic phase0 wrapper behavior and final hot11+control evidence.
- Evidence: build-agent tests 382 passed; compileall PASS; git diff --check PASS; stabilization_runner.py --live --include-controls --run-label hot11-controls-live-final-20260507-210320 PASS 12/12 completed_clean.

## [2026-05-07] update | wiki/canon/api/build-agent-api.md
- Aligned scriptHintPath execution wording with deterministic generated wrapper behavior: uploaded hint scripts are not public buildCommand/buildScript evidence, but request-scoped wrappers may invoke them after applying trusted SDK descriptor env.

## [2026-05-07] mcp | register_wr | s3-to-s2-s3-build-agent-sdk-descriptor-consumer-complete-and-hot11-evidence
- Registered notice WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s3-build-agent-sdk-descriptor-consumer-complete-and-hot11-evidence.md

## [2026-05-08] mcp | register_wr | s3-to-s7-s7-implement-wait-while-alive-async-llm-ownership-per-health-control-v2
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s7-implement-wait-while-alive-async-llm-ownership-per-health-control-v2.md

## [2026-05-08] mcp | register_wr | s3-to-s4-s4-implement-wait-while-alive-build-scan-ownership-per-health-control-v2
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-implement-wait-while-alive-build-scan-ownership-per-health-control-v2.md

## [2026-05-08] mcp | register_wr | s3-to-s2-s2-consume-health-control-v2-downstream-wait-and-cancel-semantics
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-s2-consume-health-control-v2-downstream-wait-and-cancel-semantics.md

## [2026-05-08] mcp | register_wr | s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md

## [2026-05-08] mcp | register_wr | s2-to-s3-s2-reply-sdk-materialization-descriptor-producer-implemented
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-s2-reply-sdk-materialization-descriptor-producer-implemented.md

## [2026-05-08] mcp | complete_wr | s3-to-s2-s3-build-agent-sdk-descriptor-consumer-complete-and-hot11-evidence
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-08] implemented | s2-sdk-materialization-descriptor-producer
- S2 now emits SDK-mode Build Agent materialization descriptor fields from project-owned uploaded RegisteredSdk roots without requiring verified=true.
- Updated shared API contract, S2 endpoint/architecture docs, and backend spec.
- Registered S2 reply WR to S3: wiki/canon/work-requests/s2-to-s3-s2-reply-sdk-materialization-descriptor-producer-implemented.md.
- Verification: backend shared/backend build + full backend Vitest suite PASS; wiki tests and diff checks PASS.

## [2026-05-08] mcp | register_wr | s3-to-s3-s3-implement-health-control-v2-consumers-and-cross-lane-live-evidence
- Registered request WR for s3
- Path: wiki/canon/work-requests/s3-to-s3-s3-implement-health-control-v2-consumers-and-cross-lane-live-evidence.md

## [2026-05-08] mcp | register_wr | s7-to-s3-s7-reply-async-llm-ownership-wait-while-alive-health-control-v2-implemented
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-reply-async-llm-ownership-wait-while-alive-health-control-v2-implemented.md

## [2026-05-08] mcp | complete_wr | s3-to-s7-s7-implement-wait-while-alive-async-llm-ownership-per-health-control-v2
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-08] updated | S4 health-control v2 durable ownership docs
- Updated SAST Runner API/spec/handoff docs for Prefer: respond-async durable ownership mode.
- Documented /v1/requests/{requestId} and /v1/requests/{requestId}/result result recovery semantics and X-Timeout-Ms sync vs async behavior.
- Focused S4 gate passed: 80 tests. Full gate pending final feedback loop.

## [2026-05-08] verified | S4 health-control v2 full verification
- services/sast-runner compileall passed.
- services/sast-runner full pytest gate passed: 406 passed in 11.33s.
- git diff --check passed for S4 code and updated wiki paths.

## [2026-05-08] mcp | complete_wr | s7-to-s3-s7-reply-async-llm-ownership-wait-while-alive-health-control-v2-implemented
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] approved | S4 health-control v2 Critic PASS
- Implementation Critic initially found cross-endpoint X-Request-Id ownership collision blocker.
- S4 fixed by returning 409 REQUEST_ID_CONFLICT for same requestId reused across different endpoints and added regression test.
- Critic re-review PASS; full S4 pytest 407 passed in 11.47s.

## [2026-05-08] mcp | register_wr | s4-to-s3-s4-reply-health-control-v2-durable-ownership-implemented-for-build-scan-build-an
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-health-control-v2-durable-ownership-implemented-for-build-scan-build-an.md

## [2026-05-08] mcp | complete_wr | s3-to-s4-s4-implement-wait-while-alive-build-scan-ownership-per-health-control-v2
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s4-to-s3-s4-reply-health-control-v2-durable-ownership-implemented-for-build-scan-build-an
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] implemented-and-critic-verified | S3 health-control v2 consumers
- Analysis/Build async LLM fixed poll deadlines removed; eval path aligned.
- S4 durable ownership consumed for analysis scan, analysis build-and-analyze, and build-agent try_build.
- Build Agent health requestSummary added and ToolExecutor wait-while-alive bypass implemented.
- Verification: analysis full 585 passed; build full 388 passed; focused blocker suite 66 passed; compileall/diff-check PASS; Critic PASS.

## [2026-05-08] mcp | complete_wr | s3-to-s3-s3-implement-health-control-v2-consumers-and-cross-lane-live-evidence
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s2-to-s3-s2-reply-sdk-materialization-descriptor-producer-implemented
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | register_wr | s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel
- Registered request WR for s4
- Path: wiki/canon/work-requests/s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel.md

## [2026-05-08] mcp | register_wr | s2-to-s3-s3-task-ownership-status-result-cancel-surface-needed-for-s2-wait-while-alive-co
- Registered request WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-s3-task-ownership-status-result-cancel-surface-needed-for-s2-wait-while-alive-co.md

## [2026-05-08] mcp | register_wr | s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr
- Registered request WR for s7
- Path: wiki/canon/work-requests/s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr.md

## [2026-05-08] mcp | complete_wr | s3-to-s2-s2-consume-health-control-v2-downstream-wait-and-cancel-semantics
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | register_wr | s2-to-s3-s2-reply-health-control-v2-downstream-consumer-implemented-for-direct-s4-ownersh
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-s2-reply-health-control-v2-downstream-consumer-implemented-for-direct-s4-ownersh.md

## [2026-05-08] S2 completed S3 WR for health-control v2 downstream wait/cancel semantics | S2 health-control v2 consumer WR completed
- Direct S4 scan/build now use durable ownership wait-while-alive result polling from S2.
- S2 /health and shared DTOs now advertise health-control-signal-rollout-v2 with completed/cancelled/expired vocabulary.
- S2 docs/API/handoff pages updated; original WR completed; S2->S3 reply WR registered.
- Follow-up WRs registered for S4 cancel endpoint, S3 task ownership, and S7 task-level ownership.
- Verification: focused 55 tests passed; full backend 528 tests passed; backend/shared builds passed; Critic PASS.

## [2026-05-08] mcp | complete_wr | s2-to-s3-s2-reply-health-control-v2-downstream-consumer-implemented-for-direct-s4-ownersh
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s2-to-s3-s3-task-ownership-status-result-cancel-surface-needed-for-s2-wait-while-alive-co
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] S5 documented current-state/target-v2 long-running ownership semantics for KB/codegraph/CVE WR | S5 health-control v2 KB/codegraph follow-up docs
- Updated canonical S5 API/spec/handoff docs with finite HTTP current-state boundary, target requestSummary vocabulary, operation mapping, and S2/S3 consumer rule that operational missing knowledge is not negative security evidence.
- No S5 runtime behavior changed; this is a plan/current-state compatibility closeout for the S3→S5 health-control v2 follow-up WR.

## [2026-05-08] mcp | register_wr | s5-to-s3-s5-reply-health-control-v2-kb-codegraph-long-running-ownership-plan-documented-a
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-health-control-v2-kb-codegraph-long-running-ownership-plan-documented-a.md

## [2026-05-08] mcp | complete_wr | s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s5-to-s3-s5-reply-health-control-v2-kb-codegraph-long-running-ownership-plan-documented-a
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | register_wr | s3-to-s4-s4-unknown-sdkid-should-not-suppress-sdk-independent-sast-evidence
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-unknown-sdkid-should-not-suppress-sdk-independent-sast-evidence.md

## [2026-05-08] Registered S4 work request | S3→S4 WR: unknown sdkId degraded SAST policy
- WR path: wiki/canon/work-requests/s3-to-s4-s4-unknown-sdkid-should-not-suppress-sdk-independent-sast-evidence.md
- Reason: gateway-webserver baseline showed S4 SDK_NOT_FOUND can suppress SDK-independent flawfinder evidence, causing S3 no_new_evidence/no_accepted_claims.
- Requested S4 to let source-only SAST run under unknown sdkId while marking SDK-dependent tools degraded/skipped.

## [2026-05-08] mcp | register_wr | s1-to-s2-canonicalize-sdkprofile-typed-export-from-aegis-shared-so-s1-can-drop-unknown-de
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-canonicalize-sdkprofile-typed-export-from-aegis-shared-so-s1-can-drop-unknown-de.md

## [2026-05-08] mcp | register_wr | s1-to-s2-canonicalize-sdkmetrics-aggregate-response-shape-so-s1-can-drop-record-string-un
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-canonicalize-sdkmetrics-aggregate-response-shape-so-s1-can-drop-record-string-un.md

## [2026-05-08] mcp | register_wr | s1-to-s2-canonicalize-findingssummary-aggregate-response-shape-so-s1-can-drop-record-stri
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-canonicalize-findingssummary-aggregate-response-shape-so-s1-can-drop-record-stri.md

## [2026-05-08] mcp | complete_wr | s1-to-s2-canonicalize-findingssummary-aggregate-response-shape-so-s1-can-drop-record-stri
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s1-to-s2-canonicalize-sdkmetrics-aggregate-response-shape-so-s1-can-drop-record-string-un
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s1-to-s2-canonicalize-sdkprofile-typed-export-from-aegis-shared-so-s1-can-drop-unknown-de
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | register_wr | s2-to-s1-s2-reply-findingssummary-sdkmetrics-and-sdkprofile-shared-contracts-completed-fo
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-s2-reply-findingssummary-sdkmetrics-and-sdkprofile-shared-contracts-completed-fo.md

## [2026-05-08] Completed S1→S2 aggregate/profile typing WRs | S2 aggregate/profile shared contracts
- S2 implemented and documented FindingsSummary, SdkMetrics, and SdkProfile response DTO contracts for S1 typed UI cleanup.
- Completed incoming S1 WRs and registered S2→S1 reply: wiki/canon/work-requests/s2-to-s1-s2-reply-findingssummary-sdkmetrics-and-sdkprofile-shared-contracts-completed-fo.md.
- Validation passed: focused backend tests 204/204, shared/backend builds, backend full suite 528/528, Critic PASS.

## [2026-05-08] mcp | register_wr | s4-to-s3-reply-s4-sdk-resolution-contract-now-supports-non-registered-descriptor-and-fail
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-s4-sdk-resolution-contract-now-supports-non-registered-descriptor-and-fail.md

## [2026-05-08] mcp | register_wr | s4-to-s2-reply-s4-durable-ownership-cancel-endpoint-implemented-for-health-control-v2
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s4-to-s2-reply-s4-durable-ownership-cancel-endpoint-implemented-for-health-control-v2.md

## [2026-05-08] mcp | complete_wr | s3-to-s4-s4-unknown-sdkid-should-not-suppress-sdk-independent-sast-evidence
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-08] implementation-docs-wr-replies | S4 WRs: SDK non-registered contract and durable cancel endpoint
- S4 implemented sdkResolutionMode none/non-registered/S4-local sdkId contract; unknown bare sdkId now fails with SDK_NOT_FOUND.
- S4 implemented DELETE /v1/requests/{requestId} cancel endpoint with cancelled terminal result and health summary.
- Tests: focused 15 passed; related S4 gate 147 passed.
- Docs updated: wiki/canon/api/sast-runner-api.md, wiki/canon/specs/sast-runner.md, wiki/canon/handoff/s4/readme.md.
- Reply WRs registered to S2 and S3; incoming WRs completed for lane s4.

## [2026-05-08] verification | S4 full pytest after SDK/cancel WR implementation
- Full services/sast-runner pytest gate passed: 414 passed in 13.83s.
- Canonical S4 API/spec/handoff docs updated with full gate evidence.

## [2026-05-08] critic-validation-pass | S4 final Critic PASS for two WR implementation
- Critic final implementation validation PASS.
- No blocking doc/code mismatches found.
- Known non-blocking risk: best-effort cancel marks retained task cancelled and calls task.cancel(); explicit spawned subprocess kill handling is not proven and should only become follow-up if hard process termination is required.

## [2026-05-08] mcp | complete_wr | s2-to-s1-s2-reply-findingssummary-sdkmetrics-and-sdkprofile-shared-contracts-completed-fo
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s4-to-s2-reply-s4-durable-ownership-cancel-endpoint-implemented-for-health-control-v2
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-08] S2 consumed S4 cancel endpoint reply | S2 S4 durable ownership cancel consumption
- SastClient now best-effort calls S4 DELETE /v1/requests/{requestId} when local AbortSignal cancels direct durable S4 scan/build ownership waits.
- Updated canonical S2/shared docs to remove the old S4 cancel endpoint gap.
- Completed incoming S4→S2 reply WR. Verification: focused client contract 45/45, backend build, backend full suite 528/528.

## [2026-05-08] Resolved Critic blockers for S4 cancel endpoint consumption | S2 S4 cancel consumer Critic fix
- Critic initially found stale S2 docs claiming S4 had no durable cancel endpoint in backend spec and S2 readme.
- S2 updated both docs to reflect direct S4 best-effort DELETE /v1/requests/{requestId} cancellation and scoped remaining gaps to S3/S7 task-level ownership.
- Added build-specific cancel regression alongside scan cancel regression. Verification: client-contract 46/46, backend build, Critic PASS.

## [2026-05-08] Updated S3 handoff with S4 non-registered SDK and SAST failure-honesty implementation notes | S3 S4 non-registered SDK contract consumption
- Canonical page updated: wiki/canon/handoff/s3/readme.md section 19.
- Focused evidence so far: analysis-agent phase/evidence/deep-analyze/sast-tool tests 97 passed.
- Implementation scope remains S3 analysis-agent only; no S4/S2/S1 code edits.

## [2026-05-08] mcp | complete_wr | s4-to-s3-reply-s4-sdk-resolution-contract-now-supports-non-registered-descriptor-and-fail
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] Fixed Critic-rejected durable /v1/scan success=false handling path | S3 Critic blocker fix for S4 SAST failure honesty
- SastScanTool now returns ToolResult(success=False) when S4 scan payload has success=false.
- run_sast now treats success=false payloads from generic tools as SAST failure and preserves failureDetail.
- _sast_failure_detail now unwraps nested detail.failureDetail/detail.errorDetail ownership-error payloads.
- Verification: analysis-agent full suite 594 passed; S4 SDK contract focused 6 passed; compileall/diff-check passed.

## [2026-05-08] Implemented Critic non-blocking recommendation for SAST tool failure wrapper | S3 S4 ownership statusCode preservation follow-up
- SastScanTool now preserves S4OwnershipError.status_code as statusCode in failure content.
- _sast_failure_detail now propagates top-level statusCode through nested detail.failureDetail unwrap.
- Verification: focused SAST/phase/evidence tests 90 passed; Analysis Agent full suite 595 passed; compileall/diff-check passed.

## [2026-05-08] mcp | register_wr | s3-to-s7-s7-health-must-not-report-llm-ready-when-dgx-backend-is-unreachable
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s7-health-must-not-report-llm-ready-when-dgx-backend-is-unreachable.md

## [2026-05-08] Registered WR | S3 to S7 WR — S7 health readiness when DGX unreachable
- Registered wiki/canon/work-requests/s3-to-s7-s7-health-must-not-report-llm-ready-when-dgx-backend-is-unreachable.md
- Trigger: gateway-webserver full-pipeline smoke observed S7 /v1/health status=ok while llmBackend.status=unreachable and async request acr_2df286ba326d4778 failed with backend_timeout.
- Requested S7 to distinguish process liveness from LLM backend readiness and update canonical health docs/tests.

## [2026-05-08] mcp | register_wr | s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re.md

## [2026-05-08] mcp | register_wr | s7-to-s2-s7-reply-v1-tasks-remains-finite-taskresponse-compatibility-health-is-progress-o
- Registered reply WR for s2
- Path: wiki/canon/work-requests/s7-to-s2-s7-reply-v1-tasks-remains-finite-taskresponse-compatibility-health-is-progress-o.md

## [2026-05-08] mcp | complete_wr | s3-to-s7-s7-health-must-not-report-llm-ready-when-dgx-backend-is-unreachable
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-08] completed | S7 health readiness and task ownership WRs
- Implemented explicit `/v1/health` readiness/degraded/dependency fields in S7 LLM Gateway.
- Documented `/v1/tasks` finite synchronous TaskResponse compatibility and `/v1/health?requestId` progress-only semantics.
- Registered S7 reply WRs to S2/S3 and completed both incoming WRs.
- Verification: targeted 24 passed, full llm-gateway 306 passed, wiki npm test 8 passed, Critic APPROVE.

## [2026-05-08] mcp | register_wr | s7-to-s3-s7-notice-consume-v1-health-ready-llmready-for-dgx-availability
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-notice-consume-v1-health-ready-llmready-for-dgx-availability.md

## [2026-05-08] registered | S7 to S3 DGX health readiness consumption notice
- Registered S7 notice to S3 with required `/v1/health` consumer fields: `ready`, `llmReady`, `degraded`, `degradeReasons`, `blockedReason`, `dependencyStatus.llmBackend.status`.
- Clarified that `status="ok"` is process liveness only and `llmReady=false`/`blockedReason="backend_unreachable"` means DGX/vLLM dependency unavailable.

## [2026-05-08] mcp | complete_wr | s7-to-s3-s7-notice-consume-v1-health-ready-llmready-for-dgx-availability
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] mcp | complete_wr | s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-08] Implementation and WR completion | S3 consumed S7 health readiness WRs
- Implemented S7 /v1/health readiness preflight in services/analysis-agent/app/agent_runtime/llm/caller.py and services/build-agent/app/agent_runtime/llm/caller.py before async ownership submit.
- Added regression tests for ready=false/llmReady=false/backend_unreachable and legacy llmBackend.status=unreachable shapes.
- Updated wiki/canon/handoff/s3/readme.md section 20 with code anchors and verification evidence.
- Verification: Analysis Agent full suite 597 passed in 6.35s; Build Agent full suite 389 passed in 3.11s; compileall and diff-check PASS; live S7-unreachable preflight smoke blocked with LLM_UNAVAILABLE backend_unreachable before async submit.
- Completed WRs: s7-to-s3-s7-notice-consume-v1-health-ready-llmready-for-dgx-availability and s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re.

## [2026-05-09] verified | S3 Quality Gate / Generate-PoC strict hot11 hardening
- Added qg anomaly oracle and strict hot11 clean-PoC enforcement.
- Fresh strict live hot11 full pipeline passed 11/11 with 11/11 clean PoCs: reports/hot11-qg-live-all-20260508T183529Z.
- Session evidence recorded at wiki/canon/handoff/s3/session-s3-qg-hardening-20260509.md.

## [2026-05-11] documented | S3 handoff update for strict PoC Quality Gate closeout
- Updated wiki/canon/handoff/s3/readme.md with 2026-05-09 Quality Gate / Generate-PoC strict hot11 closeout.
- Recorded strict clean PoC rule, code anchors, verification evidence, and commit references before global commit/push.

## [2026-05-11] mcp | register_wr | s1-to-s2-aegis-static-wiki-mcp-claude-turn-structuredcontent-json-content
- Registered request WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-aegis-static-wiki-mcp-claude-turn-structuredcontent-json-content.md

## [2026-05-11] mcp | register_wr | s2-to-s1-reply-aegis-static-wiki-mcp-short-structured-responses-now-include-prose-text-fo
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-aegis-static-wiki-mcp-short-structured-responses-now-include-prose-text-fo.md

## [2026-05-11] mcp | complete_wr | s7-to-s2-s7-reply-v1-tasks-remains-finite-taskresponse-compatibility-health-is-progress-o
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s1-to-s2-aegis-static-wiki-mcp-claude-turn-structuredcontent-json-content
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-11] WR processing | S2 handled MCP short structured response workaround and accepted S7 finite task reply
- Patched aegis-static-wiki tools/wiki/mcpServer.js textAndStructured() to prose-wrap bare []/{} and other very short text while preserving structuredContent.
- Added tests/wiki-mcp.test.js coverage for empty list_my_open_wrs content text.
- Completed S1→S2 MCP bug WR and S7→S2 finite /v1/tasks reply WR.

## [2026-05-11] mcp | complete_wr | s2-to-s1-reply-aegis-static-wiki-mcp-short-structured-responses-now-include-prose-text-fo
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | register_wr | s3-to-s4-s4-enriched-sca-library-evidence-contract-for-s3-s5-cve-requery
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-enriched-sca-library-evidence-contract-for-s3-s5-cve-requery.md

## [2026-05-11] mcp | register_wr | s3-to-s2-pre-alpha-e2e-cross-service-connectivity-and-readiness-check-before-s1-s7-integr
- Registered request WR for s2
- Path: wiki/canon/work-requests/s3-to-s2-pre-alpha-e2e-cross-service-connectivity-and-readiness-check-before-s1-s7-integr.md

## [2026-05-11] mcp | register_wr | s4-to-s3-clarify-desired-s5-shape-for-enriched-sca-cve-evidence-chain-before-parallel-s4-
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-clarify-desired-s5-shape-for-enriched-sca-cve-evidence-chain-before-parallel-s4-.md

## [2026-05-11] mcp | register_wr | s3-to-s4-s5-reply-s3-prefers-two-stage-s5-contract-for-enriched-sca-cve-evidence-chain
- Registered reply WR for s4, s5
- Path: wiki/canon/work-requests/s3-to-s4-s5-reply-s3-prefers-two-stage-s5-contract-for-enriched-sca-cve-evidence-chain.md

## [2026-05-11] mcp | complete_wr | s4-to-s3-clarify-desired-s5-shape-for-enriched-sca-cve-evidence-chain-before-parallel-s4-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s3-to-s4-s5-reply-s3-prefers-two-stage-s5-contract-for-enriched-sca-cve-evidence-chain
- Lane s4 completed recipient-side handling
- Status: open

## [2026-05-11] S2 aligned S4 SDK scan and S5 code-graph contracts | S2 downstream API-contract compliance patch
- S4 scan path now maps sdkId none to sdkResolutionMode none and blocks bare uploaded sdk-* ids before S4 submission.
- Pipeline/Quick analysis paths route uploaded SDKs to S4 as sdkResolutionMode non-registered with sdkDescriptor.
- S5 code graph ingest now sends functions[].calls without top-level call_edges and consumes canonical nodeCount/edgeCount counters.
- Validation: targeted S2 contract/orchestrator suite 84 passed; S1-facing api-contract suite 161 passed; services/shared and services/backend TypeScript builds passed.
- Critic subagent reviewed and approved the patch direction.

## [2026-05-11] mcp | register_wr | s2-to-s3-reply-pre-alpha-e2e-cross-service-connectivity-readiness-check-from-s2
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s2-to-s3-reply-pre-alpha-e2e-cross-service-connectivity-readiness-check-from-s2.md

## [2026-05-11] mcp | complete_wr | s3-to-s2-pre-alpha-e2e-cross-service-connectivity-and-readiness-check-before-s1-s7-integr
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s2-to-s3-reply-pre-alpha-e2e-cross-service-connectivity-readiness-check-from-s2
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | register_wr | s3-to-s5-enriched-cve-lookup-diagnostics-and-provenance-contract-for-sca-evidence-chain
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-enriched-cve-lookup-diagnostics-and-provenance-contract-for-sca-evidence-chain.md

## [2026-05-11] mcp | register_wr | s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched.md

## [2026-05-11] mcp | complete_wr | s3-to-s4-s4-enriched-sca-library-evidence-contract-for-s3-s5-cve-requery
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-11] S4 implemented deterministic evidence-resolution producer slice | s4 evidence-resolution implementation
- SAST findings add metadata.evidenceResolution under existing SastFinding.metadata.
- /v1/scan sca.libraries[] now preserves legacy name/version/path/repoUrl plus enriched source/version/diff/provenance diagnostics; /v1/build-and-analyze libraries[] mirrors nested scan shape.
- No new SAST tools, no S5 API changes, no S3 code changes, no LLM/CVE/security verdicts in S4.
- Verification: oracle 12 passed, related regression 132 passed, full services/sast-runner pytest 426 passed.
- Reply WR: wiki/canon/work-requests/s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched.md

## [2026-05-11] mcp | complete_wr | s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] S3 consumed S4 enriched evidence producer contract | s3 enriched SCA/CVE evidence consumption
- Analysis Agent now partitions S4 enriched SCA libraries before S5 CVE batch lookup; versionless/unknown/ineligible libraries are skipped with diagnostics.
- cve_no_hits is emitted only after a completed eligible lookup returns no CVEs; skipped/timeout/error paths are operational diagnostics.
- Phase 2 prompt no longer renders DIFF_NOT_COMPUTED/modificationStatus unknown as unmodified/original.
- Verification: S3 focused 11 passed, Phase1/evidence 79 passed, related gate 108 passed, full Analysis Agent 622 passed, compileall/diff-check PASS.

## [2026-05-11] S3 fixed Critic truncation blocker for enriched SCA CVE lookup | s3 cve lookup truncation honesty
- Added cve_lookup_truncated and cve_lookup_unqueried_eligible_count state for eligible-library cap behavior.
- Suppressed whole-set cve_no_hits when eligible CVE lookup is truncated; catalog now emits cve_lookup_truncated operational diagnostics.
- Verification after blocker fix: truncation regression 10 passed, Phase1/evidence 81 passed, related gate 110 passed, full Analysis Agent 624 passed, compileall/diff-check PASS.

## [2026-05-11] mcp | register_wr | s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen
- Registered question WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen.md

## [2026-05-11] S5 deep-interview crystallized and S5→S3 WR registered | s5-etl-pipeline-modernization
- Deep-interview final ambiguity: 0.17 <= 0.20 threshold.
- Artifacts: .omx/interviews/s5-etl-pipeline-modernization-20260511T033250Z.md and .omx/specs/deep-interview-s5-etl-pipeline-modernization.md.
- WR: wiki/canon/work-requests/s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen.md.
- Key decisions: acquisition diagnostics first, durable target knowledge, Acquisition Quality Gate, non-silent fallback across all S5 acquisition surfaces.

## [2026-05-11] mcp | register_wr | s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md

## [2026-05-11] mcp | complete_wr | s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] S3 replied to S5 target-context acquisition WR | s3-to-s5 one-track target-context contract reply
- Registered reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md
- Direction: no legacy S3 path, one-track TargetContextBundleV1 + AcquisitionEnvelopeV1 for S3 target-aware S5 acquisition surfaces.
- Critic first review BLOCKER: required per-item diagnostics, codeGraph calls shape, safer vocabulary, S3-only scoping, and ingest/idempotency semantics.
- Critic second review PASS after fixes.

## [2026-05-11] mcp | complete_wr | s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-11] S5 deep-interview re-crystallized after S3 reply WR | s5-etl-pipeline-modernization
- Incorporated S3 one-track target-context acquisition reply: wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md
- Updated spec: .omx/specs/deep-interview-s5-etl-pipeline-modernization.md
- Created recrystallized transcript: .omx/interviews/s5-etl-pipeline-modernization-recrystallized-20260511T034934Z.md
- Final ambiguity lowered to 0.08; next handoff is consensus planning for S5 ETL/API implementation.
- Completed S5 recipient handling for the S3 one-track reply and older superseded two-stage reply.

## [2026-05-11] Canonical S5 ETL target-context spec written | s5-etl-pipeline-modernization-target-context
- Page: wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md
- Mirrors re-crystallized local artifact .omx/specs/deep-interview-s5-etl-pipeline-modernization.md.
- Captures one-track TargetContextBundleV1 + AcquisitionEnvelopeV1 direction from S3 reply WR.

## [2026-05-11] Implemented S5 target-context acquisition v1 | s5 target-aware acquisition contract
- Added durable target context ledger and /v1/target-contexts ingest API in services/knowledge-base.
- Added target-scoped acquisition envelopes for CVE, threat search, code search, and dangerous callers with explicit acquisitionStatus/acquisitionQualityGate/consumerPolicy/fallbackTrace/itemAcquisitions.
- Updated canonical S5 ETL target-context spec and Knowledge Base API contract.
- Verification: services/knowledge-base targeted target_context_api tests 8 passed; full S5 pytest 265 passed.

## [2026-05-11] mcp | complete_wr | s3-to-s5-enriched-cve-lookup-diagnostics-and-provenance-contract-for-sca-evidence-chain
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-11] Verified S5 target-context acquisition final regression | s5 target-aware acquisition tests
- Added no-silent-vector-fallback regression for target-context codeGraph ingest caveat.
- Latest verification: target_context_api tests 9 passed; full services/knowledge-base pytest 266 passed.

## [2026-05-11] Expanded S5 target-context CVE diagnostic coverage | s5 target-aware CVE acquisition
- Added stale_cache_only and conflicting_evidence handling/tests so neither can be consumed as CVE no-hit evidence.
- Latest verification: target_context_api tests 11 passed; full services/knowledge-base pytest 268 passed.

## [2026-05-11] mcp | register_wr | s5-to-s3-s3-review-requested-for-s5-acquisition-state-machine-and-durable-ledger-design
- Registered request WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-review-requested-for-s5-acquisition-state-machine-and-durable-ledger-design.md

## [2026-05-11] Created S5 acquisition state-machine design and requested S3 review | s5 acquisition state machine
- Added canonical S5 acquisition state-machine page family under wiki/canon/specs/s5-acquisition-state-machine/ covering target context, acquisition run, item acquisition, projection lifecycle, storage ownership, and transition table.
- Critic subagent initially BLOCKed completed_no_hit ambiguity; S5 fixed fallback no-result to incomplete_acquisition + do_not_use_as_negative_evidence and received Critic PASS.
- Aligned target-scoped CVE implementation/tests with state-machine rule; verification: target_context_api tests 11 passed, full services/knowledge-base pytest 268 passed.
- Registered S5→S3 WR for usability/missing-field review before durable ledger implementation planning.

## [2026-05-11] mcp | register_wr | s3-to-s5-fix-target-context-acquisition-envelope-deadline-and-mixed-status-semantics-befo
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-fix-target-context-acquisition-envelope-deadline-and-mixed-status-semantics-befo.md

## [2026-05-11] S3 registered S5 target-context acquisition blocker WR | s3-to-s5 target-context deadline/envelope/mixed-status fixes
- WR: wiki/canon/work-requests/s3-to-s5-fix-target-context-acquisition-envelope-deadline-and-mixed-status-semantics-befo.md
- Requested fixes: deadline-aware target-context graph persistence, AcquisitionEnvelopeV1 on CVE timeout/error, and no-hit+failure aggregation must not become partial_hit.
- S3 stance: do not consume target-scoped S5 acquisition path as authoritative until fixed.

## [2026-05-11] Handled S3 target-context acquisition deadline/mixed-status WR | s5 target-context acquisition semantics
- Target-context embedded codeGraph projection now receives the caller deadline and returns timeout/incomplete projection diagnostics in the ingest AcquisitionEnvelopeV1 instead of normal-looking ready success.
- Target-scoped CVE provider timeout/error paths now return AcquisitionEnvelopeV1 with top-level and per-item timeout/error statuses and do_not_use_as_negative_evidence policy.
- CVE aggregation now emits partial_hit only when at least one item is completed_hit; completed_no_hit plus failures aggregates to incomplete/non-hit status.
- Updated Knowledge Base API and S5 acquisition state-machine docs. Verification: target_context_api tests 16 passed; full services/knowledge-base pytest 273 passed; py_compile passed.

## [2026-05-11] mcp | register_wr | s5-to-s3-reply-target-context-acquisition-deadline-and-mixed-status-blockers-fixed
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-reply-target-context-acquisition-deadline-and-mixed-status-blockers-fixed.md

## [2026-05-11] mcp | complete_wr | s3-to-s5-fix-target-context-acquisition-envelope-deadline-and-mixed-status-semantics-befo
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s5-to-s3-reply-target-context-acquisition-deadline-and-mixed-status-blockers-fixed
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | register_wr | s3-to-s5-reply-s3-accepts-s5-acquisition-state-machine-and-durable-ledger-design-after-bl
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-reply-s3-accepts-s5-acquisition-state-machine-and-durable-ledger-design-after-bl.md

## [2026-05-11] mcp | complete_wr | s5-to-s3-s3-review-requested-for-s5-acquisition-state-machine-and-durable-ledger-design
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s3-to-s5-reply-s3-accepts-s5-acquisition-state-machine-and-durable-ledger-design-after-bl
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-11] S3 ACCEPT reply received | S5 acquisition state-machine / durable-ledger design
- S3 accepted the S5 acquisition state-machine and durable-ledger design after deadline/envelope/mixed-status blocker fixes.
- S5 can proceed to durable-ledger implementation planning.
- Non-blocking guidance retained: persisted acquisition lookup/history, target-context version binding, item-level consumability, durable diagnostics/fallback/method/evidence fields, and projection debt on projection-dependent responses.

## [2026-05-11] mcp | register_wr | s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract.md

## [2026-05-11] Registered S4→S3 WR requesting review of S4 C/C++ static evidence 고도화 direction | S4 to S3 coverage-contract review WR
- WR: wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract.md
- Asks S3 to review S4 as independent C/C++ static evidence artifact producer rather than S5/GraphRAG consumer/upstream-coupled service.
- Requests S3 guidance on Coverage Contract, Evidence Readiness Contract, Quality/Stability gate separation, Golden Corpus v1, and S3 misjudgment prevention.

## [2026-05-11] mcp | register_wr | s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md

## [2026-05-11] mcp | complete_wr | s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] S3 replied to S4 static evidence coverage-contract review WR | s4 c-cpp static evidence 고도화 direction
- Reply WR: wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md
- Verdict: CONDITIONAL PASS. S3 agrees S4 should be an independent deterministic C/C++ static evidence artifact producer, not S5/GraphRAG/LLM/verdict authority.
- S3 requested Coverage Contract v1, Evidence Readiness Contract v1, and Golden Corpus v1 before tool-portfolio changes.
- S3 provided minimum machine-readable coverage categories, claim-boundary list, S5/GraphRAG/KB retention conditions, follow-up hint shape, structural-codeGraph boundary, SCA readiness direction, golden corpus requirements, and S4 priority order.

## [2026-05-11] mcp | register_wr | s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-
- Registered question WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-.md

## [2026-05-11] S5 registered S3 review WR | S5 Knowledge Coverage / Acquisition Readiness Contract v1
- Registered S5→S3 question WR for S3 review of S5 Knowledge Coverage Contract v1 and Acquisition Readiness Contract v1 direction.
- WR asks S3 to validate S5 legibility/readiness surfaces, CVE candidate evaluation vs discovery split, EvidenceCatalog mapping, and pre-ledger fixture priorities.

## [2026-05-11] mcp | register_wr | s1-to-s2-s2-modulereport-endpoints-report-static-report-dynamic-report-test-s1-0-callers-
- Registered question WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-s2-modulereport-endpoints-report-static-report-dynamic-report-test-s1-0-callers-.md

## [2026-05-11] mcp | register_wr | s1-to-s2-s2-health-aggregator-s7-readiness-ready-llmready-degraded-blockedreason-dependen
- Registered question WR for s2
- Path: wiki/canon/work-requests/s1-to-s2-s2-health-aggregator-s7-readiness-ready-llmready-degraded-blockedreason-dependen.md

## [2026-05-11] mcp | register_wr | s2-to-s1-reply-s2-health-forwards-s7-readiness-fields-under-llmgateway.detail
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-s2-health-forwards-s7-readiness-fields-under-llmgateway.detail.md

## [2026-05-11] mcp | register_wr | s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c.md

## [2026-05-11] mcp | complete_wr | s1-to-s2-s2-health-aggregator-s7-readiness-ready-llmready-degraded-blockedreason-dependen
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] S3 registered conditional-pass reply and completed inbound S5 WR | S3 reply to S5 Knowledge Coverage / Acquisition Readiness Contract review
- Inbound WR: wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-.md
- Reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c.md
- Verdict: CONDITIONAL PASS
- Conditions: machine-readable coverage/readiness, candidate/discovery CVE split, strict completed_no_hit scope/method rules, S3 EvidenceCatalog mapping, fixture/oracle-first implementation sequencing.

## [2026-05-11] mcp | register_wr | s2-to-s1-reply-s2-module-report-endpoints-remain-active-contract-surfaces
- Registered reply WR for s1
- Path: wiki/canon/work-requests/s2-to-s1-reply-s2-module-report-endpoints-remain-active-contract-surfaces.md

## [2026-05-11] mcp | complete_wr | s1-to-s2-s2-modulereport-endpoints-report-static-report-dynamic-report-test-s1-0-callers-
- Lane s2 completed recipient-side handling
- Status: completed

## [2026-05-11] S2 processed two S1 question WRs | S2 S1 WR replies for health readiness and module reports
- Registered reply WR s2-to-s1-reply-s2-health-forwards-s7-readiness-fields-under-llmgateway.detail.md and completed original health-readiness WR for lane S2.
- Registered reply WR s2-to-s1-reply-s2-module-report-endpoints-remain-active-contract-surfaces.md and completed original module-report WR for lane S2.
- Updated canonical docs wiki/canon/handoff/s2/api-endpoints.md and wiki/canon/api/shared-models.md; validation passed with backend health/API contract tests and backend build.

## [2026-05-11] S4 authored canonical Coverage/Readiness contract design for deterministic static evidence artifacts | S4 Static Evidence Contract v1 design
- Created wiki/canon/specs/sast-runner-static-evidence-contract.md
- Updated S4 API/spec/handoff pages with staticEvidenceContract v1 design references
- Contract requires explicit not_provided surfaces for external vulnerability knowledge, semantic graph retrieval, runtime behavior, exploitability judgment, and final security verdict
- Contract separates systemStability, evidenceReadiness, and qualityEvaluation gates

## [2026-05-11] mcp | register_wr | s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s
- Registered question WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s.md

## [2026-05-11] mcp | complete_wr | s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-11] Plan crystallized and S3 conditional-pass reply incorporated | S5 Knowledge Acquisition Modernization one-track plan
- Registered S5→S3 taxonomy/profile review WR before reading the prior S3 reply, per user request.
- Read S3 conditional-pass reply on Knowledge Coverage / Acquisition Readiness Contract direction.
- Created canonical roadmap page wiki/canon/roadmap/s5-knowledge-acquisition-modernization-one-track.md.
- Created .omx/ultragoal/brief.md for later ultragoal execution.

## [2026-05-11] mcp | register_wr | s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d.md

## [2026-05-11] mcp | complete_wr | s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] S3 registered conditional-pass reply and completed inbound S5 WR | S3 reply to S5 Knowledge Corpus taxonomy/profile split
- Inbound WR: wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s.md
- Reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d.md
- Verdict: CONDITIONAL PASS
- Key framing: AEGIS is automotive-first native/embedded security analysis, not automotive-only keyword matching.
- User requested deeper discussion with S5 on keyword/embedding retrieval semantics because keyword misses can create false negatives and global embedding similarity made everything look vulnerability-related.

## [2026-05-11] mcp | complete_wr | s2-to-s1-reply-s2-module-report-endpoints-remain-active-contract-surfaces
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s2-to-s1-reply-s2-health-forwards-s7-readiness-fields-under-llmgateway.detail
- Lane s1 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | register_wr | s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual
- Registered question WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual.md

## [2026-05-11] S5 registered S3 validation WR | S5 future typed acquisition runtime vs offline quality-evaluation scenario
- Registered S5→S3 question WR asking whether the proposed future S5 scenario matches S3's intended consumption model.
- The WR separates runtime candidate/provenance language from offline Golden Set TP/FP/FN/Recall metrics and asks S3 to validate typed query/acquisition behavior.

## [2026-05-11] mcp | register_wr | s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl.md

## [2026-05-11] mcp | complete_wr | s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] S3 registered conditional-pass reply and completed inbound S5 WR | S3 validates S5 runtime/offline retrieval semantics split
- Inbound WR: wiki/canon/work-requests/s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual.md
- Reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl.md
- Verdict: CONDITIONAL PASS
- Key boundaries: runtime candidate_returned/no_candidate_returned is separate from offline TP/FP/FN/Recall/Precision and from S3 final claim quality.
- Important guards: completed_hit != true positive; no_candidate_returned != completed_no_hit; S5 knowledge context is not local claim support by itself.

## [2026-05-11] mcp | complete_wr | s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-11] S5 roadmap and ultragoal brief synchronized with S3 conditional PASS replies | S5 knowledge acquisition modernization planning
- Updated wiki/canon/roadmap/s5-knowledge-acquisition-modernization-one-track.md with S3 taxonomy/profile and runtime-vs-offline feedback.
- Updated /home/kosh/AEGIS/.omx/ultragoal/brief.md for future ultragoal execution.
- Completed S3→S5 reply WRs for taxonomy/profile split and runtime candidate semantics vs offline quality metrics split.
- Critic sub-agent 019e1590-0c08-79d3-8d20-59c142f606aa returned PASS with no blocking issues.

## [2026-05-11] S4 completed deterministic static evidence contract enhancement and validation baseline | S4 staticEvidenceContract v1 / Golden Corpus / Governance implementation
- Implemented staticEvidenceContract v1 in services/sast-runner runtime responses and policy-failure paths
- Added Golden Corpus v1 manifest and deterministic validator with S3-required four layers
- Added separate validation report profile so runtime qualityEvaluation remains not_evaluated unless a profile runs
- Added Tool Portfolio Governance v1 and kept current six tools unchanged
- Final services/sast-runner pytest gate: 447 passed in 13.28s

## [2026-05-11] mcp | register_wr | s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance.md

## [2026-05-11] mcp | complete_wr | s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-11] S4 고도화 aggregate Codex goal completed | S4 ultragoal complete
- Final Critic PASS with no blockers
- Full S4 pytest gate: 447 passed in 13.28s
- Open S4 WRs: none
- S3 conditional WR completed; S4 reply WR registered
- Aggregate Codex goal complete; final budget time used 3116 seconds
- S4 final ultragoal completion recorded in archived S4 artifact because active .omx/ultragoal plan was replaced by another run after G007

## [2026-05-11] S5 G001 completed and checkpointed | S5 G001 knowledge coverage/acquisition readiness contract freeze
- Added machine-readable S5 acquisition contract snapshot and GET /v1/contracts/acquisition.
- Added additive target-context envelope contract metadata and unsafe completed_no_hit downgrade validator.
- Updated canonical API/spec pages for Knowledge Coverage Contract v1 and Acquisition Readiness Contract v1.
- Verification: full S5 test suite 283 passed; Critic PASS; ultragoal checkpoint complete.

## [2026-05-11] completed | S4 Static Evidence Contract gate hardening
- Added canonical gate-specific test inventory to wiki/canon/specs/sast-runner-static-evidence-contract.md.
- S4 gate tests now directly cover systemStability pass/degraded/fail, evidenceReadiness required/optional matrix, qualityEvaluation runtime/report separation, and sync/async policy-failure propagation.
- Verification: focused static evidence contract tests 23 passed; oracle/report/governance bundle 48 passed; router/build/request ownership 67 passed; full S4 pytest 462 passed.
- Final Critic review returned PASS with no remaining blockers.

## [2026-05-11] mcp | register_wr | s4-to-s3-s4-staticevidencecontract-gate-hardening-completed-s3-consumer-update
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-gate-hardening-completed-s3-consumer-update.md

## [2026-05-11] Golden Set v1 and separated gate harness completed | S5 ultragoal G002
- Added services/knowledge-base/app/evaluation/golden_set.py
- Added services/knowledge-base/fixtures/golden-set-v1/manifest.json with 24 cases
- Added services/knowledge-base/tests/test_golden_set_v1.py
- Verification: 293 full S5 tests passed
- Critic PASS: 019e15c5-3c55-7c62-821c-256a674da432
- Ultragoal status reconciled manually because general keep-going Codex goal remains active until G001-G010 complete

## [2026-05-11] Knowledge Corpus v1 taxonomy/profile assets completed | S5 ultragoal G003
- Added services/knowledge-base/app/corpus/knowledge_corpus.py
- Added services/knowledge-base/fixtures/knowledge-corpus-v1/manifest.json
- Added services/knowledge-base/tests/test_knowledge_corpus_v1.py
- Verification: 303 full S5 tests passed
- Critic PASS: 019e15d0-2200-7901-9d8f-25986cee9705
- G004 SQLite LedgerRepository foundation started

## [2026-05-11] SQLite LedgerRepository foundation completed | S5 ultragoal G004
- Added app/ledger/repository.py and migrations/0001_init.sql
- Added ledger_url config and target-context ledger-first seam
- Added tests for repository and no silent JSON fallback
- Verification: 312 full S5 tests passed
- Critic PASS: 019e15e2-f940-7a83-8a0c-150791f06f36
- G005 corpus source manifests/first ingestion started

## [2026-05-11] Corpus source manifests and first ledger ingestion completed | S5 ultragoal G005
- Added corpus-ingestion-v1 source manifest and raw fixtures
- Added app/ingestion/corpus_ingestion.py and ledger upsert helpers
- Added tests for source/raw hash validation, fixture ingestion, KEV/EPSS enrichment-only semantics, idempotency
- Verification: 321 full S5 tests passed
- Critic PASS: 019e15f7-71b9-79f2-9838-a0cd31329718
- G006 transform-decision/taxonomy signal model started

## [2026-05-11] mcp | register_wr | s3-to-s4-s3-accepts-s4-staticevidencecontract-v1-and-gate-hardening-notices
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-accepts-s4-staticevidencecontract-v1-and-gate-hardening-notices.md

## [2026-05-11] mcp | complete_wr | s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | complete_wr | s4-to-s3-s4-staticevidencecontract-gate-hardening-completed-s3-consumer-update
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-11] S5 G006 completed | Transform-decision and taxonomy signal model
- Added transform signal manifest and validator/persistence harness
- Formalized profile_signal as context-only relation/signal method
- Persisted transform_decision rows for fixture ingestion normalized records and relation/enrichment signals
- Added guards/tests preventing keyword/embedding hits/misses from becoming no-hit or negative evidence
- Critic PASS after fixing TP/FP/FN runtime/offline vocabulary guard

## [2026-05-11] S5 G007 completed | Ledger-derived Neo4j/Qdrant projections
- Added ledger-derived projection bundle/rebuilder and projection job helpers
- Changed neo4j-seed default path to Ledger→Neo4j
- Target-context code/threat/dangerous-caller no-hit paths now consume ledger projection debt/failed states
- Projection debt/failure downgrades completed_no_hit through apply_no_hit_safety
- Critic PASS after fixing hard-coded ready projectionState and contradictory Qdrant→Neo4j wording

## [2026-05-11] S5 ultragoal G008 completed | S5 G008 CVE candidate/discovery split completed
- Implemented target-scoped cveCandidateEvaluation and cveDiscovery endpoints while preserving compatibility /acquire/cve surface=cve.
- Added conservative CVE method-completeness helper, candidate range-out forbidden inference guards, linked ledger acquisition/provider observations, and runtime offline-vocabulary leak tests.
- Verification: test_cve_acquisition_split_v1.py 4 passed; test_target_context_api.py 24 passed; targeted G008 suite 45 passed; compileall app passed; full services/knowledge-base tests 353 passed.
- Critic final PASS: 019e165f-00a6-71c0-836f-7cd6c022d4f1. Advancing to G009 typed GraphRAG retrieval planner/reranker.

## [2026-05-11] ultragoal_goal_completed | S5 G009 typed GraphRAG retrieval planner/reranker complete
- Goal G009 completed under S5 Knowledge Acquisition Modernization ultragoal.
- Implemented typed query intent/corpus partition planning, constrained/global embedding traceability, relation method/methodTrust/ranking annotations, API/target-context propagation, no-hit trace diagnostics, and Golden Set retrieval-quality summary.
- Verification: targeted G009+contract suites 86 passed; compileall app passed; full S5 tests 365 passed.
- Critic final PASS: 019e168f-8244-7e63-8dab-fa60c764e4e2 after ITERATE fixes for runtime offline-vocabulary leakage and missing retrievalTrace no-hit bypass.

## [2026-05-11] mcp | complete_wr | s3-to-s4-s3-accepts-s4-staticevidencecontract-v1-and-gate-hardening-notices
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-11] mcp | register_wr | s5-to-s3-s3-review-requested-s5-g010-consumption-validation-report-and-final-modernizatio
- Registered request WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-g010-consumption-validation-report-and-final-modernizatio.md

## [2026-05-11] ultragoal_completed | S5 Knowledge Acquisition Modernization G001-G010 complete
- All S5 ultragoal goals G001-G010 completed with mandatory Critic validation.
- G010 added consumption-validation-v1 manifest/report/tests, 34-row source-family audit, 28-row S3 conditional-pass audit, and S5→S3 review WR.
- Verification: focused G010/S5 contract suite 53 passed; full S5 compile + tests 371 passed.
- Critic final PASS: 019e16a3-ff1c-7f70-ab68-2796648d647b.

## [2026-05-11] S2 completed S2-only performance-goal optimization | S2 ReportService aggregate performance optimization
- Created OMX performance goal s2-report-aggregate-perf with deterministic evaluator contract before optimization.
- Added services/backend/src/services/__tests__/report.service.perf.test.ts to guard against repeated project/run/gate lookups in aggregate report generation.
- Updated services/backend/src/services/report.service.ts to reuse a per-request lookup context for ProjectReport and custom report module slices.
- Validation passed: evaluator, full backend suite, shared build.

## [2026-05-11] completed | S7 health readiness cache performance goal
- Added bounded process-local TTL cache for `/v1/health` real-mode LLM backend readiness probes (`AEGIS_LLM_HEALTH_CACHE_TTL_SECONDS`, default 1.0s).
- Responses expose `llmBackend.cached` and `llmBackend.cacheTtlMs`; ready/llmReady semantics unchanged and stale states are not reused beyond TTL.
- Evaluator PASS: uncached_mean_ms=201.52 cached_mean_ms=25.75 improvement=0.872; backend probe calls 8 -> 1.
- Verification: targeted S7 tests 27 passed; full S7 pytest 309 passed; wiki npm test 8 passed.
- Performance goal completed: .omx/goals/performance/s7-health-readiness-cache.

## [2026-05-11] mcp | register_wr | s4-to-s3-s4-staticevidencecontract-v1-now-includes-s3-consumable-toolevidencematrix
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-v1-now-includes-s3-consumable-toolevidencematrix.md

## [2026-05-11] goal_completion_audit_passed | S5 active goal completion audit passed
- Completion audit artifact: .omx/plans/s5-modernization-completion-audit-20260511.md.
- Current full S5 verification: compileall app passed; pytest tests/ -q 371 passed in 36.78s.
- Critic audit PASS: 019e16af-9e16-7771-b784-be0649f7e5d9.
- All G001-G010 remain complete and activeGoalId=null.

## [2026-05-11] mcp | register_wr | s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates.md

## [2026-05-11] implemented | s4 staticEvidenceContract per-tool anomaly gate propagation
- S4 kept s4-static-evidence-contract-v1 and did not create v2.
- Per-tool anomalies now degrade successful artifacts and partialize staticToolExecution with anomalyReasonCodes[].
- Full S4 pytest: 480 passed in 13.52s.
- S4→S3 notice WR: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates.md

## [2026-05-11] Documented S5 human-readable analyst brief contract and target-context boundary | S5 Analyst Brief v1
- Added Knowledge Base API contract for POST /v1/analyst-brief as a pure deterministic transformation endpoint exempt from X-Timeout-Ms.
- Added target-context spec boundary: Analyst Brief v1 explains S5 observations, uncertainty, allowed/forbidden S3 uses, next actions, and evidence placement without becoming final claim support.

## [2026-05-11] critic-blocker-fixed | s4 staticEvidenceContract not_recorded gate summarization
- Critic found matrix not_recorded entries could remain clean at gate level.
- S4 now treats every missing current toolEvidenceMatrix result as TOOL_NOT_RECORDED:<tool> unless an explicit allowed skip result exists.
- Added regression: toolsRun=[semgrep] with only semgrep toolResult degrades systemStability and partializes staticToolExecution.
- Full S4 pytest after fix: 481 passed in 13.28s.

## [2026-05-11] mcp | register_wr | s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption.md

## [2026-05-11] implemented | s4 staticEvidenceContract consumer canary harness
- Added pure JSON consumer canary helper and precomputed full-response fixtures.
- Canary derives localStaticEvidenceReady only from contract gates/coverage/claimBoundaries/toolEvidenceMatrix and ignores raw execution.toolResults.
- Full S4 pytest: 490 passed in 13.35s.
- S4→S3 notice WR: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption.md

## [2026-05-11] implemented | s4 Tool Output Compatibility v1
- Added parser fixture manifest/report for current six SAST tools: Semgrep SARIF, Cppcheck XML, Flawfinder CSV, clang-tidy text, scan-build plist, gcc-fanalyzer text.
- Connected report to Tool Portfolio Governance v1 parserCompatibility gate.
- No tool execution, network, new SAST tools, or API v2 split.
- Full S4 pytest: 496 passed in 13.08s.

## [2026-05-11] implemented | s4 Benchmark Slice Report v1
- Added offline JSON-only Benchmark Slice Report v1 over pinned historical Juliet artifacts v0.6.0-full.json and v0.7.0-all-variants.json.
- Variant-01 precision/FP and all-variant noise/noisePerFile metrics remain source-scoped and are not merged into runtime quality score.
- Connected report to Tool Portfolio Governance v1 benchmarkSliceCoverage gate.
- Full S4 pytest: 503 passed in 13.93s.

## [2026-05-11] completed | s4 hardening goal completion audit
- Completion audit passed: no open S4 WRs, final S4 full pytest 503 passed, wiki tests 8 passed, artifact probe passed.
- Five Critic-validated loops completed without v2 split or new SAST tools.
- Session history marked complete: wiki/canon/handoff/s4/session-omx-1778459818640-2qvuzs-s4-hardening-goal-20260511.md

## [2026-05-11] implementation verified | S5 retrieval quality modernization
- Applied RetrievalPolicy v1, Lexical Signal Enhancer v1, deterministic reranker/model registry, Retrieval Quality Lab v1, CAPEC/ATT&CK fixture ETL coverage, and attack_pattern ledger projection support.
- Focused S5 modernization tests: 54 passed.
- Full S5 regression: 390 passed.
- Wiki validation passed after index rebuild.

## [2026-05-11] completed after Critic validation | S5 full modernization goal
- Completion audit: .omx/reports/s5-full-modernization-completion-audit-20260511.md
- Final full S5 regression: 390 passed in 39.38s
- Final isolated S5 scope/focused suite: 67 passed in 20.90s with empty S3/S4 diff check
- Final Critic PASS after hygiene cleanup

## [2026-05-12] mcp | register_wr | s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun.md

## [2026-05-12] S4 added tool-agnostic claimSupportReadiness gate and claimBoundaryMatrix to staticEvidenceContract v1 | s4 staticEvidenceContract claim-support readiness
- No v2 split; runtime qualityEvaluation remains not_evaluated.
- Full S4 pytest: 516 passed in 12.94s.
- S3 notice WR registered: wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun.md

## [2026-05-12] Implemented S5 ledger/affectedness/quality/projection foundation | S5 Evidence-Grounded Threat Knowledge DB foundation
- Added canonical spec wiki/canon/specs/s5-evidence-grounded-threat-knowledge-db.md.
- Implemented ledger schema v2 and tests in services/knowledge-base.
- Verification: focused 33 passed; full S5 tests 398 passed.

## [2026-05-12] spec | S4 Tool Portfolio Experiment Spec v1
- Added canonical S4 LLM-free local experiment protocol for tool-portfolio validation/test/golden-set work.
- Critic subagent reviewed the draft through two reject cycles and final pass before canonical write.
- Spec is current-six-tools only for Milestone 1 and keeps future add/remove/upgrade actions WR-gated.

## [2026-05-12] session | s4 / omx-1778459818640-2qvuzs experiment spec evidence
- Recorded S4 session history for Tool Portfolio Experiment Spec v1 creation and critic verification evidence.
- Attached test evidence for final critic pass and MCP/index/log verification.

## [2026-05-12] Prevented CWE-78 fixture slice from masquerading as full CWE coverage | S5 CWE coverage-profile hardening
- Added coverageProfile/expectedCoverage manifest semantics and persisted them through source artifact, quality report, and projection manifest.
- Quality Gate now hard-fails unresolved CWE references under cached/production/full coverage profiles while allowing logged soft caveats for fixture_slice.
- Verification: focused 29 passed; full S5 401 passed.

## [2026-05-12] Resolved cached_catalog_snapshot expectedCoverage gap | S5 CWE coverage-profile final Critic PASS
- Critic final gate #2 failed because cached_catalog_snapshot did not enforce expectedCoverage.
- S5 fixed validation so cached_catalog_snapshot, production_snapshot, and full_cwe_expected all enforce CWE expectedCoverage.
- Added regression tests; verification focused 31 passed and full S5 403 passed; Critic final gate #3 PASS.

## [2026-05-12] implementation | S4 Tool Portfolio Experiment v1 framework
- Implemented S4 local deterministic experiment harness framework under services/sast-runner/benchmark with acquisition/corpus manifests, oracle matcher, decision-cycle freeze, report builder, and harness fixture.
- Generated s4-harness-fixture report; decision-grade Juliet validation/test remains blocked/not_run until pinned local corpus is available.
- Verification: new harness 27 passed, focused governance/static-evidence gate 116 passed, full S4 pytest 543 passed in 13.59s.

## [2026-05-12] verification | S4 Tool Portfolio Experiment v1 framework final critic pass
- Final Critic review returned PASS after blocker fixes.
- Final verification: matcher/manifest/report subset 23 passed in 0.07s; focused harness/governance/static-evidence gate 121 passed in 0.27s; full S4 pytest 548 passed in 13.09s.
- Generated report keeps decision-grade Juliet validation/test blocked/not_run with LOCAL_JULIET_CORPUS_NOT_PRESENT.

## [2026-05-12] documented_discussion_context | S5 Threat KB megagoal discussion context
- Created canonical context page: wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md
- Mirrored local ralplan-ready report: .omx/reports/s5_threat_kb_megagoal_discussion_context.md
- Captured resolved decisions and open discussion points including GraphRAG placement, golden set >=10, negative set, scoring policy, serving/re-query contract.

## [2026-05-12] S4 fail-closed required-tool preflight and blocked quality gate reporting added | S4 system-stability vs quality-gate separation implemented
- Semgrep canonical executable path fixed to service .venv path with PATH fallback only when absent.
- Default scans now fail closed before analyzer execution when any current-six required tool is unavailable.
- Failed preflight responses preserve execution.toolResults and staticEvidenceContract across sync scan, NDJSON, and build-and-analyze.
- Tool-portfolio reports now expose systemStabilityGate and qualityGate; failed system gate blocks quality metrics and emits invalid-precondition.

## [2026-05-12] documented_architecture_boundary_candidate | S5 GraphRAG/source-code boundary
- Added canonical page: wiki/canon/specs/s5-graphrag-source-code-boundary.md
- Captured decision candidate: Threat KB keeps GraphRAG; Source Code becomes Knowledge Graph / Code Graph Context; new Evidence-Grounded Answering/Judge layer composes both.
- Clarified this is not a three-layer GraphRAG design.

## [2026-05-12] updated_discussion_evidence | S5 megagoal context evidence
- Updated wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md section 8.1 to resolve GraphRAG placement as decision candidate.
- Updated goal epic 12 to: Threat KB GraphRAG + Source Code KG + Evidence-Grounded Judge.
- Mirrored the updated evidence into .omx/reports/s5_threat_kb_megagoal_discussion_context.md.

## [2026-05-12] updated_discussion_evidence | S5 Source Code KG ownership
- Updated wiki/canon/specs/s5-graphrag-source-code-boundary.md to mark Source Code KG as S5-owned durable knowledge layer.
- Updated wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md and local mirror to reflect epic 12 as Threat KB GraphRAG + S5-owned Source Code KG + Evidence-Grounded Judge.
- Captured guardrail: S3/S4 produce high-fidelity source/build analysis facts; S5 owns storage/versioning/enrichment/serving for the Source Code KG.

## [2026-05-12] updated_discussion_evidence | S5 Source Code KG rich IR scope
- Updated wiki/canon/specs/s5-graphrag-source-code-boundary.md to make rich analysis IR first-class in the S5-owned Source Code KG.
- Updated wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md and local mirror with rich IR scope.
- Rich artifacts include AST fragments, CFG, PDG, taint traces, symbol tables, macro expansion data, compile commands, include paths, build flags, graph facts, and evidence snippets.

## [2026-05-12] updated_discussion_evidence | S5 Source Code KG versioning
- Updated wiki/canon/specs/s5-graphrag-source-code-boundary.md with repository snapshot as primary Source Code KG version identity.
- Updated wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md and local mirror with versioning decision candidate.
- Commit/tree/submodule hashes belong in analysis metadata/provenance; build target/toolchain/analyzer/rich IR hashes are derivation metadata.

## [2026-05-12] updated_discussion_evidence | S5 source artifact retention
- Updated wiki/canon/specs/s5-graphrag-source-code-boundary.md to allow full repository/source snapshot artifact retention or references.
- Updated wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md and local mirror with source artifact retention decision candidate.
- Routine answer packets should expose snippets/hashes/artifact IDs, while retained source artifacts support replay, validation, dataset construction, audit, and later graph/IR regeneration.

## [2026-05-12] updated_discussion_evidence | S5 source retention and API authority
- Updated wiki/canon/specs/s5-graphrag-source-code-boundary.md: full source artifact retention is default in current project context because sensitive-code input is not expected.
- Updated boundary page: S5 owns producer API contract and should require S3/S4 to emit needed source/build graph facts, rich IR, source artifacts, and repository snapshot metadata.
- Mirrored source retention/API authority decisions into wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md and .omx/reports/s5_threat_kb_megagoal_discussion_context.md.

## [2026-05-12] Updated S4 canon docs for required-tool preflight/post-execution system stability separation | S4 required-tool system-stability Quality Gate hardening
- Default /v1/scan requires current six tools unless options.tools explicitly supplies a subset.
- Preflight unavailable required tool returns REQUIRED_TOOL_UNAVAILABLE before analyzer execution.
- Post-execution required tool missing/failed/partial/skipped/degraded/non-normal returns REQUIRED_TOOL_EXECUTION_INCOMPLETE before SCA/codeGraph enrichment.
- Invalid options.tools values return SCAN_TOOL_INVALID as caller error.
- Verification: focused all-six gate 83 passed; related runner/API suite 208 passed in 12.75s; full services/sast-runner pytest 639 passed in 24.21s.

## [2026-05-12] updated_discussion_evidence | S5 Judge verdict/status taxonomy
- Updated wiki/canon/specs/s5-graphrag-source-code-boundary.md with Judge output taxonomy separating verdict and status.
- Mirrored the taxonomy decision into wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md and .omx/reports/s5_threat_kb_megagoal_discussion_context.md.
- Verdict candidates: affected, not_affected, unknown, conflicting. Status candidates: complete, requires_requery, insufficient_input, degraded_quality, stale_cache, policy_blocked.

## [2026-05-12] updated_discussion_evidence | S5 grounded unknown semantics
- Updated wiki/canon/specs/s5-graphrag-source-code-boundary.md with grounded unknown semantics.
- Mirrored grounded unknown decision into wiki/canon/specs/s5-threat-kb-megagoal-discussion-context.md and .omx/reports/s5_threat_kb_megagoal_discussion_context.md.
- Grounded unknown can pass when explicit evidence gaps/reasons/required inputs/follow-up affordances are present; library version/diff/vendored-patch unknowns should let S3 route follow-up to S4.

## [2026-05-12] Fixed report-side required-tool unknown/non-normal status pass-through | S4 report-side system stability Critic blocker closure
- Critic found benchmark/tool_portfolio_system_gate.py allowed raw status=unknown or arbitrary non-normal required tool status to pass.
- Added RED test covering raw unknown and weird-status required tool results; pre-fix result was 2 failed.
- Changed report-side execution completeness to fail whenever required tool status != ok or degraded=true.
- Verification: focused system gate 30 passed; related suite 210 passed in 13.04s; full services/sast-runner pytest 641 passed in 25.79s.

## [2026-05-12] Updated sast-runner spec overview to current required-tool system-stability validation evidence | S4 canon stale test status cleanup
- Critic found wiki/canon/specs/sast-runner.md still listed 516 passed while API/handoff pages listed 641 passed.
- Updated service overview test row to 641 passed in 25.79s after required-tool system-stability hardening and report-side unknown/non-normal status fix.

## [2026-05-12] Critic accepted S4 required-tool system-stability hardening | S4 required-tool system-stability gate final Critic PASS
- Final Critic PASS after report-side unknown/non-normal status fix and canon consistency cleanup.
- Critic re-ran focused gate: 30 passed; related suite: 210 passed; full S4 pytest: 641 passed.
- Accepted runtime paths: current-six default required, explicit subset required, preflight fail-closed, post-exec non-normal fail before SCA/codeGraph, invalid tools 400, Semgrep invalid output ToolOutputInvalidError.

## [2026-05-12] Added localQualityAssessment to tool-portfolio experiment report and regenerated harness report artifact | S4 local Quality Gate threshold/oracle hardening
- Quality Gate now distinguishes metric-bucket scoring success from threshold quality status.
- Added quality_gate_oracle.json golden oracle fixture for validation/test/canary local assessment.
- Current harness report remains not_decision_grade because Juliet is not locally pinned, but localQualityAssessment.status=fail with validation/test failing and canary passing.
- Regenerated benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json with systemStabilityGate, qualityGate, and localQualityAssessment.
- Verification: report tests 7 passed; focused tool-portfolio experiment/system-gate suite 64 passed in 0.12s; full services/sast-runner pytest 642 passed in 25.47s.

## [2026-05-12] Implemented S5 Source Code KG ledger v1 and Judge v1 loop with focused tests passing; Critic implementation validation pending. | s5-source-code-kg-judge-loop1
- Plan artifact: .omx/plans/s5-source-kg-judge-loop-plan-20260512.md
- Docs updated: wiki/canon/api/knowledge-base-api.md and wiki/canon/specs/s5-graphrag-source-code-boundary.md
- Focused tests: 15 passed; regression subset: 119 passed

## [2026-05-12] Updated S4 API contract, handoff, spec, and roadmap with fresh current-six tool liveness, system-stability/quality-gate separation, and latest full pytest evidence. | S4 API contract and owner-doc sync
- Updated wiki/canon/api/sast-runner-api.md with fresh health-probe evidence, /v1/health example versions, and consumer interpretation note separating liveness from qualityGate.localQualityAssessment.
- Updated wiki/canon/handoff/s4/readme.md and wiki/canon/specs/sast-runner.md with 642 passed in 25.57s, all-six available, policyStatus ok, unavailableTools empty, and local Quality Gate fail/not_decision_grade status.
- Updated wiki/canon/roadmap/s4-roadmap.md next-step framing: decision-grade Juliet/SARD corpus acquisition/run is the blocker; local oracle/system-stability/liveness docs are synced.
- Validated with python3 tools/validate_wiki.py: PASS.

## [2026-05-12] mcp | register_wr | s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md

## [2026-05-12] mcp | complete_wr | s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-12] mcp | complete_wr | s4-to-s3-s4-staticevidencecontract-v1-now-includes-s3-consumable-toolevidencematrix
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-12] mcp | complete_wr | s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-12] mcp | complete_wr | s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-12] Registered one consolidated S4-to-S3 contract notice for current tool liveness, system-stability gate, and local Quality Gate status; completed four older incremental S4 staticEvidenceContract notices as superseded/deprecated. | S4-to-S3 consolidated WR and deprecated notice cleanup
- New WR: wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md
- Deprecated/completed older notices: consumer-canaries, toolEvidenceMatrix, per-tool-anomalies, claimSupportReadiness/claimBoundaryMatrix.
- S3 open WR list should now contain the consolidated S4 notice instead of the four old incremental notices.

## [2026-05-12] mcp | complete_wr | s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-12] Implemented C/C++ native answerability golden/negative suite; Critic validation pending. | s5-answerability-native-golden-set-loop2
- Added answerability-native family and required 10 native cases.
- Focused tests: 14 passed; full S5: 415 passed.

## [2026-05-12] S3 updated handoff/tests and completed consolidated plus superseded S4 WRs | S3 consumed S4 consolidated contract notice
- Updated wiki/canon/handoff/s3/readme.md section 24 for S4 tool-liveness, system-stability gate, and local Quality Gate interpretation.
- Added Analysis Agent regressions for REQUIRED_TOOL_EXECUTION_INCOMPLETE as operational SAST acquisition failure, not negative evidence.
- Recorded session evidence at wiki/canon/handoff/s3/session-s3-s4-consolidated-contract-20260512.md.
- S3 open WR list is empty after completing consolidated and four superseded notices.

## [2026-05-12] mcp | register_wr | s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat
- Registered request WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md

## [2026-05-12] Converted the prior consolidated S4-to-S3 notice into a formal request requiring S3 to align consumers to the current S4 API contract; completed the notice as superseded. | S4-to-S3 API contract alignment request formalized
- Active request: wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md
- Superseded notice completed: wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md
- Request asks S3 to align system-stability handling, staticEvidenceContract readiness consumption, claim boundary handling, and offline Quality Gate interpretation.

## [2026-05-12] Implemented configurable scoring policy v1; Critic validation pending. | s5-scoring-policy-loop3
- Focused tests: 17 passed; full S5: 423 passed.
- Docs updated: knowledge-base API and S5 megagoal context.

## [2026-05-12] S5 Loop 4 serving/re-query contract completed after Critic re-validation | wiki/canon/handoff/s5/session-2026-05-12-s5-serving-requery-loop4.md
- Focused S5 serving/Judge/scoring tests: 17 passed.
- Full services/knowledge-base tests: 430 passed.
- Clean S5-only validation worktree passed focused/full tests, diff-check, and non-S5 status check.
- Critic implementation review PASS after fixes for unknown control keys, identifier normalization, and missing-input fallbackTrace visibility.

## [2026-05-12] S5 Loop 5 durable serving ledger completed after Critic validation | wiki/canon/handoff/s5/session-2026-05-12-s5-serving-ledger-loop5.md
- Added SQLite schema v4 serving_query_run with canonical/decision/trace/score packet fields.
- Judge answers now include servingLedger and record normal plus grounded-unknown paths.
- Focused S5 serving-ledger suite: 29 passed; full services/knowledge-base suite: 435 passed.
- Clean S5-only validation worktree passed focused/full tests, diff-check, and non-S5 status check.
- Critic implementation review PASS.

## [2026-05-12] S5 Loop 6 identity-resolution guardrails completed after Critic re-validation | wiki/canon/handoff/s5/session-2026-05-12-s5-identity-resolution-loop6.md
- Added deterministic identity resolver and explicit s5-identity-resolution-v1 evidence.
- Affectedness now uses hardAffectednessPackageIds only; CPE/product/source-only inputs produce grounded unknown instead of affectedness proof.
- Canonical query and serving ledger preserve cpe, repoUrl, and sourceComponentId identity inputs.
- Focused Loop 6 suite: 33 passed; full services/knowledge-base suite: 444 passed.
- Clean S5-only validation worktree passed import-order, focused/full tests, diff-check, and non-S5 status check.
- Critic implementation review PASS after import-cycle fix.

## [2026-05-12] S5 Loop 7 Threat KB retrieval evidence completed after Critic re-validation | wiki/canon/handoff/s5/session-2026-05-12-s5-threat-retrieval-evidence-loop7.md
- Added ledger-backed s5-threat-retrieval-evidence-v1 under Judge evidence.threatRetrieval.
- Retrieval evidence remains contextual_support_not_affectedness_proof with negativeEvidenceAllowed=false.
- Excluded advisories move to suppressedCandidateEvidence and do not resurrect risk signals as usable evidence.
- Version-present identity-missing unknowns include empty diagnostic threatRetrieval and reasoningPath.
- Weakness/attack semantics are derived from advisory CWE IDs and relation records.
- Focused Loop 7 bundle: 33 passed; full services/knowledge-base suite: 451 passed.
- Clean S5-only validation worktree passed focused/full tests, diff-check, and non-S5 status check.
- Critic implementation review PASS after fixes.

## [2026-05-12] completed | S5 Loop 8 source coverage matrix and cached artifact adapter
- Implemented `source-coverage-matrix-v1` and local cached-artifact adapter for S5 ETL source-family coverage gates.
- Critic plan gate: FAIL -> amended -> PASS.
- Critic implementation gate: FAIL on non-native NPM source-role bypass -> allowlist/regression fix -> PASS.
- Validation: source coverage focused 10 passed; focused integration bundle 51 passed; full S5 suite 461 passed; clean S5-only validation worktree full suite 461 passed.
- No commit/push performed.

## [2026-05-12] completed | S5 Loop 9 typed relation graph and conflict model
- Implemented typed conflict detection for affectedness status/range, opposite relation predicates, and exact alias conflicts.
- Critic plan gate: FAIL -> amended -> PASS.
- Critic implementation gate: FAIL on alias carve-out and missing involvedLedgerRefs -> fixed -> PASS.
- Validation: relation-conflict focused 8 passed; focused integration bundle 53 passed; full S5 suite 469 passed; clean S5-only validation full suite 469 passed.
- No commit/push performed.

## [2026-05-13] Implemented machine-readable Source Code KG producer contract endpoint | S5 Source Code KG producer contract v1
- Added `GET /v1/contracts/source-code-kg` in S5 Knowledge Base to expose producer requirements, JSON Schemas, and S5/S3/S4 ownership guardrails.
- Updated canonical KB API and Source Code KG boundary docs to reference the machine-readable contract.
- This follows the interview decision that S5 owns the Source Code KG API contract while S3/S4 produce source/build graph facts.

## [2026-05-13] S3 aligned Analysis Agent consumers to current S4 staticEvidenceContract API contract and obtained final Critic PASS | s3-s4-api-alignment
- WR: wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md
- Handoff: wiki/canon/handoff/s3/readme.md#25
- Session evidence: wiki/canon/handoff/s3/session-s3-s4-api-alignment-20260513.md
- Verification: focused S3 suite 114 passed; full Analysis Agent suite 639 passed; compile/diff and wiki validation passed.

## [2026-05-13] mcp | complete_wr | s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-13] S3 refreshed S4 API-alignment verification after adding offline qualityGate boundary regression | s3-s4-api-alignment
- Added services/analysis-agent/tests/test_s4_static_evidence.py to prove S4 offline qualityGate split metric status=pass is not runtime staticEvidenceContract readiness.
- Verification: focused related S3 suite 115 passed in 1.43s; full Analysis Agent suite 640 passed in 7.00s; compile/diff and wiki validation/diff passed.
- WR completion note refreshed: wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md

## [2026-05-13] mcp | register_wr | s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro
- Registered request WR for s3, s4
- Path: wiki/canon/work-requests/s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro.md

## [2026-05-13] Registered S5 producer-contract review request | S5 to S3/S4 Source Code KG producer contract review WR
- Registered `wiki/canon/work-requests/s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro.md`.
- The WR asks S3/S4 to review whether current artifacts can map into S5's Source Code KG producer contract v1.

## [2026-05-13] S4 added deterministic Corpus Readiness Gate v1 for tool-portfolio experiment reports | s4-corpus-readiness-gate-v1
- Added standalone offline readiness gate semantics to S4 canonical docs: required corpora, acquisition localPath, safe sourcePath, case existence/checksum, validation/test split readiness.
- Updated S4 API/spec/handoff/roadmap wiki pages to distinguish system stability, decision-grade corpus readiness, and local quality thresholds.
- Critic final review PASS; focused tool-portfolio suite 70 passed in 0.12s; full S4 pytest 648 passed in 24.66s; wiki validation PASS.

## [2026-05-13] S4 hardened Corpus Readiness Gate v1 with standalone CLI and fail-closed empty required-corpora handling | s4-corpus-readiness-cli-fail-closed
- Added offline preflight CLI: python -m benchmark.tool_portfolio_corpus_readiness with manifest/base-path/required-corpus inputs and deterministic JSON output.
- Empty required_corpora now blocks with CORPUS_REQUIRED_CORPORA_NOT_DECLARED instead of becoming decisionGradeReady=true.
- Verification: readiness tests 9 passed in 0.06s; focused tool-portfolio suite 73 passed in 0.14s; full S4 pytest 651 passed in 24.43s; CLI fixture smoke returned blocked LOCAL_JULIET_CORPUS_NOT_PRESENT with exit 2; wiki validation PASS; Critic implementation review PASS.

## [2026-05-13] S4 made Corpus Readiness Gate authoritative during experiment report composition | s4-corpus-readiness-authoritative-report-merge
- Fixed fail-open path where legacy external_corpus_status could make a report appear quality-gate eligible while corpusReadinessGate was not_run.
- Readiness-derived compatibility projection is merged with explicit external_corpus_status and remains authoritative for not_run/blocked readiness.
- Verification: readiness/report tests 19 passed in 0.08s; focused tool-portfolio suite 76 passed in 0.12s; full S4 pytest 654 passed in 23.96s; CLI fixture smoke still blocked LOCAL_JULIET_CORPUS_NOT_PRESENT with exit 2; harness artifact matches builder; Critic re-review PASS.

## [2026-05-13] S4 hardened report-side System Stability Gate required tool handling | s4-system-stability-required-tools-fail-closed
- Empty report-side required tool sets now fail closed with SYSTEM_REQUIRED_TOOLS_NOT_DECLARED.
- Blank/duplicate required tool IDs normalize away; known required tools follow canonical current-six order; unknown required tool IDs fail preflight with REQUIRED_TOOL_UNKNOWN and do not fall through as TOOL_RESULT_NOT_RECORDED.
- Verification: system-stability focused tests 33 passed in 0.04s; focused tool-portfolio suite 79 passed in 0.13s; full S4 pytest 657 passed in 23.89s; wiki validation PASS; Critic implementation review PASS.

## [2026-05-13] S4 prevented report-side systemStabilityGate not_run from producing final quality pass | s4-system-stability-not-run-decision-grade-hardening
- Offline experiment reports now treat systemStabilityGate.status=not_run as not_decision_grade with SYSTEM_STABILITY_GATE_NOT_RUN, preserving local metric evidence without allowing final qualityGate.status=pass.
- Explicit passing system-stability evidence is now required before otherwise passing local quality metrics can produce final quality-gate pass.
- Verification: experiment-report/system-stability focused tests 43 passed in 0.09s; focused tool-portfolio suite 80 passed in 0.14s; full S4 pytest 658 passed in 24.44s; wiki validation PASS; Critic implementation review PASS.

## [2026-05-13] S4 aligned report-side qualityGateAllowed with systemStabilityGate pass-only semantics | s4-system-stability-quality-gate-allowed-invariant
- default_not_run_system_gate now emits qualityGateAllowed=false so qualityGateAllowed=true is reserved for systemStabilityGate.status=pass.
- Regenerated benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json; artifact matches builder with systemStabilityStatus=not_run, qualityGateAllowed=false, qualityGateStatus=not_decision_grade.
- Verification: experiment-report/system-stability focused tests 44 passed in 0.09s; focused tool-portfolio suite 81 passed in 0.13s; full S4 pytest 659 passed in 23.36s; wiki validation PASS; Critic implementation review PASS.

## [2026-05-13] S4 hardened Local Quality Gate requiredSplits threshold configuration | s4-local-quality-required-splits-fail-closed
- Explicit empty or blank-only thresholds.requiredSplits now fails closed with QUALITY_REQUIRED_SPLITS_NOT_DECLARED instead of producing local quality pass by vacuity.
- Required splits now normalize deterministically: blanks dropped, duplicates removed, known splits ordered validation/test/canary, unknown nonblank splits preserved after known and fail through existing SPLIT_METRICS_MISSING behavior unless metrics exist.
- Verification: experiment-report tests 12 passed in 0.08s; experiment-report/system-stability focused tests 46 passed in 0.09s; focused tool-portfolio suite 83 passed in 0.14s; full S4 pytest 661 passed in 23.39s; wiki validation PASS; Critic implementation review PASS.

## [2026-05-13] S4 hardened Local Quality Gate to require at least one threshold criterion | s4-local-quality-threshold-criteria-fail-closed
- Local Quality Gate now fails with QUALITY_THRESHOLDS_NOT_DECLARED when thresholds declare required splits but none of minimumTargetRecall, minimumFindingPrecision, or maximumNegativeTargetFpr are present.
- Existing minimumTargetRecall=0.0 non-decision paths remain valid because zero is treated as a declared threshold criterion.
- Verification: experiment-report tests 13 passed in 0.08s; experiment-report/system-stability focused tests 47 passed in 0.10s; focused tool-portfolio suite 84 passed in 0.13s; full S4 pytest 662 passed in 23.92s; wiki validation PASS; Critic implementation review PASS.

## [2026-05-13] S4 hardened Local Quality Gate threshold value validation | s4-local-quality-threshold-value-validation-fail-closed
- Declared threshold values in offline Tool Portfolio quality reports must now be numeric, finite, and within [0.0, 1.0].
- Invalid threshold values fail closed with QUALITY_THRESHOLD_VALUE_INVALID before split scoring.
- Verification: experiment-report focused tests 17 passed in 0.09s; experiment-report/system-stability focused tests 51 passed in 0.11s; focused tool-portfolio suite 88 passed in 0.16s; full S4 pytest 666 passed in 24.50s; wiki validate PASS; Critic PASS.

## [2026-05-13] S4 hardened Local Quality Gate primary tool-set config validation | s4-local-quality-primary-tool-set-config-validation-fail-closed
- Offline Tool Portfolio quality reports now default primaryToolSetConfig to full-current-six only when absent or null.
- Explicit blank, whitespace, non-string, or unknown primaryToolSetConfig values fail closed with QUALITY_PRIMARY_TOOL_SET_CONFIG_INVALID before split scoring.
- Verification: experiment-report focused tests 23 passed in 0.10s; experiment-report/system-stability focused tests 57 passed in 0.12s; focused tool-portfolio suite 94 passed in 0.17s; full S4 pytest 672 passed in 24.34s; wiki validate PASS; Critic PASS.

## [2026-05-13] S4 hardened System Stability Gate consistency validation | s4-system-stability-gate-consistency-validation-fail-closed
- Offline Tool Portfolio report now normalizes caller-provided systemStabilityGate status/qualityGateAllowed contradictions to fail/blocked.
- Inconsistent gates preserve existing phase evidence and add phases.gateConsistency with SYSTEM_STABILITY_GATE_INCONSISTENT.
- Verification: experiment-report focused tests 26 passed in 0.12s; experiment-report/system-stability focused tests 60 passed in 0.13s; focused tool-portfolio suite 97 passed in 0.19s; full S4 pytest 675 passed in 25.11s; wiki validate PASS; Critic PASS.

## [2026-05-13] implemented | S4 Juliet/SARD corpus acquisition readiness
- Added benchmark/tool_portfolio_corpus_acquisition.py for actual NIST Juliet/SARD archive acquisition, checksum verification, safe extraction, manifest generation, and readiness preflight.
- Actual cache under .omx/corpora/s4-tool-portfolio reports status=available, decisionGradeReady=true, checkedCaseCount=80.
- Full services/sast-runner pytest: 678 passed in 25.60s.

## [2026-05-13] S4 hardened Corpus Readiness Gate consistency validation | s4-corpus-readiness-gate-consistency-validation-fail-closed
- Offline Tool Portfolio report now normalizes caller-provided corpusReadinessGate status/decisionGradeReady/externalCorpusStatus contradictions to blocked/not-decision-grade.
- Inconsistent readiness gates preserve acquisitionStatuses, caseStatuses, and summary evidence, add consistencyChecks, and project requiredCorpusReadiness as blocked with CORPUS_READINESS_GATE_INCONSISTENT.
- Verification: experiment-report focused tests 29 passed in 0.12s; experiment-report/corpus-readiness/system-stability focused tests 74 passed in 0.17s; focused tool-portfolio suite 101 passed in 0.20s; full S4 pytest 681 passed in 24.90s; wiki validate PASS; Critic PASS.

## [2026-05-13] critic_passed | S4 Juliet/SARD corpus acquisition Ralph goal
- Ralph deslop pass completed on changed acquisition files.
- Critic subagent PASS for actual corpus acquisition/readiness objective.
- Full S4 pytest after deslop: 683 passed in 25.39s.

## [2026-05-13] S4 hardened Local Quality Gate thresholds payload shape validation | s4-local-quality-thresholds-payload-shape-validation-fail-closed
- Offline Tool Portfolio report now rejects non-mapping thresholds payloads deterministically with QUALITY_THRESHOLDS_INPUT_INVALID when prerequisites pass.
- System-stability invalid-precondition still dominates if the system gate already fails; invalid thresholds no longer crash the report builder.
- Verification: experiment-report focused tests 33 passed in 0.13s; experiment-report/corpus-readiness/system-stability focused tests 78 passed in 0.17s; focused tool-portfolio suite 105 passed in 0.21s; full S4 pytest 687 passed in 24.88s; wiki validate PASS; Critic PASS.

## [2026-05-13] mcp | register_wr | s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract
- Registered request WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md

## [2026-05-13] S4 hardened Oracle matchingPolicy payload shape validation | s4-oracle-matching-policy-payload-shape-validation-fail-closed
- Offline Tool Portfolio report now rejects non-mapping matchingPolicy payloads deterministically with ORACLE_MATCHING_POLICY_INPUT_INVALID when prerequisites pass.
- Invalid matchingPolicy suppresses oracle-derived scored metrics: split metrics become not_run and portfolioMetrics is blocked; system invalid-precondition still dominates when system stability fails.
- Verification: experiment-report focused tests 37 passed in 0.14s; experiment-report/corpus-readiness/system-stability focused tests 82 passed in 0.17s; focused tool-portfolio suite 109 passed in 0.22s; full S4 pytest 691 passed in 24.85s; wiki validate PASS; Critic PASS.

## [2026-05-13] S4 updated offline Tool Portfolio consumer contract, registered S4→S3 WR, and fixed code-review blockers | s4-tool-portfolio-s3-consumer-contract-and-code-review-fixes
- Registered WR wiki/canon/work-requests/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract.md for S3 consumption alignment.
- Updated S4 API/spec/handoff/roadmap docs with corpusReadinessGate/systemStabilityGate/qualityGate S3 no-negative-evidence semantics.
- Fixed corpus acquisition provenance: existing extraction cache is reused only when prior acquisition manifest matches current archive/tree checksum and local path.
- Fixed held-out split leakage: single SARD candidate is not duplicated into validation/test; corpus manifest rejects same sourceRef/checksum across validation/test.
- Verification: targeted 27 passed, tool-portfolio 123 passed, full S4 695 passed, actual Juliet/SARD readiness remains available with checkedCaseCount=80.

## [2026-05-13] S4 hardened findings_by_config payload and element shape validation | s4-findings-by-config-payload-element-shape-validation-fail-closed
- Offline Tool Portfolio report now rejects invalid findings_by_config payloads deterministically with FINDINGS_BY_CONFIG_INPUT_INVALID when prerequisites pass.
- Validation covers non-mapping payloads, missing required current-six configs, invalid config values, and invalid finding elements; invalid inputs suppress scored-looking split metrics and block portfolioMetrics.
- Critic initially blocked the implementation because missing required configs were silently normalized to empty lists; regression tests were added and the blocker was fixed before final evidence.
- Verification: experiment-report focused tests 48 passed in 0.17s; experiment-report/corpus-readiness/system-stability focused tests 93 passed in 0.21s; focused tool-portfolio suite 121 passed in 0.24s; full S4 pytest 706 passed in 25.62s; wiki validate PASS; Critic re-review PASS.

## [2026-05-13] S4 hardened offline Tool Portfolio systemStabilityGate payload/nested phase validation fail-closed | s4-system-stability-payload-shape-validation-fail-closed
- Caller-provided non-mapping systemStabilityGate payloads now fail closed with SYSTEM_STABILITY_GATE_INPUT_INVALID and sanitized diagnostics.
- status="pass" system gates must prove current-six requiredTools completeness and preflight/executionCompleteness nested pass evidence with empty failures before oracle scoring.
- Minimal fail/not_run gates preserve evidence; inconsistent non-pass gates with malformed phases normalize to SYSTEM_STABILITY_GATE_INCONSISTENT without crashing.
- Production /v1/scan API unchanged; scope limited to services/sast-runner offline Tool Portfolio report path.

## [2026-05-13] mcp | complete_wr | s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-13] mcp | complete_wr | s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro
- Lane s3 completed recipient-side handling
- Status: open

## [2026-05-13] S4 hardened offline Tool Portfolio corpusReadinessGate payload and proof validation fail-closed | s4-corpus-readiness-payload-proof-validation-fail-closed
- Caller-provided corpusReadinessGate payloads now default only when omitted; explicit malformed or forged payloads fail closed with CORPUS_READINESS_GATE_INPUT_INVALID.
- Available readiness now requires proof binding requiredCorpora to acquisitionStatuses, caseStatuses, summary checked/split counts, and externalCorpusStatus acquisitionIds projections.
- Blocked/not_run readiness gates preserve minimal evidence but always project requiredCorpusReadiness from top-level status/reasonCodes so embedded or legacy status cannot suppress blockers.
- Production /v1/scan API unchanged; scope limited to services/sast-runner offline Tool Portfolio report/readiness paths.

## [2026-05-13] S4 separated legacy external_corpus_status context from corpus readiness gating | s4-legacy-external-corpus-status-authority-separation
- Offline Tool Portfolio final qualityGate and requiredFollowUps now consume only the readiness-derived external corpus projection.
- Legacy external_corpus_status remains visible in decisionSupport.externalCorpusStatus as compatibility context, but cannot overblock an authoritative available corpusReadinessGate.
- Blocked/not_run corpusReadinessGate still gates through requiredCorpusReadiness even when legacy context says available.
- Production /v1/scan API unchanged; scope limited to services/sast-runner offline Tool Portfolio report composition.

## [2026-05-13] S4 hardened offline Tool Portfolio matchingPolicy semantic validation fail-closed | s4-matching-policy-semantic-validation-fail-closed
- Offline Tool Portfolio matchingPolicy now canonicalizes valid/minimal payloads to v1 schema with lineWindowDefault=5 and functionFallbackDefault=false.
- Wrong schema, unknown keys, bool/non-int/out-of-range lineWindowDefault, and non-bool functionFallbackDefault fail closed with ORACLE_MATCHING_POLICY_INPUT_INVALID before oracle scoring.
- Invalid matchingPolicy emits sanitized diagnostics only, produces not_run split metrics, blocked portfolioMetrics, and final local quality failure when prerequisites pass.
- Production /v1/scan API unchanged; scope limited to services/sast-runner offline Tool Portfolio report composition.

## [2026-05-13] S4 sanitized offline Tool Portfolio legacy external_corpus_status context | s4-legacy-external-corpus-status-context-sanitation
- Legacy external_corpus_status remains compatibility context only; final qualityGate and requiredFollowUps continue to consume readiness-derived projections.
- Reserved requiredCorpusReadiness, readiness-owned keys, forbidden verdict vocabulary, malformed reasonCodes/acquisitionIds, and invalid statuses are omitted from decisionSupport.externalCorpusStatus.
- Invalid legacy context is reported only through sanitized decisionSupport.legacyExternalCorpusStatusInputValidation failures and does not overblock quality.
- Critic initially blocked raw invalid-status echo and reserved-key skip when readiness owned the key; regression tests were added and the blockers were fixed before re-review PASS.

## [2026-05-13] S4 hardened offline Tool Portfolio report identity/provenance validation fail-closed | s4-report-identity-provenance-validation-fail-closed
- Offline Tool Portfolio runId, createdAt, and phase are now validated before decision-cycle construction and oracle scoring.
- Invalid identity uses safe placeholders in top-level report identity and decisionCycle fields, emits sanitized reportIdentityValidation, and suppresses oracle scoring with REPORT_IDENTITY_INPUT_INVALID.
- Gate precedence is preserved: system precondition blocks remain blocked; corpus readiness not_run/blocked remains not_decision_grade with identity invalidity as context.
- Critic initially blocked trailing-newline runId raw leakage caused by $ anchoring with regex match; regression tests were added and true-end \Z anchoring fixed the bypass.

## [2026-05-13] S4 hardened offline Tool Portfolio decision-cycle threshold JSON-serializability fail-closed | s4-decision-cycle-threshold-json-serializability-fail-closed
- Offline Tool Portfolio thresholds are now checked for JSON-serializability before decision-cycle checksum construction.
- Invalid object/set threshold payloads use deterministic sanitized checksum surrogates and fail local quality with QUALITY_THRESHOLDS_INPUT_INVALID without raw repr, exception text, or container content leakage.
- Metric scoring remains available when only threshold payload validation fails and system/matching/findings prerequisites pass; system failure precedence remains blocked.
- Production /v1/scan API unchanged; scope limited to services/sast-runner offline Tool Portfolio report composition.

## [2026-05-13] Completed S4 Tool Portfolio acquisition-manifest hardening with Critic re-review PASS. | s4 acquisition manifest strict schema/checksum hardening
- Strict acquisition manifest canonicalization now rejects unknown/non-string/non-JSON fields before checksum serialization and accepts optional `sourcePageUrl`/`expectedArchiveChecksum` as checksum-bearing provenance.
- Trusted-cache reuse mismatch on `expectedArchiveChecksum` was regression-tested and fixed.
- Verification: targeted manifest/acquisition suite 28 passed, focused Tool Portfolio suite 230 passed, full S4 pytest 802 passed, wiki validate PASS.
- Updated wiki canon pages for Tool Portfolio spec, S4 handoff, SAST Runner API, and S4 roadmap.

## [2026-05-13] Completed second S4 Tool Portfolio acquisition hardening loop with Critic PASS. | s4 acquisition provenance semantic validation hardening
- downloadedAt exact date/UTC timestamp and calendar validation added.
- sourceUrl preserves http/https/file/local compatibility; sourcePageUrl restricted to http/https; malformed inputs fail closed without raw value echo.
- metadata-only sourcePageUrl/license changes re-pin manifests without re-extracting and preserve pinned downloadedAt when bytes are stable.
- Verification: RED 14 failures reproduced, targeted suites 41/188/252 passed, full S4 pytest 824 passed, wiki validate PASS.

## [2026-05-13] Completed third S4 Tool Portfolio acquisition hardening loop with Critic re-review PASS. | s4 acquisition manifest error-surface sanitation
- Unsafe unknown field keys are redacted as `<unsafe>` on validation/checksum paths while safe labels remain visible.
- Malformed http(s) authorities including hostless, port-only, query/fragment-only, and userinfo-bearing forms are rejected without raw URL echo.
- Compatibility for `local://` S4 fixtures and `file://` local archives is preserved.
- Verification: RED 10 + userinfo RED 2 reproduced, acquisition/report focused gates passed, full S4 pytest 837 passed, wiki validate PASS.

## [2026-05-13] Completed S4 Corpus Readiness path containment hardening with Critic PASS. | s4 corpus readiness relative localPath containment
- Relative acquisition localPath with explicit base must resolve inside base after symlink resolution.
- `../` traversal and symlink escape now block with `LOCAL_CORPUS_PATH_OUTSIDE_BASE` before case checks.
- Absolute localPath compatibility for `.omx` and externally pinned corpora remains supported.
- Verification: RED 2 reproduced, readiness/focused/full S4 gates passed, full S4 pytest 840 passed, wiki validate PASS.

## [2026-05-13] completed | s4 corpus readiness required_corpora projection sanitizer
- Strict required_corpora ID validation added; invalid IDs fail closed with CORPUS_REQUIRED_CORPUS_ID_INVALID without raw echo.
- Safe unknown required corpora now project as generic external with LOCAL_EXTERNAL_* reason codes.
- Caller-provided readiness externalCorpusStatus is sanitized to canonical keys/allowed nested fields/validated acquisition IDs/allowlisted readiness reason codes.
- Verification: readiness/report 161 passed; focused acquisition/corpus/readiness/report/manifest 224 passed; all Tool Portfolio 277 passed; full services/sast-runner pytest 849 passed; Critic re-review PASS; wiki validation PASS.

## [2026-05-13] completed | s4 actual tool portfolio runner
- Added benchmark/tool_portfolio_actual_runner.py and tests/test_tool_portfolio_actual_runner.py.
- Actual runner stages only manifest case files before scanning, emits all required current-six configs, scopes top-level systemStabilityGate to full-current-six executions, and captures required-tool unavailability as blocked report evidence.
- CLI supports --base-path for relative acquisition localPath and Juliet support include resolution.
- Verification: actual-runner tests 7 passed; focused suite 211 passed; all Tool Portfolio tests 284 passed; full services/sast-runner pytest 856 passed; Critic re-review PASS; wiki validation PASS.

## [2026-05-13] S4 Tool Portfolio low-threshold runner-integrity profiles separated from decision-grade quality pass | s4-threshold-profile-hardening
- Added thresholdProfile semantics to offline Tool Portfolio local quality assessment.
- Low/permissive thresholds now emit qualityGate.status=not_decision_grade with QUALITY_THRESHOLDS_NON_DISCRIMINATING.
- Critic BLOCK caught low-threshold/no-finding precision-null misclassification; RED test added and fixed.
- Verification: report+actual tests 153 passed, tool-portfolio tests 287 passed, full S4 pytest 861 passed, actual CLI report-after-threshold-profile.json not_decision_grade, wiki validation PASS.

## [2026-05-13] S4 added diagnostic-only Tool Portfolio quality decomposition | s4-quality-diagnostics-v1
- qualityDiagnostics added to offline s4-tool-portfolio-experiment-report-v1 only; production /v1/scan unchanged.
- Critic BLOCKed ambiguous unit plan; revised targetOutcome/findingPressure/matchAttempt plan passed.
- Verification: report+actual tests 160 passed, all Tool Portfolio tests 294 passed, full S4 pytest 868 passed, actual report-after-diagnostics.json generated, wiki validation PASS.

## [2026-05-13] S4 added deterministic diagnostic triage candidate lanes to Tool Portfolio qualityDiagnostics | s4-diagnostic-triage
- Critic BLOCK resolved raw-pressure/noise-trigger ambiguity and overclaiming category names.
- Triage candidates are diagnostic-only local investigation lanes, not root cause or verdicts.
- Verification: triage tests 6 passed, report+actual tests 164 passed, Tool Portfolio tests 298 passed, full S4 pytest 872 passed, actual report-after-triage.json generated, wiki validation PASS.

## [2026-05-13] S4 added deterministic Tool Contribution Diagnostics v1 to offline Tool Portfolio reports | s4-tool-contribution-diagnostics-v1
- toolContributionDiagnostics is additive and diagnostic-only; production /v1/scan unchanged.
- Comparative config failures now produce not_run with TOOL_CONTRIBUTION_COMPARATIVE_CONFIG_INCOMPLETE instead of fake zero-signal rows.
- Verification: contribution tests 7 passed; report+actual tests 171 passed; all Tool Portfolio tests 305 passed; full services/sast-runner pytest 879 passed; actual report-after-tool-contribution.json generated; Critic PASS; wiki validation PASS.

## [2026-05-13] S4 fixed actual runner staged localPath canonicalization for relative work dirs | s4-actual-runner-stage-path-canonicalization
- Relative CLI --work-dir previously left staged acquisition localPath relative, causing false LOCAL_CORPUS_BASE_PATH_REQUIRED readiness blocks after staging/scanning.
- Staged acquisition localPath values now emit absolute resolved paths while preserving staged-cases delete guard.
- Verification: RED 2 reproduced, actual-runner tests 11 passed, report+actual tests 173 passed, all Tool Portfolio tests 307 passed, full services/sast-runner pytest 881 passed, actual report-after-stage-path-fix.json generated, Critic PASS, wiki validation PASS.

## [2026-05-13] S4 locked committed harness report artifact against deterministic generator drift | s4-harness-report-snapshot-drift-guard
- Committed s4-harness-fixture-report-v1.json now exactly matches build_harness_fixture_report output and includes qualityDiagnostics/toolContributionDiagnostics.
- Added exact committed-vs-generated equality test plus readable diagnostics/gate assertions.
- Verification: RED 2 reproduced, focused snapshot tests 2 passed, report+actual tests 174 passed, all Tool Portfolio tests 308 passed, full services/sast-runner pytest 882 passed, Critic PASS, wiki validation PASS.

## [2026-05-13] S4 removed stale same-schema Tool Portfolio experiment report artifact | s4-stale-experiment-report-artifact-guard
- Deleted tracked stale s4-harness-fixture-20260512T042442Z.json, which used experiment-report-v1 schema but lacked current diagnostics/gate shape.
- Added guard allowing only canonical s4-harness-fixture-report-v1.json to use experiment-report-v1 schema under benchmark/results/tool_portfolio; operational battery schemas remain allowed.
- Verification: RED offender reproduced, focused canonical artifact tests 3 passed, report+actual tests 175 passed, all Tool Portfolio tests 309 passed, full services/sast-runner pytest 883 passed, Critic PASS, wiki validation PASS.

## [2026-05-13] completed | s4-tool-portfolio-report-consumer-canary
- Added S4-owned pure JSON consumer canary for offline Tool Portfolio reports.
- All projected strings are allowlisted; unsafe projection sets `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and forces `toolPortfolioDecisionGradeUsable=false`.
- Verification: canary 9 passed; report+actual 184 passed; Tool Portfolio 318 passed; full S4 892 passed; Critic PASS; wiki validation PASS.

## [2026-05-13] completed | s4-tool-portfolio-report-consumer-cli-smoke
- Added module CLI smoke gate to S4 Tool Portfolio report consumer canary.
- Exit semantics: 0 summary/gate pass, 2 summary emitted but required decision-grade failed, 1 no summary emitted due input/JSON syntax failure.
- Verification: canary 15 passed; report+actual 190 passed; Tool Portfolio 324 passed; full S4 898 passed; Critic PASS; wiki validation PASS.

## [2026-05-13] completed | s4-tool-portfolio-report-consumer-cli-fail-closed
- Hardened Tool Portfolio report consumer CLI default mode: parsed invalid summaries with `reportPresent=false` now exit 2.
- Valid non-decision-grade reports still default exit 0; require-decision-grade failures exit 2; no-summary input failures exit 1.
- Verification: canary 18 passed; report+actual 193 passed; Tool Portfolio 327 passed; full S4 901 passed; Critic PASS; wiki validation PASS.

## [2026-05-13] completed | s4-tool-portfolio-report-consumer-summary-schema
- Added `summarySchemaVersion=s4-tool-portfolio-report-consumer-summary-v1` to Tool Portfolio report consumer summaries.
- Exact top-level summary key tests now guard against accidental future raw-field additions.
- Verification: canary 18 passed; report+actual 193 passed; Tool Portfolio 327 passed; full S4 901 passed; Critic PASS; wiki validation PASS.

## [2026-05-13] completed | s4-tool-portfolio-consumer-summary-snapshot
- Added committed consumer summary artifact for canonical Tool Portfolio harness report.
- Stale report guard now allows only the exact matching versioned consumer summary artifact and still rejects extra experiment reports.
- Verification: consumer 20 passed; report+actual 195 passed; Tool Portfolio 329 passed; full S4 903 passed; Critic PASS; wiki validation PASS.

## [2026-05-14] completed | s4 tool portfolio consumer-summary stale artifact guard
- Added S4 test guard for summary-schema artifacts under services/sast-runner/benchmark/results/tool_portfolio.
- Allowed only canonical s4-harness-fixture-consumer-summary-v1.json with parsed JSON exact-match to generated summary.
- Verification: 22 focused canary tests, 197 report+actual tests, 331 Tool Portfolio tests, 905 full S4 tests, Critic PASS, wiki validation PASS.

## [2026-05-14] completed | s4 tool portfolio diagnostic identifier fail-closed canary
- Hardened offline Tool Portfolio consumer summary to mark malformed/unknown projected diagnostic identifiers unsafe instead of silently dropping them while preserving decision-grade usability.
- Verification: RED reproduced, 23 focused canary tests, 198 report+actual tests, 332 Tool Portfolio tests, 906 full S4 tests, Critic PASS.

## [2026-05-14] completed | s4 tool portfolio byCweTool diagnostic matrix
- Added score-row-scoped qualityDiagnostics.splitDiagnostics[*].byCweTool for expected-CWE/tool/match-class decomposition.
- Critic BLOCK corrected initial overclaim plan; final matrix excludes per-tool FN/recall/precision/raw pressure and keeps portfolio misses/raw pressure in existing byCwe/byTool surfaces.
- Verification: RED reproduced, 199 report+canary+actual tests, 333 Tool Portfolio tests, 907 full S4 tests, Critic PASS.

## [2026-05-14] completed | s4 tool portfolio findings_by_config tool identity validation
- Required current-six findings now validate tool identity and config membership before scoring.
- Unknown/missing/non-string/blank tool IDs, single-tool mismatch, and leave-one-out excluded-tool contamination fail closed through FINDINGS_BY_CONFIG_INPUT_INVALID without raw unknown tool echo.
- Verification: RED reproduced, 204 report+canary+actual tests, 338 Tool Portfolio tests, 912 full S4 tests, Critic PASS.

## [2026-05-14] contract-doc-sync | S5 Source KG endpoint error taxonomy split
- S5 split Source Code KG machine-readable endpoint errors between /v1/source-code-kg/ingest and /v1/source-code-kg/context.
- Tests: targeted TDD GREEN 2 passed in 1.91s; focused Source KG/Judge contract suite 38 passed in 49.25s; full S5 suite 523 passed in 277.25s.
- Wiki API contract updated to prevent consumers from treating no_context_selector as an ingest error or graph-edge reference validation as a context error.

## [2026-05-14] completed | s4 tool portfolio mapping finding payload validation
- Mapping findings in required current-six findings_by_config now validate rule/location/file/line/metadata/dataFlow before scoring and canonicalize valid top-level file/line into location.
- Malformed payloads fail closed through FINDINGS_BY_CONFIG_INPUT_INVALID without raw value echo.
- Verification: RED reproduced oracle matcher crash, 210 report+canary+actual tests, 344 Tool Portfolio tests, 918 full S4 tests, Critic PASS.

## [2026-05-14] evaluation-hardening | S5 Retrieval Quality Lab live Judge observation gate
- S5 added live Judge retrieval observation extraction/validation for Retrieval Quality Lab golden cases.
- The lab now validates affectedness-first topK and multi-source alias fusion against actual build_judge_answer() outputs, not only static manifest entries.
- Tests: TDD GREEN 1 passed in 2.63s; focused retrieval suite 25 passed in 50.67s; full S5 suite 524 passed in 274.48s.

## [2026-05-14] retrieval-explainability-hardening | S5 Threat Retrieval candidate-pool preview trace
- S5 added bounded retrievalTrace.candidatePoolPreview to explain topK capping decisions without expanding final candidateEvidence.
- Preview entries expose candidatePoolRank, returned flag, outside_final_top_k reason, retrieval methods, score breakdown, and rerank score; Judge validation now checks preview consistency.
- Tests: TDD GREEN 2 passed in 4.97s; focused Judge/Threat Retrieval suite 43 passed in 97.36s; full S5 suite 526 passed in 274.01s.

## [2026-05-13] S4 hardened Tool Portfolio corpus sourcePath validation and readiness unsafe-path semantics | s4 corpus sourcePath safety validation
- Strict manifest/report paths reject blank, absolute, Windows drive/UNC absolute, and slash/backslash traversal sourcePath values without raw unsafe value echo.
- Corpus Readiness preserves deterministic blocked JSON with CORPUS_CASE_SOURCE_PATH_UNSAFE for the same normalized unsafe paths, including literal backslash filenames that exist and checksum-match.
- Verification: targeted sourcePath tests 16 passed; focused manifest/report/readiness/canary/actual 253 passed; all Tool Portfolio tests 360 passed; full S4 pytest 934 passed; Critic PASS.

## [2026-05-13] S4 aligned actual-runner staging with Corpus Readiness relative localPath policy | s4 actual-runner relative localPath fail-closed
- Direct stage_case_only_corpus no longer resolves relative acquisition localPath against process cwd; it requires explicit base_path for relative corpus roots.
- build_actual_tool_portfolio_report remains user-facing readiness-blocked/no-scan with LOCAL_CORPUS_BASE_PATH_REQUIRED when relative localPath lacks base.
- Verification: targeted actual-runner tests 3 passed; focused actual/readiness/manifest/report 232 passed; all Tool Portfolio tests 362 passed; full S4 pytest 936 passed; Critic PASS.

## [2026-05-14] contract-hardening | S5 Judge contract candidate-pool preview policy
- S5 advertised retrievalTrace.candidatePoolPreview in the machine-readable Judge contract under answer.threatRetrievalPolicies.candidatePoolPreview.
- Tests: TDD GREEN 1 passed in 1.62s; focused Judge/Threat Retrieval suite 29 passed in 70.72s; full S5 suite 526 passed in 466.35s.

## [2026-05-13] S4 redacted unsafe source paths from Corpus Readiness blocked JSON | s4 corpus readiness unsafe sourcePath redaction
- Unsafe case statuses now emit sourcePath='<unsafe>' and sourcePathStatus='unsafe' instead of raw absolute/traversal/Windows/UNC paths.
- Safe relative sourcePath evidence remains visible for missing/checksum/available statuses.
- Verification: targeted readiness redaction/backslash/missing tests 12 passed; focused readiness/manifest/report/actual/canary 261 passed; all Tool Portfolio tests 368 passed; full S4 pytest 942 passed; Critic PASS.

## [2026-05-13] S4 sanitized Corpus Readiness CLI invalid-output error surface | s4 corpus readiness CLI invalid-error sanitization
- Offline readiness CLI invalid JSON now emits fixed error='input validation failed' plus safe errorClass instead of raw str(exc).
- Prevents secret-bearing manifest paths from leaking through invalid contract JSON.
- Verification: targeted CLI tests 3 passed; focused readiness/manifest/report/actual/canary 262 passed; all Tool Portfolio tests 369 passed; full S4 pytest 943 passed; Critic PASS.

## [2026-05-13] S4 made Corpus Readiness CLI output write failures deterministic and sanitized | s4 corpus readiness CLI output-write fallback
- When --output cannot be written, the CLI now returns exit 1 and emits sanitized invalid JSON to stdout.
- The new allowlisted reason is CORPUS_READINESS_OUTPUT_WRITE_FAILED with fixed error='output write failed' and safe errorClass.
- Verification: targeted CLI tests 4 passed; focused readiness/manifest/report/actual/canary 263 passed; all Tool Portfolio tests 370 passed; full S4 pytest 944 passed; Critic PASS.

## [2026-05-14] critic-review-closure | S5 Critic P1 trust fixes
- Closed Critic P1: Judge Source KG explicit-ID order now preserves caller order in evidence/source context resolution while canonical identity can remain sorted.
- Closed Critic P1: conflict_record writes are content-stable no-ops when unchanged, and conflicts are recorded before revision-scoped decision cache lookup, stabilizing cacheRevisionHash and cache hits under conflict-bearing queries.
- Tests: P1 GREEN 2 passed in 7.69s; focused Judge/serving/relation/API suite 41 passed in 128.29s; full S5 suite 528 passed in 426.77s.

## [2026-05-13] S4 removed host-local paths from Corpus Readiness case and acquisition statuses | s4 corpus readiness local filesystem path redaction
- caseStatuses no longer expose resolvedPath; acquisitionStatuses no longer expose localPath or resolvedLocalPath.
- Machine evidence is preserved through resolvedPathStatus, localPathStatus, resolvedLocalPathStatus, safe relative sourcePath, checksums, manifestChecksum, counts, splits, and reasonCodes.
- Verification: targeted path-redaction tests 4 passed; focused readiness/actual/manifest/report/canary 263 passed; all Tool Portfolio tests 370 passed; full S4 pytest 944 passed; Critic PASS.

## [2026-05-13] S4 made missing acquisition statuses use the same sanitized path-status shape | s4 corpus readiness missing-acquisition status consistency
- Absent acquisition statuses now include localPathStatus='not_declared' and resolvedLocalPathStatus='not_resolved'.
- Canonical harness fixture regenerated and drift-guarded after additive readiness status fields.
- Verification: targeted missing-acquisition + harness drift tests 2 passed; focused readiness/actual/manifest/report/canary 263 passed; all Tool Portfolio tests 370 passed; full S4 pytest 944 passed; Critic PASS.

## [2026-05-14] source-kg-trust-hardening | S5 Source KG out-of-lineage row redaction
- Closed Critic P2: Source KG direct context and Judge evidence no longer return explicit graph/snippet/rich-IR rows outside the requested lineage.
- Out-of-lineage IDs still emit SOURCE_KG_CONTEXT_INCONSISTENT and now appear as missingIds, avoiding chimera context while preserving diagnostics.
- Tests: TDD GREEN 2 passed in 4.39s; focused Source KG/Judge suite 37 passed in 55.21s; full S5 suite 529 passed in 292.59s.

## [2026-05-14] completed | S4 Corpus Readiness status-field enum contract hardening
- Exported and freeze-tested readiness status vocabularies for localPathStatus, resolvedLocalPathStatus, resolvedPathStatus, and sourcePathStatus.
- Representative readiness gates now assert emitted status values are allowlisted while raw host-local path fields remain absent.
- Verification: targeted enum tests 2 passed; focused S4 readiness/actual/manifest/report/canary tests 265 passed; all Tool Portfolio tests 372 passed; full S4 pytest 946 passed; Critic PASS.

## [2026-05-14] contract-hardening | S5 Source KG ingest reference error taxonomy
- Closed Critic P2: Source KG ingest endpoint error taxonomy now includes graph_node_references_unknown_evidence_snippet for dangling graph-node evidenceSnippetId references.
- The API regression verifies the dangling snippet reference returns a 422 S5 error envelope and leaves graph nodes unwritten.
- Tests: TDD GREEN 2 passed in 2.29s; focused Source KG suite 23 passed in 23.84s; full S5 suite 530 passed in 314.62s.

## [2026-05-14] contract-hardening | S5 Source KG redaction policy contract
- S5 added servingContextResolution.outOfLineageCollectionPolicy to the Source Code KG machine-readable contract.
- The contract now advertises SOURCE_KG_CONTEXT_INCONSISTENT diagnostics, returned-row redaction, missingIds reporting, and outOfLineageRowsMayBeReturned=false for explicit out-of-lineage collection IDs.
- Tests: TDD GREEN 1 passed in 1.41s; focused Source KG/Judge suite 34 passed in 42.11s; full S5 suite 530 passed in 268.31s.

## [2026-05-14] completed | S4 Corpus Readiness report-side status/path validation hardening
- Caller-provided offline corpusReadinessGate payloads now reject raw host path fields, non-allowlisted status values, missing available path proof, contradictory available+unsafe status, unsafe sourcePath, and extra-acquisition raw path bypasses before report emission.
- Verification: targeted status/path tests 6 passed; focused readiness/report/actual/manifest/canary tests 271 passed; all Tool Portfolio tests 378 passed; full S4 pytest 952 passed; Critic PASS after BLOCKER fixes.

## [2026-05-14] source-kg-trust-hardening | S5 Source KG missing-container redaction
- S5 now redacts explicit Source KG rows supplied under requested-but-missing repository/analysis containers, diagnosing SOURCE_KG_CONTEXT_INCONSISTENT and reporting the IDs as missingIds.
- The Source KG machine-readable contract advertises missingRequestedContainerRowsMayBeReturned=false.
- Tests: TDD GREEN 3 passed in 4.68s; focused Source KG/Judge suite 36 passed in 46.17s; full S5 suite 532 passed in 281.88s.

## [2026-05-14] completed | S4 report-side top-level gate status diagnostic sanitization
- Caller-provided invalid systemStabilityGate.status and corpusReadinessGate.status no longer echo arbitrary strings or stringify non-string objects in input-validation diagnostics.
- Verification: targeted status-sanitization tests 6 passed; focused report/readiness/actual/manifest/canary/system-stability tests 309 passed; all Tool Portfolio tests 382 passed; full S4 pytest 956 passed; Critic PASS.

## [2026-05-14] completed | S4 System Stability nested pass-evidence diagnostic sanitization
- Caller-provided requiredTools[] and phases.*.status invalid values no longer echo arbitrary strings or stringify objects in report input-validation diagnostics.
- Verification: targeted nested system diagnostics 7 passed; focused report/system/readiness/actual/manifest/canary tests 313 passed; all Tool Portfolio tests 386 passed; full S4 pytest 960 passed; Critic PASS.

## [2026-05-14] completed | S4 legacy external_corpus_status invalid diagnostic sanitization
- Invalid legacy compatibility-context diagnostics no longer echo or stringify arbitrary top-level keys or unknown nested field labels.
- Verification: targeted legacy diagnostics 7 passed; focused report/consumer/readiness/actual/manifest/system tests 317 passed; all Tool Portfolio tests 390 passed; full S4 pytest 964 passed; Critic PASS.

## [2026-05-14] critic-review-closure | S5 Critic round-2 P1 trust fixes
- Closed Critic P1: Threat Retrieval exclude suppression now matches internal advisory IDs as well as external IDs/aliases; validator rejects excluded candidate/equivalent/risk/preview rows.
- Closed Critic P1: missing-input grounded-unknown Judge answers now expose cacheScope=ledger, cacheScopeHash, and cacheRevisionHash; validator rejects missing cache trace scope/revision fields.
- Tests: P1 targeted GREEN 2 passed in 7.74s and 2 passed in 5.23s; focused Judge/Threat Retrieval suite 56 passed in 130.22s; full S5 suite 534 passed in 289.15s.

## [2026-05-14] completed | S4 matchingPolicy invalid diagnostic sanitization
- Invalid oracle matchingPolicy diagnostics no longer echo or stringify arbitrary unknown keys, schemaVersion values, or out-of-range lineWindow values.
- Verification: targeted matchingPolicy diagnostics 7 passed; focused report/oracle/canary/readiness/actual/manifest tests 296 passed; all Tool Portfolio tests 393 passed; full S4 pytest 967 passed; Critic PASS.

## [2026-05-14] contract-runtime-alignment | S5 Source KG runtime error reason taxonomy
- Closed Critic P2: Source KG runtime 422 envelopes now expose errorDetail.reason matching the machine-readable endpoint error taxonomy while preserving code=INVALID_INPUT.
- Covered reasons: request_schema_invalid, no_context_selector, graph_node_references_unknown_evidence_snippet, graph_edge_references_unknown_node.
- Tests: TDD GREEN 4 passed in 3.42s; focused Source KG/API suite 31 passed in 26.44s; full S5 suite 534 passed in 281.49s.

## [2026-05-14] completed | S4 Tool Portfolio threshold diagnostic sanitization
- Offline Tool Portfolio local-quality diagnostics/snapshots no longer echo arbitrary threshold config keys/values: unknown primaryToolSetConfig values are <invalid>, unknown threshold keys are omitted, invalid threshold values are redacted, requiredSplits invalid entries become <invalid>, and non-JSON threshold diagnostic key paths sanitize unknown mapping keys.
- Critic initially BLOCKED plan until requiredSplits raw echo and invalid-primary precedence branches were covered; final implementation review PASS.
- Verification: targeted RED/PASS selector 10 passed, experiment-report 207 passed, focused report/oracle/canary/readiness/actual/manifest 305 passed, all Tool Portfolio/evidence 414 passed, full services/sast-runner pytest 976 passed in 25.52s.

## [2026-05-14] response-bloat-hardening | S5 equivalent advisory fusion cap
- S5 bounded Threat Retrieval equivalentAdvisories to 16 visible entries while preserving equivalentAdvisoryCount as total and adding equivalentAdvisoryLimit/equivalentAdvisoriesTruncated metadata.
- Judge validator now checks equivalent advisory count, limit, truncation, source-kind consistency under truncation, and authority.
- Tests: TDD GREEN 2 passed in 5.11s; focused Threat Retrieval/Judge suite 37 passed in 83.45s; full S5 suite 535 passed in 286.42s.

## [2026-05-14] completed | S4 Tool Portfolio requiredSplits invalid reason
- Offline Tool Portfolio local quality now emits QUALITY_REQUIRED_SPLITS_INVALID for unknown/non-string/malformed thresholds.requiredSplits entries instead of SPLIT_METRICS_MISSING.
- Invalid requiredSplits skip split scoring and preserve empty splitAssessments/passingSplits/failingSplits; empty/blank-only requiredSplits remain QUALITY_REQUIRED_SPLITS_NOT_DECLARED.
- Verification: RED reproduced 4 pseudo-split failures; targeted tests 6 passed, report+consumer 232 passed, focused suite 307 passed, all Tool Portfolio/evidence 416 passed, full services/sast-runner pytest 978 passed in 24.76s; Critic PASS.

## [2026-05-14] completed | S4 Tool Portfolio consumer canary invalid requiredSplits reason guard
- Added explicit offline report consumer canary regression for QUALITY_REQUIRED_SPLITS_INVALID.
- The summary must project the reason as a safe non-decision-grade quality failure, not TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION.
- Verification: targeted consumer canary 1 passed, report+consumer 233 passed, all Tool Portfolio/evidence 417 passed, full services/sast-runner pytest 979 passed in 25.20s; Critic PASS.

## [2026-05-14] S5 closed Source KG/Judge rich IR payload response-bloat hardening | s5 rich IR payload truncation policy
- Large inline rich IR payloads now return payload=null with payloadByteLength, payloadMaxInlineBytes, payloadTruncated=true, and payloadRedacted=true while preserving richIrArtifactId/artifactKind/checksum/URI/provenance.
- Machine-readable Source KG contract exposes servingContextResolution.richIrPayloadPolicy; canonical Knowledge Base API docs updated first in wiki canon.
- Verification: targeted RED/GREEN, focused 38 passed in 49.60s, full knowledge-base suite 537 passed in 288.96s, sqlite ledger restored, diff checks clean.

## [2026-05-14] S5 closed Judge rich IR redaction invariant validation | s5 judge rich IR privacy validator
- validate_judge_answer now emits SOURCE_KG_RICH_IR_PAYLOAD_REDACTION_INVALID when a redacted/truncated rich IR artifact still carries payload content, lacks truncation/redaction flags, or has inconsistent payload size metadata.
- Critic P1 rich IR privacy validator finding is closed in the current working tree.
- Verification: targeted RED/GREEN, focused 38 passed in 92.43s, full knowledge-base suite 537 passed in 345.01s, sqlite ledger restored, diff checks clean.

## [2026-05-14] S5 closed Source KG runtime transport error reason taxonomy gap | s5 source kg transport error reason taxonomy
- Source KG ingest/context runtime error envelopes now expose contract reasons for missing/invalid timeout headers, uninitialized ledger, and endpoint-specific deadline exceeded paths.
- Canonical Knowledge Base API docs note that Source KG advertised transport and validation failures are machine-handleable via errorDetail.reason.
- Verification: targeted RED/GREEN, focused Source KG suite 27 passed in 16.78s, full knowledge-base suite 539 passed in 292.56s, sqlite ledger restored, diff checks clean.

## [2026-05-14] S5 closed Source KG explicit selector response-bloat guardrail | s5 source kg explicit selector limit policy
- Direct Source KG context requests now cap explicit graphNodeIds at 256, evidenceSnippetIds at 256, and richIrArtifactIds at 128 via request schema maxItems.
- Over-limit requests fail before ledger lookup with errorDetail.reason=explicit_selector_limit_exceeded, preventing giant SQL placeholder lists and missingIds echoes.
- Machine-readable Source KG contract and canonical Knowledge Base API docs expose servingContextResolution.explicitSelectorLimitPolicy.
- Verification: targeted RED/GREEN, focused 41 passed in 46.99s, full knowledge-base suite 540 passed in 292.43s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | S4 systemStabilityGate full non-pass input sanitization
- Caller-provided offline systemStabilityGate now rejects unknown top-level fields, invalid schema/reason/requiredTools/phase failure evidence without raw echo.
- Accepted non-pass minimal/subset/generated-empty requiredTools evidence remains compatible; pass gates still require complete current-six proof.
- Version and expectedExecutablePath failure evidence are redacted to status-only fields; normalized inconsistent gates are re-ingestable.
- Verification: full services/sast-runner pytest 994 passed in 24.87s; Critic PASS.

## [2026-05-14] S5 closed Source KG source snippet response-bloat guardrail | s5 source kg snippet text truncation policy
- Source KG/Judge evidence snippets now cap routine snippetText at 2048 UTF-8 bytes while preserving snippetTextByteLength, snippetTextMaxInlineBytes, snippetTextTruncated, checksum, line range, and provenance.
- Judge validator now rejects tampered answers whose visible snippetText exceeds the declared inline cap.
- Machine-readable Source KG contract and canonical Knowledge Base API docs expose servingContextResolution.sourceSnippetTextPolicy.
- Verification: targeted RED/GREEN, focused 43 passed in 49.43s, full knowledge-base suite 542 passed in 303.50s, sqlite ledger restored, diff checks clean.

## [2026-05-14] S4 corpus readiness full caller-provided input sanitization completed | S4 Tool Portfolio Experiment Report
- Strict corpusReadinessGate top-level allowlist and forbidden caller inputValidation
- Field-aware nested validation/projection for summary, acquisitionStatuses, caseStatuses, requiredCorpusInputValidation, and consistencyChecks
- No raw gate preservation through {**gate}; generated invalid required-corpus and inconsistent-gate shapes remain re-ingestable
- Verification: focused 13 passed; experiment-report 237 passed; full S4 1007 passed in 25.13s; Critic PASS

## [2026-05-14] S5 closed Threat Retrieval aggregate equivalent advisory response-bloat guardrail | s5 judge equivalent advisory aggregate response budget
- Threat Retrieval now caps returned equivalentAdvisories across the whole Judge packet at 64, in addition to the per-candidate cap, and reports equivalentAdvisoryReturnedCount, equivalentAdvisoryResponseLimit, and equivalentAdvisoryResponseTruncated in retrievalTrace.
- Judge validator rejects equivalent advisory response budget count/limit/truncation mismatches.
- GET /v1/contracts/judge and canonical Knowledge Base API docs expose answer.threatRetrievalPolicies.equivalentAdvisoryResponseBudget.
- Verification: targeted RED/GREEN, focused 48 passed in 120.78s, full knowledge-base suite 544 passed in 299.64s, sqlite ledger restored, diff checks clean.

## [2026-05-14] S4 corpus manifest case checksum strictness completed | S4 Tool Portfolio Corpus Manifest / Corpus Readiness
- Case checksum validation now requires exact sha256:<64 lowercase hex>
- Malformed prefix-valid checksums are rejected before Corpus Readiness expectedChecksum projection
- CLI invalid payload remains sanitized with CORPUS_READINESS_INPUT_INVALID
- Verification: targeted 6 passed; manifest+readiness 58 passed; related Tool Portfolio 376 passed; full S4 1013 passed in 25.22s; Critic PASS

## [2026-05-14] S5 closed ETL lsof-unavailable lock-check gap | s5 etl qdrant lock fail-closed guard
- scripts/knowledge-base/etl-build.sh now fails closed when Qdrant .lock exists but lsof is unavailable, instead of silently proceeding with an unverifiable lock state.
- Existing held-lock behavior remains: if lsof reports the lock file in use, the script exits and instructs the operator to stop KB first.
- Verification: targeted RED/GREEN, script contract suite 4 passed in 0.01s, full knowledge-base suite 545 passed in 295.84s, sqlite ledger restored, diff checks clean.

## [2026-05-14] S4 corpus manifest forbidden-key error-surface sanitization completed | S4 Tool Portfolio Corpus Manifest
- Recursive forbidden verdict-key validation now sanitizes parent mapping path components
- Forbidden key objects equal to fixed verdict keys are canonicalized before formatting
- Verification: targeted forbidden-key 4 passed; manifest+readiness 61 passed; related Tool Portfolio 379 passed; full S4 1016 passed in 25.07s; Critic PASS after initial BLOCK

## [2026-05-14] completed | S4 corpus manifest identity-field error-surface sanitization
- S4 hardened offline Tool Portfolio corpus manifest public identifiers: caseId, expected.targetId, explicit lineageId, and external acquisitionId now use strict safe-id validation.
- Duplicate caseId, lineage leakage, source-artifact leakage, missing acquisition, and acquisition checksum mismatch diagnostics are value-free; absent public lineage falls back to caseId instead of sourceRef.
- Verification: targeted identity/error-surface tests 10 passed; manifest+readiness 71 passed; related Tool Portfolio 389 passed; full services/sast-runner pytest 1026 passed in 24.78s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] S5 closed Threat Retrieval risk signal response-bloat guardrail | s5 judge risk signal response budget
- Threat Retrieval now caps riskSignals at 32 per Judge packet and reports riskSignalTotalCount, riskSignalReturnedCount, riskSignalResponseLimit, and riskSignalResponseTruncated in retrievalTrace.
- Judge validator rejects risk signal budget count/limit/truncation mismatches.
- GET /v1/contracts/judge and canonical Knowledge Base API docs expose answer.threatRetrievalPolicies.riskSignalResponseBudget.
- Verification: targeted RED/GREEN, focused 50 passed in 117.75s, full knowledge-base suite 547 passed in 304.32s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | S4 experiment report forbidden-key guard error-surface sanitization
- Final offline Tool Portfolio report forbidden verdict-key guard now canonicalizes fixed literals and redacts arbitrary mapping path labels/object stringification.
- This is a last-defense invariant for future generated report regressions; valid report generation remains clean.
- Verification: RED reproduced 3 guard leaks; targeted guard tests 3 passed; experiment-report tests 240 passed; related Tool Portfolio 392 passed; full services/sast-runner pytest 1029 passed in 25.31s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] completed | S4 acquisition manifest duplicate acquisitionId error-surface sanitization
- `build_acquisition_index()` duplicate acquisitionId diagnostics are now value-free while preserving the stable duplicate category.
- Verification: RED reproduced safe-shaped secret duplicate ID leakage; targeted duplicate test 1 passed; acquisition manifest tests 45 passed; related Tool Portfolio 393 passed; full services/sast-runner pytest 1030 passed in 25.07s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] S5 closed Judge Source KG selector bloat guardrail | s5 judge source context selector caps
- Judge sourceContext.graphNodeIds/evidenceSnippetIds/richIrArtifactIds now share Source KG explicit selector caps of 256/256/128 and expose those maxItems in GET /v1/contracts/judge request JSON schema.
- /v1/judge/query rejects over-limit sourceContext selectors before ledger lookup with errorDetail.reason=explicit_selector_limit_exceeded.
- Canonical Knowledge Base API docs updated with Judge Source KG selector limit policy.
- Verification: targeted RED/GREEN, focused 37 passed in 31.06s, full knowledge-base suite 548 passed in 307.39s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | S4 corpus acquisition local path/error-surface sanitization
- Corpus acquisition zip-member, outside-cache deletion, and checksum-mismatch diagnostics are now value-free stable categories.
- Local paths, archive member names, expected checksums, and actual checksums are no longer echoed on those acquisition helper failure paths.
- Verification: RED reproduced 3 acquisition helper raw-echo failures; targeted helper tests 3 passed; corpus acquisition tests 13 passed; related Tool Portfolio 406 passed; full services/sast-runner pytest 1033 passed in 25.46s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] completed | S4 decision-cycle forbidden runtime coupling guard error-surface sanitization
- The static no-network/no-LLM/no-S5 coupling guard now raises value-free diagnostics.
- Host-local file paths and raw regex internals are no longer echoed when forbidden coupling is detected.
- Verification: RED reproduced secret path + regex leakage; targeted guard test 1 passed; decision-cycle tests 4 passed; related Tool Portfolio 410 passed; full services/sast-runner pytest 1034 passed in 25.49s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] completed | S4 tool-set config validator error-surface sanitization
- `validate_tool_set_config()` now rejects invalid/non-string tool-set configs with value-free diagnostics.
- Unknown current-tool, disabled future config, unknown config, and non-string config errors no longer echo submitted values; valid current-six and `allow_future=True` success behavior remains unchanged.
- Verification: RED reproduced 5 invalid-config echo/type failures; targeted config tests 6 passed; experiment manifest tests 41 passed; related Tool Portfolio 415 passed; full services/sast-runner pytest 1039 passed in 25.23s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] S5 closed Threat Retrieval suppressed candidate response-bloat guardrail | s5 judge suppressed candidate response budget
- Threat Retrieval now caps suppressedCandidateEvidence at 16 per Judge packet and reports suppressedCandidateTotalCount, suppressedCandidateReturnedCount, suppressedCandidateResponseLimit, and suppressedCandidateResponseTruncated in retrievalTrace.
- Judge validator rejects suppressed candidate budget count/limit/truncation mismatches.
- GET /v1/contracts/judge and canonical Knowledge Base API docs expose answer.threatRetrievalPolicies.suppressedCandidateResponseBudget.
- Verification: targeted RED/GREEN, focused 52 passed in 122.26s, full knowledge-base suite 549 passed in 336.69s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | S4 Corpus Readiness JSON object loader path redaction
- `_load_json_object()` now emits value-free non-object JSON diagnostics without host-local path echo.
- This complements the existing CLI invalid-input sanitization path.
- Verification: RED reproduced secret path leakage; targeted loader test 1 passed; corpus readiness tests 36 passed; related Tool Portfolio 416 passed; full services/sast-runner pytest 1040 passed in 25.51s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] completed | S4 actual runner JSON input loader read/parse error-surface sanitization
- Actual Tool Portfolio runner `_load_json_object()` now wraps read and parse failures as value-free diagnostics.
- Missing files, malformed JSON, and non-object JSON no longer echo host-local paths or input content; read/parse wrappers suppress chained causes.
- Verification: RED reproduced missing-path and malformed-JSON raw exception surfaces; targeted loader tests 3 passed; actual runner tests 16 passed; related Tool Portfolio 419 passed; full services/sast-runner pytest 1043 passed in 24.94s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] completed | S4 Juliet corpus file selection failure path redaction
- `_select_juliet_file()` now reports missing Juliet source file selection with value-free diagnostics.
- Host-local corpus/cache root paths are no longer echoed when a matching Juliet file cannot be found.
- Verification: RED reproduced secret root path leakage; targeted helper test 1 passed; corpus acquisition tests 14 passed; related Tool Portfolio 420 passed; full services/sast-runner pytest 1044 passed in 25.18s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] S5 closed Threat Retrieval semantic expansion response-bloat guardrail | s5 judge semantic expansion response budget
- Threat Retrieval now caps weaknessSemantics and attackSemantics at 32 entries each per Judge packet and reports total/returned/limit/truncated metadata for both arrays in retrievalTrace.
- Judge validator rejects semantic expansion budget count/limit/truncation mismatches.
- GET /v1/contracts/judge and canonical Knowledge Base API docs expose answer.threatRetrievalPolicies.semanticExpansionResponseBudget.
- Verification: targeted RED/GREEN, focused 54 passed in 129.93s, full knowledge-base suite 551 passed in 315.31s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | S4 actual runner CLI input failure fail-closed handling
- Actual Tool Portfolio runner CLI now catches JSON input-loading ValueErrors only.
- Input-loading failures return exit 1 with fixed stderr `input validation failed`; no traceback/path/content echo is emitted on missing or malformed JSON input.
- Argparse and downstream build/report exceptions remain outside this catch.
- Verification: RED reproduced missing-path and malformed-content CLI raises; targeted CLI tests 2 passed; actual runner tests 18 passed; related Tool Portfolio 422 passed; full services/sast-runner pytest 1046 passed in 24.95s; Critic PASS.
- Updated canonical S4 roadmap, API contract, handoff, and Tool Portfolio experiment spec.

## [2026-05-14] completed | s4 acquisition manifest exception-chain suppression
- S4 acquisition manifest downloadedAt real-calendar failures now raise value-free field-only diagnostics from None.
- RED reproduced underlying datetime parser ValueError chain leakage before implementation.
- Verification: targeted 1 passed; acquisition manifest 46 passed; related Tool Portfolio 423 passed; full services/sast-runner 1047 passed in 25.28s; Critic PASS.

## [2026-05-14] S5 closed missing-input unknown Source KG degradation reflection gap | s5 judge missing-input partial source context reflection
- Grounded unknown answers caused by missing component inputs now also surface complete_or_consistent_source_code_kg_context when requested Source KG context is partial/inconsistent/truncated/unresolved.
- followUpAffordances now includes source_context_enrichment in that combined missing-input + degraded Source KG path, while retaining component-specific follow-ups such as library_version_lookup.
- Judge validator now enforces Source KG required input/follow-up for degraded requires_requery/insufficient_input answers as well as degraded_quality answers.
- Verification: targeted RED/GREEN, focused 23 passed in 50.84s, full knowledge-base suite 552 passed in 314.31s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | s4 actual-runner path-boundary exception-chain suppression
- S4 actual-runner source-root escape and relative localPath base escape failures now suppress Path.relative_to() exception chains.
- RED reproduced chained secret absolute path leakage before implementation.
- Verification: targeted 2 passed; actual runner 20 passed; related Tool Portfolio 425 passed; full services/sast-runner 1049 passed in 25.35s; Critic PASS.

## [2026-05-14] completed | s4 benchmark-slice artifact loader sanitization
- S4 benchmark_slice_report artifact loader now reports unreadable/malformed/non-object artifacts with value-free diagnostics.
- RED reproduced raw path/parser/path leakage before implementation.
- Verification: targeted 3 passed; benchmark slice 9 passed; related offline evidence/report 81 passed; full services/sast-runner 1052 passed in 25.38s; Critic PASS.

## [2026-05-14] S5 closed ETL .env trust-boundary and banner secret-leakage gap | s5 etl env safe loading and ledger url redaction
- scripts/knowledge-base/etl-build.sh no longer shell-sources .env; it safely exports only AEGIS_KB_* key-value lines for S5-owned settings.
- The ETL seed banner now prints a redacted ledger URL via redact_url_userinfo, avoiding future userinfo/credential leakage for non-sqlite ledger URLs.
- Verification: targeted RED/GREEN, ETL script contract 5 passed in 0.01s, full knowledge-base suite 553 passed in 318.75s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | s4 tool-output compatibility loader sanitization
- S4 tool_output_compat manifest loading and parserKind rejection now use value-free diagnostics.
- RED reproduced raw path/parser/non-object/parserKind leakage before implementation.
- Verification: targeted 4 passed; tool-output compatibility 9 passed; related offline evidence/report 85 passed; full services/sast-runner 1056 passed in 25.01s; Critic PASS.

## [2026-05-14] completed | s4 tool-output compatibility fixture input sanitization
- S4 tool_output_compat fixture inputs now use safe relative path resolution and value-free read/JSON diagnostics.
- RED reproduced raw missing fixture path, malformed SARIF parser diagnostic, and traversal path leakage before implementation.
- Verification: targeted 3 passed; tool-output compatibility 12 passed; related offline evidence/report 88 passed; full services/sast-runner 1059 passed in 25.33s; Critic PASS.

## [2026-05-14] completed | s4 SARIF parser malformed-output sanitization
- S4 parse_sarif now emits stable value-free SarifParseError for parser-shape failures and suppresses chained parser causes.
- RED reproduced parser-detail leakage and raw AttributeError escape before implementation.
- Verification: targeted 2 passed; SARIF parser 16 passed; related parser/scan/tool-output 114 passed; full services/sast-runner 1061 passed in 25.25s; Critic PASS.

## [2026-05-14] completed | s4 Juliet benchmark failure-log sanitization
- S4 Juliet benchmark scan failure logs no longer echo raw orchestrator/tool exception text.
- RED reproduced secret exception text in benchmark log before implementation.
- Verification: targeted 1 passed; benchmark/JULIET related 32 passed; full services/sast-runner 1062 passed in 25.23s; Critic PASS.

## [2026-05-14] S5 closed dense explicit Source KG induced-edge response-bloat guardrail | s5 source kg explicit induced-edge cap
- Explicit graphNodeIds Source KG context now caps induced graphEdges at the same 128-entry response budget used for whole-analysis context.
- Dense induced subgraphs emit SOURCE_KG_CONTEXT_TRUNCATED diagnostics with total/returned/max counts and complete=false.
- Verification: targeted RED/GREEN, focused 45 passed in 97.36s, full knowledge-base suite 554 passed in 331.67s, sqlite ledger restored, diff checks clean.

## [2026-05-14] completed | s4 Juliet manifest missing-testcases path sanitization
- S4 Juliet discovery missing-testcases diagnostics no longer echo local corpus/cache roots.
- RED reproduced secret root path leakage before implementation.
- Verification: targeted 1 passed; benchmark/JULIET related 33 passed; full services/sast-runner 1063 passed in 24.95s; Critic PASS.

## [2026-05-14] completed | s4 Semgrep runner raw-output log sanitization
- S4 Semgrep runner no longer logs raw stdout/stderr on empty-output and non-JSON-output paths.
- RED reproduced raw Semgrep stderr/stdout log leakage before implementation.
- Verification: targeted 2 passed; Semgrep runner 22 passed; related scanner/parser/orchestrator/endpoint 198 passed; full services/sast-runner 1065 passed in 24.84s; Critic PASS.

## [2026-05-14] completed | s4 compile-analyzer per-file failure-log sanitization
- S4 gcc-fanalyzer and scan-build per-file failure aggregation logs no longer echo raw exception text.
- RED reproduced raw exception text leakage in both runner logs before implementation.
- Verification: targeted 2 passed; gcc/scan-build runner 26 passed; related scanner/orchestrator/endpoint 186 passed; full services/sast-runner 1067 passed in 26.83s; Critic PASS.

## [2026-05-14] completed | s4 scan-build plist parse failure-log sanitization
- S4 scan-build malformed plist logs no longer include plist filenames or parser exception text.
- RED reproduced secret plist filename/parser-detail leakage while valid plist parsing continued before implementation.
- Verification: targeted 1 passed; scan-build runner 11 passed; related scanner/orchestrator/endpoint 187 passed; full services/sast-runner 1068 passed in 25.55s; Critic PASS.

## [2026-05-14] implemented_and_verified | S5 Source KG/Judge selector value length policy v1
- Added shared 512-character maxLength contract for Source KG direct-context selectors and Judge sourceContext selectors across scalar and array-item values.
- Sanitized FastAPI validation error envelopes by stripping raw input/ctx so 100k selector values are not echoed in 422 responses.
- Mapped over-length selector validation to errorDetail.reason=selector_value_too_long and preserved count-cap reason explicit_selector_limit_exceeded.
- Updated canonical Knowledge Base API documentation and recorded targeted/focused/full pytest evidence: 5 passed, 40 passed, 556 passed.

## [2026-05-14] completed | s4 build metadata macro extraction failure-log sanitization
- Changed BuildMetadataExtractor.extract() macro collection failure logging from raw exception text to fixed category `gcc macro extraction failed`.
- Fail-soft metadata return contract preserved: compiler retained, macros/targetInfo empty.
- Verification: RED targeted leak regression; targeted 1 passed; build metadata 23 passed; related scanner/orchestrator/endpoint+runner 262 passed; full services/sast-runner 1069 passed in 25.33s; Critic PASS.

## [2026-05-14] completed | s4 ast dump failure-log sanitization
- Changed AstDumper._dump_single() failure logging from source filename plus raw exception text to fixed category `AST dump failed`.
- Fail-soft AST/codegraph metadata behavior preserved: failed dumps return None.
- Verification: RED targeted leak regression; targeted 1 passed; AST dumper 14 passed; related codegraph/static-evidence/scan endpoint 161 passed; full services/sast-runner 1070 passed in 25.00s; Critic PASS.

## [2026-05-14] implemented_and_verified | S5 runtime ledger URL log redaction v1
- Added app.config.redact_url_for_log to strip URL userinfo before runtime startup logging while leaving sqlite ledger paths readable.
- Updated Knowledge Base startup ledger banner to log the redacted ledger URL instead of raw settings.ledger_url.
- Added runtime log-redaction tests and canonical Knowledge Base API operations note.
- Verified focused suite 20 passed and full S5 suite 559 passed.

## [2026-05-14] completed | s4 sdk registry load failure-log sanitization
- Changed _load_sdk_registry() missing/malformed failure logging from SDK registry path/raw parser detail to fixed categories `SDK registry not found` and `Failed to load SDK registry`.
- Fail-soft registry behavior preserved: missing/malformed registry returns empty dict.
- Verification: RED targeted leak regressions; targeted 2 passed; SDK resolver 34 passed; related SDK/build/scan endpoint 149 passed; full services/sast-runner 1072 passed in 25.29s; Critic PASS.

## [2026-05-14] completed | s4 sdk include-path resolution log sanitization
- Changed SDK include-path resolution success/missing-directory/missing-sysroot logs to category/count-only messages without caller sdkId, SDK root/base paths, or sysroot paths.
- Functional include-path return semantics preserved: resolved paths remain returned, missing directory/sysroot still returns empty lists.
- Verification: RED targeted leak regressions; targeted 3 passed; SDK resolver 37 passed; related SDK/build/scan endpoint 152 passed; full services/sast-runner 1075 passed in 24.79s; Critic PASS.

## [2026-05-14] completed | s4 sdk validation error-surface sanitization
- Changed validate_sdk() missing SDK path/sysroot/environment setup/compiler diagnostics to value-free category strings without host path, sysroot, setup, or compiler-prefix echo.
- Validation flow preserved: same error-list shape, same early return for missing SDK path, same valid/no-optional behavior.
- Verification: RED targeted leak regressions; targeted 4 passed; SDK resolver 37 passed; related SDK/build/scan endpoint 152 passed; full services/sast-runner 1075 passed in 25.47s; Critic PASS.

## [2026-05-14] completed | s4 orchestrator tool exception surface sanitization
- Changed ScanOrchestrator.run() per-tool task exception handling to log fixed `Tool <tool> failed` categories and set skipReason to `tool-execution-failed` instead of raw exception text.
- Fail-soft execution report behavior preserved: failed tool status remains failed, findings_count stays 0, version remains available.
- Verification: RED targeted leak regression; targeted 1 passed; orchestrator 75 passed; related orchestrator/scan endpoint/static-evidence/quality 209 passed; full services/sast-runner 1076 passed in 24.97s; Critic PASS.

## [2026-05-14] completed | s4 sca diff failure log sanitization
- Changed analyze_libraries() SCA diff failure logging to fixed `lib_differ.diff failed` without project-derived library names or raw exception text.
- Fail-soft SCA behavior preserved: failed diff entries get diff=None and later libraries continue processing.
- Verification: RED targeted leak regression; targeted 1 passed; SCA service 9 passed; related SCA/scan/static-evidence/quality 143 passed; full services/sast-runner 1076 passed in 24.89s; Critic PASS.

## [2026-05-14] implemented_and_verified | S5 Judge candidate-pool truncation trace v1
- Threat Retrieval now exposes candidateSetTotalCount, candidatePoolTruncated, and candidatePoolTruncationReason=candidate_pool_k_cap when the usable candidate set exceeds the internal rerank pool.
- Judge answer validator enforces candidate-pool accounting and truncation metadata consistency.
- Judge contract and canonical Knowledge Base API docs now advertise candidate-pool truncation visibility.
- Verified focused suite 62 passed and full S5 suite 560 passed.

## [2026-05-14] completed | s4 sca library identity path-log sanitization
- Changed LibraryIdentifier identify summary and permission-denied scan logs to count/category-only messages without project root, child directory, or permission exception details.
- Library identification behavior preserved: returned metadata and skipped permission-denied branches remain unchanged.
- Verification: RED targeted leak regressions; targeted 2 passed; library identifier 13 passed; related library/SCA/static-evidence/scan endpoint 155 passed; full services/sast-runner 1078 passed in 25.64s; Critic PASS.

## [2026-05-14] completed | s4 direct projectPath-not-found api response sanitization
- Changed /v1/build, /v1/build-and-analyze, and /v1/discover-targets direct projectPath-not-found validation errors to fixed `projectPath not found` without caller-provided path echo.
- Response compatibility preserved: status 400 remains, /v1/build still returns success=false, and direct response shapes remain unchanged aside from sanitized error text.
- Verification: RED targeted leak regressions; targeted 3 passed; scan endpoint 87 passed; related scan/request-ownership/sdk/static-evidence 137 passed; full services/sast-runner 1079 passed in 25.59s; Critic PASS.

## [2026-05-14] NoFilesError projectPath-not-found API response sanitization completed | s4
- /v1/scan, /v1/functions, /v1/includes, and /v1/libraries now use fixed `projectPath not found` errors for missing projectPath directories without caller-provided path echo.
- Validated with RED/GREEN targeted endpoint tests, scan endpoint suite, related scan/request-ownership/sdk/static-evidence suite, and full services/sast-runner pytest: 1083 passed in 25.05s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] implemented_and_verified | S5 Judge control echo policy v1
- Oversized invalid controls.topK values are now redacted in appliedControls and serving-ledger request packets instead of echoing raw user input.
- Added reusable serving query-planner echo sanitizer for oversized strings and disabled noisy Pydantic serialization warnings in request dumping paths.
- Judge contract and canonical Knowledge Base API docs now expose request.controlEchoPolicy with maxStringEchoChars=512.
- Verified focused suite 71 passed and full S5 suite 561 passed.

## [2026-05-14] files[] path validation raw-echo sanitization completed | s4
- /v1/scan, /v1/functions, and /v1/includes absolute/traversal files[].path validation failures now use fixed category messages without caller path echo.
- Validated with RED/GREEN targeted endpoint tests, scan endpoint suite, related scan/request-ownership/sdk/static-evidence suite, and full services/sast-runner pytest: 1085 passed in 25.66s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] Router structured-log raw path/command extra sanitization completed | s4
- `scan.py` router logger extras no longer emit raw projectPath/buildCommand/compileCommandsPath fields; presence/count/status signals remain.
- Validated with RED/GREEN static AST gate, scan endpoint suite, related scan/request-ownership/sdk/static-evidence suite, and full services/sast-runner pytest: 1086 passed in 25.32s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] Simple runner command-start log sanitization completed | s4
- Semgrep, Cppcheck, and Flawfinder command-start logs no longer emit joined CLI commands or caller path fragments.
- Validated with RED/GREEN caplog regressions, affected runner tests, related runner/orchestrator/scan endpoint suite, and full services/sast-runner pytest: 1089 passed in 25.99s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] BuildRunner log surface sanitization completed | s4
- Build target discovery and build start logs no longer emit raw project paths or caller build commands.
- Validated with RED/GREEN caplog regressions, BuildRunner tests, related build/scan/request-ownership suite, and full services/sast-runner pytest: 1091 passed in 25.53s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] critic_findings_closed | S5 Judge control echo policy v2
- Critic subagent flagged P1 accepted-control echo/ledger bloat for oversized forceContext/control strings.
- Generalized control echo sanitation beyond topK: oversized exclude/prefer/forceContext/answerMode values are rejected with control_value_too_long and redacted in appliedControls/canonical query/serving ledger; unsupported oversized controls are redacted too.
- Added API-level proof that raw 100k control values are absent from HTTP response, serving-ledger request packet, and serving-ledger answer packet.
- Verified targeted 3 passed, focused 73 passed, and full S5 suite 563 passed.

## [2026-05-14] files[] Windows/backslash path validation hardening completed | s4
- `_validate_path()` now rejects backslash traversal, Windows drive absolute paths, and UNC/backslash-root paths with value-free diagnostics.
- Validated with RED/GREEN path validation tests, scan endpoint suite, related scan/request-ownership/sdk/static-evidence suite, and full services/sast-runner pytest: 1097 passed in 25.26s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] gcc-fanalyzer compiler path log sanitization completed | s4
- `GccAnalyzerRunner.run()` start and unsupported-SDK fallback logs no longer emit raw compiler executable paths.
- Validated with RED/GREEN caplog regressions, gcc-analyzer tests, related gcc/orchestrator/scan endpoint suite, and full services/sast-runner pytest: 1099 passed in 25.40s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] gcc/scan-build per-file source log sanitization completed | s4
- gcc-fanalyzer and scan-build per-file failure/timeout warning logs no longer emit source file identifiers.
- Validated with RED/GREEN caplog regressions, affected runner tests, related gcc/scan-build/orchestrator/scan endpoint suite, and full services/sast-runner pytest: 1101 passed in 25.21s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] implemented_and_verified | S5 Source KG ingest size policy v1
- Closed Critic P2 Source KG ingest unbounded input/storage risk by adding machine-readable ingestSizePolicy and Pydantic request caps.
- Bounded sourceArtifacts, evidenceSnippets, graphNodes, graphEdges, richIrArtifacts, snippetText, and rich IR payload bytes before ledger writes.
- Request validation now maps collection caps to ingest_collection_limit_exceeded and oversized snippet/payload values to ingest_value_too_large with sanitized error envelopes.
- Verified targeted 4 passed, focused 58 passed, and full S5 suite 565 passed.

## [2026-05-14] Drive-qualified relative files[] path hardening completed | s4
- `_validate_path()` now rejects single-letter Windows drive-qualified relative forms like `C:foo.c` with value-free absolute-path diagnostics.
- Validated with RED/GREEN path validation tests, scan endpoint suite, related scan/request-ownership/sdk/static-evidence suite, and full services/sast-runner pytest: 1104 passed in 25.20s.
- Critic review PASS; canonical S4 roadmap/API/handoff/experiment spec evidence refreshed.

## [2026-05-14] completed | S4 BuildRunner API evidence sanitization
- buildEvidence.buildOutput is now fixed marker/null instead of raw subprocess output.
- failureDetail.matchedExcerpt remains nullable but no longer echoes raw failure lines.
- Verification: targeted 4 passed, BuildRunner 21 passed, related 123 passed, full services/sast-runner 1108 passed in 25.48s; Critic PASS.

## [2026-05-14] implemented_and_verified | S5 Judge keyword-match discovery v1
- Closed Critic P2 retrieval breadth gap by using normalized component identifiers as conservative keyword discovery terms for Threat Retrieval.
- Query-term-only advisories can now appear as contextual keyword_match candidates in unknown/requery answers without affectedness or negative-evidence authority.
- Retrieval trace now sets keywordUsed=true and includes keyword_match in methodsAttempted/methodsUsed when such candidates are returned.
- Verified targeted 1 passed, focused 64 passed, and full S5 suite 566 passed.

## [2026-05-14] completed | S4 unknown internal exception surface sanitization
- Unknown non-domain exceptions now surface fixed internal error / INTERNAL_ERROR across JSON, NDJSON, durable ownership results, health summaries, and logs.
- Domain SastRunnerError/PolicyViolationError public messages remain unchanged.
- Verification: targeted 4 passed, related 105 passed, full services/sast-runner 1111 passed in 28.84s; Critic PASS.

## [2026-05-14] completed | S4 LibraryDiffer diff-output path sanitization
- _compute_diff now emits only local-library-relative paths for modifications[].file and addedFilesList[].
- Raw Only in lines, host-local roots, upstream/cache paths, and outside-root rows are not public SCA diff evidence.
- Verification: targeted 2 passed, LibraryDiffer 24 passed, related 141 passed, full services/sast-runner 1113 passed in 28.45s; Critic PASS.

## [2026-05-14] implemented_and_verified | S5 Judge security-identifier question-term discovery v1
- Threat Retrieval keyword_match discovery now uses canonical questionTerms only when they are security identifiers (CVE/GHSA/OSV/CWE/CAPEC).
- Question-only CVE requests can retrieve contextual advisory candidates even without component/package/affectedness matches, while generic free-form words do not create candidates.
- Preserves authority boundary: keyword_match remains contextual_support_not_affectedness_proof and never negative evidence.
- Verified targeted 2 passed, focused 80 passed, and full S5 suite 567 passed.

## [2026-05-14] completed | S4 runtime expectedExecutablePath redaction
- Runtime tool availability surfaces expose expectedExecutablePathStatus only.
- check_tools, /v1/health, startup degraded-tool logs, and required-tool preflight metadata/logs no longer expose raw executable paths.
- Verification: targeted 4 passed, related 173 passed, full services/sast-runner 1116 passed in 28.41s; Critic PASS.

## [2026-05-14] completed | S4 startup logDir redaction
- SAST Runner runtime configuration logs expose logDirConfigured/logDirSource instead of raw log directory paths.
- _setup_logging internal file-handler path behavior unchanged.
- Verification: startup logging 2 passed, related 98 passed, full services/sast-runner 1117 passed in 28.54s; Critic PASS.

## [2026-05-14] implemented_and_verified | S5 Judge control echo policy v3
- Extended control echo redaction to oversized control names and object keys, not only string values.
- Oversized unknown control names are redacted in appliedControls; oversized forceContext keys reject forceContext with control_value_too_long and are absent from serving-ledger request/answer packets.
- Updated Judge controlEchoPolicy contract/docs to include oversized control-name and object-key redaction forms.
- Verified targeted 2 passed, focused 76 passed, and full S5 suite 568 passed.

## [2026-05-14] S4 hardened SDK registry/enrichment log identity/path surfaces | s4-sdk-registry-enrichment-log-sanitization
- register_sdk/unregister_sdk logs are category-only; _enrich_profile_with_sdk logs count-only SDK resolution.
- No API/schema/storage behavior changed; registry and SDK resolver internals retain required real paths.
- Verification: targeted 3 passed; sdk_resolver+orchestrator 116 passed; full services/sast-runner 1120 passed in 28.44s; Critic PASS.

## [2026-05-14] S4 hardened LibraryDiffer CloneCache repo URL log surfaces | s4-library-differ-clone-cache-log-sanitization
- CloneCache HIT/MISS debug logs now omit raw repo URLs, tokens, hosts, and repo paths.
- No API/schema behavior changed; clone/fetch internals, cache keying, returned cache paths, and diff evidence behavior unchanged.
- Verification: targeted 2 passed; related library/SCA/scan endpoint 131 passed; full services/sast-runner 1122 passed in 28.48s; Critic PASS.

## [2026-05-14] S4 hardened BuildMetadata public compiler path evidence | s4-build-metadata-compiler-identity-sanitization
- /v1/metadata and nested build metadata compiler evidence now returns compiler identity plus optional version, not host-local compiler paths.
- Subprocess execution and version probing still use the real compiler path internally.
- Verification: targeted 2 passed; related build-metadata+scan endpoint 121 passed; full services/sast-runner 1124 passed in 28.73s; Critic PASS.

## [2026-05-14] implemented_and_verified | S5 sync timeout no-side-effect policy v1
- Closed Critic P1 timeout side-effect risk for Source KG ingest and Judge query.
- run_sync_with_deadline now rejects too-short remaining budgets before starting a non-cancellable sync worker thread, preventing silent ledger writes after 408 in the tested timeout path.
- Judge timeout reason is now deadline_exceeded_before_judge_query_completed and Judge contract exposes servingLedgerWriteOnTimeout=false; Source KG contract exposes ledgerWriteOnTimeout=false for ingest timeout policy.
- Verified targeted 4 passed, focused 45 passed, and full S5 suite 570 passed.

## [2026-05-14] S4 hardened public SCA repository URL evidence | s4-sca-repository-url-evidence-sanitization
- Public repoUrl/remoteUrl and diff repoUrl fields strip URL userinfo, query, and fragment while preserving safe scheme/host/port/path identity.
- Raw repository URLs remain internal clone/fetch/diff inputs; schema fields unchanged.
- Verification: targeted 9 passed; related repository/library/differ/SCA/evidence/scan endpoint 165 passed; full services/sast-runner 1133 passed in 28.46s; Critic PASS.

## [2026-05-14] S5 hardened durable write timeout semantics for Source KG ingest and Judge query | s5 sync-timeout no-side-effect v1
- Added post-start slow-write regression tests for Source KG ingest and Judge query.
- Introduced run_sync_durable_write_with_deadline: 408 remains pre-start-only; started durable write workers complete and return committed results, preventing false 408 responses with later background ledger side effects.
- Updated Source KG/Judge machine-readable contracts and canonical Knowledge Base API docs.
- Verification: RED 2 failed pre-fix; targeted 6 passed; focused 62 passed; full S5 pytest 572 passed; diff checks clean.

## [2026-05-14] S4 hardened nested SCA diff repository URL evidence | s4-nested-sca-diff-url-evidence-sanitization
- Public diffSummary.repoUrl and /v1/libraries entry.diff.repoUrl strip URL userinfo, query, and fragment when raw diff mappings are supplied.
- Diff mappings are shallow-copied before sanitization; raw top-level URLs remain internal differ inputs.
- Verification: targeted 2 passed; related repository/SCA/evidence/differ/scan endpoint 153 passed; full services/sast-runner 1135 passed in 28.55s; Critic PASS.

## [2026-05-14] S5 rejected duplicate Source KG graph node identities before ledger writes | s5 source-kg producer identity policy v1
- Added duplicate graph node stableId and explicit sourceGraphNodeId RED coverage.
- Implemented pre-ledger-write duplicate identity validation with errorDetail.reason=duplicate_source_graph_node_identity.
- Updated machine-readable Source KG contract and canonical Knowledge Base API docs.
- Verification: RED 2 failed pre-fix; targeted 3 passed; focused 37 passed; full S5 pytest 574 passed; diff checks clean.

## [2026-05-14] completed | S4 SDK execution-report root-path public evidence redaction
- `/v1/scan` execution.sdk no longer exposes raw sdkDescriptor.sdkRootPath; sdkRootPath is nullable/omitted and sdkRootPathStatus carries configured/not-configured evidence.
- Internal non-registered SDK resolution remains descriptor-based; public evidence is status-only.
- Validation: targeted 2 passed; related 254 passed; full S4 pytest 1136 passed in 28.63s; Critic PASS.
- Canonical wiki/API/handoff/spec/session evidence updated and wiki validation passed.

## [2026-05-14] completed | S4 `/v1/includes` dependency path public evidence redaction
- Include dependency lists no longer expose raw absolute host/SDK/system include paths.
- Project-local absolute dependencies become scan-root-relative; external absolutes become `<external>/<basename>` or `<external>/<unknown>`.
- Validation: targeted 12 passed; related 143 passed; full S4 pytest 1142 passed in 28.74s; Critic PASS.
- Canonical wiki/API/handoff/spec/session evidence updated and wiki validation passed.

## [2026-05-14] S5 capped Judge exclude/prefer control lists before serving-ledger persistence | s5 judge control list cardinality policy v1
- Added RED coverage for 129-item controls.exclude/prefer requests.
- Added maxListItems=128 to JudgeControls schema and mapped over-limit validation to control_list_too_long.
- Updated machine-readable Judge contract and canonical Knowledge Base API docs.
- Verification: RED 1 failed pre-fix; targeted 2 passed; focused 44 passed; full S5 pytest 575 passed; diff checks clean.

## [2026-05-14] completed | S4 public finding/dataFlow external absolute path redaction
- Retained cross-boundary findings no longer expose raw external SDK/system roots in location.file, dataFlow[].file, or evidenceResolution location.
- Internal filtering still runs on raw parser paths before public projection, preserving SDK/system-noise removal and cross-boundary classification.
- Validation: targeted 2 passed; related 268 passed; full S4 pytest 1144 passed in 28.47s; Critic PASS.
- Canonical wiki/API/handoff/spec/session evidence updated and wiki validation passed.

## [2026-05-14] completed | S4 router structured-log SDK identity redaction
- `Scan started` and `Scan execution summary` logs now expose sdkIdProvided/executionSdkIdProvided booleans instead of raw sdkId.
- Static router logging guard now forbids literal sdkId logger extra keys together with raw path/command keys.
- Validation: targeted 2 passed; related 185 passed; full S4 pytest 1145 passed in 28.32s; Critic PASS.
- Canonical wiki/API/handoff/spec/session evidence updated and wiki validation passed.

## [2026-05-14] S5 kept conservative Threat Retrieval context in missing-version grounded-unknown Judge answers | s5 judge missing-version threat context v1
- Added RED coverage for missing component.version answers with security questionTerms.
- Updated Judge _unknown_answer so component identifiers or security questionTerms still assemble Threat Retrieval context without affectedness authority.
- Updated machine-readable Judge contract and canonical Knowledge Base API docs.
- Verification: RED 1 failed pre-fix; targeted 2 passed; focused 64 passed; full S5 pytest 576 passed; diff checks clean.

## [2026-05-14] Completed public SDK_NOT_FOUND sdkId redaction | s4
- Unknown bare sdkId remains an early HTTP 400 / SDK_NOT_FOUND / retryable=false domain failure, but public response/log/requestSummary surfaces no longer echo the submitted sdkId.
- Updated S4 wiki API, handoff, roadmap, and Tool Portfolio experiment evidence pages; rebuilt wiki index and validated wiki.
- Verification: targeted 5 passed, related 184 passed, full services/sast-runner pytest 1145 passed in 29.57s; Critic PASS.

## [2026-05-14] Completed public SCAN_TOOL_INVALID unknown tool-id redaction | s4
- Unsupported options.tools[] remains an early HTTP 400 / SCAN_TOOL_INVALID / retryable=false domain failure, but public response/log/requestSummary surfaces no longer echo submitted unknown tool IDs.
- Updated S4 wiki API, handoff, roadmap, Tool Portfolio experiment evidence page, session history, and index; validate_wiki PASS.
- Verification: targeted 3 passed, related 185 passed, full services/sast-runner pytest 1146 passed in 30.61s; Critic PASS.

## [2026-05-14] S5 made Source KG ingest all-or-nothing across SQLite ledger rows | s5 source-kg atomic ingest policy v1
- Added RED coverage for missing compileCommandsArtifactId and late graph-node write failure partial rows.
- Implemented SQLiteLedgerRepository.transaction() and wrapped Source KG ingest writes in a single transaction.
- Added compileCommandsArtifactId preflight reason build_context_references_unknown_source_artifact.
- Updated machine-readable Source KG contract and canonical Knowledge Base API docs with atomicIngestPolicy.
- Verification: RED 2 failed pre-fix; targeted 3 passed; focused 39 passed; full S5 pytest 578 passed; diff checks clean.

## [2026-05-14] Completed FastAPI/Pydantic request-validation error redaction | s4
- Malformed pre-router request bodies now return fixed REQUEST_VALIDATION_FAILED / request validation failed with sanitized structural validationErrors[] instead of default FastAPI detail[].input raw echo.
- Updated S4 wiki API, handoff, roadmap, Tool Portfolio experiment evidence page, session history, and index; validate_wiki PASS.
- Verification: targeted 1 passed, related 103 passed, full services/sast-runner pytest 1147 passed in 30.79s; Critic PASS.

## [2026-05-14] Completed request-validation loc dynamic-key redaction | s4
- 422 validationErrors[].loc now allowlists known schema/transport field names and integer indices; caller-controlled mapping keys are redacted as <field>.
- Updated S4 wiki API, handoff, roadmap, Tool Portfolio experiment evidence page, session history, and index; validate_wiki PASS.
- Verification: targeted 2 passed, related 103 passed, full services/sast-runner pytest 1148 passed in 30.36s; Critic PASS.

## [2026-05-14] Completed context-aware request-validation loc map-key redaction | s4
- 422 validationErrors[].loc now treats string segments after buildEnvironment/defines/environment as dynamic caller map keys and redacts them as <field>, even if they match schema field names.
- Updated S4 wiki API, handoff, roadmap, Tool Portfolio experiment evidence page, session history, and index; validate_wiki PASS.
- Verification: targeted 4 passed, related 105 passed, full services/sast-runner pytest 1150 passed in 30.06s; Critic PASS.

## [2026-05-14] S5 closed duplicate non-node Source KG producer identity gap | s5 source-kg producer id uniqueness v1
- Rejected duplicate explicit sourceRepositoryArtifactId, evidenceSnippetId, sourceGraphEdgeId, and richIrArtifactId before ledger write.
- Mapped validation failures to duplicate_source_kg_identity and extended the Source KG contract/wiki policy.
- Verification: RED duplicate sourceRepositoryArtifactId accepted/collapsed pre-fix; targeted 2 passed; focused Source KG 40 passed; full S5 pytest 579 passed in 349.74s; sqlite restored; diff checks clean.

## [2026-05-14] Completed direct preflight 400 error-shape standardization | s4
- /v1/build, /v1/build-and-analyze, and /v1/discover-targets direct validation failures now preserve legacy error strings and include success=false plus errorDetail code/message/requestId/retryable=false.
- Updated S4 wiki API, handoff, roadmap, Tool Portfolio experiment evidence page, session history, and index; validate_wiki PASS.
- Verification: targeted 6 passed, scan endpoint suite 103 passed, full services/sast-runner pytest 1150 passed in 30.61s; Critic PASS.

## [2026-05-14] Completed durable ownership missing/expired error-envelope standardization | s4
- Request status/result/cancel missing or expired responses now preserve top-level error/requestId and include success=false plus errorDetail code/message/requestId/retryable=false.
- Updated S4 wiki API, handoff, roadmap, Tool Portfolio experiment evidence page, session history, and index; validate_wiki PASS.
- Verification: targeted 2 passed, request ownership + scan endpoint 113 passed, full services/sast-runner pytest 1150 passed in 30.32s; Critic PASS.

## [2026-05-14] Durable ownership REQUEST_ID_CONFLICT envelope standardized | s4
- Cross-endpoint durable X-Request-Id reuse keeps HTTP 409 and legacy error/requestId/endpoint/status/result routing fields.
- Added success=false and errorDetail{code=REQUEST_ID_CONFLICT,message,requestId,retryable=false}.
- Verification: RED targeted failure; targeted green 1 passed; request ownership + scan endpoint 113 passed; full S4 pytest 1150 passed in 30.49s; Critic PASS.

## [2026-05-14] S5 bounded Judge forceContext controls before serving-ledger writes | s5 judge forceContext budget policy v1
- Added forceContext budgets: rootKeys<=128, recursive object/list items<=512, sanitized echo bytes<=16384, depth<=8.
- Over-budget forceContext requests return errorDetail.reason=control_object_too_large before Judge ledger lookup or serving_query_run persistence.
- Preserved existing oversized-string redaction path for forceContext values/keys with control_value_too_long.
- Verification: RED 2 failed pre-fix; targeted 3 passed; focused Judge 50 passed; full S5 pytest 580 passed in 347.60s; sqlite restored; diff checks clean.

## [2026-05-14] Juliet benchmark no-suite log path redacted | s4
- Offline benchmark empty-selection diagnostics no longer emit host-local juliet_root, requested CWE lists, variant filters, or source paths.
- Behavior unchanged: no matching suite returns empty BenchmarkResult and does not execute orchestrator.
- Verification: RED targeted failure; targeted green 1 passed; Juliet/benchmark related 34 passed; full S4 pytest 1151 passed in 30.34s; Critic PASS.

## [2026-05-14] Juliet benchmark custom-rules state restoration hardened | s4
- `run_benchmark(custom_rules=false)` now restores global `settings.custom_rules_dir` in a finally block.
- Locked no-suite early return and missing-testcases discovery exception paths with RED/GREEN tests.
- Verification: targeted 2 passed; Juliet/benchmark related 36 passed; full S4 pytest 1153 passed in 30.80s; Critic PASS.

## [2026-05-14] Juliet benchmark suite progress logs redacted | s4
- Per-suite benchmark progress logs now emit stable CWE key and file count only.
- Corpus-derived CWE directory suffixes (`suite.cwe_name`) are no longer log contract surfaces.
- Verification: targeted 1 passed; Juliet/benchmark related 37 passed; full S4 pytest 1154 passed in 30.49s; Critic PASS.

## [2026-05-14] Benchmark report cweName serialization sanitized | s4
- Generated benchmark JSON cweName now uses deterministic allowlist keyed by CWE id, with unknown fallback to the stable CWE id.
- Corpus-derived `CWEMetrics.cwe_name` remains internal and is not emitted by `to_dict()`.
- Verification: targeted 2 passed; benchmark/JULIET related 39 passed; full S4 pytest 1156 passed in 30.63s; Critic PASS.

## [2026-05-14] S5 replaced Threat Retrieval payload substring keyword matching with fielded exact matching | s5 judge keyword-match fielded policy v1
- Keyword match now compares query terms only against advisory identifiers, aliases/security taxonomy IDs, and package identity fields; summaries/descriptions/provenance/collector notes are not raw JSON substring-scanned.
- Security identifiers require exact token matches, preventing near-miss substring candidates such as CVE-2099-7777 matching CVE-2099-77777.
- Contract/wiki advertise matchPolicy=fielded_exact_identifier_or_package_identity and payloadJsonSubstringMatchAllowed=false.
- Verification: RED 2 failed pre-fix plus contract RED 1 failed; targeted 6 passed; focused 68 passed; full S5 pytest 582 passed in 359.81s; sqlite restored; diff checks clean.

## [2026-05-14] Juliet benchmark start log tool selector redacted | s4
- Benchmark start summary logs expose only `toolSelection=all|custom` and `toolCount`.
- Caller-provided `tools[]` values remain execution inputs but are not log contract surfaces.
- Verification: targeted 1 passed; benchmark/JULIET related 40 passed; full S4 pytest 1157 passed in 30.79s; Critic PASS.

## [2026-05-14] Juliet benchmark start log variant filter redacted | s4
- Benchmark start summary logs expose only `variantSelection=all|filtered`.
- Caller-provided `variant_filter` values remain discovery inputs but are not log contract surfaces.
- Verification: targeted 1 passed; benchmark/JULIET related 41 passed; full S4 pytest 1158 passed in 30.13s; Critic PASS.

## [2026-05-14] S5 added Phase-8 runtime trace parity fields to Judge Threat Retrieval | s5 threat retrieval runtime trace parity v1
- Threat Retrieval traces now include methodsSucceeded, filtersApplied, matchedTerms, relationMethods, embeddingScope, profileBoostsApplied, projectionState, and providerState.
- Ledger-backed Judge Threat Retrieval reports embeddingScope=none and not_applicable projection/provider state until a future runtime projection/provider path exists.
- Validator now type-checks these fields and rejects trace/term/scope mismatches.
- Verification: RED 1 failed pre-fix; targeted 2 passed; focused 68 passed; full S5 pytest 583 passed in 344.27s; sqlite restored; diff checks clean.

## [2026-05-14] Benchmark compare markdown path-label redaction documented and verified | s4
- `ComparisonReport.to_markdown()` no longer renders caller-provided baseline/current path labels; public markdown uses fixed `baseline artifact` / `current artifact` labels.
- Verification: RED reproduced secret baseline/current path leakage; targeted 1 passed; benchmark/JULIET related 42 passed; full services/sast-runner 1159 passed in 30.30s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] Juliet benchmark CLI report/log path redaction implemented and verified | s4
- `juliet_runner.py::main()` public report JSON now emits `julietPath="<JULIET_ROOT>/C"` instead of caller `--juliet-path`.
- Save logs no longer include caller `--output` paths; actual benchmark input and requested output-file writes are preserved.
- Verification: RED reproduced stdout/written JSON path leakage and save-log output-path leakage; targeted 2 passed; benchmark/JULIET related 44 passed; full services/sast-runner 1161 passed in 30.48s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] Juliet benchmark CLI tool selector fail-closed validation implemented and verified | s4
- `juliet_runner.py::main()` validates `--tools` against current-six before benchmark execution.
- Unknown or blank selectors exit with fixed `invalid tool selection`, do not run benchmarks, and do not write output files; valid current-six subsets preserve order.
- Verification: RED reproduced unknown/blank selector fail-open execution and blank selector report leakage; targeted 3 passed; benchmark/JULIET related 47 passed; full services/sast-runner 1164 passed in 30.90s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] S5 canonicalized over-cap Judge topK controls to the final policy cap | s5 judge topK canonicalization policy v1
- Accepted/canonical topK now uses the final clamped topK, preventing over-cap requests like 999 and 1000 from fragmenting canonical query/decision-fragment cache identity for equivalent final responses.
- Raw requested topK remains visible in appliedControls.requested.topK and retrievalTrace.topKPolicy.requestedTopK; topKPolicy also exposes acceptedControlTopK.
- Invalid topK remains rejected and falls back to default retrieval sizing.
- Verification: RED 1 failed pre-fix plus contract RED 1 failed; targeted 4 passed; focused 74 passed; full S5 pytest 583 passed in 365.98s; sqlite restored; diff checks clean.

## [2026-05-14] Juliet benchmark CLI CWE selector fail-closed validation implemented and verified | s4
- `juliet_runner.py::main()` validates `--cwes` before benchmark execution and output writes.
- Blank/non-decimal/signed/decimal/non-positive selectors exit with fixed `invalid CWE selection`; arbitrary positive integer CWE IDs remain supported.
- Verification: RED reproduced raw `ValueError` leakage for secret/blank selectors; targeted 3 passed; benchmark/JULIET related 50 passed; full services/sast-runner 1167 passed in 30.43s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] Juliet benchmark CLI variant selector fail-closed validation implemented and verified | s4
- `juliet_runner.py::main()` normalizes `--variant-filter` before benchmark execution/report JSON.
- `all` maps to execution `None`/report `all`; positive decimal IDs preserve trimmed text; blank/non-decimal/non-positive selectors exit with fixed `invalid variant selection` before side effects.
- Verification: RED reproduced invalid/blank selector fail-open execution and raw whitespace report labels; targeted 4 passed; benchmark/JULIET related 54 passed; full services/sast-runner 1171 passed in 29.63s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] Juliet benchmark CLI timeout selector fail-closed validation implemented and verified | s4
- `juliet_runner.py::main()` validates `--timeout` before benchmark execution/output writes instead of relying on argparse raw `int` conversion.
- Blank/non-decimal/signed/decimal/non-positive values exit with fixed `invalid timeout selection`; valid/default positive integer seconds are preserved.
- Verification: RED reproduced raw `invalid int value` secret leakage and non-positive timeout fail-open execution; targeted 4 passed; benchmark/JULIET related 58 passed; full services/sast-runner 1175 passed in 30.36s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] Juliet benchmark CLI baseline artifact preflight validation implemented and verified | s4
- `juliet_runner.py::main()` preflights `--baseline` with `Path.is_file()` before benchmark execution/output writes.
- Missing or directory baselines exit with fixed `invalid baseline artifact`; valid baselines preserve real `Path` handoff to compare logic.
- Verification: RED reproduced raw `FileNotFoundError`/`IsADirectoryError` secret path leakage after benchmark side effects; targeted 3 passed; benchmark/JULIET related 61 passed; full services/sast-runner 1178 passed in 30.16s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] S5 forbade explicit Source KG container ID lineage rebinds | s5 source-kg container lineage rebind policy v1
- Explicit sourceRepositoryArtifactId may not rebind to another repositorySnapshotId; buildContextId may not rebind to another repositorySnapshotId; analysisArtifactSetId may not rebind to another buildContextId.
- Violations now fail before ledger writes with errorDetail.reason=source_kg_lineage_rebind_forbidden, preserving prior lineage rows unchanged.
- Verification: RED lineage-rebind API test failed pre-fix; targeted 2 passed; focused Source KG 41 passed; full S5 pytest 584 passed in 370.27s; sqlite restored; diff checks clean.

## [2026-05-14] Juliet benchmark CLI output artifact preflight validation implemented and verified | s4
- `juliet_runner.py::main()` preflights `--output` before benchmark execution/output writes.
- Existing directory outputs or existing non-directory parents exit with fixed `invalid output artifact`; missing parents and existing regular files remain supported; compare handoff uses the validated output path.
- Verification: RED reproduced raw `IsADirectoryError`/`FileExistsError` secret path leakage after benchmark side effects; targeted 3 passed; benchmark/JULIET related 64 passed; full services/sast-runner 1181 passed in 30.56s; Critic PASS.
- Canonical API/handoff/roadmap/spec pages updated.

## [2026-05-14] completed | S4 benchmark.compare CLI artifact preflight validation
- benchmark.compare.main() now validates --baseline/--current artifacts before reading JSON.
- Invalid missing/directory artifacts exit with fixed invalid comparison artifact and no raw path echo.
- Verification: targeted 3 passed; benchmark/JULIET related 67 passed; full services/sast-runner pytest 1184 passed in 30.45s; Critic PASS.

## [2026-05-14] S5 bounded unsupported Judge control value echoes | s5 judge unsupported control echo budget v1
- Unsupported/unknown Judge control values with many small list/object items are summarized with reason=control_object_too_large instead of echoing raw values into appliedControls or serving-ledger request packets.
- Control echo policy now advertises maxUnsupportedControlEchoItems=128 and maxControlEchoTotalItems=512.
- Verification: RED 2 failed pre-fix; targeted 2 passed; focused Judge 46 passed; full S5 pytest 585 passed in 367.62s; sqlite restored; diff checks clean.

## [2026-05-14] completed | S4 benchmark.compare CLI threshold validation
- benchmark.compare.main() now validates --threshold before artifact validation/loading.
- Invalid secret, non-finite, non-positive, and >1.0 thresholds exit with fixed invalid threshold selection and no raw value echo.
- Verification: targeted 6 passed; benchmark/JULIET related 73 passed; full services/sast-runner pytest 1190 passed in 30.40s; Critic PASS.

## [2026-05-14] completed | S4 benchmark.compare CLI JSON payload validation
- benchmark.compare.main() now loads baseline/current artifacts through CLI-only _load_cli_result() after threshold/artifact preflight.
- Unreadable, malformed, or non-object artifacts exit with fixed invalid comparison artifact payload and no raw path/content echo.
- Verification: targeted payload 2 passed; compare CLI focused 11 passed; benchmark/JULIET related 75 passed; full services/sast-runner pytest 1192 passed in 30.57s; Critic PASS.

## [2026-05-14] completed | S4 Juliet benchmark CLI baseline payload validation
- juliet_runner.py::main() now validates --baseline JSON payload before benchmark execution/output writes.
- Malformed or non-object baselines exit with fixed invalid baseline artifact payload and no raw path/content echo.
- Verification: targeted 3 passed; baseline/output focused 8 passed; benchmark/JULIET related 78 passed; full services/sast-runner pytest 1195 passed in 31.65s; Critic PASS.

## [2026-05-14] Closed Critic P2 Judge cache revision hash scaling with compact per-table revision summaries. | s5 judge compact revision hash policy v1
- RED: pre-fix `_decision_cache_revision_hash` still called `repo.fetch_all("package_identity")`; 1 failed, 1 passed.
- Implementation: `LedgerRepository.revision_summaries()` aggregates row count/max timestamps/max rowid; Judge cacheRevisionHash uses compact summaries with compatibility fallback.
- Contracts/wiki: `decisionCachePolicy.revisionHashMode=compact_table_revision_summary` and API guardrail updated.
- Verification: targeted 3 passed in 5.91s; focused Judge/serving 48 passed in 113.84s; full S5 `pytest -q` 587 passed in 609.90s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] completed | S4 Juliet benchmark CLI output write failure sanitization
- juliet_runner.py::main() now writes --output through _write_cli_output_artifact().
- Parent creation/write failures exit with fixed output artifact write failed and no raw path/exception echo, stdout JSON, or compare handoff.
- Verification: targeted 2 passed; focused Juliet baseline/output 6 passed; benchmark/JULIET related 80 passed; full services/sast-runner pytest 1197 passed in 30.80s; Critic PASS.

## [2026-05-14] completed | S4 Juliet benchmark CLI stdout JSON serialization failure sanitization
- No-output juliet_runner.py::main() now emits report JSON through _emit_cli_stdout_json().
- Serialization/print failures exit with fixed stdout JSON write failed and no raw object/exception echo or compare handoff.
- Verification: targeted 1 passed; focused stdout/output/baseline 5 passed; benchmark/JULIET related 81 passed; full services/sast-runner pytest 1198 passed in 31.31s; Critic PASS.

## [2026-05-14] completed | S4 comparison payload nested-shape validation
- Standalone compare CLI and Juliet --baseline preflight now share is_comparison_payload_shape().
- Malformed summary/results/combined structures and non-finite/non-numeric metric fields fail closed with fixed CLI diagnostics before comparison.
- Verification: targeted 4 passed; focused compare/JULIET CLI 16 passed; benchmark/JULIET related 85 passed; full services/sast-runner pytest 1202 passed in 39.34s; Critic PASS.

## [2026-05-14] Closed S5 Qdrant startup URL credential exposure gap. | s5 runtime qdrant url log redaction v1
- RED: ThreatSearch server-mode log exposed `https://q_user:q_password@qdrant.internal:6333`, and FastAPI startup target log lacked `redact_url_for_log(settings.qdrant_url)`; 2 failed pre-fix.
- Implementation: ThreatSearch and app startup now log Qdrant URLs through shared `redact_url_for_log` while preserving raw URL/API key for QdrantClient.
- Wiki: canonical Knowledge Base API log/operations exposure guidance now covers credential-bearing ledger and Qdrant URLs, plus API-key non-emission.
- Verification: targeted 2 passed in 1.12s; focused Qdrant/log-redaction 12 passed in 1.12s; full S5 `pytest -q` 589 passed in 403.55s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] Juliet benchmark CLI duplicate tool selector validation completed | s4
- Duplicate --tools selectors now fail closed with fixed invalid tool selection before benchmark execution/output writes.
- RED reproduced semgrep,semgrep fail-open execution; Critic implementation review PASS.
- Verification: targeted duplicate+valid 2 passed; focused tool-selector 4 passed; related benchmark/JULIET 77 passed; full S4 pytest 1203 passed in 34.28s.

## [2026-05-14] Closed ETL/projection-seed progress URL credential exposure gap. | s5 etl seed url redaction v1
- RED: `neo4j-seed.py` did not use `redact_url_for_log` and printed ledger/Neo4j connection URLs directly; 1 failed pre-fix.
- Implementation: ledger and Neo4j progress prints now use shared URL redaction while raw connection values remain internal inputs to repository/driver code.
- Wiki: canonical Knowledge Base API log/operations exposure guidance now covers runtime startup and ETL/projection-seed progress logs for ledger, Qdrant, and Neo4j URLs.
- Verification: targeted 1 passed in 0.01s; focused redaction suite 18 passed in 1.13s; full S5 `pytest -q` 590 passed in 401.01s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] Comparison artifact required-schema validation completed | s4
- Standalone compare CLI and Juliet --baseline preflight now require summary/results/overallRecall/per-CWE combined.recall anchors before comparison.
- RED reproduced {} fail-open comparison, missing combined.recall regression misclassification, and Juliet benchmark/output side effects; Critic implementation review PASS.
- Verification: targeted required-schema 4 passed; focused payload/baseline 9 passed; related benchmark/JULIET 81 passed; full S4 pytest 1207 passed in 30.76s.

## [2026-05-14] Juliet benchmark CLI compare handoff failure sanitization completed | s4
- Late --baseline compare handoff failures now use fixed comparison handoff failed without raw exception/path echo.
- Successfully written benchmark output artifacts are preserved when only the regression comparison step fails; Critic implementation review PASS.
- Verification: targeted compare-handoff 2 passed; focused baseline/output/stdout 12 passed; related benchmark/JULIET 82 passed; full S4 pytest 1208 passed in 32.00s.

## [2026-05-14] Juliet benchmark CLI benchmark execution/setup failure sanitization completed | s4
- Escaped setup/execution failures before BenchmarkResult now use fixed benchmark execution failed with no traceback/type/message/path/stdout report artifacts.
- Programmatic run_benchmark and per-CWE scan-failure semantics remain unchanged; Critic implementation review PASS.
- Verification: targeted benchmark-failure 2 passed; focused Juliet boundary 8 passed; related benchmark/JULIET 84 passed; full S4 pytest 1210 passed in 31.21s.

## [2026-05-14] Closed shared URL redaction gap for sensitive query parameters. | s5 url query secret redaction v1
- RED: `redact_url_for_log` masked userinfo but left `api_key` and `access_token` query values intact; 1 failed pre-fix.
- Implementation: shared URL redactor now masks credential-like query keys while preserving non-sensitive query values and sqlite/local URL shape.
- Wiki: canonical Knowledge Base API log/operations exposure guidance now covers userinfo and sensitive query-parameter redaction for runtime startup and ETL/projection-seed progress logs.
- Verification: targeted 1 passed in 0.06s; focused redaction suite 19 passed in 1.12s; full S5 `pytest -q` 591 passed in 470.64s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] Juliet benchmark CLI markdown report failure sanitization completed | s4
- Markdown render/print failures now use fixed markdown report failed without raw traceback/type/message/object/path echo.
- Already-written output JSON is preserved; downstream stdout JSON and compare handoff are skipped; Critic implementation review PASS.
- Verification: targeted markdown 2 passed; focused CLI output-boundary 10 passed; related benchmark/JULIET 85 passed; full S4 pytest 1211 passed in 30.16s.

## [2026-05-14] Juliet benchmark CLI output-data construction failure sanitization completed | s4
- Report payload build failures now use fixed benchmark report build failed before output/markdown/stdout/compare side effects.
- Both raising to_dict() and non-mapping to_dict() are covered; successful output shape is preserved; Critic implementation review PASS.
- Verification: targeted output-data 3 passed; focused CLI boundary 11 passed; related benchmark/JULIET 87 passed; full S4 pytest 1213 passed in 29.65s.

## [2026-05-14] Closed Critic P1 oversized Source KG reference ID echo risk. | s5 source kg producer reference id length policy v1
- RED: oversized `graphEdges[0].sourceGraphNodeId` reached dangling-reference validation and was classified as `graph_edge_references_unknown_node` instead of a sanitized size rejection; 1 failed pre-fix.
- Implementation: Source KG producer/reference IDs now have a 512-character max length at request-model validation, covering repository/build/analysis/snippet/node/edge/rich-IR IDs and edge endpoint refs.
- Contracts/wiki: Source KG ingest size policy now advertises `maxProducerOrReferenceIdLength=512` and no raw value echo for oversized IDs.
- Verification: targeted 3 passed in 1.84s; focused Source KG 42 passed in 23.33s; full S5 `pytest -q` 592 passed in 367.41s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] Comparison metric semantic range validation completed | s4
- CLI comparison payloads now reject recall probabilities outside [0,1] and negative noise density fields.
- Empty-results and boundary values remain valid; programmatic compare helpers remain unchanged; Critic implementation review PASS.
- Verification: targeted range 6 passed; focused payload/range 8 passed; related benchmark/JULIET 93 passed; full S4 pytest 1219 passed in 29.87s.

## [2026-05-14] Comparison payload canonical CWE key validation completed | s4
- CLI comparison payload result keys now require canonical CWE-<positive integer> format so caller-controlled keys cannot reach comparison markdown.
- Empty results and generated keys remain valid; programmatic compare helpers remain permissive; Critic implementation review PASS.
- Verification: targeted key 3 passed; focused payload/key/range 9 passed; related benchmark/JULIET 96 passed; full S4 pytest 1222 passed in 29.55s.

## [2026-05-14] Closed Critic P2 generated Source KG identity collision risk. | s5 source kg generated identity uniqueness v1
- RED: duplicate source artifact without explicit ID returned 200 with `counts.sourceArtifacts=2` and duplicate response IDs while SQLite upsert collapsed to one durable row; 1 failed pre-fix.
- Implementation: Source KG ingest now computes generated/resolved IDs for source artifacts, snippets, graph nodes, graph edges, and rich IR artifacts before the transaction, rejects duplicates before writes, and maps generated duplicate errors to duplicate identity reasons.
- Contracts/wiki: producerIdentityPolicy now states generated/resolved non-node identity duplicates are forbidden after ID generation before ledger writes.
- Verification: targeted 2 passed in 1.87s; focused Source KG 43 passed in 23.60s; full S5 `pytest -q` 593 passed in 363.90s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] Juliet benchmark CLI numeric selector conversion failure sanitization completed | s4
- --cwes, --variant-filter, and --timeout now catch oversized decimal int conversion failures and map them to existing fixed selector diagnostics.
- No new selector upper bounds were introduced; valid selector behavior remains unchanged; Critic implementation review PASS.
- Verification: targeted oversized+valid selector 6 passed; focused selector 11 passed; related benchmark/JULIET 99 passed; full S4 pytest 1225 passed in 30.01s.

## [2026-05-14] Standalone compare CLI markdown report failure sanitization completed | s4
- benchmark.compare.main() now maps markdown render/print failures to fixed comparison report failed with no raw traceback/type/message/path echo.
- Regression evaluation is skipped after report emission failure; programmatic markdown helpers are unchanged; Critic implementation review PASS.
- Verification: targeted compare markdown 3 passed; focused compare 23 passed; related benchmark/JULIET 100 passed; full S4 pytest 1226 passed in 29.63s.

## [2026-05-14] Closed Critic P3 Source KG/Judge credential-bearing URL echo risk. | s5 source kg served url redaction v1
- RED: Source KG context returned raw credential-bearing `repositorySnapshot.repositoryUrl`; 1 failed pre-fix.
- Implementation: Source KG context projection redacts userinfo and sensitive query parameters for served repository URLs and rich IR URIs while retaining raw producer values in ledger rows for replay/provenance.
- Contracts/wiki: `servingContextResolution.urlRedactionPolicy` now advertises redacted served URL fields for Source KG context and Judge evidence.
- Verification: targeted 3 passed in 3.96s; focused Source KG/Judge 60 passed in 60.41s; full S5 `pytest -q` 595 passed in 363.14s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] completed | S4 CLI artifact preflight filesystem-probe failure sanitization
- Standalone compare and Juliet benchmark CLI artifact preflight now maps Path.is_file/exists/is_dir OSError or ValueError to fixed invalid artifact diagnostics.
- RED targeted regressions reproduced raw OSError leakage; final targeted tests 4 passed, related benchmark/JULIET tests 104 passed, full S4 pytest 1230 passed in 31.06s.
- Critic implementation review PASS.
- Updated canonical S4 API, roadmap, handoff, Tool Portfolio experiment spec, and session evidence.

## [2026-05-14] Closed Analyst Brief selector raw-value echo risk. | s5 analyst brief selector non echo v1
- RED: oversized `audience` produced a 200255-byte 422 response containing raw `secret-audience-...`; 1 failed pre-fix.
- Implementation: `AnalystBriefRequest.audience/language` are capped at 32 chars and unsupported selector errors use bounded non-echo messages/reasons.
- Wiki: Analyst Brief contract now documents selector length cap and non-echo validation behavior.
- Verification: targeted 2 passed in 1.33s; focused Analyst Brief 11 passed in 1.48s; full S5 `pytest -q` 596 passed in 365.54s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] completed | S4 Juliet stdout JSON separator failure sanitization
- No-output Juliet CLI now includes the separator newline in _emit_cli_stdout_json().
- Separator write failures map to fixed stdout JSON write failed, emit no JSON markers, and skip baseline compare handoff.
- RED reproduced raw OSError after markdown output; targeted stdout tests 2 passed, related benchmark/JULIET tests 105 passed, full S4 pytest 1231 passed in 30.44s.
- Critic implementation review PASS; canonical S4 docs and session evidence updated.

## [2026-05-14] completed | S4 Tool Portfolio report consumer canary CLI output-boundary sanitization
- Consumer canary CLI now maps summary serialization/stdout write failures to fixed TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED stderr JSON with summaryEmitted=false.
- Stderr error emission is best-effort to avoid cascading raw failures.
- RED reproduced raw stdout OSError and summary serialization TypeError; targeted/compat tests 5 passed, related report/consumer tests 266 passed, full S4 pytest 1233 passed in 29.82s.
- Critic implementation review PASS; canonical S4 docs and session evidence updated.

## [2026-05-14] Closed Critic P1 forged Source KG checksum risk. | s5 source kg checksum integrity v1
- RED: mismatched evidence snippet checksum and malformed source artifact checksum both returned 200 pre-fix; 2 failed pre-fix.
- Implementation: Source KG checksum fields now require `sha256:<64 lowercase hex>` and supplied evidence snippet checksums must match S5 recomputation from `snippetText`; failures map to `source_kg_checksum_invalid` before ledger writes.
- Wiki: Source KG ingest size/integrity policy now documents checksum format and mismatch rejection.
- Verification: targeted 2 passed in 2.27s; focused Source KG/Judge/serving 80 passed in 104.55s; full S5 `pytest -q` 598 passed in 361.61s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] completed | s4 actual-runner CLI argparse scalar hardening
- Invalid --timeout and --phase argparse failures now map to fixed input validation failed stderr with exit 1 before JSON file reads or output writes.
- Timeout parsing is explicit positive decimal with no new upper bound; valid timeout selection still reaches build_actual_tool_portfolio_report.
- RED reproduced raw argparse SystemExit/usage/secret echo; targeted/compat tests 5 passed; related Tool Portfolio tests 340 passed; full services/sast-runner pytest 1236 passed in 29.67s; Critic PASS.

## [2026-05-14] completed | s4 corpus-acquisition CLI argparse input hardening
- Invalid --corpus, unknown arguments, and malformed option shapes now map to fixed input validation failed stderr with exit 1 before acquisition/network/summary side effects.
- Valid repeated corpus selection preserves caller order, --force/output-root handoff, blocked exit 2, JSON stdout, and summary handoff.
- RED reproduced raw argparse SystemExit/usage/secret echo; targeted CLI tests 4 passed; related Tool Portfolio tests 118 passed; full services/sast-runner pytest 1240 passed in 29.38s; Critic PASS.

## [2026-05-14] completed | s4 corpus-acquisition CLI output-boundary hardening
- Summary-output write/serialization failures and stdout JSON serialization/write failures now map to fixed corpus acquisition output failed exit 1 without raw exception/object/path echo.
- Broken stderr error reporting is best-effort suppressed; acquire_known_corpora failures remain outside this catch.
- RED reproduced raw OSError, TypeError with secret class names, stdout write leakage, and stderr cascade risk; targeted output/input tests 6 passed; related Tool Portfolio tests 122 passed; full services/sast-runner pytest 1244 passed in 29.87s; Critic PASS.

## [2026-05-14] Closed Critic P2 readiness gap for Source KG/Judge ledger dependency. | s5 ready ledger dependency v1
- RED: `/v1/ready` returned 200 when Qdrant/Neo4j were initialized but Source KG/Judge ledger repositories were unset; 1 failed, 1 passed pre-fix.
- Implementation: readiness now requires Qdrant, Neo4j, Source KG ledger, and Judge ledger; response components expose `sourceKgLedger.initialized` and `judgeLedger.initialized`.
- Wiki: readiness contract now documents ledger dependency and component fields.
- Verification: targeted 4 passed in 3.54s; focused API 102 passed in 2.02s; full S5 `pytest -q` 599 passed in 380.52s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] completed | s4 corpus-readiness CLI argparse input hardening
- Missing required args, unknown args, and malformed repeated-option values now emit sanitized invalid-input JSON on stdout with exit 1 and empty stderr before JSON loads or readiness build.
- Post-parse invalid-input and output-write behavior remains unchanged.
- RED reproduced raw argparse SystemExit/usage/secret echo; targeted/compat CLI tests 6 passed; related Tool Portfolio tests 125 passed; full services/sast-runner pytest 1247 passed in 31.19s; Critic PASS.

## [2026-05-14] completed | s4 standalone compare CLI argparse hardening
- Missing required args, unknown args, and malformed option shapes now exit 2 with fixed invalid comparison arguments and no argparse usage/raw token/path echo.
- Existing fixed post-parse diagnostics remain specific for threshold, artifact, payload, and markdown report failures.
- RED reproduced raw argparse SystemExit/usage/secret echo; targeted/compat compare tests 8 passed; benchmark/JULIET related tests 108 passed; full services/sast-runner pytest 1250 passed in 30.26s; Critic PASS.

## [2026-05-14] Closed Critic P3 invalid Source KG line span risk. | s5 source kg line span validation v1
- RED: negative/inverted evidence snippet and graph node line spans returned HTTP 200 pre-fix; 1 failed pre-fix.
- Implementation: Source KG ingest validates lineStart/lineEnd before ledger writes; values must be positive 1-based when present, and lineEnd must be >= lineStart when both are present; failures map to `source_kg_line_span_invalid`.
- Wiki: Source KG ingest integrity policy now documents line span requirements.
- Verification: targeted 1 passed in 3.35s; focused Source KG/Judge/serving 81 passed in 105.32s; full S5 `pytest -q` 600 passed in 378.15s; SQLite restored; repo/wiki diff checks clean.

## [2026-05-14] completed | S4 Juliet benchmark CLI argparse-boundary sanitization
- `juliet_runner.py::main()` now maps raw argparse parse-shape failures to fixed `invalid Juliet arguments` / exit 2 without usage/raw token/path echo.
- Existing fixed post-parse diagnostics remain specific through an allowlisted fixed-diagnostic parser.
- Verification: parser-boundary tests 3 passed; targeted/compat Juliet tests 10 passed; benchmark/JULIET related tests 111 passed; full S4 pytest 1253 passed in 30.99s; Critic PASS.

## [2026-05-14] completed | S4 Actual Tool Portfolio runner CLI output-boundary sanitization
- `tool_portfolio_actual_runner.py::main()` now maps post-build output write/serialization/path failures to fixed `output write failed` / exit 1.
- Added best-effort stderr helper so output-failure diagnostics cannot cascade into raw stderr exceptions; input failure semantics remain `input validation failed`.
- Verification: output-boundary tests 3 passed; targeted/compat actual-runner CLI tests 5 passed; related Tool Portfolio tests 327 passed; full S4 pytest 1256 passed in 30.66s; Critic PASS.

## [2026-05-14] completed | S4 Actual Tool Portfolio runner CLI report-build failure sanitization
- `tool_portfolio_actual_runner.py::main()` now maps ordinary report-build/staging/tool/report-composition failures to fixed `actual run failed` / exit 1 before output writing.
- Input validation and output-write diagnostics remain separate as `input validation failed` and `output write failed`; writer calls are skipped after report-build failure.
- Verification: report-build boundary tests 2 passed; targeted/compat actual-runner CLI tests 7 passed; related Tool Portfolio tests 329 passed; full S4 pytest 1258 passed in 31.32s; Critic PASS.

## [2026-05-14] completed | s5 source kg repository root immutability v1
- S5 Source KG ingest now rejects explicit repositorySnapshotId reuse when repository source-version identity changes (repositoryUrl, repositoryId, commitHash, treeHash, submoduleHashes).
- Runtime error reason maps root source-version rebinds to source_kg_lineage_rebind_forbidden before ledger writes, preserving the original source_repository_snapshot row and preventing dependent chimera rows.
- Machine-readable Source KG contract and KB API wiki document checkedRootIds=[repositorySnapshotId] plus version fields.
- Verification: targeted 2 passed, focused Source KG 48 passed, full S5 pytest 601 passed in 366.69s; s5-ledger.sqlite restored after tests.

## [2026-05-14] completed | S4 Actual Tool Portfolio runner structured CLI diagnostics
- `tool_portfolio_actual_runner.py::main()` now emits compact JSON stderr with exact keys `error`, `reasonCode`, and `stage` for input/run/output failures.
- Reason codes are `ACTUAL_RUN_CLI_INPUT_INVALID`, `ACTUAL_RUN_FAILED`, and `ACTUAL_RUN_OUTPUT_WRITE_FAILED`; fixed-message substrings remain for compatibility and no raw exception/path/object data is emitted.
- Verification: structured tests 4 passed; targeted/compat actual-runner CLI tests 8 passed; related Tool Portfolio tests 329 passed; full S4 pytest 1258 passed in 30.32s; Critic PASS.

## [2026-05-14] completed | S4 Corpus Acquisition CLI structured stderr diagnostics
- `tool_portfolio_corpus_acquisition.py::main()` now emits compact JSON stderr with exact keys `error`, `reasonCode`, and `stage` for input/output failures.
- Reason codes are `CORPUS_ACQUISITION_CLI_INPUT_INVALID` for stage `input` and `CORPUS_ACQUISITION_CLI_OUTPUT_FAILED` for stage `output`; fixed-message compatibility remains.
- No raw corpus IDs, flags, paths, exception details, archive/source data, or object reprs are emitted; broken stderr remains best-effort suppressed.
- Verification: structured tests 4 passed; targeted/compat acquisition CLI tests 8 passed; related Tool Portfolio tests 329 passed; full S4 pytest 1258 passed in 29.80s; Critic PASS.

## [2026-05-14] completed | s5 source kg explicit id content immutability v1
- S5 Source KG ingest now rejects same-lineage explicit/resolved ID content mutation for source artifacts, build contexts, analysis artifact sets, evidence snippets, graph nodes, graph edges, and rich IR artifacts.
- New runtime reason source_kg_identity_content_conflict prevents SQLite ON CONFLICT DO UPDATE from silently overwriting durable Source KG facts while preserving idempotent same-content replays.
- Machine-readable Source KG contract and KB API wiki document contentIdentityTables/contentIdentityValidationPhase/contentConflictErrorReason.
- Verification: targeted 2 passed, focused Source KG 49 passed, full S5 pytest 602 passed in 371.36s; s5-ledger.sqlite restored after tests.

## [2026-05-14] completed | S4 Quality Gate eligibility invariant fail-closed hardening
- `build_quality_gate()` now returns `eligible` only for explicit `systemStabilityGate.status="pass"` plus `qualityGateAllowed is True`.
- Absent system gates map to `not_decision_grade` with `SYSTEM_STABILITY_GATE_NOT_RUN`; valid not-run harness gates remain non-decision-grade rather than blocked.
- Pass-without-allowance, malformed/unknown status, and non-pass-with-allowance inputs block quality scoring with `SYSTEM_STABILITY_GATE_FAILED` plus input-invalid or inconsistent reasons.
- Verification: RED 9 failed/2 passed reproduced fail-open eligible paths; targeted invariant tests 15 passed; system-stability suite 49 passed; related Tool Portfolio suite 343 passed; full S4 pytest 1273 passed in 30.75s; Critic PASS.

## [2026-05-14] completed | S4 Quality Gate direct-helper reason-code sanitization
- `build_quality_gate()` now allowlists propagated system-stability and external corpus/readiness reason codes before emitting `qualityGate.reasonCodes`.
- Malformed, blank, non-string, numeric, and object entries are suppressed without `str()` conversion and signaled with `SYSTEM_STABILITY_GATE_INPUT_INVALID` or `CORPUS_READINESS_GATE_INPUT_INVALID`.
- Generated known system/readiness reason codes remain preserved.
- Verification: RED 3 failed reproduced raw secret/object/number reason-code echo; reason-sanitization tests 3 passed; quality-gate subset 21 passed; system-stability suite 52 passed; related Tool Portfolio/readiness suite 385 passed; full S4 pytest 1276 passed in 32.17s; Critic PASS.

## [2026-05-14] completed | s5 source kg nested object budget v1
- Critic-reviewed Source KG nested object budget hardening completed for Threat KB reliability.
- Ingest now caps every advertised nested JSON object field at 65536 bytes and the aggregate nested-object matrix at 1048576 bytes per request, covering metadata/provenance/toolchain/dependencyGraph/analysisConfig/artifactHashes/symbol/evidence dictionaries while preserving the existing rich-IR payload policy.
- Oversized nested objects use sanitized ingest_value_too_large validation envelopes with no raw sentinel echo and no Source KG ledger writes.
- Machine-readable Source KG contract and KB API wiki document maxNestedObjectBytes, maxTotalNestedObjectBytes, and nestedObjectFields.
- Verification: RED 18 per-field failures, RED 1 aggregate failure, RED 1 contract failure; GREEN targeted 19 passed, focused 94 passed, full S5 pytest 621 passed in 435.23s; s5-ledger.sqlite restored after tests.

## [2026-05-14] completed | S4 System Stability direct preflight metadata sanitization
- `build_system_stability_gate()` unavailable-tool preflight failures now emit allowlisted `reasonCode`, `versionStatus`, and `expectedExecutablePathStatus` only.
- Raw `probeReason`, `version`, and expected executable paths are suppressed; malformed/unknown probe reasons fall back to `runtime-tool-missing`.
- Report-side system gate normalization accepts status-only fields for re-ingestion.
- Verification: RED 8 failed reproduced raw probe/version/path leakage; targeted preflight tests 8 passed; system-stability suite 54 passed; related Tool Portfolio/readiness suite 387 passed; full S4 pytest 1278 passed in 32.85s; Critic PASS.

## [2026-05-14] completed | S4 System Stability direct execution-completeness metadata sanitization
- `build_system_stability_gate()` execution-completeness failures now sanitize status, reasonCode, degradeReasons, timedOutFiles, and failedFiles before direct helper emission.
- Statuses are allowlisted or `unknown`; skip reasons are allowlisted or safe fallbacks; degrade reasons are allowlisted without object stringification; counts are nonnegative non-bool ints or null.
- Verification: RED 8 failed/14 passed reproduced raw skip reason/weird status/secret degrade/object/count echo; targeted execution tests 22 passed; system-stability suite 56 passed; related Tool Portfolio/readiness suite 389 passed; full S4 pytest 1280 passed in 32.06s; Critic PASS.

## [2026-05-14] completed | s5 judge source context degraded duplicate assignment cleanup v1
- Removed redundant duplicate source_context_degraded assignment in Judge build_judge_answer source-context degradation path.
- Behavior locked before edit with two degraded Source KG context tests, then verified unchanged after edit.
- Focused Judge answer/API regression: 31 passed in 74.52s. Full S5 pytest: 621 passed in 427.29s; s5-ledger.sqlite restored after tests.

## [2026-05-14] completed | S4 System Stability direct required-tools identity sanitization
- `build_system_stability_gate()` now preserves known current-six required tools in canonical order and collapses unknown, blank, non-string, or invalid entries to one `<invalid>` sentinel.
- Generated preflight evidence uses `toolId="<invalid>"` with `REQUIRED_TOOL_UNKNOWN`, avoiding raw caller identity echo.
- Empty required-tool declarations remain `SYSTEM_REQUIRED_TOOLS_NOT_DECLARED`.
- Verification: RED 2 failed/1 passed reproduced raw unknown tool/object identity leakage; targeted required-tools tests 3 passed; system-stability suite 57 passed; related Tool Portfolio/readiness suite 390 passed; full S4 pytest 1281 passed in 32.69s; Critic PASS.

## [2026-05-14] completed | S4 blocked metric bucket direct-helper sanitization
- `blocked_metric_bucket()` now allowlists split names and system-stability reason codes before emitting blocked metric buckets.
- Invalid split values become `<invalid>`; malformed reason inputs add `SYSTEM_STABILITY_GATE_INPUT_INVALID`; string containers are not expanded and arbitrary reason objects are not stringified.
- Verification: RED 2 failed/1 passed reproduced raw split/reason/object leakage and string-container expansion; blocked-bucket tests 3 passed; system-stability suite 60 passed; related Tool Portfolio/readiness suite 393 passed; full S4 pytest 1284 passed in 32.23s; Critic PASS.

## [2026-05-14] completed | S4 Tool Portfolio report consumer canary structured stderr diagnostics
- `tool_portfolio_report_consumer_canary.py::main()` failure stderr now emits exact 5-key JSON diagnostics: `error`, `reasonCode`, `reasonCodes`, `stage`, and `summaryEmitted`.
- Legacy `reasonCodes=[reasonCode]` and `summaryEmitted=false` are preserved; successful stdout summary schema is unchanged.
- Input failures use `input validation failed` / `TOOL_PORTFOLIO_REPORT_CLI_INPUT_INVALID` / `input`; output failures use `summary output failed` / `TOOL_PORTFOLIO_REPORT_CLI_OUTPUT_FAILED` / `output`.
- Verification: RED 4 failed reproduced missing error/reasonCode/stage; targeted structured stderr tests 4 passed; consumer canary tests 26 passed; related Tool Portfolio CLI/report suite 415 passed; full S4 pytest 1284 passed in 32.04s; Critic PASS.

## [2026-05-14] completed | s5 source kg serving nested object redaction v1
- Added Source KG context serving projection guard for oversized nested JSON objects (2048-byte inline cap) across repository snapshot, build context, analysis artifact set, graph node, graph edge, evidence snippet provenance, and rich IR provenance fields.
- Judge evidence now inherits the redacted Source KG nested-object projection, preventing routine answers from echoing large nested metadata/provenance while preserving byte-length/max/truncated/redacted metadata.
- Updated Source KG contract snapshot and canonical Knowledge Base API doc with servingContextResolution.nestedObjectPolicy.
- Verification: targeted 18 passed in 14.46s; focused Source KG/Judge/contract 101 passed in 95.76s; full knowledge-base 638 passed in 463.07s; ledger restored and diff checks passed.

## [2026-05-14] completed | S4 benchmark.compare structured stderr diagnostics
- Standalone benchmark.compare CLI failure stderr now emits exact 3-key JSON diagnostics for parse, threshold, artifact, payload, and report-output failures.
- Fixed reason-code mapping added for BENCHMARK_COMPARE_* failures; broken stderr writes are best-effort and still exit SystemExit(2).
- Verification: RED 6 failed before implementation; targeted 6 passed; test_benchmark.py 55 passed; benchmark/JULIET related 112 passed; full S4 pytest 1285 passed in 32.57s; Critic PASS; wiki validator PASS.

## [2026-05-14] completed | s5 judge source kg nested redaction validator v1
- Added Judge answer validation for Source KG nested-object redaction projections. Corrupted packets now emit SOURCE_KG_NESTED_OBJECT_REDACTION_INVALID if an over-limit nested object is still present, redaction/truncation flags are missing, or byte-length/max-inline metadata is inconsistent.
- Updated Judge contract snapshot and canonical Knowledge Base API docs to advertise answer.sourceCodeKgContextResolution.nestedObjectRedactionValidation.
- Verification: targeted 3 passed in 6.57s; focused Judge/API contract 32 passed in 81.44s; full knowledge-base 638 passed in 435.17s; ledger restored and diff checks passed.

## [2026-05-14] completed | S4 Juliet benchmark CLI structured stderr diagnostics
- Juliet benchmark CLI failure stderr now emits exact 3-key JSON diagnostics for parser, selector, artifact, payload, output, handoff, run, and report-build failures.
- Fixed JULIET_* reason-code mapping added; unknown argparse messages collapse to invalid Juliet arguments; broken stderr writes are best-effort and still exit SystemExit(2).
- Verification: RED 9 failed before implementation; targeted 9 passed; test_juliet_runner.py 58 passed; benchmark/JULIET related 113 passed; full S4 pytest 1286 passed in 32.98s; Critic implementation+docs review PASS; wiki validator PASS.

## [2026-05-14] completed | s5 source kg redacted context diagnostic v1
- Implemented Critic-approved non-silent diagnostics for redacted/truncated Source KG serving projections. Direct context now emits SOURCE_KG_CONTEXT_REDACTED/SOURCE_KG_CONTEXT_TRUNCATED diagnostics with field/byteLength/maxInlineBytes metadata and sets complete=false/partial=true for resolved-but-redacted context.
- Judge now treats redacted Source KG context as degraded source context: otherwise-complete affectedness answers become status=degraded_quality, qualityGate accepted_with_caveats, fallbackTrace includes non-silent source_code_kg_context fallback, and requiredInputs includes complete_or_consistent_source_code_kg_context.
- Updated Source KG contract, Judge contract, and canonical Knowledge Base API docs with projectionDiagnosticPolicy/redactedContextDiagnosticPolicy.
- Verification: targeted 19 passed in 14.91s; focused Source KG/Judge/API contract 116 passed in 133.19s; full knowledge-base 638 passed in 441.84s; ledger restored and diff checks passed.

## [2026-05-14] Completed S4 S3-facing staticEvidenceContract consumer canary projection hardening with Critic PASS | S4 Static Evidence consumer canary projection sanitization
- Changed pure JSON consumer canary to field-allowlist S3-facing statuses, generated reason codes, coverage surfaces, claim IDs, tool IDs, support statuses, and consumer policies.
- Malformed projection values, malformed tool anomaly reason codes, arbitrary coverage keys, and caller-spoofed unsafe sentinels now fail closed via canary-generated STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION in system/evidence/claim reason arrays only.
- Generated partial/degraded/unknown tool evidence and generated failure/degraded/unknown reason codes remain safe and are not misclassified as unsafe projection.
- Updated API contract, static evidence spec, S4 roadmap, and S4 handoff docs.
- Verification: RED/GREEN tests for unsafe projection/object keys, Critic-blocker compatibility/fail-closed cases, and spoofed sentinel; static evidence canary tests 15 passed; static evidence related tests 50 passed; full services/sast-runner suite 1292 passed in 32.79s; wiki validator PASS; Critic PASS.

## [2026-05-14] Completed follow-up S4 S3-facing staticEvidenceContract consumer canary hardening with Critic PASS | S4 Static Evidence consumer canary summary-only diagnostic spoofing
- Removed STATIC_EVIDENCE_CONTRACT_ABSENT and STATIC_EVIDENCE_CONTRACT_MALFORMED from producer reason-code allowlist while preserving direct missing/malformed fast-path summaries.
- Caller-provided ABSENT/MALFORMED summary-only diagnostics in present contracts now fail closed via canary-generated STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION and localStaticEvidenceReady=false.
- Updated API contract, static evidence spec, S4 roadmap, and S4 handoff docs to distinguish valid producer reason codes from canary-generated summary-only diagnostics.
- Verification: RED/GREEN summary-only diagnostic spoofing test; consumer canary tests 16 passed; static evidence related tests 51 passed; full services/sast-runner suite 1293 passed in 32.39s; wiki validator PASS; Critic PASS.

## [2026-05-14] completed | s5 source kg projection diagnostic budget v1
- Added bounded projection diagnostics for Source KG context serving. Projection redaction/truncation diagnostics are capped at 64 entries and overflow emits SOURCE_KG_CONTEXT_DIAGNOSTICS_TRUNCATED with field/totalCount/returnedCount/maxCount metadata.
- Addressed Critic REJECT by replacing Judge redacted-only diagnostic contract with unified projectionDiagnosticPolicy covering SOURCE_KG_CONTEXT_REDACTED, SOURCE_KG_CONTEXT_TRUNCATED, and SOURCE_KG_CONTEXT_DIAGNOSTICS_TRUNCATED. Strengthened Judge tests so rich-IR payload redaction and snippet text truncation both prove degraded_quality, accepted_with_caveats, non-silent fallback, and validator success.
- Updated canonical Knowledge Base API docs with maxProjectionDiagnostics=64 and Judge projectionDiagnosticPolicy semantics.
- Verification: targeted diagnostic budget/contract 5 passed in 8.05s; focused Source KG/Judge/API contract 117 passed in 135.27s; full knowledge-base 639 passed in 453.60s; ledger restored and diff checks passed.

## [2026-05-14] Completed S4 Tool Portfolio report consumer canary hardening with Critic PASS | S4 Tool Portfolio report consumer canary summary-only reason spoofing
- Removed Tool Portfolio canary-generated summary diagnostics from producer reason-code allowlist: TOOL_PORTFOLIO_REPORT_ABSENT, TOOL_PORTFOLIO_REPORT_MALFORMED, TOOL_PORTFOLIO_REPORT_SCHEMA_UNSUPPORTED, TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION.
- Caller-provided summary-only reasons in present valid reports are now omitted, converted into canary-generated TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION, and force toolPortfolioDecisionGradeUsable=false.
- Absent/malformed/wrong-schema fast paths remain unchanged and still emit fixed summary diagnostics.
- Updated API contract, Tool Portfolio experiment spec, S4 roadmap, and S4 handoff docs.
- Verification: RED/GREEN summary-only reason spoofing test; consumer canary tests 27 passed; related Tool Portfolio report/actual/consumer tests 295 passed; all Tool Portfolio tests 523 passed; full services/sast-runner suite 1294 passed in 32.77s; wiki validator PASS; Critic PASS.

## [2026-05-14] Completed S4 Tool Portfolio consumer list-shape hardening with Critic PASS | S4 Tool Portfolio report consumer canary list-shape fail-closed hardening
- Changed Tool Portfolio report consumer canary string-list projection to return values plus rejected-shape state.
- Malformed reasonCodes and decisionSupport.requiredFollowUps containers/items now add canary-generated TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION and force toolPortfolioDecisionGradeUsable=false instead of being silently dropped.
- Absent/None optional list fields remain compatible, valid allowlisted strings in proper lists are preserved, and malformed objects are not stringified.
- Updated API contract, Tool Portfolio experiment spec, S4 roadmap, and S4 handoff docs.
- Verification: RED/GREEN list-shape tests; consumer canary tests 29 passed; related Tool Portfolio report/actual/consumer tests 297 passed; all Tool Portfolio tests 525 passed; full services/sast-runner suite 1296 passed in 32.58s; wiki validator PASS; Critic PASS.

## [2026-05-14] completed | s5 judge source kg projection diagnostic contract parity v1
- Resolved Critic REJECT by making Judge contract advertise unified projectionDiagnosticPolicy for SOURCE_KG_CONTEXT_REDACTED, SOURCE_KG_CONTEXT_TRUNCATED, SOURCE_KG_CONTEXT_DIAGNOSTICS_TRUNCATED, and maxProjectionDiagnostics=64.
- Strengthened Judge behavior tests so rich-IR payload redaction and evidence snippet text truncation prove degraded_quality, accepted_with_caveats, non-silent fallbackTrace, and validate_judge_answer success.
- Updated canonical Knowledge Base API docs to replace redacted-only Judge policy wording with unified projectionDiagnosticPolicy wording.
- Verification: focused Source KG/Judge/API contract 117 passed in 129.28s; full knowledge-base 639 passed in 440.86s; ledger restored and diff checks passed.

## [2026-05-14] completed | S4 Tool Portfolio report consumer canary scalar fail-closed hardening
- Present malformed scalar projections now fail closed with canary-generated unsafe projection evidence while absent/None remains compatible.
- Verification: RED targeted scalar tests, GREEN targeted 2 passed, consumer canary 31 passed, related report/actual/consumer 299 passed, all Tool Portfolio 527 passed, full S4 1298 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] completed | S4 Tool Portfolio report consumer canary mapping/container-shape fail-closed hardening
- Present malformed object/map container projections now fail closed with canary-generated unsafe projection evidence while absent/None remains compatible.
- Verification: RED targeted container tests, GREEN targeted 4 passed, consumer canary 35 passed, related report/actual/consumer 303 passed, all Tool Portfolio 531 passed, full S4 1302 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] completed | s5 source kg compile commands artifact context v1
- Direct Source KG context and Judge evidence now include the source artifact referenced by buildContext.compileCommandsArtifactId, letting S3 verify build provenance without dumping full source artifacts.
- Served sourceArtifacts expose sourceRepositoryArtifactId, repositorySnapshotId, redacted artifactUri, mediaType, checksumSha256, storageMode, and bounded metadata/provenance. Raw artifactUri remains in the S5 ledger for replay/provenance.
- Updated Source KG contract, Judge contract, and canonical Knowledge Base API docs with sourceArtifacts tracked collection, compileCommandsArtifactPolicy, sourceArtifacts[].artifactUri redaction, and compileCommandsArtifactProjectionPolicy.
- Verification: targeted 5 passed in 4.90s; focused Source KG/Judge/API contract 119 passed in 133.32s; full knowledge-base 641 passed in 442.77s; ledger restored and diff checks passed.

## [2026-05-14] completed | S4 Tool Portfolio report consumer canary boolean decision-field fail-closed hardening
- Present malformed qualityGateAllowed/decisionGradeReady boolean decision fields now fail closed with canary-generated unsafe projection evidence while absent/None and real booleans remain compatible.
- Verification: RED targeted boolean tests, GREEN targeted 2 passed, consumer canary 37 passed, related report/actual/consumer 305 passed, all Tool Portfolio 533 passed, full S4 1304 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] completed | S4 Tool Portfolio report consumer canary duplicate tool-contribution identity fail-closed hardening
- Duplicate toolContributionDiagnostics toolId rows now fail closed with first-observed class preservation and canary-generated unsafe projection evidence.
- Verification: RED targeted duplicate test, GREEN targeted 1 passed, consumer canary 38 passed, related report/actual/consumer 306 passed, all Tool Portfolio 534 passed, full S4 1305 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] Completed S5 hardening loop for Judge Source KG URL redaction validation | s5 judge source kg url redaction validator v1
- Judge validator now rejects unredacted credential-bearing Source KG URL projections with SOURCE_KG_URL_REDACTION_INVALID for repositorySnapshot.repositoryUrl, sourceArtifacts[].artifactUri, and richIrArtifacts[].uri.
- Judge API contract advertises urlRedactionValidation under answer.sourceCodeKgContextResolution.
- Canonical Knowledge Base API wiki doc updated with judge-source-kg-url-redaction-validator-v1.
- Verified targeted tests, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] completed | S4 Static Evidence consumer canary map/container-shape fail-closed hardening
- Present non-object staticEvidenceContract map/container projections now fail closed with canary-generated unsafe projection evidence while absent/None remains compatible.
- Verification: RED targeted container tests, GREEN targeted 4 passed, consumer canary 20 passed, static evidence related 59 passed, full S4 1309 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] completed | S4 Static Evidence consumer canary duplicate matrix identity fail-closed hardening
- Duplicate toolEvidenceMatrix toolId and claimBoundaryMatrix claimId rows now fail closed with first-observed summary value preservation and canary-generated unsafe projection evidence.
- Verification: RED targeted duplicate tests, GREEN targeted 2 passed, consumer canary 22 passed, static evidence related 61 passed, full S4 1311 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] completed | S4 Static Evidence consumer canary summary schema version and exact-key lock
- Static Evidence consumer summaries now emit s4-static-evidence-contract-consumer-summary-v1 and tests exact-lock top-level S3-facing summary shape.
- Verification: RED targeted summary-schema test, GREEN targeted 1 passed, consumer canary 23 passed, static evidence related 62 passed, full S4 1312 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] Completed S5 contract parity loop for Judge compile-commands sourceArtifacts projection | s5 judge compile commands artifact contract parity v1
- Critic REJECT gap addressed: Judge compileCommandsArtifactProjectionPolicy now advertises servedFields matching Source KG compileCommandsArtifactPolicy.
- Contract clarifies sourceArtifacts as a dependent collection resolved via buildContext.compileCommandsArtifactId with separateContextResolutionEntry=false.
- Canonical Knowledge Base API wiki doc updated with judge-compile-commands-artifact-contract-parity-v1.
- Verified targeted contract test, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] completed | S4 Static Evidence consumer canary CLI smoke gate and structured diagnostics
- Static Evidence consumer canary now exposes a pure-JSON CLI smoke gate with exact summary stdout, fixed structured stderr, and 0/1/2 exit semantics.
- Verification: RED targeted CLI tests, GREEN targeted 7 passed, consumer canary 30 passed, static evidence related 69 passed, full S4 1319 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] completed | S4 Static Evidence consumer canary malformed nested scan-container classification
- Present non-object scan containers now classify as malformed rather than absent while absent/None remains missing-compatible.
- Verification: RED targeted nested-scan test, GREEN targeted 2 passed, consumer canary 32 passed, static evidence related 71 passed, full S4 1321 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] Completed Source KG/Judge runtime resolution accounting for compile-commands sourceArtifacts | s5 source artifact resolution accounting v1
- Source KG contextResolution now includes sourceArtifacts requested/resolved/missing IDs for buildContext.compileCommandsArtifactId dependent artifacts.
- Source KG and Judge contracts advertise resolutionAccounting with contextResolutionEntry=sourceArtifacts and missingDiagnosticField=sourceArtifactIds.
- Canonical Knowledge Base API wiki doc updated with source-kg-source-artifact-resolution-accounting-v1.
- Verified targeted RED/GREEN, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] completed | S4 Static Evidence consumer summary committed artifact and stale-artifact guard
- Canonical clean-ready static evidence consumer summary artifact now exact-matches helper/CLI output and tests reject extra/drifted summary artifacts.
- Verification: RED targeted artifact tests, GREEN targeted 4 passed, consumer canary 36 passed, static evidence related 75 passed, full S4 1325 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] completed | S4 Static Evidence localStaticEvidenceReady completeness invariant
- Static Evidence consumer local readiness now requires positive gates plus projected coverage, claim-boundary/status, and current-six tool matrix completeness.
- Verification: RED targeted completeness test, GREEN targeted 4 passed, consumer canary 38 passed, static evidence related 77 passed, full S4 1327 passed, wiki validator PASS.
- Critic implementation+docs review PASS, including API contract/spec/roadmap/handoff docs.

## [2026-05-14] Completed Judge validator for compile-commands source artifact context consistency | s5 judge compile commands artifact validator v1
- Judge validate_judge_answer now emits SOURCE_KG_COMPILE_COMMANDS_ARTIFACT_CONTEXT_INVALID when buildContext.compileCommandsArtifactId is absent from sourceArtifacts or unresolved/missing in contextResolution.sourceArtifacts.
- Judge API contract advertises compileCommandsArtifactValidation validated fields.
- Canonical Knowledge Base API wiki doc updated with judge-compile-commands-artifact-validator-v1.
- Verified targeted RED/GREEN, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] completed | S4 Tool Portfolio consumer decision-grade completeness invariant
- Tool Portfolio consumer summary now treats positive gates as necessary but insufficient for toolPortfolioDecisionGradeUsable=true.
- Otherwise-positive reports require available diagnostic surfaces, complete current-six toolContributionClasses, empty sanitized reasonCodes, and empty requiredFollowUps; incomplete projection emits TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION and returns not usable.
- Verification: targeted RED/GREEN completeness tests, 44 consumer tests, 312 related Tool Portfolio report/actual/consumer tests, 540 all Tool Portfolio tests, full S4 1333 passed, wiki validator PASS, Critic implementation+docs review PASS.

## [2026-05-14] Completed malformed compileCommandsArtifactId tolerance for Judge validator | s5 judge compile commands artifact validator tolerance v1
- Judge validator now reports SOURCE_KG_COMPILE_COMMANDS_ARTIFACT_CONTEXT_INVALID with reason compile_commands_artifact_id_invalid for malformed/non-string compileCommandsArtifactId instead of raising TypeError.
- Judge API contract advertises invalidIdReason.
- Canonical Knowledge Base API wiki doc updated with judge-compile-commands-artifact-validator-tolerance-v1.
- Verified targeted RED/GREEN, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] completed | S4 Tool Portfolio consumer runnerIntegrityOnly unsafe-projection fail-closed hardening
- runnerIntegrityOnly now publishes true only when sanitized runner-integrity signal is present and unsafe_projection is false.
- Unsafe summaries still expose sanitized threshold/reason context but the S3-facing convenience boolean fails closed.
- Verification: targeted RED/GREEN runner-integrity tests, 46 consumer tests, 314 related Tool Portfolio report/actual/consumer tests, 542 all Tool Portfolio tests, full S4 1335 passed, wiki validator PASS, Critic implementation+docs review PASS.

## [2026-05-14] mcp | register_wr | s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud.md

## [2026-05-14] completed | S4 completion audit and S3 WR handoff
- S4 completion audit found code/test/docs/Critic evidence satisfied for the current S4 hardening objective.
- Final verification: full services/sast-runner pytest 1335 passed in 31.90s; wiki validator PASS.
- Registered S3 WR wiki/canon/work-requests/s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud.md for finalized consumer-summary contract consumption.

## [2026-05-14] Completed Judge validator for Source KG contextResolution integrity | s5 judge source kg context resolution integrity validator v1
- Judge validate_judge_answer now emits SOURCE_KG_CONTEXT_RESOLUTION_INVALID when served Source KG scalar/collection IDs disagree with contextResolution resolved IDs.
- Judge API contract advertises contextResolutionIntegrityValidation with scalar/collection ID mappings and safe ID-only issue payload requirement.
- Canonical Knowledge Base API wiki doc updated with judge-source-kg-context-resolution-integrity-validator-v1.
- Verified targeted RED/GREEN, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] Completed Judge Source KG contextResolution shape validator and frozen reason taxonomy | s5 judge source kg context resolution shape validator v1
- Judge contextResolution integrity validator now rejects malformed requestedId/requestedIds/resolvedId/resolvedIds/missingIds shapes with SOURCE_KG_CONTEXT_RESOLUTION_INVALID reason taxonomy.
- Judge API contract advertises contextResolutionIntegrityValidation.reasonCodes.
- Canonical Knowledge Base API wiki doc updated with judge-source-kg-context-resolution-shape-validator-v1.
- Verified targeted RED/GREEN, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] Completed Judge contextResolution validator issue-payload URL redaction | s5 judge source kg context resolution issue redaction v1
- Judge SOURCE_KG_CONTEXT_RESOLUTION_INVALID issue payloads now redact credential-bearing URL-like served/resolved IDs before returning servedIds/resolvedIds diagnostics.
- Judge API contract advertises credentialBearingIdRedaction=true for contextResolutionIntegrityValidation.
- Canonical Knowledge Base API wiki doc updated with judge-source-kg-context-resolution-issue-redaction-v1.
- Verified targeted RED/GREEN, focused Source KG/Judge suites, full knowledge-base pytest, ledger restore, and diff checks.

## [2026-05-14] S5 Judge Threat Retrieval authority-boundary validator v1 completed | wiki/canon/api/knowledge-base-api.md
- Added contract decision tag judge-threat-retrieval-authority-boundary-validator-v1.
- Validator now rejects forged Threat Retrieval context authority, negativeEvidenceAllowed=true, and riskSignals[].authority escalation.
- Verification: targeted pytest 2 passed; focused pytest 159 passed; full services/knowledge-base pytest 642 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval authority-boundary issue redaction added | wiki/canon/api/knowledge-base-api.md
- Extended authority-boundary validator contract with credentialBearingAuthorityRedaction=true.
- Forged URL-like risk signal authority values are redacted in validator issue payloads.
- Final verification after redaction: targeted pytest 2 passed; focused pytest 159 passed; full services/knowledge-base pytest 642 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval child authority validator v1 completed | wiki/canon/api/knowledge-base-api.md
- Added decision tag judge-threat-retrieval-child-authority-validator-v1.
- Validator now rejects authority escalation on candidateEvidence, suppressedCandidateEvidence, candidatePoolPreview, weaknessSemantics, and attackSemantics, in addition to top-level/trace/equivalent/risk-signal authority checks.
- Judge contract now exposes validatedContextAuthorityFields and validatedRiskSignalAuthorityFields.
- Verification: targeted pytest 2 passed; focused pytest 160 passed; full services/knowledge-base pytest 643 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval authority issue metadata redaction v1 completed | wiki/canon/api/knowledge-base-api.md
- Added decision tag judge-threat-retrieval-authority-issue-metadata-redaction-v1.
- Equivalent advisory and risk-signal authority validation issues now include field-specific paths and redact credential-bearing diagnostic metadata IDs.
- Judge contract now exposes credentialBearingDiagnosticMetadataRedaction=true.
- Verification: targeted pytest 2 passed; focused pytest 161 passed; full services/knowledge-base pytest 644 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval generic authority metadata redaction fix completed | wiki/canon/api/knowledge-base-api.md
- Resolved Critic CHANGES_REQUESTED for judge-threat-retrieval-authority-issue-metadata-redaction-v1.
- context_authority_issue now redacts all string diagnostic metadata before issue payload emission, covering generic child authority fields such as candidateEvidence and suppressedCandidateEvidence.
- Verification after fix: targeted pytest 3 passed; focused pytest 161 passed; full services/knowledge-base pytest 644 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval validator diagnostic redaction v1 completed | wiki/canon/api/knowledge-base-api.md
- Added decision tag judge-threat-retrieval-validator-diagnostic-redaction-v1.
- Threat Retrieval validator now redacts credential-bearing ID metadata fields before returning issues, covering non-authority diagnostics such as rank sequence and candidate-pool preview mismatches.
- Judge contract now exposes validatorDiagnosticMetadataRedaction.redactedFields.
- Verification: targeted pytest 2 passed; focused pytest 162 passed; full services/knowledge-base pytest 645 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval validator field path policy v1 completed | wiki/canon/api/knowledge-base-api.md
- Added decision tag judge-threat-retrieval-validator-field-path-policy-v1.
- Threat Retrieval validator now backfills machine-readable field paths for known issue codes that previously emitted code-only or metadata-only issues.
- Judge contract exposes validatorIssueFieldPathPolicy with representative code-to-field mappings.
- Verification: targeted pytest 2 passed; focused pytest 162 passed; full services/knowledge-base pytest 645 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval validator field normalization v1 completed | wiki/canon/api/knowledge-base-api.md
- Added decision tag judge-threat-retrieval-validator-field-normalization-v1.
- Threat Retrieval validator now normalizes explicit relative issue fields, including trace field names and semantic response fields, to full evidence.threatRetrieval JSON paths.
- Judge contract exposes validatorIssueFieldPathPolicy.explicitRelativeFieldNormalization=true.
- Verification: targeted pytest 3 passed; focused pytest 162 passed; full services/knowledge-base pytest 645 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval validator field catalog v1 completed | wiki/canon/api/knowledge-base-api.md
- Added decision tag judge-threat-retrieval-validator-field-catalog-v1.
- Judge contract now exposes the full known Threat Retrieval validator issueFieldsByCode catalog, not only representative mappings.
- Verification: targeted pytest 1 passed; focused pytest 162 passed; full services/knowledge-base pytest 645 passed; ledger restored and diff --check passed.

## [2026-05-14] S5 Judge Threat Retrieval validator dynamic field catalog v1 completed | wiki/canon/api/knowledge-base-api.md
- Added decision tag judge-threat-retrieval-validator-dynamic-field-catalog-v1.
- Judge contract now exposes dynamicFieldIssueCodes for runtime-field issue families not represented by the static issueFieldsByCode catalog.
- Verification: targeted pytest 1 passed; focused pytest 162 passed; full services/knowledge-base pytest 645 passed; ledger restored and diff --check passed.

## [2026-05-14] implemented | S5 Judge Threat Retrieval validator dynamic field catalog v1
- Added validatorIssueFieldPathPolicy.dynamicFieldIssueCodes to the Knowledge Base Judge contract for runtime-derived Threat Retrieval issue families: trace-field missing, semantic response budget mismatch, context/equivalent/risk-signal authority invalid, and negative-evidence allowed.
- Contract tests now freeze dynamic field sources/static field sets for runtime field families outside the static issueFieldsByCode catalog.
- Verification: focused S5/Judge/Source KG suite 162 passed in 232.50s; full Knowledge Base suite 645 passed in 410.22s; S5 code/wiki diff checks passed.

## [2026-05-14] accepted | S5 judge-threat-retrieval-validator-dynamic-field-catalog-v1 Critic
- Critic ACCEPT: dynamicFieldIssueCodes covers runtime-derived Threat Retrieval issue families without misleading S3 consumers; contract snapshot and wiki API contract are adequate.
- Nonblocking risk: future dynamic issue families require manual dynamicFieldIssueCodes updates.

## [2026-05-14] implemented | S5 Judge Threat Retrieval validator issue-code coverage v1
- Added validatorIssueFieldPathPolicy.issueCodeCoverage to the Judge contract so S3 can see that the 43 known Threat Retrieval validator issue codes are covered by 37 static issue field mappings plus 6 dynamic issue field/source policies.
- Added contract test coverage that parses emitted THREAT_RETRIEVAL_* validator issue codes from app.judge.service and compares them with issueFieldsByCode ∪ dynamicFieldIssueCodes, preventing silent contract drift when new validator issue families are added.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.39s, Judge API contract file 16 passed in 33.28s, focused S5/Judge/Source KG suite 163 passed in 232.24s, full KB suite 646 passed in 411.69s, ledger restored, diff checks passed.

## [2026-05-14] accepted | S5 judge-threat-retrieval-validator-issue-code-coverage-v1 Critic
- Critic ACCEPT: coverage metadata is useful and honest for S3, and the source-string parsing drift guard is acceptable for the current literal validator issue-code style.
- Nonblocking risk: future dynamic or single-quoted issue-code generation would require centralizing issue-code constants.

## [2026-05-14] updated | S5 handoff readme closeout sync
- Updated wiki/canon/handoff/s5/readme.md to point to the current session history, 2026-05-14 full KB verification baseline (646 passed), focused S5/Judge/Source KG baseline (163 passed), and Judge Threat Retrieval validator field/catalog/coverage contract notes.
- The handoff now references issueCodeCoverage and the contract drift test that guards THREAT_RETRIEVAL_* validator issue-code catalog completeness.

## [2026-05-14] implemented | S5 Judge Threat Retrieval validator issue-code AST guard v1
- Replaced the Judge contract test's double-quote regex issue-code extraction with a Python AST string-literal scan so the drift guard covers THREAT_RETRIEVAL_* literals regardless of Python quote style.
- Added a regression test proving the extractor catches both double-quoted and single-quoted Threat Retrieval issue-code literals while ignoring non-Threat-Retrieval diagnostics.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.44s, Judge API contract file 17 passed in 31.06s, focused S5/Judge/Source KG suite 164 passed in 230.70s, full KB suite 647 passed in 410.89s, ledger restored, diff checks passed.

## [2026-05-14] blocked | S5 judge-threat-retrieval-validator-issue-code-ast-guard-v1 Critic attempt
- Periodic Critic review was attempted after implementation and full verification, but spawning the Critic subagent failed due to usage limit until May 20th, 2026 10:18 AM.
- Recorded as blocked_by_usage_limit; continuing autonomous TDD hardening because the loop directly removes the prior accepted Critic's nonblocking quote-style risk and all local verification gates passed.

## [2026-05-14] implemented | S5 Judge Threat Retrieval runtime diagnostic contract v1
- Added answer.threatRetrievalPolicies.runtimeDiagnostics to the Judge contract so S3 can discover that evidence.threatRetrieval.diagnostics is diagnostic-only and not negative evidence.
- The contract now documents THREAT_RETRIEVAL_NO_CONTEXT as an unknown-only/inconclusive context gap with negativeEvidenceAllowed=false and required consumer behavior treat_as_inconclusive_context_gap_not_component_safe.
- Verification: targeted RED failed before implementation, targeted GREEN 1 passed in 1.43s, adjacent Judge contract + live no-context behavior 18 passed in 32.67s, focused S5/Judge/Source KG suite 164 passed in 233.68s, full KB suite 647 passed in 408.24s, ledger restored, diff checks passed.

## [2026-05-14] implemented | S5 Judge Threat Retrieval runtime diagnostic coverage v1
- Centralized runtime Threat Retrieval diagnostic contract metadata in THREAT_RETRIEVAL_RUNTIME_DIAGNOSTIC_CODES and added runtimeDiagnostics.diagnosticCodeCoverage to the Judge contract.
- Added a contract drift test that parses THREAT_RETRIEVAL_* runtime diagnostic literals from app.threat_retrieval.evidence and asserts exact coverage by answer.threatRetrievalPolicies.runtimeDiagnostics.diagnosticCodes.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.35s, Judge API contract file 18 passed in 31.50s, focused S5/Judge/Source KG suite 165 passed in 227.86s, full KB suite 648 passed in 409.01s, ledger restored, diff checks passed.

## [2026-05-14] implemented | S5 Judge Source KG issue/diagnostic catalog v1
- Added sourceCodeKgContextResolution.issueAndDiagnosticCatalog to the Judge contract, exposing all 12 known Judge-emitted SOURCE_KG_* issue/diagnostic codes by family with negativeEvidenceAllowed=false and an explicit inconclusive-context diagnostic consumer policy.
- Added a contract drift test that parses SOURCE_KG_* literals from app.judge.service and asserts exact coverage by the sourceCodeKgContextResolution issue/diagnostic catalog.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.37s, adjacent Judge contract/answer contract 37 passed in 75.16s, focused S5/Judge/Source KG suite 166 passed in 230.99s, full KB suite 649 passed in 402.33s, ledger restored, diff checks passed.

## [2026-05-14] updated | S5 handoff related session link sync v1
- Aligned wiki/canon/handoff/s5/readme.md related-documents table with the already-updated operating notes: latest work session now points to session-omx-1778663363090-gw9lq6 and previous closeout session points to session-omx-1776068998838-lap2tj.
- Verification: wiki diff check passed.

## [2026-05-14] implemented | S5 Source KG serving diagnostic coverage v1
- Added servingContextResolution.diagnosticCodeCoverage to the Source Code KG contract for the 5 known ledger-emitted SOURCE_KG_CONTEXT_* serving diagnostics.
- Added a contract drift test that parses SOURCE_KG_CONTEXT_* literals from app.ledger.repository and asserts exact coverage by servingContextResolution.diagnosticCodes.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.41s, Source KG contract/service 87 passed in 50.79s, focused S5/Judge/Source KG suite 167 passed in 226.42s, full KB suite 650 passed in 406.95s, ledger restored, diff checks passed.

## [2026-05-14] implemented | S5 Judge Source KG serving diagnostic catalog v1
- Added sourceCodeKgContextResolution.servingContextDiagnosticCatalog to the Judge contract, mirroring the direct Source KG contract's 5 ledger-emitted SOURCE_KG_CONTEXT_* diagnostics and coverage metadata at the Judge answer location evidence.sourceCodeKg.contextResolution.diagnostics.
- Added a Judge contract drift test that parses SOURCE_KG_CONTEXT_* literals from app.ledger.repository and asserts exact coverage by the Judge servingContextDiagnosticCatalog.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.42s, adjacent Judge/Source KG contracts 42 passed in 71.10s, focused S5/Judge/Source KG suite 168 passed in 226.15s, full KB suite 651 passed in 404.52s, ledger restored, diff checks passed.

## [2026-05-14] implemented | S5 Judge relation conflict issue-code catalog v1
- Added relationConflictVisibility.issueCodeCatalog to the Judge contract, exposing all known relation/affectedness/identity-alias conflict issue codes and hard conflict kinds from the typed conflict model.
- Added a contract drift test comparing the Judge contract catalog to app.relations.conflict_model.ISSUE_CODE_BY_KIND and HARD_CONFLICT_KINDS so new conflict issue families cannot silently remain undocumented.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.40s, Judge contract + relation conflict model 32 passed in 57.71s, expanded focused suite 180 passed in 251.75s, full KB suite 652 passed in 403.34s, ledger restored, diff checks passed.

## [2026-05-14] implemented | S5 Judge forbidden inference policy v1
- Added forbiddenInferencePolicy to the Judge contract, declaring baseline S5 forbidden inferences, the source constant app.analyst.brief.BASELINE_FORBIDDEN_INFERENCES, count 5, and the S3 final authority boundary.
- Changed contract tests from subset checking to exact equality with BASELINE_FORBIDDEN_INFERENCES so S5 final-security/clean-pass/accepted-claim/exploitability/project-safety boundary drift is caught.
- Verification: targeted RED failed before implementation, targeted GREEN 2 passed in 1.32s, adjacent Judge/Analyst tests 51 passed in 71.38s, expanded focused suite 192 passed in 250.56s, full KB suite 653 passed in 401.20s, ledger restored, diff checks passed.

## [2026-05-14] judge-runtime-vocabulary-policy-v1 | S5 Knowledge Base Judge contract
- Added answer.runtimeVocabularyPolicy to the Judge contract so runtime vocabulary count/parity, offline quality metric vocabulary prohibition, and S3 final-claim boundary are machine-readable.
- TDD evidence: targeted RED failed 2 tests before implementation; targeted GREEN passed 2 tests after implementation.
- Verification: adjacent Judge contract/answer tests 41 passed; expanded focused S5/Judge/Source KG suite 193 passed in 249.00s; full services/knowledge-base suite 654 passed in 395.12s; ledger restored; diff checks passed.

## [2026-05-14] judge-quality-gate-policy-v1 | S5 Knowledge Base Judge contract
- Added answer.qualityGatePolicy to the Judge contract, declaring allowed gates, merge precedence, hard-fail policy, score/diagnostics locations, negativeEvidenceAllowed=false, and the S3 final-verdict boundary.
- TDD evidence: targeted RED failed 2 tests before implementation; targeted GREEN passed 2 tests after implementation.
- Verification: adjacent Judge/Conflict tests 53 passed; expanded focused S5/Judge/Source KG suite 194 passed in 244.73s; full services/knowledge-base suite 655 passed in 398.71s; ledger restored; diff checks passed.

## [2026-05-14] judge-answer-status-policy-v1 | S5 Knowledge Base Judge contract
- Added answer.answerStatusPolicy to the Judge contract, declaring allowed answer statuses, reserved runtime vocabulary, degraded/missing-input status mapping, negativeEvidenceAllowed=false, and the non-complete status consumer boundary.
- TDD evidence: targeted RED failed 2 tests before implementation; targeted GREEN passed 2 tests after implementation.
- Verification: adjacent Judge/Conflict tests 54 passed; expanded focused S5/Judge/Source KG suite 195 passed in 247.82s; full services/knowledge-base suite 656 passed in 390.19s; ledger restored; diff checks passed.

## [2026-05-14] judge-verdict-policy-v1 | S5 Knowledge Base Judge contract
- Added answer.verdictPolicy to the Judge contract, declaring allowed verdicts, reserved conflict vocabulary, conflict representation through uncertainty.conflicts plus rejected quality gate, not-affected/unknown consumer policies, and the S3 final-authority boundary.
- TDD evidence: targeted RED failed 2 tests before implementation; targeted GREEN passed 2 tests after implementation.
- Verification: adjacent Judge/Conflict tests 55 passed; expanded focused S5/Judge/Source KG suite 196 passed in 246.36s; full services/knowledge-base suite 657 passed in 396.67s; ledger restored; diff checks passed.

## [2026-05-14] judge-uncertainty-followup-policy-v1 | S5 Knowledge Base Judge contract
- Added answer.uncertaintyPolicy to the Judge contract, declaring required uncertainty fields, required-input vocabulary, conflict and follow-up locations, follow-up request kinds, owner lanes, non-empty-on-unknown/degraded behavior, and negativeEvidenceAllowed=false.
- TDD evidence: targeted RED failed 2 tests before implementation; targeted GREEN passed 2 tests after implementation.
- Verification: adjacent Judge/Conflict tests 56 passed; expanded focused S5/Judge/Source KG suite 197 passed in 249.21s; full services/knowledge-base suite 658 passed in 401.70s; ledger restored; diff checks passed.

## [2026-05-14] judge-control-effects-policy-v1 | S5 Knowledge Base Judge contract
- Added answer.controlEffectsPolicy to the Judge contract, declaring appliedControls/controlEffects locations, exclude suppression locations for affectedness and Threat Retrieval evidence, suppressed-all affectedness outcome, and negativeEvidenceAllowed=false.
- TDD evidence: targeted RED failed 2 tests before implementation; targeted GREEN passed 2 tests after implementation.
- Verification: adjacent Judge/Conflict tests 57 passed; expanded focused S5/Judge/Source KG suite 198 passed in 247.17s; full services/knowledge-base suite 659 passed in 404.95s; ledger restored; diff checks passed.

## [2026-05-14] judge-fallback-trace-policy-v1 | S5 Knowledge Base Judge contract
- Added answer.fallbackTracePolicy to the Judge contract, declaring required fallbackTrace fields, known source-context/control-validation fallback vocabulary, silentFallbackAllowed=false, diagnostics/rejected-control locations, and negativeEvidenceAllowed=false.
- TDD evidence: targeted RED failed 2 tests before implementation; targeted GREEN passed 2 tests after implementation.
- Verification: adjacent Judge/Conflict tests 58 passed; expanded focused S5/Judge/Source KG suite 199 passed in 255.01s; full services/knowledge-base suite 660 passed in 393.40s; ledger restored; diff checks passed.

## [2026-05-18] completed | S4 finalization audit for S3-safe S4 tool consumption
- Critic PASS_WITH_CHANGES found no missing S4-side implementation/doc/test artifact and required reusing the existing final S4-to-S3 WR rather than registering a duplicate.
- Existing final WR confirmed: wiki/canon/work-requests/s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud.md.
- Final verification: services/sast-runner pytest 1335 passed in 42.04s; wiki validator PASS.

## [2026-05-18] mcp | complete_wr | s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b
- Lane s1-qa completed recipient-side handling
- Status: open

## [2026-05-18] mcp | complete_wr | s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | complete_wr | s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | complete_wr | s2-to-s8-post-merge-s8-follow-up-pull-latest-main-then-fix-the-reviewed-container-workspa
- Lane s8 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | complete_wr | s2-to-s8-sync-to-the-merged-s8-baseline-and-use-wr-git-pull-reply-flow-for-next-handoffs
- Lane s8 completed recipient-side handling
- Status: completed

## [2026-05-18] S5 added machine-readable Judge reasoningPathPolicy to the Knowledge Base API contract | S5 Judge reasoning path policy v1
- answer.reasoningPathPolicy freezes reasoningPath required fields step/status and the runtime step catalog for Source KG resolution, decision-cache loading, component identity, affectedness evaluation, exclude control application, Threat KB context assembly, and missing input checks.
- Consumer policy states reasoningPath is explainability trace, not S3 final security verdict or negative evidence.
- Verification completed: targeted 2 passed, adjacent 59 passed, focused 200 passed, full services/knowledge-base 661 passed; ledger restored.

## [2026-05-18] mcp | register_wr | s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c
- Registered request WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c.md

## [2026-05-18] Registered canonical S4 request requiring S3 to safely consume all current S4 v0.11.2 API/evidence surfaces | S4->S3 full S4 API/evidence consumption contract WR
- WR: wiki/canon/work-requests/s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c.md
- Critic result before registration: PASS_WITH_CHANGES; required additions incorporated before registration.
- Key coverage: request-side /v1/scan semantics, SDK/BuildProfile semantics, current-six order, metadata scope, redacted diagnostics, consumer canary contracts, forbidden conclusions, and S3 test expectations.

## [2026-05-18] S5 added Judge answer validator enforcement for reasoningPath contract | S5 Judge reasoning path validator v1
- validate_judge_answer now reports missing/non-list reasoningPath, missing step/status, non-dict entries, and unknown step values.
- Judge contract and validator share the same reasoning-path step vocabulary via JUDGE_REASONING_PATH_STEPS.
- Verification completed: RED 1 failed before implementation, targeted GREEN 2 passed, adjacent 60 passed, focused 201 passed, full services/knowledge-base 662 passed; ledger restored.

## [2026-05-18] mcp | register_wr | s3-to-s4-s3-reply-s4-v0.11.2-api-and-evidence-contracts-fully-consumed
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-s4-v0.11.2-api-and-evidence-contracts-fully-consumed.md

## [2026-05-18] mcp | complete_wr | s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] S3 completed S4 v0.11.2 API/evidence contract consumption WR | S3 S4 v0.11.2 contract consumption
- Incoming WR completed: wiki/canon/work-requests/s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c.md
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-s4-v0.11.2-api-and-evidence-contracts-fully-consumed.md
- Docs updated: wiki/canon/handoff/s3/readme.md and wiki/canon/specs/analysis-agent.md
- Verification: Analysis Agent 681 passed; Build Agent 396 passed; wiki validator PASS; Critic implementation PASS

## [2026-05-18] S5 clarified Judge reasoningPathPolicy sequence semantics for cache-hit answers | S5 Judge reasoning path sequence semantics v1
- reasoningPathPolicy.stepCatalog is explicitly allowed vocabulary, not a mandatory per-response sequence.
- perResponseSequenceRequired=false and cacheHitMayOmitAffectednessSteps=true clarify that cache-hit answers may omit affectedness evaluation steps when cached fragments supply the result.
- Verification completed: RED 2 failed before implementation, targeted GREEN 2 passed, adjacent 60 passed, focused 201 passed, full services/knowledge-base 662 passed; ledger restored.

## [2026-05-18] S5 expanded reasoningPath validator regression coverage | S5 Judge reasoning path validator case coverage v1
- Added direct test assertions for non-list reasoningPath, non-object reasoningPath entries, and missing step in addition to missing path/status and unknown step.
- No production-code change was required because the validator already covered these cases.
- Verification completed: targeted 1 passed, adjacent 60 passed, focused 201 passed, full services/knowledge-base 662 passed; ledger restored.

## [2026-05-18] S5 exposed machine-readable reasoningPath validator issue-code catalog | S5 Judge reasoning path validator issue catalog v1
- answer.reasoningPathPolicy.validatorIssueCatalog now exposes all known REASONING_PATH_* issue codes.
- Catalog marks reasoning-path validator issues as contract quality failures, not security evidence, with negativeEvidenceAllowed=false.
- Verification completed: RED 2 failed before implementation, targeted GREEN 2 passed, adjacent 61 passed, focused 202 passed, full services/knowledge-base 663 passed; ledger restored.

## [2026-05-18] mcp | register_wr | s5-to-s3-s3-consume-judge-reasoningpath-policy-and-add-cache-hit-consumer-canary
- Registered request WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-consume-judge-reasoningpath-policy-and-add-cache-hit-consumer-canary.md

## [2026-05-18] S5 registered a work request for S3 to add Judge reasoningPath cache-hit consumer canary | S5 to S3 Judge reasoningPath consumer canary request
- WR path: wiki/canon/work-requests/s5-to-s3-s3-consume-judge-reasoningpath-policy-and-add-cache-hit-consumer-canary.md
- Request asks S3 to treat reasoningPath stepCatalog as allowed vocabulary, not mandatory sequence, and REASONING_PATH_* issues as contract-quality diagnostics, not vulnerability evidence.
- This closes the remaining Critic non-blocking risk from the S5 side without editing S3-owned code.

## [2026-05-18] S5 added Judge answer validator enforcement for fallbackTrace contract | S5 Judge fallback trace validator v1
- validate_judge_answer now rejects non-list fallbackTrace, non-object entries, missing stage/fallback/silent, unknown stage, unknown fallback, and silent=true.
- Source-context fallback checks ignore malformed entries after recording fallback trace issues rather than crashing.
- Verification completed: RED failed before implementation with AttributeError, targeted GREEN 3 passed, adjacent 62 passed, focused 203 passed, full services/knowledge-base 664 passed; ledger restored.

## [2026-05-18] mcp | register_wr | s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce
- Registered question WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce.md

## [2026-05-18] mcp | register_wr | s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p
- Registered question WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p.md

## [2026-05-18] S5 exposed machine-readable fallbackTrace validator issue-code catalog | S5 Judge fallback trace validator issue catalog v1
- answer.fallbackTracePolicy.validatorIssueCatalog now exposes all known FALLBACK_TRACE_* issue codes.
- Catalog marks fallback trace validator issues as contract quality failures, not security evidence, with negativeEvidenceAllowed=false.
- Verification completed: RED 2 failed before implementation, targeted GREEN 2 passed, adjacent 63 passed, focused 204 passed, full services/knowledge-base 665 passed; ledger restored.

## [2026-05-18] mcp | register_wr | s5-to-s3-s4-s3-s4-consume-judge-fallbacktrace-validator-issue-catalog-without-negative-evide
- Registered request WR for s3, s4
- Path: wiki/canon/work-requests/s5-to-s3-s4-s3-s4-consume-judge-fallbacktrace-validator-issue-catalog-without-negative-evide.md

## [2026-05-18] S5 registered a work request for S3/S4 fallbackTrace validator issue catalog consumer canaries | S5 to S3/S4 Judge fallbackTrace consumer canary request
- WR path: wiki/canon/work-requests/s5-to-s3-s4-s3-s4-consume-judge-fallbacktrace-validator-issue-catalog-without-negative-evide.md
- Request asks S3/S4 to treat FALLBACK_TRACE_* issue codes as S5 contract-quality diagnostics, not vulnerability evidence or clean-pass evidence.
- This closes the remaining Critic non-blocking risk from the S5 side without editing S3/S4-owned code.

## [2026-05-18] mcp | register_wr | s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction.md

## [2026-05-18] mcp | register_wr | s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-.md

## [2026-05-18] mcp | complete_wr | s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] S3 replied ACK_WITH_CORRECTIONS to S4 first-class paper static-evidence endpoint direction | S3 review of S4 paper static-evidence endpoint
- Incoming WR: wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction.md
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-.md
- Position: first-class endpoint preferred over /v1/scan extension; no buildCommand; corrections requested for portable compileContext, stable IDs, schemas, per-surface statuses, provenance, checksums, and no semantic overreach

## [2026-05-18] mcp | register_wr | s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy.md

## [2026-05-18] mcp | register_wr | s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p.md

## [2026-05-18] mcp | complete_wr | s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] S3 replied ACK_WITH_CORRECTIONS to S4 bundle shape and ID policy | S3 review of S4 paper static-evidence bundle shape
- Incoming WR: wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy.md
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p.md
- Accepted: fixed full S4 paper bundle, bounded_partial evidence model, input digests, stable producer ID namespaces, flat arrays, first-class library inventory/diff surface
- Corrections: bundleProfile/surfacePolicy, per-surface status/counts, portable path/digest canonicalization, stable producer evidenceId vs caseEvidenceRef split, artifact checksum canonicalization

## [2026-05-18] S5 added Judge answer validator enforcement for controlEffects contract | S5 Judge control effects validator v1
- validate_judge_answer now rejects non-list controlEffects, non-object entries, missing control/suppression fields, unknown controls, missing suppression trace when suppressedAffectedness exists, and suppressed-all clean-pass/complete states.
- answer.controlEffectsPolicy.validatorIssueCatalog exposes all known CONTROL_EFFECT* issue codes plus allowed controls and required fields.
- Verification completed: RED 1 failed before implementation, targeted GREEN 4 passed, adjacent 65 passed, focused 206 passed, full services/knowledge-base 667 passed; ledger restored.

## [2026-05-18] mcp | complete_wr | s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | register_wr | s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-.md

## [2026-05-18] mcp | register_wr | s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-.md

## [2026-05-18] mcp | complete_wr | s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] S3 replied ACK_WITH_CORRECTIONS to S4 checksum/hash removal proposal | S3 review of S4 checksum removal proposal
- Incoming WR: wiki/canon/work-requests/s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-.md
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-.md
- S3 agrees checksum/hash/digest/fingerprint concepts should be removed from the S4 paper API/paper-facing bundle semantics
- Replacement: opaque S3-owned refs plus S4 request/run/bundle refs, schema/profile refs, and row-level join refs
- Prior artifactChecksum canonicalization request is superseded and withdrawn

## [2026-05-18] mcp | complete_wr | s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | register_wr | s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i.md

## [2026-05-18] mcp | complete_wr | s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | complete_wr | s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | register_wr | s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus.md

## [2026-05-18] mcp | complete_wr | s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] S3 accepted S4 final paper static-evidence producer contract after consensus | S4 paper static-evidence consensus complete
- Incoming WR: wiki/canon/work-requests/s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i.md
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus.md
- S3 ACKed first-class endpoint /v1/paper/static-evidence, opaque refs/no checksums, producer/run refs, fixed full-bundle profile, bounded_partial status, flat arrays, row-local trace blocks, opaque S4 IDs, first-class library evidence, and local validation boundary

## [2026-05-18] S5 fixed Critic-reported missing top-level controlEffects suppression-trace gap | S5 Judge control effects validator Critic fix
- Critic found that suppressedAffectedness with missing top-level controlEffects bypassed CONTROL_EFFECT_SUPPRESSION_TRACE_MISSING.
- Added regression for missing top-level controlEffects and fixed _control_effect_validation_issues to inspect suppressedAffectedness before returning on missing key.
- Post-Critic verification completed: targeted 3 passed, adjacent 65 passed, focused 206 passed, full services/knowledge-base 667 passed; ledger restored.

## [2026-05-18] mcp | register_wr | s5-to-s3-s3-consume-judge-controleffects-validator-catalog-without-clean-pass-semantics
- Registered request WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-consume-judge-controleffects-validator-catalog-without-clean-pass-semantics.md

## [2026-05-18] S3 drafted paper pipeline design and paper analysis API from S3/S4 consensus | S3 paper pipeline design/API draft
- Design draft: wiki/canon/specs/paper-analysis-pipeline-design.md
- API draft: wiki/canon/api/paper-analysis-api.md
- S4 consensus incorporated: first-class /v1/paper/static-evidence, opaque refs/no checksums, fixed full-bundle profile, bounded_partial status, flat arrays, row-local trace, first-class library evidence
- S5 marked provisional/TBD pending consensus
- Critic loop: initial PASS_WITH_CHANGES applied; final PASS_WITH_CHANGES material edits applied
- Validation: wiki validator PASS and git diff --check PASS for draft pages

## [2026-05-18] mcp | complete_wr | s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | register_wr | s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze.md

## [2026-05-18] mcp | register_wr | s3-to-s4-s3-reply-ack-and-patched-s4-paper-api-tightening-requests
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-ack-and-patched-s4-paper-api-tightening-requests.md

## [2026-05-18] mcp | complete_wr | s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] S3 patched paper API/design draft from S4 pre-freeze review | S4 paper API tightening WR reflected by S3
- Incoming WR: wiki/canon/work-requests/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze.md
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-ack-and-patched-s4-paper-api-tightening-requests.md
- Updated: wiki/canon/api/paper-analysis-api.md
- Updated: wiki/canon/specs/paper-analysis-pipeline-design.md
- Accepted changes: targetMetadata surface, full surfaceStatus coverage for singleton/top-level surfaces, producer serviceVersion provenance, duplicated-ref consistency rules, case-local artifact indentation fix
- Validation: wiki validator PASS and git diff --check PASS

## [2026-05-18] mcp | complete_wr | s3-to-s4-s3-reply-ack-and-patched-s4-paper-api-tightening-requests
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] judge-control-effects-trace-scope-v1 completed | S5 Knowledge Base Judge contract
- Added explicit Judge controlEffects trace scope fields: controlEffectsTraceRequiredFor=evidence.suppressedAffectedness and threatRetrievalSuppressionTraceOwner=answer.threatRetrievalPolicies.suppressedCandidateResponseBudget.
- Updated canonical Knowledge Base API contract, S5 handoff, and S5 session history.
- Verification: targeted trace-scope contract 2 passed, adjacent Judge contract/answer/conflict 66 passed, focused S5/Judge/Source KG 207 passed, full services/knowledge-base 668 passed; ledger restored.

## [2026-05-18] judge-control-effects-trace-alignment-v1 completed | S5 Knowledge Base Judge contract
- Added exact set-union alignment between evidence.suppressedAffectedness advisory/external IDs and controlEffects suppressedAdvisoryIds/suppressedExternalIds.
- Added CONTROL_EFFECT_SUPPRESSED_AFFECTEDNESS_MISMATCH and exposed traceAlignment in answer.controlEffectsPolicy.excludeSuppression.
- Verification: targeted control-effects alignment 4 passed, adjacent Judge contract/answer/conflict 67 passed, focused S5/Judge/Source KG 208 passed, full services/knowledge-base 669 passed; ledger restored.

## [2026-05-18] judge-control-effects-accepted-control-alignment-v1 completed | S5 Knowledge Base Judge contract
- Added accepted-control/suppression alignment: each evidence.suppressedAffectedness item must have at least one normalized advisory/risk-signal key covered by appliedControls.accepted.exclude.
- Added CONTROL_EFFECT_ACCEPTED_CONTROL_MISMATCH and exposed acceptedControlAlignment in answer.controlEffectsPolicy.excludeSuppression.
- Verification: targeted accepted-control alignment 4 passed, adjacent Judge contract/answer/conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] created-master-plan | AEGIS TraceAudit benchmark master plan
- Created canonical master artifact: wiki/canon/specs/aegis-traceaudit-benchmark-master.md
- Benchmarks fixed as Trace50, Audit120, FaultBench, and TriageQ secondary study.
- Related-work synthesis covers SastBench, ZeroFalse, Sifting the Noise, QASecClaw, CodeCureAgent, IRIS, Agentic Benchmark Checklist, SecVulEval, PrimeVul, DiverseVul, Devign, OWASP Benchmark, SARD, and human-audit/XAI measurement sources.
- Critic PASS_WITH_CHANGES was incorporated; wiki validation and diff-check passed.
- Existing S4/S3 consensus docs paper-analysis-api.md and paper-analysis-pipeline-design.md were preserved as source references, not rewritten.

## [2026-05-18] judge-control-effects-risk-signal-key-contract-v1 completed | S5 Knowledge Base Judge contract
- Added acceptedControlAlignment.normalizedKeyFields for advisoryId, advisoryExternalId, riskSignals[].payload.cve, and riskSignals[].payload.cveID.
- Added regression coverage proving risk-signal CVE keys can explain accepted exclude suppression even when affectedness external IDs differ.
- Verification: targeted risk-signal key contract 4 passed, adjacent Judge contract/answer/conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] judge-fallback-trace-payload-validator-v1 completed | S5 Knowledge Base Judge contract
- Made fallbackTrace diagnosticsLocationByFallback executable: partial_context_resolution requires diagnostics[] and unsupported_controls_rejected requires rejected[].
- Added FALLBACK_TRACE_DIAGNOSTICS_MISSING and FALLBACK_TRACE_REJECTED_CONTROLS_MISSING to the fallback validator issue catalog.
- Verification: targeted fallback payload validator 3 passed, adjacent Judge contract/answer/conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] hardened-canonical-anchor | AEGIS TraceAudit benchmark master plan
- Reflected external review into wiki/canon/specs/aegis-traceaudit-benchmark-master.md.
- Added canonical-anchor/supersedes language for legacy Qwen/frontier parity protocols.
- Added S5 minimum evidence semantics, producer-boundary contract, UNKNOWN taxonomy, metric-validity checklist, B4 sequential reveal, Audit120 workload plan, FaultBench class split, and TriageQ secondary-preservation scope.
- Added industrial LLM false-alarm reduction and vulnerability-explanation practitioner studies as related work.
- Marked aegis-for-paper triage-core-v1 README/protocol as subordinate scaffold pointing to the wiki anchor.
- Validation: wiki validate PASS; git diff --check PASS for touched wiki and paper-workspace files.

## [2026-05-18] freeze-readiness-operationalized | AEGIS TraceAudit benchmark master plan
- Reflected 2026-05-18 uploaded-version review into wiki/canon/specs/aegis-traceaudit-benchmark-master.md.
- Added primary success rule: B4 must beat B2 on audit_accuracy or wrong_verdict_detection_rate without exceeding safety harm margin, with Trace50/FaultBench floors passing.
- Added packet presentation controls and packet-size covariates to prevent B2/B4 UI/length confounds.
- Added Audit120 denominator floors, oracle card schema, reviewer blinding/order policy, and B4 sequential-reveal reliance controls.
- Added S5_FREEZE_GATE, FaultBench ordering policy, and B5 ablation scope cap.
- Validation: wiki validate PASS; git diff --check PASS for the master artifact.

## [2026-05-18] created-paper-dossier | AEGIS TraceAudit paper dossier
- Created wiki/canon/specs/aegis-traceaudit-paper-dossier.md as a pre-experiment paper dossier.
- The dossier freezes result-independent thesis, plot, section outline, benchmark layers, primary success rule, reviewer protocol, oracle contract, result interpretation matrix, red lines, and pre-experiment checklist.
- It references aegis-traceaudit-benchmark-master.md as anchor and keeps empirical claim strength result-dependent.
- Validation: wiki validate PASS; git diff --check PASS for the dossier.

## [2026-05-18] created-critic-approved-anchor-guideline | AEGIS TraceAudit pre-paper anchor guideline
- Created wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md as the single pre-paper anchor guideline synthesizing benchmark master, paper dossier, paper pipeline/API drafts, dataset/harness state, and related work positioning.
- Critic initial verdict: PASS_WITH_CHANGES; incorporated required changes for artifact bundle, S5 visible row schema, reviewer protocol, statistics plan, failure branches, source refs, and S4 bounded_partial semantics.
- Critic follow-up verdict: PASS.
- Validation: wiki validate PASS; git diff --check PASS.

## [2026-05-18] Judge uncertainty/follow-up validator contract hardened | S5 judge-uncertainty-followup-validator-v1
- Added executable validator issue catalog for uncertainty/followUpAffordances so S3/S4 re-query guidance cannot silently drift from contract vocabulary.
- Validation rejects missing uncertainty required fields, unknown requiredInputs, malformed follow-up affordances, unknown requestKind/ownerLane, and missing follow-up reason.
- Verification: targeted 3 passed, adjacent Judge/Conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] Resolved Critic API doc vocabulary drift | S5 judge-uncertainty-followup-validator-v1 Critic fix
- Critic rejected the loop because Required output fields still listed reserved Judge verdict/status vocabulary as if emitted.
- Updated wiki/canon/api/knowledge-base-api.md so emitted verdicts are affected/not_affected/unknown only and emitted statuses are complete/requires_requery/insufficient_input/degraded_quality only, with conflicting/stale_cache/policy_blocked documented as reserved vocabulary.

## [2026-05-18] versioned-v3-critic-pass | AEGIS TraceAudit pre-paper anchor guideline
- Created v1 snapshot: wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline-v1.md.
- Created v2 external-review incorporation draft: wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline-v2.md.
- Critic reviewed v2 and returned PASS with no remaining must-fix items.
- Promoted v2 to v3 and updated latest alias: wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md now matches v3 semantics.
- v2/v3 additions include primary margins, endpoint family rule, human-subjects protocol, reviewer criteria, oracle independence, B2/B4 evidence logging fixes, source/license gates, Trace50-to-Audit120 feasibility, S5 gate nuance, and artifact release tiers.
- Validation: wiki validate PASS; git diff --check PASS.

## [2026-05-18] Judge fallback trace payload cardinality hardened | S5 judge-fallback-trace-payload-cardinality-v1
- Strengthened fallback trace validator so partial_context_resolution requires non-empty diagnostics[] and unsupported_controls_rejected requires non-empty rejected[].
- GET /v1/contracts/judge now advertises payloadCardinalityByFallback with minItems=1 for those actionable fallback payloads.
- Verification: targeted 3 passed, adjacent Judge/Conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] Promoted TraceAudit pre-paper anchor to v4 after Critic review | AEGIS TraceAudit pre-paper anchor guideline v4
- Created wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline-v4.md from v3.
- Updated latest alias wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md to v4.
- Incorporated v4 hardening: strong-success CI rule, Holm correction, B4 phase timing, Excluded administrative handling, groundTruth/auditVisible split, leakage taxonomy normalization, B5 cap, author_only primary-denominator exclusion.
- Critic first pass PASS_WITH_CHANGES; follow-up PASS after both must-fix items were incorporated.

## [2026-05-18] Patched v4 anchor in place without version bump | AEGIS TraceAudit v4 in-place precision patch
- Clarified B2 includes same-backbone machine verdict/rationale while hiding ledger/trace/claim links.
- Added B2+B4 machine-wrong denominator requirements for wrong_verdict_detection_rate.
- Specified unsafe accept/suppression scoring against groundTruthLabel and separated safety gate/uncertainty/failure semantics.
- Defined Holm endpoint procedure without ambiguous corrected-CI wording.
- Updated active benchmark/dossier leakage taxonomy to visibleLeakageClass; historical v1-v3 snapshots left unchanged.

## [2026-05-18] Judge uncertainty field shape validation hardened | S5 judge-uncertainty-field-shape-validator-v1
- Added field-shape policy and validator coverage for uncertainty.reason, uncertainty.evidenceGaps, uncertainty.requiredInputs, and uncertainty.conflicts.
- Validation now rejects empty required reason on unknown/non-complete answers, invalid evidenceGaps list shape, and invalid conflicts list/object shape before conflict diagnostics can crash on malformed entries.
- Verification: targeted 3 passed, adjacent Judge/Conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] Polished frozen anchor into standalone operational guideline | AEGIS TraceAudit polished paper anchor
- Removed discussion-history/version-review chatter from the active anchor body.
- Converted the anchor into a self-contained guideline while preserving thesis, packet comparison, benchmark layers, reviewer/oracle protocol, success rules, downgrade branches, and gates.
- Synced the polished anchor to /home/kosh/aegis-for-paper/PAPER-ANCHOR.md and neutralized README wording.
- Critic first pass PASS_WITH_CHANGES; follow-up PASS after cleanup.

## [2026-05-18] Resolved uncertainty validator crash and degraded Source KG evidence gap blockers | S5 judge-uncertainty-field-shape-validator-v1 Critic fix
- Fixed non-dict uncertainty containers so validate_judge_answer reports UNCERTAINTY_FIELD_MISSING/related issues instead of crashing during later checks.
- Made degraded Source KG answers include source code kg context in uncertainty.evidenceGaps, aligning requiredInputs and follow-up actionability.
- Verification: targeted Critic fix 4 passed, adjacent Judge/Conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] mcp | register_wr | s3-to-s4-s4-consensus-review-requested-for-frozen-traceaudit-paper-anchor
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-consensus-review-requested-for-frozen-traceaudit-paper-anchor.md

## [2026-05-18] Registered S3-to-S4 consensus review WR | S4 TraceAudit anchor consensus WR
- Created wiki/canon/work-requests/s3-to-s4-s4-consensus-review-requested-for-frozen-traceaudit-paper-anchor.md
- Requested S4 ACK or must-fix review for frozen TraceAudit paper anchor, focusing on Static Evidence Producer role and claim-boundary semantics.
- Clarified that this is consensus review, not implementation start.

## [2026-05-18] mcp | register_wr | s4-to-s3-s4-reply-ack-on-frozen-traceaudit-paper-anchor
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-ack-on-frozen-traceaudit-paper-anchor.md

## [2026-05-18] mcp | complete_wr | s3-to-s4-s4-consensus-review-requested-for-frozen-traceaudit-paper-anchor
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-18] mcp | complete_wr | s4-to-s3-s4-reply-ack-on-frozen-traceaudit-paper-anchor
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-18] Completed S4 consensus ACK WR | S4 TraceAudit consensus ACK
- Reviewed wiki/canon/work-requests/s4-to-s3-s4-reply-ack-on-frozen-traceaudit-paper-anchor.md.
- S4 ACKed the frozen TraceAudit paper anchor with no must-fix items.
- Applied non-blocking terminology clarification: S4 FaultBench shorthand now says empty/not_available/error instead of empty/no-hit; S5 no_hit remains S5 vocabulary.
- Completed the WR from S3 lane.

## [2026-05-18] Resolved remaining malformed uncertainty/follow-up validator crash paths | S5 judge-uncertainty-field-shape-validator-v1 second Critic fix
- Added safe list/dict handling for degraded Source KG follow-up, requiredInputs, evidenceGaps, and conflict validation paths after primary uncertainty shape issues are detected.
- Added regressions for malformed followUpAffordances and non-list requiredInputs/evidenceGaps/conflicts in degraded Source KG answers.
- Verification: targeted second Critic fix 5 passed, adjacent Judge/Conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] Resolved conflict child-field validator crash paths | S5 judge-uncertainty-field-shape-validator-v1 third Critic fix
- Normalized qualityGate.diagnostics through safe dict-list handling before conflict diagnostic lookup.
- Normalized uncertainty.conflicts[].conflictingValues through safe dict-list handling before count/truncation checks.
- Verification: targeted third Critic fix 5 passed, adjacent Judge/Conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] Resolved malformed list-entry validator crash paths | S5 judge-uncertainty-field-shape-validator-v1 fourth Critic fix
- Type-guarded requiredInputs[], followUpAffordances[].requestKind, and followUpAffordances[].ownerLane membership checks.
- Normalized conflict forbiddenEffects and qualityGate container access through safe paths.
- Verification: targeted fourth Critic fix 5 passed, adjacent Judge/Conflict 68 passed, focused S5/Judge/Source KG 209 passed, full services/knowledge-base 670 passed; ledger restored.

## [2026-05-18] Updated S5 Judge validator to report malformed top-level answer containers instead of crashing/bypassing later validation paths | s5 judge-uncertainty-field-shape-validator-v1 fifth Critic fix
- Added safe dict/evidence reads for cacheTrace, queryContext, evidence, evidence.sourceCodeKg, and appliedControls-dependent validation.
- Updated S5 API contract and handoff docs with top-level container shape policy and latest verification evidence.
- Full services/knowledge-base suite passed: 670 passed in 395.42s; S5 ledger restored.

## [2026-05-18] Hardened cacheTrace validation from truthiness-gated checks to presence/type checks | s5 judge-uncertainty-field-shape-validator-v1 sixth Critic fix
- cacheTrace=[] and cacheTrace="" now emit JUDGE_ANSWER_FIELD_INVALID.
- cacheTrace={} now emits missing cache scope/revision diagnostics.
- Full services/knowledge-base suite passed: 670 passed in 392.52s; S5 ledger restored.

## [2026-05-18] Exposed Judge answer field validator policy in the machine-readable API contract | s5 judge-answer-field-policy-contract-v1
- Added answer.answerFieldPolicy for top-level container shape rules and JUDGE_ANSWER_FIELD_INVALID issue catalog.
- Added drift test comparing contract catalog to runtime JUDGE_ANSWER_* literals.
- Full services/knowledge-base suite passed: 671 passed in 390.22s; S5 ledger restored.

## [2026-05-18] Guarded malformed suppressed affectedness riskSignals in control-effect accepted-control validation | s5 judge-answer-field-policy-contract-v1 Critic fix
- Malformed riskSignals[] entries and non-dict payloads now skip CVE key extraction instead of raising.
- Added regressions for malformed risk signal entry and payload under risk-signal-only accepted-control alignment.
- Full services/knowledge-base suite passed: 671 passed in 395.86s; S5 ledger restored.

## [2026-05-18] Verified SastBench critique against local PDF | SastBench direct PDF verification
- Read /tmp/SastBench A Benchmark for Testing Agentic SAST Triage.pdf via pdftotext/pdfinfo.
- Confirmed binary TP/FP task, CVE/NVD TP source, Semgrep heuristic FP source, 299/2438 TP/FP imbalance, model/prompt-centered result framing, and no-tools baseline result.
- Updated wiki/canon/specs/sastbench-critical-reading-20260518.md and paper workspace research note with direct PDF verification.

## [2026-05-18] Updated paper anchor SastBench handling policy | PAPER-ANCHOR SastBench handling update
- Expanded the SastBench handling rule in the canonical anchor and PAPER-ANCHOR mirror.
- Clarified SastBench is contrast only, not methodological anchor or model-performance authority.
- Captured concrete reasons: binary TP/FP, CVE provenance limits, Semgrep heuristic FP construction, imbalance/operating-point caution, prompt/model result caution, no-tools baseline implication.

## [2026-05-18] Hardened Judge validator against malformed Threat Retrieval and Source KG evidence list entries | s5 judge-validator-evidence-list-entry-robustness-v1
- Added TDD crash-safety regression for non-object candidateEvidence, equivalentAdvisories, riskSignals, candidatePoolPreview, richIrArtifacts, and evidenceSnippets entries.
- Normalized validator iterations through safe dict-list views and safe key extractors.
- Full services/knowledge-base suite passed: 672 passed in 394.12s; S5 ledger restored.

## [2026-05-18] Hardened Judge validator against malformed core answer containers | s5 judge-validator-core-container-robustness-v1
- Added TDD crash-safety regression for non-list forbiddenInferences, non-dict contextResolution, non-list sourceArtifacts/graphNodes, and non-list suppressedAffectedness.
- Normalized core container access through safe dict/list helpers.
- Full services/knowledge-base suite passed: 673 passed in 405.91s; S5 ledger restored.

## [2026-05-18] Closed appliedControls.accepted.exclude malformed-list crash in Judge validator | s5 judge-validator-core-container-robustness-v1 Critic fix
- Introduced safe accepted exclude helper for Threat Retrieval exclude checks and control-effect accepted-control alignment.
- Added non-list appliedControls.accepted.exclude to core-container robustness regression.
- Full services/knowledge-base suite passed: 673 passed in 404.21s; S5 ledger restored.

## [2026-05-18] Closed malformed controlEffects suppression ID list crash in Judge validator | s5 judge-validator-core-container-robustness-v1 second Critic fix
- Suppression trace ID extraction now uses safe string-list handling for suppressedAdvisoryIds and suppressedExternalIds.
- Added regressions for non-list suppression ID fields.
- Full services/knowledge-base suite passed: 673 passed in 442.16s; S5 ledger restored.

## [2026-05-18] Locked broad malformed Judge answer packet robustness with deterministic regression coverage | s5 judge-validator-broad-malformed-packet-regression-v1
- Added deterministic regression mutating 44 representative answer paths across top-level, quality, controls, query, uncertainty, Source KG, and Threat Retrieval containers with malformed values.
- No runtime code change was needed in this loop after prior Critic fixes; the regression passed and protects against reintroduced validator exceptions.
- Full services/knowledge-base suite passed: 674 passed in 398.16s; S5 ledger restored.

## [2026-05-18] Closed non-list suppressed affectedness riskSignals crash in Judge validator broad malformed-packet coverage | s5 judge-validator-broad-malformed-packet-regression-v1 Critic fix
- Suppressed affectedness risk-signal iteration now uses safe dict-list handling.
- Added suppressedAffectedness[].riskSignals nested mutation to broad malformed-packet regression.
- Full services/knowledge-base suite passed: 674 passed in 406.20s; S5 ledger restored.

## [2026-05-18] Exposed Judge malformed-packet validator robustness policy in the machine-readable API contract | s5 judge-answer-field-robustness-policy-contract-v1
- Added answer.answerFieldPolicy.malformedPacketRobustnessPolicy with validatorMustNotRaise, malformed value kinds, representative mutation path count, and representative paths.
- Contract tests now freeze the robustness policy and key paths including appliedControls.accepted.exclude and evidence.suppressedAffectedness.0.riskSignals.
- Full services/knowledge-base suite passed: 674 passed in 402.15s; S5 ledger restored.

## [2026-05-18] Added drift guard tying Judge answerFieldPolicy malformed-packet path count/catalog to runtime regression paths | s5 judge-answer-field-robustness-policy-drift-guard-v1
- Contract test now AST-extracts mutation_paths from the broad malformed packet regression and compares count/subset against served contract policy.
- Initial guard failed with NameError until wired to tests.test_judge_answer_contract_v1.
- Full services/knowledge-base suite passed: 674 passed in 403.92s; S5 ledger restored.

## [2026-05-18] S5 judge-answer-field-robustness-policy-drift-guard-v1 Critic PASS | S5 Judge answerFieldPolicy malformedPacketRobustnessPolicy drift guard
- Critic PASS: malformedPacketRobustnessPolicy is machine-readable, representativeMutationPathCount=45 matches broad runtime regression mutation_paths, representative paths are covered.
- Cross-test AST/introspection helper accepted as local, side-effect-free, loud-on-drift, and runtime-neutral.
- Verification evidence: targeted drift guard green, focused regression, adjacent Judge contract/answer/conflict, focused S5/Judge/Source KG, full KB suite 674 passed, diff-check passed.

## [2026-05-18] S5 analyst-brief-judge-answer-consumption-guard-v1 implemented | Analyst Brief now translates s5-judge-answer-v1 artifacts for S3-safe consumption
- TDD added Judge answer Analyst Brief tests covering affected/context-only, unknown/requery diagnostics, missing final-verdict boundary blocking, not_affected clean-pass prohibition, and API acceptance without timeout header.
- Implementation routes schemaVersion=s5-judge-answer-v1 through a Judge-specific brief builder with consumerPolicy=judge_verdict_context_only, contract refs, source-ref validation action, and requery/follow-up guidance.
- Focused/full verification passed after running full suite from services/knowledge-base root; ledger restored afterward.

## [2026-05-18] S5 analyst-brief-judge-answer-consumption-guard-v1 Critic REJECT fixed | Canonical Source KG sourceRepositoryArtifactId extraction added to Analyst Brief Judge answer handling
- Critic rejected because Judge sourceArtifacts use canonical sourceRepositoryArtifactId, while Analyst Brief only extracted sourceArtifactId/artifactId aliases.
- Added RED regression for sourceArtifacts[].sourceRepositoryArtifactId; confirmed failure with 1 failed.
- Fixed _judge_answer_source_refs to extract sourceRepositoryArtifactId first, preserving legacy aliases.
- Reverified targeted, adjacent, focused, and full S5 suite.

## [2026-05-18] S5 analyst-brief-judge-answer-consumption-guard-v1 Critic PASS | Analyst Brief Judge answer consumption guard accepted after canonical Source KG ref fix
- Critic PASS: sourceRepositoryArtifactId gap is closed; canonical-only regression covers Source KG artifact refs and docs state canonical refs are included.
- Authority boundary remains intact: Judge answers stay judge_verdict_context_only, missing final-verdict boundary blocks use, affected is context-only, and not_affected forbids clean-pass/safety inference.
- Verification aligned: targeted 17 passed, adjacent 82 passed, focused 219 passed, full S5 680 passed, diff-check clean.

## [2026-05-18] S5 analyst-brief-contract-v1 implemented | Machine-readable Analyst Brief contract endpoint freezes Judge answer consumption policy
- Added /v1/contracts/analyst-brief returning s5-analyst-brief-contract-v1.
- Contract exposes accepted artifact schemas, supported audience/language, and judgeAnswerArtifactPolicy: judge_verdict_context_only, final-verdict boundary, boundary failure behavior, verdict mapping, diagnostic triggers, source ref extraction, baseline forbidden inferences, negativeEvidenceAllowed=false, and S3 final authority boundary.
- TDD: endpoint test failed with 404 before implementation, then passed after adding contract snapshot and router endpoint.

## [2026-05-18] S5 analyst-brief-contract-v1 Critic REJECT fixed | Unknown verdict and missing status Judge answer consumption gaps closed
- Critic rejected because contract unknown verdict forbidden inferences diverged from runtime and missing status could become contextual.
- Added RED regressions: unknown verdict must forbid absence_of_vulnerability/negative_absence_claim; missing status must become diagnostic, not contextual.
- Fixed runtime Judge answer brief: status=unknown is diagnostic and verdict=unknown adds absence/negative-absence forbidden inferences.
- Reverified targeted, adjacent, focused, and full S5 suite.

## [2026-05-18] S5 analyst-brief-contract-v1 Critic REJECT-2 fixed | Status-unknown trigger and unsupported Judge verdict handling added
- Critic rejected because /v1/contracts/analyst-brief did not advertise status_unknown/missing-status diagnostic trigger and unsupported/reserved verdicts could become contextual.
- Added RED regressions for diagnosticTriggers including verdict_unsupported/status_unknown and unsupported verdict=conflicting becoming diagnostic with unsupported_judge_verdict warning.
- Fixed JUDGE_ANSWER_DIAGNOSTIC_TRIGGERS and runtime Judge brief classification/warnings.
- Reverified targeted, adjacent, focused, and full S5 suite.

## [2026-05-18] S5 analyst-brief-contract-v1 Critic PASS | Analyst Brief contract accepted after diagnostic trigger and unsupported verdict fixes
- Critic PASS: verdict_unsupported/status_unknown are in the Analyst Brief contract, unsupported conflicting verdict becomes diagnostic with unsupported_judge_verdict, missing status is diagnostic.
- Docs/tests/session evidence align and no material contract/runtime drift remains.
- Verification: targeted 21 passed, adjacent 92 passed, focused 223 passed, full S5 684 passed, diff-check clean.

## [2026-05-18] S5 analyst-brief-source-ref-echo-budget-v1 implemented | Analyst Brief bounds Judge Source KG sourceEvidenceRefs echo
- Added Source KG ref echo budget for Judge answer Analyst Briefs: max 64 sourceEvidenceRefs, truncation warning source_evidence_refs_truncated, validation action remains present.
- Contract /v1/contracts/analyst-brief now exposes sourceRefExtraction.maxEchoRefs=64 and truncationWarning.
- TDD: RED showed 240 refs echoed and contract missing maxEchoRefs; GREEN after implementation.

## [2026-05-18] S5 analyst-brief-source-ref-echo-budget-v1 Critic PASS | Analyst Brief Source KG sourceEvidenceRefs echo budget accepted
- Critic PASS: cap is deterministic at 64 refs, preserves insertion/category order with sourceArtifacts first, emits source_evidence_refs_truncated, and keeps validate_source_evidence_refs action.
- /v1/contracts/analyst-brief and API docs expose maxEchoRefs=64 and truncation warning.
- Verification: targeted 22 passed, adjacent 93 passed, focused 224 passed, full S5 685 passed, diff-check clean.

## [2026-05-18] S5 analyst-brief-source-ref-truncation-metadata-v1 implemented | Analyst Brief Source KG sourceEvidenceRefs truncation is machine-readable
- Added evidencePlacement.sourceEvidenceRefTotalCount, sourceEvidenceRefReturnedCount, and sourceEvidenceRefsTruncated for Judge answer Analyst Briefs.
- /v1/contracts/analyst-brief sourceRefExtraction now exposes countFields for total/returned/truncated refs.
- TDD: RED showed count fields missing in runtime and contract; GREEN after implementation.

## [2026-05-18] S5 analyst-brief-source-ref-truncation-metadata-v1 Critic PASS | Analyst Brief Source KG truncation metadata accepted
- Critic PASS: total/returned/truncated count semantics are correct and additive.
- Contract exposes matching countFields, docs/session evidence align, and S3 can detect truncation via boolean, counts, and warning.
- Verification: targeted 22 passed, adjacent 93 passed, focused 224 passed, full S5 685 passed, diff-check clean.

## [2026-05-18] S5 analyst-brief-source-ref-value-redaction-v1 implemented | Analyst Brief redacts oversized Judge Source KG sourceEvidenceRefs values
- Added max per-ref echo length 512 for Judge answer Analyst Brief sourceEvidenceRefs.
- Oversized refs are redacted as <redacted-source-ref:original_length> and qualityWarnings includes source_evidence_ref_value_redacted.
- /v1/contracts/analyst-brief exposes maxRefEchoChars=512, oversizedRefRedaction, and valueRedactionWarning.
- TDD: RED showed oversized ref echoed and contract missing maxRefEchoChars; GREEN after implementation.

## [2026-05-18] S5 analyst-brief-source-ref-value-redaction-v1 Critic REJECT fixed | Raw-ref dedupe/counting now happens before Source KG ref echo redaction
- Critic rejected because same-length oversized refs collapsed after redaction, corrupting total/returned/truncated counts.
- Added RED regression with 70 distinct same-length oversized refs; confirmed sourceEvidenceRefTotalCount was incorrectly 1 before fix.
- Fixed Analyst Brief to dedupe/count raw refs first, then redact only the echoed slice.
- Reverified targeted, adjacent, focused, and full S5 suite.

## [2026-05-18] S5 analyst-brief-source-ref-value-redaction-v1 Critic PASS | Analyst Brief oversized Source KG ref redaction accepted after raw-ref counting fix
- Critic PASS: raw refs are deduped/counted before redaction; same-length oversized refs preserve total=70, returned=64, truncated=true.
- Raw oversized values do not leak in echoed refs; contract/docs expose redaction/truncation fields.
- Verification: targeted 24 passed, adjacent 95 passed, focused 226 passed, full S5 687 passed, diff-check clean.

## [2026-05-18] S5 analyst-brief-diagnostic-code-redaction-v1 implemented | Analyst Brief redacts oversized Judge diagnostic codes
- Added max diagnostic code echo length 128 for Judge answer Analyst Brief diagnosticCodes.
- Oversized codes are redacted as <redacted-diagnostic-code:original_length> and qualityWarnings includes diagnostic_code_value_redacted.
- /v1/contracts/analyst-brief exposes diagnosticCodeEchoPolicy with maxCodeEchoChars, oversizedCodeRedaction, and valueRedactionWarning.
- TDD: RED showed oversized diagnostic code leaked and contract missing diagnosticCodeEchoPolicy; GREEN after implementation.

## [2026-05-18] S5 analyst-brief-diagnostic-code-redaction-v1 Critic PASS | Analyst Brief oversized diagnostic code redaction accepted
- Critic PASS: oversized diagnostic codes are sanitized before diagnosticCodes and qualityWarnings, normal codes remain intact.
- Contract/docs expose the 128-char redaction policy.
- Verification: targeted 25 passed, adjacent 96 passed, focused 227 passed, full S5 688 passed, diff-check clean.

## [2026-05-18] S5 analyst-brief-required-input-redaction-v1 implemented | Analyst Brief redacts oversized Judge requiredInputs
- Added max requiredInput echo length 128 for Judge answer Analyst Brief required inputs across whatS5DoesNotKnow, nextActions, and humanQuestions.
- Oversized required inputs are redacted as <redacted-required-input:original_length> and qualityWarnings includes required_input_value_redacted.
- /v1/contracts/analyst-brief exposes requiredInputEchoPolicy.
- TDD: RED showed oversized required input leaked into payload and contract missing policy; GREEN after implementation.

## [2026-05-18] S5 analyst-brief-required-input-redaction-v1 Critic PASS | Analyst Brief oversized Judge requiredInputs redaction accepted
- Critic PASS: oversized requiredInputs are sanitized before all brief echo surfaces, normal <=128-char inputs remain useful.
- Runtime constants and /v1/contracts/analyst-brief policy align; docs/session evidence cover the contract; length-only redaction markers are acceptable.
- Verification: targeted 26 passed, adjacent 97 passed, focused 228 passed, full S5 689 passed, diff-check clean.

## [2026-05-18] completed | S5 Analyst Brief follow-up affordance presence-only echo policy
- Added machine-readable followUpEchoPolicy to GET /v1/contracts/analyst-brief.
- Locked Judge followUpAffordances child fields as presence-only/non-echoed for Analyst Brief consumption.
- Verification: targeted Analyst Brief 27 passed; adjacent Analyst/Acquisition/Judge 98 passed; focused S5/Judge/Source KG/Analyst 229 passed; full S5 suite 690 passed. Critic PASS.

## [2026-05-18] completed | S5 Analyst Brief diagnostic/required-input echo cardinality budgets
- Added diagnosticCodeEchoPolicy maxCodeEchoCount=64 plus diagnosticCodeTotalCount/ReturnedCount/Truncated metadata.
- Added requiredInputEchoPolicy maxInputEchoCount=16 plus requiredInputTotalCount/ReturnedCount/Truncated metadata.
- Verification: targeted Analyst Brief 29 passed; adjacent Analyst/Acquisition/Judge 100 passed; focused S5/Judge/Source KG/Analyst 231 passed; full S5 suite 692 passed. Critic PASS.

## [2026-05-18] completed | S5 Analyst Brief diagnostic warning preview budget
- Added diagnostic warningPreviewCount=8 to Analyst Brief contract and runtime warning rendering.
- Kept diagnosticCodes echo cap at 64 while bounding human-readable quality warning preview to first 8 returned codes plus remaining returned count.
- Verification: targeted Analyst Brief 30 passed; adjacent Analyst/Acquisition/Judge 101 passed; focused S5/Judge/Source KG/Analyst 232 passed; full S5 suite 693 passed. Critic PASS.

## [2026-05-18] completed | S5 Analyst Brief uncertainty conflict presence-only echo policy
- Added conflictEchoPolicy to GET /v1/contracts/analyst-brief.
- Locked Judge uncertainty.conflicts child fields as presence-only/non-echoed for Analyst Brief consumption.
- Verification: targeted Analyst Brief 31 passed; adjacent Analyst/Acquisition/Judge 102 passed; focused S5/Judge/Source KG/Analyst 233 passed; full S5 suite 694 passed. Critic PASS.

## [2026-05-19] completed | S5 Analyst Brief acquisition echo budget and target-context durable timeout regression
- Added acquisitionArtifactPolicy to GET /v1/contracts/analyst-brief for generic acquisition diagnostic/missing-input echo budgets.
- Capped acquisition diagnostics at 64 with warning preview 8 and missing inputs at 16, with redaction/truncation metadata.
- Fixed target-context durable ingest false-408 race by using run_sync_durable_write_with_deadline before projection timeout envelope handling.
- Verification: targeted Analyst Brief 33 passed; target context 27 passed; adjacent+target 131 passed; focused+target 262 passed; full S5 suite 697 passed. Critic PASS for acquisition echo budget and timeout fix.

## [2026-05-19] completed | S5 Analyst Brief acquisition evidence-ref echo budget
- Added acquisitionArtifactPolicy.evidenceRefEchoPolicy to GET /v1/contracts/analyst-brief.
- Capped acquisition sourceEvidenceRefs and derivedFromEvidenceRefs at 64 refs per field and 512 chars per ref, with redaction/truncation warnings and source/derived count metadata.
- Verification: targeted Analyst Brief 34 passed; adjacent+target 132 passed; focused+target 263 passed; full S5 suite 698 passed. Critic PASS.

## [2026-05-19] completed | S5 Analyst Brief acquisition identity echo budget
- Added acquisitionArtifactPolicy.identityEchoPolicy to GET /v1/contracts/analyst-brief.
- Capped acquisition identity fields surface, targetKnowledgeId, acquisitionStatus, acquisitionQualityGate, and consumerPolicy at 128 chars with redaction warning.
- Verification: targeted Analyst Brief 35 passed; adjacent+target 133 passed; focused+target 264 passed; full S5 suite 699 passed. Critic PASS.

## [2026-05-19] Completed Analyst Brief generic acquisition provider/projection state and method-list echo budget with completed_no_hit raw attempted/succeeded authority guards. | S5 Analyst Brief acquisition state/method echo budget
- Implemented stateEchoPolicy and methodEchoPolicy for /v1/contracts/analyst-brief.
- Provider/projection state echoes cap at 128 chars with acquisition_state_value_redacted.
- methodsSucceeded/methodsRequiredForNoHit echoes cap at 32 entries and 128 chars with redaction/truncation warnings.
- Critic found and rechecked no-hit authority issues: classification now uses raw method identities and requires required methods subset of both methodsAttempted and methodsSucceeded.
- Verification: Analyst Brief targeted 39 passed in 1.56s; adjacent contract/target suite 137 passed in 105.67s; focused S5/Judge/Source KG/Target suite 268 passed in 265.60s; full S5 suite 703 passed in 392.06s; diff-check passed.

## [2026-05-19] Completed Analyst Brief acquisition scope.forbiddenInferences echo budget hardening with contract, tests, Critic PASS, full suite, and docs evidence. | S5 Analyst Brief scope forbidden-inference echo budget
- Added scopeForbiddenInferenceEchoPolicy to /v1/contracts/analyst-brief.
- scope.forbiddenInferences echoes cap at 32 entries and 128 chars per entry with redaction/truncation warnings.
- Baseline S5 forbidden inferences remain always present; scope-provided values are bounded additive guidance only.
- Verification: Analyst Brief targeted 40 passed in 1.61s; adjacent suite 138 passed in 104.99s; focused suite 269 passed in 266.04s; full S5 suite 704 passed in 394.77s; diff-check passed; Critic PASS/no findings.

## [2026-05-19] Completed Analyst Brief Judge answer scalar echo budget and unsupported status/quality-gate diagnostic guard with Critic PASS, full suite, and docs evidence. | S5 Analyst Brief Judge scalar echo and authority guard
- Added scalarEchoPolicy to /v1/contracts/analyst-brief for Judge answer verdict/status/qualityGate.gate.
- Judge scalar echoes cap at 128 chars with <redacted-judge-answer-scalar:original_length> and judge_answer_scalar_value_redacted.
- Unsupported Judge status and unsupported qualityGate.gate now demote to diagnostic and cannot produce contextual authority.
- Verification: Analyst Brief targeted 42 passed in 1.57s; adjacent suite 140 passed in 105.65s; focused suite 271 passed in 264.46s; full S5 suite 706 passed in 426.01s; diff-check passed; Critic PASS/no findings.

## [2026-05-19] Completed Judge unsupported-control echo byte-budget hardening with Critic PASS, full suite, and docs evidence. | S5 Judge unsupported-control echo byte budget
- Added maxControlEchoBytes=16384 to Judge controlEchoPolicy and runtime unsupported-control echo sanitizer.
- Unsupported control values within item-count limits but above echo-byte budget are summarized with control_object_too_large.
- Regression verifies byte-heavy unsupported controls do not leak raw values into answer or serving-ledger request/answer.
- Verification: targeted 2 passed in 3.55s; adjacent Judge/control contract suite 56 passed in 78.15s; focused serving/Judge/threat suite 123 passed in 312.12s; full S5 suite 707 passed in 396.72s; diff-check passed; Critic PASS/no findings.

## [2026-05-19] Completed Source KG served nested-object URL redaction hardening with raw-byte budget preservation, Critic PASS, full suite, and docs evidence. | S5 Source KG nested URL redaction
- Served small nested object projections now recursively redact credential-bearing URL string values and keys.
- Nested object byte budget is measured before URL redaction, preventing long credential URLs from bypassing over-limit redaction by shrinking after masking.
- Raw ledger values remain raw for replay/provenance while Source KG context and Judge evidence use redacted projections.
- Verification: targeted 3 passed in 2.35s; adjacent Source KG/Judge suite 113 passed in 109.41s; focused Source KG/Judge/API suite 150 passed in 133.23s; full S5 suite 709 passed in 398.72s; diff-check passed; Critic PASS/no findings.

## [2026-05-19] Completed nested Source KG URL redaction validator hardening with Critic PASS | S5 Judge nested Source KG URL validator
- validate_judge_answer now rejects credential-bearing URL string values and keys inside validated Source KG nested object fields with SOURCE_KG_URL_REDACTION_INVALID.
- SOURCE_KG_URL_REDACTION_INVALID issue ID payloads now redact credential-bearing URLs recursively inside string/list/dict IDs before echo.
- Updated GET /v1/contracts/judge urlRedactionValidation with validatedNestedObjectFields, checksNestedObjectStringValuesAndKeys, and safeIssuePayloadOnly.
- Updated S5 API/handoff docs; full S5 suite passed 709 tests.

## [2026-05-19] Completed generalized safe diagnostic payload redaction for Judge Source KG validators with Critic PASS | S5 Judge Source KG validator diagnostic payload redaction
- Introduced shared recursive diagnostic redaction for Source KG validator issue payloads.
- Covered rich IR payload, snippet text, URL redaction, compile-commands artifact, context-resolution integrity, and nested-object redaction issue families.
- Added TDD regressions for credential-bearing URL-like IDs in compileCommandsArtifactId, buildContextId, richIrArtifactId, evidenceSnippetId, and structured graph node IDs.
- Updated /v1/contracts/judge and canonical S5 API/handoff docs; full S5 suite passed 709 tests.

## [2026-05-19] Added contract drift guard for Source KG validator diagnostic payload redaction coverage | S5 Judge Source KG payload redaction drift guard
- Added test to ensure validatorDiagnosticPayloadRedaction.appliesToIssueCodes equals projectionRedactionValidation plus contextResolutionIntegrityValidation issue families from issueAndDiagnosticCatalog.
- This prevents future Source KG validator payload-bearing issue codes from being cataloged without the safe recursive diagnostic payload redaction policy.
- Verified targeted guard and full judge API contract test file.

## [2026-05-19] Completed Source KG validator diagnostic payload echo budget hardening with Critic PASS | S5 Judge Source KG diagnostic payload echo budget
- _safe_diagnostic_value now redacts credential-bearing URLs and bounds oversized strings/structured diagnostic payloads via sanitize_large_echo_value.
- Added regressions for oversized compileCommandsArtifactId and oversized structured sourceGraphNodeId diagnostic payloads.
- Exposed maxStringEchoChars, maxStructuredEchoItems, maxStructuredEchoBytes, and maxStructuredEchoDepth in /v1/contracts/judge.
- Updated canonical S5 API/handoff docs; full S5 suite passed 710 tests.

## [2026-05-19] Completed TDD hardening for Source KG partial-resolution selector echo redaction | S5 Source KG partial resolution selector redaction
- Added repository/direct API regressions for credential-bearing URL-like missing selector IDs in contextResolution requested/missing IDs.
- Repository now resolves with raw selector values but redacts credential-bearing requested/missing IDs in returned contextResolution and SOURCE_KG_CONTEXT_PARTIAL diagnostics.
- Exposed servingContextResolution.partialResolutionEchoPolicy in contract and canonical API/handoff docs.
- Critic initially found docs missing literal partialResolutionEchoPolicy; docs were patched and Critic re-check returned PASS.
- Verification: targeted 3 passed, adjacent Source KG 89 passed in 58.00s, focused S5/Judge/Source KG 274 passed in 280.02s, full KB 710 passed in 439.25s, diff check clean, ledger restored.

## [2026-05-19] Completed TDD hardening for Judge Source KG selector echo redaction | S5 Judge sourceContext query echo redaction
- Added regression proving credential-bearing sourceContext selector values no longer appear in Judge queryContext.sourceContext or canonicalQuery.normalized.sourceContext echoes.
- Implementation keeps raw selector values for canonical query/cache-key construction and Source KG resolution, but redacts public answer echoes and serving-ledger answer payloads.
- Exposed answer.sourceCodeKgContextResolution.queryContextSourceContextEchoPolicy in runtime contract and canonical docs.
- Critic PASS: no blocking findings.
- Verification: targeted red/green, adjacent Judge contracts 62 passed in 89.66s, focused suite 274 passed in 268.81s, full KB 710 passed in 401.13s, diff check clean, ledger restored.

## [2026-05-19] Completed TDD hardening for serving-ledger sourceContext request echo redaction | S5 Judge serving-ledger sourceContext request redaction
- Found serving ledger request packet retained raw credential-bearing Source KG selector values after public Judge answer echoes had been redacted.
- Added regression asserting retrieved serving ledger request.sourceContext uses the same redacted selector echo as queryContext.sourceContext and contains no raw user/password/token values.
- Implementation redacts request_packet.sourceContext before record_serving_query while raw values still drive canonical query/cache-key and Source KG resolution first.
- Contract/docs now list servingLedger.requestPacket.sourceContext under queryContextSourceContextEchoPolicy.
- Critic PASS; adjacent Judge contracts 62 passed in 86.07s; focused 274 passed in 267.62s; full KB 710 passed in 397.08s; diff check clean; ledger restored.

## [2026-05-19] Completed TDD hardening and API contract update for Judge control echo credential URL redaction | S5 Judge control credential URL redaction
- Added regression for credential-bearing URL-like Judge control values and unsupported control names/keys in forceContext, rejected controls, canonicalQuery.controlSummary, and serving-ledger request/answer rows.
- Updated query planner echo sanitizer to redact credential-bearing URL-like strings, dict keys, and control labels while preserving existing oversized/budget behavior.
- Extended /v1/contracts/judge request.controlEchoPolicy with credentialBearingUrlRedaction=true and servingLedger.answerPacket appliesTo coverage.
- Updated canonical Knowledge Base API contract and S5 handoff with exact credentialBearingUrlRedaction and servingLedger.answerPacket literals.
- Critic final re-check PASS.
- Verification: targeted 4 passed in 8.12s, adjacent Judge contract suite 63 passed in 93.87s, focused suite 275 passed in 279.18s, full KB suite 711 passed in 402.04s, diff check clean, ledger restored.

## [2026-05-19] Completed TDD hardening for Judge question credential URL redaction | S5 Judge question credential URL redaction
- Added free-text URL redaction helper for credential-bearing URL substrings embedded inside request.question and general echo sanitization.
- Judge question echoes now redact credentials in queryContext.question, canonicalQuery.normalized.questionTerms, serving-ledger requestPacket.question, and answerPacket.
- Extended /v1/contracts/judge with request.questionEchoPolicy.credentialBearingUrlRedaction=true and canonical API/handoff docs with exact questionEchoPolicy literal.
- Critic PASS.
- Verification: targeted 3 passed in 5.97s, adjacent Judge contracts 64 passed in 119.05s, focused 276 passed in 292.72s, full KB 712 passed in 464.57s, diff check clean, ledger restored.

## [2026-05-19] mcp | complete_wr | s5-to-s3-s3-consume-judge-controleffects-validator-catalog-without-clean-pass-semantics
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s5-to-s3-s3-consume-judge-reasoningpath-policy-and-add-cache-hit-consumer-canary
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s5-to-s3-s4-s3-s4-consume-judge-fallbacktrace-validator-issue-catalog-without-negative-evide
- Lane s3 completed recipient-side handling
- Status: open

## [2026-05-19] Completed S3-side open S5 work requests as explicitly not-now | S3 S5-origin WR disposition
- Marked three S5-origin WRs complete from S3 perspective with completion note: '당장 안함'.
- Two S3-only WRs are fully completed; one S3/S4 WR remains open only for non-S3 lane ownership.
- Verified S3 open WR queue is empty after completion.

## [2026-05-19] mcp | register_wr | s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce.md

## [2026-05-19] mcp | complete_wr | s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-19] WR reply registered | S5 reply to S3 pre-freeze paper Code KB/retrieval producer contract
- Reply: wiki/canon/work-requests/s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce.md
- Original WR completed for S5: wiki/canon/work-requests/s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p.md
- Critic validation: PASS_WITH_CHANGES incorporated before registration
- Stance: ACK_WITH_CORRECTIONS; no blocker; corrections cover S5_CODE_KB_READY, visibleLeakageClass, generic Threat KB mode, status/diagnostic boundaries, S3-mediated S4 context, ownership split, checksum/ref wording, B2/B4 same-evidence-row control, S5_FREEZE_GATE

## [2026-05-19] mcp | register_wr | s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence.md

## [2026-05-19] mcp | complete_wr | s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] Registered follow-up WR requesting paper-facing S3->S5 tool-call contract | S3 to S5 TraceAudit tool-call contract WR
- Created WR wiki/canon/work-requests/s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence.md.
- The WR asks S5 to define prepare_code_kb, retrieve_finding_context, and retrieve_generic_threat_context or equivalent callable API shapes.
- The request preserves S5 producer-boundary, generic Threat KB mode, visibleLeakageClass, B2/B4 same-evidence-row control, and S5_FREEZE_GATE semantics.
- Completed the prior S5 ACK_WITH_CORRECTIONS reply from S3 perspective with a pointer to the follow-up WR.

## [2026-05-19] mcp | register_wr | s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md

## [2026-05-19] mcp | complete_wr | s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-19] WR reply registered | S5 paper-facing Code KB/retrieval tool-call contract reply to S3
- Reply: wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md
- Original WR completed for S5: wiki/canon/work-requests/s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence.md
- Stance: ACCEPT_WITH_SCOPE; S5 accepts prepare_code_kb, retrieve_finding_context, retrieve_generic_threat_context as new paper-facing endpoint/tool surfaces.
- Contract proposal includes /v1/contracts/paper-context, /v1/paper/code-kb/prepare, /v1/paper/finding-context/retrieve, /v1/paper/threat-context/generic.
- S5_FREEZE_GATE remains open pending implementation/tests for visibleLeakageClass, generic leakage validator, B2/B4 stable rows, and forbidden final-verdict vocabulary.

## [2026-05-19] mcp | register_wr | s4-to-s3-s4-accepts-final-paper-anchor.md-freeze-with-implementation-boundary-notes
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-accepts-final-paper-anchor.md-freeze-with-implementation-boundary-notes.md

## [2026-05-19] mcp | register_wr | s5-to-s3-s5-final-review-paper-anchor-accepted-with-no-anchor-change-request
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-final-review-paper-anchor-accepted-with-no-anchor-change-request.md

## [2026-05-19] WR notice registered | S5 final review of PAPER-ANCHOR for S3
- Registered S5→S3 notice: wiki/canon/work-requests/s5-to-s3-s5-final-review-paper-anchor-accepted-with-no-anchor-change-request.md
- Stance: ACCEPT / NO_ANCHOR_CHANGE_REQUESTED.
- S5 reviewed /home/kosh/aegis-for-paper/PAPER-ANCHOR.md and found no S5-blocking issue before freeze.
- Execution note: S5_FREEZE_GATE remains implementation/test-gated and is not satisfied by declaration; if unmet, S5/Threat KB RQ5 demotes while S3/S4/ledger core may proceed.

## [2026-05-19] mcp | complete_wr | s4-to-s3-s4-accepts-final-paper-anchor.md-freeze-with-implementation-boundary-notes
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s5-to-s3-s5-final-review-paper-anchor-accepted-with-no-anchor-change-request
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] Closed S4 and S5 PAPER-ANCHOR consensus WRs | PAPER-ANCHOR S3/S4/S5 consensus
- S4 accepted PAPER-ANCHOR.md freeze with no must-fix and implementation boundary notes.
- S5 accepted PAPER-ANCHOR.md freeze with no anchor change request; S5_FREEZE_GATE remains an implementation/test gate before S5/Threat KB RQ5 can be mainline.
- S3 accepted S5 paper-facing tool-call contract direction for prepare_code_kb, retrieve_finding_context, retrieve_generic_threat_context; this is not S5_FREEZE_GATE satisfaction.
- No PAPER-ANCHOR.md changes are required from either S4 or S5 feedback.
- Verified S3 open WR queue is empty after completion.

## [2026-05-19] Created execution companion spec for S3/S4/S5 paper pipeline handoffs | TraceAudit S3/S4/S5 use cases and state machine
- Created wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md.
- Mirrored the document to /home/kosh/aegis-for-paper/TRACEAUDIT-S3-S4-S5-USECASES-STATE-MACHINE.md and linked it from /home/kosh/aegis-for-paper/README.md.
- The spec defines A-to-Z use cases from admitted build target through S4 evidence, S5 Code KB/retrieval, S3 evidence ledger, triage, packet rendering, and export.
- Validation passed: validate_wiki.py, diff --check on changed files, and wiki/paper mirror equality check.

## [2026-05-19] mcp | register_wr | s3-to-s4-s4-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio.md

## [2026-05-19] mcp | register_wr | s3-to-s5-s5-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s5-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio.md

## [2026-05-19] Requested S4 and S5 review of the use-case/state-machine companion spec | TraceAudit S3/S4/S5 companion spec review WRs
- Sent S4 WR: wiki/canon/work-requests/s3-to-s4-s4-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio.md
- Sent S5 WR: wiki/canon/work-requests/s3-to-s5-s5-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio.md
- Both WRs ask for ACCEPT / ACCEPT_WITH_CORRECTIONS / REJECT_WITH_BLOCKERS and distinguish must-fix corrections from implementation/API-contract notes.

## [2026-05-19] mcp | register_wr | s5-to-s3-s5-reply-accept-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companion-sp
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-accept-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companion-sp.md

## [2026-05-19] mcp | register_wr | s4-to-s3-s4-reply-accept_with_corrections-for-traceaudit-use-cases-and-state-machine-comp
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-accept_with_corrections-for-traceaudit-use-cases-and-state-machine-comp.md

## [2026-05-19] mcp | complete_wr | s3-to-s4-s4-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s3-to-s5-s5-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-19] WR reply registered | S5 review of TraceAudit S3/S4/S5 use-case/state-machine companion spec
- Reply: wiki/canon/work-requests/s5-to-s3-s5-reply-accept-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companion-sp.md
- Original WR completed for S5: wiki/canon/work-requests/s3-to-s5-s5-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio.md
- Stance: ACCEPT; no must-fix changes requested for the companion spec.
- S5 implementation notes remain: exact paper endpoint schemas, visibleLeakageClass on every row, generic Threat KB leakage validator, non-verdict language guard, B2/B4 stable rows, and S3 consumer guards.

## [2026-05-19] mcp | register_wr | s3-to-s4-s4-second-review-requested-after-corrections-for-traceaudit-s3-s4-s5-companion-s
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-second-review-requested-after-corrections-for-traceaudit-s3-s4-s5-companion-s.md

## [2026-05-19] mcp | register_wr | s3-to-s5-s5-second-review-requested-after-s4-corrections-for-traceaudit-s3-s4-s5-companio
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s5-second-review-requested-after-s4-corrections-for-traceaudit-s3-s4-s5-companio.md

## [2026-05-19] mcp | complete_wr | s4-to-s3-s4-reply-accept_with_corrections-for-traceaudit-use-cases-and-state-machine-comp
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s5-to-s3-s5-reply-accept-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companion-sp
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] Incorporated S4 corrections, obtained Critic PASS, and requested second S4/S5 review | TraceAudit companion spec S4/S5 review iteration
- S4 returned ACCEPT_WITH_CORRECTIONS; S5 returned ACCEPT.
- Updated wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md and mirrored to /home/kosh/aegis-for-paper/TRACEAUDIT-S3-S4-S5-USECASES-STATE-MACHINE.md.
- Incorporated S4 stage diagnostic semantics, S4 top-level surface/API authority clarification, B2/B4 diagnostic/status text control, and file-backed S4 contract gate.
- Critic review returned PASS with no further changes.
- Sent second review WRs to S4 and S5; completed the prior S4/S5 reply WRs from S3 perspective.
- Verified S3 open WR queue is empty.

## [2026-05-19] mcp | register_wr | s4-to-s3-s4-reply-accept-after-corrections-for-traceaudit-s3-s4-s5-companion-spec
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-accept-after-corrections-for-traceaudit-s3-s4-s5-companion-spec.md

## [2026-05-19] mcp | complete_wr | s3-to-s4-s4-second-review-requested-after-corrections-for-traceaudit-s3-s4-s5-companion-s
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | register_wr | s5-to-s3-s5-second-reply-accept-after-s4-corrections-for-traceaudit-companion-spec
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-second-reply-accept-after-s4-corrections-for-traceaudit-companion-spec.md

## [2026-05-19] mcp | complete_wr | s3-to-s5-s5-second-review-requested-after-s4-corrections-for-traceaudit-s3-s4-s5-companio
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-19] WR reply registered | S5 second review after S4 corrections for TraceAudit companion spec
- Reply: wiki/canon/work-requests/s5-to-s3-s5-second-reply-accept-after-s4-corrections-for-traceaudit-companion-spec.md
- Original WR completed for S5: wiki/canon/work-requests/s3-to-s5-s5-second-review-requested-after-s4-corrections-for-traceaudit-s3-s4-s5-companio.md
- Stance: ACCEPT; no must-fix changes.
- S5 confirmed S4 corrections are S4-facing and do not alter S5 role, S5_FREEZE_GATE, generic Threat KB, visibleLeakageClass, or paper-facing tool-call semantics.
- S5 noted B2/B4 diagnostic/status text control also strengthens S5 evidence presentation fairness.

## [2026-05-19] mcp | complete_wr | s4-to-s3-s4-reply-accept-after-corrections-for-traceaudit-s3-s4-s5-companion-spec
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s5-to-s3-s5-second-reply-accept-after-s4-corrections-for-traceaudit-companion-spec
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] Completed final S4/S5 review WRs for the S3/S4/S5 use-case/state-machine companion spec | TraceAudit companion spec final S4/S5 acceptance
- S4 returned ACCEPT after corrections; no remaining S4 must-fix items.
- S5 returned ACCEPT after S4 corrections; no S5 blocker or correction request.
- Completed both WRs from S3 perspective.
- The companion spec is accepted by S3/S4/S5 as an execution-contract companion below the frozen PAPER-ANCHOR.
- S3 open WR queue verified empty.

## [2026-05-19] mcp | register_wr | s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation.md

## [2026-05-19] mcp | register_wr | s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation.md

## [2026-05-19] Requested detailed S4 and S5 producer API docs for S3 consumer implementation | TraceAudit paper API docs request to S4/S5
- Sent S4 WR: wiki/canon/work-requests/s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation.md
- Sent S5 WR: wiki/canon/work-requests/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation.md
- Both requests ask producer lanes to draft API docs detailed enough for S3 consumer adapter/file-backed equivalent implementation without S3 reading producer source code.
- Requests focus on required deliverables and consumer safety concerns rather than prescribing producer implementation details.

## [2026-05-19] mcp | register_wr | s4-to-s3-s3-review-requested-detailed-s4-paper-static-evidence-api-contract-for-consumer-
- Registered request WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-review-requested-detailed-s4-paper-static-evidence-api-contract-for-consumer-.md

## [2026-05-19] mcp | complete_wr | s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | register_wr | s5-to-s3-s3-review-requested-s5-paper-context-api-contract-draft-for-traceaudit-consumer-
- Registered request WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-paper-context-api-contract-draft-for-traceaudit-consumer-.md

## [2026-05-19] mcp | complete_wr | s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-19] S5 published TraceAudit paper context API contract and requested S3 review | s5-paper-context-api-contract
- Created canonical API page wiki/canon/api/s5-paper-context-api.md.
- Critic returned PASS_WITH_CHANGES; S5 incorporated all must-fix items before publication.
- Registered S5->S3 review WR wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-paper-context-api-contract-draft-for-traceaudit-consumer-.md.
- Completed S3->S5 WR wiki/canon/work-requests/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation.md for lane s5.

## [2026-05-19] mcp | register_wr | s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract.md

## [2026-05-19] mcp | register_wr | s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract.md

## [2026-05-19] mcp | complete_wr | s5-to-s3-s3-review-requested-s5-paper-context-api-contract-draft-for-traceaudit-consumer-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s4-to-s3-s3-review-requested-detailed-s4-paper-static-evidence-api-contract-for-consumer-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] S3 accepted S4 and S5 detailed paper API contracts after validation and Critic PASS | S3 TraceAudit producer API contract reviews
- S4 reply registered: wiki/canon/work-requests/s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract.md
- S5 reply registered: wiki/canon/work-requests/s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract.md
- Completed incoming S4/S5 review WRs for S3.
- Validation evidence: validate_wiki PASS, git diff --check PASS, S4 8 JSON blocks parsed, S5 18 JSON blocks parsed, no current case_specific_advisory grep hits.
- Critic result: PASS; no required edits to acceptance responses.

## [2026-05-19] mcp | complete_wr | s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | complete_wr | s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-19] S5 acknowledged S3 ACCEPT_FOR_IMPLEMENTATION reply | s5-paper-context-api-contract
- S3 accepted wiki/canon/api/s5-paper-context-api.md for implementation.
- S3 reply WR: wiki/canon/work-requests/s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract.md.
- S5 completed recipient-side handling for the reply WR.
- S5_FREEZE_GATE remains pending until implementation/file-backed equivalent and validators/tests land.

## [2026-05-19] S5 interview decision: prioritize S3 bottleneck removal | s5-paper-context-implementation-interview
- User clarified all S5 paper-context implementation slices remain in scope; the question is execution order, not scope reduction.
- User selected S3 bottleneck removal as first priority before live endpoint completeness.
- Implementation preflight implication: first TDD slice should make S3 able to consume/validate S5 outputs, likely via file-backed equivalent plus schemas/validators/fixtures under the accepted contract.

## [2026-05-19] S5 interview completed: implement accepted API design first | s5-paper-context-implementation-interview
- User corrected the first-slice framing: S3 bottleneck removal does not mean only a minimal file-backed unblock.
- Final implementation priority: implement the S3-requested/accepted S5 Paper Context API design itself.
- End-to-end S3 consumption is expected to reveal holes later; follow-up changes can address those.
- TDD remains mandatory for all units.

## [2026-05-19] mcp | register_wr | s4-to-s3-s3-decision-requested-failure-policy-for-s4-paper-static-evidence-bundle-consump
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-decision-requested-failure-policy-for-s4-paper-static-evidence-bundle-consump.md

## [2026-05-19] S5 corrected mode: interview only, wait for goal before implementation | s5-paper-context-implementation-interview
- User clarified that S5 is not yet in implementation stage.
- Required behavior: resolve ambiguous implementation-preflight questions with the user, then wait for explicit goal input.
- S5 removed the premature implementation test file it had created.
- No S5 paper-context implementation should proceed until the goal is provided.

## [2026-05-19] mcp | register_wr | s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary.md

## [2026-05-19] mcp | complete_wr | s4-to-s3-s3-decision-requested-failure-policy-for-s4-paper-static-evidence-bundle-consump
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] S3 accepted S4 preferred paper static-evidence bundle failure boundary | S3/S4 TraceAudit failure policy
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary.md
- Decision: per-tool/per-surface failure after admission may remain bundleStatus=produced if contract-valid and consumable.
- Admission/provenance/mandatory contract shape/trace invariant failures remain failed/non-consumable.
- Current-six systemic liveness is a separate implementation/CI quality gate, not a finding-level security conclusion.

## [2026-05-19] S5 first-goal completion boundary clarified | s5-paper-context-implementation-interview
- User selected S3-consumable completion as the first implementation goal boundary.
- The first implementation should be fast enough for S3 to start tests: accepted API surface plus consumer-ready fixtures/examples or responses.
- S5_FREEZE_GATE validators are desirable and should be included opportunistically, but are not the hard first-goal boundary if they would materially delay S3 testing.
- No implementation should start until the explicit goal is provided.

## [2026-05-19] mcp | complete_wr | s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-19] S5 interview completed with real-internals implementation boundary | s5-paper-context-implementation-interview
- User rejected thin fixture/stub implementation as insufficient.
- First S5 implementation goal should connect actual S5 internals as much as possible while adapting existing S5 work to the paper contract.
- S1/S2 legacy compatibility is not a preservation priority for this S5 paper-context implementation; within S5-owned code, substantial refactor/replacement is allowed.
- First hard boundary remains S3-consumable API implementation; S5_FREEZE_GATE validators are desirable but opportunistic if they materially delay S3 testing.
- S5 should now wait for explicit goal input before implementation.

## [2026-05-19] mcp | register_wr | s5-to-s3-s3-guidance-requested-run-s5_freeze_gate-now-or-defer-after-s3-consumable-api-im
- Registered question WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-guidance-requested-run-s5_freeze_gate-now-or-defer-after-s3-consumable-api-im.md

## [2026-05-19] S5 requested S3 guidance on Freeze-gate timing | s5-freeze-gate-timing
- Registered WR: wiki/canon/work-requests/s5-to-s3-s3-guidance-requested-run-s5_freeze_gate-now-or-defer-after-s3-consumable-api-im.md
- Question asks whether S5_FREEZE_GATE should be a first-goal hard requirement, deferred after S3-consumable API implementation, or hybrid.
- S5 tentative recommendation in WR: implement real-internals S3-consumable API first, include cheap safety checks now, run full Freeze-gate as second hardening/freeze goal.

## [2026-05-19] mcp | register_wr | s4-to-s3-s3-decision-requested-diagnosticrefs-cardinality-on-s4-paper-evidence-rows
- Registered question WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s3-decision-requested-diagnosticrefs-cardinality-on-s4-paper-evidence-rows.md

## [2026-05-19] mcp | register_wr | s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation
- Registered reply WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md

## [2026-05-19] mcp | complete_wr | s5-to-s3-s3-guidance-requested-run-s5_freeze_gate-now-or-defer-after-s3-consumable-api-im
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] S3 selected HYBRID timing for S5_FREEZE_GATE implementation | S3/S5 TraceAudit S5_FREEZE_GATE timing
- Reply WR: wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md
- Hard-now: real-internals S3-consumable API plus contract snapshot, row schema minima, generic-mode enforcement, baseline visible-field leakage guard, non-verdict vocabulary, diagnostic separation, and B2/B4 structural support.
- Deferred: full S5_FREEZE_GATE hardening suite before S5/Threat KB RQ5 can be frozen.

## [2026-05-19] S5 superseded interview Freeze-gate opinion with S3 HYBRID decision | s5-freeze-gate-timing
- S3 reply WR: wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md
- Superseded prior tentative S5 interview opinion that full Freeze-gate could be opportunistic/deferred without a hard subset.
- Current planning authority: first goal must include real-internals S3-consumable API plus hard-now safety subset.
- Second goal completes full S5_FREEZE_GATE hardening/freeze suite before S5/Threat KB RQ5 can be frozen.

## [2026-05-19] mcp | complete_wr | s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-19] mcp | register_wr | s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality
- Registered reply WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality.md

## [2026-05-19] mcp | complete_wr | s4-to-s3-s3-decision-requested-diagnosticrefs-cardinality-on-s4-paper-evidence-rows
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] S3 accepted Option A required-empty-array diagnosticRefs rule | S3/S4 TraceAudit diagnosticRefs cardinality
- Reply WR: wiki/canon/work-requests/s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality.md
- Rule: missing diagnosticRefs is schema failure on diagnostic-capable row shapes; [] means explicitly no associated diagnostics; non-empty refs must resolve against top-level diagnostics[].
- Scope: diagnostic-capable S4 paper rows/tools/surfaces, not pure envelope/provenance metadata unless schema says diagnostic association is supported.

## [2026-05-19] mcp | complete_wr | s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-19] S5 crystallized pre-implementation interview | s5-paper-context-implementation-interview
- Crystallized handoff page: wiki/canon/handoff/s5/session-s5-paper-context-implementation-interview-20260519.md
- Final basis: S3 HYBRID Freeze-gate timing WR supersedes prior tentative interview opinion.
- Future implementation goal: real-internals S3-consumable S5 Paper Context API plus S3 HYBRID hard-now safety subset.
- Stop condition: wait for explicit goal input before coding.

## [2026-05-19] mcp | register_wr | s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_
- Registered question WR for s4, s5
- Path: wiki/canon/work-requests/s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_.md

## [2026-05-19] S3 requested S4/S5 consensus on synchronous /start terminal boundary | S3/S4/S5 TraceAudit /paper start terminal policy
- WR: wiki/canon/work-requests/s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_.md
- S3 tentative position: synchronous /start returns 200 only after PAPER_EXPORT_READY; inability to complete promised pipeline is system/operational failure.
- Producer diagnostics/gaps should be carried into normal artifacts, not promoted to TP/FP/UNKNOWN.

## [2026-05-19] mcp | register_wr | s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy
- Registered reply WR for s3, s5
- Path: wiki/canon/work-requests/s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md

## [2026-05-19] mcp | complete_wr | s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_
- Lane s4 completed recipient-side handling
- Status: open

## [2026-05-19] mcp | register_wr | s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md

## [2026-05-19] S5 accepted PAPER_EXPORT_READY as synchronous /paper start terminal boundary | s5-paper-start-terminal-policy
- S5 reply WR: wiki/canon/work-requests/s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md
- Incoming consensus WR completed for S5: wiki/canon/work-requests/s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_.md
- S5 accepts 200 only after S3 reaches PAPER_EXPORT_READY.
- S5 clarified which producer diagnostics/gaps can carry through normal export vs which operational/contract failures should block normal completion.

## [2026-05-19] mcp | complete_wr | s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy
- Lane s5 completed recipient-side handling
- Status: open

## [2026-05-19] S5 acknowledged S4 PAPER_EXPORT_READY terminal acceptance | s4-s5-paper-start-terminal-alignment
- S4 reply WR: wiki/canon/work-requests/s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md
- S5 completed recipient-side handling for the S4->S3/S5 reply.
- S4 and S5 positions align: PAPER_EXPORT_READY is S3-owned terminal/export boundary; producer diagnostics/gaps can carry through normal artifacts when contract-valid; non-consumable contract/operational failures may block normal 200.

## [2026-05-19] mcp | complete_wr | s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-19] S4 and S5 accepted PAPER_EXPORT_READY terminal policy for synchronous S3 /paper start | S3/S4/S5 TraceAudit /paper start consensus
- S4 reply completed: wiki/canon/work-requests/s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md
- S5 reply completed: wiki/canon/work-requests/s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md
- Consensus: normal 200 completion for /start requires S3 to reach PAPER_EXPORT_READY.
- Contract-valid producer diagnostics/gaps carry through to artifacts; non-consumable operational/contract failures prevent normal completion.

## [2026-05-19] crystallized | S4 paper static evidence implementation interview
- Created canonical crystallization artifact: wiki/canon/handoff/s4/s4-paper-static-evidence-implementation-crystallization.md
- Closed interview session artifact: wiki/canon/handoff/s4/session-s4-paper-static-evidence-implementation-interview-20260519.md
- Captured S3-accepted failure policy, diagnosticRefs cardinality, PAPER_EXPORT_READY compatibility, validation split, current-six toolRun rule, surfaceStatus rule, bundle-local ID policy, empty semantics, and implementation stop condition.

## [2026-05-19] mcp | register_wr | s4-to-s3-s4-paper-static-evidence-endpoint-implemented-and-verified-for-s3-consumer-integ
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-paper-static-evidence-endpoint-implemented-and-verified-for-s3-consumer-integ.md

## [2026-05-19] implemented-and-verified | S4 paper static-evidence endpoint
- Implemented S4 `POST /v1/paper/static-evidence` in services/sast-runner.
- Added shared paper bundle builder/validator/file-backed writer and paper request schemas.
- Verified with S4 full suite: 1365 passed, 1 skipped.
- Real admitted-target smoke for bt-0001-certificate_maker passed with produced, contract-valid bundle.
- Registered S3 notice WR: wiki/canon/work-requests/s4-to-s3-s4-paper-static-evidence-endpoint-implemented-and-verified-for-s3-consumer-integ.md

## [2026-05-19] Implemented and verified S5 Paper Context API hard-now subset | s5-paper-context-api
- Implemented /v1/contracts/paper-context and /v1/paper/code-kb/prepare, /finding-context/retrieve, /threat-context/generic in services/knowledge-base.
- Uses real S5 internals: Source KG ingest/context ledger, provider_observation mapping, threat retrieval evidence, and taxonomy fallback.
- TDD evidence recorded on S5 handoff session: targeted 13 passed, related regression 142 passed, full S5 service-root suite 725 passed.
- S5_FREEZE_GATE remains not_run; second hardening goal still required for full freeze gate.

## [2026-05-19] mcp | register_wr | s5-to-s3-s5-paper-context-api-hard-now-subset-implemented-and-verified-for-s3-consumption
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-paper-context-api-hard-now-subset-implemented-and-verified-for-s3-consumption.md

## [2026-05-19] Registered S5 notice to S3 for paper-context API consumption | s5-to-s3-paper-context-hard-now-notice
- WR: wiki/canon/work-requests/s5-to-s3-s5-paper-context-api-hard-now-subset-implemented-and-verified-for-s3-consumption.md
- Completed S3 HYBRID WR from S5 lane perspective with verification evidence.
- S3-owned paper-analysis API doc was not edited by S5; notice asks S3 to reconcile placeholders against S5 contract if needed.

## [2026-05-19] mcp | register_wr | s3-to-s4-confirm-s4-handling-of-traceaudit-dry-run-retry-conditions
- Registered question WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-confirm-s4-handling-of-traceaudit-dry-run-retry-conditions.md

## [2026-05-20] mcp | register_wr | s3-to-s4-implement-heartbeat-ownership-semantics-for-paper-static-evidence
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-implement-heartbeat-ownership-semantics-for-paper-static-evidence.md

## [2026-05-20] mcp | register_wr | s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy.md

## [2026-05-20] mcp | register_wr | s5-to-s3-s5-reply-paper-endpoints-aligned-with-no-absolute-timeout-liveness-policy
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-paper-endpoints-aligned-with-no-absolute-timeout-liveness-policy.md

## [2026-05-20] mcp | complete_wr | s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-20] Aligned S5 paper endpoints with S3 no-absolute-timeout WR | s5-paper-timeout-liveness-policy
- Completed WR wiki/canon/work-requests/s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy.md from S5 lane perspective.
- S5 paper endpoints no longer require X-Timeout-Ms; a supplied legacy timeout header is validated but not treated as semantic terminal deadline.
- Updated S5 paper context API docs and registered S5 reply WR to S3.
- Verification: targeted paper-context 13 passed; compile + related Source KG/Judge regression 142 passed.

## [2026-05-20] implemented-and-verified | S4 paper static-evidence durable ownership
- Added Prefer: respond-async durable ownership mode for POST /v1/paper/static-evidence using existing /v1/requests/{requestId} status/result/cancel surfaces.
- Preflight request validation remains synchronous before ownership submit; PaperStaticEvidenceContractError is retained as a sanitized failed owned result, not INTERNAL_ERROR.
- Updated wiki/canon/api/sast-runner-paper-static-evidence-api.md and wiki/canon/api/sast-runner-api.md for no absolute HTTP read timeout semantics.
- Verified S4 full suite: 1368 passed, 1 skipped.

## [2026-05-20] mcp | register_wr | s4-to-s3-s4-reply-paper-static-evidence-durable-ownership-implemented-and-verified
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-paper-static-evidence-durable-ownership-implemented-and-verified.md

## [2026-05-20] mcp | register_wr | s4-to-s5-s3-s4-reply-no-judge-fallbacktrace-consumer-in-s4-future-consumption-will-use-s5-co
- Registered reply WR for s5, s3
- Path: wiki/canon/work-requests/s4-to-s5-s3-s4-reply-no-judge-fallbacktrace-consumer-in-s4-future-consumption-will-use-s5-co.md

## [2026-05-20] mcp | complete_wr | s3-to-s4-implement-heartbeat-ownership-semantics-for-paper-static-evidence
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s3-to-s4-s3-reply-s4-v0.11.2-api-and-evidence-contracts-fully-consumed
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s5-to-s3-s4-s3-s4-consume-judge-fallbacktrace-validator-issue-catalog-without-negative-evide
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s5-to-s3-s5-reply-paper-endpoints-aligned-with-no-absolute-timeout-liveness-policy
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s5-to-s3-s5-paper-context-api-hard-now-subset-implemented-and-verified-for-s3-consumption
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s4-to-s5-s3-s4-reply-no-judge-fallbacktrace-consumer-in-s4-future-consumption-will-use-s5-co
- Lane s5 completed recipient-side handling
- Status: open

## [2026-05-20] mcp | register_wr | s5-to-s4-s4-requested-define-and-report-paper-static-evidence-freeze-validation-gate-stat
- Registered request WR for s4
- Path: wiki/canon/work-requests/s5-to-s4-s4-requested-define-and-report-paper-static-evidence-freeze-validation-gate-stat.md

## [2026-05-20] defined-and-reported | S4_STATIC_EVIDENCE_FREEZE_GATE
- Defined canonical S4 paper static-evidence freeze gate in wiki/canon/api/sast-runner-paper-static-evidence-api.md.
- Current status: pass.
- Verified focused S4 paper tests: 33 passed, 1 skipped; wiki validation/diff-check pass; Critic plan validation pass.

## [2026-05-20] mcp | register_wr | s4-to-s5-s3-s4-reply-accept_with_status-for-s4_static_evidence_freeze_gate
- Registered reply WR for s5, s3
- Path: wiki/canon/work-requests/s4-to-s5-s3-s4-reply-accept_with_status-for-s4_static_evidence_freeze_gate.md

## [2026-05-20] mcp | complete_wr | s5-to-s4-s4-requested-define-and-report-paper-static-evidence-freeze-validation-gate-stat
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s4-to-s5-s3-s4-reply-accept_with_status-for-s4_static_evidence_freeze_gate
- Lane s5 completed recipient-side handling
- Status: open

## [2026-05-20] mcp | register_wr | s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request
- Registered request WR for s4, s5
- Path: wiki/canon/work-requests/s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request.md

## [2026-05-20] mcp | register_wr | s5-to-s3-s5-notice-s5_freeze_gate-passed-for-s5-producer-exported-fixture-obligations
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-notice-s5_freeze_gate-passed-for-s5-producer-exported-fixture-obligations.md

## [2026-05-20] implemented-and-verified | S5_FREEZE_GATE
- S5_FREEZE_GATE pass for S5 producer/exported-fixture obligations; S3 consumer execution remains pending_s3_owned_validation.
- Focused freeze/API: 47 passed in 172.13s; related regression: 176 passed in 358.81s; audit wrapper: status pass; full S5 suite: 760 passed in 1641.59s.
- Post-implementation Critic validation: PASS.

## [2026-05-20] mcp | register_wr | s5-to-s3-s5-reply-paper-path-observability.md-compliance-alignment-completed
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-paper-path-observability.md-compliance-alignment-completed.md

## [2026-05-20] mcp | complete_wr | s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request
- Lane s5 completed recipient-side handling
- Status: open

## [2026-05-20] S5 completed S3 paper-path observability WR | s5-paper-observability-alignment
- Aligned S5 paper-facing endpoints with observability.md requestId/error/log lifecycle rules.
- Added TDD coverage in services/knowledge-base/tests/test_paper_context_observability.py.
- Verification: observability 5 passed; paper/freeze regression 53 passed; compileall passed; full S5 service-root 765 passed.
- Registered reply WR wiki/canon/work-requests/s5-to-s3-s5-reply-paper-path-observability.md-compliance-alignment-completed.md and completed original WR for lane s5.

## [2026-05-20] mcp | register_wr | s4-to-s3-s4-reply-paper-static-evidence-observability-alignment-and-freeze-gate-hardening
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-paper-static-evidence-observability-alignment-and-freeze-gate-hardening.md

## [2026-05-20] mcp | register_wr | s4-to-s5-s3-s4-notice-s4_static_evidence_freeze_gate-revalidated-after-critic-correction
- Registered notice WR for s5, s3
- Path: wiki/canon/work-requests/s4-to-s5-s3-s4-notice-s4_static_evidence_freeze_gate-revalidated-after-critic-correction.md

## [2026-05-20] Updated paper workspace docs and recorded 50BT validation evidence | S3 TraceAudit docs and build-target status snapshot
- Updated /home/kosh/aegis-for-paper README, S3/S4/S5 state-machine companion, triage-core README/protocol, dataset README, and new BUILD-TARGET-STATUS.md.
- Validated build-targets-v1 with require-50: PASS target_count=50.
- Recorded S3 session evidence at wiki/canon/handoff/s3/session-s3-traceaudit-docs-buildtargets-20260520.md.

## [2026-05-20] mcp | complete_wr | s4-to-s5-s3-s4-notice-s4_static_evidence_freeze_gate-revalidated-after-critic-correction
- Lane s5 completed recipient-side handling
- Status: open

## [2026-05-20] S5 completed recipient handling for S4 static-evidence freeze-gate revalidation notice | s5-wr-intake
- Reviewed S4 notice and related contract/session pages.
- No S5 implementation or API contract change required.
- Completed WR for lane s5: wiki/canon/work-requests/s4-to-s5-s3-s4-notice-s4_static_evidence_freeze_gate-revalidated-after-critic-correction.md

## [2026-05-20] implemented-and-verified | S3 consumed S4 paper static-evidence completion WRs
- Processed S4 endpoint, durable ownership, observability/freeze-gate, freeze-gate revalidation, and no-Judge fallbackTrace notices/replies.
- Updated S3 paper S4 client to prefer durable ownership for /v1/paper/static-evidence and retain sync/file-backed compatibility.
- Verification: focused S4/S5 paper-client tests 3 passed; related paper/observability/ownership 63 passed; full Analysis Agent 752 passed; compileall/diff-check passed; wiki validation passed.

## [2026-05-20] mcp | complete_wr | s4-to-s3-s4-paper-static-evidence-endpoint-implemented-and-verified-for-s3-consumer-integ
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s4-to-s3-s4-reply-paper-static-evidence-durable-ownership-implemented-and-verified
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s4-to-s3-s4-reply-paper-static-evidence-observability-alignment-and-freeze-gate-hardening
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | register_wr | s4-to-s3-s4-notice-e2e-smoke-ready-with-verified-s4-responsibility-boundary
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-notice-e2e-smoke-ready-with-verified-s4-responsibility-boundary.md

## [2026-05-20] mcp | register_wr | s5-to-s3-s5-notice-e2e-smoke-ready-for-s5-paper-context-producer-scope
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-notice-e2e-smoke-ready-for-s5-paper-context-producer-scope.md

## [2026-05-20] mcp | complete_wr | s5-to-s3-s5-reply-paper-path-observability.md-compliance-alignment-completed
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s5-to-s3-s5-notice-s5_freeze_gate-passed-for-s5-producer-exported-fixture-obligations
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s5-to-s3-s5-notice-e2e-smoke-ready-for-s5-paper-context-producer-scope
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s4-to-s3-s4-notice-e2e-smoke-ready-with-verified-s4-responsibility-boundary
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] S3 removed legacy timeout-policy and S4 sync-fallback shims after S4/S5 x-req observability readiness | S3 paper x-request-id legacy cleanup
- S3 now requires S4 durable ownership for paper static-evidence live calls instead of falling back to synchronous compatibility mode.
- S3 S5 paper client now emits X-Request-Id without legacy X-AEGIS-Timeout-Policy.
- TraceAudit state-machine docs synced to canonical wiki; S5_FREEZE_GATE producer readiness recorded with S3 consumer/e2e validation still pending.
- Verification: focused cleanup tests 4 passed; related paper/observability/S4 ownership tests 64 passed; full analysis-agent suite 753 passed; compileall and diff-check passed; wiki validation passed.

## [2026-05-20] mcp | register_wr | s3-to-s4-s3-request-verify-s4-canonical-jsonl-logging-and-log-analyzer-traceability-befor
- Registered request WR for s4
- Path: wiki/canon/work-requests/s3-to-s4-s3-request-verify-s4-canonical-jsonl-logging-and-log-analyzer-traceability-befor.md

## [2026-05-20] mcp | register_wr | s3-to-s5-s3-request-verify-s5-canonical-jsonl-logging-and-log-analyzer-traceability-befor
- Registered request WR for s5
- Path: wiki/canon/work-requests/s3-to-s5-s3-request-verify-s5-canonical-jsonl-logging-and-log-analyzer-traceability-befor.md

## [2026-05-20] mcp | register_wr | s5-to-s3-s5-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-before-e
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-before-e.md

## [2026-05-20] mcp | complete_wr | s3-to-s5-s3-request-verify-s5-canonical-jsonl-logging-and-log-analyzer-traceability-befor
- Lane s5 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | register_wr | s4-to-s3-s4-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-for-e2e-
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-for-e2e-.md

## [2026-05-20] mcp | complete_wr | s3-to-s4-s3-request-verify-s4-canonical-jsonl-logging-and-log-analyzer-traceability-befor
- Lane s4 completed recipient-side handling
- Status: completed

## [2026-05-20] Fixed analysis-agent default JSONL log path for log-analyzer traceability | S3 canonical log path fix
- S3 logs now default to /home/kosh/AEGIS/logs/aegis-analysis-agent.jsonl instead of /home/kosh/AEGIS/services/logs/aegis-analysis-agent.jsonl.
- Added tests for default repo-root log path and LOG_DIR override.
- Live paper request log-check-S3-paper-20260520 was visible through log-analyzer trace_request/list_requests/service_stats.
- Critic final review returned PASS.

## [2026-05-20] mcp | complete_wr | s4-to-s3-s4-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-for-e2e-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s5-to-s3-s5-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-before-e
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] S5 docs current-state refresh completed | S5 canonical docs
- Added wiki/canon/specs/s5-current-implementation-snapshot-20260520.md as the active S5 current-state pointer.
- Updated S5 handoff, architecture, roadmap, general KB API/spec, S5 paper-context API, and active S5 design/roadmap context pages to 2026-05-20 overlays.
- Rebuilt wiki/system/index.md and validated refreshed S5 doc frontmatter/link structure.
- Session history recorded at wiki/canon/handoff/s5/session-s5-doc-refresh-20260520.md.

## [2026-05-20] S4 current documentation refresh completed | s4-docs-current-state-refresh
- Updated all active S4-owned current contract/context docs to 2026-05-20 state.
- Recorded session evidence at wiki/canon/handoff/s4/session-s4-docs-current-state-refresh-20260520.md.
- Critic final review PASS; wiki validation PASS.

## [2026-05-20] mcp | register_wr | s5-to-s3-s7-s5-notice-e2e-smoke-failed-after-s5-success-at-s3-to-s7-chat-exchange
- Registered notice WR for s3, s7
- Path: wiki/canon/work-requests/s5-to-s3-s7-s5-notice-e2e-smoke-failed-after-s5-success-at-s3-to-s7-chat-exchange.md

## [2026-05-20] S5 completed log triage and notified S3/S7 | S5 e2e smoke log triage
- Run e2e-certmaker-start-20260520-164228 failed after S5 success: S5 prepare-code-kb child completed 200 in 113ms internal / 132ms as observed by S3.
- Failure point was S3 -> S7 /v1/chat after ~80m17s with RemoteProtocolError and S3 502.
- Critic reviewed and passed the interpretation with caution not to overclaim S7 restart as confirmed root cause.
- Notice WR registered: wiki/canon/work-requests/s5-to-s3-s7-s5-notice-e2e-smoke-failed-after-s5-success-at-s3-to-s7-chat-exchange.md

## [2026-05-20] mcp | register_wr | s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime
- Registered request WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime.md

## [2026-05-20] mcp | complete_wr | s5-to-s3-s7-s5-notice-e2e-smoke-failed-after-s5-success-at-s3-to-s7-chat-exchange
- Lane s3 completed recipient-side handling
- Status: open

## [2026-05-20] mcp | register_wr | s3-to-s7-s7-unblock-traceaudit-live-smoke-with-async-chat-request-observability-and-profi
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s7-unblock-traceaudit-live-smoke-with-async-chat-request-observability-and-profi.md

## [2026-05-20] S5 added Source KG quality caveats for weak paper Code KB prepare responses | S5 Source KG quality gate
- Live certmaker Source KG audit found the bundle was structurally ingested but weak quality: 12 graph nodes, 11 edges, 12 snippets, 0 rich IR, smoke/manual harness provenance, low-confidence edges, and missing functions/external-dangerous call coverage compared with main.cpp.
- S5 now returns selectable-but-weak Source KG prepare responses as surfaceStatus=partial with readiness.sourceKgQualityGate=accepted_with_caveats and diagnostic-only caveats.
- Updated canonical docs: wiki/canon/api/s5-paper-context-api.md, wiki/canon/api/knowledge-base-api.md, wiki/canon/specs/s5-current-implementation-snapshot-20260520.md.

## [2026-05-20] mcp | register_wr | s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r.md

## [2026-05-20] S5 notified S3 that certmaker Source KG clean-ready response is superseded | S5 certmaker Source KG quality notice
- Notice WR registered: wiki/canon/work-requests/s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r.md
- S5 code now marks weak selectable Source KG bundles partial with accepted_with_caveats diagnostics.

## [2026-05-20] Updated machine-readable contract for Source KG partial quality gate | S5 paper-context contract quality caveat discovery
- Added GET /v1/contracts/paper-context policies.sourceKgQualityGatePolicy/sourceKgQualityDiagnostics/sourceKgPartialReadiness so S3 can discover selectable-but-partial Source KG semantics.
- Verified live contract on localhost:8002 exposes the new policy fields.
- Relevant S5 tests: paper-context API/observability/freeze-gate plus Source KG suites passed (143 passed).

## [2026-05-20] mcp | register_wr | s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow
- Registered request WR for s3
- Path: wiki/canon/work-requests/s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow.md

## [2026-05-20] Registered S3 consumer WR and clarified contract docs | S5 to S3 Source KG partial-quality consumption request
- Registered request WR: wiki/canon/work-requests/s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow.md
- Clarified S3 consumer action in wiki/canon/api/s5-paper-context-api.md, wiki/canon/api/knowledge-base-api.md, and wiki/canon/specs/s5-current-implementation-snapshot-20260520.md.
- The update is additive under s5-paper-context-api-v1 but requires S3 to preserve accepted_with_caveats diagnostics when consuming partial-but-ready Source KG.

## [2026-05-20] mcp | register_wr | s7-to-s3-s3-review-requested-s7-qwen-generation-control-contract-plan-before-implementati
- Registered question WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s3-review-requested-s7-qwen-generation-control-contract-plan-before-implementati.md

## [2026-05-20] mcp | complete_wr | s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | complete_wr | s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | register_wr | s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation
- Registered reply WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation.md

## [2026-05-20] mcp | complete_wr | s7-to-s3-s3-review-requested-s7-qwen-generation-control-contract-plan-before-implementati
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] Updated canonical S7 API contract for TraceAudit paper controls | S7 paper-controls implementation
- Added X-AEGIS-Paper-Controls header contract to wiki/canon/api/llm-gateway-api.md.
- Documented phase-scoped acquisition/finalizer rules, required no-default controls, logprobs/top_logprobs semantics, preserve_thinking handling, schema hard gate, prompt-redacted audit observability, and strict JSON coexistence.

## [2026-05-20] mcp | register_wr | s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path.md

## [2026-05-20] Completed S7 phase-scoped Qwen paper-controls implementation and sent S3 WR notice | S7 paper-controls implementation
- S7 tests passed: cd services/llm-gateway && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests => 328 passed in 6.61s.
- DGX vLLM probes confirmed seed/logprobs/top_logprobs/preserve_thinking acceptance and json_schema finalizer HTTP 200.
- Final Critic implementation validation returned APPROVE.
- S3 WR notice registered: wiki/canon/work-requests/s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path.md.

## [2026-05-20] mcp | complete_wr | s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-20] mcp | register_wr | s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-.md

## [2026-05-20] completed | S4 Semgrep effective-coverage hardening
- Added deterministic Semgrep effective-coverage metadata and C++ command-injection canary rules.
- Separated coverage caveats from system stability/degraded semantics via coverageDegraded/coverageReasons and staticEvidenceContract.gates.coverageQuality.
- Updated S4 API/spec/handoff/roadmap docs and registered S3 notice WR wiki/canon/work-requests/s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-.md.
- Verified full S4 suite: 1406 passed, 1 skipped; Semgrep config valid with 41 rules; wiki validation PASS.

## [2026-05-21] mcp | complete_wr | s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-21] Implemented post-WR S3 consumer handling for S4 Semgrep coverage caveats | S3 S4 coverage caveat consumer hardening
- coverageDegraded=true toolRuns rows are diagnostic ledger rows, not ordinary security evidence.
- Validation now requires coverageReasons and resolved diagnosticRefs for coverage-degraded tool runs.
- Regression test added for zero-finding Semgrep coverage caveat export.

## [2026-05-21] mcp | complete_wr | s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-21] mcp | complete_wr | s3-to-s7-s7-unblock-traceaudit-live-smoke-with-async-chat-request-observability-and-profi
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-21] completed | S4 bootstrap documentation refresh
- Updated wiki/canon/handoff/s4/readme.md with a fresh-session reset bootstrap packet.
- Updated wiki/canon/roadmap/s4-roadmap.md with reset-first next actions and Semgrep coverage notice state.
- Validated wiki and rebuilt index.
- Recorded session history at wiki/canon/handoff/s4/session-s4-bootstrap-refresh-20260521.md.

## [2026-05-21] Refreshed S7 handoff for fresh-session bootstrap | S7 bootstrap documentation
- Updated wiki/canon/handoff/s7/readme.md with a fresh-session bootstrap checklist and current TraceAudit paper-controls status.
- Marked S7-side S3 ITERATE and async/observability unblock WRs complete.
- Appended S7 test evidence to session-omx-1779269184895-8gprdc.md and recorded doc-refresh session history.
- Remaining S7-relevant open WR is the S5/S3/S7 e2e smoke notice for RCA follow-up.

## [2026-05-21] Updated S5 handoff/API/snapshot docs for clean session restart | S5 bootstrap documentation refresh
- Refreshed wiki/canon/handoff/s5/readme.md with 2026-05-21 first-read order, active S5 status, Source KG partial-quality caveat, outgoing S3 WR pointer, and current verification evidence.
- Updated wiki/canon/specs/s5-current-implementation-snapshot-20260520.md with a fresh-session bootstrap checklist, machine-readable Source KG quality contract fields, and current verification evidence.
- Updated wiki/canon/api/s5-paper-context-api.md and wiki/canon/api/knowledge-base-api.md last-verified/current-state overlays for the additive Source KG partial-quality consumer contract.
- Recorded session artifact wiki/canon/handoff/s5/session-s5-bootstrap-doc-refresh-20260521.md.

## [2026-05-21] Updated canonical S3 handoff for session restart | S3 bootstrap handoff refresh
- Added fast bootstrap sequence for next S3 session.
- Added current TraceAudit paper API/runner/S4/S5/S7 consumption snapshot.
- Recorded current verification snapshot and next meaningful e2e smoke gates.

## [2026-05-21] Documented current DGX Spark OpenVPN proxy access path | S7 DGX Spark OpenVPN bootstrap
- Updated wiki/canon/handoff/s7/llm-engine-ops.md with dgx-spark-proxy Docker/OpenVPN namespace runbook.
- Added SSH ProxyCommand using docker exec socat to 10.126.37.19:22 and HTTP proxy on 127.0.0.1:18000.
- Linked llm-engine-ops.md from S7 fresh-session bootstrap checklist.

## [2026-05-21] mcp | register_wr | s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi.md

## [2026-05-21] registered-work-request | S3 certificate-maker smoke blocked by S7/DGX idle transport timeout
- Run traceaudit-certmaker-smoke-20260521-133139 failed after S7 async-chat acr_fb419fb36056461a spent ~17m in llm-inference.
- S7 exposed async status while running, but backend transport failed with httpx.RemoteProtocolError; DGX proxy log showed socat read timeout at the same timestamp.
- Registered S3→S7 WR: wiki/canon/work-requests/s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi.md

## [2026-05-21] mcp | register_wr | s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen.md

## [2026-05-21] mcp | complete_wr | s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-21] mcp | register_wr | s7-to-s3-s7-notice-async-chat-truncated-stream-guard-added-after-critic-review
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-notice-async-chat-truncated-stream-guard-added-after-critic-review.md

## [2026-05-21] mcp | register_wr | s7-to-s3-s7-notice-long-dgx-async-streaming-smoke-passed-beyond-prior-timeout-window
- Registered notice WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-notice-long-dgx-async-streaming-smoke-passed-beyond-prior-timeout-window.md

## [2026-05-21] mcp | register_wr | s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md

## [2026-05-21] mcp | complete_wr | s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-21] mcp | complete_wr | s7-to-s3-s7-notice-async-chat-truncated-stream-guard-added-after-critic-review
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-21] mcp | complete_wr | s7-to-s3-s7-notice-long-dgx-async-streaming-smoke-passed-beyond-prior-timeout-window
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-21] S3 consumed three S7 async-chat WRs, added transcript preservation for S7 async status/backendActivity, verified S3-owned tests, and registered S7 follow-up for certificate-maker pre-first-byte disconnect. | S3 async backendActivity WR handling
- Session: wiki/canon/handoff/s3/session-s3-s7-async-backendactivity-wr-handling-20260521.md
- Follow-up WR: wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md
- Live rerun: /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-153850
- S7 async failure: acr_4ec11c2a720c42c7 backend_transport_disconnected backendActivity=null

## [2026-05-21] S7 addressed S3 certificate-maker disconnect WR | S7 pre-first-byte async telemetry and DGX proxy keepalive
- Root cause narrowed to DGX proxy/VPN idle disconnect during vLLM pre-first-byte/prefill window; S7 previously did not mark backendActivity until response headers/stream open.
- Implemented stream-dispatch backendActivity before async backend stream enter and clarified backend_transport_disconnected detail for pre-response disconnects.
- Updated DGX proxy entrypoint to enable socat keepalive keepidle=60 keepintvl=15 keepcnt=8 and rolled out after S7 activeRequestCount=0.
- Verification: S7 pytest 336 passed; async ownership suite 24 passed; compileall passed; live async smoke acr_a103b485f2d343f7 showed stream-dispatch then completed OK.

## [2026-05-21] mcp | register_wr | s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented
- Registered reply WR for s3
- Path: wiki/canon/work-requests/s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented.md

## [2026-05-21] mcp | complete_wr | s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-21] mcp | complete_wr | s5-to-s3-s7-s5-notice-e2e-smoke-failed-after-s5-success-at-s3-to-s7-chat-exchange
- Lane s7 completed recipient-side handling
- Status: completed

## [2026-05-21] mcp | register_wr | s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero.md

## [2026-05-21] mcp | complete_wr | s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented
- Lane s3 completed recipient-side handling
- Status: completed

## [2026-05-21] Certificate-maker E2E rerun still failed before response headers/SSE bytes; S7 instrumentation now shows stream-dispatch only for ~1065s, so S3 registered another S7 follow-up WR. | S3 certificate-maker rerun after S7 stream-dispatch instrumentation
- Run root: /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211
- S3 request: e2e-certmaker-rerun-start-20260521-164211
- S7 async: acr_a3c6de6e40bc42e8
- Follow-up WR: wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero.md

## [2026-05-21] mcp | register_wr | s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-
- Registered request WR for s7
- Path: wiki/canon/work-requests/s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-.md

## [2026-05-21] S3 registered an S7 addendum WR noting that the first certificate-maker LLM payload is only ~7.7KB/about 2k tokens despite 17m pre-first-byte silence. | S3 certificate-maker token measurement addendum
- WR: wiki/canon/work-requests/s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-.md
- Run root: /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211
- S7 async: acr_a3c6de6e40bc42e8
- Measured first acquisition request body: 7,740 bytes; crude estimate 1.9k-2.6k tokens; max_tokens=32768
