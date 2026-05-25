# Harvest Packet Index

**Start here:** [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md) — canonical map of packets vs integrated doctrine. Avoid editing multiple overlapping files.

## Current / Reference Packets (Primary)

| Packet | File | Sister source | Trust level |
| --- | --- | --- | --- |
| CRE | [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) | `C:\Projects\cre-platform-master-clean` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c` | ✅ Clean `master`, `HEAD == origin/master` |
| Fabricator | [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) | `C:\Projects\finem_factory_mvp_clean` @ `89b2a651a928a2d8cc1c80fba65f0861fc509e09` | ✅ Clean `main`, `HEAD == origin/main` |
| Content Engine | [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md) | `Content Engine/` (untracked) | ⚠️ Reference folder |
| UX/Motion | [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) | `C:\Projects\cre-platform-master-clean\apps\core` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c` | ✅ Clean CRE `master`, `HEAD == origin/master` |
| P51 CRE Animation | [P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | `C:\Projects\p51 Site Selection Tool\cre-platform` @ `af4a453b66bb62e79a147cae143dc61ed042906e` | ⚠️ Tracked `master` matched upstream, but untracked `.tmp` artifacts present |
| CRE Underwriting Annex | [CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md](CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md) | `C:\Projects\p51 Site Selection Tool\cre-platform` | ⚠️ Provisional underwriting concept harvest; not a clean authoritative source |
| ICSC Map Recovery | [ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | `C:\Projects\ICSC Map Recovery` | ⚠️ Provisional mapping/GIS concept harvest; no asset/runtime reuse |

## Superseded Drafts (Archive Only)

- [CRE_TO_SOPHEX_HARVEST_PACKET.md](CRE_TO_SOPHEX_HARVEST_PACKET.md)
- [CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) (superseded by authoritative)
- [FABRICATOR_TO_SOPHEX_HARVEST_PACKET.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET.md)
- [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) (superseded by authoritative)
- [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET.md)
- [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) (superseded by REFERENCE)
- [UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md)
- [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) (superseded by authoritative)

## Integrated Doctrine (Update These, Not Packets)

- [CROSS_PROJECT_HARVEST.md](CROSS_PROJECT_HARVEST.md)
- [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md)
- [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md)
- [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_FRONTEND_PHASE_2.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_FRONTEND_PHASE_2.md)
- [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md)
- Topic docs listed in hierarchy (alignment, trust, UX, agents, etc.)
- Provisional CRE underwriting concepts belong in conceptual contracts, valuation/reporting, export, and open decision docs.
- Provisional ICSC mapping concepts belong in frontend UX, motion/map interaction, evidence-permission contracts, and open decision docs.

## Rules

- Packets = provenance archives. Topic docs = living doctrine.
- Do not copy sister-project source code. Do not stage `Content Engine/` unless operator requests.
- Authoritative reruns require clean sister checkouts; diff against provisional before implementation.
