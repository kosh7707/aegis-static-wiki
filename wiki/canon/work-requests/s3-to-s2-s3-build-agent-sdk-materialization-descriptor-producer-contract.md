---
title: "S3 Build Agent SDK materialization descriptor producer contract"
page_type: "canonical-work-request"
canonical: true
source_refs:
  - "mcp://register_wr"
  - "mcp://aegis-static-wiki.write_page"
last_verified: "2026-05-07"
service_tags: ["s2", "s3", "build-agent"]
decision_tags: ["sdk-materialization", "hot11", "api-contract"]
related_pages: ["wiki/canon/api/build-agent-api.md", "wiki/canon/specs/build-agent.md", "wiki/canon/specs/build-agent-state-machine.md", "wiki/canon/handoff/s3/readme.md"]
---

# S3 Build Agent SDK materialization descriptor producer contract

## Summary
- Kind: request
- From: s3
- To: s2

S3 is implementing Build Agent SDK materialization support for strict SDK-mode builds and hot11 stabilization. S2 should prepare/implement the producer side of the additive `context.trusted.build` descriptor documented in `wiki/canon/api/build-agent-api.md`.

## Requested S2 behavior
For SDK-mode `build-resolve` requests, include request-scoped materialization fields under `context.trusted.build`:

- `mode: "sdk"`
- `sdkId`: registry identity
- `sdkRootPath`: absolute server-visible path to the materialized uploaded SDK root
- `setupScript`: preferred relative path inside `sdkRootPath`; transitional absolute path must remain inside `sdkRootPath`
- `sysroot`: optional relative/inside-root sysroot path
- `toolchainTriplet`: optional compiler-prefix hint such as `arm-none-linux-gnueabihf`
- `environment`: optional supplemental env map
- `scriptHintPath`: project/target-relative reference-only build-script hint path

## Precedence / conflict policy
- Canonical fields live directly under `context.trusted.build`; S3 is not introducing a nested `sdkMaterialization` object in build-v1.1.
- Legacy flat aliases (`sdkId`, `setupScript`, `toolchainTriplet`, `buildEnvironment`) are accepted only when the matching canonical field is absent or identical.
- Canonical/legacy conflicts are invalid contract failures, not silent overrides.
- Relative `setupScript`/`sysroot` values are resolved under `sdkRootPath`; absolute values are accepted only if they resolve inside `sdkRootPath`.
- Descriptor-derived env values such as `AEGIS_SDK_ROOT`, `AEGIS_SDK_SETUP_SCRIPT`, `AEGIS_SDK_SYSROOT`, `AEGIS_TOOLCHAIN_TRIPLET`, `SDK_DIR`, and `SDKTARGETSYSROOT` are authoritative over supplemental caller env when derivable.

## Contract notes
- `sdkId` alone is not sufficient for strict SDK-mode Build Agent execution.
- User-local paths embedded in uploaded build scripts are reference material only; the trusted descriptor should point at the materialized upload location.
- This is additive to the current build-v1.1 request surface, but S3 will reject or non-clean fail strict SDK-mode requests that have no usable materialization descriptor/environment/script hint.

## Acceptance evidence requested from S2
1. Show a representative request payload for at least one uploaded SDK + build target containing the descriptor fields above.
2. Confirm that `setupScript`/`sysroot` are produced relative to `sdkRootPath` when possible.
3. Confirm `scriptHintPath` stays target/project-relative and is not inline script text.
4. Confirm no S2 producer path depends on `/home/kosh/ti-sdk` or TI-specific host defaults.
5. Confirm S2 rejects or avoids producing conflicting canonical/legacy descriptor values.

## Timing
S3 can proceed with Build Agent consumer implementation and local hot11 fixtures immediately. S2 can reply when producer readiness/evidence is available.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
