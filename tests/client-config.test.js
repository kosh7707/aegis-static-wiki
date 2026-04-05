const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

test('project config exposes the MCP to local clients', () => {
  const mcpConfig = JSON.parse(fs.readFileSync(path.join(repoRoot, '.mcp.json'), 'utf8'));
  const claudeConfig = JSON.parse(fs.readFileSync(path.join(repoRoot, '.claude/settings.local.json'), 'utf8'));
  assert.ok(mcpConfig.mcpServers['aegis-static-wiki']);
  assert.equal(mcpConfig.mcpServers['aegis-static-wiki'].command, 'node');
  assert.deepEqual(mcpConfig.mcpServers['aegis-static-wiki'].args, ['tools/wiki/mcpServer.js']);
  assert.equal(claudeConfig.enableAllProjectMcpServers, true);
  assert.ok(claudeConfig.enabledMcpjsonServers.includes('aegis-static-wiki'));
});
