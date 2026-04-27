---
title: "Session history — S7 / Qwen3.6-27B serving cutover"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/llm-gateway/bench/results/sequential-rebench-20260423T221050Z"
  - "DGX Spark vLLM /v1/models proof 2026-04-24"
last_verified: "2026-04-24"
service_tags: ["s7", "llm-gateway", "llm-engine"]
decision_tags: ["model-default", "qwen3.6-27b", "benchmark-evidence"]
related_pages: ["wiki/canon/specs/llm-engine.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/session-s7-qwen-hard-retest-20260424.md"]
---

# Session history — S7 / Qwen3.6-27B serving cutover

## Decision

S7 LLM Engine default serving target is moved to `Qwen/Qwen3.6-27B` because the sequential clean-lifecycle benchmark prioritized AI reasoning quality and stability over throughput/resource metrics.

## Benchmark evidence

Sequential run root: `services/llm-gateway/bench/results/sequential-rebench-20260423T221050Z`.

All models were tested with: previous container stop/remove, target recipe launch, `/health` + `/v1/models` proof, resource snapshots, thinking-on warmup, then hard quality benchmark.

| Model | qualityScore | passRate | malformed | transportError |
|---|---:|---:|---:|---:|
| `Qwen/Qwen3.6-27B` | 0.74 | 0.70 | 0.30 | 0.00 |
| `Qwen/Qwen3.5-122B-A10B-GPTQ-Int4` | 0.64 | 0.60 | 0.40 | 0.00 |
| `Qwen/Qwen3.6-35B-A3B` | 0.48 | 0.40 | 0.30 | 0.00 |

Resource usage remains reference metadata only and is not included in the replacement score.

## Serving action

On 2026-04-24, the DGX Spark vLLM container was cleaned and relaunched with recipe `qwen3.6-27b-origin`.

Verification:

```json
{"health":200,"id":"Qwen/Qwen3.6-27B","root":"Qwen/Qwen3.6-27B","max_model_len":131072}
```

Smoke request:

```json
{"content":"QWEN27_SERVING_OK","usage":{"prompt_tokens":24,"completion_tokens":10,"total_tokens":34}}
```

## Operational note

Use `Qwen/Qwen3.6-27B` as the high-quality default model. `Qwen/Qwen3.6-35B-A3B` remains a candidate for fast/simple workloads, but should not be treated as the quality default based on this benchmark. `Qwen/Qwen3.5-122B-A10B-GPTQ-Int4` is now baseline/archive unless a future benchmark reverses the decision.
