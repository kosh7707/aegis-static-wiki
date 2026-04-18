---
title: "S1-QA 실행 가이드"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "wiki/canon/specs/frontend.md"
  - "wiki/canon/handoff/s1/usecase-visibility-matrix.md"
  - ".omx/plans/ralplan-s1-shadcn-replatform.md"
  - "services/frontend/playwright.config.ts"
last_verified: "2026-04-18"
service_tags: ["s1", "s1-qa"]
decision_tags: ["shadcn-replatform", "frontend-skill-review-gate", "playwright-qa", "frontend-visibility-contract"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/usecase-visibility-matrix.md"]
---

# S1-QA 실행 가이드

> 역할: S1 프론트엔드를 사용자 관점에서 검증하는 QA lane
> 최신 상태 반영일: **2026-04-18**

## 1. 기본 원칙

- QA는 `services/frontend/src/**` 구현 코드를 읽지 않는다.
- S1은 웹 전용 SPA다.
- 현재 UI 기준은 legacy vendor-style doctrine이 아니라 **shadcn/Aceternity sourcing + `$frontend-skill` reviewer gate**다.
- 화면 pass/fail 판정은 `wiki/canon/handoff/s1/usecase-visibility-matrix.md`를 우선 참조한다.

## 2. QA 판정 기준

검증자는 제품 화면을 다음 기준으로 본다.

- AEGIS는 자동차 임베디드 보안 운영 콘솔로 읽혀야 한다.
- Routine app UI는 shadcn-style primitive density와 restraint를 가져야 한다.
- Aceternity-style motion/background는 장식이면 실패다.
- Generic SaaS card mosaic / glow / gradient / floating gimmick은 실패다.
- Empty/loading/error state는 다음 action과 운영 문맥을 보여야 한다.
- Dense surfaces는 카드 더미가 아니라 작업면이어야 한다.

## 3. 페이지별 필수 확인

16개 페이지 각각:

1. normal state
2. empty/loading/error state where feasible
3. primary interaction
4. console error 없음
5. visual reviewer verdict와 충돌 없음
6. must-show 항목이 visibility matrix와 일치함

## 4. 명령

```bash
cd services/frontend
npm test
npm run typecheck
npm run build
npm run test:e2e
```

## 5. 현재 known note

- Build는 chunk-size warning을 낼 수 있다. 이는 fail이 아니지만 신규 dependency가 과도하게 bundle을 키운 경우 reviewer/test evidence에 기록한다.
- Reviewer hard veto는 QA 의견보다 우선하는 visual gate다. QA는 증거를 남기고 S1에 WR/보고한다.
