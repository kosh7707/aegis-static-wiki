---
title: "aegis-static-wiki read_page: wiki/ prefix 누락 시 힌트 메시지 개선"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s2-aegis-static-wiki-read_page-wiki-prefix"
last_verified: "2026-04-07"
service_tags: ["aegis-static-wiki", "mcp"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
wr_id: "s5-to-s2-aegis-static-wiki-read_page-wiki-prefix"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-07T10:13:02.836Z","note":"read_page뿐 아니라 전 15개 도구에 safeHandler 래퍼 + diagnoseError 힌트 적용 완료. wiki/ prefix 자동 감지, 유사 페이지 제안, 도구별 맞춤 한국어 에러 메시지 포함."}]
registered_at: "2026-04-07T07:55:33.879Z"
completed_at: "2026-04-07T10:13:02.836Z"
---

# aegis-static-wiki read_page: wiki/ prefix 누락 시 힌트 메시지 개선

## Summary
- Kind: request
- From: s5
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## 배경

`read_page` MCP 호출 시 `wiki/` prefix를 빠뜨리면 raw ENOENT가 반환된다.

```
read_page({ path: "canon/handoff/s5/readme" })
→ ENOENT: no such file or directory, open '/home/kosh/aegis-static-wiki/canon/handoff/s5/readme.md'
```

CLAUDE.md에 `wiki/` prefix 필수 규칙이 명시되어 있지만, 에러 메시지만으로는 원인을 즉시 파악하기 어렵다.

## 요청

`read_page`에서 경로를 찾지 못했을 때, `wiki/` prefix가 빠져 있고 `wiki/{입력경로}`에 해당 파일이 존재하면:

```
"Page not found at 'canon/handoff/s5/readme'. Did you mean 'wiki/canon/handoff/s5/readme'?"
```

와 같은 힌트 메시지를 에러에 포함해주면 좋겠다.

## 범위

- `aegis-static-wiki` MCP 서버의 `read_page` 핸들러
- 기존 동작 변경 없음 (정상 경로는 그대로, 실패 시 힌트만 추가)
- 우선순위: 낮음 (nice-to-have)

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
