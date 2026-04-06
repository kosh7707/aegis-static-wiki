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
  assert.equal(fs.existsSync(sourceDocsRoot), true, `source docs root should exist: ${sourceDocsRoot}`);
  const sourceDocs = listMarkdownFiles(sourceDocsRoot).filter((file) => !file.endsWith('.gitkeep'));
  const canonDocs = listMarkdownFiles(path.join(repoRoot, 'wiki/canon'));
  assert.equal(canonDocs.length, sourceDocs.length, 'canonical wiki should cover every markdown doc from source docs');
});

test('authoritative control files exist', () => {
  for (const relPath of [
    'wiki/system/index.md',
    'wiki/system/log.md',
    'wiki/system/writing-guide.md',
    '.mcp.json',
    '.claude/settings.local.json'
  ]) {
    assert.equal(fs.existsSync(path.join(repoRoot, relPath)), true, `${relPath} should exist`);
  }
});
