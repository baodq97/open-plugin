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
