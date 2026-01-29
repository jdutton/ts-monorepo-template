/**
 * Custom ESLint rules for ts-monorepo-template
 *
 * Security and Cross-Platform Compatibility Rules:
 * - no-child-process-execSync: Enforce safeExecSync() instead of execSync() (security + cross-platform)
 * - no-os-tmpdir: Enforce normalizedTmpdir() instead of os.tmpdir() (Windows 8.3 short paths)
 * - no-fs-mkdirSync: Enforce mkdirSyncReal() instead of fs.mkdirSync() (Windows path normalization)
 * - no-fs-realpathSync: Enforce normalizePath() instead of fs.realpathSync() (consistent Windows resolution)
 * - no-unix-shell-commands: Prevent Unix-specific commands that break Windows compatibility
 * - no-manual-path-normalize: Enforce toForwardSlash() instead of manual .split(path.sep).join('/') patterns
 * - no-path-sep-in-strings: Prevent path.sep in string operations (split, includes, etc.)
 * - no-path-operations-in-comparisons: Require normalizing path operations before string comparisons
 *
 * ## Why Custom Rules?
 *
 * When working with agentic code (Claude, Cursor, etc.), AI can easily reintroduce unsafe patterns.
 * Custom ESLint rules provide automatic guardrails that catch these issues during development.
 *
 * ## Cross-Platform Path Utilities
 *
 * The path-related rules enforce usage of utilities from @ts-monorepo-template/example-utils that
 * handle Windows 8.3 short path names (RUNNER~1). These short paths cause test failures on Windows CI
 * because Node.js operations create long names but comparisons use short names.
 *
 * ## Adding New Rules
 *
 * When you identify a dangerous pattern that should be prevented:
 * 1. Create a new rule file in this directory using eslint-rule-factory.cjs
 * 2. Add it to the exports below
 * 3. Configure it in the root eslint.config.js
 *
 * Example:
 * ```js
 * // no-fs-unlinkSync.cjs
 * const factory = require('./eslint-rule-factory.cjs');
 * module.exports = factory({
 *   unsafeFn: 'unlinkSync',
 *   unsafeModule: 'node:fs',
 *   safeFn: 'safeUnlinkSync',
 *   safeModule: '@ts-monorepo-template/example-utils',
 *   message: 'Use safeUnlinkSync() for better error handling',
 * });
 * ```
 */

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default {
  rules: {
    'no-child-process-execSync': require('./no-child-process-execSync.cjs'),
    'no-fs-mkdirSync': require('./no-fs-mkdirSync.cjs'),
    'no-fs-realpathSync': require('./no-fs-realpathSync.cjs'),
    'no-os-tmpdir': require('./no-os-tmpdir.cjs'),
    'no-unix-shell-commands': require('./no-unix-shell-commands.cjs'),
    'no-manual-path-normalize': require('./no-manual-path-normalize.cjs'),
    'no-path-sep-in-strings': require('./no-path-sep-in-strings.cjs'),
    'no-path-operations-in-comparisons': require('./no-path-operations-in-comparisons.cjs'),
  },
};
