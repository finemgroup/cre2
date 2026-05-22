# Initial Roadmap

All runtime, schema, deploy, and production integration phases are future-gated. This roadmap documents sequencing only.

## Phase 0: Project Setup, Docs, And Rules

- Create project boundary documentation.
- Record initial decisions.
- Define evidence, permissions, ingestion, privacy, and alignment posture.
- Set Cursor and Git hygiene rules.

## Phase 1: Concept Or Product Spec

- Create clickable concept, design prototype, or product requirements.
- Validate user journeys for property search, upload, report output, and contribution.
- No production runtime.

## Phase 2: Ingestion Proof Of Concept

- Use non-production mock data only.
- Explore clean PDF versus scanned/OCR paths.
- Test extraction confidence and HITL review needs.
- No production data or schema migration.

## Phase 3: Evidence/Observation API Contract Design

- Design contracts for property, field, observation, source, visibility, lineage, and audit.
- Align with CRE Platform concepts.
- Keep implementation gated until contracts are reviewed.

## Phase 4: Valuation/Reporting Workflow Prototype

- Prototype report outputs against mock or approved sandbox data.
- Preserve evidence references and viewer-specific permissions.
- No provider sends or deploys without later approval.

## Phase 5: Marketplace/Privacy Model Hardening

- Define contribution terms.
- Define paid/private data boundaries.
- Define aggregation and anonymization rules.
- Prepare legal/product review before launch.

## Phase 6: Governed CRE Integration

- Integrate with approved CRE APIs/contracts.
- Respect CRE audit, idempotency, correlation, and evidence posture.
- Avoid direct production DB coupling.
