#!/usr/bin/env node
const { rebuildIndex } = require('./lib');
const record = rebuildIndex();
console.log(`Rebuilt index at ${record.relPath}`);
