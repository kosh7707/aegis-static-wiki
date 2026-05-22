---
title: "S4 reply: certificate-maker full live e2e smoke static-evidence review"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-reply-certificate-maker-full-live-e2e-smoke-static-evidence-review"
last_verified: "2026-05-22"
service_tags: ["s3", "s4", "sast-runner", "paper-pipeline", "traceaudit", "certificate-maker", "e2e-smoke"]
decision_tags: ["work-request-reply", "deep-review", "s4-static-evidence", "paper-readiness", "usable-with-caveats"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-deep-review-certificate-maker-full-live-e2e-smoke-evidence.md", "wiki/canon/handoff/s4/session-omx-1779334043555-q4a62s.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-reply-certificate-maker-full-live-e2e-smoke-static-evidence-review"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-22T04:36:55.743Z","note":"S3 consumed the S4 review reply and registered follow-up implementation WR wiki/canon/work-requests/s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review.md for gcc-fanalyzer enriched evidence, function anchoring/body ranges, cluster metadata, and local category/security-relevance metadata."}]
registered_at: "2026-05-22T04:22:17.645Z"
completed_at: "2026-05-22T04:36:55.743Z"
---

# S4 reply: certificate-maker full live e2e smoke static-evidence review

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S4 reply: certificate-maker full live e2e smoke static-evidence review

## Verdict

S4 verdict on run usability: **usable-with-caveats**.

S4 accepts the **19-finding static-evidence bundle** as valid paper-smoke evidence for `bt-0001-certificate_maker`.

The caveats are not transport/readiness failures. They are scale-readiness improvements for richer producer-side context, especially for GCC analyzer findings whose current normalized evidence preserves only `use of uninitialized value '<unknown>'` without diagnostic path/variable/event detail.

## Evidence reviewed

Primary run directory:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336
```

S4 artifacts reviewed:

```text
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-requests.jsonl
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.raw.json
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.normalized.json
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/findings.jsonl
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/triage-envelope.jsonl
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/finding-evidence-summary.jsonl
cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/audit-packets/findings/**/b4.json
```

Verification performed:

```text
cd /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336
sha256sum -c SHA256SUMS --quiet
```

Result: pass.

Local consistency checks also passed:

- `findings.jsonl`: 19 findings.
- `triage-envelope.jsonl`: 19 rows.
- `finding-evidence-summary.jsonl`: 19 rows.
- raw, normalized, findings, triage, and summary finding IDs match in order.
- finding IDs are stable as `finding:0000` through `finding:0018`.
- every finding has path/start/end line, `ruleId`, `toolId`, message, evidence refs, and S4 trace.
- all 6 S4 tool runs succeeded.
- no S4 tool run is marked degraded or coverage-degraded.
- 19 per-finding `b4.json` packets exist and cover all 19 finding IDs.
- S4 bundle correctly declares `evidenceCompleteness.status=bounded_partial` with `consumerPolicy=not_complete_security_evidence`.

Tool/finding counts:

```text
semgrep=1, cppcheck=3, flawfinder=2, clang-tidy=8, scan-build=1, gcc-fanalyzer=4
```

Downstream triage counts:

```text
TP=11, FP=5, UNKNOWN=3
```

## S4 producer-side assessment

### Bundle and contract

The bundle is reviewable and downstream-consumable. S4 preserved the core producer contract:

- S4 emits local static observations, not final security verdicts.
- raw and normalized artifacts preserve build target/case/request provenance.
- each exported finding links to an S4 trace and evidence reference.
- S4 claim boundaries explicitly prohibit using empty/missing S4 evidence as negative security evidence.
- S4 surface status correctly marks findings/evidence/toolRuns/functions/sourceFiles/includeEdges as produced and libraries as empty with a non-negative-evidence policy.

### Main caveat

For analyzer-style findings, especially `gcc-fanalyzer:analyzer-use-of-uninitialized-value`, S4 currently preserves only a terse message and primary source location. This is sufficient to prove that a local static analyzer reported an issue, but weak for final TP/FP adjudication because it omits analyzer path events, variable identity, related locations, or call-chain evidence.

This caveat explains why `finding:0016`-`finding:0018` remained UNKNOWN despite the bundle being valid.

## Per-finding review notes

### FP findings

| finding | S4 rule/location | S4-shape verdict | S4 review note |
|---|---|---:|---|
| `finding:0003` | `cppcheck:unreadVariable`, `main.cpp:276` | well-formed | The S4 claim is a valid local tool observation, but downstream FP is reasonable: `exitLoop` is read by `while (!exitLoop)` at `main.cpp:261`; the write at 276 controls loop exit and is followed by `break`. |
| `finding:0005` | `flawfinder:buffer/char`, `main.cpp:40` | well-formed | The warning is reviewable and correctly located at `char buf[512]`; FP is reasonable because the read uses `fgets(buf, sizeof(buf), p)` at line 41. |
| `finding:0013` | `clang-tidy:clang-analyzer-deadcode.DeadStores`, `main.cpp:276` | well-formed | Same underlying `exitLoop` dead-store claim as `finding:0003`; cross-tool duplicate is acceptable as raw static evidence, and downstream FP is reasonable. |
| `finding:0014` | `scan-build:deadcode.DeadStores`, `main.cpp:276` | well-formed | Same underlying dead-store claim; S4 evidence is stable and reviewable, downstream FP is reasonable. |
| `finding:0015` | `gcc-fanalyzer:analyzer-malloc-leak`, `main.cpp:35` | well-formed but path-thin | The finding is located at `popen`; downstream FP is reasonable because line 48 returns `pclose(p)`. However, S4 should preserve analyzer event/path detail for GCC findings before scaling. |

### UNKNOWN findings

| finding | S4 rule/location | S4-shape verdict | S4 review note |
|---|---|---:|---|
| `finding:0016` | `gcc-fanalyzer:analyzer-use-of-uninitialized-value`, `main.cpp:66` | valid but too thin for final triage | The line is in `trim`; visible local variables are initialized, and S4 provides no variable name or analyzer path. UNKNOWN is appropriate under strict grounding. |
| `finding:0017` | `gcc-fanalyzer:analyzer-use-of-uninitialized-value`, `main.cpp:92` | valid but too thin for final triage | The line declares/default-constructs `std::string cur`; without GCC path/variable detail, S4 only proves a local tool warning, not TP/FP. UNKNOWN is appropriate. |
| `finding:0018` | `gcc-fanalyzer:analyzer-use-of-uninitialized-value`, `main.cpp:128` | valid but too thin for final triage | The line returns `o.str()` from `build_san`; S4 lacks the specific uninitialized object and path/caller chain. UNKNOWN is appropriate. |

### Hotspot: `finding:0008`

`finding:0008` is S4-well-formed and acceptable:

- Rule: `clang-tidy:bugprone-easily-swappable-parameters`.
- Location: `main.cpp:106`.
- Message identifies `build_san` and the two adjacent `const std::vector<std::string> &` parameters.
- The retrieved function body confirms distinct semantics: `ips` are emitted as `IP:` and `dns` as `DNS:`.

The S3 quality flag on this finding is not caused by S4 finding shape. The duplicate/skipped record shows a malformed tool name, `explore_source_kg\n</parameter`, which is an acquisition/tool-call formatting issue downstream of S4. S4 evidence for `finding:0008` is stable enough for review.

### Representative TP findings

| finding | S4 rule/location | S4 review note |
|---|---|---|
| `finding:0000` | `semgrep:rules.cpp.aegis.cpp.cwe-78-popen-with-variable`, `main.cpp:35` | Strong S4 evidence: non-literal command reaches `popen(cmd.c_str(), "r")`. |
| `finding:0004` | `flawfinder:shell/popen`, `main.cpp:35` | Same sink, independent tool; valid local positive static observation. |
| `finding:0007` | `clang-tidy:cert-env33-c`, `main.cpp:35` | Same command-processor sink; valid tool observation. |
| `finding:0008` | `clang-tidy:bugprone-easily-swappable-parameters`, `main.cpp:106` | Valid maintainability/bug-prone claim; not a transport/schema issue. |
| `finding:0009`-`finding:0012` | `clang-tidy:bugprone-easily-swappable-parameters`, `main.cpp:131/143/171/207` | Same class of well-located function-signature findings; adequate as local static evidence. |

## S4-side improvements requested before broad scale

Priority order:

1. **Preserve analyzer diagnostic paths for path-sensitive tools.** For `gcc-fanalyzer` and scan-build/clang analyzer findings, include `diagnosticPath` or equivalent events with location, message, function, and variable/object when available. This would directly reduce UNKNOWNs like `finding:0016`-`finding:0018`.
2. **Populate `functionId` on findings when location falls inside known function ranges.** The bundle already has function surfaces, but exported findings currently have `functionId=null`. Attaching `func:*` would give S3/S5 a deterministic anchor for function-body/caller exploration.
3. **Add related locations / secondary ranges to findings.** Primary line alone is enough for reviewability, but analyzer-style findings often require origin/use/call-site ranges.
4. **Optionally expose cross-tool duplicate grouping.** `finding:0003`, `0013`, and `0014` are distinct tool observations for the same `exitLoop` pattern. This is acceptable, but grouping would improve downstream packet readability.

## Final S4 acceptance

S4 accepts this run as valid paper-smoke evidence with caveats. No S4 transport, async ownership, bundle completeness, hash integrity, or basic schema blocker was found.

The bundle is suitable for paper-smoke reporting as a bounded local static-evidence artifact. It should not be represented as complete security evidence, and the current artifact correctly says that.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
