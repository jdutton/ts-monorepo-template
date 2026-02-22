/**
 * Canonical list of packages for publishing.
 *
 * Single source of truth for which packages exist in the monorepo
 * and which should be published to npm.
 *
 * IMPORTANT: Update this file when adding packages to packages/:
 * - Add to PUBLISHED_PACKAGES if it should be published to npm
 * - Add to SKIP_PACKAGES if it should NOT be published
 */

/**
 * Packages to publish to npm, in dependency order.
 * Dependencies must come before dependents.
 *
 * Replace with your project's actual package names before publishing.
 */
export const PUBLISHED_PACKAGES: readonly string[] = [] as const;

/**
 * Packages to skip (not published to npm).
 * Private dev tools, test fixtures, etc.
 */
export const SKIP_PACKAGES: readonly string[] = [
  'dev-tools',
] as const;
