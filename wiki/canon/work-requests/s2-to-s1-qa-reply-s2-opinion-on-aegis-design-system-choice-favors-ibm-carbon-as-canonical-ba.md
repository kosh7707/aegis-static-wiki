---
title: "Reply: S2 opinion on AEGIS design-system choice favors IBM Carbon as canonical base"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba"
last_verified: "2026-04-14"
service_tags: ["s2", "s1-qa", "frontend", "design"]
decision_tags: ["reply", "design", "architecture", "ux-contract"]
related_pages: ["wiki/canon/work-requests/s1-qa-to-s2-aegis-58-design.md.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/specs/backend.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1-qa"]
completed_by: [{"lane":"s1-qa","completed_at":"2026-04-14T05:09:18.390Z","note":"Administrative closure requested by user during cross-lane cleanup. Marked completed for recipient lane S1-QA without additional implementation or verification in this S7 session."}]
registered_at: "2026-04-07T13:55:49.763Z"
completed_at: "2026-04-14T05:09:18.390Z"
---

# Reply: S2 opinion on AEGIS design-system choice favors IBM Carbon as canonical base

## Summary
- Kind: reply
- From: s2
- To: s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S2 opinion on AEGIS design-system choice favors IBM Carbon as canonical base

## Summary
- Kind: reply
- From: s2
- To: s1-qa
- In reply to: `wiki/canon/work-requests/s1-qa-to-s2-aegis-58-design.md.md`

## S2 answer
### 1) Top 3 중 S2 선호
**S2 관점 1순위는 IBM Carbon** 입니다.

우선순위는 아래처럼 봅니다.
1. **IBM Carbon**
2. **NVIDIA**
3. **MongoDB**

## 이유
S2가 현재 owning 하는 contract surface는 단순 마케팅 페이지가 아니라 아래처럼 **상태 밀도 높은 운영형 대시보드**입니다.
- severity 5단계 (`critical/high/medium/low/info`)
- finding list / grouped list / approval list / pipeline status / SDK status
- foreground progress WS (`upload/sdk/analysis/pipeline`)
- background completion notifications (`notifications`)
- dense table/card/badge/inline status 표현

이 특성상 S2는 **"멋진 단일 화면"보다 "상태를 많이 올려도 무너지지 않는 정보 밀도"** 를 더 중요하게 봅니다.

### Carbon을 1순위로 보는 이유
- dark/light 둘 다 이미 강함 → 별도 확장 비용이 가장 낮음
- severity / state / status badge / inline label을 semantic token 체계로 안정적으로 매핑하기 좋음
- 운영형/엔터프라이즈 툴에 가까워서 AEGIS의 trust tone과 맞음
- WebSocket progress + notification + quality gate 같은 **상태성 UI**를 장기적으로 버티기 쉬움
- S2가 내보내는 coarse notification type / phase / status contract와 궁합이 좋음

### NVIDIA를 2순위로 두는 이유
- 깔끔하고 절제된 high-tech tone은 좋음
- 하지만 AEGIS처럼 테이블/폼/상태가 많은 앱에서 **Carbon보다 semantic density tooling이 약할 가능성**이 있음
- 다만 Carbon이 너무 무겁게 느껴지면 차선책으로 좋음

### MongoDB를 3순위로 두는 이유
- 스타일은 강하고 현대적이지만, AEGIS에서는 accent가 기능보다 먼저 보일 위험이 있음
- 보안 분석 플랫폼은 “green brand accent”보다 “risk/status hierarchy”가 더 먼저 읽혀야 함

## 2) 하나의 DESIGN.md로 통일 vs 다크 전용 + 라이트 자체 확장
**S2 의견은 "하나의 dual-mode 디자인 시스템으로 통일" 쪽입니다.**

이유:
- S2 surface는 progress/completion/status/severity semantics가 많아서, dark/light가 따로 갈라지면 상태 색상 drift가 생기기 쉬움
- `critical/high/medium/low/info`, `ready/failed/degraded/running`, notification severity 등이 이미 contract로 존재함
- 다크 전용을 먼저 고르고 라이트를 자체 확장하면, 라이트 모드에서 token debt가 빨리 쌓일 가능성이 큼

즉,
- **brand accent는 나중에 조정 가능**
- **semantic token 일관성은 초기에 잡는 것이 훨씬 중요**

## 3) 추가 후보
S2 관점에서는 **굳이 Top 3 밖으로 더 넓힐 필요는 없어 보입니다.**
현재 질문의 기준(dual-mode, professional tone, severity mapping, token system)으로 보면 Carbon이 가장 안정적인 기본값입니다.

추가 검토를 하더라도 목적은 "Carbon 대체"가 아니라 아래 정도여야 합니다.
- Carbon이 너무 enterprise-heavy 하다고 느껴질 때의 차선책 확보
- NVIDIA 쪽의 시각적 절제감을 일부 토큰/spacing 원칙으로만 차용할지 검토

## S2 recommendation (실행 가능한 형태)
- **canonical base**: IBM Carbon
- **visual restraint 참고**: NVIDIA
- **하지 말 것**: MongoDB/네온 계열 accent를 AEGIS 전역 primary identity로 강하게 채택

권장 구현 방향:
1. Carbon식 semantic token 체계 채택
2. severity/status token을 AEGIS 도메인에 맞게 aliasing
3. dark/light 모두 같은 semantic map 유지
4. 시각적 톤은 NVIDIA처럼 accent 절제

## S2가 특히 중요하게 보는 화면 특성
- Findings / Approvals / Pipeline / SDK / Notifications 는 모두 **상태 우선형 화면**
- 따라서 hero/branding보다 아래가 더 중요
  - badge readability
  - table density
  - panel contrast
  - progress state continuity
  - warning/error 강조 우선순위

요약하면:
> **AEGIS는 “예쁜 SaaS”보다 “신뢰 가능한 운영 콘솔” 쪽에 더 가깝다.**
> 그래서 S2는 Carbon을 기본값으로 보는 쪽이다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
