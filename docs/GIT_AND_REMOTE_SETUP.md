# Git And Remote Setup

## Current Local Git State

- Local path: `C:\Projects\Sophex Marketplace and Content Engine`
- Local Git repository: initialized
- Default local bootstrap branch: `master`
- Remote: not configured
- Push status: not pushed

This repository must not be connected to any CRE Platform or Finem Fabricator remote. Add a remote only after the operator provides a specific Sophex remote URL and explicitly approves the action.

## Remote Placeholders

- GitHub org/user:
- Repo name:
- Remote URL:
- Default branch:
- First push command:

## Command Template

Do not run this template until a real Sophex remote URL is approved:

```powershell
git remote add origin <SOPHEX_REMOTE_URL>
git push -u origin master
```

## Remote Safety Rules

- Confirm the remote URL is for the separate Sophex project.
- Do not reuse CRE Platform or Finem Fabricator remotes.
- Do not push secrets, `.env` files, local credentials, generated artifacts, or unrelated transferred materials without approval.
- Keep explicit path staging as the default commit posture.
