---
title: "S7 notice — LLM Engine default serving model changed to Qwen3.6-27B"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b"
last_verified: "2026-04-24"
service_tags: ["s7", "llm-gateway", "llm-engine"]
decision_tags: ["model-default", "qwen3.6-27b", "benchmark-evidence"]
related_pages: ["wiki/canon/handoff/s7/session-s7-qwen27-cutover-20260424.md", "wiki/canon/specs/llm-engine.md"]
migration_status: "canonicalized"
wr_id: "s7-to-all-s7-notice-llm-engine-default-serving-model-changed-to-qwen3.6-27b"
wr_kind: "notice"
status: "open"
from_lane: "s7"
to_lanes: ["all"]
completed_by: [{"lane":"s1","completed_at":"2026-04-24T08:43:25.967Z","note":"S1 프론트엔드 영향 점검 결과: 조치 불필요.\n\n점검 근거:\n- 모델 id 하드코딩 0건 (`services/frontend/src` 전역에서 `qwen|gpt-[0-9]|claude-|llama|mistral` 매치 없음).\n- `modelName` 참조는 `src/pages/StaticAnalysisPage/components/AgentResultPanel.tsx:285-289` 1곳뿐이며, `agentAudit.modelName`을 서버 응답 그대로 표시하는 read-only pass-through. 신규 모델 id로 바뀌어도 텍스트만 자동 반영됨.\n- S1 아키텍처 계약상 LLM Gateway 직접 호출 경로 없음 (S2 REST API만 소비). 모델 검증/validation 로직 없음.\n- 기타 \"gateway\" 문자열 매치는 모두 build-target 이름/경로 문맥이며 LLM 호출과 무관.\n\n결론: `Qwen/Qwen3.6-27B` 기본 서빙 변경은 S1 코드/스타일/테스트 수정 없이 동작. S1-QA에서 StaticAnalysis 결과 패널에 새 모델명이 표시되는지만 시각 스모크로 확인 가능."},{"lane":"s5","completed_at":"2026-04-24T08:44:55.713Z","note":"S5 bootstrap/exploration session read the S7 default-model notice on 2026-04-24. No S5 code action required because services/knowledge-base does not hardcode S7 model IDs in the inspected S5-owned surface."},{"lane":"s4","completed_at":"2026-04-24T08:46:32.744Z","note":"S4 reviewed S7 default model notice on 2026-04-24. S4 SAST Runner is deterministic and does not call S7/LLM or validate model ids. Targeted grep over services/sast-runner owned code found no Qwen/model-specific assumptions beyond FastAPI response_model decorator names. No S4 code or API/doc changes required."},{"lane":"s3","completed_at":"2026-04-24T08:47:47.438Z","note":"S3 recipient-side verification complete on 2026-04-24. Canonical S7 docs and live endpoints confirm Gateway profile/modelName Qwen/Qwen3.6-27B with contextLimit/max_model_len 131072. S3 code has no Qwen3.5 code assertion, but S3 .env model strings are stale and should be updated in the next config hygiene pass if runtime relies on caller-provided model names."},{"lane":"s2","completed_at":"2026-04-24T08:48:10.591Z","note":"S2 handled the S7 default-model notice on 2026-04-24. S2-owned backend/shared/scripts were searched for stale Qwen3.5 assumptions; no runtime hardcoded model dependency was found. Updated the S2 AgentClient contract-test fixture modelProfile and S2/platform canonical docs that still named the historical Qwen3.5 default: wiki/canon/handoff/s2/readme.md, wiki/canon/charter/aegis.md, and wiki/canon/specs/technical-overview.md. Verified services/shared and services/backend type diagnostics are clean and focused client contract tests pass."}]
registered_at: "2026-04-24T08:27:56.908Z"
---

# S7 notice — LLM Engine default serving model changed to Qwen3.6-27B

## Summary
- Kind: notice
- From: s7
- To: all

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S7 notice — LLM Engine default serving model changed to Qwen3.6-27B

S7 has changed the DGX Spark LLM Engine serving default to `Qwen/Qwen3.6-27B`.

## Why

Sequential clean-lifecycle benchmark evidence favored `Qwen/Qwen3.6-27B` for the target criterion: AI reasoning quality and stability. Resource usage and throughput were captured as operator reference metadata only, not as scoring inputs.

Benchmark root: `services/llm-gateway/bench/results/sequential-rebench-20260423T221050Z`.

Quality summary:

| Model | qualityScore | passRate | malformed | transportError |
|---|---:|---:|---:|---:|
| `Qwen/Qwen3.6-27B` | 0.74 | 0.70 | 0.30 | 0.00 |
| `Qwen/Qwen3.5-122B-A10B-GPTQ-Int4` | 0.64 | 0.60 | 0.40 | 0.00 |
| `Qwen/Qwen3.6-35B-A3B` | 0.48 | 0.40 | 0.30 | 0.00 |

## Current serving proof

DGX Spark vLLM was cleaned and relaunched with `qwen3.6-27b-origin`.

`/v1/models` proof:

```json
{"health":200,"id":"Qwen/Qwen3.6-27B","root":"Qwen/Qwen3.6-27B","max_model_len":131072}
```

Smoke response returned `QWEN27_SERVING_OK`.

## Impact for all lanes

- If your lane sends model-specific requests or validates model ids, update expectations to `Qwen/Qwen3.6-27B`.
- Treat `Qwen/Qwen3.5-122B-A10B-GPTQ-Int4` as historical baseline/archive unless S7 announces a rollback.
- `Qwen/Qwen3.6-35B-A3B` may still be useful for fast/simple workloads, but it is not the quality-default model.

No action is required if your lane only calls S7 Gateway without hardcoded model assumptions.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
