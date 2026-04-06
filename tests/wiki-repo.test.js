const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const sourceDocsCandidates = [
  process.env.SOURCE_DOCS_ROOT,
  path.join(repoRoot, '..', 'AEGIS', 'docs'),
  '/home/kosh/AEGIS/docs',
  '/home/kosh/projects/AEGIS-codex-safety-20260403/docs'
].filter(Boolean).map((candidate) => path.resolve(candidate));
const sourceDocsRoot = sourceDocsCandidates.find((candidate) => fs.existsSync(candidate)) || sourceDocsCandidates[0];
const migrationMapPath = path.join(repoRoot, 'wiki/system/migration-map.md');

function parseMigrationRows() {
  const text = fs.readFileSync(migrationMapPath, 'utf8');
  const rows = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith('|') || line.startsWith('| old path |') || line.startsWith('|---|')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 5) continue;
    rows.push({
      oldPath: cells[0],
      newPath: cells[1],
      bucket: cells[2],
      status: cells[3],
      notes: cells[4]
    });
  }
  return rows;
}

function listMarkdownFiles(dirPath) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      entry.name !== '.gitkeep' &&
      !(fullPath === path.join(sourceDocsRoot, 'README.md'))
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/');
}

test('all remaining buckets are migrated and no planned rows remain', () => {
  const text = fs.readFileSync(migrationMapPath, 'utf8');
  assert.equal(text.includes('| planned |'), false, 'migration-map should not contain planned rows after this phase');
  for (const expected of [
    'docs/s1-handoff/README.md',
    'docs/s7-handoff/roadmap.md',
    'docs/work-requests/s2-to-all-omx-memory-discipline.md',
    'docs/외부피드백/S3_agentic_sast_design_feedback.md'
  ]) {
    assert.match(text, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const expected of [
    '| docs/work-requests/s2-to-all-omx-memory-discipline.md | wiki/canon/work-requests/s2-to-all-omx-memory-discipline.md | work-requests | mirrored | archived under docs/work-requests; excluded from runtime canonical WR model |',
    '| docs/work-requests/s4-to-s2-build-path-boundary-inversion-notice.md | wiki/canon/work-requests/s4-to-s2-build-path-boundary-inversion-notice.md | work-requests | mirrored | archived under docs/work-requests; excluded from runtime canonical WR model |'
  ]) {
    assert.match(text, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('canonical wiki now covers the full source docs corpus', () => {
  const migrationRows = parseMigrationRows().filter((row) => row.status === 'canonicalized' && row.bucket !== 'work-requests');
  const canonDocs = new Set(listMarkdownFiles(path.join(repoRoot, 'wiki/canon')).map(toRepoRelative));
  const missing = migrationRows.map((row) => row.newPath).filter((relPath) => !canonDocs.has(relPath));
  assert.deepEqual(missing, [], 'canonical wiki should contain every canonicalized non-WR migration-map row');
});

test('legacy WR migration rows stay mirrored and out of canonical corpus coverage', () => {
  const workRequestRows = parseMigrationRows().filter((row) => row.bucket === 'work-requests');
  assert.equal(workRequestRows.length > 0, true);
  for (const row of workRequestRows) {
    assert.equal(row.status, 'mirrored');
    assert.match(row.notes, /archived under docs\/work-requests|runtime canonical WR model/i);
  }
});

test('source repo docs are reduced to the bootstrap residual surface', () => {
  assert.equal(fs.existsSync(sourceDocsRoot), true, `source docs root should exist: ${sourceDocsRoot}`);
  const sourceDocs = listMarkdownFiles(sourceDocsRoot)
    .filter((file) => !file.endsWith('.gitkeep'))
    .map((file) => path.relative(sourceDocsRoot, file).replace(/\\/g, '/'));
  const disallowed = sourceDocs.filter((rel) => !['AEGIS.md', 'mcp.md'].includes(rel) && !rel.startsWith('work-requests/'));
  assert.deepEqual(disallowed, [], 'source docs should only retain AEGIS.md, mcp.md, plus work-requests markdown');
});

test('archived docs work-requests are intentionally retained outside the canonical corpus', () => {
  const archivedRoot = path.join(sourceDocsRoot, 'work-requests');
  assert.equal(fs.existsSync(archivedRoot), true, 'archived docs/work-requests should exist');
  const archivedDocs = listMarkdownFiles(archivedRoot).map((file) => path.relative(sourceDocsRoot, file).replace(/\\/g, '/'));
  assert.equal(archivedDocs.length > 0, true, 'archived docs/work-requests should retain markdown files');
});

test('authoritative control files exist', () => {
  for (const relPath of [
    'wiki/system/index.md',
    'wiki/system/log.md',
    'wiki/system/writing-guide.md',
    'wiki/system/work-request-policy.md',
    'wiki/system/session-history-policy.md',
    'wiki/system/test-evidence-policy.md',
    '.mcp.json',
    '.claude/settings.local.json'
  ]) {
    assert.equal(fs.existsSync(path.join(repoRoot, relPath)), true, `${relPath} should exist`);
  }
});
