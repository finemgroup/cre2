# Contribution Terms Decision Packet

This packet prepares product/legal decisions for real uploads and contributed facts.
It is not legal advice and does not authorize real uploads, storage, provider sends, schema work, or production runtime.

## Required Decisions Before Real Uploads

| Decision | Recommended MVP stance | Runtime gate |
| --- | --- | --- |
| Default contribution visibility | Private to source owner/org until explicit review and source-use approval. | Upload terms and actor-scoped evidence API. |
| Free-tier exchange | User receives prototype/report value without automatic public contribution. | Consent copy version captured on upload. |
| Public reuse | Only reviewed observations with public-use terms may influence public projections. | Review authority and permission tests. |
| Aggregated reuse | Allowed only when reconstruction risk is reviewed and source-owner identity is removed. | Aggregation policy and privacy review. |
| Attribution | Public pages should not expose source-owner identity by default. | Public citation redaction tests. |
| Revocation | Source owners can request revocation; revoked evidence remains auditable but not reusable. | Revocation receipt and audit policy. |
| Model training | Disabled unless explicitly consented in a separate term. | Legal approval and telemetry isolation. |

## Upload Consent Copy Requirements

Minimum copy must state:

- The upload is candidate evidence, not public truth.
- Private files are not made public merely because they were uploaded.
- Extracted observations may be reviewed for private report use.
- Public or aggregated reuse requires explicit terms and review.
- The user can request correction, revocation, or deletion according to the documented process.
- No live export, syndication, CRM sync, email, or partner send happens from upload alone.

## Acceptance Checklist For Future Runtime

- Terms are shown before file selection or upload confirmation.
- Terms version is stored with each governed upload receipt.
- Upload receipt references redacted evidence ids only.
- Public routes never reveal source-owner names, raw document text, private values, or upload filenames unless approved for public display.
- Free-tier UX does not imply automatic public contribution.

## Prototype Alignment

The mock `/upload` route already enforces:

- Stage-gated consent before simulated upload progress begins.
- Candidate evidence and upload receipt copy after completion.
- No file bytes sent or stored.
- Review-in-Studio handoff without public promotion.

See also: [FILE_SAFETY_AND_RETENTION_PLAN.md](FILE_SAFETY_AND_RETENTION_PLAN.md), [REVIEW_AUTHORITY_AND_HITL_POLICY.md](REVIEW_AUTHORITY_AND_HITL_POLICY.md), and [SECURITY_PRIVACY_LAUNCH_GATES.md](SECURITY_PRIVACY_LAUNCH_GATES.md).
