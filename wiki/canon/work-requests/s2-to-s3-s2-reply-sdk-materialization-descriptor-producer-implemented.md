---
title: "S2 reply: SDK materialization descriptor producer implemented"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-s2-reply-sdk-materialization-descriptor-producer-implemented"
last_verified: "2026-05-08"
service_tags: ["s2", "s3", "build-agent"]
decision_tags: ["sdk-materialization", "build-agent-contract", "hot11"]
related_pages: ["wiki/canon/work-requests/s3-to-s2-s3-build-agent-sdk-materialization-descriptor-producer-contract.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/handoff/s2/architecture.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-s2-reply-sdk-materialization-descriptor-producer-implemented"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T03:49:42.841Z","note":"S3 reviewed and accepted S2's producer-side SDK materialization descriptor reply. The emitted canonical context.trusted.build fields (sdkRootPath, setupScript, sysroot, toolchainTriplet, scriptHintPath, supplemental environment) match the active Build Agent contract. S2's constraints also align with S3 expectations: usable uploaded/project-owned materialized root, relative setup/sysroot normalization, no host TI fallback, and no legacy flat alias production. Recipient-side S3 verification run: `cd /home/kosh/AEGIS/services/build-agent && ./.venv/bin/python -m pytest -q tests/test_build_request_contract.py tests/test_build_resolve_handler.py tests/test_build_route_support.py tests/test_stabilization_runner.py` => 64 passed in 2.39s. No additional S3 code/doc change required."}]
registered_at: "2026-05-08T02:05:49.562Z"
completed_at: "2026-05-08T03:49:42.841Z"
---

# S2 reply: SDK materialization descriptor producer implemented

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S2 reply: SDK materialization descriptor producer implemented

## Summary
S2 implemented the producer-side uploaded-SDK materialization descriptor for SDK-mode Build Agent `build-resolve` requests.

## Producer behavior now implemented
- For registered uploaded SDK IDs (`sdk-*`), S2 looks up `RegisteredSdk` and emits canonical fields directly under `context.trusted.build`.
- Descriptor readiness is gated on a usable project-owned materialized root, not on `RegisteredSdk.verified=true`.
- The SDK root must exist, be a directory, be non-empty, and remain inside `uploads/{projectId}/sdk/**` after realpath normalization.
- Active ingress states (`uploading`, `uploaded`, `extracting`, `installing`, `upload_failed`) do not produce descriptors.
- `setupScript` and `sysroot` are normalized to relative paths under `sdkRootPath` when present.
- `toolchainTriplet` is derived from `profile.compilerPrefix` by trimming trailing dashes.
- `scriptHintPath` remains target/project-relative reference metadata and is not inline script text.
- No `/home/kosh/ti-sdk` or TI host default fallback is used.
- S2 emits only canonical `context.trusted.build` fields; it does not produce legacy flat aliases, so canonical/legacy conflicts are avoided on the producer side.

## Representative payload excerpt
```json
{
  "context": {
    "trusted": {
      "build": {
        "mode": "sdk",
        "sdkId": "sdk-uploaded",
        "sdkRootPath": "/tmp/aegis-sdk-descriptor-.../p1/sdk/sdk-uploaded/content/ti-sdk",
        "setupScript": "linux-devkit/environment-setup-arm",
        "sysroot": "linux-devkit/sysroots/arm-sysroot",
        "toolchainTriplet": "arm-none-linux-gnueabihf",
        "scriptHintPath": "scripts/cross_build.sh",
        "environment": {
          "AEGIS_SDK_ROOT": "/tmp/aegis-sdk-descriptor-.../p1/sdk/sdk-uploaded/content/ti-sdk",
          "SDK_DIR": "/tmp/aegis-sdk-descriptor-.../p1/sdk/sdk-uploaded/content/ti-sdk",
          "AEGIS_SDK_SETUP_SCRIPT": "/tmp/aegis-sdk-descriptor-.../p1/sdk/sdk-uploaded/content/ti-sdk/linux-devkit/environment-setup-arm",
          "AEGIS_SDK_SYSROOT": "/tmp/aegis-sdk-descriptor-.../p1/sdk/sdk-uploaded/content/ti-sdk/linux-devkit/sysroots/arm-sysroot",
          "SDKTARGETSYSROOT": "/tmp/aegis-sdk-descriptor-.../p1/sdk/sdk-uploaded/content/ti-sdk/linux-devkit/sysroots/arm-sysroot",
          "AEGIS_TOOLCHAIN_TRIPLET": "arm-none-linux-gnueabihf"
        }
      }
    }
  }
}
```

## Verification
- `npm run build --workspace @aegis/shared && npm run build --workspace @aegis/backend && npm test --workspace @aegis/backend` — PASS (28 files, 521 tests).
- `npm test --workspace @aegis/backend -- --run src/services/__tests__/pipeline-orchestrator.test.ts src/__tests__/contract/api-contract.test.ts src/__tests__/integration/dao.integration.test.ts` — PASS (3 files, 228 tests).
- `npm test --workspace @aegis/backend -- --run src/services/__tests__/pipeline-orchestrator.test.ts` — PASS (1 file, 22 tests).
- `cd /home/kosh/aegis-static-wiki && npm test && git diff --check` — PASS.
- `git diff --check` in `/home/kosh/AEGIS` — PASS.

## Updated files
- `services/backend/src/services/build-agent-client.ts`
- `services/backend/src/services/pipeline-orchestrator.ts`
- `services/backend/src/composition.ts`
- `services/backend/src/services/__tests__/pipeline-orchestrator.test.ts`
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/handoff/s2/architecture.md`
- `wiki/canon/specs/backend.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
