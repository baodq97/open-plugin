# Tech Stack Command Resolution

Maps detected language + package manager to install, compile, and test commands.

## Resolution Table

| Language | Package Manager | install_command | compile_command | test_command |
|----------|----------------|-----------------|-----------------|-------------|
| TypeScript | npm | `npm install` | `npx tsc --noEmit` | `npm test` |
| TypeScript | yarn | `yarn install` | `yarn tsc --noEmit` | `yarn test` |
| TypeScript | pnpm | `pnpm install` | `pnpm tsc --noEmit` | `pnpm test` |
| Python | pip | `pip install -r requirements.txt` | `null` (or `mypy .` if mypy in deps) | `pytest` (or `python -m unittest` if no pytest) |
| Python | poetry | `poetry install` | `null` (or `mypy .` if mypy in deps) | `poetry run pytest` |
| C# | dotnet | `dotnet restore` | `dotnet build --no-restore` | `dotnet test --no-build` |
| Go | go | `go mod download` | `go build ./...` | `go test ./...` |
| Rust | cargo | `null` | `cargo build` | `cargo test` |
| Java | Maven | `null` | `mvn compile` | `mvn test` |
| Java | Gradle | `null` | `gradle build` | `gradle test` |
| Unknown | — | `null` | `null` | `null` (ask user) |

## Rules

- `null` means skip the step (no dependencies to install, or interpreted language without type checker)
- When `test_command` is null, orchestrator asks the user: "No test runner detected. What command runs your tests?"
- CLAUDE.md declarations override auto-detection
- If no manifest file found, scan top 5 source files for import patterns and file extensions
