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
