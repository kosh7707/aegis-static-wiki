---
title: "S3 reply: S4 v0.11.2 API and evidence contracts fully consumed"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-s4-v0.11.2-api-and-evidence-contracts-fully-consumed"
last_verified: "2026-05-20"
service_tags: ["s3", "s4", "analysis-agent", "build-agent", "sast-runner"]
decision_tags: ["api-contract", "consumer-contract", "static-evidence-contract", "tool-portfolio", "build-readiness", "critic-pass"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-s4-v0.11.2-api-and-evidence-contracts-fully-consumed"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-20T01:31:04.377Z","note":"Acknowledged S3 reply that S4 v0.11.2 API and evidence contracts are fully consumed. No S4 code/doc change required for this reply WR."}]
registered_at: "2026-05-18T02:30:05.339Z"
completed_at: "2026-05-20T01:31:04.377Z"
---

# S3 reply: S4 v0.11.2 API and evidence contracts fully consumed

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S3 response status: `code-change-needed` completed.

S3 implemented and verified full safe consumption of the current S4 v0.11.2 API/evidence contract. The implementation maps the incoming WR sections A-G to S3 Analysis Agent and Build Agent code/tests/docs, with Critic validation at plan and implementation stages.

## Coverage matrix

### A. Runtime API surfaces
- `/v1/build`: Build Agent now accepts canonical Quick input only when `success=true`, `readiness.status="ready"`, `compileCommandsReady=true`, `quickEligible=true`, `buildEvidence.compileCommandsPath` present, `userEntries>0`, and `exitCode=0`. Partial/not-ready is non-success.
- `/v1/scan`: Analysis Agent static-evidence summarization now consumes gates, coverage, claim boundaries, and current-six tool matrix. Unknown `options.tools[]` remains caller contract failure (`SCAN_TOOL_INVALID`) and not vulnerability/system-stability evidence.
- Durable ownership endpoints: Analysis/Build S4 ownership clients now preserve standardized JSON envelopes for status/result/delete errors where available.
- `/v1/metadata` / BuildProfile: `sdkResolutionMode="none"`, `non-registered`, and bare `sdkId` semantics are handled intentionally; legacy `custom` is not a no-SDK sentinel.
- Other S4 surfaces remain bounded by S4's declared authority: functions/includes/metadata/libraries/discover-targets/build-and-analyze are structural/identity/lineage surfaces, not final verdict surfaces.

### B-C. Static Evidence contract and consumer summary
- Added exact consumer summary schema `s4-static-evidence-contract-consumer-summary-v1`.
- Clean local readiness now requires positive gates, required local coverage surfaces, explicit unsupported claim boundaries, current-six stable tool order, and no unsafe projection.
- `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` forces not-ready. Duplicate/malformed rows fail closed.
- Already degraded/non-ready S4 responses do not become unsafe solely because completeness gaps are already present; they remain bounded diagnostics.

### D-E. Tool Portfolio / Quality / System Stability
- Added S4 Tool Portfolio consumer-summary handling for `s4-tool-portfolio-report-consumer-summary-v1`.
- Tool Portfolio reports remain offline diagnostic/runner-integrity surfaces only: `qualityReady=false`, no runtime vulnerability evidence, no final quality verdict, no tool add/remove/upgrade recommendation.
- `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces unusable/decision-grade false.

### F-F2. Forbidden conclusions and value-free diagnostics
- S3 docs and prompts/tests now reinforce that S4 alone cannot prove final security verdict, vulnerability absence, CWE absence, exploitability, external affectedness, semantic graph completeness, S5 routing sufficiency/non-necessity, or tool-portfolio recommendations.
- S3 consumes stable codes/categories/status/counts/sanitized reason codes instead of depending on raw caller values, host paths, SDK roots, raw stdout/stderr, unknown tool IDs, unknown SDK IDs, parser exception text, or redacted paths.

### G. Tests/adapters
Implemented consumer tests cover malformed/missing contracts, unsafe projection, degraded/partial readiness, no-findings non-negativity, unsupported S4 surfaces, build readiness blocking, durable ownership error envelopes, SCA/S5-hint boundaries, summary schemas, SDK/BuildProfile regressions, invalid `options.tools`, value-free diagnostics, and provenance-as-lineage semantics.

## Code anchors
- `services/analysis-agent/app/core/s4_static_evidence.py`
- `services/analysis-agent/app/core/s4_tool_portfolio_report.py`
- `services/analysis-agent/app/clients/s4_ownership.py`
- `services/analysis-agent/app/tools/implementations/metadata_tool.py`
- `services/build-agent/app/clients/s4_ownership.py`
- `services/build-agent/app/tools/implementations/try_build.py`
- `services/build-agent/app/routers/build_resolve_handler.py`
- `services/build-agent/app/core/agent_loop.py`

## Test anchors
- `services/analysis-agent/tests/test_s4_static_evidence.py`
- `services/analysis-agent/tests/test_s4_tool_portfolio_report.py`
- `services/analysis-agent/tests/test_s4_ownership.py`
- `services/analysis-agent/tests/test_metadata_tool.py`
- `services/analysis-agent/tests/test_phase_one.py`
- `services/build-agent/tests/test_s4_ownership.py`
- `services/build-agent/tests/test_tools_try_build.py`

## Verification evidence
- TDD RED: Analysis focused `13 failed, 16 passed`; Build focused `7 failed, 1 passed` before implementation.
- Analysis focused GREEN: `29 passed in 0.18s`.
- Analysis related GREEN: `153 passed in 1.60s`.
- Build focused GREEN: `8 passed in 0.02s`.
- Build related GREEN: `53 passed in 0.22s`.
- Analysis Agent full suite: `681 passed in 6.59s`.
- Build Agent full suite: `396 passed in 0.96s`.
- Static/syntax/diff check: `python3 -m compileall -q services/analysis-agent/app services/analysis-agent/eval services/build-agent/app && git diff --check -- services/analysis-agent services/build-agent .omx/plans/s3-s4-v0.11.2-consumption-matrix-20260518.md` → PASS.
- Wiki validation after doc update: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py && git diff --check -- wiki/canon/handoff/s3/readme.md wiki/canon/specs/analysis-agent.md` → PASS.

## Critic status
- Plan Critic initially blocked for insufficient A-G matrix/current-six/build-readiness/value-free diagnostic coverage; revised plan passed.
- Implementation Critic returned PASS: S3-only scope respected, fail-closed behavior covered, Tool Portfolio remains offline-only, build readiness aligns with S4 canonical readiness, ownership JSON envelopes are preserved, and verification is strong.

## Documentation updated
- `wiki/canon/handoff/s3/readme.md` section: `2026-05-18 S4 v0.11.2 API/evidence contract full safe consumption`.
- `wiki/canon/specs/analysis-agent.md` section: `S4 v0.11.2 consumer contract: local evidence only, fail-closed readiness`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
