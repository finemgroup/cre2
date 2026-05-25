# API Contract Draft

This document describes sandbox endpoint contracts only.
It is not a schema, migration, generated client, production service, or deploy plan.

## Contract Rules

- Every sensitive request carries actor context.
- Every governed write carries an idempotency key.
- Every governed write returns a redacted receipt.
- Every response is permission-filtered before it reaches the client.
- Denied responses use safe explanations that do not confirm hidden facts.

## Versioning And Transport

- Base path: `/sandbox/v0`.
- Contract family: `sophex.evidence-permission`.
- Actor context should be sent as `X-Sophex-Actor-Context` for reads or as `actorContext` in governed write bodies when a body already exists.
- Idempotency should be sent as `Idempotency-Key` and echoed in receipt-bearing responses.
- Errors use the same safe envelope as successful denials.
- Pagination uses `cursor` and `limit` for collection endpoints; cursors are opaque.

## Standard Error Envelope

```json
{
  "error": {
    "code": "visibility_denied",
    "safeMessage": "This source is not available in the current view.",
    "correlationId": "corr_..."
  }
}
```

## Draft Endpoints

| Endpoint | Purpose | Actor context | Receipt |
| --- | --- | --- | --- |
| `GET /sandbox/properties` | Public baseline property search. | Optional; defaults to anonymous. | No |
| `GET /sandbox/properties/:id` | Actor-filtered property detail and evidence drawer. | Required for non-public views. | No |
| `GET /sandbox/properties/:id/comps` | Actor-filtered comp comparison. | Required. | No |
| `POST /sandbox/uploads/candidates` | Create metadata-only candidate evidence. | Required source owner/contributor. | Upload receipt |
| `GET /sandbox/review-queue` | Internal candidate review queue. | Internal operator only. | No |
| `POST /sandbox/review-queue/:id/decision` | Approve/reject/revoke candidate evidence. | Internal operator only. | Review receipt |
| `GET /sandbox/reports/:id` | Actor-filtered report sections and source bundle. | Required. | No |
| `POST /sandbox/exports` | Evaluate export/share/download/partner delivery. | Required. | Export or blocked receipt |
| `POST /sandbox/analytics/events` | Validate redacted telemetry payload. | Required or anonymous class. | No |

## Endpoint Details

### `GET /sandbox/v0/properties`

- Actor context: optional; missing context becomes anonymous public.
- Query: `q`, `cursor`, `limit`.
- Response: public baseline property cards only.
- Denied behavior: omitted, not hinted.
- Fixture expectations: public actor sees public baseline cap rate only.

### `GET /sandbox/v0/properties/:id`

- Actor context: required for private/source-owner/org views.
- Response: property summary, resolved fields, evidence drawer projection.
- Visibility behavior: same field may resolve differently per actor.
- Denied behavior: safe explanation without hidden value.

### `GET /sandbox/v0/properties/:id/comps`

- Actor context: required.
- Response: comp rows with authority labels and blocked/provider reasons.
- Visibility behavior: paid plan alone does not bypass provider rights.
- Pagination: cursor/limit if comp set exceeds page size.

### `POST /sandbox/v0/uploads/candidates`

- Actor context: body required.
- Idempotency: `Idempotency-Key` required.
- Response: candidate evidence metadata and upload receipt.
- Boundary: metadata only until file safety approval; no real byte storage.

### `GET /sandbox/v0/review-queue`

- Actor context: internal operator required.
- Response: internal-only review queue projection.
- Denied behavior: empty or safe denied response; never expose queue existence to public users.

### `POST /sandbox/v0/review-queue/:id/decision`

- Actor context: internal operator required.
- Idempotency: required.
- Body: decision, reason category, target evidence/observation reference.
- Response: review receipt and next review state.
- Rule: job completion alone cannot call this endpoint.

### `GET /sandbox/v0/reports/:id`

- Actor context: required.
- Response: permission-filtered sections, source bundle posture, blocker categories.
- Visibility behavior: private/provider-restricted sources redacted or omitted by policy.

### `POST /sandbox/v0/exports`

- Actor context: required.
- Idempotency: required.
- Body: report id, artifact scope, consent copy/version, requested sections.
- Response: export receipt or blocked receipt.
- Replay: same idempotency key returns same receipt for same actor/target/scope or fails closed on conflict.

### `POST /sandbox/v0/analytics/events`

- Actor context: required or anonymous marker.
- Body: event taxonomy payload from `OBSERVABILITY_EVENT_TAXONOMY.md`.
- Response: accepted/dropped validation result.
- Rule: unsafe payloads are dropped, not partially sent.

## Request Examples

### Candidate Upload

```json
{
  "actorContext": {
    "actorClass": "source-owner",
    "sourceOwnerId": "source-alex",
    "purpose": "evidence-panel"
  },
  "propertyId": "demo-001",
  "fileName": "Rent Roll.pdf",
  "idempotencyKey": "upload-rent-roll-001"
}
```

Expected response:

```json
{
  "evidence": {
    "visibility": "user-private",
    "reviewState": "candidate",
    "sourceUsePolicy": "private-use"
  },
  "receipt": {
    "kind": "upload",
    "policyDecision": "allowed",
    "redactedEvidenceRefs": ["evidence:..."]
  }
}
```

### Export Evaluation

```json
{
  "actorContext": {
    "actorClass": "org-admin",
    "organizationId": "org-finem",
    "purpose": "export"
  },
  "reportId": "report-demo-001",
  "scope": "download",
  "consent": true,
  "idempotencyKey": "export-demo-001-001"
}
```

Expected blocked response:

```json
{
  "allowed": false,
  "blockerCategories": ["source-rights"],
  "receipt": {
    "kind": "blocked",
    "policyDecision": "blocked",
    "redactedEvidenceRefs": ["evidence:..."]
  }
}
```

## Explicit Non-Schema Boundary

These contracts intentionally omit:

- Table names.
- Column names.
- Prisma models.
- Migration sequences.
- Production database targets.
- Generated client instructions.

## Pagination Example

Request:

`GET /sandbox/v0/properties?q=Austin&limit=2&cursor=prop_cursor_demo-001`

Response:

```json
{
  "items": [
    { "id": "demo-001", "address": "1200 Commerce St", "authority": "public-baseline" }
  ],
  "page": {
    "limit": 2,
    "nextCursor": "prop_cursor_demo-002",
    "hasMore": true
  }
}
```

Denied or hidden properties never appear as empty placeholders with private hints.

## Idempotency Conflict Example

Replay with the same `Idempotency-Key` and compatible actor/target/scope returns the prior receipt:

```json
{
  "replayed": true,
  "receipt": {
    "id": "receipt-export-demo-001",
    "kind": "export",
    "policyDecision": "allowed"
  }
}
```

Conflicting replay (different scope or actor for the same key) fails closed:

```json
{
  "error": {
    "code": "idempotency_conflict",
    "safeMessage": "This request key was already used for a different governed action.",
    "correlationId": "corr_..."
  }
}
```

## Prototype Alignment Notes

The mock prototype implements the following contract shapes locally without HTTP:

- Upload candidate evidence via `createCandidateUpload`.
- Export policy via `evaluateExportPolicy` and governed receipts.
- Review queue projection via `getReviewQueue`.
- Valuation readiness via `evaluateWorkflowGates` and `getValuationVersionForActor`.
- Spatial layer manifests via `getMapLayerManifestsForActor`.

Future sandbox runtime tickets must mirror these shapes before production services are approved.
