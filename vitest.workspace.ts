import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/hekaya-parser',
  'packages/hekaya-renderer',
  'packages/hekaya-pdf',
  'apps/hekaya-cli',
]);
