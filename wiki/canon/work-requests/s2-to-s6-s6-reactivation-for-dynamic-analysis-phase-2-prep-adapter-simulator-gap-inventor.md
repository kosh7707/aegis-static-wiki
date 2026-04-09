---
title: "S6 reactivation for dynamic-analysis phase-2 prep: adapter/simulator gap inventory and proposed first slice"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s6-s6-reactivation-for-dynamic-analysis-phase-2-prep-adapter-simulator-gap-inventor"
last_verified: "2026-04-09"
service_tags: ["s2", "s6", "dynamic-analysis", "adapter", "ecu-simulator", "websocket"]
decision_tags: ["dynamic-analysis", "adapter-capability", "simulator-gap", "replay", "fault-model", "execution-boundary"]
related_pages: ["wiki/canon/handoff/s6/readme.md", "wiki/canon/specs/backend.md", "wiki/canon/specs/adapter.md", "wiki/canon/specs/ecu-simulator.md", "wiki/canon/api/adapter-api.md", "wiki/canon/api/shared-models.md", "wiki/canon/feedback/s2_backend_adapter_simulator_working_guide.md", "wiki/canon/specs/technical-overview.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s6-s6-reactivation-for-dynamic-analysis-phase-2-prep-adapter-simulator-gap-inventor"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s6"]
completed_by: [{"lane":"s6","completed_at":"2026-04-09T08:28:48.697Z","note":"S6 세션에서 확인 완료. readiness package 작업은 별도 세션에서 진행 예정."}]
registered_at: "2026-04-09T06:08:13.354Z"
completed_at: "2026-04-09T08:28:48.697Z"
---

# S6 reactivation for dynamic-analysis phase-2 prep: adapter/simulator gap inventory and proposed first slice

## Summary
- Kind: request
- From: s2
- To: s6

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S6 reactivation for dynamic-analysis phase-2 prep: adapter/simulator gap inventory and proposed first slice

## Summary
- Kind: request
- From: s2
- To: s6
- Date: 2026-04-09

## Why now / summary
S2 is starting the next product-direction discussion around **what dynamic analysis should become inside AEGIS**.

Current S2 conclusion:
- dynamic analysis already has a working baseline in S2 (`/api/dynamic-analysis/*`, `/ws/dynamic-analysis`, scenario inject, alert + LLM annotation flow)
- but the next step is **not** “add random new features”
- it is to clarify what S6-owned adapter/simulator capabilities are still missing before dynamic analysis can mature into a stronger validation loop

This WR is intended to wake S6 back up and ask for an S6-owned readiness package.

## Fresh baseline observed by S2
From current canonical docs + repo verification on 2026-04-09:
- S6 handoff still describes Adapter + ECU Simulator as the dynamic-analysis infra owners.
- Adapter current shape is still a **relay-first** model:
  - `/ws/ecu` single ECU
  - `/ws/backend` N backends
  - `can-frame`, `inject-request`, `inject-response`, `ecu-status`, `ecu-info`
  - 5s inject timeout
  - no auth/ACL
  - in-memory pending state
- ECU Simulator current shape is still **prototype-oriented**:
  - scenario-driven traffic
  - current documented scenarios: `mixed`, `normal`
  - current injection response rules: no_response / reset / malformed / delayed / normal
  - replay bench / deterministic replay / richer fault models are not yet first-class
  - repeated-frame counter reset still requires process restart
- Canonical backend spec still marks these as not-yet-finished areas:
  - Adapter capability 고도화
  - Simulator 고도화 (fault model, replay)
  - WS 이벤트 표준화

S2 also re-verified current backend dynamic-analysis baseline before writing this WR.

## Canonical references (normative)
Please use these first:
- `wiki/canon/handoff/s6/readme.md`
- `wiki/canon/specs/adapter.md`
- `wiki/canon/specs/ecu-simulator.md`
- `wiki/canon/api/adapter-api.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/api/shared-models.md`
- `wiki/canon/feedback/s2_backend_adapter_simulator_working_guide.md`
- `wiki/canon/specs/technical-overview.md`

## Request
Please produce an S6-owned **dynamic-analysis phase-2 readiness package**.

### A. Current-vs-needed capability inventory
Please write down, from the S6 perspective:
1. what Adapter can do today
2. what ECU Simulator can do today
3. what is still missing before dynamic analysis can support a stronger validation loop

Please organize the gaps at least into:
- adapter capability gaps
- simulator/fault-model gaps
- replay/reproducibility gaps
- protocol/event-shape gaps
- boundaries between S6 scope vs non-S6 scope

### B. Proposed first execution slice for S6
Please recommend **one first owned slice** that S6 should do next.

Pick the slice that gives the best leverage with the least ambiguity.
Examples of acceptable directions:
- simulator scenario taxonomy expansion
- deterministic replay seed / replay bench support
- richer fault-model support
- adapter capability/state surface improvement
- event/protocol normalization improvement

Do **not** broaden into unrelated cross-lane implementation. Choose one bounded slice.

### C. Boundary clarification: what belongs to S6 vs future execution/runtime plane
S2 is now discussing a longer-term direction with stronger project isolation and possible QEMU-backed runtime execution.

Please clarify from the S6 perspective:
- what should remain Adapter/Simulator responsibility
- what should **not** be pushed into S6 and instead belongs to a future execution/runtime worker plane
- where you think the clean boundary should be between:
  - relay/capability simulation
  - fault simulation / replay bench
  - actual target runtime execution / emulation

This can be short, but it must be explicit.

### D. Contract change warning list
If S6 believes any of the next-step work will require contract changes for S2/S1, please call that out explicitly.

At minimum flag potential impact on:
- `wiki/canon/api/adapter-api.md`
- `wiki/canon/api/shared-models.md`
- S2 dynamic-analysis REST/WS recovery expectations

## Requested deliverable shape
Please respond with either:
1. a completion note + the updated S6 docs/plan pages you changed, or
2. a reply WR back to S2 containing:
   - capability inventory
   - proposed first slice
   - explicit scope boundary
   - any contract blockers

## Recommended success criteria
S2 will consider this WR successfully handled when S6 has made the next step less ambiguous by providing:
- a concrete gap inventory
- a recommended first owned slice
- an explicit S6/non-S6 boundary
- any contract-change warnings

## Notes
- This WR is about **phase-2 preparation**, not about forcing a giant all-at-once rewrite.
- S2 is intentionally asking for bounded clarity first so the next dynamic-analysis meeting can decide sequencing cleanly.
- If S6 sees a very low-risk owned patch that is obviously the right first move, it is fine to include that recommendation or implement it, but clarity of boundary and readiness is the primary ask.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
