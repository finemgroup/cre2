# Sophex Conceptual Contracts

This document defines **conceptual contracts only**. It contains no Prisma schema, SQL, migrations, generated-client guidance, or implementation code.

## Contract: DocumentEvidence

Represents durable identity and policy for an uploaded or referenced source document.

**Fields (conceptual):** evidence id, property link, uploader actor, organization scope, source type/source family, visibility class, source-use policy, source hash, payload digest, observed/uploaded/extracted timestamps, review state, publication eligibility, receipt refs, idempotency key, correlation id, clean-vs-scanned classification, revocation/supersession state.

**Invariants:** bytes live in storage; business record lives in evidence identity; chunks/embeddings are sidecars.

## Contract: Observation

Represents a sourced claim about a property field.

**Fields (conceptual):** observation id, property id, field name, value, source document reference, extract reference, actor, timestamp, confidence, visibility policy, review state, lineage parent.

**Invariants:** observations append; they do not silently overwrite prior truth; promotion to public projection is governed.

## Contract: ObservationVisibilityPolicy

Defines who may see an observation, its source, and derived values.

**Fields (conceptual):** actor classes allowed, organization scope, public/private tier, sharing grants, source-owner rights, export eligibility.

**Invariants:** enforced at query/API layer for search, panels, reports, exports, and future partner APIs.

## Contract: ResolvedFieldValue

The value shown to a specific actor in a specific context.

**Fields (conceptual):** property id, field name, actor context, resolved value, winning observation references, authority label, freshness, dispute flag.

**Invariants:** actor-specific; public viewers may still see public baseline when private observations exist.

## Contract: CompCandidate

A submitted or extracted comp before review or promotion.

**Fields (conceptual):** candidate id, subject property link, comp attributes, source evidence, contributor actor, confidence, review state, visibility.

**Invariants:** never auto-enter public comp sets; never index before visibility rules clear.

## Contract: ResolvedCompSet

Permission-filtered comp collection used for comparison or valuation.

**Fields (conceptual):** set id, actor context, included candidates, exclusion reasons, review approval reference, as-of timestamp.

**Invariants:** private comps excluded from public templates; stale/disputed comps labeled.

## Contract: ReportArtifact

User-facing valuation or market report output.

**Fields (conceptual):** report id, actor context, sections, assumptions, comp set reference, evidence appendix, review state, export policy, white-label branding scope, model disclosure summary.

**Invariants:** every material claim traceable to permitted evidence; export gated by review and consent.

## Contract: OperationalReceipt

Audit and idempotency reference for a governed action.

**Fields (conceptual):** receipt id, correlation id, idempotency key, action type, actor, target entity, outcome, timestamp, content hash where applicable.

**Applies to:** upload, extraction, review decision, report generation, export/download/share, publication, contribution acceptance.

**Invariants:** replay-safe; user-facing status is a projection of receipt state, not queue internals.

## Contract: AuditReceipt

Policy and operational receipt family for source-sensitive governed actions.

**Fields (conceptual):** receipt id, receipt kind, actor, target artifact, evidence refs (redacted where needed), policy decision, safe next action, idempotency key, correlation id, replay hash, timestamp.

**Invariants:** receipt existence is not execution authority; public routes store redacted refs and never expose raw internal logs.

## Contract: ContributionExchange

Terms governing free valuation/reporting in exchange for uploads or comps.

**Fields (conceptual):** contribution type, granted visibility, retained private fields, aggregation rights, model-training consent flag, revocation rights.

**Invariants:** no ambiguous free-tier public contribution; explicit opt-in language required.

## Contract: LeadCaptureIntent (future-gated)

Records consent-bound capture events without authorizing send automation.

**Fields (conceptual):** capture source, actor, consent scope, segment hint, report interest, suppression state.

**Invariants:** no CRM sync, email nurture, or syndication until provider, queue, consent, suppression, unsubscribe, idempotency, audit, and operator approval are proven.

## Contract: PublicMarketPageProjection

SEO/GEO-facing public property or market page view.

**Fields (conceptual):** public baseline fields only, aggregated market stats, CTA placeholders, indexing eligibility flag.

**Invariants:** no user-contributed private facts; no indexing before review and visibility rules exist.

## Cross-Project Alignment Notes

- **CRE Platform** clean-master harvest confirms governed source observations, document references, document evidence registry, chunks as sidecars, receipts, and internal review workflows as conceptual references.
- **Finem Fabricator** may project job/workflow status and agent outputs as candidates until HITL and permissions apply.
- **Content Engine** informs public marketing surfaces and interactive UX; it does not authorize syndication of private observations.

All contracts remain future-gated until legal, product, CRE alignment, and MVP0 mock proof complete.
