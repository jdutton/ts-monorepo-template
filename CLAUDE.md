# Project Development Guidelines

This document provides guidance for AI assistants and developers working on this TypeScript monorepo.

## Project Structure

This is a TypeScript monorepo using:
- **Package Manager**: Bun
- **Build Tool**: TypeScript compiler (tsc)
- **Testing**: Vitest
- **Linting**: ESLint with strict rules (sonarjs, unicorn, security plugins)
- **Validation**: vibe-validate for git-aware validation orchestration
- **CI/CD**: GitHub Actions with Node 22/24 on Ubuntu/Windows

## Monorepo Architecture

```
ts-monorepo-template/
├── packages/          # Published packages
│   └── */            # Each package is independently publishable
├── tools/            # Build and development tools (TypeScript)
├── docs/             # Documentation
├── .github/          # CI/CD workflows
└── [config files]    # Root-level configuration
```

## Coding Standards

### TypeScript Configuration

- **Target**: ES2024
- **Module**: NodeNext (ESM)
- **Strict Mode**: Enabled with additional strictness:
  - `noUncheckedIndexedAccess: true`
  - `noImplicitOverride: true`
  - `exactOptionalPropertyTypes: true`

### ESLint Rules

- **Zero Warnings Policy**: `--max-warnings=0`
- **Cognitive Complexity**: Max 15 (matches SonarQube sonarway)
- **Nesting Depth**: Max 4 levels (matches SonarQube sonarway)
- **No Explicit Any**: Errors in production code, allowed in tests
- **Readonly Class Members**: Required for never-reassigned members
- **Security**: Full security plugin rules enforced
- **Import Organization**: Alphabetical with newlines between groups
- **String Escaping**: Prefer `String.raw` for backslashes

### Code Quality Thresholds

- **Test Coverage**: 80% minimum (statements, branches, functions, lines)
- **Code Duplication**: Baseline approach - no NEW duplication allowed
- **SonarQube**: Configured for free tier (sonarway) - ESLint catches issues first

## Testing Conventions

All packages must follow these testing patterns for consistency:

### Test File Naming

1. **Unit Tests**: `*.test.ts` or `*.spec.ts`
   - Location: `test/` directory (NOT co-located with source)
   - Purpose: Test individual functions/classes in isolation
   - Mock external dependencies
   - Fast execution (< 100ms per test)

2. **Integration Tests**: `*.integration.test.ts`
   - Location: `test/integration/` directory
   - Purpose: Test multiple modules working together
   - May use real dependencies (file system, databases)
   - Medium execution time (< 5s per test)
   - Run with: `bun run test:integration`

3. **System Tests**: `*.system.test.ts`
   - Location: `test/system/` directory
   - Purpose: End-to-end testing of complete workflows
   - Use real external services when possible
   - Longer execution time (< 30s per test)
   - Run with: `bun run test:system`

### Test Organization Example

```
packages/my-package/
├── src/
│   └── utils.ts               # Source code only
├── test/
│   ├── utils.test.ts          # Unit tests
│   ├── integration/
│   │   └── workflow.integration.test.ts
│   └── system/
│       └── e2e.system.test.ts
└── package.json
```

### Test Standards

- All tests must be **cross-platform** (Windows, macOS, Linux)
- Use absolute paths with `path.resolve()` for file operations
- Clean up temp files/directories in `afterEach` hooks
- Use descriptive test names: `it('should [expected behavior] when [condition]')`
- One assertion per test when practical
- Prefer `toThrow()` over try-catch blocks for error testing

### Running Tests

```bash
# Unit tests only (default)
bun test

# Watch mode for development
bun test:watch

# Integration tests
bun test:integration

# System tests
bun test:system

# All tests with coverage
bun test:coverage
```

## Development Workflow

### Pre-Commit Checklist

Before committing, ensure:
1. `bun run lint` passes with zero warnings
2. `bun run typecheck` passes
3. `bun run test` passes
4. `bun run duplication-check` passes (or baseline updated)
5. All files formatted correctly (enforced by .editorconfig)

Pre-commit hooks via Husky will enforce these automatically.

### Adding New Packages

1. Create directory: `packages/my-package/`
2. Add package.json (see `packages/example-utils/package.json`)
3. Add tsconfig.json extending `../../tsconfig.base.json`
4. Add to root `tsconfig.json` references
5. Create src/, test/ directories
6. Add README.md with usage examples
7. Run `bun install` to link workspace dependencies

### Code Review Standards

- Follow Clean Code principles (DRY, SOLID, KISS)
- No SonarQube "code smells" or vulnerabilities
- All code must have tests (aim for >80% coverage)
- Document public APIs with JSDoc comments
- Commit messages follow conventional commits format

## Build & Publish

### Building

```bash
# Build all packages
bun run build

# Clean build
bun run build:clean
```

### Publishing (when ready)

Packages are published to npm with:
- Automatic version management
- Changelog generation
- GitHub releases
- npm provenance

Release tools will be added when packages are ready for publication.

## CI/CD

GitHub Actions runs on every push/PR:
- Matrix: Node 22/24 × Ubuntu/Windows
- Validation via vibe-validate
- All checks must pass before merge

## Architecture Principles

- **Monorepo-First**: Shared tooling, consistent standards
- **Type-Safe**: Strict TypeScript, no `any` in production
- **DRY**: Extract common code to shared packages
- **TDD**: Write tests first, maintain high coverage
- **Security-First**: ESLint security rules, no command injection
- **Cross-Platform**: All code works on Windows/macOS/Linux

## Enterprise Software Development Best Practices

Apply these industry-standard practices regardless of what this monorepo is used for.

### Core Principles (You Already Know These)

Follow these established patterns:
- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Don't Repeat Yourself - extract to shared packages in monorepo context
- **TDD**: Test-Driven Development - Red-Green-Refactor cycle
- **Clean Code**: Robert C. Martin's principles
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It

### Monorepo-Specific DRY Application

When you see duplication across packages:
1. Extract to `packages/shared-*` (shared-utils, shared-types, shared-validators)
2. Use constants objects (see `JSCPD_CONFIG` in common.ts as example)
3. Share TypeScript types via dedicated types package
4. Extract reusable build logic to helper functions

Wait for 3+ instances before extracting (avoid premature abstraction).

### Error Handling Patterns

Use these approaches:
- **Typed Errors**: Custom error classes (ValidationError, NotFoundError, etc.)
- **Result Types**: `Result<T, E>` for expected failures (see functional programming patterns)
- **Fail Fast**: Validate inputs early, throw immediately on invalid state

### Code Quality Standards

**TypeScript**:
- No `any` in production code (use `unknown` if truly dynamic)
- Explicit return types on all functions
- Use type guards for narrowing

**Testing**:
- TDD for business logic
- Test error paths (don't just test happy path)
- Use descriptive test names: `should [behavior] when [condition]`

**Documentation**:
- JSDoc for public APIs with @param, @returns, @example
- Inline comments explain WHY, not WHAT
- README per package: purpose, installation, quick start, API

### Code Review Checklist

- [ ] No `console.log` in production (use proper logging)
- [ ] No hardcoded secrets
- [ ] No `@ts-ignore` without explanation
- [ ] No `any` without justification
- [ ] Tests exist and cover edge cases
- [ ] Cross-platform compatible (paths, line endings)
- [ ] DRY: no duplication that should be extracted

### Technical Debt Management

**Duplication Baseline Approach** (already configured):
- Baseline existing duplication
- Prevent NEW duplication (zero tolerance)
- Gradually reduce baseline through refactoring

**TODO Format**:
```typescript
// TODO(username, YYYY-MM-DD): Reason and context
```

### Monorepo-Specific Patterns

- **Package Boundaries**: Each package independently useful, avoid circular deps
- **Shared Code**: Create shared-* packages, version carefully (breaking changes affect all consumers)
- **Build Order**: Respect dependency graph, use TypeScript project references
- **Testing**: Test packages in isolation + integration between packages

## Development Tools Package

All tools are TypeScript (not shell scripts) for cross-platform compatibility:

Located in `packages/dev-tools/src/`:
- `common.ts` - Shared utilities (safeExecSync, logging, etc.)
- `duplication-check.ts` - jscpd wrapper
- `jscpd-check-new.ts` - Smart duplication detection
- `jscpd-update-baseline.ts` - Update duplication baseline
- `bump-version.ts` - Version management for monorepo
- `pre-publish-check.ts` - Pre-publish validation
- `determine-publish-tags.ts` - npm dist-tag determination
- `run-in-packages.ts` - Run commands across all workspace packages

Custom ESLint rules in `packages/dev-tools/eslint-local-rules/`.

Tools follow same quality standards as packages (linted, typed, tested).

## Custom ESLint Rules - Agentic Code Safety Pattern

**Critical for AI-Heavy Development**: When working with agentic code (Claude, Cursor, Copilot), AI can easily reintroduce unsafe patterns that were previously fixed. Custom ESLint rules provide automatic guardrails that catch these issues during development.

### The Pattern: Identify → Create Rule → Never Repeat

**When you identify a dangerous pattern that was fixed:**
1. **Document why it's dangerous** (security, cross-platform, performance)
2. **Create a custom ESLint rule** in `packages/dev-tools/eslint-local-rules/`
3. **The pattern can never be reintroduced** - ESLint catches it automatically

This is "good overkill" - prevents technical debt from accumulating through AI-assisted development.

### Current Rules

Located in `packages/dev-tools/eslint-local-rules/`:

- **`no-child-process-execSync`** - Enforces `safeExecSync()` instead of raw `execSync()`
  - Why: `execSync()` uses shell interpreter → command injection risk
  - Why: `safeExecSync()` uses `which` pattern + no shell → cross-platform + secure
  - **Auto-fix**: Replaces `execSync` with `safeExecSync` and adds import

### Creating New Rules

When you identify a dangerous pattern (security, platform-specific, error-prone):

1. **Use the factory pattern** - See `eslint-rule-factory.cjs`
2. **Create rule file** in `packages/dev-tools/eslint-local-rules/`:

```javascript
// no-fs-unlinkSync.cjs
const factory = require('./eslint-rule-factory.cjs');

module.exports = factory({
  unsafeFn: 'unlinkSync',
  unsafeModule: 'node:fs',
  safeFn: 'safeUnlinkSync',
  safeModule: './common.js',
  message: 'Use safeUnlinkSync() for better error handling and cross-platform compatibility',
  exemptFile: 'common.ts', // Where the safe version is implemented
});
```

3. **Add to `index.js`**:
```javascript
export default {
  rules: {
    'no-child-process-execSync': require('./no-child-process-execSync.cjs'),
    'no-fs-unlinkSync': require('./no-fs-unlinkSync.cjs'), // New rule
  },
};
```

4. **Enable in `eslint.config.js`**:
```javascript
rules: {
  'local/no-child-process-execSync': 'error',
  'local/no-fs-unlinkSync': 'error', // New rule
}
```

### Why This Matters for Agentic Development

Without custom rules:
- ❌ AI reintroduces `execSync()` → security vulnerability
- ❌ AI uses `os.tmpdir()` → Windows path issues
- ❌ Manual code review catches it → time wasted, issue deployed

With custom rules:
- ✅ AI writes code → ESLint catches violation immediately
- ✅ Auto-fix available → AI or dev applies fix instantly
- ✅ Pattern enforced forever → never have to think about it again

**Best Practice**: Every time you fix a dangerous pattern, ask yourself: "Should this be a custom ESLint rule?" If yes, create it immediately.

## Questions?

- Review reference implementations in `packages/example-utils/`
- Check vibe-validate docs: https://github.com/jdutton/vibe-validate
- ESLint config: `eslint.config.js` (heavily documented)
- CI workflow: `.github/workflows/validate.yml`
