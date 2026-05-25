# Evidence, Permission, Audit, And Export Contracts

These are versioned product/API contracts, not schema definitions.
They intentionally avoid SQL, Prisma, migrations, generated clients, and implementation code.

## Contract Versioning

- Contract family: `sophex.evidence-permission`
- Initial version: `v0-draft`
- Stability: design draft, not runtime-ready
- Runtime gate: requires architecture, security/privacy, and schema-borrowing approval

## Actor Context Contract

An actor context is required for every sensitive read and governed write.

Conceptual fields:

- Actor id or anonymous marker.
- Actor class: anonymous public user, free contributor, paid/private user, source owner, organization member, internal operator, partner/API consumer.
- Organization scope.
- Source-owner grants.
- Entitlements.
- Purpose/context: search, evidence panel, comp comparison, valuation, report, export, admin review, partner API.

Invariants:

- Missing actor context defaults to public baseline only.
- Internal operator access is never implied by authenticated user status.
- Partner/API consumers require explicit contract scopes.

## Visibility Decision Contract

A visibility decision answers whether a value, source, extract, document, comp, report section, or export artifact may be returned.

Conceptual fields:

- Decision: allow, deny, redact, aggregate-only, hold-for-review.
- Visibility class: public baseline, user-private, organization-private, shared-with-permission, anonymized/aggregated, internal-only.
- Source-use policy.
- Entitlement basis.
- Review state.
- Redaction reason.
- Safe display label.

Invariants:

- Deny by default.
- UI state never grants access.
- Redaction reasons should be safe to show without leaking the hidden fact.

## Evidence Identity Contract

Evidence identity records durable source metadata and policy.

Conceptual fields:

- Evidence id.
- Source family/type.
- Property/deal/report linkage.
- Uploader/source-owner actor.
- Organization scope.
- Visibility class.
- Source-use policy.
- File reference or external source reference.
- Source hash or digest.
- Uploaded/observed/extracted timestamps.
- Review state.
- Supersession/revocation state.
- Receipt references.

Invariants:

- File bytes are not business truth.
- Chunks and embeddings are retrieval sidecars only.
- Revoked or superseded evidence must remain auditable without being reusable for public projections.

## Observation Contract

An observation is a sourced claim about a field.

Conceptual fields:

- Observation id.
- Property id.
- Field key.
- Value payload.
- Source evidence reference.
- Extract/span reference when applicable.
- Actor/source owner.
- Confidence.
- Visibility decision.
- Review state.
- Lineage parent.
- Observed timestamp.

Invariants:

- Observations append; they do not silently overwrite truth.
- Public projections are promoted from observations only through governed review.
- A private observation may influence a private report without changing public baseline.

## Resolved Field Contract

A resolved field is the value shown to one actor in one context.

Conceptual fields:

- Property id.
- Field key.
- Actor context hash/reference.
- Resolved value.
- Winning observation references.
- Authority label.
- Freshness label.
- Dispute/stale flags.
- Safe explanation copy.

Invariants:

- The same field can resolve differently for different actors.
- Public users may see public GIS while a source owner sees deed-backed private variance.
- Explanations must not reveal hidden private values.

## Report And Export Contract

A report/export action is governed by review, consent, source rights, and idempotency.

Conceptual fields:

- Report id.
- Actor context.
- Section states.
- Source bundle references.
- Export policy.
- Consent copy/version.
- Artifact scope: preview, download, share, partner delivery.
- Idempotency key.
- Receipt reference.

Invariants:

- Every material claim traces to permitted evidence.
- Export filters out non-permitted sections, citations, and private facts.
- Replaying the same governed export returns the existing receipt or rejects safely.

## Receipt Contract

A receipt is the public-safe proof of a governed action.

Conceptual fields:

- Receipt id.
- Receipt kind: upload, extraction, review, promotion, report generation, export, share, deletion/revocation, partner access.
- Actor reference.
- Target reference.
- Policy decision.
- Idempotency key.
- Correlation id.
- Replay hash.
- Redacted evidence references.
- Timestamp.
- Safe next action.

Invariants:

- Receipt existence is not evidence authority.
- Public receipts expose redacted references only.
- Internal logs, queue ids, worker ids, stack traces, and secrets never appear in public receipt projections.

## Fail-Closed Permission Test Matrix

| Scenario | Expected result |
| --- | --- |
| Anonymous user searches property with private user upload present. | Return public baseline only; no private value, source name, or hint. |
| Source owner opens their uploaded document evidence. | Return their evidence metadata and permitted extracted candidates. |
| Organization member opens org-private comp. | Return only if org membership and source policy allow it. |
| Paid user requests provider-restricted comp. | Return only if entitlement and provider rights both allow. |
| Partner API requests report fields. | Return contract-approved fields only, with public/private filters applied. |
| Internal operator opens review queue. | Return review data with internal-only policy; never expose this feed publicly. |
| Export attempts to include blocked source. | Deny or redact section, record receipt, and explain safe blocker reason. |

## Contract Promotion Path

1. Draft product/API contract.
2. Review against sister-project schema concepts when stable.
3. Add permission test fixtures.
4. Approve sandbox runtime implementation.
5. Implement server-side enforcement.
6. Add audit and observability.
