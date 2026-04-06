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
});

test('canonical wiki now covers the full source docs corpus', () => {
  const migrationRows = parseMigrationRows().filter((row) => row.status === 'canonicalized');
  const canonDocs = listMarkdownFiles(path.join(repoRoot, 'wiki/canon'));
  assert.equal(canonDocs.length, migrationRows.length, 'canonical wiki should cover every canonicalized migration-map row');
});

test('source repo docs are reduced to the bootstrap residual surface', () => {
  assert.equal(fs.existsSync(sourceDocsRoot), true, `source docs root should exist: ${sourceDocsRoot}`);
  const sourceDocs = listMarkdownFiles(sourceDocsRoot)
    .filter((file) => !file.endsWith('.gitkeep'))
    .map((file) => path.relative(sourceDocsRoot, file).replace(/\\/g, '/'));
  const disallowed = sourceDocs.filter((rel) => rel !== 'AEGIS.md' && !rel.startsWith('work-requests/'));
  assert.deepEqual(disallowed, [], 'source docs should only retain AEGIS.md plus work-requests markdown');
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
