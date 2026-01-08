# @ts-monorepo-template/example-utils

> **⚠️ EXAMPLE PACKAGE - DELETE WHEN USING THIS TEMPLATE**
>
> This package exists only to validate the template setup. Delete it when creating your own project.

Example utility package demonstrating TypeScript monorepo patterns and cross-platform compatibility.

## Installation

```bash
npm install @ts-monorepo-template/example-utils
# or
bun add @ts-monorepo-template/example-utils
```

## Cross-Platform Path Utilities

This package provides utilities for handling file paths consistently across platforms, particularly addressing Windows 8.3 short path names (RUNNER~1) that can cause test failures on Windows CI.

### The Windows 8.3 Short Path Problem

On Windows CI (GitHub Actions), Node.js operations create files with long names but Windows may use 8.3 short names (RUNNER~1) in paths. This causes test failures when comparing paths because:
- `fs.mkdirSync()` might create a directory with a long name
- But `os.tmpdir()` returns the path with a short name (e.g., `RUNNER~1`)
- Path comparisons fail because `/path/RUNNER~1/test` !== `/path/runner-long-name/test`

These utilities use `realpathSync.native()` to resolve paths to their actual filesystem representation, ensuring consistent behavior across platforms.

### Path Utilities API

#### `normalizePath(...paths: string[]): string`

Normalizes paths and resolves Windows short names using `realpathSync.native()` with fallbacks.

**Behavior:**
- Single relative path: returns normalized without filesystem resolution
- Single absolute path: resolves to real filesystem path
- Two arguments (relative, base): resolves relative to base directory
- Multiple arguments: resolves path segments and returns real path

**Example:**
```typescript
import { normalizePath } from '@ts-monorepo-template/example-utils';

// Relative path (no filesystem access)
normalizePath('foo/bar'); // 'foo/bar'

// Absolute path (resolves Windows short names)
normalizePath('C:\\Users\\RUNNER~1\\temp'); // 'C:/Users/runner-long-name/temp'

// Base + relative
normalizePath('subdir', '/base/path'); // '/base/path/subdir' (normalized)

// Multiple segments
normalizePath('/base', 'foo', 'bar'); // '/base/foo/bar' (normalized)
```

#### `normalizedTmpdir(): string`

Returns the real temp directory path (not Windows 8.3 short names). Result is cached for consistent behavior.

**Example:**
```typescript
import { normalizedTmpdir } from '@ts-monorepo-template/example-utils';

// Instead of os.tmpdir() which returns RUNNER~1 on Windows CI
const tempDir = normalizedTmpdir(); // Real path without short names
```

#### `mkdirSyncReal(dirPath: string, options?: MkdirOptions): string`

Creates directory and returns the real normalized path. Handles Windows short names by resolving the created path to its actual filesystem representation.

**Example:**
```typescript
import { mkdirSyncReal } from '@ts-monorepo-template/example-utils';

// Returns real path (not short name)
const realPath = mkdirSyncReal('/temp/new-dir', { recursive: true });
// realPath is guaranteed to match filesystem reality
```

#### `isAbsolutePath(p: string): boolean`

Checks if a path is absolute (cross-platform).

**Example:**
```typescript
import { isAbsolutePath } from '@ts-monorepo-template/example-utils';

isAbsolutePath('/usr/local/bin'); // true
isAbsolutePath('C:\\Users\\test'); // true
isAbsolutePath('foo/bar'); // false
isAbsolutePath('./test'); // false
```

#### `toAbsolutePath(p: string, baseDir?: string): string`

Converts relative path to absolute using baseDir or cwd.

**Example:**
```typescript
import { toAbsolutePath } from '@ts-monorepo-template/example-utils';

// With baseDir
toAbsolutePath('foo/bar', '/base'); // '/base/foo/bar'

// Without baseDir (uses cwd)
toAbsolutePath('foo/bar'); // '<cwd>/foo/bar'
```

#### `getRelativePath(from: string, to: string): string`

Computes relative path between two file paths (not directories).

**Example:**
```typescript
import { getRelativePath } from '@ts-monorepo-template/example-utils';

getRelativePath('/docs/guide/file.md', '/docs/api/other.md');
// '../api/other.md'

getRelativePath('/docs/file.md', '/docs/other.md');
// 'other.md'
```

#### `toForwardSlash(p: string): string`

Converts backslashes to forward slashes for cross-platform display.

**Example:**
```typescript
import { toForwardSlash } from '@ts-monorepo-template/example-utils';

toForwardSlash('C:\\Users\\test'); // 'C:/Users/test'
toForwardSlash('foo\\bar\\baz'); // 'foo/bar/baz'
toForwardSlash('foo/bar'); // 'foo/bar' (unchanged)
```

### Test Utilities API

#### `getTestOutputDir(packageName: string, testType: 'unit' | 'integration' | 'system', ...subdirs: string[]): string`

Creates unique timestamped test output directories for isolated test runs.

**Example:**
```typescript
import { getTestOutputDir } from '@ts-monorepo-template/example-utils';

// Creates: packages/my-pkg/.test-output/unit/2026-01-08T12-34-56-abc123/my-test/
const testDir = getTestOutputDir('my-pkg', 'unit', 'my-test');
```

#### `getTestOutputBase(packageName: string): string`

Returns base test output directory for a package.

**Example:**
```typescript
import { getTestOutputBase } from '@ts-monorepo-template/example-utils';

const baseDir = getTestOutputBase('my-pkg');
// Returns: packages/my-pkg/.test-output
```

## String Utilities (Example - Delete These)

### `capitalize(str: string): string`

Capitalizes the first letter of a string.

### `isEmpty(str: string): boolean`

Checks if a string is empty or only whitespace.

### `truncate(str: string, maxLength: number, suffix?: string): string`

Truncates a string to a maximum length with an optional suffix (default: '...').

## License

MIT
