---
title: "S8. Container Gateway 기능 명세"
page_type: "canonical-spec"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/container-gateway/src/index.ts"
  - "services/container-gateway/src/routes/upload-router.ts"
  - "services/container-gateway/src/routes/compile-router.ts"
  - "services/container-gateway/src/routes/exec-router.ts"
  - "services/container-gateway/src/routes/runtime-router.ts"
  - "services/container-gateway/docker/container-toolchain.Dockerfile"
last_verified: "2026-04-14"
service_tags: ["s8"]
decision_tags: ["container-gateway", "upload-compile", "project-scoped-runtime"]
related_pages: ["wiki/canon/api/container-gateway-api.md", "wiki/canon/handoff/s8/readme.md"]
---

# S8. Container Gateway 기능 명세

> S8은 프로젝트별 업로드 워크스페이스와 프로젝트당 1개 컨테이너를 관리하는 독립 HTTP 서비스다.
> v1 기준으로 업로드 → 컨테이너 재사용 → QEMU-capable compile → 제한된 exec → safe teardown 흐름을 책임진다.

## 역할

S8은 기존 S6 adapter prototype의 container / compile 실험을 독립 서비스로 승격한 실행 plane이다.

```text
Client / CLI
   ↓
S8 Container Gateway (:4010)
   ├─ project-scoped upload/workspace materialization
   ├─ project-scoped container ensure/reuse
   ├─ compile in QEMU-capable toolchain container
   ├─ allowlist-based exec interface
   └─ safe teardown (quarantine → container remove → artifact cleanup)
```

## 핵심 원칙

1. **독립 서비스 우선** — S2 / frontend / backend 수정 없이 단독 기동/검증 가능
2. **프로젝트당 1컨테이너** — 프로젝트 identity와 container identity를 1:1로 유지
3. **workspace version 분리** — 업로드된 workspace version은 container identity와 별도로 증가
4. **compile-before-run** — v1은 compile/exec까지, 실제 binary 실행은 후속 단계
5. **safe teardown** — raw 삭제가 아니라 quarantine-first 삭제

## 파일 구조

```text
services/container-gateway/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── docker/
│   └── container-toolchain.Dockerfile
├── scripts/
│   ├── smoke-upload-compile.sh
│   ├── exec-command.sh
│   └── upload-and-exec.sh
└── src/
    ├── index.ts
    ├── config.ts
    ├── logger.ts
    ├── contracts/
    ├── routes/
    ├── runtime/
    ├── services/
    ├── utils/
    └── __tests__/
```

## 기동

```bash
cd /home/gang/AEGIS
./scripts/start-container-gateway.sh
```

기본 포트: `4010`

Health:
```bash
curl http://localhost:4010/health
```

## 업로드/워크스페이스 모델

- 업로드는 `projectId` 아래에 versioned workspace를 생성한다.
- S8은 업로드 결과로 다음 식별자를 발급한다.
  - `uploadId`
  - `workspaceId`
  - `workspaceVersion`
- 같은 프로젝트에 여러 번 업로드해도 **container는 재사용**하고, **workspace version만 증가**한다.

## 컨테이너 모델

- 프로젝트당 1개 컨테이너
- deterministic name: `aegis-s8-project-<projectId>`
- image: `aegis-s8-qemu-compile:latest` (기본)
- labels:
  - `aegis.managed=true`
  - `aegis.scope=container-gateway`
  - `aegis.projectId=<projectId>`

## Toolchain / QEMU 이미지

기본 이미지에는 다음이 포함된다.
- `qemu-user-static`
- `gcc`, `g++`
- `gcc-arm-linux-gnueabihf`
- `gcc-aarch64-linux-gnu`
- 각 cross libc dev 패키지
- `make`, `file`

즉, native compile과 armhf / aarch64 cross-compile을 한 이미지에서 처리한다.

## Compile API 의미

Compile은 특정 `workspaceId` 를 지정해서 실행한다.
- container는 project-scoped로 재사용
- compile 대상은 workspace-scoped로 분리

응답은 다음을 포함한다.
- `success`
- `exitCode`
- `stdout`
- `stderr`
- `artifactPaths[]`
- `containerId`
- `workspaceId`, `workspaceVersion`

## Exec 인터페이스

S8은 터미널 세션이 아니라 **allowlist-based exec** 를 제공한다.

현재 허용 명령 예시:
- `pwd`, `ls`, `find`, `file`, `cat`
- `cp`, `mv`, `mkdir`
- `gcc`, `g++`, `make`
- `readelf`, `objdump`
- `arm-linux-gnueabihf-gcc`, `aarch64-linux-gnu-gcc`

제약:
- `workspaceId` 필수
- `cwd`는 workspace 내부여야 함
- 파일시스템 인자에 절대경로 / `..` traversal 금지
- 비허용 명령은 `COMMAND_NOT_ALLOWED`로 거절

## Safe teardown

`DELETE /api/projects/:projectId/runtime`

순서:
1. workspace quarantine
2. runtime state = `tearing_down`
3. container stop/remove
4. compile artifact cleanup
5. quarantined workspace final delete
6. state = `deleted`

실패 시:
- workspace restore
- `teardown_failed`
- retry 가능한 상태 유지

## 현재 한계 (v1)

- 실제 binary run 없음
- auth / ACL 없음
- S2 자동 연동 없음
- Docker daemon 사용 가능 환경이 필요함
- real Docker smoke는 환경에 따라 manual-only일 수 있음
