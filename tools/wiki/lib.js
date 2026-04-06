const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(process.env.WIKI_ROOT || path.join(__dirname, '..', '..'));

function resolveSourceDocsRoot() {
  const candidates = [
    process.env.SOURCE_DOCS_ROOT,
    path.join(ROOT, '..', 'AEGIS', 'docs'),
    '/home/kosh/AEGIS/docs',
    '/home/kosh/projects/AEGIS-codex-safety-20260403/docs'
  ].filter(Boolean).map((candidate) => path.resolve(candidate));

  const existing = candidates.find((candidate) => fs.existsSync(candidate));
  return existing || candidates[0];
}

const SOURCE_DOCS_ROOT = resolveSourceDocsRoot();
const WIKI_ROOT = path.join(ROOT, 'wiki');
const SYSTEM_ROOT = path.join(WIKI_ROOT, 'system');
const INDEX_PATH = path.join(SYSTEM_ROOT, 'index.md');
const LOG_PATH = path.join(SYSTEM_ROOT, 'log.md');
const WRITING_GUIDE_PATH = path.join(SYSTEM_ROOT, 'writing-guide.md');
const MIGRATION_MAP_PATH = path.join(SYSTEM_ROOT, 'migration-map.md');
const CATEGORY_ORDER = [
  ['charter', 'Platform charter'],
  ['specs', 'Specifications'],
  ['api', 'API contracts'],
  ['handoff', 'Handoff'],
  ['roadmap', 'Roadmap'],
  ['work-requests', 'Work requests'],
  ['feedback', 'Feedback'],
  ['decisions', 'Decision context'],
  ['services', 'Service context'],
  ['detection', 'Detection knowledge'],
  ['timelines', 'Timelines'],
  ['regressions', 'Regressions'],
  ['open-questions', 'Open questions'],
  ['system', 'System']
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, text) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf8');
}

function listMarkdownFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function stripMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[\[([^\]|]+)\|?([^\]]+)?\]\]/g, (_, target, label) => label || target)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^>\s*/gm, '')
    .replace(/[*_~#]/g, '')
    .trim();
}

function toWikiLink(relPath, title) {
  const withoutExt = relPath.replace(/\.md$/i, '').replace(/\\/g, '/');
  return `[[${withoutExt}|${title}]]`;
}

function normalizeTargetName(name) {
  return name.toLowerCase();
}

function extractTitle(body, fallback) {
  for (const line of body.split(/\r?\n/)) {
    if (line.startsWith('# ')) return line.slice(2).trim();
  }
  return fallback;
}

function extractSummary(body) {
  const lines = body.split(/\r?\n/);
  let inCode = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode || !line) continue;
    if (line === '---' || line.startsWith('#')) continue;
    const summary = stripMarkdown(line);
    if (summary) return summary.length > 180 ? `${summary.slice(0, 177)}...` : summary;
  }
  return 'No summary available.';
}

function yamlValue(raw) {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }
  return value.replace(/^"|"$/g, '');
}

function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return { data: {}, body: text };
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return { data: {}, body: text };
  const frontmatter = text.slice(4, end);
  const body = text.slice(end + 5);
  const data = {};
  let currentListKey = null;
  for (const rawLine of frontmatter.split(/\r?\n/)) {
    if (!rawLine.trim()) continue;
    const listItem = rawLine.match(/^\s*-\s+(.*)$/);
    if (listItem && currentListKey) {
      data[currentListKey] ||= [];
      data[currentListKey].push(listItem[1].trim().replace(/^"|"$/g, ''));
      continue;
    }
    const keyMatch = rawLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) continue;
    const [, key, rawValue] = keyMatch;
    if (!rawValue) {
      currentListKey = key;
      data[key] = [];
    } else {
      currentListKey = null;
      data[key] = yamlValue(rawValue);
    }
  }
  return { data, body };
}

function renderFrontmatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else if (value.every((item) => typeof item === 'string')) {
        const inline = value.map((item) => `"${item}"`).join(', ');
        if (key === 'source_refs') {
          lines.push(`${key}:`);
          for (const item of value) lines.push(`  - "${item}"`);
        } else {
          lines.push(`${key}: [${inline}]`);
        }
      } else {
        lines.push(`${key}: ${JSON.stringify(value)}`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value ? 'true' : 'false'}`);
    } else if (value && typeof value === 'object') {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: "${String(value).replace(/"/g, "'")}"`);
    }
  }
  lines.push('---', '');
  return `${lines.join('\n')}\n`;
}

function inferServiceTags(sourceRel) {
  const lower = sourceRel.toLowerCase();
  const tags = [];
  for (const service of ['s1', 's2', 's3', 's4', 's5', 's6', 's7']) {
    if (lower.includes(`${service}-handoff`) || lower.startsWith(`${service}_`) || lower.startsWith(`${service}-`)) {
      tags.push(service);
    }
  }
  const keywordMap = [
    ['frontend', 's1'],
    ['backend', 's2'],
    ['analysis-agent', 's3'],
    ['build-agent', 's3'],
    ['sast-runner', 's4'],
    ['knowledge-base', 's5'],
    ['adapter', 's6'],
    ['ecu-simulator', 's6'],
    ['llm-gateway', 's7'],
    ['llm-engine', 's7'],
    ['aegis.md', 'platform'],
    ['technical-overview', 'platform'],
    ['shared-models', 'platform'],
    ['observability', 'platform'],
    ['work-requests', 'platform'],
    ['외부피드백', 'platform']
  ];
  for (const [needle, tag] of keywordMap) {
    if (lower.includes(needle) && !tags.includes(tag)) tags.push(tag);
  }
  if (lower.includes('-to-all-') && !tags.includes('platform')) tags.push('platform');
  return tags.length ? tags : ['platform'];
}

function detectBucket(sourceRel) {
  if (sourceRel === 'AEGIS.md') return 'charter';
  if (sourceRel.startsWith('specs/')) return 'specs';
  if (sourceRel.startsWith('api/')) return 'api';
  if (/^s[1-7]-handoff\/roadmap\.md$/i.test(sourceRel)) return 'roadmap';
  if (/^s[1-7]-handoff\//i.test(sourceRel)) return 'handoff';
  if (sourceRel.startsWith('work-requests/')) return 'work-requests';
  if (sourceRel.startsWith('외부피드백/')) return 'feedback';
  return 'unknown';
}

function mapSourceRelToTarget(sourceRel) {
  const bucket = detectBucket(sourceRel);
  if (bucket === 'charter') {
    return { targetRel: 'wiki/canon/charter/aegis.md', bucket, pageType: 'canonical-charter' };
  }
  if (bucket === 'specs') {
    const file = normalizeTargetName(path.basename(sourceRel));
    return { targetRel: `wiki/canon/specs/${file}`, bucket, pageType: 'canonical-spec' };
  }
  if (bucket === 'api') {
    const file = normalizeTargetName(path.basename(sourceRel));
    return { targetRel: `wiki/canon/api/${file}`, bucket, pageType: 'canonical-api' };
  }
  const handoffMatch = sourceRel.match(/^(s[1-7])-handoff\/(.+)$/i);
  if (handoffMatch) {
    const [, service, rest] = handoffMatch;
    const filename = normalizeTargetName(path.basename(rest));
    if (filename === 'roadmap.md') {
      return { targetRel: `wiki/canon/roadmap/${service.toLowerCase()}-roadmap.md`, bucket: 'roadmap', pageType: 'canonical-roadmap' };
    }
    return { targetRel: `wiki/canon/handoff/${service.toLowerCase()}/${filename}`, bucket: 'handoff', pageType: 'canonical-handoff' };
  }
  if (bucket === 'work-requests') {
    return { targetRel: `wiki/canon/work-requests/${normalizeTargetName(path.basename(sourceRel))}`, bucket, pageType: 'canonical-work-request' };
  }
  if (bucket === 'feedback') {
    const feedbackRel = sourceRel.slice('외부피드백/'.length).split('/').map(normalizeTargetName).join('/');
    return { targetRel: `wiki/canon/feedback/${feedbackRel}`, bucket, pageType: 'canonical-feedback' };
  }
  return null;
}

function allSourceDocs() {
  const docs = listMarkdownFiles(SOURCE_DOCS_ROOT).filter((filePath) => !filePath.endsWith('.gitkeep'));
  return docs.map((filePath) => {
    const rel = path.relative(SOURCE_DOCS_ROOT, filePath).replace(/\\/g, '/');
    const mapping = mapSourceRelToTarget(rel);
    return mapping ? { sourcePath: filePath, sourceRel: rel, ...mapping } : null;
  }).filter(Boolean).sort((a, b) => a.sourceRel.localeCompare(b.sourceRel));
}

function canonicalFrontmatter({ title, pageType, sourceRel, serviceTags, relatedPages = [], decisionTags = [], migrationStatus = 'canonicalized' }) {
  return {
    title,
    page_type: pageType,
    canonical: true,
    source_repo: 'AEGIS',
    source_refs: [`docs/${sourceRel}`],
    original_path: `docs/${sourceRel}`,
    last_verified: new Date().toISOString().slice(0, 10),
    service_tags: serviceTags,
    decision_tags: decisionTags,
    related_pages: relatedPages,
    migration_status: migrationStatus
  };
}

function writeMarkdownPage({ relPath, frontmatter, body }) {
  const targetPath = path.join(ROOT, relPath);
  writeText(targetPath, `${renderFrontmatter(frontmatter)}${body.trim()}\n`);
  return targetPath;
}

function migrateDocument(mapping) {
  const body = readText(mapping.sourcePath);
  const title = extractTitle(body, path.basename(mapping.sourceRel, '.md'));
  const serviceTags = inferServiceTags(mapping.sourceRel);
  return writeMarkdownPage({
    relPath: mapping.targetRel,
    frontmatter: canonicalFrontmatter({ title, pageType: mapping.pageType, sourceRel: mapping.sourceRel, serviceTags }),
    body
  });
}

function listWikiPages() {
  const paths = [];
  for (const base of ['wiki/canon', 'wiki/context', 'wiki/system']) {
    paths.push(...listMarkdownFiles(path.join(ROOT, base)));
  }
  if (fs.existsSync(path.join(ROOT, 'Home.md'))) paths.push(path.join(ROOT, 'Home.md'));
  return paths.sort().map(buildPageRecord);
}

function buildPageRecord(absPath) {
  const relPath = path.relative(ROOT, absPath).replace(/\\/g, '/');
  const { data, body } = parseFrontmatter(readText(absPath));
  const title = data.title || extractTitle(body, path.basename(relPath, '.md'));
  const pageType = data.page_type || 'unknown';
  const canonical = Boolean(data.canonical);
  const summary = extractSummary(body);
  return {
    absPath,
    relPath,
    title,
    pageType,
    canonical,
    sourceRefs: Array.isArray(data.source_refs) ? data.source_refs : [],
    lastVerified: data.last_verified || '',
    serviceTags: Array.isArray(data.service_tags) ? data.service_tags : [],
    decisionTags: Array.isArray(data.decision_tags) ? data.decision_tags : [],
    relatedPages: Array.isArray(data.related_pages) ? data.related_pages : [],
    summary,
    body
  };
}

function groupKeyForRecord(record) {
  if (record.relPath === 'Home.md') return 'system';
  const parts = record.relPath.split('/');
  if (parts[0] !== 'wiki') return 'system';
  if (parts[1] === 'canon') return parts[2];
  if (parts[1] === 'context') return parts[2];
  return 'system';
}

function buildIndexContent() {
  const grouped = new Map(CATEGORY_ORDER.map(([key]) => [key, []]));
  for (const record of listWikiPages()) {
    const key = groupKeyForRecord(record);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  }
  const lines = [
    '---',
    'title: "AEGIS static wiki index"',
    'page_type: "system-index"',
    'canonical: false',
    'source_refs:',
    '  - "../README.md"',
    `last_verified: "${new Date().toISOString().slice(0, 10)}"`,
    'service_tags: ["platform"]',
    'decision_tags: ["navigation", "index"]',
    'related_pages: ["./log.md", "./migration-map.md", "./writing-guide.md", "../Home.md"]',
    '---',
    '',
    '# AEGIS Static Wiki Index',
    '',
    'Content-oriented catalog of the wiki. Agents should read this first to locate relevant pages before drilling into individual documents.',
    ''
  ];
  for (const [key, label] of CATEGORY_ORDER) {
    const records = (grouped.get(key) || []).sort((a, b) => a.relPath.localeCompare(b.relPath));
    if (!records.length && key !== 'work-requests') continue;
    lines.push(`## ${label}`, '');
    if (!records.length) {
      lines.push('- No active canonical work requests are currently present. Archived legacy WRs under `AEGIS/docs/work-requests/` are runtime out-of-scope.', '');
      continue;
    }
    for (const record of records) {
      const metaBits = [];
      if (record.lastVerified) metaBits.push(`verified ${record.lastVerified}`);
      if (record.serviceTags.length) metaBits.push(record.serviceTags.join('/'));
      const meta = metaBits.length ? ` *(${metaBits.join('; ')})*` : '';
      lines.push(`- ${toWikiLink(record.relPath, record.title)} — ${record.summary}${meta}`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

function rebuildIndex() {
  const content = buildIndexContent();
  writeText(INDEX_PATH, content);
  return buildPageRecord(INDEX_PATH);
}

function parseLogEntries() {
  if (!fs.existsSync(LOG_PATH)) return [];
  const text = readText(LOG_PATH);
  const lines = text.split(/\r?\n/);
  const entries = [];
  let current = null;
  for (const line of lines) {
    const match = line.match(/^## \[(\d{4}-\d{2}-\d{2})\] ([^|]+) \| (.+)$/);
    if (match) {
      if (current) entries.push(current);
      current = { date: match[1], event: match[2].trim(), subject: match[3].trim(), details: [] };
    } else if (current && line.startsWith('- ')) {
      current.details.push(line.slice(2).trim());
    }
  }
  if (current) entries.push(current);
  return entries;
}

function buildLogFrontmatter() {
  return [
    '---',
    'title: "AEGIS static wiki log"',
    'page_type: "system-log"',
    'canonical: false',
    'source_refs: []',
    `last_verified: "${new Date().toISOString().slice(0, 10)}"`,
    'service_tags: ["platform"]',
    'decision_tags: ["log", "maintenance"]',
    'related_pages: ["./index.md", "./migration-map.md", "./writing-guide.md"]',
    '---',
    '',
    '# Log',
    '',
    'Append-only chronological record of ingests, maintenance operations, and major wiki changes.',
    ''
  ].join('\n');
}

function ensureLogExists() {
  if (!fs.existsSync(LOG_PATH)) {
    writeText(LOG_PATH, `${buildLogFrontmatter()}\n`);
  }
}

function appendLogEntry({ date, event, subject, details = [] }) {
  ensureLogExists();
  const heading = `## [${date}] ${event} | ${subject}`;
  const current = readText(LOG_PATH);
  if (current.includes(heading)) return false;
  const lines = [heading, ...details.map((detail) => `- ${detail}`), ''];
  writeText(LOG_PATH, `${current.trimEnd()}\n\n${lines.join('\n')}`);
  return true;
}

function parseMigrationMap() {
  const text = readText(MIGRATION_MAP_PATH);
  const lines = text.split(/\r?\n/);
  const tableStart = lines.findIndex((line) => line.startsWith('| old path |'));
  if (tableStart === -1) return { lines, rows: [], tableStart: -1, tableEnd: -1 };
  const rows = [];
  let index = tableStart + 2;
  while (index < lines.length && lines[index].startsWith('|')) {
    const cells = lines[index].split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length >= 5) {
      rows.push({ lineIndex: index, oldPath: cells[0], newPath: cells[1], bucket: cells[2], status: cells[3], notes: cells[4] });
    }
    index += 1;
  }
  return { lines, rows, tableStart, tableEnd: index - 1 };
}

function isValidTransition(fromStatus, toStatus) {
  if (fromStatus === toStatus) return true;
  if (fromStatus === 'planned' && ['mirrored', 'canonicalized'].includes(toStatus)) return true;
  if (fromStatus === 'mirrored' && toStatus === 'canonicalized') return true;
  return false;
}

function writeMigrationRows(rows) {
  const header = [
    '| old path | new path | bucket | status | notes |',
    '|---|---|---|---|---|'
  ];
  return [...header, ...rows.map((row) => `| ${row.oldPath} | ${row.newPath} | ${row.bucket} | ${row.status} | ${row.notes} |`)].join('\n');
}

function rebuildMigrationMap() {
  const mappings = allSourceDocs().map((mapping) => ({
    oldPath: `docs/${mapping.sourceRel}`,
    newPath: mapping.targetRel,
    bucket: mapping.bucket,
    status: fs.existsSync(path.join(ROOT, mapping.targetRel)) ? 'canonicalized' : 'planned',
    notes: fs.existsSync(path.join(ROOT, mapping.targetRel)) ? 'migrated into canonical wiki' : 'bucket migration pending'
  }));
  const { lines, tableStart, tableEnd } = parseMigrationMap();
  if (tableStart === -1) throw new Error('migration-map table missing');
  const before = lines.slice(0, tableStart);
  const after = lines.slice(tableEnd + 1);
  writeText(MIGRATION_MAP_PATH, `${before.join('\n')}\n${writeMigrationRows(mappings)}\n${after.join('\n')}`.replace(/\n{3,}/g, '\n\n'));
  return mappings;
}

function recordMigrationTransition({ oldPath, status, notes }) {
  const parsed = parseMigrationMap();
  const row = parsed.rows.find((entry) => entry.oldPath === oldPath);
  if (!row) throw new Error(`No migration map row found for ${oldPath}`);
  if (!isValidTransition(row.status, status)) {
    throw new Error(`Invalid migration transition: ${row.status} -> ${status}`);
  }
  row.status = status;
  if (notes) row.notes = notes;
  const rowsByLine = new Map(parsed.rows.map((entry) => [entry.lineIndex, entry]));
  for (const [lineIndex, entry] of rowsByLine.entries()) {
    parsed.lines[lineIndex] = `| ${entry.oldPath} | ${entry.newPath} | ${entry.bucket} | ${entry.status} | ${entry.notes} |`;
  }
  writeText(MIGRATION_MAP_PATH, `${parsed.lines.join('\n').trim()}\n`);
  return row;
}

function validateWritePath(relPath, canonical) {
  const normalized = relPath.replace(/\\/g, '/');
  const forbidden = ['wiki/system/index.md', 'wiki/system/log.md', 'wiki/system/migration-map.md'];
  if (forbidden.includes(normalized)) {
    throw new Error(`Use typed maintenance operations instead of raw writes for ${normalized}`);
  }
  if (canonical && !normalized.startsWith('wiki/canon/')) {
    throw new Error('Canonical pages must live under wiki/canon/**');
  }
  if (
    !canonical &&
    !(
      normalized.startsWith('wiki/context/') ||
      normalized === 'wiki/system/writing-guide.md' ||
      normalized === 'Home.md'
    )
  ) {
    throw new Error('Non-canonical writes must target wiki/context/**, wiki/system/writing-guide.md, or Home.md');
  }
}

function writePage({ relPath, title, pageType, canonical, sourceRefs = [], serviceTags = ['platform'], decisionTags = [], relatedPages = [], body, lastVerified }) {
  validateWritePath(relPath, canonical);
  if (!title || !pageType || typeof canonical !== 'boolean') throw new Error('title, pageType, and canonical are required');
  if (canonical && sourceRefs.length === 0) throw new Error('canonical pages require sourceRefs');
  const frontmatter = {
    title,
    page_type: pageType,
    canonical,
    source_refs: sourceRefs,
    last_verified: lastVerified || new Date().toISOString().slice(0, 10),
    service_tags: serviceTags,
    decision_tags: decisionTags,
    related_pages: relatedPages
  };
  writeMarkdownPage({ relPath, frontmatter, body });
  return buildPageRecord(path.join(ROOT, relPath));
}

function normalizeLane(value) {
  return sanitizeSegment(value);
}

function workRequestsRoot() {
  return path.join(ROOT, 'wiki', 'canon', 'work-requests');
}

const WR_ALLOWED_KINDS = new Set(['request', 'reply', 'notice', 'question']);
const WR_ALLOWED_STATUSES = new Set(['open', 'completed']);

function isCanonicalWrRecord(data, record) {
  if (!record.canonical) return false;
  if (record.pageType !== 'canonical-work-request') return false;
  if (!data.wr_id || typeof data.wr_id !== 'string') return false;
  if (!WR_ALLOWED_KINDS.has(String(data.wr_kind || '').trim().toLowerCase())) return false;
  if (!WR_ALLOWED_STATUSES.has(String(data.status || '').trim().toLowerCase())) return false;
  if (!data.from_lane || typeof data.from_lane !== 'string') return false;
  if (!Array.isArray(data.to_lanes) || data.to_lanes.length === 0) return false;
  if (!Array.isArray(data.completed_by)) return false;
  if (!data.registered_at || typeof data.registered_at !== 'string') return false;
  return true;
}

function listWorkRequestRecords() {
  const root = workRequestsRoot();
  if (!fs.existsSync(root)) return [];
  return listMarkdownFiles(root)
    .map(buildPageRecord)
    .map((record) => ({ record, data: parseFrontmatter(readText(record.absPath)).data }))
    .filter(({ record, data }) => isCanonicalWrRecord(data, record))
    .map(({ record, data }) => ({
      ...record,
      wrKind: String(data.wr_kind).trim().toLowerCase(),
      status: String(data.status).trim().toLowerCase(),
      fromLane: normalizeLane(data.from_lane),
      toLanes: data.to_lanes.map(normalizeLane),
      completionRecords: data.completed_by,
      wrId: data.wr_id
    }));
}

function listMyOpenWrs({ lane, includeToAll = true, limit = 20 }) {
  const normalizedLane = normalizeLane(lane);
  return listWorkRequestRecords()
    .filter((record) => {
      if (record.status !== 'open') return false;
      const completionLanes = record.completionRecords.map((entry) => normalizeLane(entry.lane));
      if (completionLanes.includes(normalizedLane)) return false;
      return record.toLanes.includes(normalizedLane) || (includeToAll && record.toLanes.includes('all'));
    })
    .slice(0, limit)
    .map((record) => ({
      wrId: record.wrId,
      path: record.relPath,
      title: record.title,
      wrKind: record.wrKind,
      fromLane: record.fromLane,
      toLanes: record.toLanes,
      summary: record.summary
    }));
}

function slugifyWorkRequestTitle(title) {
  return sanitizeSegment(title).slice(0, 80) || 'untitled';
}

function buildWrFilename({ fromLane, toLanes, title }) {
  const toPart = toLanes.length === 1 ? toLanes[0] : toLanes.join('-');
  return `${fromLane}-to-${toPart}-${slugifyWorkRequestTitle(title)}.md`;
}

function buildWrBody({ title, fromLane, toLanes, body, wrKind }) {
  const contentHeading = wrKind === 'notice'
    ? 'Notice'
    : wrKind === 'question'
      ? 'Question'
      : 'Request';
  return [
    `# ${title}`,
    '',
    '## Summary',
    `- Kind: ${wrKind}`,
    `- From: ${fromLane}`,
    `- To: ${toLanes.join(', ')}`,
    '',
    '## Context',
    '- Canonical WR generated through the WR MCP surface.',
    '',
    `## ${contentHeading}`,
    body.trim(),
    '',
    '## Completion expectation',
    '- Recipient-side handling should be tracked through `complete_wr`.',
    '- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.',
    '',
    '## Notes',
    '- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.',
    ''
  ].join('\n');
}

function registerWorkRequest({ wrKind, fromLane, toLanes, title, body, relatedPages = [], serviceTags = [], decisionTags = [] }) {
  const normalizedKind = String(wrKind || '').trim().toLowerCase();
  if (!WR_ALLOWED_KINDS.has(normalizedKind)) throw new Error(`Unsupported wr_kind: ${wrKind}`);
  const normalizedFrom = normalizeLane(fromLane);
  const normalizedTo = [...new Set((toLanes || []).map(normalizeLane).filter(Boolean))];
  if (!normalizedFrom) throw new Error('from_lane is required');
  if (!normalizedTo.length) throw new Error('to_lanes is required');
  if (!title?.trim()) throw new Error('title is required');
  if (!body?.trim()) throw new Error('body is required');

  const filename = buildWrFilename({ fromLane: normalizedFrom, toLanes: normalizedTo, title });
  const relPath = path.join('wiki', 'canon', 'work-requests', filename).replace(/\\/g, '/');
  const wrId = path.basename(filename, '.md');
  const now = new Date().toISOString();
  const page = writeMarkdownPage({
    relPath,
    frontmatter: {
      title,
      page_type: 'canonical-work-request',
      canonical: true,
      source_repo: 'AEGIS',
      source_refs: ['mcp://register_wr'],
      original_path: `mcp://register_wr/${wrId}`,
      last_verified: now.slice(0, 10),
      service_tags: serviceTags.length ? serviceTags : [normalizedFrom],
      decision_tags: decisionTags,
      related_pages: relatedPages,
      migration_status: 'canonicalized',
      wr_id: wrId,
      wr_kind: normalizedKind,
      status: 'open',
      from_lane: normalizedFrom,
      to_lanes: normalizedTo,
      completed_by: [],
      registered_at: now
    },
    body: buildWrBody({ title, fromLane: normalizedFrom, toLanes: normalizedTo, body, wrKind: normalizedKind })
  });
  rebuildIndex();
  appendLogEntry({
    date: now.slice(0, 10),
    event: 'mcp',
    subject: `register_wr | ${wrId}`,
    details: [`Registered ${normalizedKind} WR for ${normalizedTo.join(', ')}`, `Path: ${relPath}`]
  });
  return buildPageRecord(page);
}

function resolveWrRecord({ pathOrId }) {
  const normalized = pathOrId.endsWith('.md') ? pathOrId : `${pathOrId}.md`;
  const asPath = normalized.startsWith('wiki/') ? normalized : path.join('wiki', 'canon', 'work-requests', normalized).replace(/\\/g, '/');
  const absPath = path.join(ROOT, asPath);
  if (fs.existsSync(absPath)) {
    const record = listWorkRequestRecords().find((item) => item.relPath === asPath);
    if (record) return record;
  }
  const bareId = path.basename(pathOrId, '.md');
  const byId = listWorkRequestRecords().find((item) => item.wrId === bareId);
  if (!byId) throw new Error(`No WR found for ${pathOrId}`);
  return byId;
}

function updateWrFrontmatter(absPath, data) {
  const { body } = parseFrontmatter(readText(absPath));
  writeMarkdownPage({
    relPath: path.relative(ROOT, absPath).replace(/\\/g, '/'),
    frontmatter: data,
    body
  });
}

function maybeDeriveGlobalStatus(toLanes, completionRecords) {
  if (toLanes.includes('all')) return 'open';
  const completed = new Set(completionRecords.map((entry) => normalizeLane(entry.lane)));
  return toLanes.every((lane) => completed.has(normalizeLane(lane))) ? 'completed' : 'open';
}

function completeWorkRequest({ pathOrId, lane, completionNote = '' }) {
  const wr = resolveWrRecord({ pathOrId });
  const normalizedLane = normalizeLane(lane);
  const canComplete = wr.toLanes.includes(normalizedLane) || wr.toLanes.includes('all');
  if (!canComplete) throw new Error(`Lane ${lane} is not allowed to complete ${wr.wrId}`);
  const { data } = parseFrontmatter(readText(wr.absPath));
  const completionRecords = Array.isArray(data.completed_by)
    ? data.completed_by
    : (Array.isArray(data.completion_records) ? data.completion_records : []);
  const existing = completionRecords.find((entry) => normalizeLane(entry.lane) === normalizedLane);
  const now = new Date().toISOString();
  if (existing) {
    existing.completed_at = now;
    if (completionNote) existing.note = completionNote;
  } else {
    completionRecords.push({
      lane: normalizedLane,
      completed_at: now,
      ...(completionNote ? { note: completionNote } : {})
    });
  }
  data.completed_by = completionRecords;
  data.status = maybeDeriveGlobalStatus(Array.isArray(data.to_lanes) ? data.to_lanes : wr.toLanes, completionRecords);
  data.last_verified = now.slice(0, 10);
  if (data.status === 'completed') data.completed_at = now;
  updateWrFrontmatter(wr.absPath, data);
  rebuildIndex();
  appendLogEntry({
    date: now.slice(0, 10),
    event: 'mcp',
    subject: `complete_wr | ${wr.wrId}`,
    details: [`Lane ${normalizedLane} completed recipient-side handling`, `Status: ${data.status}`]
  });
  return resolveWrRecord({ pathOrId: wr.relPath });
}

function sanitizeSegment(value) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
}

function getSessionHistoryRelPath({ lane, sessionId }) {
  const normalizedLane = sanitizeSegment(lane);
  const normalizedSessionId = sanitizeSegment(sessionId);
  const filename = normalizedSessionId.startsWith('session-')
    ? `${normalizedSessionId}.md`
    : `session-${normalizedSessionId}.md`;
  return path.join('wiki', 'canon', 'handoff', normalizedLane, filename).replace(/\\/g, '/');
}

function getLegacySessionHistoryRelPath({ lane, sessionId }) {
  return path.join('wiki', 'system', 'session-history', sanitizeSegment(lane), `${sanitizeSegment(sessionId)}.md`).replace(/\\/g, '/');
}

function buildSessionHistoryBody({ lane, sessionId, status, summary, startedAt, updatedAt, relatedPages = [] }) {
  const related = relatedPages.length
    ? relatedPages.map((page) => `- ${page.startsWith('[[') ? page : `[[${page.replace(/\\.md$/i, '')}]]`}`).join('\n')
    : '- None';
  return [
    `# Session history — ${lane} / ${sessionId}`,
    '',
    '## Session',
    `- Lane: ${lane}`,
    `- Session ID: ${sessionId}`,
    `- Status: ${status}`,
    `- Started at: ${startedAt}`,
    `- Updated at: ${updatedAt}`,
    '',
    '## Summary',
    summary || 'No summary recorded yet.',
    '',
    '## Related pages',
    related,
    '',
    '## Test evidence',
    '_No test evidence recorded yet._',
    ''
  ].join('\n');
}

function migrateLegacySessionHistoryIfNeeded({ lane, sessionId }) {
  const relPath = getSessionHistoryRelPath({ lane, sessionId });
  const absPath = path.join(ROOT, relPath);
  if (fs.existsSync(absPath)) return { relPath, absPath };

  const legacyRelPath = getLegacySessionHistoryRelPath({ lane, sessionId });
  const legacyAbsPath = path.join(ROOT, legacyRelPath);
  if (!fs.existsSync(legacyAbsPath)) return { relPath, absPath };

  ensureDir(path.dirname(absPath));
  fs.renameSync(legacyAbsPath, absPath);
  const legacyLaneDir = path.dirname(legacyAbsPath);
  const legacyRoot = path.dirname(legacyLaneDir);
  try { fs.rmdirSync(legacyLaneDir); } catch {}
  try { fs.rmdirSync(legacyRoot); } catch {}
  return { relPath, absPath };
}

function recordSessionHistory({ lane, sessionId, status = 'started', summary = '', startedAt, updatedAt, relatedPages = [], sourceRefs = [] }) {
  const now = new Date().toISOString();
  const { relPath, absPath } = migrateLegacySessionHistoryIfNeeded({ lane, sessionId });
  const existing = fs.existsSync(absPath) ? buildPageRecord(absPath) : null;
  writeMarkdownPage({
    relPath,
    frontmatter: {
      title: `Session history — ${lane} / ${sessionId}`,
      page_type: 'canonical-handoff-session',
      canonical: true,
      source_repo: 'AEGIS',
      source_refs: sourceRefs.length ? sourceRefs : ['mcp://record_session_history'],
      original_path: `mcp://record_session_history/${sanitizeSegment(lane)}/${sanitizeSegment(sessionId)}`,
      last_verified: now.slice(0, 10),
      service_tags: [sanitizeSegment(lane)],
      decision_tags: ['session-history', 'hook-policy'],
      related_pages: relatedPages,
      migration_status: 'canonicalized'
    },
    body: buildSessionHistoryBody({
      lane,
      sessionId,
      status,
      summary: summary || existing?.summary || '',
      startedAt: startedAt || existing?.body.match(/- Started at: (.+)/)?.[1] || now,
      updatedAt: updatedAt || now,
      relatedPages
    }),
  });
  rebuildIndex();
  return buildPageRecord(absPath);
}

function appendTestEvidence({ lane, sessionId, command, status, logRef, details = [] }) {
  const { relPath, absPath } = migrateLegacySessionHistoryIfNeeded({ lane, sessionId });
  const page = fs.existsSync(absPath)
    ? buildPageRecord(absPath)
    : recordSessionHistory({ lane, sessionId, status: 'started', summary: 'Session created automatically for test evidence logging.' });
  let body = page.body;
  const placeholder = '_No test evidence recorded yet._';
  if (body.includes(placeholder)) body = body.replace(placeholder, '');
  const evidenceLines = [
    `### ${new Date().toISOString()} — ${status}`,
    `- Command: \`${command}\``,
    `- Log ref: ${logRef}`,
    ...details.map((detail) => `- ${detail}`),
    ''
  ];
  body = `${body.trimEnd()}\n\n${evidenceLines.join('\n')}\n`;
  const { data } = parseFrontmatter(readText(absPath));
  writeMarkdownPage({
    relPath,
    frontmatter: {
      title: data.title || `Session history — ${lane} / ${sessionId}`,
      page_type: data.page_type || 'canonical-handoff-session',
      canonical: true,
      source_repo: data.source_repo || 'AEGIS',
      source_refs: Array.isArray(data.source_refs) ? data.source_refs : [],
      original_path: data.original_path || `mcp://record_session_history/${sanitizeSegment(lane)}/${sanitizeSegment(sessionId)}`,
      last_verified: new Date().toISOString().slice(0, 10),
      service_tags: Array.isArray(data.service_tags) ? data.service_tags : [sanitizeSegment(lane)],
      decision_tags: Array.isArray(data.decision_tags) ? data.decision_tags : ['session-history', 'hook-policy'],
      related_pages: Array.isArray(data.related_pages) ? data.related_pages : [],
      migration_status: data.migration_status || 'canonicalized'
    },
    body
  });
  rebuildIndex();
  return buildPageRecord(absPath);
}

function listPages({ scope = 'all', canonical = null, search = '' } = {}) {
  const query = search.trim().toLowerCase();
  return listWikiPages().filter((record) => {
    if (scope !== 'all') {
      if (scope === 'canon' && !record.relPath.startsWith('wiki/canon/')) return false;
      if (scope === 'context' && !record.relPath.startsWith('wiki/context/')) return false;
      if (scope === 'system' && !(record.relPath.startsWith('wiki/system/') || record.relPath === 'Home.md')) return false;
    }
    if (canonical !== null && record.canonical !== canonical) return false;
    if (query) {
      const haystack = `${record.title} ${record.summary} ${record.body}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function searchPages(query, limit = 10) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = listWikiPages().map((record) => {
    const haystack = `${record.title}\n${record.summary}\n${record.body}`.toLowerCase();
    let score = record.canonical ? 2 : 0;
    for (const token of tokens) {
      const matches = haystack.split(token).length - 1;
      score += matches;
    }
    if (record.title.toLowerCase().includes(query.toLowerCase())) score += 3;
    return { record, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.record.relPath.localeCompare(b.record.relPath)).slice(0, limit);
  return results.map(({ record, score }) => ({ ...record, score }));
}

function extractWikiLinks(text) {
  const matches = [...text.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)];
  return matches.map((match) => `${match[1].replace(/\\/g, '/').replace(/\.md$/i, '')}.md`);
}

function getBacklinks(relPath) {
  const normalized = relPath.endsWith('.md') ? relPath : `${relPath}.md`;
  return listWikiPages().filter((record) => {
    const related = record.relatedPages.map((page) => page.replace(/^\.\.\//g, '').replace(/\\/g, '/'));
    return extractWikiLinks(readText(record.absPath)).includes(normalized) || related.some((page) => page.endsWith(normalized));
  });
}

function getRecentChanges(limit = 10) {
  return parseLogEntries().slice(-limit).reverse();
}

function getMigrationTarget(oldPath) {
  const { rows } = parseMigrationMap();
  return rows.find((row) => row.oldPath === oldPath) || null;
}

module.exports = {
  ROOT,
  SOURCE_DOCS_ROOT,
  INDEX_PATH,
  LOG_PATH,
  WRITING_GUIDE_PATH,
  MIGRATION_MAP_PATH,
  allSourceDocs,
  appendLogEntry,
  buildIndexContent,
  buildPageRecord,
  detectBucket,
  extractSummary,
  getBacklinks,
  getMigrationTarget,
  getRecentChanges,
  getSessionHistoryRelPath,
  listMyOpenWrs,
  inferServiceTags,
  isValidTransition,
  listPages,
  listWorkRequestRecords,
  mapSourceRelToTarget,
  migrateDocument,
  parseFrontmatter,
  parseLogEntries,
  recordMigrationTransition,
  recordSessionHistory,
  registerWorkRequest,
  rebuildIndex,
  rebuildMigrationMap,
  searchPages,
  completeWorkRequest,
  appendTestEvidence,
  toWikiLink,
  writeMarkdownPage,
  writePage,
  writeText,
  readText,
  ensureDir
};
