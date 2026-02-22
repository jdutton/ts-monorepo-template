/**
 * Repository structure validation configuration for this project.
 *
 * Customize these rules to match your project's conventions.
 * See validate-repo-structure.ts for the full ValidatorConfig interface.
 */
import type { ValidatorConfig } from './validate-repo-structure.js';

export const config: ValidatorConfig = {
  // Only dev-tools may have a /scripts directory by default.
  // Add other package names here if needed.
  allowedScriptsPackages: ['dev-tools'],

  // No package name patterns are restricted from having /examples by default.
  // Example for vibe-agent-toolkit: [/^runtime-/]
  noExamplesPatterns: [],

  // No additional root-level .ts files beyond the built-in vitest configs.
  allowedRootTsFiles: [],

  // No additional package path patterns beyond the built-in ones.
  allowedPackageTsPaths: [],
};
