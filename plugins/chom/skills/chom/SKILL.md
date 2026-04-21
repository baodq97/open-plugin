---
name: chom
description: Install a skill from a GitHub URL into the user's personal skills directory (~/.claude/skills/). Use whenever the user says "chom <url>", "install this skill from github", "add/import/grab this skill", or pastes a GitHub URL that clearly points at a SKILL.md folder — handle both full-repo skills and subfolder skills like https://github.com/github/awesome-copilot/tree/main/skills/azure-devops-cli. Also handles optional description optimization of the newly installed skill when the user explicitly asks for it afterward. Trigger even when the user doesn't say the word "chom" as long as the intent is "pull a skill from GitHub into my skills folder".
---

# chom — install a skill from GitHub

`chom` clones a skill from a GitHub URL, copies **only** that skill folder into
the user's personal skills directory (`~/.claude/skills/`), and — only when the
user explicitly asks — rewrites its description for better auto-triggering.

## Core invariant — never break this

The whole skill boils down to three steps that must happen in this exact shape:

1. **Clone the repo into a throwaway temp dir** (`mktemp -d`). Never clone into
   `~/.claude/skills/`, never clone into the current working directory.
2. **Copy only the one skill folder** out of that temp dir into
   `~/.claude/skills/<skill-name>/`. Never copy the surrounding repo, README,
   sibling skills, `.git/`, CI files, or anything else.
3. **Delete the temp dir.** Every path, even on failure. Use a `trap` so the
   cleanup survives Ctrl-C and aborts.

If you find yourself about to copy more than the skill folder, stop and re-read
this section.

## When to use

Trigger on any of:

- `chom <url>` or `/chom <url>`
- "install this skill from github", "add this skill", "import this skill",
  "grab this skill", "pull this skill"
- A bare GitHub URL that clearly points at a folder containing `SKILL.md`

If the URL comes without an explicit verb, confirm intent before cloning —
don't install something the user didn't ask for.

## Where skills live

User-scoped skills live at `~/.claude/skills/<skill-name>/`.

On Windows + bash that resolves to `/c/Users/<user>/.claude/skills/<skill-name>/`.

Never install outside that directory. Project-scoped skills and plugin skills
live elsewhere and `chom` doesn't own those.

## URL shapes you must handle

| URL shape | Action |
|---|---|
| `github.com/OWNER/REPO/tree/REF/PATH` | Clone `OWNER/REPO` at `REF`, copy `PATH/` |
| `github.com/OWNER/REPO/blob/REF/PATH/SKILL.md` | Strip filename, copy parent folder |
| `github.com/OWNER/REPO` (no path) | Clone repo, then ask user which folder |
| Ends with `.git` | Clone directly, ask for a subpath if one isn't obvious |
| A branch / tag / commit hash in the `REF` slot | Pass it to `--branch`; for commit SHAs you'll need a non-shallow clone, see Edge cases |

Anything else — raw gist URL, tarball download URL, ZIP archive — is
unsupported. Say so and ask the user for a `tree` URL instead.

### If the argument isn't a URL at all

If the user invokes chom with a bare name (e.g. `/chom azure-devops-cli`), a
partial path, or anything that isn't a parseable GitHub URL, **do not guess**.
Don't try to infer the URL from a previously installed skill, don't search
GitHub, don't assume `github/awesome-copilot/skills/<name>`. Instead:

1. Check whether `~/.claude/skills/<argument>/` exists. If it does, report its
   current `description` and last-modified date so the user has context.
2. Ask the user to paste the full GitHub URL. Offer two common shortcuts they
   might have meant: "refresh the existing install from its original source"
   (which we can't honor yet — see below) or "uninstall" (which is just an
   `rm -rf`).
3. Stop. Do not clone anything until the user provides a real URL.

> chom does not yet remember the source URL of previously installed skills, so
> "refresh" requires the user to paste the URL again. A future change could
> record `x-chom-source:` in the installed SKILL.md frontmatter to make this
> ergonomic — but today, explicit is better than wrong.

## The workflow

Do these steps in order. Announce each one in a single sentence so the user can
see what's happening.

### 1. Parse

Extract from the URL:

- `owner`, `repo`
- `ref` (branch / tag / SHA — defaults to `main` if absent)
- `subpath` (path inside the repo; may be empty if the whole repo is the skill)
- `skill_name` — default to the last path segment; if `subpath` is empty, use
  `repo`. **Ask the user to confirm** when defaulting to `repo` — repo names
  frequently don't match the skill's `name:` field.

### 2. Check the destination

Compute `DEST=$HOME/.claude/skills/<skill_name>`.

If `DEST` already exists:

1. Read its `SKILL.md` frontmatter (if any)
2. Show the user: install path, current `description`, last-modified date
3. Ask: overwrite / pick a different name / abort

**Never** silently overwrite. A user may have hand-edited the installed skill.

### 3. Clone → copy → clean up

Do this as one block. The `trap` is load-bearing — it guarantees the temp dir
is deleted even if a later step fails.

```bash
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# --- clone ---
if [ -n "$SUBPATH" ] && [ "$SUBPATH" != "." ]; then
  # Subfolder skill — sparse clone is cheap on big monorepos
  git clone --depth 1 --filter=blob:none --sparse --branch "$REF" \
    "https://github.com/$OWNER/$REPO.git" "$TMP"
  git -C "$TMP" sparse-checkout set "$SUBPATH"
  SRC="$TMP/$SUBPATH"
else
  # Mono-skill repo — the whole repo IS the skill
  git clone --depth 1 --branch "$REF" \
    "https://github.com/$OWNER/$REPO.git" "$TMP"
  SRC="$TMP"
fi

# If sparse-checkout failed (older git, odd config), fall through
# and retry without sparse — same shallow clone, same SRC logic.

# --- verify it's actually a skill ---
[ -f "$SRC/SKILL.md" ] || { echo "No SKILL.md at $SRC — aborting."; exit 1; }

# --- copy ONLY the skill folder into DEST ---
DEST="$HOME/.claude/skills/$SKILL_NAME"
rm -rf "$DEST"          # user already confirmed overwrite in step 2
mkdir -p "$DEST"
cp -rL "$SRC/." "$DEST/"
rm -rf "$DEST/.git"     # safety net for mono-skill repos
# trap handles $TMP cleanup on exit
```

Why each piece matters:

- **`trap 'rm -rf "$TMP"' EXIT`** — temp dir is deleted no matter how the
  script ends. Never leave clones lying around in `/tmp`.
- **`cp -rL "$SRC/." "$DEST/"`** — the trailing `/.` copies *contents*, not the
  directory itself. Without it, overwriting an existing `$DEST` produces
  `$DEST/$SKILL_NAME/` nesting instead of replacing.
- **`-L`** dereferences symlinks — safer on Windows, where creating symlinks
  needs admin rights.
- **`rm -rf "$DEST/.git"`** — a plain shallow clone of a mono-skill repo leaves
  `.git/` in the copied contents. Strip it. No-op on the sparse-checkout path.

If `REF` is a commit SHA, `--depth 1 --branch "$REF"` fails. Clone the full
branch first, then `git -C "$TMP" checkout $REF`, then continue from the
sparse-checkout or copy step.

### 5. Verify

The copied folder must contain a readable `SKILL.md` with at least `name:` and
`description:` in frontmatter. If it doesn't, the URL didn't point at a skill
— say so, and offer to delete the bad install.

### 6. Report

Show the user:

- Install path
- Skill's `name:` and `description:` from the frontmatter
- Top-level file/folder listing (one level deep, not recursive)
- Any `scripts/` or `references/` worth knowing about

### 7. Offer optimization

Ask:

> Want me to optimize the skill's description for better auto-triggering?
> (`yes` / `no` / `later`)

If `yes`, go to the Optimization section. If not, stop.

## Optimization (only when asked)

Two modes. Pick based on what the user is willing to wait for.

### Light optimization (default if they just say "optimize")

Edit only the `description:` field in the installed `SKILL.md`. Goal: better
auto-triggering.

Guidelines:

- Lead with what the skill does, verb first, present tense
- Add 3–5 trigger phrases a real user would actually type
  — "when the user says X, Y, or Z"
- Be a little pushy — Claude tends to under-trigger skills; honest nudging is
  fine, lying about capabilities is not
- Don't exceed ~100 words in the description

Show a diff. Apply on confirmation. Never touch the body or bundled files
unless the user explicitly asks.

### Heavy optimization (eval loop)

Only do this if the user explicitly asks for "full optimization" / "run the
eval loop" / something that clearly means they want the benchmark treatment.

Defer to the `skill-creator` skill's Description Optimization section — it has
the `scripts/run_loop.py` machinery. Your job is just to:

1. Point the user at `skill-creator`
2. Offer to help generate the 20 trigger-eval queries (mix of
   should-trigger and should-not-trigger near-misses)

Do **not** try to reimplement the eval loop inside `chom`.

## Edge cases

- **Private repos** — `git clone` will prompt for credentials. Warn the user
  before starting; the prompt happens in the terminal, not in the chat.
- **Mono-skill repo** (the whole repo IS the skill, SKILL.md at root) — skill
  name defaults to the repo name, but confirm because this is the most common
  place the default is wrong.
- **Nested skills** (destination has multiple `SKILL.md`s under subfolders) —
  list them, ask which one to install.
- **Non-GitHub git URL** (GitLab, self-hosted) — ask before cloning. The
  convention is GitHub but don't hard-block.
- **Gist / raw / ZIP / tarball URLs** — not supported. Ask for a `tree/` URL.
- **Windows path quoting** — if the skill name contains spaces (rare, but
  happens when defaulting to a repo name), quote the destination path.

## What `chom` must never do

- Never install outside `~/.claude/skills/`.
- Never clone directly into `~/.claude/skills/` or the current working
  directory — always clone into a throwaway `mktemp -d` first.
- Never copy the surrounding repo, sibling skills, or any files outside the
  target skill folder. Scope the copy to exactly the skill you were asked for.
- Never leave the temp clone on disk. Always use a `trap ... EXIT` or
  equivalent so cleanup survives failures.
- Never overwrite an existing skill silently.
- Never execute scripts bundled inside the cloned skill as part of install —
  the user hasn't decided to run them yet.
- Never modify file contents during install. Straight copy only. Optimization
  only happens as a separate, opted-in step.
- Never fetch from an un-vetted mirror. If the URL isn't obviously GitHub,
  confirm with the user first.

## Example session

> User: chom https://github.com/github/awesome-copilot/tree/main/skills/azure-devops-cli

1. Parse → `owner=github`, `repo=awesome-copilot`, `ref=main`,
   `subpath=skills/azure-devops-cli`, `skill_name=azure-devops-cli`
2. Destination check: `~/.claude/skills/azure-devops-cli/` — doesn't exist,
   proceed
3. Sparse-clone that subfolder into a temp dir
4. Copy to destination, clean up temp
5. Verify: `SKILL.md` present, frontmatter parses
6. Report:
   > Installed **azure-devops-cli** at
   > `C:/Users/BaoDo/.claude/skills/azure-devops-cli/`.
   > Description: "Use this skill to query and manage Azure DevOps repos…"
   > Top-level: `SKILL.md`, `scripts/`, `references/`.
7. Ask:
   > Want me to optimize the description for better triggering?
