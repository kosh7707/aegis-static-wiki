---
title: "S1 Frontend 현재 구현 스펙"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/components.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/tsconfig.json"
  - "services/frontend/src/index.css"
  - "services/frontend/src/components/ui"
  - "services/frontend/docs/design/SHADCN-REPLATFORM.md"
  - ".omx/plans/ralplan-s1-shadcn-replatform.md"
  - ".omx/specs/deep-interview-s1-shadcn-replatform.md"
last_verified: "2026-04-18"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "web-only-frontend", "shadcn-replatform", "aceternity-reference", "frontend-skill-review-gate", "single-css-entrypoint", "design-doc-hierarchy"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 현재 구현 스펙

> `services/frontend/`의 현재 실제 구현 기준 S1 프론트 스펙이다.
> 마지막 검증/갱신: **2026-04-18**

## 1. 서비스 정의

S1 프론트엔드는 **순수 웹 SPA (React + TypeScript + Vite)** 기반의 자동차 임베디드 보안 분석 운영 콘솔이다. Electron/preload/window bridge는 사용하지 않는다.

## 2. 현재 UI 구현 기준

현재 활성 디자인 계약은 다음이다.

1. **shadcn/ui + Tailwind + Radix-style primitives를 실제 코드에 사용한다.**
2. **Aceternity UI는 필수 탐색/레퍼런스 소스**다. 다만 AEGIS 운영 콘솔에 맞지 않는 motion/background/ornament는 reviewer가 veto한다.
3. **검수자는 `$frontend-skill`을 반드시 사용**하며, 코딩/자료탐색 없이 hard veto만 수행한다.
4. **스타일 엔트리포인트는 `src/index.css` 하나**이며, page/component 전용 CSS는 현재 실제 구현에서 제거되었다.

## 3. 현재 스택

| 영역 | 값 |
|---|---|
| Runtime | React 19 / React DOM 19 |
| Router | React Router 7 |
| Build | Vite 7 |
| UI primitives | shadcn/ui generated components under `src/components/ui` |
| Styling | Tailwind CSS v4 + shadcn theme variables + single stylesheet entrypoint (`src/index.css`) |
| Component references | shadcn/ui, Aceternity UI |
| Tests | Vitest, Playwright |

## 4. 핵심 파일

- `services/frontend/components.json` — shadcn registry/config
- `services/frontend/src/index.css` — **유일한 CSS 엔트리포인트** (theme/base/markdown/animation 포함)
- `services/frontend/src/components/ui/*` — shadcn-owned generated primitives
- `services/frontend/src/lib/utils.ts` — `cn` utility
- `services/frontend/docs/design/SHADCN-REPLATFORM.md` — 로컬 design contract mirror
- `.omx/plans/ralplan-s1-shadcn-replatform.md` — replatform 계획
- `.omx/plans/s1-shadcn-component-sourcing-matrix-template.md` — component sourcing ledger
- `.omx/plans/s1-shadcn-reviewer-gate-template.md` — `$frontend-skill` reviewer gate

## 5. 라우트/페이지 범위

S1은 다음 16개 page surfaces를 가진다.

1. LoginPage
2. SignupPage
3. DashboardPage
4. SettingsPage
5. OverviewPage
6. StaticAnalysisPage
7. FilesPage
8. FileDetailPage
9. VulnerabilitiesPage
10. AnalysisHistoryPage
11. ReportPage
12. QualityGatePage
13. ApprovalsPage
14. DynamicAnalysisPage
15. DynamicTestPage
16. ProjectSettingsPage

## 6. 활성 디자인 계약

- AEGIS는 animated SaaS brochure가 아니라 **자동차 임베디드 보안 운영 콘솔**이다.
- Routine app UI는 shadcn primitives를 우선 사용한다.
- Aceternity는 반드시 탐색하지만, 채택은 opt-in이다.
- Motion은 hierarchy/affordance를 개선할 때만 허용한다.
- Utility copy가 기본이다. 마케팅 문구/과한 hero는 제품 화면에서 금지한다.
- Generic dashboard card mosaic, glow/gradient 남용, 무의미한 floating UI는 reviewer veto 대상이다.

## 7. 검증 기준

최소 검증:

```bash
cd services/frontend && npm test
cd services/frontend && npm run typecheck
cd services/frontend && npm run build
```

대수술 slice마다 추가로:
- 해당 page/layout targeted tests
- normal + empty/loading/error state 확인
- 주요 상호작용 확인
- `$frontend-skill` reviewer verdict

## 8. 현재 구현 상태 요약

- standalone page/component/global helper CSS는 제거되었고, 현재 남은 CSS 파일은 `src/index.css` 단일 엔트리다.
- 스타일 책임은 **component utility classes + `index.css` global theme/base**로 수렴했다.
- build chunk-size warning은 여전히 non-blocking debt다.

## 9. 폐기된 기준

`services/frontend/docs/design/AEGIS-DESIGN.md`에 있던 legacy vendor-specific doctrine은 더 이상 활성 기준이 아니다. 새 디자인 판단은 shadcn/Aceternity sourcing + `$frontend-skill` reviewer gate를 따른다.

## 10. 문서 우선순위와 정리 원칙

1. **정식 활성 기준은 wiki canon**이다: `wiki/canon/specs/frontend.md`, `wiki/canon/handoff/s1/readme.md`, `wiki/canon/handoff/s1/architecture.md`, `wiki/canon/feedback/s1_frontend_working_guide.md`.
2. `services/frontend/docs/design/SHADCN-REPLATFORM.md`는 repo-local 작업 편의를 위한 **mirror/compatibility 문서**다. 활성 계약이 바뀌면 wiki canon을 먼저 갱신하고 그 다음 이 파일을 맞춘다.
3. repo-local design surface에는 vendor-branded inspiration pack이 남아 있지 않다. archived reference material은 `docs/design/reference/**`에만 남아 있다.
4. `wiki/canon/handoff/**/session-*`, `wiki/canon/work-requests/**`는 역사/증거 문서지만, 이번 정리 범위에 포함된 vendor-style doctrine references는 은퇴 처리했다.
5. 새 문서 정리 작업은 “active guidance를 최신 코드 구조에 맞추는 것”을 목표로 하고, 역사 문서 삭제/미화는 목표로 삼지 않는다.
