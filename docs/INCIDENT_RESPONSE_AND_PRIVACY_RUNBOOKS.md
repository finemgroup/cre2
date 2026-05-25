# Incident Response And Privacy Runbooks

These runbooks prepare production operations.
They do not authorize production deployment, monitoring providers, outbound sends, schema work, or incident tooling.

## Security Incident Triage

1. Freeze affected export/share/indexing/outbound capability.
2. Preserve audit receipts and redacted action records.
3. Identify affected actor classes, evidence ids, routes, and receipts.
4. Verify whether private values, source-owner identity, provider data, document text, or secrets were exposed.
5. Remove public exposure paths and rotate any affected credentials if applicable.
6. Prepare operator-approved notification plan.
7. Record post-incident controls and regression tests.

## Privacy Request Handling

1. Verify requester authority as source owner, org admin, or authorized representative.
2. Locate evidence identities, observations, reports, receipts, exports, and indexed pages.
3. Classify request: correction, deletion, revocation, attribution change, or dispute.
4. Recompute affected public projections and export eligibility.
5. Preserve redacted audit record where legally required.
6. Confirm completion with safe, non-leaking copy.

## Evidence Revocation

- Mark evidence revoked or superseded.
- Remove from resolved fields and report source bundles.
- Block future exports that depend on the source.
- Keep receipt/audit references redacted.
- Trigger sitemap/cache removal if public projection was affected.

## Export Or Share Takedown

- Identify receipt and artifact scope.
- Block replay or regeneration if policy no longer allows.
- Remove share link or public artifact if one exists in future runtime.
- Record takedown receipt.
- Notify only through approved consent/outbound channel.

## Launch Stop Conditions

- Unknown source rights.
- Private data in public HTML, metadata, analytics, logs, or receipts.
- Missing idempotency on governed writes.
- No reviewer identity for public projection.
- No rollback path for indexing/export/share.
