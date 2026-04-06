#!/usr/bin/env node
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const z = require('zod/v4');
const path = require('node:path');
const {
  appendLogEntry,
  getBacklinks,
  getMigrationTarget,
  getRecentChanges,
  listMyOpenWrs,
  listPages,
  recordMigrationTransition,
  recordSessionHistory,
  registerWorkRequest,
  rebuildIndex,
  searchPages,
  completeWorkRequest,
  appendTestEvidence,
  writePage,
  buildPageRecord,
  ROOT,
  INDEX_PATH,
  LOG_PATH,
  MIGRATION_MAP_PATH,
  WRITING_GUIDE_PATH
} = require('./lib');

const server = new McpServer({
  name: 'aegis-static-wiki',
  version: '1.0.0'
});

function textAndStructured(structuredContent, text) {
  return { content: [{ type: 'text', text }], structuredContent };
}

server.registerTool('list_pages', {
  description: 'List wiki pages by scope with metadata useful for agents.',
  inputSchema: {
    scope: z.enum(['all', 'canon', 'context', 'system']).optional(),
    canonical: z.boolean().nullable().optional(),
    search: z.string().optional()
  }
}, async ({ scope = 'all', canonical = null, search = '' }) => {
  const pages = listPages({ scope, canonical, search }).map((page) => ({
    path: page.relPath,
    title: page.title,
    pageType: page.pageType,
    canonical: page.canonical,
    summary: page.summary,
    serviceTags: page.serviceTags,
    lastVerified: page.lastVerified
  }));
  return textAndStructured({ pages }, JSON.stringify(pages, null, 2));
});

server.registerTool('read_page', {
  description: 'Read a wiki page with metadata and body.',
  inputSchema: {
    path: z.string()
  }
}, async ({ path: pagePath }) => {
  const normalized = pagePath.endsWith('.md') ? pagePath : `${pagePath}.md`;
  const page = buildPageRecord(path.join(ROOT, normalized));
  return textAndStructured({
    path: page.relPath,
    title: page.title,
    pageType: page.pageType,
    canonical: page.canonical,
    sourceRefs: page.sourceRefs,
    lastVerified: page.lastVerified,
    serviceTags: page.serviceTags,
    decisionTags: page.decisionTags,
    relatedPages: page.relatedPages,
    body: page.body
  }, page.body);
});

server.registerTool('search_pages', {
  description: 'Search wiki pages by query with canonical pages ranked first.',
  inputSchema: {
    query: z.string(),
    limit: z.number().int().min(1).max(50).optional()
  }
}, async ({ query, limit = 10 }) => {
  const matches = searchPages(query, limit).map((page) => ({
    path: page.relPath,
    title: page.title,
    score: page.score,
    canonical: page.canonical,
    summary: page.summary
  }));
  return textAndStructured({ matches }, JSON.stringify(matches, null, 2));
});

server.registerTool('get_backlinks', {
  description: 'Get wiki pages that link to a target page.',
  inputSchema: {
    path: z.string()
  }
}, async ({ path }) => {
  const backlinks = getBacklinks(path).map((page) => ({ path: page.relPath, title: page.title, pageType: page.pageType }));
  return textAndStructured({ backlinks }, JSON.stringify(backlinks, null, 2));
});

server.registerTool('get_recent_changes', {
  description: 'Read recent change entries from wiki/system/log.md.',
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional()
  }
}, async ({ limit = 10 }) => {
  const entries = getRecentChanges(limit);
  return textAndStructured({ entries }, JSON.stringify(entries, null, 2));
});

server.registerTool('get_migration_target', {
  description: 'Resolve an old docs path to its wiki migration row.',
  inputSchema: {
    old_path: z.string()
  }
}, async ({ old_path }) => {
  const row = getMigrationTarget(old_path);
  if (!row) return textAndStructured({ found: false }, `No migration target found for ${old_path}`);
  return textAndStructured({ found: true, row }, JSON.stringify(row, null, 2));
});

server.registerTool('write_page', {
  description: 'Typed page upsert for canonical/context/system writing-guide pages. Raw writes to index/log/migration-map are forbidden.',
  inputSchema: {
    path: z.string(),
    title: z.string(),
    page_type: z.string(),
    canonical: z.boolean(),
    source_refs: z.array(z.string()).optional(),
    service_tags: z.array(z.string()).optional(),
    decision_tags: z.array(z.string()).optional(),
    related_pages: z.array(z.string()).optional(),
    body: z.string(),
    last_verified: z.string().optional()
  }
}, async ({ path, title, page_type, canonical, source_refs = [], service_tags = ['platform'], decision_tags = [], related_pages = [], body, last_verified }) => {
  const page = writePage({
    relPath: path,
    title,
    pageType: page_type,
    canonical,
    sourceRefs: source_refs,
    serviceTags: service_tags,
    decisionTags: decision_tags,
    relatedPages: related_pages,
    body,
    lastVerified: last_verified
  });
  return textAndStructured({ path: page.relPath, title: page.title }, `Wrote ${page.relPath}`);
});

server.registerTool('append_log_entry', {
  description: 'Append a parseable entry to wiki/system/log.md.',
  inputSchema: {
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    event: z.string(),
    subject: z.string(),
    details: z.array(z.string()).optional()
  }
}, async ({ date, event, subject, details = [] }) => {
  const appended = appendLogEntry({ date, event, subject, details });
  return textAndStructured({ appended, path: 'wiki/system/log.md' }, appended ? `Appended log entry for ${subject}` : `Log entry already exists for ${subject}`);
});

server.registerTool('update_index', {
  description: 'Deterministically rebuild the full wiki/system/index.md catalog.',
  inputSchema: {}
}, async () => {
  const page = rebuildIndex();
  return textAndStructured({ path: page.relPath, title: page.title }, `Rebuilt ${page.relPath}`);
});

server.registerTool('record_migration_transition', {
  description: 'Update a migration-map status transition with validation.',
  inputSchema: {
    old_path: z.string(),
    status: z.enum(['planned', 'mirrored', 'canonicalized']),
    notes: z.string().optional()
  }
}, async ({ old_path, status, notes = '' }) => {
  const row = recordMigrationTransition({ oldPath: old_path, status, notes });
  return textAndStructured({ row }, `Updated migration status for ${old_path} to ${status}`);
});

server.registerTool('record_session_history', {
  description: 'Create or update a deterministic session-history artifact under wiki/canon/handoff/<lane>/session-*.md.',
  inputSchema: {
    lane: z.string(),
    session_id: z.string(),
    status: z.string().optional(),
    summary: z.string().optional(),
    started_at: z.string().optional(),
    updated_at: z.string().optional(),
    related_pages: z.array(z.string()).optional(),
    source_refs: z.array(z.string()).optional()
  }
}, async ({ lane, session_id, status = 'started', summary = '', started_at, updated_at, related_pages = [], source_refs = [] }) => {
  const page = recordSessionHistory({
    lane,
    sessionId: session_id,
    status,
    summary,
    startedAt: started_at,
    updatedAt: updated_at,
    relatedPages: related_pages,
    sourceRefs: source_refs
  });
  return textAndStructured({ path: page.relPath, title: page.title }, `Recorded session history at ${page.relPath}`);
});

server.registerTool('append_test_evidence', {
  description: 'Append test/verification evidence to a canonical handoff session artifact.',
  inputSchema: {
    lane: z.string(),
    session_id: z.string(),
    command: z.string(),
    status: z.string(),
    log_ref: z.string(),
    details: z.array(z.string()).optional()
  }
}, async ({ lane, session_id, command, status, log_ref, details = [] }) => {
  const page = appendTestEvidence({
    lane,
    sessionId: session_id,
    command,
    status,
    logRef: log_ref,
    details
  });
  return textAndStructured({ path: page.relPath, title: page.title }, `Appended test evidence to ${page.relPath}`);
});

server.registerTool('list_my_open_wrs', {
  description: 'List open work requests relevant to a specific lane, excluding WRs already completed by that lane.',
  inputSchema: {
    lane: z.string(),
    include_to_all: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).optional()
  }
}, async ({ lane, include_to_all = true, limit = 20 }) => {
  const wrs = listMyOpenWrs({ lane, includeToAll: include_to_all, limit });
  return textAndStructured({ wrs }, JSON.stringify(wrs, null, 2));
});

server.registerTool('register_wr', {
  description: 'Register a canonical work-request page using the single validated WR schema.',
  inputSchema: {
    wr_kind: z.enum(['request', 'reply', 'notice', 'question']),
    from_lane: z.string(),
    to_lanes: z.array(z.string()).min(1),
    title: z.string(),
    body: z.string(),
    related_pages: z.array(z.string()).optional(),
    service_tags: z.array(z.string()).optional(),
    decision_tags: z.array(z.string()).optional()
  }
}, async ({ wr_kind, from_lane, to_lanes, title, body, related_pages = [], service_tags = [], decision_tags = [] }) => {
  const page = registerWorkRequest({
    wrKind: wr_kind,
    fromLane: from_lane,
    toLanes: to_lanes,
    title,
    body,
    relatedPages: related_pages,
    serviceTags: service_tags,
    decisionTags: decision_tags
  });
  return textAndStructured({ path: page.relPath, title: page.title }, `Registered WR at ${page.relPath}`);
});

server.registerTool('complete_wr', {
  description: 'Mark a WR completed from the perspective of a recipient lane, preserving recipient-scoped completion metadata.',
  inputSchema: {
    path_or_id: z.string(),
    lane: z.string(),
    completion_note: z.string().optional()
  }
}, async ({ path_or_id, lane, completion_note = '' }) => {
  const page = completeWorkRequest({
    pathOrId: path_or_id,
    lane,
    completionNote: completion_note
  });
  return textAndStructured({ path: page.relPath, title: page.title, status: page.status, completionRecords: page.completionRecords }, `Completed WR recipient-side at ${page.relPath}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`AEGIS Static Wiki MCP running on stdio for ${ROOT}`);
  console.error(`Control files: ${INDEX_PATH}, ${LOG_PATH}, ${MIGRATION_MAP_PATH}, ${WRITING_GUIDE_PATH}`);
}

main().catch((error) => {
  console.error('MCP server error:', error);
  process.exit(1);
});
