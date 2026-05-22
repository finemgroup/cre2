# Cursor Project Setup

This Cursor project is the Sophex separate planning/setup shell. It is not the CRE production repo, CRE schema lane, CRE MVP0 lane, Fabricator runtime lane, database editor, deploy terminal, provider/send context, queue runtime, or any unrelated feature branch.

## Branch Hygiene

- Use one branch for one scope.
- Default local bootstrap branch: `master`.
- Do not use worktrees.
- Do not switch branches if the checkout is dirty.
- Use explicit path staging only.
- Do not use `git add -A`.

## Prompt Cadence

1. Location/status check.
2. Lane lock or stop reason.
3. Scope statement.
4. Docs-only edits.
5. Lightweight validation.
6. Commit readiness report.

## Docs Location

Root orientation files live at:

- `README.md`
- `AGENTS.md`
- `DECISIONS.md`

Setup docs live in `docs/`.

Cursor rules live in `.cursor/rules/` if present.

## Allowed Commands

- `git status --short --branch --untracked-files=all`
- `git branch --show-current`
- `git rev-parse --short HEAD`
- `git remote -v`
- `git fetch` only when a Sophex remote exists
- Explicit `git add <approved paths>` only when the operator asks to stage/commit
- Lightweight file inventory and link checks

## Requires STOP

Stop before:

- Schema or migration requests.
- Production DB commands.
- Provider sends, queue launches, or deploys.
- Runtime app implementation.
- Dirty checkout branch changes.
- Unclear repo/path/cloud workspace.
- Private data ambiguity.
- Edits outside setup docs/rules.
- Remote URL ambiguity or attempts to connect to CRE/Fabricator remotes.

## Future PR Preparation

When the operator approves a commit, stage only the explicit setup packet paths, commit with:

`docs(sophex): bootstrap project boundary and setup packet`

Do not add a remote, push, or create a PR unless the operator explicitly provides a Sophex remote URL and asks for that action.
