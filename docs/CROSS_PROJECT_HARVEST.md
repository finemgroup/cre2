# Cross-Project Harvest

Source: Ara cross-project harvest packets integrated on 2026-05-22.

- `CRE_TO_SOPHEX_HARVEST_PACKET` — see **[CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)** (clean CRE `master` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c`; prior provisional remains archived)
- `FABRICATOR_TO_SOPHEX_HARVEST_PACKET` — see **[FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)** (clean Fabricator `main` @ `89b2a651a928a2d8cc1c80fba65f0861fc509e09`; prior provisional remains archived)
- `CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET` — see **[CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md)** (reference-only; untracked `Content Engine/` folder). Prior provisional archive: [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md).
- `UX_MOTION_TO_SOPHEX_HARVEST_PACKET` — see **[UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)** (clean CRE `apps/core` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c`; prior provisional remains archived)
- `P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET` — see **[P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** (P51 CRE tracked `master` @ `af4a453b66bb62e79a147cae143dc61ed042906e`; provisional because untracked `.tmp` artifacts were present)
- `CRE_UNDERWRITING_HARVEST_ANNEX` — see **[CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md](CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md)** (provisional underwriting/readiness/gates/version-governance annex from P51 CRE working tree)
- `ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET` — see **[ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** (provisional map/GIS concept harvest; no asset/runtime reuse)

**Doc hierarchy (anti-drift):** [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md) — canonical map of packets vs integrated doctrine.

This document records what Sophex should inherit from CRE Platform, Finem Fabricator, and Content Engine reference materials. Sophex should inherit doctrine, contracts, review posture, and UX patterns. It should not inherit runtime code, production data, schema migrations, or internal operator workflows by copy-paste.

## Harvest Summary

- Sophex remains a separate product and public trust boundary.
- CRE Platform remains the governed internal substrate for evidence, source observations, comp intelligence, receipts, audit, idempotency, and correlation.
- **CRE harvest is now authoritative for docs doctrine** — sourced read-only from clean clone `C:\Projects\cre-platform-master-clean` on `master` with `HEAD == origin/master` at `5300e7e5510e27d5ba505bfba8bec39990f68f7c`. See [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md). The stale/dirty provisional packet remains archived for provenance.
- CRE `apps/core` is the authoritative UX/design-system reference from clean master: RootProviders/SessionGate shell split, TopBar/navigation, route progress, page transitions, motion tokens, OSMotion sheets, provenance UI, source citations, BOV/export gates, upload/intake, source bundles, generated-document authority, map evidence drawers, loading/error states, and accessibility primitives.
- P51 CRE adds a provisional high-end animation supplement: workflow-first route continuity, OS/Brief motion primitives, execution-vs-review motion policy, stage rails, inspector drawers, reduced-motion proof, and primitive graduation checklists. Treat it as a doctrine supplement until reconciled against a clean authoritative CRE checkout.
- The CRE underwriting annex adds provisional valuation/readiness doctrine: two-surface underwriting UX, readiness ladders, workflow gates, valuation versions, evidence snapshots, scenario advisory posture, and approved-only export manifests.
- ICSC Map Recovery adds provisional mapping/GIS doctrine: layer-control HUDs, lazy polygon loading, spatial provenance, coordinate verification, trade-area abstractions, map accessibility fallbacks, and performance budgets.
- Finem Fabricator contributes workflow, agent, HITL, report-generation, control-plane, evidence-envelope, audit/idempotency/correlation, and status-projection patterns, but it does not own Sophex data truth.
- **Fabricator harvest is now authoritative for docs doctrine** — sourced read-only from clean clone `C:\Projects\finem_factory_mvp_clean` on `main` with `HEAD == origin/main` at `89b2a651a928a2d8cc1c80fba65f0861fc509e09`. See [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md). The dirty provisional packet remains archived for provenance.
- Content Engine contributes interactive marketing surfaces, comparison/heatmap UX, gated export, contribution exchange, and marketplace flywheel concepts for **operator-authored public content only**. See [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md) — **reference-only**; sourced from untracked `Content Engine/` strategy folder inside the Sophex workspace. SQL, n8n, CRM, send automation, and runtime implementation from Content Engine tech spec are **not authorized** for Sophex setup.
- UX/motion validation from clean CRE `apps/core` is now authoritative for docs doctrine. See [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md). Canonical UX/motion doctrine remains in `FRONTEND_UX_INHERITANCE.md`, `MOTION_AND_INTERACTION_GUIDELINES.md`, `SOPHEX_TRUST_UI_GUIDELINES.md`, and `SOPHEX_MVP0_SCREEN_MAP.md`.
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
| CRE | `C:\Projects\cre-platform-master-clean` | [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) ✅ authoritative docs reference | `CRE_PLATFORM_ALIGNMENT.md`, evidence/trust/UX/reporting docs |
| Fabricator | `C:\Projects\finem_factory_mvp_clean` | [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) ✅ authoritative docs reference | `FINEM_FABRICATOR_ALIGNMENT.md`, agent/contracts docs |
| Content Engine | `Content Engine/` reference folder | [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md) ⚠️ reference-only | valuation, privacy, roadmap, MVP0 map, frontend UX |
| UX/Motion | `C:\Projects\cre-platform-master-clean\apps\core` | [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) ✅ authoritative docs reference | frontend UX, motion, trust UI, MVP0 docs |
| P51 CRE Animation | `C:\Projects\p51 Site Selection Tool\cre-platform` | [P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) ⚠️ provisional supplement | motion guidelines, frontend UX, trust UI, MVP0 docs |
| CRE Underwriting Annex | `C:\Projects\p51 Site Selection Tool\cre-platform` | [CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md](CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md) ⚠️ provisional supplement | conceptual contracts, valuation/reporting, export policy, open questions |
| ICSC Map Recovery | `C:\Projects\ICSC Map Recovery` | [ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) ⚠️ provisional supplement | frontend UX, evidence/permission contracts, motion/map interaction, open questions |

### Content Engine Reference Summary (Strategy / UX Only)

**Source:** Untracked `Content Engine/` folder (8 markdown strategy docs). Not an authoritative runtime repo.

**Borrow (product / UX / marketplace doctrine):**

- Interactive evidence-first reports with comparison dashboard and regional heat map.
- Outcome-first hero, segment selector, scannable callouts, progressive forms.
- Partial valuation preview and personalized report builder (section toggles).
- Soft-then-hard CTA ladder: preview → save → upload docs/comps → gated export.
- Contribution exchange: upload documents/comps to unlock report depth (explicit terms).
- Gated PDF/export/share as permissioned, audited value exchange.
- White-label broker report possibility with warnings/citations retained.
- Public SEO/GEO property and market pages using public baseline or approved aggregates only.
- Mobile conversion patterns (sticky CTA, swipe comparison, collapsible evidence).
- Internal engagement scoring for prioritization — not outbound triggers until consent stack clears.

**Deferred / forbidden (do not implement in Sophex setup):**

- Content Engine SQL schemas, n8n workflows, CRM sync, email nurture automation.
- Provider/send, queue-driven outbound, syndication of user-derived or private content.
- Public indexing of user-contributed facts before visibility/review/source-use gates.
- Exit-intent capture, retargeting, paid ads using contributed intelligence.
- Treating gated export as a simple lead form without consent, audit, and permission checks.
- Scraping without license; appraisal-superiority marketing claims.

See also: [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md), [HARVEST_PACKET_INDEX.md](HARVEST_PACKET_INDEX.md), `SISTER_PROJECT_SOURCE_MAP.md`, `SOPHEX_REFERENCE_PATHS.md`, `SOPHEX_CONCEPTUAL_CONTRACTS.md`.

Implementation ticket pack: [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md) expands the provisional underwriting and GIS harvests into Composer 2.5-ready mock-only ticket cards.

## Gap List Against Harvest Packets

| Gap | Prior coverage | Integration action |
| --- | --- | --- |
| CRE relationship-truth / audit separation | Partial | Expanded evidence model and CRE alignment |
| CRE BOV section review + export gate | Missing | Added to valuation, trust UI, MVP0 screen map |
| CRE provenance cell/modal/citation patterns | Partial UX | Added trust UI and frontend inheritance |
| CRE motion tokens + reduced motion | Missing | Added motion guidelines |
| CRE non-production reporting banner | Missing | Added MVP0 screen map and trust UI |
| CRE clean-master path verification | Pending | Added authoritative packet; updated source map and stale path labels |
| UX/motion clean-master validation | Pending | Added authoritative UX/Motion packet; superseded stale UX/Motion archive |
| P51 high-end animation doctrine | Missing | Added provisional P51 animation supplement and integrated motion deltas |
| CRE underwriting readiness/version governance | Missing | Added provisional annex and conceptual contracts for readiness, workflow gates, valuation versions, evidence snapshots, and export manifests |
| ICSC map/GIS provenance and layer discipline | Missing | Added provisional mapping packet and GIS contract/open-question backlog |
| Fabricator control-plane / receipt doctrine | Partial | Added authoritative Fabricator packet and expanded Fabricator alignment/contracts |
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
- P51/CRE high-end animation loops, ICSC/war-room naming, operator-shell motion, or route progress as proof of workflow completion.
- P51/CRE underwriting runtime, Excel/Python compute, internal IC approval semantics, or AI approve/reject language.
- ICSC KML/GeoJSON assets, SharePoint/local links, provider credentials, hardcoded coordinates, or unlabeled polygon precision.
- Fabricator runtime queues, provider sends, AXIS/BullMQ internals, or queue completion as canonical truth.
- Content Engine n8n/SQL/CRM/email nurture implementations.
- Sister-project components, migrations, secrets, or `.env` files.

Any future alignment should happen through approved APIs, contracts, read models, or sandboxed mock data.

## Future-Gated Adoption

The harvest packets inform documentation, contracts, and design. They do not authorize schema, migrations, runtime code, queue jobs, provider sends, deployment, production DB access, or public data publication.
