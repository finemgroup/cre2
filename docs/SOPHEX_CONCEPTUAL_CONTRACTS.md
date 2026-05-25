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

## Contract: ValuationVersion

Governed valuation snapshot for assumptions, evidence, calculations, scenarios, and report/export readiness.

**Fields (conceptual):** valuation version id, property/report link, actor context, assumption set, scenario set refs, model/disclosure version, source bundle refs, evidence snapshot ref, results summary, review state, readiness state, export policy, receipt refs, created/updated/as-of timestamps.

**Invariants:** versions append; approved/exported versions do not silently mutate when source observations change; public copy remains advisory unless review and source-rights gates clear.

## Contract: UnderwritingReadiness

Ordered readiness ladder for valuation/report work.

**Fields (conceptual):** readiness id, valuation/report ref, gate list, current step, blockers, warnings, next safe action, reviewed-by refs, updated timestamp.

**Invariants:** readiness labels are orientation, not permission; export/public projection authority remains a separate gate.

## Contract: WorkflowGate

Machine-readable gate for assumptions, evidence, review, export, indexing, and publication.

**Fields (conceptual):** gate id, gate family, severity, target artifact, status, safe blocker reason, required evidence/review/action, policy version, correlation id.

**Invariants:** missing/unknown gate status fails closed for export, publication, and partner API access.

## Contract: EvidenceSnapshot

Permission-filtered source/evidence state captured at approval, report generation, export, share, or publication time.

**Fields (conceptual):** snapshot id, actor context, source bundle refs, included evidence refs, excluded/redacted refs, source-use policy versions, as-of timestamp, checksum/manifest hash, receipt ref.

**Invariants:** a snapshot is a manifest of permitted evidence state; it is not raw file storage and must not reveal hidden evidence through exclusion details.

## Contract: MapLayerManifest

Metadata and policy for a spatial layer used in public maps, comp discovery, reports, or valuation context.

**Fields (conceptual):** layer id, source family, provider/source label, visibility class, precision class, as-of/refreshed timestamp, review state, payload size class, lazy-load policy, allowed contexts, source-rights policy, fallback copy.

**Invariants:** layer metadata may load before geometry; geometry/payload access remains permissioned and source-rights checked.

## Contract: SpatialEvidence

Evidence identity for geocode, parcel, trade-area, radius, drive-time, zoning, traffic, demographic, or map-derived claims.

**Fields (conceptual):** spatial evidence id, property/region/link target, geometry or coordinate ref, coordinate system/projection label, source evidence ref, geocode confidence, precision class, review state, visibility policy, observed/refreshed timestamp.

**Invariants:** spatial claims carry precision and source labels; public maps must not imply legal boundary, title, survey, zoning entitlement, or live traffic certainty without approved source rights.

## Contract: TradeArea

Market-region abstraction for radius, drive-time, pedestrian area, custom polygon, or provider-defined region.

**Fields (conceptual):** trade area id, method, origin property/ref, geometry ref, source/provider label, parameters, precision class, as-of timestamp, permitted derived metrics, report eligibility.

**Invariants:** derived metrics preserve dependency refs and cannot be exported if their source layer or provider terms block the requested use.

## Contract: OperationalReceipt

Audit and idempotency reference for a governed action.

**Fields (conceptual):** receipt id, correlation id, idempotency key, action type, actor, target entity, outcome, timestamp, content hash where applicable.

**Applies to:** upload, extraction, review decision, report generation, export/download/share, publication, contribution acceptance.

**Invariants:** replay-safe; user-facing status is a projection of receipt state, not queue internals.

## Contract: AuditReceipt

Policy and operational receipt family for source-sensitive governed actions.

**Fields (conceptual):** receipt id, receipt kind, actor, target artifact, evidence refs (redacted where needed), policy decision, safe next action, idempotency key, correlation id, replay hash, timestamp.

**Invariants:** receipt existence is not execution authority; public routes store redacted refs and never expose raw internal logs.

**Fabricator clarification:** clean Fabricator confirms audit events and `audit_receipt_ref` patterns, but not a single drop-in Sophex `AuditReceipt` type. Sophex must define its own external receipt shape before runtime work.

## Contract: ReviewDecision

Human or operator review result for a candidate, report section, source packet, moderation signal, or promotion request.

**Fields (conceptual):** decision id, reviewed artifact, reviewer actor, decision kind, rationale, required follow-ups, evidence refs, blocked actions, reviewed timestamp, policy version, correlation id.

**Invariants:** Fabricator-style decisions can recommend, reject, or hold. Sophex publication/export/promotion authority remains a separate gate and must never be implied by review packet existence.

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
- **CRE underwriting annex** provisionally informs readiness ladders, workflow gates, valuation versions, evidence snapshots, scenario posture, and export manifests; no runtime/schema adoption is authorized.
- **ICSC Map Recovery** provisionally informs map layer manifests, spatial evidence, coordinate verification, trade-area abstractions, accessibility fallbacks, and layer performance budgets; no map asset/runtime adoption is authorized.
- **Finem Fabricator** clean harvest confirms evidence envelopes, AnalysisResponse-style reports, review recommendation/hold semantics, and status projection patterns; these remain candidates/control-plane signals until HITL, permissions, source-use, and audit gates apply.
- **Content Engine** informs public marketing surfaces and interactive UX; it does not authorize syndication of private observations.

All contracts remain future-gated until legal, product, CRE alignment, and MVP0 mock proof complete.
