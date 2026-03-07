#!/usr/bin/env bash
# init-workspace.sh — Set up a fresh test workspace for vbounce E2E testing
# Usage: bash init-workspace.sh [workspace-base-dir]
# Default: tests/vbounce-e2e/workspace

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
BASE="${1:-$SKILL_DIR/workspace}"

RUN_ID="run-$(date +%Y%m%d-%H%M%S)"
WORKSPACE="$BASE/$RUN_ID"

echo "Creating test workspace: $WORKSPACE"

# Create directory structure
mkdir -p "$WORKSPACE"/{src,test,docs}

# Copy sample PRD
cp "$SKILL_DIR/fixtures/sample-prd.md" "$WORKSPACE/prd.md"

# Create minimal CLAUDE.md for the test project
cat > "$WORKSPACE/CLAUDE.md" << 'PROJECTMD'
# TaskFlow API — Test Project

## Tech Stack
- Node.js v20+, TypeScript
- Express.js (web framework)
- PostgreSQL 16 (database)
- node:test (test runner)

## Architecture
- Clean Architecture (controllers -> services -> repositories)
- JSON:API response format

## Conventions
- TypeScript strict mode
- ESM modules
- File naming: kebab-case

## Test
```bash
npx tsx --test test/**/*.test.ts
```
PROJECTMD

# Create symlink for "current" workspace
ln -sfn "$RUN_ID" "$BASE/current"

echo ""
echo "Workspace ready: $WORKSPACE"
echo "Symlink: $BASE/current -> $RUN_ID"
echo ""
echo "To run E2E test, start Claude Code with:"
echo "  claude --plugin-dir $(dirname "$SKILL_DIR")/../../plugins/vbounce"
echo ""
echo "Then invoke:"
echo "  'I have a PRD at $WORKSPACE/prd.md. Start a vbounce SDLC cycle.'"
