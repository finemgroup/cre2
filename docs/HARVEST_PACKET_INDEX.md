# Harvest Packet Index

**Start here:** [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md) — canonical map of packets vs integrated doctrine. Avoid editing multiple overlapping files.

## Current / Reference Packets (Primary)

| Packet | File | Sister source | Trust level |
| --- | --- | --- | --- |
| CRE | [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) | `C:\Projects\cre-platform-master-clean` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c` | ✅ Clean `master`, `HEAD == origin/master` |
| Fabricator | [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | `finem_factory_mvp` | ⚠️ Dirty worktree |
| Content Engine | [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md) | `Content Engine/` (untracked) | ⚠️ Reference folder |
| UX/Motion | [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | CRE `apps/core` | ⚠️ Same stale CRE checkout |

## Superseded Drafts (Archive Only)

- [CRE_TO_SOPHEX_HARVEST_PACKET.md](CRE_TO_SOPHEX_HARVEST_PACKET.md)
- [CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) (superseded by authoritative)
- [FABRICATOR_TO_SOPHEX_HARVEST_PACKET.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET.md)
- [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET.md)
- [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) (superseded by REFERENCE)
- [UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md)

## Integrated Doctrine (Update These, Not Packets)

- [CROSS_PROJECT_HARVEST.md](CROSS_PROJECT_HARVEST.md)
- [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md)
- Topic docs listed in hierarchy (alignment, trust, UX, agents, etc.)

## Rules

- Packets = provenance archives. Topic docs = living doctrine.
- Do not copy sister-project source code. Do not stage `Content Engine/` unless operator requests.
- Authoritative reruns require clean sister checkouts; diff against provisional before implementation.
