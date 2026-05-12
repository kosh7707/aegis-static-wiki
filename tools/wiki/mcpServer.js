#!/usr/bin/env node
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const z = require('zod/v4');
const fs = require('node:fs');
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
  const safeText = typeof text === 'string' ? text : String(text);
  const trimmed = safeText.trim();
  const needsClaudeTurnWorkaround =
    trimmed === '[]' ||
    trimmed === '{}' ||
    (trimmed.length > 0 && trimmed.length < 8);
  const contentText = needsClaudeTurnWorkaround
    ? `Result (raw JSON follows):\n${safeText}`
    : safeText;
  return { content: [{ type: 'text', text: contentText }], structuredContent };
}

/* ------------------------------------------------------------------ */
/*  Error handling infrastructure                                      */
/* ------------------------------------------------------------------ */

function errorResult(message) {
  return { content: [{ type: 'text', text: message }], isError: true };
}

function suggestWikiPrefix(pagePath) {
  const normalized = pagePath.endsWith('.md') ? pagePath : `${pagePath}.md`;
  if (!normalized.startsWith('wiki/')) {
    const withPrefix = path.join(ROOT, 'wiki', normalized);
    if (fs.existsSync(withPrefix)) {
      return `wiki/ prefix가 빠진 것 같습니다. 다음 경로를 사용하세요: wiki/${normalized}`;
    }
  }
  return null;
}

function findSimilarPages(pagePath) {
  const basename = path.basename(pagePath, '.md');
  if (!basename) return null;
  try {
    const matches = searchPages(basename, 5);
    if (matches.length > 0) {
      return '비슷한 페이지:\n' + matches.map((m) => `  - ${m.relPath} ("${m.title}")`).join('\n');
    }
  } catch { /* ignore search failures */ }
  return null;
}

function diagnoseError(toolName, args, err) {
  const msg = err.message || '';

  // ── ENOENT / file not found ──
  if (msg.includes('ENOENT') || msg.includes('no such file')) {
    if (toolName === 'read_page' || toolName === 'get_backlinks') {
      const target = args.path || '';
      const hints = [];
      const prefixHint = suggestWikiPrefix(target);
      if (prefixHint) {
        hints.push(prefixHint);
      } else if (target.startsWith('wiki/')) {
        hints.push(`페이지를 찾을 수 없습니다: ${target}`);
      } else {
        hints.push(
          `페이지를 찾을 수 없습니다: ${target}`,
          '경로는 wiki/ prefix로 시작해야 합니다 (예: wiki/canon/handoff/s1/readme.md).'
        );
      }
      const similar = findSimilarPages(target);
      if (similar) hints.push(similar);
      hints.push('search_pages 도구로 검색해볼 수도 있습니다.');
      return hints.join('\n');
    }
    if (toolName === 'record_session_history' || toolName === 'append_test_evidence') {
      return `lane="${args.lane}", session_id="${args.session_id}" 조합에 해당하는 세션 파일 경로를 확인하세요.`;
    }
    return `파일을 찾을 수 없습니다. 경로를 확인하세요: ${JSON.stringify(args)}`;
  }

  // ── write_page validation ──
  if (toolName === 'write_page') {
    if (msg.includes('typed maintenance operations')) {
      return [
        `${args.path}는 시스템 관리 파일이라 write_page로 직접 쓸 수 없습니다.`,
        '전용 도구를 사용하세요:',
        '  - wiki/system/index.md      -> update_index',
        '  - wiki/system/log.md        -> append_log_entry',
        '  - wiki/system/migration-map.md -> record_migration_transition'
      ].join('\n');
    }
    if (msg.includes('Canonical pages must live under wiki/canon/')) {
      return `canonical=true 페이지는 wiki/canon/** 아래에만 쓸 수 있습니다.\n입력된 경로: ${args.path}`;
    }
    if (msg.includes('Non-canonical writes must target')) {
      return [
        'canonical=false 페이지가 쓸 수 있는 경로:',
        '  - wiki/context/**',
        '  - wiki/system/writing-guide.md',
        '  - Home.md',
        `입력된 경로: ${args.path}`
      ].join('\n');
    }
    if (msg.includes('canonical pages require sourceRefs')) {
      return 'canonical=true 페이지에는 source_refs가 필수입니다.\n예: source_refs: ["mcp://write_page"] 또는 원본 문서 경로를 지정하세요.';
    }
    if (msg.includes('title, pageType, and canonical are required')) {
      return '필수 파라미터: title(string), page_type(string), canonical(boolean) — 모두 제공해야 합니다.';
    }
  }

  // ── register_wr validation ──
  if (toolName === 'register_wr') {
    if (msg.includes('Unsupported wr_kind')) {
      return `지원되는 wr_kind: request, reply, notice, question\n입력값: "${args.wr_kind}"`;
    }
    if (msg.includes('from_lane is required')) {
      return 'from_lane은 필수입니다. 유효한 lane: s1, s2, s3, s4, s5, s6, s7';
    }
    if (msg.includes('to_lanes is required')) {
      return 'to_lanes는 1개 이상의 lane을 포함해야 합니다. 예: ["s2"] 또는 ["s2", "s3"]';
    }
    if (msg.includes('title is required')) {
      return 'WR 제목(title)이 비어있습니다. 요청 내용을 요약하는 제목을 작성하세요.';
    }
    if (msg.includes('body is required')) {
      return 'WR 본문(body)이 비어있습니다. 요청 내용, 배경, 기대 결과를 작성하세요.';
    }
  }

  // ── complete_wr errors ──
  if (toolName === 'complete_wr') {
    if (msg.includes('No WR found for')) {
      return [
        `WR을 찾을 수 없습니다: "${args.path_or_id}"`,
        '지정 방법:',
        '  - 전체 경로: wiki/canon/work-requests/파일명.md',
        '  - WR ID: 파일명에서 .md를 뺀 값',
        'list_my_open_wrs 도구로 열린 WR 목록을 확인하세요.'
      ].join('\n');
    }
    if (msg.includes('is not allowed to complete')) {
      return [
        `lane "${args.lane}"은(는) 이 WR의 수신자가 아닙니다.`,
        'WR의 to_lanes 필드를 확인하세요. 수신 lane만 complete할 수 있습니다.'
      ].join('\n');
    }
  }

  // ── record_migration_transition errors ──
  if (toolName === 'record_migration_transition') {
    if (msg.includes('No migration map row found')) {
      return [
        `마이그레이션 맵에 해당 경로가 없습니다: "${args.old_path}"`,
        'get_migration_target 도구로 경로가 존재하는지 먼저 확인하세요.'
      ].join('\n');
    }
    if (msg.includes('Invalid migration transition')) {
      return [
        '허용되는 상태 전이:',
        '  planned -> mirrored -> canonicalized',
        '역방향 전이는 불가합니다.',
        `요청한 전이: ${msg.match(/: (.+)/)?.[1] || '알 수 없음'}`
      ].join('\n');
    }
  }

  // ── migration-map table missing ──
  if (msg.includes('migration-map table missing')) {
    return 'wiki/system/migration-map.md 파일에 마이그레이션 테이블이 없습니다. 파일 형식을 확인하세요.';
  }

  return null;
}

function safeHandler(toolName, fn) {
  return async (args) => {
    try {
      return await fn(args);
    } catch (err) {
      const hint = diagnoseError(toolName, args, err);
      const parts = [`[${toolName}] Error: ${err.message}`];
      if (hint) parts.push('', hint);
      return errorResult(parts.join('\n'));
    }
  };
}

/* ------------------------------------------------------------------ */
/*  Tool registrations                                                 */
/* ------------------------------------------------------------------ */

server.registerTool('list_pages', {
  description: 'List wiki pages by scope with metadata useful for agents.',
  inputSchema: {
    scope: z.enum(['all', 'canon', 'context', 'system']).optional(),
    canonical: z.boolean().nullable().optional(),
    search: z.string().optional()
  }
}, safeHandler('list_pages', async ({ scope = 'all', canonical = null, search = '' }) => {
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
}));

server.registerTool('read_page', {
  description: 'Read a wiki page with metadata and body.',
  inputSchema: {
    path: z.string()
  }
}, safeHandler('read_page', async ({ path: pagePath }) => {
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
}));

server.registerTool('search_pages', {
  description: 'Search wiki pages by query with canonical pages ranked first.',
  inputSchema: {
    query: z.string(),
    limit: z.number().int().min(1).max(50).optional()
  }
}, safeHandler('search_pages', async ({ query, limit = 10 }) => {
  const matches = searchPages(query, limit).map((page) => ({
    path: page.relPath,
    title: page.title,
    score: page.score,
    canonical: page.canonical,
    summary: page.summary
  }));
  return textAndStructured({ matches }, JSON.stringify(matches, null, 2));
}));

server.registerTool('get_backlinks', {
  description: 'Get wiki pages that link to a target page.',
  inputSchema: {
    path: z.string()
  }
}, safeHandler('get_backlinks', async ({ path }) => {
  const backlinks = getBacklinks(path).map((page) => ({ path: page.relPath, title: page.title, pageType: page.pageType }));
  return textAndStructured({ backlinks }, JSON.stringify(backlinks, null, 2));
}));

server.registerTool('get_recent_changes', {
  description: 'Read recent change entries from wiki/system/log.md.',
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional()
  }
}, safeHandler('get_recent_changes', async ({ limit = 10 }) => {
  const entries = getRecentChanges(limit);
  return textAndStructured({ entries }, JSON.stringify(entries, null, 2));
}));

server.registerTool('get_migration_target', {
  description: 'Resolve an old docs path to its wiki migration row.',
  inputSchema: {
    old_path: z.string()
  }
}, safeHandler('get_migration_target', async ({ old_path }) => {
  const row = getMigrationTarget(old_path);
  if (!row) return textAndStructured({ found: false }, `No migration target found for "${old_path}". 정확한 old path를 확인하세요 (예: docs/specs/llm-gateway.md).`);
  return textAndStructured({ found: true, row }, JSON.stringify(row, null, 2));
}));

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
}, safeHandler('write_page', async ({ path, title, page_type, canonical, source_refs = [], service_tags = ['platform'], decision_tags = [], related_pages = [], body, last_verified }) => {
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
}));

server.registerTool('append_log_entry', {
  description: 'Append a parseable entry to wiki/system/log.md.',
  inputSchema: {
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    event: z.string(),
    subject: z.string(),
    details: z.array(z.string()).optional()
  }
}, safeHandler('append_log_entry', async ({ date, event, subject, details = [] }) => {
  const appended = appendLogEntry({ date, event, subject, details });
  return textAndStructured({ appended, path: 'wiki/system/log.md' }, appended ? `Appended log entry for ${subject}` : `Log entry already exists for ${subject}`);
}));

server.registerTool('update_index', {
  description: 'Deterministically rebuild the full wiki/system/index.md catalog.',
  inputSchema: {}
}, safeHandler('update_index', async () => {
  const page = rebuildIndex();
  return textAndStructured({ path: page.relPath, title: page.title }, `Rebuilt ${page.relPath}`);
}));

server.registerTool('record_migration_transition', {
  description: 'Update a migration-map status transition with validation.',
  inputSchema: {
    old_path: z.string(),
    status: z.enum(['planned', 'mirrored', 'canonicalized']),
    notes: z.string().optional()
  }
}, safeHandler('record_migration_transition', async ({ old_path, status, notes = '' }) => {
  const row = recordMigrationTransition({ oldPath: old_path, status, notes });
  return textAndStructured({ row }, `Updated migration status for ${old_path} to ${status}`);
}));

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
}, safeHandler('record_session_history', async ({ lane, session_id, status = 'started', summary = '', started_at, updated_at, related_pages = [], source_refs = [] }) => {
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
}));

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
}, safeHandler('append_test_evidence', async ({ lane, session_id, command, status, log_ref, details = [] }) => {
  const page = appendTestEvidence({
    lane,
    sessionId: session_id,
    command,
    status,
    logRef: log_ref,
    details
  });
  return textAndStructured({ path: page.relPath, title: page.title }, `Appended test evidence to ${page.relPath}`);
}));

server.registerTool('list_my_open_wrs', {
  description: 'List open work requests relevant to a specific lane, excluding WRs already completed by that lane. Reads only canonical new-format WRs under wiki/canon/work-requests/**.',
  inputSchema: {
    lane: z.string(),
    include_to_all: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).optional()
  }
}, safeHandler('list_my_open_wrs', async ({ lane, include_to_all = true, limit = 20 }) => {
  const wrs = listMyOpenWrs({ lane, includeToAll: include_to_all, limit });
  return textAndStructured({ wrs }, JSON.stringify(wrs, null, 2));
}));

server.registerTool('register_wr', {
  description: 'Register a canonical new-format work-request page using the single validated WR schema.',
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
}, safeHandler('register_wr', async ({ wr_kind, from_lane, to_lanes, title, body, related_pages = [], service_tags = [], decision_tags = [] }) => {
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
}));

server.registerTool('complete_wr', {
  description: 'Mark a canonical new-format WR completed from the perspective of a recipient lane, preserving recipient-scoped completion metadata.',
  inputSchema: {
    path_or_id: z.string(),
    lane: z.string(),
    completion_note: z.string().optional()
  }
}, safeHandler('complete_wr', async ({ path_or_id, lane, completion_note = '' }) => {
  const page = completeWorkRequest({
    pathOrId: path_or_id,
    lane,
    completionNote: completion_note
  });
  return textAndStructured({ path: page.relPath, title: page.title, status: page.status, completionRecords: page.completionRecords }, `Completed WR recipient-side at ${page.relPath}`);
}));

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
