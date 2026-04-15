---
title: "S8. Container Gateway 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/container-gateway/package.json"
  - "services/container-gateway/src/index.ts"
  - "services/container-gateway/scripts/exec-command.sh"
  - "services/container-gateway/scripts/upload-and-exec.sh"
last_verified: "2026-04-15"
service_tags: ["s8"]
decision_tags: ["bootstrap", "container-gateway"]
related_pages: ["wiki/canon/specs/container-gateway.md", "wiki/canon/api/container-gateway-api.md"]
---

# S8. Container Gateway 인수인계서

> **먼저 `docs/AEGIS.md`를 읽을 것.**
> 이 문서는 S8(Container Gateway) 세션의 bootstrap/readme 역할을 한다.
> S8은 업로드/워크스페이스/프로젝트 컨테이너/QEMU-capable compile/allowlist exec를 담당하는 독립 HTTP 서비스다.

## 1. 역할과 경계

### S8은 한다
- 자체 업로드 API 제공
- 프로젝트별 versioned workspace 관리
- 프로젝트당 1개 컨테이너 재사용
- QEMU-capable compile
- allowlist-based exec
- safe teardown

### S8은 하지 않는다 (v1)
- S2 자동 연동
- frontend UI
- 실제 binary run
- auth / ACL 완성
- 다중 컨테이너 정책 최적화

## 2. 코드 위치

```text
services/container-gateway/
scripts/start-container-gateway.sh
```

## 3. 빠른 기동

```bash
cd ~/AEGIS
./scripts/start-container-gateway.sh
```

Health:
```bash
curl http://localhost:4010/health
```

## 4. 빠른 사용법

### 업로드 + compile + exec smoke
```bash
cd ~/AEGIS/services/container-gateway
npm run image:build
cd ~/AEGIS
services/container-gateway/scripts/smoke-upload-compile.sh
```

### 파일 업로드 후 명령 실행 자동화
```bash
services/container-gateway/scripts/upload-and-exec.sh --project projCli --file /tmp/s8-inline-main.c pwd
services/container-gateway/scripts/exec-command.sh projCli ls -al
```

## 5. 현재 핵심 스크립트
- `scripts/smoke-upload-compile.sh` — 업로드 → compile → exec smoke
- `scripts/exec-command.sh` — JSON 직접 작성 없이 기존 workspace에 명령 실행
- `scripts/upload-and-exec.sh` — 업로드 후 즉시 명령 실행

## 6. 현재 주의사항
- Docker Desktop / WSL integration 또는 로컬 Docker 엔진이 필요하다.
- Docker가 없으면 compile/exec는 `CONTAINER_RUNTIME_UNAVAILABLE`로 실패한다.
- v1은 allowlist-based exec이므로 모든 셸 명령을 열어두지 않는다.

## 7. 다음 세션 우선순위
1. S2 `import-from-path` seam 정리
2. real Docker smoke를 CI에 넣을지 수동 유지할지 결정
3. teardown retention / cleanup 정책 정교화
4. allowlist command 확장 여부 검토
