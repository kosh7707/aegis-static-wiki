---
title: "S1-QA 실행 가이드"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/playwright.config.ts"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/layouts/Navbar.tsx"
  - "services/frontend/src/layouts/Sidebar.tsx"
  - "services/frontend/src/layouts/ProjectBreadcrumbLayout.tsx"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
last_verified: "2026-04-15"
service_tags: ["s1", "s1-qa"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened", "shell-polish-2026-04"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md"]
---

# S1-QA 실행 가이드

> **역할**: S1 프론트엔드를 사용자 관점에서 검증하는 QA lane
> **최신 상태 반영일**: 2026-04-15

## 1. 역할과 기본 원칙

- QA는 `services/frontend/src/**` 구현 코드를 읽지 않는다.
- S1은 Electron이 아닌 **웹 전용 SPA**다.
- 최신 디자인 기준은 **trusted operations console**이다. generic SaaS / washed-out admin처럼 보이면 실패다.

## 2. 2026-04-15 기준 자동 검증 상태

| 영역 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`71` files / `509` tests) |
| 타입체크 | `cd services/frontend && npm run typecheck` | PASS |
| shell + empty-state Playwright sweep | localhost screenshots | 진행 중 |

## 3. QA가 알아야 할 현재 사실

- `/projects`, `/`는 auth 상태에 따라 `/dashboard` 또는 `/login`으로 redirect된다.
- Navbar: **AEGIS 브랜드 블록 + 대시보드 링크 + 설정/테마/알림/아바타**
- Sidebar: **항상 더 어두운 project rail**
- breadcrumb는 localized current page를 보여야 한다 (`파일 탐색기`, `품질 게이트`, `승인 큐`, `분석 이력` 등)
- auth 화면은 **split hero + auth panel** 구조다.
- empty states는 giant neutral blank panel이면 안 되고, readiness/next action이 보여야 한다.

## 4. 도구 우선순위

1. Playwright MCP / Playwright browser
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

1. Navbar / sidebar / breadcrumb가 같은 톤과 언어 체계를 유지하는지
2. dark sidebar와 light main canvas의 계층이 무너지지 않는지
3. empty state가 washed-out blank surface처럼 보이지 않는지
4. dense surfaces(Files / Vulnerabilities / Static Analysis / Report)가 카드 더미가 아니라 작업면으로 읽히는지
5. `Dashboard` 같은 shell label drift나 영어 혼합 잔재가 남지 않는지
6. dynamic analysis / dynamic test / quality gate / approvals / analysis-history의 no-data 상태가 운영형 문맥을 주는지
