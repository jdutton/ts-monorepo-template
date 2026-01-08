# Cross-Platform Path Utilities - Complete Example

This document demonstrates all cross-platform path utilities and explains **why** they exist.

## The Problem: Windows 8.3 Short Path Names

Windows can create paths with "8.3 short names" (legacy DOS format):
- **Short**: `C:\Users\RUNNER~1\AppData\Local\Temp`
- **Long**: `C:\Users\runneradmin\AppData\Local\Temp`

**Why this breaks tests:**
```typescript
// ❌ BROKEN on Windows CI
const testDir = path.join(os.tmpdir(), 'my-test');
// os.tmpdir() returns: C:\Users\RUNNER~1\...
mkdirSync(testDir);
// But mkdirSync CREATES: C:\Users\runneradmin\...\my-test

// Now this fails:
existsSync(testDir); // false! Path mismatch
```

This is the **"works on Mac, fails on Windows CI"** pattern.

## The Solution: Our Cross-Platform Utilities

### 1. `normalizedTmpdir()` - Get Real Temp Directory

**Why:** `os.tmpdir()` returns short paths on Windows.

```typescript
import { tmpdir } from 'node:os';
import { normalizedTmpdir } from '@ts-monorepo-template/example-utils';

// ❌ WRONG - May return RUNNER~1 on Windows
const temp1 = tmpdir();
console.log(temp1); // C:\Users\RUNNER~1\AppData\Local\Temp

// ✅ RIGHT - Always returns real path
const temp2 = normalizedTmpdir();
console.log(temp2); // C:\Users\runneradmin\AppData\Local\Temp
```

**Use case:** Creating test directories, temporary files, CI/CD workflows.

---

### 2. `mkdirSyncReal()` - Create Directory with Real Path

**Why:** After creating a directory, you need the **real** path for subsequent operations.

```typescript
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { mkdirSyncReal, normalizedTmpdir } from '@ts-monorepo-template/example-utils';

// ❌ WRONG - Path mismatch on Windows
const testDir1 = join(tmpdir(), 'test-dir');
mkdirSync(testDir1, { recursive: true });
// testDir1: C:\Users\RUNNER~1\...\test-dir
// But filesystem created: C:\Users\runneradmin\...\test-dir
// Future existsSync(testDir1) → false ❌

// ✅ RIGHT - Returns real path
const testDir2 = mkdirSyncReal(
  join(normalizedTmpdir(), 'test-dir'),
  { recursive: true }
);
// testDir2: C:\Users\runneradmin\...\test-dir
// Future existsSync(testDir2) → true ✅
```

**Use case:** Test fixtures, build output directories, data directories.

---

### 3. `normalizePath()` - Resolve Short Names Anywhere

**Why:** Resolve Windows short names in ANY path (not just temp directories).

```typescript
import { normalizePath } from '@ts-monorepo-template/example-utils';

// ❌ WRONG - Short path causes issues
const shortPath = 'C:\\PROGRA~1\\nodejs\\node.exe';
console.log(shortPath); // C:\PROGRA~1\nodejs\node.exe

// ✅ RIGHT - Resolves to real path
const longPath = normalizePath(shortPath);
console.log(longPath); // C:\Program Files\nodejs\node.exe

// Also works like path.resolve() for convenience:
const cliPath = normalizePath(__dirname, '../../dist/bin.js');
// Resolves to absolute path AND normalizes short names
```

**Use case:** Resolving executable paths, comparing paths, config file paths.

---

### 4. `toForwardSlash()` - Consistent Path Separators

**Why:** Windows accepts both `\` and `/`, but comparisons and globs need consistency.

```typescript
import { toForwardSlash } from '@ts-monorepo-template/example-utils';

// Windows path with backslashes
const windowsPath = 'C:\\Users\\docs\\README.md';

// Convert to forward slashes (works on Windows!)
const forwardPath = toForwardSlash(windowsPath);
console.log(forwardPath); // C:/Users/docs/README.md

// Use case: Glob patterns
const pattern = toForwardSlash(join(projectRoot, 'src/**/*.ts'));
// Glob libraries expect forward slashes even on Windows
```

**Use case:** Glob patterns, string comparisons, JSON output, cross-platform config.

---

### 5. `toAbsolutePath()` - Convert Relative to Absolute

**Why:** Ensure paths are absolute before operations (platform-aware).

```typescript
import { toAbsolutePath, toForwardSlash } from '@ts-monorepo-template/example-utils';

// Convert relative to absolute
const absPath1 = toAbsolutePath('./docs/README.md', '/project');
console.log(absPath1);
// Unix: /project/docs/README.md
// Windows: \project\docs\README.md (platform-specific separators)

// Already absolute? Returns normalized
const absPath2 = toAbsolutePath('/usr/local/bin');
console.log(absPath2);
// Unix: /usr/local/bin
// Windows: \usr\local\bin (normalized to Windows format)

// Need consistent forward slashes? Combine utilities:
const consistent = toForwardSlash(toAbsolutePath('./docs/README.md', '/project'));
console.log(consistent); // /project/docs/README.md (all platforms)
```

**Use case:** Resolving config paths, CLI arguments, module resolution.

---

### 6. `isAbsolutePath()` - Cross-Platform Detection

**Why:** Detect absolute paths on any platform.

```typescript
import { isAbsolutePath } from '@ts-monorepo-template/example-utils';

// Unix paths
console.log(isAbsolutePath('/usr/local/bin')); // true
console.log(isAbsolutePath('./relative')); // false

// Windows paths
console.log(isAbsolutePath('C:\\Windows')); // true
console.log(isAbsolutePath('C:/Windows')); // true (forward slash works!)
console.log(isAbsolutePath('.\\relative')); // false
```

**Use case:** Validating user input, CLI argument parsing, path resolution logic.

---

### 7. `getRelativePath()` - Navigate Between Files

**Why:** Generate relative links (markdown, imports, etc.).

```typescript
import { getRelativePath } from '@ts-monorepo-template/example-utils';

// Navigate from one file to another
const rel1 = getRelativePath(
  '/project/docs/guide.md',
  '/project/README.md'
);
console.log(rel1); // ../README.md

const rel2 = getRelativePath(
  '/project/README.md',
  '/project/docs/api.md'
);
console.log(rel2); // docs/api.md
```

**Use case:** Markdown link generation, import path calculation, documentation tools.

---

## Real-World Example: Test Suite Setup

Here's a complete example showing how these utilities work together:

```typescript
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getRelativePath,
  mkdirSyncReal,
  normalizePath,
  normalizedTmpdir,
  toForwardSlash,
} from '@ts-monorepo-template/example-utils';

describe('Cross-Platform Test Suite', () => {
  let testDir: string;

  beforeEach(() => {
    // ✅ Create test directory with real path
    testDir = mkdirSyncReal(
      join(normalizedTmpdir(), 'my-test-suite'),
      { recursive: true }
    );

    // This works on Windows CI because we have the REAL path
    console.log('Test directory:', testDir);
  });

  afterEach(() => {
    // Cleanup (omitted for brevity)
  });

  it('should handle paths correctly cross-platform', () => {
    // ✅ All operations work because paths are normalized
    expect(existsSync(testDir)).toBe(true);

    // Create subdirectory
    const subDir = mkdirSyncReal(join(testDir, 'sub'), { recursive: true });
    expect(existsSync(subDir)).toBe(true);

    // Normalize any path from user input
    const userPath = process.env.DATA_DIR ?? 'C:\\PROGRA~1\\data';
    const normalizedUserPath = normalizePath(userPath);

    // Get relative path for logging
    const relPath = getRelativePath(testDir, subDir);
    console.log('Relative path:', relPath); // sub

    // Ensure consistent forward slashes for comparisons
    const forwardPath = toForwardSlash(testDir);
    expect(forwardPath).toMatch(/\//); // Contains forward slashes
  });
});
```

## ESLint Rules Enforce Best Practices

Custom ESLint rules automatically catch violations:

```typescript
// ❌ ESLint error: Use normalizedTmpdir() instead
const temp = os.tmpdir();

// ❌ ESLint error: Use mkdirSyncReal() instead
fs.mkdirSync(testDir);

// ❌ ESLint error: Use normalizePath() instead
const real = fs.realpathSync(somePath);

// ✅ All correct - ESLint passes
const temp = normalizedTmpdir();
const dir = mkdirSyncReal(join(temp, 'test'));
const normalized = normalizePath(dir);
```

**Why ESLint rules?** AI code generation (Claude, Copilot) can reintroduce these bugs. ESLint catches them instantly.

## Summary

| Utility | Purpose | Prevents |
|---------|---------|----------|
| `normalizedTmpdir()` | Get real temp path | Windows short path in tmpdir |
| `mkdirSyncReal()` | Create dir + get real path | Path mismatch after mkdir |
| `normalizePath()` | Resolve short names anywhere | PROGRA~1 and RUNNER~1 issues |
| `toForwardSlash()` | Consistent separators | Glob patterns failing on Windows |
| `toAbsolutePath()` | Relative → absolute | Relative path issues |
| `isAbsolutePath()` | Detect absolute paths | Path type confusion |
| `getRelativePath()` | Navigate between files | Incorrect relative links |

## Key Takeaway

**Pattern:** "Works on Mac, fails on Windows CI" → Use these utilities.

**For Agentic Development:** ESLint rules ensure AI never reintroduces these bugs.

**Test Locally:** Run tests on Windows (or use Windows CI) to catch these issues early.
