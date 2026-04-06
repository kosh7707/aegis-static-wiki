#!/usr/bin/env python3
from __future__ import annotations

import os
from pathlib import Path
import sys

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


SOURCE_DOCS = resolve_source_docs()
REQUIRED_FILES = [
    '.mcp.json',
    '.claude/settings.local.json',
    'AGENTS.md',
    'README.md',
    'Home.md',
    'package.json',
    'wiki/system/index.md',
    'wiki/system/log.md',
    'wiki/system/migration-map.md',
    'wiki/system/taxonomy.md',
    'wiki/system/writing-guide.md',
    'wiki/system/work-request-policy.md',
    'wiki/system/session-history-policy.md',
    'wiki/system/test-evidence-policy.md',
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
    'tools/wiki/lib.js',
    'tools/wiki/mcpServer.js',
    'tools/wiki/migrateRemaining.js',
    'tests/wiki-repo.test.js',
    'tests/wiki-mcp.test.js',
    'tests/client-config.test.js',
]


def fail(message: str) -> None:
    print(f'FAIL: {message}')
    sys.exit(1)


def ensure_exists() -> None:
    missing = [item for item in REQUIRED_FILES if not (ROOT / item).exists()]
    if missing:
        fail(f'missing required files: {missing}')


def list_markdown_files(dir_path: Path) -> list[Path]:
    if not dir_path.exists():
        return []
    return sorted(
        path
        for path in dir_path.rglob('*.md')
        if path.name != '.gitkeep'
        and not (path.parent == dir_path and path.name == 'README.md')
    )


def parse_migration_rows() -> list[dict[str, str]]:
    text = (ROOT / 'wiki/system/migration-map.md').read_text(encoding='utf-8')
    rows: list[dict[str, str]] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line.startswith('|') or line.startswith('| old path |') or line.startswith('|---|'):
            continue
        cells = [cell.strip() for cell in line.split('|')[1:-1]]
        if len(cells) < 5:
            continue
        rows.append({
            'old_path': cells[0],
            'new_path': cells[1],
            'bucket': cells[2],
            'status': cells[3],
            'notes': cells[4],
        })
    return rows


def ensure_corpus_coverage() -> None:
    migration_rows = [row for row in parse_migration_rows() if row['status'] == 'canonicalized']
    canon_docs = list_markdown_files(ROOT / 'wiki' / 'canon')
    if len(canon_docs) != len(migration_rows):
        fail(f'canonical corpus count mismatch: {len(canon_docs)} != {len(migration_rows)}')


def ensure_residual_source_surface() -> None:
    if not SOURCE_DOCS.exists():
        return
    source_docs = [path.relative_to(SOURCE_DOCS).as_posix() for path in list_markdown_files(SOURCE_DOCS)]
    disallowed = [
        rel for rel in source_docs
        if rel != 'AEGIS.md' and not rel.startswith('work-requests/')
    ]
    if disallowed:
        fail(f'source docs residual surface contains unexpected markdown files: {disallowed[:10]}')


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


def ensure_migration_map() -> None:
    text = (ROOT / 'wiki/system/migration-map.md').read_text(encoding='utf-8')
    if '| planned |' in text:
        fail('migration-map.md still contains planned entries')
    for needle in [
        'canonicalized',
        'docs/s1-handoff/README.md',
        'docs/work-requests/s2-to-all-omx-memory-discipline.md',
        'docs/외부피드백/S3_agentic_sast_design_feedback.md',
    ]:
        if needle not in text:
            fail(f'migration-map.md missing {needle}')


def ensure_control_files() -> None:
    index_text = (ROOT / 'wiki/system/index.md').read_text(encoding='utf-8')
    log_text = (ROOT / 'wiki/system/log.md').read_text(encoding='utf-8')
    guide_text = (ROOT / 'wiki/system/writing-guide.md').read_text(encoding='utf-8')
    for needle in ['## Platform charter', '## Handoff', '## Work requests', '## Feedback']:
        if needle not in index_text:
            fail(f'index.md missing {needle}')
    for needle in ['## [2026-04-05] migration | handoff bucket', '## [2026-04-05] migration | feedback bucket']:
        if needle not in log_text:
            fail(f'log.md missing {needle}')
    for needle in ['typed MCP operations', 'append_log_entry', 'update_index', 'record_migration_transition', 'record_session_history', 'append_test_evidence']:
        if needle not in guide_text:
            fail(f'writing-guide.md missing {needle}')


def main() -> None:
    ensure_exists()
    ensure_corpus_coverage()
    ensure_residual_source_surface()
    ensure_frontmatter(ROOT / 'wiki/canon/charter/aegis.md', True)
    ensure_frontmatter(ROOT / 'wiki/context/decisions/canonical-wiki.md', False)
    ensure_frontmatter(ROOT / 'wiki/system/writing-guide.md', False)
    ensure_migration_map()
    ensure_control_files()
    print('PASS: wiki next-phase migration, control files, and MCP scaffolding look valid')


if __name__ == '__main__':
    main()
