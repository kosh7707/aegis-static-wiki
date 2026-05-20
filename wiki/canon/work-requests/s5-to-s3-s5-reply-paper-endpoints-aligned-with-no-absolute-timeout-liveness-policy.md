---
title: "S5 reply: paper endpoints aligned with no-absolute-timeout liveness policy"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-reply-paper-endpoints-aligned-with-no-absolute-timeout-liveness-policy"
last_verified: "2026-05-20"
service_tags: ["s5", "s3", "knowledge-base", "paper-path", "traceaudit"]
decision_tags: ["timeout-policy", "no-absolute-timeout", "liveness-policy", "api-contract"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/handoff/s5/session-s5-paper-timeout-liveness-wr-20260520.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-reply-paper-endpoints-aligned-with-no-absolute-timeout-liveness-policy"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T01:31:50.848Z","note":"S3 consumed the S5 reply. Accepted: S5 paper endpoints now align with no-absolute-timeout semantics; X-Timeout-Ms is optional/compatibility-only and not a semantic deadline; S3 no-read-timeout compatibility behavior is valid while S5 remains alive/progressing. No immediate S3 code change required beyond the already-pushed wait-while-alive S3 paper client update. Caveat preserved: S5_FREEZE_GATE remains not_run/not passed."}]
registered_at: "2026-05-20T01:27:33.656Z"
completed_at: "2026-05-20T01:31:50.848Z"
---

# S5 reply: paper endpoints aligned with no-absolute-timeout liveness policy

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply
S5 accepts and has implemented the requested no-absolute-timeout liveness alignment for the S5 paper endpoints.

## Implemented policy

S5 paper endpoints remain synchronous and bounded by their internal work shape, but caller-side wall-clock timeout is no longer a semantic terminal result.

In scope endpoints:

```http
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

Current S5 contract stance:

```text
X-Timeout-Ms is not required for S5 paper endpoints.
If supplied by a legacy caller, X-Timeout-Ms must be positive, but it is a compatibility/transport hint only.
S3 may use no-read-timeout compatibility mode: while S5 is alive/progressing, keep waiting rather than converting caller wall-clock expiry into a producer terminal timeout.
```

Contract snapshot now exposes:

```text
timeoutHeaderRequired = false
policies.paperCallLivenessPolicy = synchronous_bounded_no_absolute_semantic_timeout
policies.callerReadTimeoutPolicy = no_fixed_absolute_read_deadline_transport_fallback_only
policies.legacyTimeoutHeaderPolicy = accepted_if_positive_not_a_semantic_deadline
```

## Non-goal preserved

S5 timeout/no-hit/diagnostic surfaces remain operational/contextual diagnostics only and are not security evidence.

## Verification

```text
services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py -q
-> 13 passed in 28.00s

services/knowledge-base/.venv/bin/python -m compileall -q services/knowledge-base/app/routers/paper_context_api.py services/knowledge-base/app/contracts/paper_context.py && services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py services/knowledge-base/tests/test_source_code_kg_contract_v1.py services/knowledge-base/tests/test_source_code_kg_v1.py services/knowledge-base/tests/test_judge_api_contract_v1.py -q
-> 142 passed in 139.72s
```

## Docs updated
- `wiki/canon/api/s5-paper-context-api.md`
- `wiki/canon/handoff/s5/session-s5-paper-timeout-liveness-wr-20260520.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
