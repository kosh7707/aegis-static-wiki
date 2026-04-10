---
title: "S1-QA 실행 가이드"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/playwright.config.ts"
  - "services/frontend/src/App.tsx"
  - ".omx/plans/test-spec-flatten-frontend-src.md"
last_verified: "2026-04-10"
service_tags: ["s1", "s1-qa"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md"]
---

# S1-QA 실행 가이드

> **역할**: S1 프론트엔드를 사용자 관점에서 검증하는 QA lane
> **최신 상태 반영일**: 2026-04-10

## 1. 역할과 기본 원칙

- QA는 `services/frontend/src/**` 구현 코드를 읽지 않는다.
- 동적 분석/동적 테스트는 실화면 마운트 상태다.
- S1은 Electron이 아닌 **웹 전용 SPA**다.

## 2. 2026-04-10 기준 자동 검증 상태

| 영역 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`426` tests, `64` files) |
| 타입체크 | `cd services/frontend && npm run typecheck` | PASS |
| src flatten 확인 | `cd services/frontend && find src -maxdepth 1 -type d | sort` | root-level source directories only |
| Electron 제거 확인 | `cd /home/kosh/AEGIS && rg -n "from ['\"]electron['\"]|window\.api|contextBridge|BrowserWindow|preload\.js|preload\.ts|dev:main|build:main" services/frontend -g '!services/frontend/dist' -S` | no matches |

## 3. QA가 알아야 할 현재 사실

- `/projects`, `/`는 `/dashboard`로 redirect된다.
- Navbar: shield icon brand + Dashboard nav + bell + avatar.
- Sidebar: 260px, 라이트 배경, 모든 항목 노출.
- `StatusBar`는 기본 셸에 마운트되지 않는다.
- breadcrumb는 `프로젝트 > 프로젝트명 > 현재 페이지` 구조다.
- 런타임 엔트리는 `/src/main.tsx`다.

## 4. 도구 우선순위

1. Playwright MCP / Playwright skill
2. Playwright CLI
3. log-analyzer MCP

### CLI 핵심 명령

```bash
cd services/frontend
npm run build
npm test
npm run typecheck
npm run test:e2e
```

## 5. 지금 QA가 특히 봐야 할 것

1. `/dashboard` redirect 정상 여부
2. `/dashboard`가 `DashboardPage`를 안정적으로 렌더링하는지
3. Navbar/Sidebar/current breadcrumb 구조가 의도대로 보이는지
4. `StatusBar`가 기본 셸에 없음을 기준으로 baseline을 재해석할 것
5. Electron preload/window bridge 전제가 남아 있지 않은지
6. 옛 중첩 경로 전제를 가진 오래된 테스트/문서 기대치가 남아 있지 않은지
