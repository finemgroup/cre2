# Trust And Permissions Model

Sophex must resolve property intelligence from permissioned observations, not from a single mutable field that all users share.

## Actor Classes

- Public anonymous user: sees public baseline and public marketplace outputs only.
- Free contributor: may see contribution-earned views according to terms.
- Paid/private user: may create and view private or organization-private property intelligence.
- Source owner: controls visibility of uploaded documents or contributed facts where terms grant that control.
- Internal operator: may review, moderate, reconcile, and audit according to internal policy.
- Partner/API consumer: receives only contract-approved fields, scopes, and aggregate outputs.

## Visibility Classes

- Public baseline: lawful public records and canonical public projections.
- User-private: visible only to the submitting user or source owner.
- Organization-private: visible to members of an authorized org/team.
- Shared-with-permission: visible to explicitly granted actors.
- Anonymized/aggregated: transformed output where source-private values cannot be reconstructed.
- Internal-only: moderation, audit, review, risk, and operations data.

## Field-Level Value Resolution

Each displayed field should be resolved as the latest observation the actor has permission to see. The field is effectively a lookup over source observations and change-log entries filtered by actor, visibility, source rights, confidence, and policy.

Example: public GIS says a parcel has 3.00 acres. User A submits 3.01 from a deed. User B submits 3.01 from a survey. User C submits 3.09 from an appraisal. User D submits 3.90 from an unverified listing.

- Anonymous public user may still see 3.00 from public GIS.
- User A may see 3.01 because their deed-backed observation is permitted to them.
- User B's organization may see 3.01 if the survey is org-private.
- A paid user with licensed access may see a reconciled or confidence-weighted permitted value.
- Internal operators may see all four observations and their lineage for review.

The system must not leak private facts by showing the newest value globally. Permissions must be enforced at the query/API layer and later tested at that layer.

## Retrieval Permissions

Permission filtering must apply at every retrieval hop, including:

- Property search.
- Field value resolution.
- Evidence panels.
- Document/chunk retrieval.
- Comp comparison.
- Valuation model inputs.
- Report generation.
- Export/share actions.
- Future partner/API access.
- Future command palette / global search (must not surface private observations).

The system cannot rely on hiding buttons in the UI. A user, organization, source owner, partner, or internal operator should receive only the observations, evidence, report artifacts, and aggregates their policy allows.

## Authority Labels

Future UI and API contracts should carry labels that explain the authority of a value:

- Public baseline.
- User-private.
- Organization-private.
- Shared-with-permission.
- Reviewed.
- Unreviewed.
- Stale.
- Disputed.
- Blocked.
- Promoted.
- Model-inferred.

Labels should explain why a value is visible, such as "visible because your organization uploaded this lease" or "public GIS baseline."

## Cleanup Without Exposure

Users should be able to submit corrections or cleanup requests without exposing all private/user values to every viewer. Moderation and reconciliation views can show more detail to internal operators than public or marketplace views.
