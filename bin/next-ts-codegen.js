#!/usr/bin/env node

'use strict';

// Point d'entrée pour la CLI
try {
  require('../dist/index.js');
} catch (err) {
  console.error('Failed to start next-ts-codegen:', err);
  process.exit(1);
}
