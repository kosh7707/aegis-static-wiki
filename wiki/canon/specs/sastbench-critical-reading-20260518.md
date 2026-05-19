---
title: "SastBench critical reading note — 2026-05-18"
page_type: "research-note"
canonical: true
last_verified: "2026-05-18"
service_tags: ["s3", "paper-pipeline", "traceaudit", "related-work"]
decision_tags: ["sastbench", "critical-reading", "citation-policy", "paper-anchor"]
related_pages: ["wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md"]
---

# SastBench critical reading note — 2026-05-18

## Bottom line

Do not use SastBench as a methodological anchor for AEGIS TraceAudit. At most, cite it cautiously as a nearby preprint showing that agentic SAST triage is becoming crowded. AEGIS should not inherit its task formulation, metric framing, or benchmark-validity claims.


## Direct PDF verification

Checked against local PDF `/tmp/SastBench A Benchmark for Testing Agentic SAST Triage.pdf` on 2026-05-18. The critique above is supported by the paper text:

- The task is explicitly binary: the agent must return `true_positive` or `false_positive`.
- True positives are mined from CVE/NVD/CVEFixes-style provenance.
- False positives are generated from Semgrep free-edition findings and filtered by heuristics.
- The dataset is heavily imbalanced: 299 TP vs 2438 FP.
- The experiment table ranks model/agent combinations by MCC and emphasizes stronger models / better prompts.
- The paper itself reports that Gemini without tools is nearly on par with simple ReAct on aggregate metrics and has higher recall.

Conclusion after direct reading: the AEGIS citation policy remains correct. SastBench is useful as a contrast case, not as an anchor.

## Main concerns

- **Unclear paper identity**: the paper presents itself as an agent-agnostic benchmark, but much of the work is dataset curation. It does not deeply justify either the evaluation interface or the data construction method.
- **Binary task formulation**: forcing TP/FP ignores UNKNOWN/inconclusive, exploitability uncertainty, missing runtime context, and responsible abstention. This is the opposite of AEGIS's UNKNOWN-aware contract.
- **Weak FP approximation**: false positives are approximated through SAST-tool output plus heuristic filtering, but distribution realism is not quantitatively validated.
- **TP trust problem**: CVE-linked examples are treated as true positives, but CVE provenance has reporting bias and root-cause localization risk unless manually verified.
- **SAST tool abstraction is too coarse**: tool families, alert formats, severity taxonomies, taint/dataflow differences, and commercial-vs-OSS behavior are not normalized deeply enough.
- **Self-serving comparison table risk**: criteria appear designed around the authors' own benchmark choices; definitions and pass thresholds are unclear.
- **Metric mismatch**: precision/recall are emphasized without enough operating-point, base-rate, or asymmetric-cost treatment. For SAST triage, unsafe suppression of real vulnerabilities is more severe than retaining false positives for review.
- **Agent/prompt confounding**: “improved” agent results appear prompt-driven rather than architecture-driven; prompt construction methodology is not reproducible enough.
- **No-tools baseline implication**: if a no-tool/CoT-only baseline is near simple agentic methods, the marginal value of agent architecture is uncertain and should not be glossed over.
- **Commercial narrative risk**: stronger-model and prompt-engineering conclusions align with product narrative; use reported conclusions cautiously.

## AEGIS citation policy

Use SastBench only for contrast, not support:

```text
Allowed:
  - cite as evidence that SAST triage benchmarks are emerging;
  - cite as a nearby binary agent-output benchmark that AEGIS intentionally differs from;
  - mention limitations when explaining why AEGIS uses UNKNOWN, evidence ledgers, reviewer audit, and safety metrics.

Avoid:
  - using its conclusions as evidence that a specific model/agent is best;
  - using its FP distribution claim without independent source validation;
  - importing its binary TP/FP formulation;
  - relying on its table/metrics as benchmark-validity proof.
```

## AEGIS design implications

- Keep AEGIS framed as trace-auditable decision workflow, not classifier leaderboard.
- Preserve UNKNOWN as a first-class output and score abstention explicitly.
- Keep B2 vs B4 as packet-form comparison over the same evidence rows.
- Report unsafe suppression separately from aggregate accuracy.
- Require base-rate and denominator disclosure for Audit120/TriageQ.
- Treat raw-model or alternative-model runs as secondary/reference only.
- If SastBench appears in Related Work, write it as a contrast: binary agentic SAST triage benchmark vs AEGIS reviewer-auditable evidence-ledger workflow.

## Reusable but must be independently sourced

The following motivation chain may be useful, but should be supported by primary sources rather than this paper's broad claims:

- SAST tools produce high false-positive/noise burden.
- Human triage is costly and error-prone.
- Fixed-warning triage is often a more bounded problem than repository-wide vulnerability discovery.
