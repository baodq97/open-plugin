# chom

Install a Claude Code skill from a GitHub URL into your personal skills directory
(`~/.claude/skills/`).

## What it does

1. Clones the target repo into a throwaway temp dir (`mktemp -d`).
2. Copies **only** the requested skill folder — not the surrounding repo,
   siblings, or `.git/`.
3. Deletes the temp dir, even on failure.
4. Optionally (opt-in) rewrites the installed skill's `description` for better
   auto-triggering.

## Usage

```text
/chom <github-url>
```

Example:

```text
/chom https://github.com/github/awesome-copilot/tree/main/skills/azure-devops-cli
```

Supported URL shapes:

| URL shape | Action |
|---|---|
| `github.com/OWNER/REPO/tree/REF/PATH` | Clone at `REF`, copy `PATH/` |
| `github.com/OWNER/REPO/blob/REF/PATH/SKILL.md` | Strip filename, copy parent folder |
| `github.com/OWNER/REPO` (no path) | Clone repo, ask user which folder |
| URL ending in `.git` | Clone, ask for subpath |

Gist / raw / ZIP URLs are **not** supported — paste a `tree/` URL instead.

## Guardrails

chom refuses to:

- Install outside `~/.claude/skills/`.
- Clone directly into `~/.claude/skills/` or the current working directory.
- Copy anything other than the target skill folder.
- Leave temp clones on disk.
- Silently overwrite an existing skill.
- Execute bundled scripts as part of install.
- Modify file contents during install (optimization is a separate opt-in step).

## Optimization (opt-in)

After install, chom asks whether to rewrite the skill's `description:` for
better triggering. Two modes:

- **Light**: edits only the `description:` field in `SKILL.md`. Shows a diff;
  applies on confirmation.
- **Heavy**: defers to the `skill-creator` skill's full eval loop (20 trigger
  queries × `scripts/run_loop.py`). Not reimplemented here.

## Provenance

This plugin packages the `chom` skill originally authored at
[`~/.claude/skills/chom/`](../../../). See
[`skills/chom/SKILL.md`](./skills/chom/SKILL.md) for the full skill definition.
