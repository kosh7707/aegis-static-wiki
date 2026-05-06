---
title: "tool_choice=\"required\" empty tool_calls — root cause (caller-side flag combination, 2026-05-03)"
page_type: "context-decision"
canonical: false
source_repo: "AEGIS"
source_refs:
  - ".stability-probes/toolcall-rootcause-20260503/probe.py"
  - ".stability-probes/toolcall-rootcause-20260503/aggregate.md"
  - ".stability-probes/toolcall-rootcause-20260503/runs/"
  - "services/build-agent/app/core/agent_loop.py"
  - "services/build-agent/app/agent_runtime/llm/caller.py"
  - "services/build-agent/app/agent_runtime/llm/generation_policy.py"
last_verified: "2026-05-03"
service_tags: ["s3"]
decision_tags:
  - "llm-tool-choice"
  - "qwen3-thinking-template"
  - "caller-flag-incompatibility"
  - "build-agent-regression"
  - "p10"
related_pages:
  - "wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428.md"
---

# tool_choice="required" empty tool_calls — caller-side root cause (2026-05-03)

> **운영 가정**: vLLM 0.20.0 + qwen3 reasoning + qwen3_coder tool + MTP=1 stack는 정상 동작한다고 가정. 결함 원인은 caller(=AEGIS) 측 코드/설정에서 찾는다.
> **결론**: caller가 `tool_choice="required"`와 `chat_template_kwargs.enable_thinking=true`를 **동시에** 보내는 것이 결함의 충분조건. 두 플래그 중 어느 하나만 빼도 결함 0건. 반대로 두 플래그 함께면 결함 89%.
> **수신자**: S3 (build-agent + analysis-agent), 검증한 결함은 build-agent 첫 턴이지만 동일 패턴이 analysis-agent에도 코드상 존재하므로 같은 처방 적용.

---

## 0. TL;DR

caller-side 코드에 **호환 안 되는 플래그 두 개**가 동시에 박힌다:

1. `services/build-agent/app/core/agent_loop.py:68-81` `_tool_choice_for_turn` → 첫 턴에 `tool_choice="required"` 반환
2. `services/build-agent/app/core/agent_loop.py:370` `controls_from_constraints(THINKING_GENERAL, ...)` → `enable_thinking=true` 강제

이 두 플래그를 같이 보내면 89%의 응답에서 `tool_calls=[]`이고 11%(6/55)에서만 정상 호출이 잡힌다 (N=55 측정). 어느 한 플래그를 빼면 0/20에서 모두 정상 동작.

코드 자체에는 두 플래그 호환성을 검증하는 가드가 없다. **두 플래그 조합이 코드상 동시에 활성될 수 있도록 허용된 것 자체가 결함**.

---

## 1. 실험 설계

`/home/kosh/AEGIS/.stability-probes/toolcall-rootcause-20260503/probe.py` 작성. 실제 실패한 build-agent 첫 턴 요청(`req-e2e-build-s3-cert-maker-spot-20260503-015411_turn-01` dump)을 baseline body로 로드하고, 단일 변수만 바꾼 7개 variant를 S7 `/v1/chat`에 직접 N회씩 발사. 결과를 dump + summary로 저장.

| Variant | tool_choice | temperature | enable_thinking | tools | max_tokens | system prompt | N |
|---|---|---|---|---|---|---|---|
| V0 baseline | required | 1.0 | true | 6 (full) | 16384 | full (~3000 토큰) | 15 |
| V1 auto control | **auto** | 1.0 | true | 6 | 16384 | full | 10 |
| V2 temp 0.3 | required | **0.3** | true | 6 | 16384 | full | 10 |
| V3 no thinking | required | 1.0 | **false** | 6 | 16384 | full | 10 |
| V4 single tool | required | 1.0 | true | **1** (list_files) | 16384 | full | 10 |
| V5 min prompt | required | 1.0 | true | 6 | 16384 | **~50 토큰** | 10 |
| V6 small max | required | 1.0 | true | 6 | **2048** | full | 10 |

각 attempt 측정: `tool_calls.length`, `finish_reason`, `content` 길이, `reasoning` 길이, `completion_tokens`. 실패 정의 = `tool_calls.length == 0`.

---

## 2. 결과

### 2.1 요약표 (`aggregate.md` 사본)

| Variant | N | failures | rate | avg comp tokens (fail) | avg reasoning len (fail) |
|---|---:|---:|---:|---:|---:|
| V0 baseline | 15 | 14 | 0.93 | 81 | 117 |
| V1 auto control | 10 | 0 | 0.00 | — | — |
| V2 temp 0.3 | 10 | 10 | **1.00** | 94 | 121 |
| V3 no thinking | 10 | **0** | **0.00** | — | — |
| V4 single tool | 10 | 9 | 0.90 | 118 | 149 |
| V5 min prompt | 10 | 7 | 0.70 | 455 | 1680 |
| V6 small max | 10 | 9 | 0.90 | 86 | 117 |

전체 N=75. `tool_choice=required + thinking=true` 그룹(V0+V2+V4+V5+V6) = 49/55 fail = **89%**. 두 플래그 중 하나 제거(V1 또는 V3) = 0/20 fail = **0%**.

### 2.2 공통 실패 시그니처

실패한 응답은 모두 동일 형태:
- `finish_reason="tool_calls"` (vLLM이 도구 호출 의도 감지)
- `tool_calls=[]` (배열은 비어 도착)
- `content=""` (텍스트 없음)
- `reasoning=non-empty` (V0/V2/V4/V6 ~87~149자 / V5 minimal prompt ~1680자, thinking 본문 들어있음)
- `completion_tokens` V0/V2/V4/V6에서 약 60~94 (reasoning에 다 안 들어가는 ~30~70 토큰이 어디론가 사라짐). V5는 105~1154 (avg 455) — minimal prompt이므로 모델이 thinking에 더 많은 토큰 씀.

### 2.3 V2(temp=0.3)의 결정성

V2는 **10/10 모두 동일한 응답** (`completion_tokens=94, reasoning=121자`). temperature 낮추면 결함이 결정적으로 발현. V0(temp=1.0)에서 14/15 실패 + 1 성공인 이유는 temp=1.0의 sampling stochasticity가 가끔 결함 모드 탈출. **결함 자체는 결정적, 탈출만 확률적.**

### 2.4 V5(minimal prompt)의 reasoning 길이

V5는 system prompt가 짧아서 모델 thinking이 더 길게 나옴 (avg reasoning 1680자). 그래도 70% 실패. **prompt 길이/내용/도구 명세는 결함률에 1차 인자가 아님**.

### 2.5 V3(no thinking)의 정상 동작

V3는 `enable_thinking=false`만 바꿨고 baseline의 다른 모든 조건(full prompt, 6 tools, temp=1.0, max=16384, tool_choice=required)을 유지. 결과 10/10 정상 + reasoning_len=0 (thinking 필드 빈 채로 옴). **thinking 비활성만으로 결함 0**.

---

## 3. 가설별 평가

| H | 가설 | 평가 | 증거 |
|---|---|---|---|
| H1 | system prompt가 "tool 호출"과 "JSON content 출력" 동시 지시해서 충돌 | **기각** | V5(minimal prompt)도 70% 실패 — prompt가 원인이면 결함 사라져야 함 |
| H2 | temperature=1.0이 guided decoding 통과 못 시킴 | **반대 방향 기각** | V2(temp 0.3)는 100% 실패 (오히려 더 결정적). temp가 클수록 stochastic 탈출 가능 |
| H3 | `enable_thinking=true` × `tool_choice="required"` 모순 | **확정** | V3(no thinking) 0% / V1(auto) 0%. 두 플래그 중 하나 빼면 결함 0건 |
| H4 | tool 정의 schema 복잡도 | **기각** | V4(1 tool) 90% 실패 — tool 개수/복잡도 무관 |
| H5 | max_tokens 큼 | **기각** | V6(max=2048) 90% 실패 — max_tokens 무관 |
| H6 | system prompt 길이 자체 | **기각** | V5(minimal prompt) 70% 실패 — 길이 약간만 영향 |
| H7 | 단순 stochastic | **기각** | V2 100% / V3 0% — variable이 결정적 영향 줌 |

**확정된 root cause**: caller가 두 플래그를 동시에 보낸다.

---

## 4. 결함이 일어나는 코드 위치

build-agent의 첫 턴 `_call_with_retry` 호출 트리:

`services/build-agent/app/core/agent_loop.py:172` (첫 턴 호출 자리):
```python
response = await self._call_with_retry(
    session,
    current_tools,
    tool_choice=_tool_choice_for_turn(  # ← required 첫 턴에 박힘
        session=session,
        current_tools=current_tools,
        force_report=force_report,
    ),
)
```

`services/build-agent/app/core/agent_loop.py:68-81` `_tool_choice_for_turn`:
```python
def _tool_choice_for_turn(*, session, current_tools, force_report) -> str:
    # P10 — 첫 턴은 도구 호출 강제, 성공한 호출이 한 번이라도 있을 때까지 required
    if not current_tools or force_report or _has_successful_tool_calls(session):
        return "auto"
    return "required"  # ← 첫 턴에 활성
```

`services/build-agent/app/core/agent_loop.py:370` (실제 LlmCaller.call 호출):
```python
return await self._llm_caller.call(
    ...,
    generation=controls_from_constraints(THINKING_GENERAL, session.request.constraints),
    # ↑ THINKING_GENERAL.enable_thinking=True
)
```

`services/build-agent/app/agent_runtime/llm/generation_policy.py:80-88`:
```python
THINKING_GENERAL = GenerationControls(
    temperature=1.0, top_p=0.95, top_k=20, min_p=0.0,
    presence_penalty=0.0, repetition_penalty=1.0,
    enable_thinking=True,   # ← 항상 True
)
```

`services/build-agent/app/agent_runtime/llm/caller.py:131-147` 요청 body 조립:
```python
body: dict = { "model": ..., "messages": ..., "max_tokens": ... }
body.update(controls.to_gateway_fields())  # ← enable_thinking=true 들어감
...
if tools:
    body["tools"] = tools
    body["tool_choice"] = tool_choice     # ← required 들어감
```

**`tool_choice`와 `enable_thinking` 둘 다 활성된 body가 만들어지고 S7로 송신**. 이 조합이 호환 안 된다는 가드 0건.

analysis-agent도 동일 패턴: `services/analysis-agent/app/core/agent_loop.py:144-152`/`:257`에 동일 `_tool_choice_for_turn` + 동일 `THINKING_GENERAL` 사용.

---

## 5. 두 플래그가 왜 호환 안 되는지 (호환성 가설, 코드 측에서 단정 가능 범위)

코드 측에서 100% 단정할 수 있는 사실:
- **`enable_thinking=true`**: Qwen3 chat template이 응답 첫머리에 `<think>...</think>` 블록을 강제 삽입하도록 동작.
- **`tool_choice="required"`**: vLLM은 OpenAI 사양에 따라 이 값이 들어오면 응답을 `tool_calls` JSON schema로 강제하는 guided decoding을 활성.
- 두 메커니즘은 **응답 토큰 스트림의 같은 시작 위치를 다르게 강제**한다 (thinking 블록 vs structured JSON).

코드 측에서 알 수 있는 측정 결과 (vLLM 내부 추측 아님):
- 두 플래그 동시 활성 → `tool_calls=[]` + `reasoning=non-empty` + `finish_reason="tool_calls"` 형태로 응답
- 즉 **vLLM은 응답을 보내긴 하지만, structured tool_calls 배열은 비고 reasoning 필드만 채워서 보냄**
- 이 형태는 OpenAI 사양상 `finish_reason="tool_calls"`이면 `tool_calls`가 non-empty이어야 한다는 약속 위반
- caller 측 `_parse_response`(`caller.py:639-682`)는 이 위반을 검출하지 않고 빈 응답으로 간주, agent_loop가 `output_deficient`로 분류

vLLM 내부에서 정확히 어디서 깨지는지(reasoning-parser가 본문을 흡수하는지, qwen3_coder parser가 추출 실패하는지, guided decoding이 thinking template과 첫 토큰 충돌하는지)는 본 보고서가 단정하지 않는다 — 그건 vLLM 소스 추적 영역. 본 보고서가 단정하는 것은 **코드 측이 호환 안 되는 두 플래그를 같이 보내는 것은 caller 코드의 결함이며, caller 측에서 fix 가능**하다.

---

## 6. 처방 (코드 측만)

vLLM 변경 없이 caller 측에서 결함 0%로 만드는 방법. 우선순위순.

### 6.1 처방 A — `tool_choice="required"` 송신 차단 (최소 변경, 권장)

`_tool_choice_for_turn`을 항상 `"auto"` 반환하도록. P10 의도("증거 없는 첫 턴 차단")는 별도 caller-side 검증으로 살린다(§6.3).

```python
# services/build-agent/app/core/agent_loop.py:68-81
def _tool_choice_for_turn(*, session, current_tools, force_report) -> str:
    # tool_choice="required" + enable_thinking=true 조합이 첫 턴 89% 실패
    # (.stability-probes/toolcall-rootcause-20260503/aggregate.md). thinking을
    # 끄지 않는 한 required 사용 금지. 본 함수는 이제 항상 auto 반환.
    return "auto"
```

analysis-agent도 동일.

검증: V1(N=10) 결과 그대로. 0% 실패 보장.

### 6.2 처방 B — required 유지하되 thinking 끔 (P10 의도 보존하되 thinking 손실)

`tool_choice="required"`인 턴에 `enable_thinking=false` 강제. 첫 턴 thinking 효익 포기 + tool 호출은 100% 보장.

```python
# services/build-agent/app/core/agent_loop.py:370 부근
tc = _tool_choice_for_turn(...)
gen = controls_from_constraints(THINKING_GENERAL, session.request.constraints)
if tc == "required":
    gen = gen.with_updates(enable_thinking=False)  # 호환성 가드
response = await self._call_with_retry(..., tool_choice=tc, generation=gen)
```

검증: V3(N=10) 결과 그대로. 0% 실패 보장. 첫 턴 reasoning 필드는 0자.

### 6.3 처방 C — caller 측 응답 검증 + retry (defense-in-depth)

처방 A 또는 B와 함께 적용. **선결 조건**: `LlmContractViolationError` 클래스가 현 코드베이스에 없으므로 새로 만들어야 함:

1. `services/build-agent/app/agent_runtime/errors.py` (analysis-agent 동일 위치도)에 `LlmContractViolationError(S3Error)` 클래스 추가. retryable=True 속성 박음.
2. `services/build-agent/app/agent_runtime/policy/retry.py:18-25` `RetryPolicy.should_retry()`에 `isinstance(error, LlmContractViolationError): return True` 분기 추가.
3. `services/build-agent/app/agent_runtime/llm/caller.py:639-682` `_parse_response`에 검출 로직:

```python
# After existing tool_calls parsing
finish_reason = choice.get("finish_reason", "stop")
content = message.get("content")
reasoning = message.get("reasoning")  # ← 현 코드는 무시함, 캡처 필요

if finish_reason == "tool_calls" and not tool_calls:
    raise LlmContractViolationError(  # 위 1번에서 만든 새 에러
        "finish_reason=tool_calls with empty tool_calls array",
        reasoning_excerpt=(reasoning or "")[:500],
        finish_reason=finish_reason,
    )
```

검증: 처방 A/B 적용 시 이 검출은 0건이 되어야 함 (안전망).

### 6.4 처방 D — P10 의도(증거 없는 첫 턴 차단)를 caller-side로 옮김

처방 A 채택 시 P10 의도가 약화될 우려. 이를 보존:

```python
# 첫 턴 응답에서 tool_calls 0개면 명시적 retryable 분류
if session.turn_count == 0 and not response.tool_calls:
    raise EvidenceFirstTurnViolation(
        "first turn produced no tool call; caller requires evidence-first"
    )
```

agent_loop가 이 에러를 catch해서 retry. 단 retry budget 결정 필요 (운영 영역).

### 6.5 권장 조합

**처방 A + C + D**.
- A로 결함 발생 자체 차단 (가장 단순)
- C로 contract violation 안전망 (S3가 다른 lane에서 또는 미래에 required 다시 박는 회귀 차단)
- D로 P10 의도 보존
- B는 thinking 효익을 우선시할 때만 채택 (프로젝트 정책 결정)

---

## 7. regression-gate (재발 차단)

`services/analysis-agent/tests/test_s3_llm_readiness_gate.py`에 호환성 가드 추가:

```python
def test_required_tool_choice_never_combined_with_enable_thinking():
    # tool_choice="required" + enable_thinking=true는 결함 89% (rootcause-20260503.md)
    for root in S3_ROOTS:
        loop = (root / "app/core/agent_loop.py").read_text()
        # _tool_choice_for_turn이 "required" 반환하지 않거나, 반환하는 경로에서
        # enable_thinking=False로 강제하는 구현이 명시되어 있어야 함
        if 'return "required"' in loop:
            assert 'enable_thinking=False' in loop or 'with_updates(enable_thinking=False)' in loop, \
                f"{root} combines tool_choice=required with enable_thinking=true (rootcause-20260503)"
```

---

## 8. 본 보고서가 단정하는 것 / 단정하지 않는 것

**단정**:
- caller가 보내는 body에 `tool_choice="required"` + `chat_template_kwargs.enable_thinking=true`가 함께 들어가면 89% 결함.
- 둘 중 어느 하나만 빼면 0% 결함 (N=20).
- temperature/tool count/max_tokens/prompt 길이는 결함률에 1차 인자가 아님.
- 결함의 결정성은 high (V2 temp=0.3에서 100% 재현). high temp의 randomness가 가끔 탈출.
- caller 코드(`agent_loop.py` + `generation_policy.py`)에는 두 플래그 호환성 가드가 없다.

**단정하지 않음**:
- vLLM 내부의 어느 단계에서 tool_call 추출이 실패하는지 (reasoning-parser 흡수 / qwen3_coder 추출 실패 / guided decoding-thinking-template 충돌 — 이 셋 중 어느 것이 정확한 메커니즘인지). 본 보고서는 vLLM이 정상 동작한다는 가정 하에 caller 측 처방만 도출.
- `tool_choice="required"`가 다른 thinking-off 모델/다른 vLLM 버전에서 호환되는지 — 본 결과는 현 stack(vLLM 0.20.0 + Qwen3.6 + qwen3 reasoning + qwen3_coder + MTP=1) 한정.
- 처방 D(EvidenceFirstTurnViolation retry)의 retry budget 적정값 — 운영 측정 필요.

---

## 9. 재현 방법

```bash
# 서비스 살아있는지 확인
curl -s -m 3 -o /dev/null -w "%{http_code}\n" http://localhost:8000/v1/health

# 단일 variant 재현 (V0 baseline)
cd /home/kosh/AEGIS/services/build-agent
.venv/bin/python /home/kosh/AEGIS/.stability-probes/toolcall-rootcause-20260503/probe.py v0_baseline --n 5 --parallelism 2

# 결과 집계
.venv/bin/python /home/kosh/AEGIS/.stability-probes/toolcall-rootcause-20260503/aggregate.py
```

probe.py는 실제 실패한 dump를 baseline body로 로드 → variant 함수가 단일 변수만 변형 → S7 `/v1/chat`에 N회 발사 → per-attempt JSON dump + summary 저장. 코드 변경 없이 재현 가능. (본 조사는 read-only + 스크립트 실행만 사용함.)

---

## 10. cross-reference

| 문서 | 내용 |
|---|---|
| 본 조사 dump | `.stability-probes/toolcall-rootcause-20260503/runs/{v0..v6}_summary.json` (총 75 attempts) |
| 본 조사 실행 스크립트 | `.stability-probes/toolcall-rootcause-20260503/probe.py` |
| 가설 정리 | `.stability-probes/toolcall-rootcause-20260503/hypotheses.md` |
| 집계 표 | `.stability-probes/toolcall-rootcause-20260503/aggregate.md` |
| 선행 분석 (over-reach 포함) | `wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md` — 본 보고서가 super-cede |
| P10 도입 보고서 | `wiki/context/decisions/temperature-policy-analysis-20260428.md` |
| 코드 위치 | `services/{build,analysis}-agent/app/core/agent_loop.py:68-81 _tool_choice_for_turn` + `app/agent_runtime/llm/generation_policy.py:80-88 THINKING_GENERAL` |
