---
title: "S3 post-ralplan execution followup defects (2026-04-27)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/home/kosh/AEGIS/.omc/plans/codex-handoff-s3-paper-remediation-20260427-v-final.md"
  - "/home/kosh/AEGIS/.omc/reports/post-execution-final-verdict-20260427.md"
  - "/home/kosh/AEGIS/.omc/reports/_post-execution-critic-A.md"
  - "/home/kosh/AEGIS/.omc/reports/_post-execution-critic-B.md"
  - "/home/kosh/AEGIS/.omc/reports/_post-execution-critic-C.md"
last_verified: "2026-04-28"
service_tags: ["s3", "analysis-agent", "build-agent"]
decision_tags: ["post-ralplan-followup", "wp-3-coverage", "wp-4-callee", "wp-5-poc-outcome", "wp-6-readiness-gate", "wp-7-poc-safety", "claim-audit-trail"]
related_pages:
  - "wiki/canon/handoff/s3/readme.md"
  - "wiki/canon/specs/analysis-agent.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/readme.md"
migration_status: "canonicalized"
wr_id: "s3-to-s3-post-ralplan-execution-followup-defects-20260427"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s3"]
registered_at: "2026-04-27T15:30:00Z"
completed_at: "2026-04-28T11:34:24+09:00"
completed_by_lanes: ["s3"]
---

# S3 post-ralplan execution followup defects (2026-04-27)

## Summary
- **Kind**: self-followup (next S3 session inherits)
- **From**: s3 (post-execution audit lane)
- **To**: s3 (next implementation session)
- **Status**: completed — S3 Ralph follow-up completed on 2026-04-28
- **Repo head at audit**: `5979f45` (`main`) with uncommitted v-final remediation work

## Context

S3가 `/home/kosh/AEGIS/.omc/plans/codex-handoff-s3-paper-remediation-20260427-v-final.md` 기반으로 대량 코드 업데이트를 완료했고, 2026-04-27 `/autopilot` Phase-4 multi-perspective critic이 검증을 수행했다. 결과:

- **analysis-agent**: 449 passed at critic handoff baseline; superseded by 492 passed after post-fix polish/test-gap closeout
- **build-agent**: 254 passed; no fake build-agent padding tests were added because the followups are analysis-agent scoped
- **기반 메커니즘 정상**: ClaimStatus enum, EvidenceCatalog history+latest, add_negative, _extract_cwe regex fix, as_evidence_refs filter, live_recovery_trace_summary, outcome_for_deficiency SSoT, plan_next_action planner, BudgetManager.would_exceed_after_repair, PoC quality retry loop, CLEAN_RETRY 제거, codegraph rename, role boundary tests
- **이미 S2 ack 완료된 plan deviations**:
  - WP-9 build-v1.1 always-on emission → `wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md` (completed 2026-04-27T09:45:23)
  - WP-1 claimDiagnostics object shape (entry-level typed models 대신 result.claimDiagnostics 객체) → `wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement.md` (completed 2026-04-27T09:45:23)

이 두 deviation은 **decision drift가 아니라 S2 합의된 contract change**이므로 followup 대상에서 제외한다.

다음 세션의 S3가 이어받을 실제 잔여 결함은 7건이다.

## Completion note (2026-04-28)

S3 Ralph completed all F-1..F-7 follow-up defects:

- F-1 claim lifecycle now appends `revisionHistory` on deterministic status transitions.
- F-2 Phase 2 tool exposure is filtered before AgentLoop schema exposure through `register_tools_for_session`.
- F-3 deficiency outcome SSoT now has full-class pinned regression coverage.
- F-4 `generate-poc` quality repair exhaustion returns `poc_inconclusive` only for repairable quality gaps; immediate unsafe/ref/grounding failures remain `poc_rejected`.
- F-5 `callee_path`/`callee_chain` acquisition routes to `code_graph.callees`.
- F-6/F-7 PoC quality gate rejects base64-decoded destructive payloads and quote/subshell/IFS escape structure.

Verification evidence:

- Focused S3 regression: `105 passed in 1.04s`.
- Full analysis-agent suite: `475 passed in 4.50s` at F-1..F-7 closeout; post-fix polish/test-gap closeout now verifies `492 passed in 5.36s`.
- Full build-agent suite: `254 passed in 0.48s`.
- `compileall` for analysis/build agent app code: PASS.
- Static wiki validation: PASS.
- Final architect sign-off: APPROVED.

Note: the old WR had legacy `wr_kind=followup`, which is not accepted by the canonical MCP completion tool. S3 normalized it to `wr_kind=request` and marked the file completed after `complete_wr` could not resolve the legacy entry.

---

## Followup defects (7 items)

### F-1 (HIGH) — `transition_claim_status`가 revisionHistory를 append하지 않음
**위치**: `services/analysis-agent/app/state_machine/claim.py:125-141`

`claim.model_copy(update={...})`로 status / requiredEvidence / presentEvidence / missingEvidence / evidenceTrail 갱신은 정상이나, `revisionHistory` 필드는 절대 건드리지 않는다. 결과: 모든 Claim의 `revisionHistory == []`. 논문 §4 XAI thesis에서 claim audit trail이 핵심 산출물인데 영구 비어있는 dead field.

**조치**:
```python
def transition_claim_status(claim, *, to_status, reason, ...):
    new_revision = {
        "fromStatus": claim.status,
        "toStatus": to_status,
        "reason": reason,
        "timestampMs": int(time.time() * 1000),
    }
    return claim.model_copy(update={
        "status": to_status,
        ...,
        "revisionHistory": [*claim.revisionHistory, new_revision],
    })
```

**테스트**: `tests/test_claim_lifecycle.py::test_transition_appends_revision_history` 추가 (현재 부재).

---

### F-2 (HIGH) — WP-6 code-graph readiness gating **전혀 구현 안됨**
**위치**: `services/analysis-agent/app/tools/router.py` (7 lines, no filter), `tools/router_core.py` (no readiness)

`wiki/canon/specs/analysis-agent.md:154-158` 명시 "GraphRAG/vector readiness가 명시적으로 false면 phase-2 code_graph.search를 LLM tool surface에서 제거" 미준수. 현재 neo4j 미준비 시에도 도구가 노출되어 LLM이 호출 시도 → 토큰/턴 낭비.

**조치**: `register_tools_for_session(session)` 도입 — `session.code_graph_neo4j_ready is False`면 `code_graph.*` 4종 도구 제외.

**테스트**: `tests/test_tool_router.py`에 2건 추가 — `test_codegraph_tools_excluded_when_neo4j_not_ready`, `test_knowledge_search_excluded_when_kb_not_ready`.

---

### F-3 (MAJOR) — WP-3 SSoT 18-site regression test 4/13 class만 핀닝
**위치**: `services/analysis-agent/tests/test_state_machine_contract.py:28-40`

현재 `test_outcome_for_deficiency_preserves_recoverable_branch_semantics`가 SCHEMA / GROUNDING / REPAIR_EXHAUSTED / POC_QUALITY 4 class만 outcome triple 핀닝. 미테스트 9 class (EMPTY_LLM_OUTPUT, MALFORMED_LLM_OUTPUT, STRICT_JSON_VIOLATION, QUALITY, REF, PARTIAL_DEPENDENCY, DEPENDENCY_UNAVAILABLE, TIMEOUT, INTERNAL_UNASSEMBLABLE)는 silent drift 가능.

**조치**: 13 DeficiencyClass × 의미있는 TriageContext 변형 = ~15-18 테스트 추가. 각 테스트는 (deficiency, context) → outcome triple을 정확히 핀닝.

---

### F-4 (MAJOR) — WP-5 exhaustion 시 POC_REJECTED 반환 (plan은 POC_INCONCLUSIVE)
**위치**: `services/analysis-agent/app/routers/generate_poc_handler.py:675`

```python
outcome=PocOutcome.POC_REJECTED,
```

plan v-final §3.6 + WP-5 code shape 모두 `POC_INCONCLUSIVE` 명시. 의미 차이: INCONCLUSIVE = 판정 못함 (repair tried but inconclusive), REJECTED = 분명히 나쁨. exhaustion semantics는 INCONCLUSIVE에 맞다.

**조치**: 1라인 변경 + `tests/test_generate_poc_handler.py:307` assert `pocOutcome == "poc_inconclusive"` 갱신.

논문 ablation에서 PoC 차원 카테고리 분류에 영향. 결정 시 S2 ack 필요할 수 있음.

---

### F-5 (MAJOR) — WP-4 callee_path → code_graph.callees 매핑 누락
**위치**: `services/analysis-agent/app/state_machine/acquisition_planner.py` `_plan_for_slot()`

현재 caller_chain/caller_path → code_graph.callers 분기만 존재. 클레임의 `missingEvidence`에 `callee_path`/`callee_chain`이 포함되면 planner가 None 반환 → LLM 제안 없음.

**조치**: callee 분기 추가 (~8 lines):
```python
elif slot in ("callee_path", "callee_chain"):
    if "code_graph.callees" not in available_tools:
        return None
    func = _function_from_claim_or_catalog(claim, catalog)
    if not func:
        return None
    return PlannedAction(
        tool_name="code_graph.callees",
        arguments={"function_name": func, "depth": 2},
        rationale=f"fill {slot} for {claim.location}",
        target_slot=slot,
    )
```

**테스트**: `tests/test_acquisition_planner.py::test_callee_path_routes_to_code_graph_callees`.

---

### F-6 (MAJOR) — WP-7 base64 detection 비-구조적 (substring marker만)
**위치**: `services/analysis-agent/app/quality/poc_quality_gate.py`

현재 `_SHELL_ESCAPE_MARKERS`에 literal `"base64 -d"` 포함. base64로 인코딩된 destructive command가 literal `"base64 -d"` 문자열을 포함하지 않으면 우회됨 (예: `bash -c "$(echo BASE64STRING | base64 --decode)"`).

**조치**: plan v-final WP-7 §1 명시한 `_decoded_base64_chunks()` 구현:
```python
import base64, re
_BASE64_LIKELY = re.compile(r"[A-Za-z0-9+/=]{40,}")

def _decoded_base64_chunks(text: str) -> list[str]:
    out = []
    for m in _BASE64_LIKELY.findall(text):
        try:
            decoded = base64.b64decode(m, validate=True).decode("utf-8", errors="ignore")
            if decoded and any(k in decoded.lower() for k in _DESTRUCTIVE_KEYWORDS):
                out.append(decoded)
        except Exception:
            pass
    return out
```

`evaluate_poc_quality(...)`에서 호출, 매칭 시 `failedItems` 추가.

**테스트**: `test_poc_quality_gate.py::test_base64_encoded_destructive_command_rejected` (실제 base64 인코드된 `rm -rf /` 입력).

---

### F-7 (MAJOR) — WP-7 quote-escape detection 누락
**위치**: 동상

`$(`, backtick, `$IFS`, `${IFS}` 검출 함수 부재. command injection 우회 패턴.

**조치**:
```python
def _quote_escape_present(text: str) -> bool:
    return any(p in text for p in ("$(", "`", "$IFS", "${IFS}"))
```

`evaluate_poc_quality(...)` 검사 + repairHint 추가.

**테스트**: `test_poc_quality_gate.py::test_quote_escape_pattern_rejected`, `test_well_formed_non_destructive_poc_with_canary_accepted`.

---

## Out of scope (이번 followup 비포함)

- **WP-8 EXPECTED_ARTIFACTS_MISMATCH spec drift WR** — 별도 발행 권장하지만 코드 영향 없음. 우선순위 낮음.
- **CWE family taxonomy 5/6 → 8 확장** — Pre-mortem V partial. 현재 generic fallback이 안전망 역할. 필요 시 후속 WR.
- **RP-6 advisory invariant 테스트** — prompt-level invariant라 unit test 어려움. 명시 약속이지만 우선순위 낮음.
- **MINOR cosmetic deviations** — WP-14 docstring phrasing, WP-17 AST vs pytest.raises, WP-7 canary substring vs regex marker, helper renaming. 모두 functionally OK.

---

## Acceptance criteria for this WR completion

다음 모두 만족 시 status: completed:

1. F-1 transition_claim_status가 revisionHistory append + test 통과
2. F-2 WP-6 register_tools_for_session 도입 + 2 테스트 통과
3. F-3 outcome_for_deficiency 13-class 핀닝 테스트 (≥13건) 통과
4. F-4 PocOutcome.POC_INCONCLUSIVE 변경 + test assert 갱신
5. F-5 callee_path → code_graph.callees 분기 + 테스트 통과
6. F-6 _decoded_base64_chunks 구현 + 우회 테스트 통과
7. F-7 _quote_escape_present 구현 + 테스트 통과
8. analysis-agent 테스트 449 → 470+ 통과 (≥21 신규)
9. build-agent 테스트 254 → 257+ 통과 (≥3 신규 — F-2 build 측 영향)
10. compileall ok
11. **변경 전 baseline 회귀 0건** — F-3 SSoT 테스트가 outcome 의미를 그대로 핀닝해야 함. 회귀 발견 시 즉시 stop & report.

## Effort estimate
- F-1: 30 min
- F-2: 90 min
- F-3: 2-3 hours (13 class 회귀 테스트 작성이 가장 노동 집약)
- F-4: 15 min
- F-5: 45 min
- F-6: 60 min
- F-7: 45 min
- **Total: ~7-8 hours**

Wk11 freeze 2026-06-29 기준 8주 여유 → 충분.

## Hand-off pointer
이 WR을 받은 다음 S3 세션:
1. 우선 `/home/kosh/AEGIS/.omc/reports/post-execution-final-verdict-20260427.md` §3 결함 표 확인
2. `_post-execution-critic-A/B/C.md`의 file_path:line_number 근거 재확인
3. F-1부터 F-7까지 순서대로 처리 (F-3는 가장 시간 큰 부분이므로 별도 세션 가능)
4. 완료 후 본 WR `status: completed` 갱신 및 후속 audit 1회 (single-pass critic)

— 끝 —
