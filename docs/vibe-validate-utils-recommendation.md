# @vibe-validate/utils Integration Recommendation

## Analysis

After reviewing `@vibe-validate/utils`, it provides significantly more mature and battle-tested utilities than what we implemented in `tools/common.ts`.

### What @vibe-validate/utils Provides

**Command Execution (safe-exec.ts):**
- `safeExecSync()` - Secure command execution using `which` + `spawnSync` with `shell: false`
- `safeExecResult()` - Non-throwing variant that returns detailed results
- `safeExecFromString()` - Convenience wrapper for simple command strings
- `isToolAvailable()` - Check if CLI tool is installed
- `getToolVersion()` - Get tool version string
- `hasShellSyntax()` - Detect shell-specific syntax to prevent subtle bugs
- `CommandExecutionError` - Structured error with status/stdout/stderr
- **Sophisticated Windows handling:**
  - Uses `which` package to resolve command paths
  - `shell: false` by default (security)
  - `shell: true` only for Windows shell scripts (.cmd/.bat/.ps1)
  - Avoids Node.js DEP0190 deprecation warning

**Path Helpers (path-helpers.ts):**
- `normalizedTmpdir()` - Get temp dir with Windows 8.3 short name resolution
- `mkdirSyncReal()` - Create directory and return normalized path
- `normalizePath()` - Normalize any path (critical for Windows testing)
- **Why these matter:** Windows temp paths may use 8.3 short names (e.g., `RUNNER~1`) which cause `existsSync()` failures when Node.js creates directories with long names

### What Our tools/common.ts Provides

**Basic exec functions (REPLACE with @vibe-validate/utils):**
- `safeExecSync()` - Basic implementation
- `safeExecResult()` - Basic implementation

**Monorepo-specific utilities (KEEP - not in @vibe-validate/utils):**
- `processWorkspacePackages()` - Iterate over workspace packages
- `getNpmTagVersion()` - Get npm tag version for publishing
- `log()` - Colored console output
- `PROJECT_ROOT`, `colors`, `getDirname()`, `getFilename()` - Basic utilities

## Recommendations

### 1. Make @vibe-validate/utils a Dependency

**For this template project:**
- Add as **devDependency** (used by tools/)
- Consider **dependency** if published packages need exec utilities

```json
{
  "devDependencies": {
    "@vibe-validate/utils": "^0.18.0"
  }
}
```

### 2. Refactor tools/common.ts

Replace our basic exec functions with imports from `@vibe-validate/utils`:

```typescript
// tools/common.ts
import {
  safeExecSync,
  safeExecResult,
  isToolAvailable,
  getToolVersion,
  normalizedTmpdir,
  mkdirSyncReal,
  normalizePath,
  type SafeExecOptions,
  type SafeExecResult,
} from '@vibe-validate/utils';

// Re-export for tool convenience
export {
  safeExecSync,
  safeExecResult,
  isToolAvailable,
  getToolVersion,
  normalizedTmpdir,
  mkdirSyncReal,
  normalizePath,
  type SafeExecOptions,
  type SafeExecResult,
};

// Keep monorepo-specific utilities
export const PROJECT_ROOT = ...;
export function log() { ... }
export function getNpmTagVersion() { ... }
export function processWorkspacePackages() { ... }
```

**Benefits:**
- More secure command execution (shell:false by default)
- Better Windows compatibility (8.3 short name handling)
- More utilities (isToolAvailable, getToolVersion, hasShellSyntax)
- Battle-tested in vibe-validate production use
- Reduces code duplication

### 3. Contribute Generic Tools Back to vibe-validate

These tools from our template could benefit other projects:

**Strong candidates for vibe-validate contribution:**
1. **bump-version.ts** - Generic monorepo version management
   - Auto-discovers workspace packages
   - Handles both explicit versions and semver increments (patch/minor/major)
   - Updates all package.json files atomically
   - Could be packaged as `@vibe-validate/version-tools`

2. **pre-publish-check.ts** - Generic pre-publish validation
   - Checks git status, branch, uncommitted changes
   - Runs validation pipeline
   - Checks package builds
   - CI-aware (skips certain checks in CI)
   - Could be packaged as `@vibe-validate/publish-tools`

3. **determine-publish-tags.ts** - Generic npm tag determination
   - Determines latest vs next tags
   - Handles RC versions
   - Compares with current npm registry
   - Could be packaged as `@vibe-validate/publish-tools`

**Why contribute these:**
- Generic enough for any TypeScript monorepo
- Eliminate duplication across projects
- Community benefit
- Centralized maintenance

**Project-specific tools (keep in template):**
- `duplication-check.ts` - Wrapper for jscpd (project-specific configuration)
- `jscpd-check-new.ts` - Baseline approach (project-specific strategy)
- `jscpd-update-baseline.ts` - Baseline management (project-specific)

### 4. Update CLAUDE.md Documentation

Add guidance about when to use `@vibe-validate/utils`:

```markdown
## Cross-Platform Development

Use `@vibe-validate/utils` for all command execution and path operations:

- **Command execution**: Use `safeExecSync()` instead of `child_process.execSync`
- **Path operations**: Use `normalizedTmpdir()`, `mkdirSyncReal()`, `normalizePath()`
- **Tool detection**: Use `isToolAvailable()`, `getToolVersion()`

These utilities handle Windows edge cases (8.3 short names, shell scripts) and
provide better security (shell:false by default).
```

## Implementation Plan

1. ✅ Add custom ESLint rules documentation to CLAUDE.md (completed)
2. ⏳ Add `@vibe-validate/utils` as devDependency to package.json
3. ⏳ Refactor `tools/common.ts` to import from `@vibe-validate/utils`
4. ⏳ Update all tools to use the new imports
5. ⏳ Test all tools still work correctly
6. ⏳ Update CLAUDE.md with cross-platform development guidance
7. ⏳ Consider contributing bump-version, pre-publish-check, determine-publish-tags to vibe-validate

## Questions for Discussion

1. **Contribution scope**: Should we create a new `@vibe-validate/publish-tools` package?
2. **Adaptation needed**: Do the publishing tools need any changes before contributing?
3. **Monorepo assumptions**: Are the tools too specific to bun workspaces, or are they generic enough for pnpm/npm/yarn workspaces?
