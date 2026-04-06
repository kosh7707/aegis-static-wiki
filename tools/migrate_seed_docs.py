#!/usr/bin/env python3
from __future__ import annotations

from datetime import date
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def resolve_source_docs() -> Path:
    candidates = [
        os.environ.get('SOURCE_DOCS_ROOT'),
        ROOT.parent / 'AEGIS' / 'docs',
        Path('/home/kosh/AEGIS/docs'),
        Path('/home/kosh/projects/AEGIS-codex-safety-20260403/docs'),
    ]
    for candidate in candidates:
        if not candidate:
            continue
        path = Path(candidate).expanduser().resolve()
        if path.exists():
            return path
    return Path(candidates[1]).expanduser().resolve()


SOURCE = resolve_source_docs()
TODAY = date.today().isoformat()

MAPPINGS = [
    ('AEGIS.md', 'wiki/canon/charter/aegis.md', 'charter'),
]
MAPPINGS += [(f'specs/{p.name}', f'wiki/canon/specs/{p.name}', 'spec') for p in sorted((SOURCE / 'specs').glob('*.md'))]
MAPPINGS += [(f'api/{p.name}', f'wiki/canon/api/{p.name}', 'api') for p in sorted((SOURCE / 'api').glob('*.md'))]


def extract_title(text: str, fallback: str) -> str:
    for line in text.splitlines():
        if line.startswith('# '):
            return line[2:].strip()
    return fallback


def infer_service_tags(source_rel: str) -> list[str]:
    tags = []
    lower = source_rel.lower()
    for needle, tag in [
        ('frontend', 's1'),
        ('backend', 's2'),
        ('analysis-agent', 's3'),
        ('build-agent', 's3'),
        ('sast-runner', 's4'),
        ('knowledge-base', 's5'),
        ('adapter', 's6'),
        ('ecu-simulator', 's6'),
        ('llm-gateway', 's7'),
        ('llm-engine', 's7'),
        ('aegis.md', 'platform'),
        ('technical-overview', 'platform'),
        ('shared-models', 'platform'),
        ('observability', 'platform'),
    ]:
        if needle in lower and tag not in tags:
            tags.append(tag)
    return tags


def render_frontmatter(title: str, page_type: str, source_rel: str, tags: list[str]) -> str:
    service_tags = '[' + ', '.join(f'"{t}"' for t in tags) + ']'
    return (
        '---\n'
        f'title: "{title.replace(chr(34), chr(39))}"\n'
        f'page_type: "{page_type}"\n'
        'canonical: true\n'
        'source_repo: "AEGIS"\n'
        f'source_refs:\n  - "docs/{source_rel}"\n'
        f'original_path: "docs/{source_rel}"\n'
        f'last_verified: "{TODAY}"\n'
        f'service_tags: {service_tags}\n'
        'decision_tags: []\n'
        'related_pages: []\n'
        'migration_status: "canonicalized"\n'
        '---\n\n'
    )


def main() -> None:
    for source_rel, target_rel, bucket in MAPPINGS:
        source_path = SOURCE / source_rel
        target_path = ROOT / target_rel
        target_path.parent.mkdir(parents=True, exist_ok=True)
        body = source_path.read_text(encoding='utf-8')
        title = extract_title(body, Path(source_rel).stem)
        target_path.write_text(render_frontmatter(title, f'canonical-{bucket}', source_rel, infer_service_tags(source_rel)) + body, encoding='utf-8')
        print(f'{source_rel} -> {target_rel}')


if __name__ == '__main__':
    main()
