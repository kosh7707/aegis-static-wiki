#!/usr/bin/env node
const { allSourceDocs, appendLogEntry, rebuildIndex, rebuildMigrationMap, migrateDocument } = require('./lib');

const handledBuckets = new Set(['handoff', 'roadmap', 'work-requests', 'feedback']);
const migrated = [];
for (const mapping of allSourceDocs()) {
  if (!handledBuckets.has(mapping.bucket)) continue;
  migrateDocument(mapping);
  migrated.push(mapping);
}
rebuildMigrationMap();
rebuildIndex();
const today = new Date().toISOString().slice(0, 10);
for (const bucket of ['handoff', 'roadmap', 'work-requests', 'feedback']) {
  const count = migrated.filter((item) => item.bucket === bucket).length;
  appendLogEntry({
    date: today,
    event: 'migration',
    subject: `${bucket} bucket`,
    details: [`Migrated ${count} canonical pages into wiki/canon/${bucket === 'handoff' ? 'handoff' : bucket}.`, 'Updated migration-map.md and rebuilt the content index.']
  });
}
console.log(`Migrated ${migrated.length} pages across remaining buckets.`);
