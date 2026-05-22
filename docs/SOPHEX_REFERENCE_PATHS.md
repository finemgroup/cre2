# Sophex Reference Paths

All paths in this document are **reference-only**. They do not authorize copying code, connecting remotes, reading production databases, or staging sister-project files into Sophex Git.

## Sophex Workspace (this repo)

| Path | Status | Notes |
| --- | --- | --- |
| `C:\Projects\Sophex Marketplace and Content Engine` | Git-backed docs project | Default branch: `master` |
| `Content Engine/` | Untracked reference folder | Do not stage unless operator explicitly requests |
| `docs/` | Committed doctrine | Primary integration target for harvest packets |
| `.cursor/rules/` | Committed lane rules | Project boundary enforcement |

## Sister Projects (external, read-only harvest sources)

| Project | Path | Role |
| --- | --- | --- |
| CRE Platform (authoritative read-only clone) | `C:\Projects\cre-platform-master-clean` | Clean `master` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c`; governed evidence substrate and richest UX/design-system reference (`apps/core`) |
| CRE Platform UX/Motion (authoritative read-only source) | `C:\Projects\cre-platform-master-clean\apps\core` | Clean-master UX, motion, shell, trust UI, accessibility, report/export, upload, and map reference |
| CRE Platform (forbidden stale/dirty checkout) | `C:\Projects\cre-platform-erofs-master-landing` | Do not use for authoritative harvest; stale branch/dirty working tree retained only as prior provisional source |
| Finem Fabricator (authoritative read-only clone) | `C:\Projects\finem_factory_mvp_clean` | Clean `main` @ `89b2a651a928a2d8cc1c80fba65f0861fc509e09`; workflow, agent, HITL, evidence-envelope, report-contract, and control-plane patterns |
| Finem Fabricator (dirty original checkout) | `C:\Projects\finem_factory_mvp` | Do not use for authoritative harvest; retained only as prior provisional source |
| Content Engine | `C:\Projects\Sophex Marketplace and Content Engine\Content Engine` | Market research, interactive content, lead-funnel reference |

## Explicitly Forbidden Paths For Sophex Lane

- CRE production DB, schema lane, deploy terminal, dirty production checkout
- Fabricator runtime, queue, provider/send context
- Sister-project `prisma/`, `migrations/`, `.env*`, and secret files
- Raw sister-project source copied into Sophex `src/`, `apps/`, or `packages/`

## Harvest Packets Catalogued (2026-05-22)

Standalone markdown files under `docs/`:

1. [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md) — anti-drift map (start here)
2. [HARVEST_PACKET_INDEX.md](HARVEST_PACKET_INDEX.md) — master catalog
3. [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)
4. [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)
5. [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)
6. [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)

Superseded drafts (archive only): `CRE_TO_SOPHEX_HARVEST_PACKET.md`, `CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md`, `FABRICATOR_TO_SOPHEX_HARVEST_PACKET.md`, `FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md`, `CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET.md`, `UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md`, `UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md`.

Integrated doctrine lives in topic docs listed in the hierarchy. See [CROSS_PROJECT_HARVEST.md](CROSS_PROJECT_HARVEST.md).
