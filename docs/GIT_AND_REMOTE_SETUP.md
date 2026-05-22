# Git And Remote Setup

## Current Local Git State

- Local path: `C:\Projects\Sophex Marketplace and Content Engine`
- Local Git repository: initialized
- Default branch: `master` (tracks `origin/master`)
- Remote: `origin` → `https://github.com/finemgroup/cre2.git`
- First push: **completed** (2026-05-22)

## Repository Identity Caveat

- **GitHub remote:** [finemgroup/cre2](https://github.com/finemgroup/cre2)
- **Project identity:** Sophex Marketplace and Content Engine (docs/control-plane setup shell)
- The GitHub repo name is `cre2`, but this remote hosts the **Sophex** planning and harvest-integration docs — not CRE Platform runtime, Finem Fabricator runtime, or Content Engine implementation code.

## Remote Configuration

| Field | Value |
| --- | --- |
| GitHub org/user | `finemgroup` |
| Repo name | `cre2` |
| Remote URL | `https://github.com/finemgroup/cre2.git` |
| Default branch | `master` |
| Tracking | `master` → `origin/master` |

First push command (already executed):

```powershell
git remote add origin https://github.com/finemgroup/cre2.git
git push -u origin master
```

## Forbidden Remotes

This repository must **never** use CRE Platform or Finem Fabricator remotes. Those are separate sister projects with different trust boundaries and runtime lanes.

## Untracked Local Reference Material

- `Content Engine/` — local-only strategy reference folder inside the Sophex workspace.
- **Not committed, not pushed.** Harvest doctrine is integrated into `docs/`; the source folder remains external reference until operator approves staging.

## Remote Safety Rules

- Confirm the remote URL is for the separate Sophex project shell (currently `finemgroup/cre2`).
- Do not reuse CRE Platform or Finem Fabricator remotes.
- Do not push secrets, `.env` files, local credentials, generated artifacts, or unrelated transferred materials without approval.
- Keep explicit path staging as the default commit posture.
- Do not use `git add -A` — never stage `Content Engine/` unless explicitly approved.
