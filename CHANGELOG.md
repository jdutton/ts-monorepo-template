# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **`@next` dist-tag now updated on stable npm releases** — `publish-with-rollback.ts` adds a Phase 2 that applies `npm dist-tag add <pkg>@<version> next` to all packages when `UPDATE_NEXT=true`; set this env var from your publish workflow (e.g. via `determine-publish-tags.ts`) so that after a stable release `@next` points to it rather than staying pinned to the last RC

### Added
- Initial monorepo template setup
- TypeScript configuration with strict mode
- ESLint with sonarjs, unicorn, and security plugins
- Vitest for unit, integration, and system testing
- vibe-validate for git-aware validation
- Code duplication checking with jscpd
- CI/CD with GitHub Actions (Node 22/24, Ubuntu/Windows)
- Pre-commit hooks with Husky
- Cross-platform development tools
- Example package demonstrating patterns

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

## [0.1.0] - 2025-12-26

### Added
- Initial release of TypeScript Monorepo Template
