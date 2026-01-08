/**
 * Tests for cross-platform path utilities
 *
 * These utilities handle Windows 8.3 short path names (RUNNER~1)
 * and ensure consistent path handling across platforms.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join, sep } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  getRelativePath,
  isAbsolutePath,
  mkdirSyncReal,
  normalizePath,
  normalizedTmpdir,
  toAbsolutePath,
  toForwardSlash,
} from '../src/path-utils.js';

// Test constants
const TEST_DIR_NAME = 'test-dir';
const TEST_UNIX_PATH = '/home/user';
const TEST_RELATIVE_PATH = 'foo/bar/baz';
const TEST_ABSOLUTE_PATH = '/usr/local/bin';

describe('normalizePath', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(normalizedTmpdir(), 'path-utils-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should normalize a single relative path without filesystem resolution', () => {
    const result = normalizePath('foo/bar');
    expect(result).toBe(join('foo', 'bar'));
  });

  it('should resolve absolute paths using realpathSync.native', () => {
    const result = normalizePath(tempDir);
    expect(result).toBe(tempDir); // Should match the real path
  });

  it('should handle two-argument form (base, relative)', () => {
    const result = normalizePath('subdir', tempDir);
    expect(result).toContain('subdir');
    expect(result).toContain(tempDir);
  });

  it('should handle multiple path segments', () => {
    const result = normalizePath(tempDir, 'foo', 'bar', 'baz');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
    expect(result).toContain('baz');
  });

  it('should fall back to realpathSync if native fails', async () => {
    // Create a file to test with
    const testFile = join(tempDir, 'test.txt');
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- Test file with dynamic path
    await writeFile(testFile, 'test');

    const result = normalizePath(testFile);
    expect(result).toContain('test.txt');
  });

  it('should return the resolved path if realpath fails', () => {
    const nonExistent = join(tempDir, 'does-not-exist');
    const result = normalizePath(nonExistent);
    expect(result).toContain('does-not-exist');
  });
});

describe('normalizedTmpdir', () => {
  it('should return a normalized temp directory path', () => {
    const result = normalizedTmpdir();
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    // Should not contain Windows 8.3 short names like RUNNER~1
    expect(result).not.toMatch(/~\d/);
  });

  it('should return the same path on multiple calls', () => {
    const first = normalizedTmpdir();
    const second = normalizedTmpdir();
    expect(first).toBe(second);
  });
});

describe('mkdirSyncReal', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(normalizedTmpdir(), 'mkdir-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should create directory and return normalized path', () => {
    const newDir = join(tempDir, TEST_DIR_NAME);
    const result = mkdirSyncReal(newDir);

    expect(result).toBeTruthy();
    expect(result).toContain(TEST_DIR_NAME);
    // Should not contain Windows 8.3 short names
    expect(result).not.toMatch(/~\d/);
  });

  it('should create nested directories with recursive option', () => {
    const nestedDir = join(tempDir, 'a', 'b', 'c');
    const result = mkdirSyncReal(nestedDir, { recursive: true });

    expect(result).toBeTruthy();
    expect(result).toContain('a');
    expect(result).toContain('b');
    expect(result).toContain('c');
  });

  it('should handle existing directories with recursive option', () => {
    const existingDir = mkdirSyncReal(join(tempDir, 'existing'), { recursive: true });
    const result = mkdirSyncReal(join(tempDir, 'existing'), { recursive: true });

    expect(result).toBe(existingDir);
  });
});

describe('isAbsolutePath', () => {
  it('should return true for absolute Unix paths', () => {
    expect(isAbsolutePath(TEST_ABSOLUTE_PATH)).toBe(true);
    expect(isAbsolutePath(TEST_UNIX_PATH)).toBe(true);
  });

  it.skipIf(sep !== '\\')('should return true for absolute Windows paths', () => {
    expect(isAbsolutePath(String.raw`C:\Users\test`)).toBe(true);
    expect(isAbsolutePath(String.raw`D:\Data`)).toBe(true);
  });

  it('should return false for relative paths', () => {
    expect(isAbsolutePath('foo/bar')).toBe(false);
    expect(isAbsolutePath('./test')).toBe(false);
    expect(isAbsolutePath('../parent')).toBe(false);
  });

  it('should handle empty strings', () => {
    expect(isAbsolutePath('')).toBe(false);
  });
});

describe('toAbsolutePath', () => {
  it('should return absolute path normalized for platform', () => {
    const result = toAbsolutePath(TEST_ABSOLUTE_PATH);
    // On Windows, this converts / to \, which is expected platform-specific behavior
    expect(isAbsolutePath(result)).toBe(true);
    expect(result).toContain('usr');
    expect(result).toContain('local');
    expect(result).toContain('bin');
  });

  it('should convert relative path to absolute using baseDir', () => {
    const result = toAbsolutePath('foo/bar', '/base');
    expect(result).toContain('base');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('should use cwd when no baseDir provided', () => {
    const result = toAbsolutePath('foo/bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it.skipIf(sep !== '\\')('should handle Windows-style paths', () => {
    const result = toAbsolutePath(String.raw`foo\bar`, String.raw`C:\base`);
    expect(result).toContain('base');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });
});

describe('getRelativePath', () => {
  it('should compute relative path between two file paths', () => {
    const from = `${TEST_UNIX_PATH}/projects/file.md`;
    const to = `${TEST_UNIX_PATH}/documents/other.md`;
    const result = getRelativePath(from, to);

    expect(result).toContain('..');
    expect(result).toContain('documents');
  });

  it('should return target filename for same directory', () => {
    const from = `${TEST_UNIX_PATH}/test/file.md`;
    const to = `${TEST_UNIX_PATH}/test/other.md`;
    const result = getRelativePath(from, to);

    expect(result).toBe('other.md');
  });

  it('should handle nested file paths', () => {
    const from = `${TEST_UNIX_PATH}/file.md`;
    const to = `${TEST_UNIX_PATH}/projects/app/other.md`;
    const result = getRelativePath(from, to);

    expect(result).toContain('projects');
    expect(result).toContain('app');
    expect(result).toContain('other.md');
  });

  it.skipIf(sep !== '\\')('should work with Windows-style file paths', () => {
    const from = String.raw`C:\Users\test\file.md`;
    const to = String.raw`C:\Users\test\Documents\other.md`;
    const result = getRelativePath(from, to);

    expect(result).toContain('Documents');
    expect(result).toContain('other.md');
  });
});

describe('toForwardSlash', () => {
  it('should convert backslashes to forward slashes', () => {
    expect(toForwardSlash(String.raw`C:\Users\test`)).toBe('C:/Users/test');
    expect(toForwardSlash(String.raw`foo\bar\baz`)).toBe(TEST_RELATIVE_PATH);
  });

  it('should leave forward slashes unchanged', () => {
    expect(toForwardSlash(TEST_ABSOLUTE_PATH)).toBe(TEST_ABSOLUTE_PATH);
    expect(toForwardSlash(TEST_RELATIVE_PATH)).toBe(TEST_RELATIVE_PATH);
  });

  it('should handle mixed slashes', () => {
    expect(toForwardSlash(String.raw`C:\Users/test\Documents`)).toBe('C:/Users/test/Documents');
  });

  it('should handle empty strings', () => {
    expect(toForwardSlash('')).toBe('');
  });

  it('should preserve UNC paths', () => {
    expect(toForwardSlash(String.raw`\\server\share\file`)).toBe('//server/share/file');
  });
});
