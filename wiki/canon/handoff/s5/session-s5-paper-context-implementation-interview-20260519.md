---
title: "S5 paper-context implementation interview and hard-now delivery session"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "wiki/canon/api/s5-paper-context-api.md"
  - "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md"
original_path: "mcp://record_session_history/s5/session-s5-paper-context-implementation-interview-20260519"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "knowledge-base", "paper-context", "source-code-kg", "threat-kb", "handoff"]
decision_tags: ["session-history", "implementation-crystal", "tdd", "critic-reviewed", "hard-now-implemented", "s5-freeze-gate-not-run"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
---

# S5 paper-context implementation interview and hard-now delivery session

## Session

- Lane: S5 / Knowledge Base
- Session ID: `session-s5-paper-context-implementation-interview-20260519`
- Status: `hard_now_subset_implemented`
- Last verified: 2026-05-19

## Interview crystal

The pre-implementation interview resolved the following execution boundary:

```text
First goal: real-internals S3-consumable S5 Paper Context API + S3 HYBRID hard-now safety subset.
Second goal: complete S5_FREEZE_GATE hardening/freeze suite.
```

User constraints captured during interview:

- TDD is mandatory: tests must be written and observed failing before implementation.
- Use real S5 internals; do not reduce the paper API to fixtures/stubs.
- S1/S2 legacy compatibility is deprecated/non-goal for this implementation lane.
- S3 bottleneck removal has priority; implement the S3-requested API first.
- Freeze-gate full hardening is desirable but may be deferred after the S3-consumable hard-now subset.
- All work follows `plan -> plan validation -> implementation -> implementation validation` with Critic review.

## Implemented hard-now surface

Implemented in `services/knowledge-base/**`:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

Files delivered:

```text
services/knowledge-base/app/contracts/paper_context.py
services/knowledge-base/app/paper_context/__init__.py
services/knowledge-base/app/paper_context/models.py
services/knowledge-base/app/paper_context/service.py
services/knowledge-base/app/routers/paper_context_api.py
services/knowledge-base/tests/test_paper_context_api_contract.py
services/knowledge-base/app/main.py
services/knowledge-base/app/routers/contracts_api.py
```

Real internals used:

- `SourceCodeKgIngestRequest`
- `ingest_source_kg`
- `SQLiteLedgerRepository.get_source_kg_context`
- `SQLiteLedgerRepository.record_provider_observation`
- `build_threat_retrieval_evidence`
- S5 ledger taxonomy tables for direct CWE/CAPEC fallback

## Hard-now subset coverage

Covered for first S3-consumable goal:

1. contract snapshot and endpoint shape;
2. response schema minimums and stable producer provenance keys;
3. generic-mode enforcement and required forbidden leakage class set;
4. baseline whole-visible-field leakage guard for paper POST responses;
5. non-verdict vocabulary boundary;
6. diagnostic separation with `negativeEvidenceAllowed=false`;
7. B2/B4 structural support through `rowSetId`, stable `itemId`, stable `text`, and stable `orderingKey`;
8. in-process idempotency replay/conflict behavior.

Current gate interpretation:

```text
S3 may begin consuming the S5 paper-context API for end-to-end integration.
S5_FREEZE_GATE remains not_run / not passed.
S5/Threat KB RQ5 contribution remains exploratory or demotable until full freeze gate passes.
```

## Verification evidence

TDD RED:

```text
services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py -q
-> 4 failed, 9 errors before implementation because paper-context endpoints/modules were missing.
```

Targeted GREEN:

```text
services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py -q
-> 13 passed in 23.11s.
```

Related regression:

```text
services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py services/knowledge-base/tests/test_source_code_kg_contract_v1.py services/knowledge-base/tests/test_source_code_kg_v1.py services/knowledge-base/tests/test_judge_api_contract_v1.py -q
-> 142 passed in 146.41s.
```

Compile check:

```text
services/knowledge-base/.venv/bin/python -m compileall -q services/knowledge-base/app/paper_context services/knowledge-base/app/routers/paper_context_api.py services/knowledge-base/app/contracts/paper_context.py
-> pass.
```

Full S5 service-root suite:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests -q
-> 725 passed in 667.66s.
```

Repo-root full S5 invocation note:

```text
services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests -q
-> 3 failures caused by existing tests reading relative paths (`app/main.py`, `scripts/neo4j-seed.py`) from cwd.
Re-run from services/knowledge-base passed.
```

## Critic evidence

Plan validation #1:

```text
REJECT
Reason: schemas, prepare->retrieve mapping, finding selector logic, threat projection, paper-specific errors, and RED tests needed to be fixed before coding.
```

Plan validation #2:

```text
PASS_WITH_CHANGES
Required clarifications: direct CWE/CAPEC fallback, idempotency cache shape, router wiring/reset.
```

Implementation validation:

```text
PASS_WITH_CHANGES
No blocking S5 implementation issue. Docs must state hard-now subset implemented/tested while S5_FREEZE_GATE remains not_run.
```

## Remaining work

Second-goal hardening items:

1. full generic Threat KB leakage corpus/matrix;
2. complete whole-packet leakage fixture matrix;
3. full B2/B4 stable-row regression suite;
4. full durable idempotency conflict matrix, if S3 needs process-restart replay safety;
5. complete S3 consumer guard fixtures;
6. richer distinction between Source KG not-prepared/unavailable and valid anchored no-hit;
7. S3-owned paper-analysis API updates via S3 coordination/WR;
8. formal `S5_FREEZE_GATE=pass` CI/audit package.

### 2026-05-19T10:15:02.914Z — passed
- Command: `services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py -q`
- Log ref: thread-output:targeted-green
- 13 passed in 23.11s
- Covers S5 paper-context contract snapshot, timeout enforcement, generic visibility fail-closed, forbidden leakage classes, no synthetic Code KB readiness, real Source KG prepare/retrieve, no-hit diagnostics, generic Threat KB projection, visible-field leakage guard, and idempotency replay/conflict.

### 2026-05-19T10:15:08.044Z — passed
- Command: `services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py services/knowledge-base/tests/test_source_code_kg_contract_v1.py services/knowledge-base/tests/test_source_code_kg_v1.py services/knowledge-base/tests/test_judge_api_contract_v1.py -q`
- Log ref: thread-output:related-regression
- 142 passed in 146.41s
- Confirms new paper-context tests plus existing Source KG and Judge API contract regressions remain green.

### 2026-05-19T10:15:13.493Z — passed
- Command: `cd services/knowledge-base && .venv/bin/python -m pytest tests -q`
- Log ref: thread-output:full-s5-service-root-suite
- 725 passed in 667.66s
- Full S5 suite passes from the service root. A repo-root invocation had 3 existing relative-path failures; service-root rerun matched those tests' path assumptions and passed.
