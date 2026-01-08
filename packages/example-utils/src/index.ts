/**
 * EXAMPLE PACKAGE - DELETE WHEN USING THIS TEMPLATE
 *
 * This is example code to validate the template setup.
 * When using this template for your project:
 * 1. Delete the entire packages/example-utils directory
 * 2. Remove the reference from root tsconfig.json
 * 3. Create your own packages
 *
 * This package demonstrates:
 * - Package structure
 * - TypeScript configuration
 * - Unit tests
 * - Integration tests
 * - Code coverage
 * - Export patterns
 * - Cross-platform path utilities
 * - Cross-platform test helpers
 */

export { capitalize, isEmpty, truncate } from './string-utils.js';
export {
  getRelativePath,
  isAbsolutePath,
  mkdirSyncReal,
  normalizePath,
  normalizedTmpdir,
  toAbsolutePath,
  toForwardSlash,
} from './path-utils.js';
export { getTestOutputBase, getTestOutputDir } from './test-helpers.js';
