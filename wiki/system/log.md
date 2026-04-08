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
