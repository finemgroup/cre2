# Future Schema Concepts

This document is conceptual only. It contains no Prisma schema, migration instructions, SQL, generated-client guidance, or implementation commands.

## Governance Gates

Before schema or runtime work, Sophex needs:

- Legal/source-use review for contributed documents and comps.
- Product approval for public/private contribution terms.
- CRE alignment decision for evidence and source-observation contracts.
- Permission model review for field, evidence, report, and retrieval visibility.
- UX review for authority labels and source panels.
- Mock or sandbox proof before real data integration.

## Conceptual Entities

- Account identity: login and user account.
- Contribution identity: actor credited or responsible for a submitted observation.
- Organization: team or company scope for private data.
- Property: public or private property subject.
- Public baseline fact: public-record/GIS/title/demographic value.
- Source document: durable evidence identity and metadata; blob storage owns bytes.
- Document evidence registry: policy/review/source-family layer over file identity with hashes, timestamps, receipt refs, idempotency, correlation, supersession, freshness, and HITL state.
- Source extract: derived text/table/value span from a source document.
- Chunk/embedding: retrieval sidecar derived from a document or extract, never business truth.
- Observation: sourced claim about a property field.
- Observation visibility policy: who may see an observation or its derived value.
- Resolved field value: latest permitted value for a specific actor and context.
- Comp candidate: submitted or extracted comp before review/promotion.
- Resolved comp set: permission-filtered comp set used for a report or valuation.
- Review state: unreviewed, needs evidence, conflicting, accepted public, accepted private, rejected, revoked, superseded, or blocked.
- Operational receipt: audit/correlation reference for upload, extraction, review, report generation, export, or publication.
- Policy decision receipt: source/policy outcome record that may block or permit a future operational action.
- Report artifact: valuation/reporting output with evidence appendix and export/share policy.
- Contribution exchange terms: visibility, aggregation, and model-training consent bound to free/paid tiers.
- Lead capture intent (future-gated): consent-scoped capture record without send automation.
- Public market page projection: SEO/GEO-facing public baseline view with indexing eligibility flag.

### Fabricator-Inspired Workflow Concepts (Conceptual Only)

- **IngestionRun** — governed upload/classification attempt with cost tier, blocked state, and receipt link.
- **ExtractionCandidate** — pre-observation extract with source span, confidence, method, visibility; not promoted truth.
- **ReviewDecision** — HITL outcome: accepted public/private, rejected, needs-evidence, superseded, revoked, blocked.
- **ReportGenerationRun** — report assembly attempt with AnalysisResponse-style outputs and export eligibility flag.
- **JobStatusProjection** — user-safe phase timeline derived from internal runs; not raw queue state.
- **AgentRunReceipt** — idempotent audit record for agent/workflow actions with correlation ID.
- **ModerationSignal** — non-final moderation hint requiring human operator decision.
- **SourceConfidenceScore** — ranked confidence/freshness/dispute label for a candidate or observation.

These are conceptual contract names for future discussion. They do not authorize implementation, Prisma models, SQL, migrations, or generated clients.

## Invariants

- Documents are evidence; chunks and embeddings are retrieval sidecars.
- Document evidence registry is separate from source document bytes and from public field truth.
- Observations do not overwrite truth by default.
- Resolved values are actor-specific and permission-filtered.
- Public baseline values may remain visible even when private observations differ.
- AI extraction creates candidates, not canonical facts.
- Public promotion requires review and source-use eligibility.
- Private uploads must not leak through search, report generation, export, or aggregate views.
- Audit and activity records should not be collapsed into narrative comments or evidence records.
- Queue or job completion does not promote candidates to observations (Fabricator boundary).
- Receipt/display-table existence does not grant execution authority.
- JobStatusProjection is user-safe; internal run logs are operator-only.

## Future Contract Ideas

- `DocumentEvidence` contract for source identity, source-use policy, owner scope, hash, review state, and publication eligibility.
- `ObservationVisibilityPolicy` contract for actor, org, public/private tier, source rights, and sharing scope.
- `ResolvedFieldValue` contract for actor-specific field resolution.
- `CompCandidate` and `ResolvedCompSet` contracts for reviewed and permissioned valuation inputs.
- `OperationalReceipt` contract for idempotency, correlation, replay safety, and audit references.
- `AuditReceipt` / policy receipt contract for redacted evidence refs, safe next action, and execution-authority separation.
- `ContributionExchange` contract for free-for-contribution terms and visibility grants.
- `LeadCaptureIntent` contract for consent-bound capture without authorizing send automation.
- `PublicMarketPageProjection` contract for indexable public baseline pages.

These are names for future discussion only and do not authorize implementation.

See also `docs/SOPHEX_CONCEPTUAL_CONTRACTS.md` for the integrated contract set.
