# Template Cloning Guide

This document provides step-by-step instructions for cloning this template to create a new project.

## Overview

This template is designed to be cloned and customized for new TypeScript monorepo projects. The cloning process involves:
1. Gathering project information
2. Cloning and preparing the repository
3. Performing systematic find-and-replace operations
4. Verifying the setup

## Pre-Cloning Questions

Before cloning, gather the following information about your new project:

### Required Information

1. **Project Name** (kebab-case): `my-new-project`
   - Used for: repository name, directory name, package scope

2. **Project Description**: What does your project do?
   - Example: "Toolkit for testing and packaging portable AI agents"

3. **Project Purpose/Domain**: What is the primary focus?
   - Examples: "AI agents", "data processing", "web framework"

4. **GitHub Repository**:
   - Owner/username: `yourusername`
   - Repository name: `my-new-project`
   - Full URL: `https://github.com/yourusername/my-new-project`

5. **Package Scope**: `@yourusername` or `@your-org`
   - Used for published packages

6. **Keywords** (5-10): Relevant npm keywords for your project
   - Example: `["ai", "agents", "testing", "typescript", "monorepo"]`

## Cloning Steps

### 1. Clone the Template

```bash
# Clone to new directory
git clone https://github.com/jdutton/ts-monorepo-template.git my-new-project
cd my-new-project

# Squash commit history to single initial commit
git checkout --orphan new-main
git add -A
git commit -m "Initial commit from ts-monorepo-template"
git branch -D main
git branch -m main
```

### 2. Update Git Remote

```bash
# Set new origin (use SSH)
git remote set-url origin git@github.com:yourusername/my-new-project.git

# Verify
git remote -v
```

### 3. Find and Replace Operations

Perform these replacements **in order**:

#### A. Project Name Replacement

Replace `ts-monorepo-template` with your project name everywhere:

```bash
# Find all occurrences (excluding node_modules, dist, bun.lock)
find . -type f \
  \( -name "*.json" -o -name "*.md" -o -name "*.js" -o -name "*.ts" -o -name "*.yml" -o -name "*.yaml" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -name "bun.lock" \
  -exec grep -l "ts-monorepo-template" {} \;

# Replace in all files
for file in $(find . -type f \
  \( -name "*.json" -o -name "*.md" -o -name "*.js" -o -name "*.ts" -o -name "*.yml" -o -name "*.yaml" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -name "bun.lock"); do
  sed -i '' 's/ts-monorepo-template/my-new-project/g' "$file"
done
```

#### B. GitHub Owner Replacement

Replace `jdutton` with your GitHub username:

```bash
# Find and replace
for file in $(find . -type f \
  \( -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" \) \
  ! -path "*/node_modules/*"); do
  sed -i '' 's/jdutton/yourusername/g' "$file"
done
```

#### C. Package Scope Replacement

Replace `@ts-monorepo-template` with your package scope:

```bash
# Find and replace
for file in $(find . -type f \
  \( -name "*.json" -o -name "*.md" -o -name "*.ts" \) \
  ! -path "*/node_modules/*"); do
  sed -i '' 's/@ts-monorepo-template/@your-org/g' "$file"
done
```

### 4. Update Project-Specific Content

Manually update these files with your project-specific information:

#### `package.json`
- Update `description`
- Update `keywords` array
- Update `author`

#### `README.md`
- Update title (line 1)
- Update description (line 5)
- Update "Features" section with project-specific features
- Remove/update example-utils references when you create real packages

#### `CHANGELOG.md`
- Update "Added" section in [Unreleased] with your project's initial features
- Update version 0.1.0 description

#### `docs/getting-started.md`
- Update title with your project name
- Update description in opening paragraph

#### `docs/README.md`
- Update welcome message

#### `LICENSE`
- Update year and copyright holder if needed

#### `packages/dev-tools/src/repo-structure-config.ts`
- Update `allowedScriptsPackages` if you have packages beyond `dev-tools` that need `/scripts`
- Add `noExamplesPatterns` if certain package naming patterns should not have `/examples` dirs
- Add `allowedPackageTsPaths` for any non-standard TypeScript file locations

#### `packages/dev-tools/src/package-lists.ts`
- Populate `PUBLISHED_PACKAGES` with your publishable package names in dependency order
- Update `SKIP_PACKAGES` as needed (keep `dev-tools` unless you rename it)

#### Files with `CUSTOMIZE` comments (search for `// CUSTOMIZE:`)
Several backported tools contain vibe-specific values that must be updated for your project:
- `fix-workspace-deps.ts` and `resolve-workspace-deps.ts` — update `SCOPE` to your npm scope
- `link-workspace-packages.ts` — update `WORKSPACE_SCOPE` and `WORKSPACE_PACKAGES` array
- `publish-with-rollback.ts` — update scope, umbrella package name, and issue tracker URL
- `common.ts` — update umbrella package name check
- `link-all.ts` — update global installation checks

### 5. Install Dependencies

```bash
# Remove old lockfile and install
rm bun.lock
bun install
```

### 6. Verify Setup

Run the full validation suite:

```bash
# Run all checks
bun run validate

# Or run individually:
bun run typecheck
bun run lint
bun run test
bun run build
bun run validate-structure  # Check repo structural conventions
```

All checks should pass before proceeding.

### 7. Review and Customize

1. **Delete `packages/example-utils/`** when you create your first real package
2. **Review `CLAUDE.md`** (if present) and update project-specific guidance
3. **Delete `TEMPLATE-CLONE-PROMPT.md`** (this file) - you don't need it anymore

### 8. Initial Commit and Push

```bash
# Commit all changes
git add -A
git commit -m "Configure project from ts-monorepo-template

- Updated project name to my-new-project
- Updated GitHub owner and repository references
- Updated package scopes
- Customized descriptions and keywords
- Installed dependencies

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to new repository (create on GitHub first!)
git push -u origin main
```

## Common Customizations

### Badge URLs

Update badges in README.md with your repository information:
- CI badge: `https://github.com/yourusername/my-new-project/actions/workflows/validate.yml/badge.svg`
- Codecov badge: `https://codecov.io/gh/yourusername/my-new-project/branch/main/graph/badge.svg`
- SonarCloud badge: `https://sonarcloud.io/api/project_badges/measure?project=yourusername_my-new-project&metric=alert_status`

### CI/CD Setup

1. **GitHub Actions**: Workflows are pre-configured in `.github/workflows/`
2. **Codecov**:
   - Sign up at [codecov.io](https://codecov.io)
   - Add `CODECOV_TOKEN` to GitHub repository secrets
3. **SonarCloud**:
   - Sign up at [sonarcloud.io](https://sonarcloud.io)
   - Import your repository
   - Update badge URLs in README

### Creating Your First Package

Replace `packages/example-utils/` with your actual package:

```bash
# Remove example
rm -rf packages/example-utils

# Create new package
mkdir -p packages/my-package/src packages/my-package/test

# Copy structure from example or see README.md "Adding a New Package"
```

## Troubleshooting

### Validation Failures

```bash
# Check specific failures
bun run typecheck  # TypeScript errors
bun run lint       # Linting issues
bun run test       # Test failures

# Clean build
bun run build:clean
```

### Git Remote Issues

```bash
# Check current remote
git remote -v

# Update if needed
git remote set-url origin git@github.com:yourusername/my-new-project.git
```

## Quick Reference: Claude Code Prompt

If using Claude Code to perform the cloning:

```
Create a new project from ts-monorepo-template:
1. Clone the template to ../my-new-project
2. Squash git history
3. Replace all occurrences of:
   - ts-monorepo-template → my-new-project
   - jdutton → yourusername
   - @ts-monorepo-template → @your-org
4. Update descriptions:
   - Description: "Your project description"
   - Keywords: ["keyword1", "keyword2", ...]
   - Features: [list specific features]
5. Set git remote to git@github.com:yourusername/my-new-project.git
6. Run bun install
7. Verify with bun run validate
```

## Next Steps

After cloning and setup:

1. Read [Getting Started](./docs/getting-started.md) for development workflow
2. Review [CLAUDE.md](./CLAUDE.md) for development guidelines
3. Start building your first package
4. Set up CI/CD integrations (Codecov, SonarCloud)
5. Update documentation with project-specific details

---

**Questions or Issues?**
- Check existing documentation in `docs/`
- Review example implementations
- Open an issue on the template repository
