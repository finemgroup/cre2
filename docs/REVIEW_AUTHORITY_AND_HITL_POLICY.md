# Review Authority And HITL Policy

This policy defines human-in-the-loop review authority for candidate evidence.
It does not authorize queues, workers, schema work, provider sends, or production runtime.

## Authority Model

| Actor | May view queue | May approve private-use | May approve public projection | May revoke |
| --- | --- | --- | --- | --- |
| Anonymous public user | No | No | No | No |
| Source owner | Own candidate metadata only | No | No | Request only |
| Org member | Org-scoped candidates if permitted | No | No | Request only |
| Org admin | Org-scoped candidates if permitted | Private report use only if policy allows | No | Request only |
| Internal operator/reviewer | Yes | Yes | Yes, if source-use policy allows | Yes |
| Partner API | No | No | No | No |

## State Rules

- Candidate evidence cannot affect public projections.
- Needs-review evidence can be used only in clearly labeled private/operator contexts.
- Approved private-use evidence may inform private reports without changing public baseline.
- Approved public projection requires explicit reviewer action and source-use eligibility.
- Rejected, revoked, or superseded evidence remains auditable but cannot be reused for public projection.
- Publication hold blocks export/share/download until resolved.

## HITL Timeout Policy

Pending review must fail closed:

- Public projection: hold.
- Export/share/download: block or redact affected section.
- Private report: allow only if private-use policy permits and UI labels remain clear.
- Queue/job completion: never promotes evidence.

## Audit Requirements

Every review decision must produce or reference a receipt containing:

- Reviewer actor reference.
- Target evidence/observation reference.
- Prior and next state.
- Decision reason category.
- Idempotency key or replay hash.
- Redacted public projection.

## Runtime Acceptance Tests

- Queue completion alone never changes review state.
- Non-operator cannot approve public projection.
- Approved private-use does not appear in public property/search/comps output.
- Revoked evidence remains in audit view but not in resolved field output.
- Safe explanations never reveal hidden private values.
