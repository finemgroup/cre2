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
- Source extract: derived text/table/value span from a source document.
- Chunk/embedding: retrieval sidecar derived from a document or extract, never business truth.
- Observation: sourced claim about a property field.
- Observation visibility policy: who may see an observation or its derived value.
- Resolved field value: latest permitted value for a specific actor and context.
- Comp candidate: submitted or extracted comp before review/promotion.
- Resolved comp set: permission-filtered comp set used for a report or valuation.
- Review state: unreviewed, needs evidence, conflicting, accepted public, accepted private, rejected, revoked, superseded, or blocked.
- Operational receipt: audit/correlation reference for upload, extraction, review, report generation, export, or publication.
- Report artifact: valuation/reporting output with evidence appendix and export/share policy.

## Invariants

- Documents are evidence; chunks and embeddings are retrieval sidecars.
- Observations do not overwrite truth by default.
- Resolved values are actor-specific and permission-filtered.
- Public baseline values may remain visible even when private observations differ.
- AI extraction creates candidates, not canonical facts.
- Public promotion requires review and source-use eligibility.
- Private uploads must not leak through search, report generation, export, or aggregate views.
- Audit and activity records should not be collapsed into narrative comments or evidence records.

## Future Contract Ideas

- `DocumentEvidence` contract for source identity, source-use policy, owner scope, hash, review state, and publication eligibility.
- `ObservationVisibilityPolicy` contract for actor, org, public/private tier, source rights, and sharing scope.
- `ResolvedFieldValue` contract for actor-specific field resolution.
- `CompCandidate` and `ResolvedCompSet` contracts for reviewed and permissioned valuation inputs.
- `OperationalReceipt` contract for idempotency, correlation, replay safety, and audit references.

These are names for future discussion only and do not authorize implementation.
