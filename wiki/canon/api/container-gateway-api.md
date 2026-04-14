---
title: "S8. Container Gateway API 명세"
page_type: "canonical-api"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/container-gateway/src/routes/upload-router.ts"
  - "services/container-gateway/src/routes/container-router.ts"
  - "services/container-gateway/src/routes/compile-router.ts"
  - "services/container-gateway/src/routes/exec-router.ts"
  - "services/container-gateway/src/routes/runtime-router.ts"
last_verified: "2026-04-14"
service_tags: ["s8"]
decision_tags: ["http-api", "container-gateway"]
related_pages: ["wiki/canon/specs/container-gateway.md", "wiki/canon/handoff/s8/readme.md"]
---

# S8. Container Gateway API 명세

Base URL:

```text
http://localhost:4010
```

## 공통 원칙

대부분 응답은 다음 envelope를 사용한다.

### Success
```json
{
  "success": true,
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "error": "...",
  "errorDetail": {
    "code": "...",
    "retryable": false
  }
}
```

## 1. Health

### `GET /health`

응답:
```json
{
  "service": "s8-container-gateway",
  "status": "ok",
  "version": "0.1.0"
}
```

## 2. Upload

### `POST /api/projects/:projectId/upload`

Multipart field: `file`

지원 입력:
- archive upload
- 단일/복수 source file upload

성공 응답 예시:
```json
{
  "success": true,
  "data": {
    "projectId": "projA",
    "uploadId": "upload-1234abcd",
    "workspaceId": "projA-ws-v1",
    "workspaceVersion": 1,
    "workspacePath": "/.../uploads/projA/projA-ws-v1",
    "fileCount": 2,
    "files": [
      { "relativePath": "main.c", "size": 21 }
    ]
  }
}
```

오류:
- `400 Invalid projectId`
- `400 No file uploaded`
- extraction 실패 시 `500` (현재 공통 error middleware 경유)

## 3. Container status

### `GET /api/projects/:projectId/container`

성공 응답 예시:
```json
{
  "success": true,
  "data": {
    "projectId": "projA",
    "containerName": "aegis-s8-project-proja",
    "containerId": "...",
    "image": "aegis-s8-qemu-compile:latest",
    "status": "running",
    "createdAt": "...",
    "updatedAt": "...",
    "labels": {
      "aegis.managed": "true",
      "aegis.scope": "container-gateway",
      "aegis.projectId": "projA"
    }
  }
}
```

상태값:
- `not_found`
- `creating`
- `running`
- `exited`
- `error`
- `tearing_down`
- `teardown_failed`
- `deleted`

## 4. Compile

### `POST /api/projects/:projectId/compile`

요청 예시:
```json
{
  "workspaceId": "projA-ws-v1",
  "profile": {
    "language": "c",
    "entryFile": "main.c",
    "outputName": "main",
    "compiler": "arm-linux-gnueabihf-gcc",
    "flags": ["-O2", "-static"],
    "includePaths": []
  }
}
```

성공 응답 예시:
```json
{
  "success": true,
  "data": {
    "projectId": "projA",
    "uploadId": "upload-1234abcd",
    "workspaceId": "projA-ws-v1",
    "workspaceVersion": 1,
    "containerName": "aegis-s8-project-proja",
    "containerId": "...",
    "success": true,
    "exitCode": 0,
    "stdout": "...",
    "stderr": "",
    "artifactPaths": ["/workspace/jobs/.../out/main"],
    "reused": true
  }
}
```

오류:
- `400 Invalid projectId`
- `400 workspaceId is required`
- `400 profile.* required`
- `422` compile 실패
- `500/503` container runtime unavailable 등

## 5. Exec

### `GET /api/projects/:projectId/exec/allowed-commands`

응답 예시:
```json
{
  "success": true,
  "data": {
    "commands": ["cat", "cp", "file", "find", "gcc", "g++", "ls", "mkdir", "mv", "objdump", "pwd", "readelf"],
    "note": "S8 v1 exec is allowlist-based and limited to read-only/build-oriented commands."
  }
}
```

### `POST /api/projects/:projectId/exec`

요청 예시:
```json
{
  "workspaceId": "projA-ws-v1",
  "command": "ls",
  "args": ["-al"],
  "cwd": ".",
  "timeoutMs": 10000
}
```

성공 응답 예시:
```json
{
  "success": true,
  "data": {
    "projectId": "projA",
    "uploadId": "upload-1234abcd",
    "workspaceId": "projA-ws-v1",
    "workspaceVersion": 1,
    "containerName": "aegis-s8-project-proja",
    "containerId": "...",
    "success": true,
    "exitCode": 0,
    "stdout": "...",
    "stderr": "",
    "reused": true,
    "workingDirectory": "/workspace/projects/projA/projA-ws-v1",
    "command": "ls",
    "args": ["-al"],
    "durationMs": 123
  }
}
```

에러 코드:
- `COMMAND_NOT_ALLOWED`
- `CONTAINER_RUNTIME_UNAVAILABLE`
- `EXEC_FAILED`

제약:
- 절대경로 금지
- `..` traversal 금지
- `cwd`는 workspace 내부만 허용

## 6. Runtime teardown

### `DELETE /api/projects/:projectId/runtime`

성공 응답 예시:
```json
{
  "success": true,
  "data": {
    "projectId": "projA",
    "status": "deleted",
    "workspaceId": "projA-ws-v1"
  }
}
```

실패 예시:
```json
{
  "success": false,
  "error": "teardown failed",
  "data": {
    "projectId": "projA",
    "status": "teardown_failed",
    "workspaceId": "projA-ws-v1"
  }
}
```

## 7. Future S2 seam (document-only)

### Draft
`POST /api/projects/:projectId/import-from-path`

요청 초안:
```json
{
  "sourceRef": {
    "path": "/abs/path/from/s2",
    "revisionId": "optional",
    "sourceKind": "archive|workspace|materialized-project"
  },
  "requestedWorkspaceId": "optional"
}
```

응답은 raw path를 외부 식별자로 재사용하지 않고, 반드시 S8-issued `uploadId` / `workspaceId` 를 반환해야 한다.
