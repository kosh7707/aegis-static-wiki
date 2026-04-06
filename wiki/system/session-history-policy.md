---
title: "Session history policy"
page_type: "system-session-history-policy"
canonical: false
source_refs:
  - "../../AGENTS.md"
  - "./writing-guide.md"
last_verified: "2026-04-06"
service_tags: ["platform"]
decision_tags: ["session-history", "hook-policy"]
related_pages:
  - "./writing-guide.md"
  - "./test-evidence-policy.md"
---

# Session history policy

Every lane work session should produce durable wiki evidence.

## Required shape
- one session-history artifact per lane/session pair
- lane identifier
- session identifier
- status
- started/updated timestamps
- brief summary
- linked test evidence entries

## Preferred tooling surface
- `record_session_history`
- `append_test_evidence`

## Failure semantics
- retry first
- if retry still fails, notify the user
- continue the session without hard-blocking execution
