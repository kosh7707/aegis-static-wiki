---
title: "Test evidence policy"
page_type: "system-test-evidence-policy"
canonical: false
source_refs:
  - "../../AGENTS.md"
  - "./writing-guide.md"
last_verified: "2026-04-06"
service_tags: ["platform"]
decision_tags: ["test-evidence", "verification"]
related_pages:
  - "./writing-guide.md"
  - "./session-history-policy.md"
---

# Test evidence policy

Test and verification activity should be attached to session-history artifacts.

## Minimum fields
- command
- pass/fail status
- log reference or artifact link
- optional detail bullets

## Current expectation
Until a stronger hook runtime exists, wiki-maintenance tools should provide a deterministic path for recording:
- lane session start
- test evidence append events

The absence of a future hook runtime must not block the policy surface from existing now.
