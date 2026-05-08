---
title: "S3 Analysis Agent QG generalization principle"
page_type: "canonical-decision"
canonical: true
source_refs:
  - "gateway-webserver full-pipeline baseline 2026-05-08"
  - "/home/kosh/AEGIS/reports/gateway-webserver-full-pipeline-20260508-135919/summary.json"
last_verified: "2026-05-08"
service_tags: ["s3", "analysis-agent", "quality-gate"]
decision_tags: ["quality-gate", "generalization", "anti-overfit", "evidence-first", "command-injection"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/readme.md"]
---

# S3 Analysis Agent QG generalization principle

## Decision

S3 Analysis Agent Quality Gate work must improve the **general analysis system**, not special-case the gateway-webserver fixture.

The gateway-webserver `popen` miss is a regression signal and representative fixture only. It must not become a project-specific patch.

## Non-negotiable constraints

Do not implement Quality Gate or evidence-acquisition behavior that depends on:

- project name such as `gateway-webserver`, `RE100`, or `gateway-*`;
- specific source filename such as `http_client.cpp`;
- fixed line numbers or fixture paths;
- accepting every `popen`/`system` occurrence without source/sink/context evidence;
- lowering Quality Gate thresholds so hallucinated claims become accepted.

## Required direction

The target is a generic evidence-first analysis capability for command execution / shell construction / taint-risk patterns:

- dangerous sink evidence, e.g. `popen`, `system`, `exec*`, shell-spawn APIs;
- command/string construction evidence;
- source or caller-chain evidence where available;
- escaping/quoting/sanitization evidence;
- clear accepted vs nonAccepted/inconclusive lifecycle classification.

If evidence is insufficient, the agent should produce bounded nonAccepted diagnostics or inconclusive context, not fabricate an accepted claim.

## Test implication

Gateway-webserver may be a regression fixture, but it must be paired with generalized fixtures such as:

1. a generic positive command-injection/shell-construction case;
2. a benign constant-command or fully controlled/sanitized case;
3. an under-evidenced sink-only case that must remain nonAccepted/inconclusive;
4. an operational-missing-evidence case that must not be interpreted as negative security evidence.

## Rationale

Historical versions reportedly detected the gateway-webserver `popen` risk, while the 2026-05-08 baseline produced zero accepted and zero nonAccepted claims. That indicates a regression in candidate/evidence lifecycle or Quality Gate behavior, but the remediation must preserve AEGIS's goal: a reusable, project-agnostic Analysis Agent.
