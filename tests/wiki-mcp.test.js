const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

function write(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, 'utf8');
}

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aegis-static-wiki-'));
  const docsRoot = path.join(root, 'source-docs');
  write(path.join(root, 'wiki/system/migration-map.md'), `---\ntitle: "Migration map"\npage_type: "system-migration-map"\ncanonical: false\nsource_refs: []\nlast_verified: "2026-04-05"\nservice_tags: ["platform"]\ndecision_tags: ["migration"]\nrelated_pages: []\n---\n\n# Migration Map\n\n| old path | new path | bucket | status | notes |\n|---|---|---|---|---|\n| docs/s1-handoff/README.md | wiki/canon/handoff/s1/readme.md | handoff | planned | fixture |\n`);
  write(path.join(root, 'wiki/system/log.md'), `---\ntitle: "AEGIS static wiki log"\npage_type: "system-log"\ncanonical: false\nsource_refs: []\nlast_verified: "2026-04-05"\nservice_tags: ["platform"]\ndecision_tags: ["log"]\nrelated_pages: []\n---\n\n# Log\n`);
  write(path.join(root, 'wiki/system/index.md'), `---\ntitle: "AEGIS static wiki index"\npage_type: "system-index"\ncanonical: false\nsource_refs: []\nlast_verified: "2026-04-05"\nservice_tags: ["platform"]\ndecision_tags: ["index"]\nrelated_pages: []\n---\n\n# AEGIS Static Wiki Index\n`);
  write(path.join(root, 'wiki/system/writing-guide.md'), `---\ntitle: "Guide"\npage_type: "system-writing-guide"\ncanonical: false\nsource_refs: []\nlast_verified: "2026-04-05"\nservice_tags: ["platform"]\ndecision_tags: []\nrelated_pages: []\n---\n\n# Guide\n`);
  write(path.join(root, 'wiki/canon/charter/aegis.md'), `---\ntitle: "AEGIS"\npage_type: "canonical-charter"\ncanonical: true\nsource_refs:\n  - "docs/AEGIS.md"\nlast_verified: "2026-04-05"\nservice_tags: ["platform"]\ndecision_tags: []\nrelated_pages: []\n---\n\n# AEGIS\n\nPlatform charter fixture.\n`);
  write(path.join(root, 'Home.md'), `---\ntitle: "Home"\npage_type: "system-home"\ncanonical: false\nsource_refs: []\nlast_verified: "2026-04-05"\nservice_tags: ["platform"]\ndecision_tags: []\nrelated_pages: []\n---\n\n# Home\n\n[[wiki/canon/charter/aegis]]\n`);
  write(path.join(docsRoot, 's1-handoff/README.md'), '# S1 README\n\nFixture handoff.\n');
  return { root, docsRoot };
}

test('MCP server exposes typed read/write wiki operations', async () => {
  const { root, docsRoot } = createFixture();
  const client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['tools/wiki/mcpServer.js'],
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, WIKI_ROOT: root, SOURCE_DOCS_ROOT: docsRoot },
    stderr: 'pipe'
  });

  try {
    await client.connect(transport);

    const tools = await client.listTools();
    const toolNames = tools.tools.map((tool) => tool.name);
    for (const name of ['list_pages', 'read_page', 'search_pages', 'get_backlinks', 'get_recent_changes', 'get_migration_target', 'write_page', 'append_log_entry', 'update_index', 'record_migration_transition']) {
      assert.equal(toolNames.includes(name), true, `${name} should be registered`);
    }

    const listResult = await client.callTool({ name: 'list_pages', arguments: { scope: 'canon' } });
    assert.equal(listResult.structuredContent.pages.length >= 1, true);

    await client.callTool({
      name: 'write_page',
      arguments: {
        path: 'wiki/context/services/example.md',
        title: 'Example service context',
        page_type: 'context-service',
        canonical: false,
        source_refs: ['wiki/canon/charter/aegis.md'],
        service_tags: ['platform'],
        decision_tags: ['example'],
        related_pages: ['wiki/canon/charter/aegis.md'],
        body: '# Example\n\nLinks to [[wiki/canon/charter/aegis]].'
      }
    });

    const backlinkResult = await client.callTool({ name: 'get_backlinks', arguments: { path: 'wiki/canon/charter/aegis.md' } });
    assert.equal(backlinkResult.structuredContent.backlinks.some((entry) => entry.path === 'wiki/context/services/example.md'), true);

    await client.callTool({ name: 'append_log_entry', arguments: { date: '2026-04-05', event: 'mcp', subject: 'fixture write', details: ['updated via test'] } });
    const recentChanges = await client.callTool({ name: 'get_recent_changes', arguments: { limit: 5 } });
    assert.equal(recentChanges.structuredContent.entries[0].subject, 'fixture write');

    await client.callTool({ name: 'record_migration_transition', arguments: { old_path: 'docs/s1-handoff/README.md', status: 'canonicalized', notes: 'fixture canonicalized' } });
    const migrationRow = await client.callTool({ name: 'get_migration_target', arguments: { old_path: 'docs/s1-handoff/README.md' } });
    assert.equal(migrationRow.structuredContent.row.status, 'canonicalized');

    const badTransition = await client.callTool({ name: 'record_migration_transition', arguments: { old_path: 'docs/s1-handoff/README.md', status: 'planned' } });
    assert.equal(badTransition.isError, true);

    const badWrite = await client.callTool({
      name: 'write_page',
      arguments: {
        path: 'wiki/system/index.md',
        title: 'Invalid',
        page_type: 'system-index',
        canonical: false,
        body: '# Invalid'
      }
    });
    assert.equal(badWrite.isError, true);

    await client.callTool({ name: 'update_index', arguments: {} });
    const indexText = fs.readFileSync(path.join(root, 'wiki/system/index.md'), 'utf8');
    assert.match(indexText, /Example service context/);
    assert.match(indexText, /Platform charter/);
  } finally {
    await transport.close().catch(() => {});
  }
});
