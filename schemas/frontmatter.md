# Frontmatter Schema

All wiki pages should include YAML frontmatter.

## Required fields
- `title`
- `page_type`
- `canonical`
- `source_refs`
- `last_verified`
- `service_tags`
- `decision_tags`
- `related_pages`

## Canonical pages
Use for migrated source-of-truth content.

```yaml
---
title: "S4. SAST Runner 기능 명세 (v0.9.0)"
page_type: "canonical-spec"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/specs/sast-runner.md"
original_path: "docs/specs/sast-runner.md"
last_verified: "2026-04-05"
service_tags: ["s4"]
decision_tags: []
related_pages:
  - "../../context/services/s4-sast-runner.md"
migration_status: "canonicalized"
---
```

## Context pages
Use for synthesized agent-facing explanations.

```yaml
---
title: "Why the wiki is canonical"
page_type: "context-decision"
canonical: false
source_refs:
  - "../../canon/charter/aegis.md"
  - "../../../.omx/plans/prd-aegis-static-wiki.md"
last_verified: "2026-04-05"
service_tags: ["platform"]
decision_tags: ["canonicality", "migration"]
related_pages:
  - "../system/migration-map.md"
---
```
