#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DOCS = Path('/home/kosh/projects/AEGIS-codex-safety-20260403/docs')
REQUIRED_FILES = [
    '.obsidian/app.json',
    '.obsidian/core-plugins.json',
    'AGENTS.md',
    'Home.md',
    'README.md',
    'wiki/system/index.md',
    'wiki/system/log.md',
    'wiki/system/migration-map.md',
    'wiki/system/taxonomy.md',
    'schemas/frontmatter.md',
    'templates/source-summary.md',
    'templates/concept-page.md',
    'templates/context-page.md',
    'templates/history-page.md',
    'templates/detection-page.md',
    'wiki/context/decisions/canonical-wiki.md',
    'wiki/context/decisions/mcp-over-obsidian.md',
    'wiki/context/services/s4-sast-runner.md',
    'wiki/canon/charter/aegis.md',
]


def fail(message: str) -> None:
    print(f'FAIL: {message}')
    sys.exit(1)


def ensure_exists() -> None:
    missing = [path for path in REQUIRED_FILES if not (ROOT / path).exists()]
    if missing:
        fail(f'missing required files: {missing}')


def ensure_frontmatter(path: Path, canonical: bool) -> None:
    text = path.read_text(encoding='utf-8')
    if not text.startswith('---\n'):
        fail(f'{path} missing frontmatter')
    needle = 'canonical: true' if canonical else 'canonical: false'
    if needle not in text:
        fail(f'{path} missing {needle}')
    for field in ['page_type:', 'source_refs:', 'last_verified:', 'related_pages:']:
        if field not in text:
            fail(f'{path} missing {field}')


def expected_seed_targets() -> list[Path]:
    targets = [ROOT / 'wiki/canon/charter/aegis.md']
    targets.extend(ROOT / 'wiki/canon/specs' / path.name for path in sorted((SOURCE_DOCS / 'specs').glob('*.md')))
    targets.extend(ROOT / 'wiki/canon/api' / path.name for path in sorted((SOURCE_DOCS / 'api').glob('*.md')))
    return targets


def ensure_seed_coverage() -> None:
    expected = expected_seed_targets()
    missing = [str(path.relative_to(ROOT)) for path in expected if not path.exists()]
    if missing:
        fail(f'missing expected canonical seed pages: {missing}')

    actual = sorted(path for path in (ROOT / 'wiki/canon').rglob('*.md'))
    expected_set = {path.resolve() for path in expected}
    extras = [str(path.relative_to(ROOT)) for path in actual if path.resolve() not in expected_set]
    if extras:
        fail(f'unexpected canonical seed pages present: {extras}')


def ensure_migration_map() -> None:
    text = (ROOT / 'wiki/system/migration-map.md').read_text(encoding='utf-8')
    for needle in ['planned', 'mirrored', 'canonicalized', 'docs/AEGIS.md', 'docs/specs/technical-overview.md', 'docs/api/shared-models.md']:
        if needle not in text:
            fail(f'migration-map.md missing {needle}')


def main() -> None:
    ensure_exists()
    ensure_seed_coverage()
    ensure_frontmatter(ROOT / 'wiki/canon/charter/aegis.md', True)
    ensure_frontmatter(ROOT / 'wiki/context/decisions/canonical-wiki.md', False)
    ensure_frontmatter(ROOT / 'wiki/context/decisions/mcp-over-obsidian.md', False)
    ensure_migration_map()
    home_text = (ROOT / 'Home.md').read_text(encoding='utf-8')
    for needle in ['[[wiki/system/index]]', '[[wiki/system/migration-map]]', '[[wiki/context/decisions/canonical-wiki]]']:
        if needle not in home_text:
            fail(f'Home.md missing {needle}')
    print('PASS: wiki bootstrap structure and seed migration look valid')


if __name__ == '__main__':
    main()
