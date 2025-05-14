#!/usr/bin/env node

import { run } from './cli';

run().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
