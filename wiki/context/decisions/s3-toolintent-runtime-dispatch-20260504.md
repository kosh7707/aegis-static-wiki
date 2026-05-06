---
title: "S3 ToolIntent runtime-dispatch architecture (2026-05-04)"
page_type: "context-decision"
canonical: false
source_refs:
  - "services/analysis-agent/app/core/agent_loop.py"
  - "services/build-agent/app/core/agent_loop.py"
  - "services/analysis-agent/app/agent_runtime/tools/tool_intent.py"
  - "services/build-agent/app/agent_runtime/tools/tool_intent.py"
last_verified: "2026-05-04"
service_tags: ["s3", "analysis-agent", "build-agent"]
decision_tags: ["toolintent", "runtime-dispatch", "qwen3-thinking", "tool-choice-required-avoidance", "tdd"]
related_pages: ["wiki/context/decisions/llm-tool-choice-required-rootcause-20260503.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md"]
---

# S3 ToolIntent runtime-dispatch architecture (2026-05-04)

## Status

Decision for the active S3 remediation goal: implement ToolIntent runtime dispatch with tests first, then verify with unit suites and certificate-maker pipeline.

## Problem

The 2026-05-03 root-cause investigation found the current acquisition policy sends `tool_choice="required"` together with `chat_template_kwargs.enable_thinking=true`. On the live Qwen3/vLLM stack this combination commonly returns `finish_reason="tool_calls"` with `tool_calls=[]`, producing empty-response failures in Build Agent and risking the same class in Analysis Agent.

The P10 intent remains valid: evidence acquisition turns must not silently become unsupported final answers. The mechanism used to enforce it must change.

## Decision

S3 will remove vLLM `tool_choice="required"` from the mandatory evidence-acquisition path.

For mandatory acquisition turns — currently the pre-successful-tool-call turn(s), while callable tools exist and forced-report/finalizer is not active — S3 will:

1. Call S7 with `tools=None`, no `tool_choice`, `response_format={"type":"json_object"}`, and thinking enabled through the existing generation preset.
2. Ask for a strict JSON `ToolIntent` content object instead of an OpenAI `tool_calls` response.
3. Parse and validate the `ToolIntent` in S3 runtime.
4. Construct a synthetic `ToolCallRequest` in S3.
5. Feed that request into the existing `MessageManager.add_assistant_tool_calls()`, `ToolRouter.execute()`, `MessageManager.add_tool_results()`, and `session.record_tool_turn()` flow.

The LLM decides *what tool and arguments are useful*; S3 runtime owns *whether that decision is valid and how execution is recorded*.

After the first successful tool call, optional additional tool turns may still use the existing `tool_choice="auto"` path. This preserves current final-answer behavior and avoids a broad report/finalizer rewrite in the first implementation slice. The readiness gate forbids `required`; future slices may expand ToolIntent to all optional tool turns or to a `final_answer` action if that proves valuable.

## ToolIntent v1 schema

Only one call per mandatory acquisition turn is allowed initially.

```json
{
  "action": "call_tool",
  "tool_name": "read_file",
  "arguments": {"path": "package.json"},
  "rationale": "Need to inspect build metadata before proposing a build script."
}
```

Rules:
- `action` must be `call_tool`.
- `tool_name` must be a registered currently-available tool.
- `arguments` must be a JSON object.
- `rationale` is optional diagnostic text and is not evidence.
- Unknown tools, non-object arguments, malformed JSON, and unsupported actions are rejected before synthetic dispatch.
- Existing ToolRouter validation still performs schema, budget, duplicate, hook, and side-effect checks.

## Runtime integration

Build Agent:
- Pre-successful-tool acquisition turns use ToolIntent runtime dispatch while tools are available.
- Report/finalizer paths remain tool-less content JSON paths.
- After a successful tool call, the loop relaxes to `auto` for optional further work, preserving current build-success/failure report behavior.

Analysis Agent:
- Phase 1 deterministic collection remains unchanged.
- Phase 2 pre-successful-tool acquisition turns use ToolIntent runtime dispatch while tools are available.
- Existing deterministic `_suggest_next_evidence_action()` / `plan_next_action()` remains an advisory/seed mechanism and may be elevated to direct dispatch in a later refinement.
- Final report, structured retry, schema repair, and strict finalizer remain existing tool-less JSON paths.

Compatibility note:
- Service tests and future non-vLLM shims may inject already-parsed `LlmResponse.tool_calls` or ordinary content into this path. The runtime preserves those responses for compatibility. Live ToolIntent calls still pass `tools=None`, so live vLLM cannot produce parser-derived OpenAI tool calls in this mandatory-acquisition call.

## Why not `thinking=false + required` as the primary path

`required + thinking=false` was stable in the local probe, but public vLLM evidence indicates the `required` path can bypass Qwen XML/non-JSON tool parsers. S3 should not put production evidence acquisition on that parser path when the runtime already has a deterministic ToolRouter.

## Required test coverage before implementation is considered complete

- ToolIntent parser accepts valid v1 objects.
- Parser rejects malformed JSON, unsupported action, unknown tool, and non-object arguments.
- Build Agent mandatory acquisition calls S7 with `tools=None`, no `tool_choice`, and thinking-on generation, then executes a synthetic tool call.
- Analysis Agent mandatory acquisition does the same for registered tools.
- Existing tool execution, message history, session trace, and evidence catalog behavior remain intact after synthetic calls.
- Static readiness gate forbids `tool_choice="required"` in S3 acquisition loops and requires ToolIntent runtime-dispatch markers.
- Full Analysis Agent and Build Agent tests pass.
- `compileall` passes for both S3 services and eval helper.
- certificate-maker full pipeline passes or produces an honestly diagnosed non-clean outcome unrelated to empty `tool_calls`.

## Non-goals

- Do not modify S7 or vLLM.
- Do not change public S2-visible request/response API shapes.
- Do not resurrect a shared cross-service S3 runtime package; Analysis Agent and Build Agent keep service-local runtime ownership.
- Do not remove existing finalizer/strict JSON recovery paths.
