---
title: "LLM tool_choice=\"required\" × Qwen3 reasoning-parser × MTP — production blocker 분석 + 다중 lane 처방 (2026-05-03)"
page_type: "context-decision"
canonical: false
source_repo: "AEGIS"
source_refs:
  - "services/llm-gateway/app/routers/tasks.py"
  - "services/analysis-agent/app/agent_runtime/llm/caller.py"
  - "services/analysis-agent/app/core/agent_loop.py"
  - "services/build-agent/app/agent_runtime/llm/caller.py"
  - "services/build-agent/app/core/agent_loop.py"
  - "services/logs/llm-dumps/req-e2e-build-s3-cert-maker-spot-20260503-015411_turn-01_1777740871021.json"
  - "services/logs/llm-dumps/req-e2e-build-hot3-qg-stability-20260428-204030-01_turn-01_1777376538688.json"
last_verified: "2026-05-03"
service_tags: ["s3", "s7"]
decision_tags:
  - "llm-tool-choice"
  - "vllm-bug"
  - "qwen3-reasoning-parser"
  - "qwen3-coder-tool-parser"
  - "speculative-decoding-mtp"
  - "build-agent-regression"
  - "p10-rollback"
  - "production-blocker"
related_pages:
  - "wiki/context/decisions/temperature-policy-analysis-20260428.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s3-followup-20260503.md"
  - "wiki/context/decisions/temperature-policy-analysis-20260428-s7-summary.md"
  - "wiki/canon/specs/llm-engine.md"
  - "wiki/canon/api/llm-gateway-api.md"
  - "wiki/canon/handoff/s7/readme.md"
---

# tool_choice="required" × Qwen3 reasoning-parser × MTP — 회귀 근본 원인 + 다중 lane 처방

> **상태**: production blocker. 2026-05-03 certificate-maker E2E spot test (Stage 2) 실패. Build agent 첫 턴 100% 실패 재현.
> **수신자**: S7 (1차 책임), S3 (2차 책임), 게이트 책임자 (회귀 재발 차단).
> **이 문서가 즉효약 아닌 영구 처방을 다루는 이유**: 같은 회귀가 P10 외 다른 인접 변경(tool_choice="none"/named, 새 reasoning parser 옵션, 새 모델 family 등)에서도 잠복할 수 있다. 일회성 롤백만으론 재발 방지 불가능.

---

## 0. 한 줄

vLLM 0.20.0 (`--enable-auto-tool-choice --tool-call-parser qwen3_coder --reasoning-parser qwen3 --speculative-config mtp=1`)에 caller가 `tool_choice="required"`를 보내면, **모델이 정상 동작해도 응답의 `tool_calls=[]`로 비어 반환되고 finish_reason은 `"tool_calls"`로 박혀 OpenAI 계약을 위반**한다. P10 변경(2026-04-28)이 이 잠복 결함을 build-agent 첫 턴에 100% 노출시켜 빌드 stage가 모두 실패한다.

---

## 1. 사건 정리

| # | 시점 | 사건 |
|---|---|---|
| 1 | 2026-04-28 | Temperature 정책 보고서 §6.2 / §7 처방으로 P10 도입 권고: build/analysis-agent 첫 턴에 `tool_choice="required"` 박아 evidence 없는 무작정 보고서 출력 차단 |
| 2 | 2026-04-29 ~ 05-02 | S3가 P10 + P16/P17/P18/P19 모두 처리. AST regression-gate 박음. unit test 70/70 PASS. 코드리뷰 PASS 처리 |
| 3 | 2026-05-03 01:54 | certificate-maker E2E spot test 실행 → Stage 2 (Build Agent) 첫 턴에서 즉시 FAIL (`BUILD_SCRIPT_SYNTHESIS_FAILED`, `LLM이 유효한 tool_calls도 content도 반환하지 않음`) |
| 4 | 2026-05-03 02:30 | LLM dump 분석 → vLLM 응답이 `finish_reason="tool_calls"` + `tool_calls=[]` + `reasoning="…"` 조합. completion_tokens=94 중 약 26 토큰만 reasoning에 들어가고 **나머지 ~68 토큰은 content/tool_calls 어디에도 없음** (parser가 추출 실패하고 버림) |
| 5 | 2026-05-03 02:45 | 2026-04-28 성공 dump (`tool_choice="auto"`)와 비교 → **identical reasoning 텍스트**, **identical 모델 행동**, 차이는 tool_choice 값과 추출 결과 |

---

## 2. 결정적 증거 (내부)

### 2.1 두 dump의 직접 비교 — model behavior는 같다, parser 결과만 다르다

#### **실패 (post-P10, 2026-05-03)**
File: `services/logs/llm-dumps/req-e2e-build-s3-cert-maker-spot-20260503-015411_turn-01_1777740871021.json`

요청:
```json
{
  "tool_choice": "required",
  "tools": [list_files, read_file, write_file, edit_file, delete_file, try_build],
  "chat_template_kwargs": {"enable_thinking": true},
  "temperature": 1.0, "top_p": 0.95, "top_k": 20, "min_p": 0.0,
  "presence_penalty": 0.0, "repetition_penalty": 1.0
}
```

응답:
```json
{
  "message": {
    "role": "assistant",
    "content": "",
    "tool_calls": [],
    "reasoning": "Let me start by exploring the project structure and reading the key build files to understand how to build this project.\n"
  },
  "finish_reason": "tool_calls",
  "usage": {"completion_tokens": 94}
}
```

#### **성공 (pre-P10, 2026-04-28)**
File: `services/logs/llm-dumps/req-e2e-build-hot3-qg-stability-20260428-204030-01_turn-01_1777376538688.json`

요청 (구조 동일, **차이는 `tool_choice="auto"` 단 한 줄**):
```json
{
  "tool_choice": "auto",
  "tools": [동일 6개],
  "chat_template_kwargs": {"enable_thinking": true},
  ...
}
```

응답:
```json
{
  "message": {
    "role": "assistant",
    "content": null,
    "tool_calls": [
      {
        "id": "chatcmpl-tool-8b945e9aab9279ad",
        "type": "function",
        "function": {
          "name": "list_files",
          "arguments": "{\"max_depth\": 3, \"path\": \"/home/kosh/AEGIS/uploads/proj-…\"}"
        }
      }
    ],
    "reasoning": "Let me start by exploring the project structure and reading the key build files to understand how to build this project.\n"
  },
  "finish_reason": "tool_calls"
}
```

### 2.2 핵심 관찰

1. **reasoning 텍스트가 byte-perfect 동일**: "Let me start by exploring the project structure and reading the key build files to understand how to build this project.\n" — 모델은 두 경우 같은 thinking을 했다. 즉 모델 내부 결정은 동일.
2. **단일 변인 실험은 아니지만 핵심 차이 식별 가능**: 두 dump는 같은 prompt/같은 모델/같은 thinking template을 공유하지만 sampling 파라미터는 P16/P18 처리 결과로 변경됨 (성공 dump: `temperature=0.3` 단독 / 실패 dump: `temperature=1.0, top_p=0.95, top_k=20, min_p=0.0, presence/repetition penalty 0/1`). 그러나 reasoning 텍스트 byte-identical은 모델 내부 행동이 sampling 변화에도 동일했음을 시사하고, parser 단계에서 동작이 갈렸다는 강한 신호.
3. **인과 귀속의 근거 3중**: (a) reasoning 텍스트가 동일 → 모델 행동이 같다, (b) §3 외부 vLLM 업스트림이 정확히 이 caller-side `tool_choice` 값에 대해 같은 클래스 결함을 재현, (c) `tool_choice="required"`가 vLLM의 guided decoding 경로를 활성화한다는 사실(공식 docs). 이 셋이 합쳐 **caller-side `tool_choice` 값이 벌어진 일의 confirmed trigger**임을 입증. (단, §4의 정확한 메커니즘 — 어느 parser 단계에서 어느 토큰이 어떻게 잘못 처리됐는지 — 는 vLLM 소스 추적 없는 상황에서 hypothesis 단계.)
4. **calling agent의 잘못 아님**: caller 입장에서 잘 짜인 OpenAI request이고 schema 위반 0.

### 2.3 S3 caller가 contract violation 검출 못 하는 자리

`services/build-agent/app/agent_runtime/llm/caller.py:653`:
```python
raw_tool_calls = message.get("tool_calls") or []   # contract violation 검출 0
tool_calls = []
for tc in raw_tool_calls: ...
content = message.get("content")                   # message.reasoning 무시
```

`agent_loop.py`는 `response.has_tool_calls() == False` + 빈 content → `empty_response → output_deficient`로 분류. retry 기회 없음, `BUILD_SCRIPT_SYNTHESIS_FAILED`로 종료.

`message.reasoning` 필드를 dump에는 남기지만 **agent_log 또는 LlmResponse 어디에도 캡처 안 됨**. 운영 디버깅 시 thinking이 보이지 않아 원인 추적 어렵다.

### 2.4 S7 `/v1/chat` proxy가 contract violation 검출 못 하는 자리

`services/llm-gateway/app/routers/tasks.py:984-1084` (transparent forward zone — `resp_data = resp.json()` ~ `Response(...)` 반환):
- vLLM 응답을 `resp.json()` 후 caller에 transparent forward.
- `_finish_reason` 값을 로그/메트릭에는 박지만 **`finish_reason="tool_calls"` ↔ `tool_calls=[]` 일관성 검증 0건**.
- strict_json 경로(`_apply_strict_json_response_contract`, line 1007~)는 caller가 `X-AEGIS-Strict-JSON: true` 헤더 보낼 때만 발동(이는 caller가 tools 안 쓸 때만 발동) → **tool calling 경로는 sanity check 0**.
- async path(`/v1/async-chat-requests`)도 동일 — `resp.json()` 후 `async_chat_manager.complete()`로 결과 저장만 하고 contract 검증 0.

---

## 3. 결정적 증거 (외부 vLLM 업스트림)

같은 클래스 결함이 vLLM 업스트림에 다수 보고됨. AEGIS 결함은 격리된 개별 사건이 아니라 **vLLM × Qwen3-thinking × tool_choice="required" 조합의 알려진 incompatibility class에 속한다**.

| # | 이슈 | 핵심 |
|---|---|---|
| #19051 | 400 response when using Qwen3 + reasoning + tool calling + tool_choice "required" | 정확히 같은 3-요소 조합 |
| #19513 | Qwen3 Enable Reasoning breaks Tool Call Parsing | reasoning-parser 활성화가 tool parsing 깨뜨림 |
| #22132 | Qwen3 tool call format possibly being clobbered by guided decoding | guided decoding(=`tool_choice="required"`)이 tool 형식 깨뜨림 |
| #22975 | tool calling not correctly parsed but remains in the plain content for qwen3 coder | qwen3_coder parser가 종종 tool call 추출 실패 → content에 raw로 남음 |
| #29192 | Tool Calling Parsers Fail to Populate tool_calls Array for Qwen2.5-Coder Models | tool_calls=[] 빈 배열 회수 |
| #35221 | qwen3 reasoning parser incorrectly parse reasoning-only output as content | reasoning parser가 본문 경계 잘못 잡음 |
| #38106 | tool_choice="required" + speculative decoding with Qwen leads to failed tool calls | **MTP(=AEGIS 설정 `--speculative-config mtp=1`) + tool_choice="required" 조합 자체가 failed tool calls 유발** |
| #35800 | Enabling speculative coding causes malformed Tool Calls in Qwen | MTP가 tool call 깨뜨림 |

**AEGIS 설정 stack**: vLLM 0.20.0 + `qwen3` reasoning-parser + `qwen3_coder` tool-call-parser + MTP=1 + Qwen3.6-27B thinking-on. **위 이슈 8개 중 최소 4개가 동시 적용**된다. 따라서 AEGIS는 단일 이슈가 아니라 **합집합 위험 영역**에 정확히 박혀 있다.

---

## 4. 근본 원인 — confirmed trigger + hypothesized mechanism

> **명확한 분리**: §4는 두 단계로 나뉜다.
> - **§4.0 confirmed trigger** (강한 근거): caller-side `tool_choice="required"`가 결함을 일으킨다는 사실은 §2 dump 비교 + §3 vLLM 업스트림 8건으로 입증.
> - **§4.1~4.3 hypothesized mechanism** (약한 근거): 정확히 어느 parser 단계에서 어느 토큰이 어떻게 잘못 처리됐는지는 vLLM 소스 추적이 끝나기 전까지 hypothesis. 처방의 정당성은 §4.0만 있으면 충분 — 메커니즘 가설은 추가 회복(§6.1-C)을 가능하게 하는 보조 설명.

### 4.0 Confirmed trigger

caller가 `tool_choice="required"` 값을 보내면 vLLM 응답이 contract 위반(`finish_reason="tool_calls"` + `tool_calls=[]`)을 일으킨다. P10 도입 전(`tool_choice="auto"`) 같은 prompt에서 같은 모델로 정상 추출됨. 외부 vLLM 업스트림이 정확히 이 trigger에 대해 동일 클래스 결함 다수 재현(§3).

### 4.1 Hypothesized mechanism — 3-way parser 경로 충돌

vLLM이 한 요청을 처리할 때 활성화되는 path는 caller가 보낸 `tool_choice`에 따라 갈라진다:

### 4.2 `tool_choice="auto"` 경로 (정상 동작)
1. 모델 자유 출력 (`<think>...</think>` 후 자연스러운 도구 호출 텍스트, 예: `<tool_call>{...}</tool_call>`)
2. `--reasoning-parser qwen3`: `<think>...</think>` 내용을 잘라 `message.reasoning` 필드로 분리
3. `--tool-call-parser qwen3_coder`: `</think>` 이후 본문에서 `<tool_call>...</tool_call>` envelope 인식 후 OpenAI tool_calls JSON으로 변환
4. caller가 받는 응답: structured tool_calls + 분리된 reasoning ✅

### 4.3 `tool_choice="required"` 경로 (현 결함)
1. **vLLM이 guided decoding (xgrammar/outlines) 활성화**: 응답을 OpenAI tool_calls JSON schema에 맞춰 강제. 이 path는 **`<tool_call>` envelope를 거치지 않고** 직접 structured 출력을 만들도록 logits processor를 갈아낌.
2. 그러나 `--reasoning-parser qwen3`가 동시에 활성: 모델은 thinking template 따라 `<think>...</think>` 먼저 emit (template 강제). guided decoding은 thinking 종료 후부터 schema 적용 시도.
3. **충돌 지점**: thinking 종료 마커 (`</think>`)와 guided JSON 시작 사이의 transition을 두 parser가 모순되게 해석 — qwen3_coder는 envelope를 기대하지만 guided decoding은 envelope 없이 raw JSON을 만들거나, MTP가 draft token을 greedy 샘플링하면서 transition token이 깨지거나, reasoning parser가 `</think>` 이후 일부 토큰까지 잘못 흡수.
4. 결과: `tool_calls=[]` (parser 추출 실패), `content=""` (qwen3 reasoning parser가 본문을 reasoning 쪽으로 흡수했을 때), `reasoning="…"` (정상 캡처), `finish_reason="tool_calls"` (vLLM은 의도 감지하므로).

### 4.4 합쳐진 인과 사슬

```
P10 (caller가 tool_choice="required" 박음)
  ↓
vLLM tool_choice="required" 경로 (guided decoding 활성)
  + thinking template (enable_thinking=true) 활성
  + reasoning-parser qwen3 활성 (transition 흡수 위험)
  + qwen3_coder tool-parser 활성 (envelope 기대)
  + MTP=1 (draft token greedy 샘플 위험)
  ↓
응답 contract violation (finish_reason=tool_calls + tool_calls=[])
  ↓
S7 /chat proxy: 검증 0건, transparent forward
  ↓
S3 caller: contract 검출 0건, message.reasoning 무시
  ↓
agent_loop: empty_response → output_deficient → BUILD_SCRIPT_SYNTHESIS_FAILED
  ↓
E2E Stage 2 실패, Stage 3~6 모두 not-run
```

---

## 5. 즉시 처방 (Step 0 — 빌드/분석 회복)

`tool_choice="required"`는 위 sub-system 호환성 검증 끝날 때까지 **production에서 사용 금지**. 두 lane 모두 즉시 롤백.

### 5.1 S3 build-agent
- 위치: `services/build-agent/app/core/agent_loop.py:68-81` `_tool_choice_for_turn(...)` (함수 정의 + return 두 경로 포함)
- 조치: 무조건 `"auto"` 반환하도록 임시 변경 (P10 effective 비활성화)
- 검증: certificate-maker E2E 다시 돌려 Stage 2 PASS 확인

### 5.2 S3 analysis-agent
- 위치: `services/analysis-agent/app/core/agent_loop.py:144-157` 동일 함수
- 조치: 동일 — 무조건 `"auto"` 반환. analysis-agent E2E도 동일 결함 발생할 가능성 매우 높음 (같은 vLLM stack 사용).
- 검증: deep-analyze E2E spot test로 첫 턴 tool_call 추출 정상 확인.

### 5.3 게이트 정합
- `services/analysis-agent/tests/test_s3_llm_readiness_gate.py:72-89` `test_s3_p10_p16_p19_static_readiness_markers_remain_present`의 P10 검증 (`'return "required"' in loop`)을 **"P10 비활성 마커가 명시적으로 박혀 있다"** 검증으로 변경. 검증 의미를 뒤집어 회귀 방향 반대로 묶음.
- 또는 임시로 해당 assertion만 skip + 사유 코멘트 박음.

> **이건 즉효약**. 사용자가 "재발하지 않을 완전한 remedy"를 요구했으므로 §6 영구 처방 없이 §5만 머물면 안 된다.

---

## 6. 영구 처방 — lane 분담

### 6.1 S7 처방 (1차 책임)

#### S7-A: vLLM 응답 contract sanity check 도입 (필수)

`services/llm-gateway/app/routers/tasks.py`에 vLLM 응답 contract validator 추가. **두 path 모두 적용**:

```python
def _validate_llm_response_contract(resp_data: dict) -> str | None:
    """Return a short violation reason string, or None if response is well-formed."""
    choices = resp_data.get("choices") or [{}]
    msg = choices[0].get("message") or {}
    finish_reason = choices[0].get("finish_reason")
    tool_calls = msg.get("tool_calls") or []
    content = msg.get("content")
    reasoning = msg.get("reasoning")

    # Contract: finish_reason="tool_calls" implies tool_calls is non-empty
    if finish_reason == "tool_calls" and not tool_calls:
        return "finish_reason_tool_calls_with_empty_array"
    # Contract: finish_reason="stop" + empty content + empty tool_calls + non-empty reasoning
    # → model output absorbed by reasoning-parser (qwen3 #35221 class bug)
    if (finish_reason in {"stop", "tool_calls"} and not tool_calls
            and (content is None or content == "") and reasoning):
        return "all_output_absorbed_into_reasoning"
    return None
```

**삽입 위치 (sync path)**: `chat_proxy()` 내부, 현 transparent forward zone(984~1084 사이) — 정확히는 `resp_data = resp.json()` 직후 (line 988~) `if resp.status_code == 200:` 분기(line 1027~) 진입 직후 배치. strict_json normalization 분기와 충돌하지 않는 위치.

**삽입 위치 (async path)**: `tasks.py:458-637`의 `_run_async_chat_request` (또는 동등) 내부, `resp_data = resp.json()` 직후 + `async_chat_manager.complete()` 호출(현 line 619~) 직전. 즉 status=200 성공 분기에서 `complete()` 부르기 전에 validator 실행. 위반 시:
1. `async_chat_manager.complete()` 대신 `async_chat_manager.fail(retryable=True, blocked_reason="response_contract_violation", error_detail=violation_reason)` 호출 — async path는 직접 HTTP status를 caller에 박지 않고 `fail()` 레코드에 retryable=True를 박음. caller가 `/v1/async-chat-requests/{id}/result` 폴링 시 이 레코드를 받아 sync path 503과 동등하게 retry 분기로 진입. (sync path는 HTTP 503, async path는 fail-record `retryable=True` — 같은 의미 다른 표현)
2. 추가로 `request_tracker.mark_ack_break(request_id, blocked_reason="response_contract_violation", ack_source="contract-validator")` 호출하여 추적 일관성 유지.

위반 검출 시:
- **503 LLM_PARSE_RETRY**로 변환 (retryable=True). `502`가 아닌 `503`을 쓰는 이유: 현 S3 caller `caller.py:231`은 `retryable = resp.status_code in (429, 503)`로 502를 retryable로 보지 않는다. 502를 쓰면 retry 분기가 안 타고 즉시 실패한다 — 같은 결함을 다른 에러 코드로 다시 일으킴. 503 또는 caller-side 매핑 확장(§6.2-A) 둘 중 하나 필수.
- 응답 본문에 `errorDetail.violationReason` + `errorDetail.rawResponseExcerpt` (raw response의 처음 1KB) 포함 (caller 디버깅용)
- Prometheus counter `aegis_llm_response_contract_violation_total{reason}` 증분 (label cardinality 안전 — reason은 §8 표의 enum)
- structured log: 위반 reason + finish_reason + len(tool_calls) + len(content) + len(reasoning)

이로써 caller(S3)가 `empty_response`로 silent fall-through 하지 않고 명시적 retryable error를 받게 된다.

**streaming 응답 범위 외**: 본 validator는 non-streaming 응답을 가정. AEGIS는 `/v1/chat`/`/v1/async-chat-requests` 모두 비-stream 사용하므로 영향 없음. 향후 stream 도입 시 본 doc 갱신 필수 (chunk 단위로 `finish_reason`+`tool_calls` 동시 검증 불가).

**근거 외부 자료**: vLLM 업스트림이 contract 위반을 fix하기 전까지 gateway가 마지막 방어선이어야 한다.

#### S7-A-2: 요청 측 `tool_choice` 검증 (필수)

같은 proxy의 요청 측에서 caller가 보낸 `tool_choice` 값을 §6.1-B 가이드 표(✅ 목록)에 맞춰 검증. `required` 또는 `{"type":"function",...}` 같이 검증 미통과 값 → **422 INVALID_TOOL_CHOICE** 즉시 반환. body validator는 이미 `_chat_generation_control_errors` 패턴 있으므로 동등 패턴으로 추가:

```python
_ALLOWED_TOOL_CHOICE = {"auto", "none"}

def _validate_tool_choice(body: dict) -> str | None:
    tc = body.get("tool_choice")
    if tc is None or tc in _ALLOWED_TOOL_CHOICE:
        return None
    return f"unsupported tool_choice value: {tc!r} (allowed: {sorted(_ALLOWED_TOOL_CHOICE)})"
```

이로써 caller가 실수로(또는 향후 회귀로) 미지원 값을 보내면 응답 단계까지 가지 않고 422로 즉시 차단. response validator(§S7-A)는 그래도 마지막 방어선으로 남음(vLLM이 새로운 contract 위반 클래스 만들 가능성 대비).

#### S7-B: vLLM 시작 옵션 spec 갱신 + 미지원 path 명시 (필수)

`wiki/canon/specs/llm-engine.md` § 시작 옵션 표에 caller가 보내도 안전한 `tool_choice` 값 한정 명시:

> **caller 측 `tool_choice` 사용 가이드 (vLLM 0.20.0 + qwen3 reasoning + qwen3_coder tool + MTP=1 기준)**
> - ✅ `"auto"` — 정상 동작 검증됨
> - ✅ `"none"` — tool 무시. tools 인자 안 보내는 것과 동일.
> - ❌ `"required"` — **호환되지 않음**. vLLM 업스트림 #19051 / #22132 / #38106 클래스 결함. response contract violation 발생. 호출 시 S7가 422 INVALID_TOOL_CHOICE (요청 측, §6.1-A-2) 또는 503 LLM_PARSE_RETRY (응답 측, §6.1-A) 반환.
> - ❌ `{"type": "function", "function": {"name": "..."}}` (named) — 검증 미수행. `required`와 동일 guided-decoding 경로이므로 잠정 사용 금지.

`wiki/canon/api/llm-gateway-api.md`에도 동일 가이드 동기화. caller-facing API 계약서에 명시 박혀야 lane 간 합의 가능.

#### S7-C: `tool_choice="required"` 호환성 회복 plan (선택, 시일 여유 있을 때)

향후 `required` path를 살리려면 다음 중 하나가 필요. 결정 후 spec에 박음:

1. **vLLM 업그레이드 + 재검증** — 업스트림 fix가 들어간 버전(현재 main 브랜치 기준 일부 PR 진행 중)으로 올린 후 spot test 통과 시 가이드 표 업데이트.
2. **MTP 비활성** (`--speculative-config` 제거) + 재검증. #38106가 핵심 원인일 경우 회복 가능. 다만 throughput 저하 trade-off (이전 보고서 §7 측정 권고).
3. **reasoning-parser 비활성** + 재검증. tool 호출 턴에 thinking 효익 포기. 빌드/분석에서 thinking off는 이전 보고서 §6.2가 옵션으로 다룸 — 운영 측 정책 결정 필요.
4. **별도 vLLM endpoint 분리** — tool calling용 (auto only) vs reasoning용 (no tools) 분리 호스팅. 인프라 부담.

**권장**: 단기 #1 (업스트림 fix 추적), 중기 #2 또는 #3 측정 후 결정.

#### S7-D: response contract 메트릭/대시보드 (필수)

다음 두 Counter 추가. label cardinality 모두 bounded:

- `aegis_llm_response_contract_violation_total{reason}` — `reason`은 §8 표 enum (`finish_reason_tool_calls_with_empty_array`, `all_output_absorbed_into_reasoning`, 향후 추가될 contract 위반 레이블). 새 레이블 추가는 본 doc 갱신 + S7-A validator 코드 변경과 동시 진행.
- `aegis_llm_finish_reason_total{finish_reason,tool_calls_empty}` — `finish_reason`은 OpenAI/vLLM enum (`stop`, `length`, `tool_calls`, `content_filter` 등 5종 이내). `tool_calls_empty`는 명시적 string `"true"`/`"false"` (boolean을 Prometheus가 string으로 직렬화 시 일관성 위해). 결과 cardinality ≈ 5 × 2 = 10 series. 안전.

운영 시 새로운 incompatibility class 조기 감지. 대시보드는 `tool_calls_empty="true"` AND `finish_reason="tool_calls"` 비율을 시계열로 띄우는 게 1차 신호.

### 6.2 S3 처방 (2차 책임)

#### S3-A: caller 응답 contract 검증 + 명시적 에러 분류 (필수)

> **S7-A와의 관계 (defense-in-depth)**: §6.1-A가 적용된 후에는 vLLM 직접 응답이 S3에 도달하지 않고 S7가 503 LLM_PARSE_RETRY로 변환해 보낸다. 따라서 §6.2-A의 contract violation 검출은 **다음 두 시나리오**에서만 실제로 fire:
> 1. S7-A가 아직 배포 안 됐거나 일부 path 누락된 임시기간 (defense-in-depth)
> 2. 미래 vLLM stack 변경으로 S7-A가 미처 잡지 못한 새 contract 위반 클래스
>
> 즉 §6.2-A는 평상시 dead code에 가깝고 S7-A가 주력. 그러나 이중 방어선이 운영 안정성에 필수 — S7가 한번 빠지거나 새 결함이 나오는 순간 caller가 silent fail로 회귀.

`services/{analysis-agent,build-agent}/app/agent_runtime/llm/caller.py` `_parse_response()` (line 639~):

```python
# After existing tool_calls parsing
finish_reason = choice.get("finish_reason", "stop")
content = message.get("content")
reasoning = message.get("reasoning")  # ← currently ignored, MUST capture

# Contract violation detection
if finish_reason == "tool_calls" and not tool_calls:
    raise LlmContractViolationError(  # new error class, retryable
        "finish_reason=tool_calls with empty tool_calls array",
        finish_reason=finish_reason,
        reasoning_excerpt=(reasoning or "")[:500],
        content_excerpt=(content or "")[:500],
    )
if (finish_reason in {"stop", "tool_calls"}
        and not tool_calls
        and not (content or "").strip()
        and (reasoning or "").strip()):
    raise LlmContractViolationError(
        "model output absorbed into reasoning field, no actionable content/tool_calls",
        ...
    )

return LlmResponse(
    content=content,
    tool_calls=tool_calls,
    finish_reason=finish_reason,
    reasoning=reasoning,  # ← must add to LlmResponse schema
    prompt_tokens=...,
    completion_tokens=...,
)
```

`LlmContractViolationError`는 `S3Error` 계열의 retryable error로 `agent_runtime/errors.py`에 추가. **`RetryPolicy.should_retry()` 갱신 필수** — 현재 `LlmTimeoutError`/`LlmUnavailableError`/`LlmPoolExhaustedError`/retryable `LlmHttpError`만 인식하므로 새 에러 클래스 추가 필요. `services/{analysis-agent,build-agent}/app/agent_runtime/policy/retry.py`의 `should_retry()`에 다음 분기 추가:

```python
if isinstance(error, LlmContractViolationError):
    return True
```

#### S3-A-2: HTTP 503/502 retryable 매핑 정합 (필수, Critical)

`services/{analysis-agent,build-agent}/app/agent_runtime/llm/caller.py:231`의 `retryable = resp.status_code in (429, 503)` 그대로면 §6.1-A가 502를 보내든 503을 보내든 caller가 retry 분기를 못 탄다. 두 가지 일관성 옵션:

- **옵션 A (권장)**: §6.1-A에서 503을 사용 (이미 §6.1-A에 명시함). 이 경우 caller 변경 불필요.
- **옵션 B**: §6.1-A에서 502 사용 + caller에 `retryable = resp.status_code in (429, 502, 503)` 확장. 502 "Bad Gateway"는 upstream parser 실패 의미상 어울림. 다만 현재 502 사용처(`Malformed LLM response structure`, `Invalid JSON`, `Async result response missing wrapped response` 등) 다수가 non-retryable 분류로 가정되므로 caller 코드 검토 필요.

본 doc은 **옵션 A 채택**. S7-A와 caller가 503으로 통일되어 추가 caller 변경 0. 만약 운영팀이 옵션 B를 선호하면 §6.1-A와 본 절을 같이 수정.

#### S3-A-3: tool_choice 미지원 값 송신 차단 (필수)

caller 측에서도 `tool_choice` 값 가드. `LlmCaller.call()`의 `tool_choice` 파라미터(현 default `"auto"`)에 미지원 값 들어오면 즉시 `ValueError` raise. §6.1-B 가이드 표의 ✅ 목록 외 값(특히 `"required"`, named function dict)을 차단. 게이트(§6.2-D) 정적 검사 외 런타임에서도 한 번 더 차단:

```python
_ALLOWED_TOOL_CHOICE_VALUES = {"auto", "none"}

async def call(self, messages, ..., *, tool_choice="auto", ...):
    if tool_choice not in _ALLOWED_TOOL_CHOICE_VALUES:
        raise ValueError(
            f"tool_choice={tool_choice!r} is not currently supported by the "
            f"S7 vLLM stack. See "
            f"wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md §6.1-B"
        )
    ...
```

#### S3-B: `LlmResponse.reasoning` 필드 + 로그 캡처 (필수)

`services/*/app/agent_runtime/schemas/agent.py` `LlmResponse`에 `reasoning: str | None = None` 추가. `caller.py`의 agent_log "LLM 응답" entry (line 268~)에 `reasoning_chars=len(result.reasoning or "")` 박음. 디버깅 시 thinking 손실 0건.

#### S3-C: `_tool_choice_for_turn` 정책 재정의 (필수, P10 영구 비활성화)

§5에서 임시 롤백된 `_tool_choice_for_turn`을 영구 형태로 정리:

```python
def _tool_choice_for_turn(*, ...) -> str:
    # tool_choice="required" disabled until vLLM contract bug resolved.
    # See wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md §6.1.
    # Re-enable only after S7 confirms vLLM stack supports required + reasoning + qwen3_coder.
    if not current_tools or force_report:
        return "auto"
    return "auto"
```

또는 더 간단히: `_tool_choice_for_turn` 함수 자체를 제거하고 호출 자리에 `tool_choice="auto"` 고정.

P10의 원래 의도("evidence 없이 보고서 쓰는 LLM 행동 차단")는 system prompt + force_report 휴리스틱(`_FORCE_REPORT_AFTER_TOOLS=6` 등)으로 이미 baseline 가드가 있으므로 운영상 동등 안전성 보장된다.

#### S3-D: regression-gate 검증 의미 반전 (필수)

`services/analysis-agent/tests/test_s3_llm_readiness_gate.py:83`:
```python
assert 'return "required"' in loop and "tool_choice=_tool_choice_for_turn" in loop
```
이 assertion은 P10 활성을 강제 → §6.2-C 정책에 충돌. 두 가지 옵션:

1. **반전**: `assert 'return "required"' not in loop` (P10 영구 비활성 강제)
2. **삭제**: 해당 assertion만 빼고 P10 정책 결정은 별도 doc에서 관리

권장 1. 외부 코드리뷰가 P10을 다시 박지 못하도록 정적 보장.

#### S3-E: contract violation E2E spot test 추가 (필수)

`tests/`에 spot test 추가: build-agent와 analysis-agent 첫 턴이 mock LLM 응답 (`finish_reason="tool_calls"` + `tool_calls=[]` + `reasoning="..."`) 받았을 때 명시적 `LlmContractViolationError` 발생하고 retry 분기로 흐르는지 검증. 이걸 정적 게이트와 함께 묶어 회귀 차단.

### 6.3 게이트 lane 처방 (회귀 재발 차단)

#### G-A: E2E spot test를 readiness-gate에 묶기 (필수)

unit/AST-only gate는 이번 회귀를 못 잡았다 (정적 검사가 vLLM 동작은 못 본다). 다음 중 하나로 보강:

1. **CI에 mini E2E 통합**: certificate-maker 같은 작은 프로젝트로 build-agent 첫 턴만 도는 spot test (≤30s). 응답에 tool_calls 1개 이상 + finish_reason과 일관 검증. 실패 시 PR block.
2. **운영 E2E를 daily/PR 트리거**: 현 `.stability-runs/` 패턴을 PR 게이트에 endpoint로 도입.

권장 1. 비용/시간 합리적, GPU 1개로 충분.

#### G-B: vLLM stack 버전 pin + 변경 영향 매트릭스 (필수)

`wiki/canon/specs/llm-engine.md` 또는 별도 doc에 다음 표 박음:

| vLLM 옵션 | 값 | 영향 받는 caller path |
|---|---|---|
| 모델 family | Qwen3.6-27B (text-only) | 모든 path |
| `--reasoning-parser` | qwen3 | tool calling + reasoning 양쪽 |
| `--tool-call-parser` | qwen3_coder | tool calling만 |
| `--enable-auto-tool-choice` | enabled | `tool_choice="auto"`만 |
| `--speculative-config` | mtp=1 | tool calling 안정성에 영향 |
| `tool_choice` (caller) | `auto` | ✅ |
| `tool_choice` (caller) | `required` | ❌ until §6.1-C |
| `tool_choice` (caller) | named | ❌ unverified |

위 stack의 어느 한 칸이 바뀔 때마다 §6.1-A의 contract validator + spot test 통과 후 spec 업데이트.

#### G-C: 코드리뷰 정책 추가 (필수)

`tool_choice` 값을 변경하는 모든 PR은:
1. `wiki/canon/specs/llm-engine.md` §G-B 표의 "✅" 칸 안에 머무는지 사전 검증.
2. 위 표 외 값으로 확장하는 PR은 자동 hold + S7 owner approval 강제.
3. E2E spot test 결과 PR 본문에 첨부.

`CLAUDE.md` 또는 `.claude/agents/code-reviewer.md`에 룰 박음.

---

## 7. acceptance criteria

본 WR 처리 종료 조건. 모든 항목 ✅ 되어야 "재발 방지 완료".

### S7
- [ ] §6.1-A `_validate_llm_response_contract` `/v1/chat` + `/v1/async-chat-requests` 두 path에 모두 적용 (각 path별 정확한 삽입 위치는 §6.1-A 본문 참조)
- [ ] §6.1-A 위반 시 **503 LLM_PARSE_RETRY** (502 아님 — caller retry 정합성)로 변환 + Prometheus counter 증분
- [ ] §6.1-A-2 요청 측 `tool_choice` 검증 — `auto`/`none` 외 값은 422 INVALID_TOOL_CHOICE로 즉시 반환
- [ ] §6.1-B `wiki/canon/specs/llm-engine.md` + `wiki/canon/api/llm-gateway-api.md`에 caller-side `tool_choice` 가이드 표 박음 (✅: auto/none, ❌: required/named)
- [ ] §6.1-D 메트릭 2종 (`aegis_llm_response_contract_violation_total{reason}`, `aegis_llm_finish_reason_total{finish_reason,tool_calls_empty="true"|"false"}`) 노출 — label cardinality는 §8 표 enum + 2-value bool로 bounded

### S3
- [ ] §6.2-A `LlmContractViolationError` 추가 + caller에서 raise + agent_loop가 retry로 처리 (defense-in-depth, §6.2-A 헤더 박스 참조)
- [ ] §6.2-A `RetryPolicy.should_retry()`에 `LlmContractViolationError` 분기 추가
- [ ] §6.2-A-2 옵션 A 채택 — caller 코드 변경 없이 503 retryable 매핑 그대로 사용. (옵션 B 선택 시 502 추가 매핑 + 영향 범위 분석)
- [ ] §6.2-A-3 caller `tool_choice` 미지원 값 런타임 ValueError raise
- [ ] §6.2-B `LlmResponse.reasoning` 필드 추가 + `_parse_response`에서 캡처 + agent_log "LLM 응답" entry에 `reasoning_chars` 박음
- [ ] §6.2-C `_tool_choice_for_turn` 영구 `"auto"` 반환 (인라인 고정 시 `_call_with_retry` 시그니처 default도 검토)
- [ ] §6.2-D regression-gate assertion 반전 (`'return "required"' not in loop` + 사유 코멘트)
- [ ] §6.2-E mock LLM 응답 contract violation spot test 추가 — 두 시나리오(`tool_calls=[]` + finish_reason=tool_calls / reasoning이 본문 흡수) 모두 `LlmContractViolationError` raise → retry 분기 진입 검증
- [ ] certificate-maker E2E Stage 2 통과
- [ ] analysis-agent deep-analyze E2E 첫 턴 tool_calls 정상 추출

### 게이트 lane
- [ ] §6.3-A E2E spot test가 PR/CI 게이트에 묶임
- [ ] §6.3-B vLLM stack 변경 영향 매트릭스 wiki 박음
- [ ] §6.3-C 코드리뷰 룰 박음

---

## 8. 검증 프로토콜 — 정상/비정상 응답 신호

S7 contract validator + S3 contract violation detector 양측이 다음 신호를 일관 해석해야 한다.

| 응답 형태 | finish_reason | tool_calls | content | reasoning | 진단 | 처분 |
|---|---|---|---|---|---|---|
| 정상 tool 호출 | `tool_calls` | non-empty | null/empty | optional | OK | success |
| 정상 보고서 | `stop` | empty | non-empty | optional | OK | success |
| 보고서 길이 초과 | `length` | empty | non-empty (잘림) | optional | OK | success-but-truncated (caller가 max_tokens 늘려 재시도 가능) |
| 도구 호출 길이 초과 | `length` | non-empty (마지막 호출 args 잘릴 수 있음) | optional | optional | 부분 OK — 마지막 tool_call의 arguments JSON parse 실패 가능 | success-partial. caller `_parse_response`의 `json.JSONDecodeError` 분기 (line 665~)가 이미 partial drop 처리. 추가 액션 불필요 |
| **contract violation 1** | `tool_calls` | **empty** | empty | any | tool 추출 실패 (vLLM #19051/#22132/#38106 클래스) | **503 LLM_PARSE_RETRY retryable** |
| **contract violation 2** | `stop` 또는 `tool_calls` | empty | empty | non-empty | reasoning이 본문 흡수 (vLLM #35221 클래스) | **503 LLM_PARSE_RETRY retryable** |
| 정상 모델 거부 | `stop` | empty | empty | empty | 모델이 빈 응답 의도 | output_deficient (현 로직 유지) |

contract violation은 retryable로 분류 — 한 번 실패해도 retry로 회복 가능 (sampling stochasticity 때문에 두 번째 시도는 envelope 형식으로 떨어질 수 있음).

---

## 9. 책임 분배 + 일정 권장

| Lane | 항목 | 1차 deadline | 책임 |
|---|---|---|---|
| S7 | §5 즉시 롤백 push (build/analysis-agent) | **즉시** | (S3 lane이 코드 박지만 S7가 호환성 spec 박을 때까지 production 차단 책임) |
| S3 | §5 build-agent + analysis-agent `_tool_choice_for_turn` "auto" 강제 | **즉시** | S3 |
| S3 | §6.2-D regression-gate assertion 반전 | **즉시** | S3 |
| S7 | §6.1-A contract validator | **24h 이내** | S7 |
| S3 | §6.2-A `LlmContractViolationError` + retry 분기 | **48h 이내** | S3 |
| S7 | §6.1-B caller 가이드 spec 갱신 | **48h 이내** | S7 |
| S3 | §6.2-B `LlmResponse.reasoning` 캡처 | **72h 이내** | S3 |
| 게이트 | §6.3-A E2E PR/CI 통합 | **1주 이내** | 게이트 책임자 (사용자 결정) |
| 게이트 | §6.3-B vLLM stack 매트릭스 + §6.3-C 룰 박기 | **1주 이내** | 게이트 책임자 |
| S7 | §6.1-C `tool_choice="required"` 호환성 회복 검증 | **시일 여유 있을 때** | S7 (선택) |

---

## 10. cross-reference

| 문서 | 내용 |
|---|---|
| 본 WR 발견의 trigger | `wiki/context/decisions/temperature-policy-analysis-20260428.md` §6.2 / §7 (P10 권고) |
| P10 진행 상태 (S3) | `wiki/context/decisions/temperature-policy-analysis-20260428-s3-followup-20260503.md` §1.1 |
| 실패 dump | `services/logs/llm-dumps/req-e2e-build-s3-cert-maker-spot-20260503-015411_turn-01_1777740871021.json` |
| 성공 dump (대조군) | `services/logs/llm-dumps/req-e2e-build-hot3-qg-stability-20260428-204030-01_turn-01_1777376538688.json` |
| E2E 실행 결과 | `/home/kosh/aegis-for-paper/.stability-runs/s3-cert-maker-spot-20260503-015411/` |
| S3 caller (수정 대상) | `services/{analysis-agent,build-agent}/app/agent_runtime/llm/caller.py` |
| S3 agent_loop (수정 대상) | `services/{analysis-agent,build-agent}/app/core/agent_loop.py` |
| S3 readiness gate (수정 대상) | `services/analysis-agent/tests/test_s3_llm_readiness_gate.py` |
| S7 chat proxy (수정 대상) | `services/llm-gateway/app/routers/tasks.py` `chat_proxy` (line 821~) |
| S7 spec (갱신 대상) | `wiki/canon/specs/llm-engine.md`, `wiki/canon/api/llm-gateway-api.md` |
| 외부 vLLM 이슈 | #19051, #19513, #22132, #22975, #29192, #35221, #35800, #38106 (모두 vllm-project/vllm) |

---

## 11. 메모 (회고)

이번 회귀에서 학습된 것:

1. **AST-only static gate는 vLLM 동작 회귀를 못 잡는다.** 운영-runtime 결함은 운영-runtime 검증으로만 잡힌다. unit test 70/70 PASS + AST gate PASS 둘 다 통과하고도 production 100% 실패.
2. **vLLM × thinking-mode × tool-calling × speculative-decoding의 4-way 호환성은 매우 깨지기 쉽다.** 어느 한 옵션을 켜고 끌 때마다 spot test 의무.
3. **caller 측 응답 schema에 reasoning 필드를 처음부터 reserve해야 한다.** thinking-mode 모델을 쓰면서 reasoning 캡처 안 하는 건 디버깅 손실.
4. **OpenAI API contract 위반은 gateway가 마지막 방어선**. 업스트림 fix 기다리는 동안 gateway가 contract 검증 안 하면 caller가 silent fail로 미스 재현.
5. **temperature 보고서 §7 마이그레이션 §1 (S7)은 spec 측면 마무리됐지만 §6.2 (P10) 같은 운영 정책 변경은 §1보다 위험도 높았다.** 우선순위 재고 — 다음번 cross-lane 변경에서는 운영 정책 변경 항목에 더 무거운 검증 게이트 적용.

## 12. Open questions — vLLM 소스 추적 진행 시 결착

§4의 메커니즘 가설은 vLLM 소스 추적 없이 외부 issue 8건과 내부 dump 비교로 추론한 것. 다음 항목들은 향후 추적 시 결론 박을 만함:

1. **MTP-only 인과 가능성**: vLLM #38106이 시사하듯 `tool_choice="required"` + speculative decoding(MTP)은 reasoning-parser와 무관하게 결함을 일으킬 수 있음. 이 경우 §6.1-C의 옵션 #3 (reasoning-parser 비활성)은 `required` 회복에 충분하지 않을 수 있음. 결론 박힐 때까지 옵션 #2 (MTP 비활성)와 #3을 OR가 아닌 AND로 시험해야 안전.
2. **vLLM 0.20.0의 `tool_choice="required"` 백엔드 분기**: 외부 검색 결과상 "guided decoding for required is V0-engine-only with outlines backend"라는 언급. AEGIS가 V0 vs V1 어느 엔진에 떨어졌는지 + 둘 사이 차이가 결함 강화/완화에 영향 주는지 미확인.
3. **named tool_choice (`{"type":"function","function":{"name":"..."}}`) 호환성**: §6.1-B에서 잠정 ❌로 분류했지만 별도 path(named function calling)일 가능성. 실제 spot test 결과 알기 전까지 ❌ 유지가 안전.
4. **§6.1-A validator의 false-positive 위험**: `finish_reason="tool_calls"` + `tool_calls=[]` 조합이 vLLM 사양상 정당한 케이스가 있는가? OpenAI 사양에서는 contract 위반이지만 일부 vLLM 버전이 다른 의미로 박는다면 false-positive 발생. 검증 방법: §6.1-A 배포 후 `aegis_llm_response_contract_violation_total{reason="finish_reason_tool_calls_with_empty_array"}` 메트릭 1주일 관찰 → false-positive 0 확인.
5. **retry policy의 deterministic 결함 처리**: 만약 contract 위반이 deterministic하면 retry는 무의미 (§6.1-C 미해결 시). 본 doc 처방은 §6.2-C(`tool_choice="auto"` 강제)로 deterministic 결함 진입 자체를 막으므로 retry는 transient 결함(MTP draft race 등)에만 fire. retry max=2 + auto path 정합성 가정 하에 무한 루프 위험 0.
