---
title: "AEGIS 프론트엔드 디자인 시스템 전면 교체 — IBM Carbon 기반 + NVIDIA 절제 참고"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-aegis-ibm-carbon-nvidia"
last_verified: "2026-04-08"
service_tags: ["frontend"]
decision_tags: ["design", "architecture", "css"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-qa-reply-s2-opinion-on-aegis-design-system-choice-favors-ibm-carbon-as-canonical-ba.md", "wiki/canon/work-requests/s1-qa-to-s2-aegis-58-design.md.md"]
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-aegis-ibm-carbon-nvidia"
wr_kind: "request"
status: "open"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-08T01:15:03.407Z"
---

# AEGIS 프론트엔드 디자인 시스템 전면 교체 — IBM Carbon 기반 + NVIDIA 절제 참고

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# AEGIS 프론트엔드 디자인 시스템 전면 교체

## 결정 배경
- S1-QA가 58개 DESIGN.md를 전수 검토 (awesome-design-md 레포)
- S2에 의견 요청 → S2도 IBM Carbon 1순위 동의
- S1-QA + S2 합의: **IBM Carbon을 canonical base로, NVIDIA를 시각적 절제 참고로**

## 레퍼런스 파일 (이미 레포에 배치 완료)
- **Canonical base**: `docs/design/ibm/DESIGN.md` (+ preview.html, preview-dark.html)
- **Visual restraint 참고**: `docs/design/nvidia/DESIGN.md` (+ preview.html, preview-dark.html)

## 핵심 원칙
1. **IBM Carbon `--cds-*` 시맨틱 토큰 체계 채택** — 모든 색상/간격/타이포를 시맨틱 변수로 관리
2. **다크/라이트 동일 semantic map 유지** — 테마 전환은 변수값 교체만으로 완성
3. **severity/status 토큰을 AEGIS 도메인에 맞게 aliasing** — Carbon의 Red 60/Yellow 30/Green 50 → CRITICAL/HIGH/MEDIUM/LOW
4. **시각적 톤은 NVIDIA처럼 accent 절제** — 액센트 색상을 fill이 아닌 border/underline/badge에만 사용
5. **팔레트는 반드시 단일 파일로 집중 관리** — 나중에 디자인 시스템 교체 시 하나만 바꾸면 되게

## 폰트 스택
- Display/Body: **IBM Plex Sans** (무료, `--cds-*` 시스템과 일체)
- Mono: **IBM Plex Mono** (코드/기술 라벨용)
- OpenType: `"liga"` 활성화

## 작업 범위 및 우선순위

### Phase 1: 토큰 기반 구축 (최우선)
1. `src/renderer/styles/` 하위에 디자인 토큰 파일 생성 (단일 팔레트 파일)
2. CSS 변수를 Carbon `--cds-*` 패턴으로 전면 교체
3. `:root`에 라이트 기본값, `[data-theme="dark"]`에 다크 오버라이드
4. severity semantic 토큰 정의: `--aegis-severity-critical`, `--aegis-severity-high`, `--aegis-severity-medium`, `--aegis-severity-low`, `--aegis-severity-info`
5. status semantic 토큰 정의: `--aegis-status-ready`, `--aegis-status-running`, `--aegis-status-failed`, `--aegis-status-degraded`

### Phase 2: 타이포그래피 교체
1. IBM Plex Sans/Mono 폰트 설치 및 로딩 설정 (vite.config.ts)
2. 타이포그래피 위계 적용 (IBM Carbon Hierarchy 기준)
3. 사이드바 메뉴 font-size 14px 이상 확보
4. 주요 숫자(finding count, severity count)에 font-weight 차별화

### Phase 3: 컴포넌트 스타일링
1. 사이드바: header-row 여백, 꺽쇠 정렬, SECURITY FRAMEWORK 가독성
2. 카드: severity별 좌측 accent stripe 또는 배경 그라데이션
3. 버튼: Carbon 버튼 패턴 적용 (primary/secondary/ghost/danger)
4. 알림 드롭다운: 크기, 위치, empty state, 시각적 분리 전면 개선
5. 푸터: 라벨 명확화

### Phase 4: 대시보드 레이아웃
1. empty state 전용 디자인 (일러스트 + 안내 + CTA)
2. surface 명도 단계 확보 (Carbon의 Gray 100/90/80/70 활용)
3. 도넛 차트 + 분석 상태 영역 레이아웃 압축
4. "이전 분석 대비 변화" 섹션 — 데이터 없을 때 숨김 또는 empty state

### Phase 5: 테마 전환 + 검증
1. 라이트 ↔ 다크 전환 정상 동작 확인
2. 전 라우트(14개) 양쪽 모드에서 시각적 검증
3. E2E visual baseline 전체 갱신

## 이전 WR 통합
이 WR은 아래 기존 WR들의 이슈를 모두 포함합니다:
- 프로젝트 대시보드 디자인 전면 개선 요청 (P1 7건 + P2 1건)
- 사이드바 + WebSocket + OverviewPage 에러 수정 요청 (P0 1건 + P1 4건)
- 알림 드롭다운 디자인 전면 개선 (P1 6건)

## 완료 기준
- [ ] CSS 변수가 전부 Carbon 시맨틱 토큰 패턴으로 교체됨
- [ ] 팔레트가 단일 파일에 집중 관리됨
- [ ] IBM Plex Sans/Mono 폰트 적용됨
- [ ] 다크/라이트 양쪽 모드에서 전 라우트 정상 표시
- [ ] severity/status 색상이 시맨틱 토큰으로 관리됨
- [ ] `npm run build` 성공
- [ ] S1-QA가 Playwright로 전 라우트 순회 시 P1 이상 이슈 0건

## S2 의견 원문 참고
> "AEGIS는 '예쁜 SaaS'보다 '신뢰 가능한 운영 콘솔' 쪽에 더 가깝다. 그래서 Carbon을 기본값으로 보는 쪽이다."
> — S2 WR reply

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
