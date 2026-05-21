---
title: "S4 notice: Semgrep C++ effective-coverage hardening and additive coverage contract fields are ready for S3 consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-"
last_verified: "2026-05-21"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "semgrep", "paper-pipeline", "traceaudit"]
decision_tags: ["semgrep-cpp-effective-coverage", "additive-api-contract", "consumer-notice", "no-negative-evidence"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-notice-semgrep-c-effective-coverage-hardening-and-additive-coverage-contract-"
wr_kind: "notice"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-21T02:01:33.784Z","note":"Reviewed from S3 consumer perspective. No blocking S3 code change is required before e2e. S3 paper normalization already preserves S4 toolRuns/diagnostics and does not derive TP/FP/clean negative evidence from Semgrep status=success or findingsCount=0; zero-finding paper cases export without generating a negative verdict. Coverage caveats should remain producer diagnostics/contract caveats in S3 packets. Follow-up optional hardening: add a targeted S3 regression asserting coverageDegraded/tool-coverage diagnostic fields are accepted and preserved once S4 fixtures are finalized."}]
registered_at: "2026-05-20T11:20:07.005Z"
completed_at: "2026-05-21T02:01:33.784Z"
---

# S4 notice: Semgrep C++ effective-coverage hardening and additive coverage contract fields are ready for S3 consumption

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S4 notice: Semgrep C++ effective-coverage hardening and additive coverage contract fields are ready for S3 consumption

## Summary

S4 fixed and hardened the Semgrep issue found by the analyze pass: Semgrep was alive, but C++ targets could be effectively uncovered because local rules were C-only and the C++/mixed include filter excluded `.cpp`-class files.

This is not a new SAST tool and not a tool portfolio change. It is an S4 Semgrep coverage/contract hardening pass.

## What changed for S3

When Semgrep runs, S4 may now emit additive effective-coverage fields on Semgrep tool results and paper tool rows:

```json
{
  "coverage": { "coverageKind": "semgrep-effective-coverage-v1" },
  "coverageDegraded": true,
  "coverageReasons": ["SEMGREP_CPP_EFFECTIVE_COVERAGE_UNPROVEN"]
}
```

Important consumer rule:

- `coverageDegraded=true` is **not** `degraded=true`.
- It does **not** mean Semgrep process/liveness/system stability failed.
- It means S4 is honestly reporting an effective-coverage caveat.
- S3 must not treat `findingsCount=0` as clean/negative evidence when coverage caveats or `tool-coverage` diagnostics are present.

`staticEvidenceContract.gates.qualityEvaluation` remains `not_evaluated` for runtime artifacts. Effective-coverage caveats are surfaced separately through:

```text
staticEvidenceContract.gates.coverageQuality
toolEvidenceMatrix[].coverageDegraded
toolEvidenceMatrix[].coverageReasons
toolEvidenceMatrix[].coverage
```

Paper bundles may also include `toolRuns[].coverage*`; `status="success" + coverageDegraded=true` gets a `tool-coverage` diagnosticRef.

## Implementation notes

- Added C++ Semgrep command-injection canary rules for `popen()` and `system()` under `services/sast-runner/rules/cpp/`.
- Fixed C++/mixed Semgrep include filtering so C++ files are not excluded.
- ProjectPath source discovery now uses the same C/C++ extension set as Semgrep coverage metadata.
- S3-facing consumer canary accepts the new coverage-caveat policy without marking the contract unsafe.

## Verification

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1406 passed, 1 skipped in 34.39s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/semgrep --validate --config rules
# Configuration is valid - found 0 configuration error(s), and 41 rule(s).
```

Direct certmaker proof:

```text
services.sast-runner.rules.cpp.aegis.cpp.cwe-78-popen-with-variable at main.cpp:35
```

Critic status: final PASS_WITH_CHANGES was resolved by updating the stale S4 spec test-count row; no remaining code blocker found.

## Requested S3 action

No blocking action is required before using S4. Please update S3 consumer assumptions if any code treats Semgrep `findingsCount=0` or `status=success` as sufficient without checking S4 coverage diagnostics/contract caveats.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
