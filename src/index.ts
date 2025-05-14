#!/usr/bin/env node

const { run } = require('./cli');

run().catch((error: Error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
