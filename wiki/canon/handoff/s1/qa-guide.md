---
title: "S1-QA 실행 가이드"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "wiki/canon/specs/frontend.md"
  - "wiki/canon/handoff/s1/usecase-visibility-matrix.md"
  - "services/frontend/playwright.config.ts"
last_verified: "2026-04-18"
service_tags: ["s1", "s1-qa"]
decision_tags: ["playwright-qa", "frontend-visibility-contract"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/usecase-visibility-matrix.md"]
---

# S1-QA 실행 가이드

> 역할: S1 프론트엔드를 사용자 관점에서 검증하는 QA lane
> 최신 상태 반영일: **2026-04-18**

## 1. 기본 원칙

- QA는 `services/frontend/src/**` 구현 코드를 읽지 않는다.
- S1은 웹 전용 SPA다.
- repo 내부의 과거 디자인 지침은 QA 기준이 아니다.
- 화면 pass/fail 판정은 `wiki/canon/handoff/s1/usecase-visibility-matrix.md`를 우선 참조한다.

## 2. QA 판정 기준

검증자는 제품 화면을 다음 기준으로 본다.

- must-show 항목이 visibility matrix와 일치하는가
- normal / empty / loading / error state가 관측 가능한가
- primary interaction이 실제로 동작하는가
- 콘솔 오류가 없는가
- mock UI는 mock 상태로 명시되어 있는가
- chunk-size warning 같은 known note는 evidence에 기록되었는가

## 3. 페이지별 필수 확인

16개 페이지 각각:

1. normal state
2. empty/loading/error state where feasible
3. primary interaction
4. console error 없음
5. must-show 항목이 visibility matrix와 일치함

## 4. 명령

```bash
cd services/frontend
npm test
npm run typecheck
npm run build
npm run test:e2e
```

## 5. 현재 known note

- Build는 chunk-size warning을 낼 수 있다. 이는 fail이 아니지만 evidence에는 기록한다.
- mock section은 fail 사유가 아니라 “미구현 상태 명시 여부”로 본다.
