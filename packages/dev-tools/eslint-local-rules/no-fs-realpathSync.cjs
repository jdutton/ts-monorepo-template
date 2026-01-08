/**
 * ESLint rule: no-fs-realpathSync
 *
 * Prevents usage of fs.realpathSync() in favor of normalizePath() from @ts-monorepo-template/example-utils
 *
 * Why: realpathSync() doesn't consistently resolve Windows 8.3 short paths across Node versions.
 * normalizePath() uses realpathSync.native() with fallbacks for better cross-platform compatibility.
 *
 * Auto-fix: Replaces fs.realpathSync() with normalizePath() and adds required import.
 */

const factory = require('./eslint-rule-factory.cjs');

module.exports = factory({
  unsafeFn: 'realpathSync',
  unsafeModule: 'node:fs',
  safeFn: 'normalizePath',
  safeModule: '@ts-monorepo-template/example-utils',
  message: 'Use normalizePath() from @ts-monorepo-template/example-utils instead of fs.realpathSync() for consistent Windows 8.3 path resolution',
  exemptFile: 'path-utils.ts', // Implementation file
});
