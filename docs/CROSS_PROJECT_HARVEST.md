# Cross-Project Harvest

Source: Ara cross-project harvest packets integrated on 2026-05-22.

- `CRE_TO_SOPHEX_HARVEST_PACKET` — see **[CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** (authoritative CRE harvest pending clean master)
- `FABRICATOR_TO_SOPHEX_HARVEST_PACKET` — see **[FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** (authoritative Fabricator harvest pending clean checkout)
- `CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET` — see **[CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** (untracked reference folder)
- `UX_MOTION_TO_SOPHEX_HARVEST_PACKET` — see **[UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** (same stale CRE checkout)

**Doc hierarchy (anti-drift):** [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md) — canonical map of packets vs integrated doctrine.

This document records what Sophex should inherit from CRE Platform, Finem Fabricator, and Content Engine reference materials. Sophex should inherit doctrine, contracts, review posture, and UX patterns. It should not inherit runtime code, production data, schema migrations, or internal operator workflows by copy-paste.

## Harvest Summary

- Sophex remains a separate product and public trust boundary.
- CRE Platform remains the governed internal substrate for evidence, source observations, comp intelligence, receipts, audit, idempotency, and correlation.
- **CRE harvest is provisional only** — sourced from `agent/03-operating-lens-navigation` @ `48d7e5f910`, dirty, 758 commits behind `origin/master`. See [CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md). Authoritative CRE harvest requires clean `master` with `HEAD == origin/master`.
- CRE `apps/core` is the primary UX/design-system reference (motion tokens, provenance UI, BOV export gates, shell patterns).
- Finem Fabricator contributes workflow, agent, HITL, report-generation, control-plane, and job-status projection patterns, but it does not own Sophex data truth.
- **Fabricator harvest is provisional only** — sourced from `main` @ `89b2a651a` with dirty memory-bank and untracked audit docs. See [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md). Authoritative Fabricator harvest requires clean working tree.
- Content Engine contributes interactive marketing surfaces, comparison/heatmap UX, gated export, and contribution flywheel concepts for **operator-authored public content only**. See [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) — source is untracked `Content Engine/` reference folder.
- UX/motion patterns from CRE `apps/core` are **provisional** (same stale CRE checkout). See [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md). Canonical UX/motion doctrine: `FRONTEND_UX_INHERITANCE.md`, `MOTION_AND_INTERACTION_GUIDELINES.md`, `SOPHEX_TRUST_UI_GUIDELINES.md`.
- The core Sophex primitive is permissioned evidence and field observation resolution, not a flat comps table.
- Uploaded documents are evidence; chunks and embeddings are derived retrieval sidecars.
- Public/free contribution creates a data flywheel, but source-use, consent, privacy, publication, and revocation rules must exist before launch.
- Authority labels must be visible in UI so users can distinguish public baseline, private, reviewed, unreviewed, stale, disputed, blocked, and promoted values.
- Retrieval must be permission-filtered at every hop, including search, evidence panels, report generation, export, command palette, and future API access.
- Valuation/reporting UX must be evidence-first, with assumptions, comps, confidence language, source freshness, and reviewer control.
- Send automation, email nurture, CRM sync, and syndication remain disabled until provider, queue, consent, suppression, unsubscribe, idempotency, audit, and operator approval are proven.
- Runtime, schema, marketplace writes, and public launch remain future-gated.

## Packet Integration Map

| Harvest packet | Primary sister source | Standalone file | Integrated into |
| --- | --- | --- | --- |
| CRE | `cre-platform-erofs-master-landing` | [CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) ⚠️ provisional | `CRE_PLATFORM_ALIGNMENT.md`, evidence/trust docs |
| Fabricator | `finem_factory_mvp` | [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) ⚠️ provisional | `FINEM_FABRICATOR_ALIGNMENT.md`, agent/contracts docs |
| Content Engine | `Content Engine/` reference folder | [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) ⚠️ provisional | valuation, privacy, roadmap, MVP0 map |
| UX/Motion | CRE `apps/core` | [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) ⚠️ provisional | frontend UX, motion, trust UI docs |

See also: [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md), [HARVEST_PACKET_INDEX.md](HARVEST_PACKET_INDEX.md), `SISTER_PROJECT_SOURCE_MAP.md`, `SOPHEX_REFERENCE_PATHS.md`, `SOPHEX_CONCEPTUAL_CONTRACTS.md`.

## Gap List Against Harvest Packets

| Gap | Prior coverage | Integration action |
| --- | --- | --- |
| CRE relationship-truth / audit separation | Partial | Expanded evidence model and CRE alignment |
| CRE BOV section review + export gate | Missing | Added to valuation, trust UI, MVP0 screen map |
| CRE provenance cell/modal/citation patterns | Partial UX | Added trust UI and frontend inheritance |
| CRE motion tokens + reduced motion | Missing | Added motion guidelines |
| CRE non-production reporting banner | Missing | Added MVP0 screen map and trust UI |
| Fabricator control-plane / receipt doctrine | Partial | Expanded Fabricator alignment and contracts |
| Fabricator queue status as projection not truth | Missing | Added agent workflow and ADR |
| Content Engine interactive comparison/heatmap | Missing | Added frontend inheritance and MVP0 map |
| Content Engine gated export + CTA ladder | Partial | Expanded valuation and privacy docs |
| Content Engine send/nurture/CRM/syndication | Warned | Expanded privacy, non-goals, open questions |
| UX shell vs workstation split | Partial | Expanded frontend inheritance |
| Command palette permission filtering | Missing | Added trust UI and non-goals |
| Privacy visual labels (Public/Private/Premium) | Partial | Added trust UI guidelines |
| Sister-project path appendix | Missing | Added source map and reference paths |
| Conceptual contracts document | Partial (future schema) | Added `SOPHEX_CONCEPTUAL_CONTRACTS.md` |
| MVP0 screen inventory | Missing | Added `SOPHEX_MVP0_SCREEN_MAP.md` |

## Doctrine To Carry Forward

Sophex should treat evidence, observation, permission, review state, source-use policy, auditability, and visual trust language as first-class product concepts. Future implementation should define contracts for visibility, authority labels, source identity, review state, export receipts, and contribution exchange before any database write path or public marketplace launch.

## Doctrine Not To Carry Forward

Sophex should not copy:

- CRE production data, internal role assumptions, or full operator shell (Jarvis, dialer, gamification, PersistentMainMenu).
- Fabricator runtime queues, provider sends, or queue completion as canonical truth.
- Content Engine n8n/SQL/CRM/email nurture implementations.
- Sister-project components, migrations, secrets, or `.env` files.

Any future alignment should happen through approved APIs, contracts, read models, or sandboxed mock data.

## Future-Gated Adoption

The harvest packets inform documentation, contracts, and design. They do not authorize schema, migrations, runtime code, queue jobs, provider sends, deployment, production DB access, or public data publication.
