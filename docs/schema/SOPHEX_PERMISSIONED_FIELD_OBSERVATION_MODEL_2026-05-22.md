# Sophex Permissioned Field Observation Model

**Status:** Permission model contract  
**Date:** 2026-05-22  
**Implementation status:** `CONTRACT_ONLY`

## Core Idea

Sophex field values are not a single global latest row. A user sees the latest or highest-ranked value they are allowed to see.

Public baseline values, private user observations, organization-private corrections, and reviewed platform values may coexist for the same property field.

## Model Chain

1. **Public baseline value** — lawful public/public-safe record, visible under current policy.
2. **Source observation** — raw observed fact from a document, public record, user entry, agent extraction, or analyst note.
3. **Field observation** — typed field-level candidate derived from a source observation.
4. **Observation visibility policy** — explicit rule for actor/org/public access.
5. **Resolved field value** — query-time or cached projection for a specific actor/context.

## Visibility Rules

- Public viewers may see public baseline values.
- A contributing organization may see its private correction.
- Another organization may still see the public baseline.
- Internal reviewers may see multiple conflicting observations.
- Export/report surfaces must filter by actor context and source-use policy.

## No UI-Only Permissions

Permissions must be enforced in future query/API contracts. UI labels are explanatory, not enforcement.

## Example

For `gla_sqft`:

- public baseline says `42,000`;
- user upload extracts `44,100` from a rent roll;
- reviewer marks the upload as organization-private;
- public viewer sees `42,000`;
- uploader sees `44,100` with private/candidate label;
- reviewer sees both, plus evidence refs and confidence/freshness.

## Required Metadata

Field observations and visibility policies need:

- actor/org scope;
- source/evidence refs;
- visibility posture;
- source-use policy;
- review/promotion status;
- confidence/freshness;
- idempotency/correlation refs;
- revocation/supersession posture;
- created/updated timestamps.

## Alignment

This model aligns to CRE DCI-E1 document evidence and future DCI-C0 source observations without requiring Sophex to share CRE physical tables.
