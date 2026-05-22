# Initial Roadmap

All runtime, schema, deploy, and production integration phases are future-gated. This roadmap documents sequencing only.

## Phase 0: Project Setup, Docs, And Rules

- Create project boundary documentation.
- Record initial decisions.
- Define evidence, permissions, ingestion, privacy, and alignment posture.
- Set Cursor and Git hygiene rules.

## Phase 1: Concept Or Product Spec

- Create clickable concept, design prototype, or product requirements per `docs/SOPHEX_MVP0_SCREEN_MAP.md`.
- Validate user journeys for property search, upload, report output, and contribution.
- Define authority labels, source panels, and query-level permission expectations.
- Prototype with mock data and non-production banners on all preview surfaces.
- **Include mock comparison dashboard, regional heat map, interactive report preview, gated export UX, and upload/contribution exchange UI** (Content Engine reference patterns — UI only).
- No production runtime.
- **Content Engine SQL/n8n/CRM implementation is not authorized** in Sophex setup — borrow UX and strategy only.

## Phase 1b: Interactive Marketing Surfaces (Future-Gated)

- Public comparison dashboard and heat map with sample data.
- SEO/GEO market pages using **public baseline or approved aggregates only** — not user-contributed facts.
- Gated export UX stopping at consent/terms screen (no send).
- Upload/contribution exchange prototype (unlock depth UI with explicit terms placeholder).
- **Defer:** email nurture, CRM sync, syndication automation, paid ads/retargeting — post-privacy-and-consent-gate phases only.

## Phase 2: Ingestion Proof Of Concept

- Use non-production mock data only.
- Explore clean PDF versus scanned/OCR paths.
- Test extraction confidence and HITL review needs.
- No production data or schema migration.

## Phase 3: Evidence/Observation API Contract Design

- Design contracts for property, field, observation, source, visibility, lineage, and audit.
- Align with CRE Platform concepts.
- Define document evidence, observation visibility, resolved field value, comp candidate, resolved comp set, and operational receipt concepts.
- Keep implementation gated until contracts are reviewed.

## Phase 4: Valuation/Reporting Workflow Prototype

- Prototype report outputs against mock or approved sandbox data.
- Preserve evidence references and viewer-specific permissions.
- No provider sends or deploys without later approval.

## Phase 5: Marketplace/Privacy Model Hardening

- Define contribution terms.
- Define paid/private data boundaries.
- Define aggregation and anonymization rules.
- Define source-use, revocation, supersession, public indexing, and model-training consent.
- Prepare legal/product review before launch.

## Phase 6: Governed CRE Integration

- Integrate with approved CRE APIs/contracts.
- Respect CRE audit, idempotency, correlation, and evidence posture.
- Avoid direct production DB coupling.
