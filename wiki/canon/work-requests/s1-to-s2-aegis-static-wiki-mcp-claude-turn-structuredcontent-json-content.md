---
title: "aegis-static-wiki MCP 응답 후 Claude turn 조기 종료 — structuredContent + 짧은 JSON content 동반 시 재현"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-aegis-static-wiki-mcp-claude-turn-structuredcontent-json-content"
last_verified: "2026-05-11"
service_tags: ["s1", "s2", "platform", "mcp", "tooling"]
decision_tags: ["mcp-response-shape", "claude-code-mcp-bug-workaround", "wiki-tooling"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/bootstrap.md", "wiki/canon/handoff/s2/readme.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-aegis-static-wiki-mcp-claude-turn-structuredcontent-json-content"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-11T00:46:58.304Z","note":"S2 patched /home/kosh/aegis-static-wiki/tools/wiki/mcpServer.js textAndStructured() to prose-wrap bare []/{} and other very short non-empty text while preserving structuredContent. Added MCP fixture coverage in tests/wiki-mcp.test.js. Verified npm test (8 passed) and python3 tools/validate_wiki.py (PASS). Reply registered at wiki/canon/work-requests/s2-to-s1-reply-aegis-static-wiki-mcp-short-structured-responses-now-include-prose-text-fo.md."}]
registered_at: "2026-05-11T00:44:27.687Z"
completed_at: "2026-05-11T00:46:58.304Z"
---

# aegis-static-wiki MCP 응답 후 Claude turn 조기 종료 — structuredContent + 짧은 JSON content 동반 시 재현

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## 1. 증상

`/home/kosh/aegis-static-wiki/tools/wiki/mcpServer.js` 의 일부 tool 호출 시, **Claude Code (claude.ai CLI) 에이전트만** tool_result 를 수신한 직후 후속 텍스트 생성 없이 turn 을 종료하는 회귀 발생. Codex CLI 에이전트에서는 동일 호출이 정상 follow-up.

### 1.1 실증 (2026-05-11 S1 세션)

- 호출: `mcp__aegis-static-wiki__list_my_open_wrs lane=s1 include_to_all=true`
- 응답: `{"content":[{"type":"text","text":"[]"}], "structuredContent":{"wrs":[]}}`
- Claude 동작: tool_result 수신 직후 assistant turn 텍스트 0 byte 종료. 사용자 다음 prompt 까지 무반응.
- Codex 동작: 동일 응답에 대해 다음 행동 자연스럽게 진행.

### 1.2 재현 빈도

- `list_my_open_wrs` 빈 큐 응답 (`[]`) — 본 세션 1/1 재현
- 짧은 structured 응답 (`{}` / `[]` / `{"found":true,...}` 짧은 row 등) tool 군 — 추정 다발
- `read_page` / `search_pages` 등 큰 text 반환 tool — 본 세션 미재현 (text payload 가 길어 모델이 turn 계속 판단)

## 2. 가설

`mcpServer.js:36` 의 `textAndStructured` helper:

```js
function textAndStructured(structured, text) {
  return { content: [{ type: 'text', text }], structuredContent };
}
```

응답에 `structuredContent` 동반 + `content[0].text` 가 매우 짧은 JSON literal (`"[]"` / `"{}"`) 일 때 Claude Code MCP client 가 tool_result 를 turn-final marker 로 오인하는 것으로 의심. Codex MCP client 는 `content[0].text` 만 보고 normal turn 처리.

별도 검증 필요:
- Claude Code MCP integration 의 `structuredContent` 처리 경로
- 짧은 text 길이 임계점 (몇 byte 이하에서 stop)
- 다른 짧은-응답 tool (`complete_wr` success 응답 등) 동일 증상 여부

## 3. 완화책 후보

### 3.1 Server-side (권장, mcpServer.js 직접 패치)

옵션 A — `textAndStructured` 가 빈/짧은 결과 시 prose wrap:

```js
function textAndStructured(structured, text) {
  const trimmed = text.trim();
  const wrapped = (trimmed === '[]' || trimmed === '{}' || trimmed.length < 8)
    ? `결과 (raw JSON):\n${text}`
    : text;
  return { content: [{ type: 'text', text: wrapped }], structuredContent: structured };
}
```

옵션 B — `list_my_open_wrs` 등 빈 결과 가능 tool 마다 명시 메시지:

```js
const msg = wrs.length === 0
  ? `lane=${lane} 열린 WR 0건. include_to_all=${include_to_all}.`
  : JSON.stringify(wrs, null, 2);
return { content: [{ type: 'text', text: msg }], structuredContent: { wrs } };
```

옵션 C — `structuredContent` 자체 드롭 (가장 단순, 다만 structured 소비자 영향 검토 필요):

```js
return { content: [{ type: 'text', text }] };
```

### 3.2 Lane-side (workaround, server 수정 전 임시)

- WR runtime tool 호출 직후 lane agent 가 항상 1줄 텍스트 self-prompt — 결과 echo + 다음 행동 선언 의무. S1 bootstrap 체크리스트에 추가 가능.

## 4. Acceptance criteria

S2 가 본 WR 처리 시 아래 중 택 1 + 회신:

- [ ] `mcpServer.js` 패치 (옵션 A/B/C 중 하나) + 변경 사유 reply
- [ ] Claude Code MCP client 의 turn 종료 로직 외부 issue tracker 보고 + WR 보류 reply
- [ ] reproduce 실패 / 다른 원인 진단 reply (S1 가 추가 evidence 수집)

처리 lane 결정도 S2 판단 위임 — wiki tooling 이 platform 이라면 S2 가 직접, 아니면 적절한 lane 으로 reroute.

## 5. 영향

- S1 lane 부팅 시 `list_my_open_wrs` 빈 응답 후 무반응 → 사용자 재촉 필요 → 협업 마찰
- Codex 만 정상이라 lane-by-lane agent 선택 편향 발생
- WR 운영 전반의 Claude UX 저하 (complete_wr / register_wr success 응답 등 짧은 응답 tool 다수)

## 6. 참고

- 본 WR 은 S1 세션 (2026-05-11) 도중 사용자 지시로 S1 → S2 발행
- mcpServer.js 경로: `/home/kosh/aegis-static-wiki/tools/wiki/mcpServer.js`
- helper 위치: 같은 파일 line 36 (`textAndStructured`) + line 422 (`list_my_open_wrs` handler)

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
