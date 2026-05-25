# Runtime Foundation Sandbox Plan

This plan describes the first runtime foundation after explicit approval.
It does not implement runtime code, schema, migrations, generated clients, production services, provider sends, queues, or deploys.

## Scope

The first runtime foundation should be sandbox-only and mock/synthetic-data-only.
Its purpose is to prove server-side permission enforcement, receipts, and evidence workflows before any production integration.

## Required Prior Approvals

Implementation must not begin until:

- `PRODUCTION_ARCHITECTURE_PACKET.md` is reviewed.
- `EVIDENCE_PERMISSION_CONTRACTS.md` is reviewed.
- `SECURITY_PRIVACY_LAUNCH_GATES.md` is reviewed.
- `SISTER_SCHEMA_BORROWING_GATE.md` is either still closed or has produced an approved diff packet.
- Operator explicitly approves runtime implementation in the correct lane.

## Sandbox Runtime Approval Checklist

Before any sandbox server code is started, the operator should confirm:

- API contracts in `API_CONTRACT_DRAFT.md` are accepted for sandbox transport, error envelopes, actor context, and idempotency.
- Contribution terms posture in `CONTRIBUTION_TERMS_DECISION_PACKET.md` is acceptable for metadata-only upload simulation.
- File safety posture in `FILE_SAFETY_AND_RETENTION_PLAN.md` is acceptable, including the no-real-bytes sandbox default.
- HITL authority in `REVIEW_AUTHORITY_AND_HITL_POLICY.md` is acceptable.
- Observability taxonomy in `OBSERVABILITY_EVENT_TAXONOMY.md` is accepted.
- Incident and privacy runbooks in `INCIDENT_RESPONSE_AND_PRIVACY_RUNBOOKS.md` are sufficient for sandbox rehearsal.
- Sister schema gate remains closed unless a separate approved diff packet exists.
- Operator signoff checklists: [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md)

## Foundation Modules

| Module | Minimum capability | First tests |
| --- | --- | --- |
| Identity sandbox | Anonymous, authenticated user, org member, source owner, internal operator, partner/API actor fixtures. | Actor context defaults to public baseline; no role escalation. |
| Property baseline API | Public property search and detail from sandbox seed data. | Public route cannot see private observations. |
| Observation API | Append-only sandbox observations with visibility class and source refs. | Same field resolves differently per actor. |
| Evidence API | Evidence identity records, source metadata, review state, redacted refs. | Private evidence hidden from public user. |
| Upload placeholder | Metadata-only upload flow with no production storage. | Candidate evidence created, not promoted. |
| Review queue | HITL review decisions for candidate observations/evidence. | Only reviewer/operator can promote; queue completion alone cannot promote. |
| Report API | Permission-filtered report sections and source bundle. | Private/provider-restricted sources excluded from public report. |
| Export receipt API | Idempotent export request returning receipt. | Replay returns same receipt or fails closed. |
| Audit log | Governed action records with redacted public projections. | Public receipt never exposes raw internal details. |

## Contract Simulator Bridge

The prototype now has a mock-only contract simulator target that can inform sandbox endpoints without becoming schema:

- `prototype/src/lib/contracts/actor-context.ts`
- `prototype/src/lib/contracts/visibility.ts`
- `prototype/src/lib/contracts/evidence.ts`
- `prototype/src/lib/contracts/review-state.ts`
- `prototype/src/lib/contracts/receipts.ts`
- `prototype/src/lib/contracts/fixtures.ts`
- `prototype/src/lib/runtime/*`

Future sandbox APIs should preserve these invariants and replace only the data source, not the permission semantics.

## Replacement Sequence From Prototype

1. Replace public property/search mock data with sandbox public baseline API.
2. Replace property evidence drawer with permission-filtered evidence API.
3. Replace upload completion mock with metadata-only candidate evidence creation.
4. Replace Studio intake staged import mock with review queue fixtures.
5. Replace comps mock with permission-filtered comp set API.
6. Replace report builder source bundles with report API.
7. Replace export placeholder with idempotent receipt API.
8. Replace Broker OS projections with sanitized job-status projections only after queue model is approved.

## Permission Test Fixtures

The sandbox must include test actors:

- Anonymous public user.
- Free contributor.
- Paid/private user.
- Source owner.
- Organization admin.
- Organization member.
- Internal operator.
- Partner/API consumer.

Required fixture facts:

- Public baseline acreage/cap-rate value.
- User-private conflicting observation.
- Organization-private observation.
- Provider-restricted comp.
- Candidate evidence awaiting review.
- Reviewed/promoted public projection.
- Blocked export source.
- Redacted receipt projection.

## Server-Side Enforcement Rules

- No endpoint may rely on UI state for authorization.
- Every sensitive endpoint accepts or derives an actor context.
- Every response is already filtered before reaching the client.
- Every governed write requires an idempotency key.
- Every governed write emits or references a receipt.
- Private values must not appear in errors, logs, telemetry, or redaction reasons.

## Sandbox Non-Goals

- No production DB.
- No sister-project runtime imports.
- No real document byte storage unless separately approved.
- No OCR/provider/Docling runtime.
- No billing provider.
- No CRM/email/partner sends.
- No public indexing.
- No production deploy.

## Exit Criteria

Sandbox foundation is complete when:

- Permission fixture matrix passes at API level.
- Public routes can run against sandbox public baseline data.
- Private observations resolve only for permitted actors.
- Candidate evidence cannot affect public projections without review.
- Export receipt idempotency is proven.
- Audit logs and public receipts remain redacted.
- Prototype UI can be switched module-by-module without weakening trust labels.

## Handoff To Production Work

After sandbox proof:

1. Re-run sister-project schema borrowing gate if the sister project is ready.
2. Approve or reject contract changes.
3. Decide production storage, auth, billing, and deployment stack.
4. Add production CI/CD, security scanning, observability, and manual accessibility gates.
5. Only then consider production migrations or deploys in an explicitly authorized lane.
