# Template Validation Checklist

This document helps validate that the template is set up correctly.

## Example Package

The `packages/example-utils/` package contains minimal working code:

### Source Code
- ✅ `src/string-utils.ts` - 3 utility functions
- ✅ `src/index.ts` - Main exports
- ✅ All clearly marked as "EXAMPLE - DELETE WHEN USING TEMPLATE"

### Tests
- ✅ `test/string-utils.test.ts` - Unit tests (16 test cases)
- ✅ `test/integration/workflow.integration.test.ts` - Integration tests (3 test cases)
- ✅ Tests cover all functions with multiple scenarios

### Coverage Targets
The example code achieves:
- 100% statement coverage
- 100% branch coverage
- 100% function coverage
- 100% line coverage

This exceeds the 80% minimum threshold and validates the coverage setup.

## Validation Commands

Run these commands to validate the template:

### 1. Install Dependencies
```bash
bun install
```
Expected: ✅ All dependencies installed successfully

### 2. Build Packages
```bash
bun run build
```
Expected:
- ✅ TypeScript compiles without errors
- ✅ `packages/example-utils/dist/` created with .js and .d.ts files

### 3. Type Checking
```bash
bun run typecheck
```
Expected: ✅ No type errors

### 4. Linting
```bash
bun run lint
```
Expected:
- ✅ Zero warnings
- ✅ All ESLint rules pass

### 5. Unit Tests
```bash
bun test
```
Expected:
- ✅ 16 tests pass
- ✅ All assertions succeed

### 6. Integration Tests
```bash
bun run test:integration
```
Expected:
- ✅ 3 integration tests pass

### 7. Code Coverage
```bash
bun run test:coverage
```
Expected:
- ✅ 100% coverage achieved
- ✅ Exceeds 80% threshold
- ✅ Coverage report generated in `coverage/`

### 8. Code Duplication
```bash
bun run duplication-check
```
Expected:
- ✅ Creates baseline on first run (`.github/.jscpd-baseline.json`)
- ✅ No new duplication on subsequent runs

### 9. Full Validation
```bash
bun run validate
```
Expected: ✅ All validation phases pass

### 10. Pre-commit Hook
```bash
# Make a trivial change and commit
echo "# Test" >> test-file.md
git add test-file.md
git commit -m "test: validate pre-commit"
```
Expected:
- ✅ Pre-commit hook runs `vibe-validate pre-commit`
- ✅ Fast validation checks pass
- ✅ Commit succeeds

## CI/CD Validation

After pushing to GitHub:

### Validation Pipeline
- ✅ Runs on push/PR
- ✅ Tests on Node 22 and 24
- ✅ Tests on Ubuntu and Windows
- ✅ All checks pass

### Coverage Reporting
- ✅ Coverage uploaded to Codecov
- ✅ Coverage report appears on PR
- ✅ Meets 80% threshold

## Cleanup After Validation

Once validation is complete, clean up the example package:

```bash
# Remove example package
rm -rf packages/example-utils

# Update root tsconfig.json - remove reference
# Edit tsconfig.json and remove: { "path": "./packages/example-utils" }

# Reinstall
bun install

# Verify clean slate
bun run build  # Should succeed with no packages
```

## Common Issues

### Build Fails
- Check Node version: `node --version` (should be 22 or 24)
- Check bun version: `bun --version`
- Clean: `bun run build:clean`

### Tests Fail
- Check if built: `bun run build`
- Check for typos in imports
- Run with verbose: `bun test --reporter=verbose`

### Coverage Too Low
- The example package has 100% coverage
- If coverage is lower, check if all test files are running
- Verify `vitest.config.ts` includes correct patterns

### Lint Fails
- Fix automatically: `bun run lint:fix`
- Check for shell commands in code (must use TypeScript/Node.js APIs)
- Check for missing type annotations

### Pre-commit Hook Doesn't Run
- Reinstall: `bun install` (runs `husky` prepare script)
- Check executable: `ls -la .husky/pre-commit`
- Manually run: `npx vibe-validate pre-commit`

## Success Criteria

The template is validated when:

1. ✅ All 10 validation commands pass
2. ✅ CI/CD pipelines pass on GitHub
3. ✅ Codecov reports 100% coverage
4. ✅ Pre-commit hooks work correctly
5. ✅ No ESLint warnings or errors
6. ✅ No TypeScript errors
7. ✅ No code duplication detected
8. ✅ All tests pass on all platforms

When all criteria are met, the template is production-ready! 🚀
