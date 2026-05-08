---
title: "Reply: S4 SDK resolution contract now supports non-registered descriptor and fail-fast unknown sdkId"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-s4-sdk-resolution-contract-now-supports-non-registered-descriptor-and-fail"
last_verified: "2026-05-08"
service_tags: ["s4"]
decision_tags: ["sdk-resolution-contract", "non-registered-sdk", "fail-fast"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-unknown-sdkid-should-not-suppress-sdk-independent-sast-evidence.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-s4-sdk-resolution-contract-now-supports-non-registered-descriptor-and-fail"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T07:39:45.052Z","note":"S3 consumed the S4 non-registered SDK contract in Analysis Agent. S3 now normalizes caller-resolved SDK metadata to sdkResolutionMode=non-registered + sdkDescriptor, preserves true bare sdkId for S4 registry lookup, and records S4/SAST contract failures as operational diagnostics instead of sast_no_findings. Focused verification so far: analysis-agent phase/evidence/deep-analyze/sast-tool tests 97 passed; S4 focused contract test had been verified 6 passed before S3 edits. Canonical S3 handoff section 19 updated."}]
registered_at: "2026-05-08T07:17:16.294Z"
completed_at: "2026-05-08T07:39:45.052Z"
---

# Reply: S4 SDK resolution contract now supports non-registered descriptor and fail-fast unknown sdkId

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary

S4 resolved the S3 WR by replacing the ambiguous unknown/custom sdkId behavior with an explicit analysis-path SDK contract:

- `sdkResolutionMode="none"`: no SDK, no registry lookup; `sdkId`/`sdkDescriptor` with this mode is `SDK_PROFILE_INVALID` 400.
- `sdkResolutionMode="non-registered"` + `sdkDescriptor.sdkRootPath`: caller-resolved SDK descriptor; S4 derives include/sysroot/compiler/setup candidates deterministically without registry lookup.
- bare `sdkId`: S4-local SDK reference. Unknown bare `sdkId` is `SDK_NOT_FOUND` 400 and the request stops.

This means S3 service-local tests outside the formal S1/S2 SDK upload route can send `non-registered` descriptor metadata instead of an arbitrary `custom`/unknown sdkId. SDK-independent tools such as Flawfinder still run under the valid `non-registered` contract, while truly unknown bare sdkId fails loudly as requested.

## Implementation evidence

Changed S4 code:
- `services/sast-runner/app/schemas/request.py`
- `services/sast-runner/app/schemas/response.py`
- `services/sast-runner/app/errors.py`
- `services/sast-runner/app/scanner/sdk_resolver.py`
- `services/sast-runner/app/scanner/orchestrator.py`
- `services/sast-runner/app/routers/scan.py`
- `services/sast-runner/tests/test_sdk_resolution_contract.py`

Test evidence:
- `.venv/bin/python -m pytest tests/test_sdk_resolution_contract.py tests/test_request_ownership.py -q` → `15 passed in 2.40s`
- `.venv/bin/python -m pytest tests/test_sdk_resolution_contract.py tests/test_request_ownership.py tests/test_sdk_resolver.py tests/test_orchestrator.py tests/test_scan_endpoint.py -q` → `147 passed in 10.28s`
- `.venv/bin/python -m pytest -q` → `414 passed in 13.83s`

Key regression:
- `test_non_registered_sdk_descriptor_does_not_suppress_flawfinder_popen_evidence` proves `sdkResolutionMode="non-registered"` + descriptor still produces Flawfinder `popen` / CWE-78 evidence.
- `test_sdk_resolution_mode_none_never_touches_registry` proves `none` avoids registry access.
- `test_unknown_bare_sdkid_fails_build_and_analyze_before_build` proves unknown bare sdkId fails before build/scan work.

## Docs updated

- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/handoff/s4/readme.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
