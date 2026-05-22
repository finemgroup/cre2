# Sophex Schema Wave Roadmap

**Status:** Wave roadmap  
**Date:** 2026-05-22  
**Implementation status:** `CONTRACT_ONLY`

All waves are future-gated until a real DB provider, migration tool, contract review, legal/source-use review, and implementation lane are approved.

## Proposed Waves

| Wave | Purpose | DB Action Now |
| --- | --- | --- |
| SOPHEX-S0 | Schema contracts only, no DB | None |
| SOPHEX-E1 | Document evidence contract alignment | None |
| SOPHEX-C0 | Source observation contract | None |
| SOPHEX-C1 | Comp candidate contract | None |
| SOPHEX-L1 | Lease/rent schedule candidate model | None |
| SOPHEX-D1 | Deal ecosystem edge model | None |
| SOPHEX-I1 | Investment details projection | None |
| SOPHEX-PERM1 | Permissioned field-value resolution | None |
| SOPHEX-REPORT1 | Valuation/report artifact model | None |

## Wave Notes

### SOPHEX-S0

Local docs and SQL contract draft only. No DB connection, migrations, schema tool, seed, or deployment.

### SOPHEX-E1

Align Sophex document evidence with CRE DCI-E1 concepts: file identity, source hash, source-use policy, review state, idempotency/correlation refs, revocation/supersession.

### SOPHEX-C0

Define source observations as raw sourced facts. Do not write canonical comps directly from extraction.

### SOPHEX-C1

Define comp candidates and evidence links. A master comp means candidate ecosystem, not one canonical truth table.

### SOPHEX-L1

Define tenants, leases, spaces, and rent schedules. Lease economics are linked records, not flat deal columns.

### SOPHEX-D1

Define named rich join/edge tables for relationships. Defer universal `entity_edges` until governance exists.

### SOPHEX-I1

Define investment details projection for NOI, WALT, occupancy, blended rent, and confidence. Projection is derived, not truth.

### SOPHEX-PERM1

Define field observation visibility and resolved field values. Query-level permissions are mandatory.

### SOPHEX-REPORT1

Define report artifacts with sections, citations, warnings, reviewRequired, export policy, white-label scope, and audit receipt refs.

## Hard Gates

- No public launch until legal/source-use/privacy terms are answered.
- No physical DB sharing with CRE until separately approved.
- No trigger-heavy calculations in early waves.
- No public/private filtering by UI-only logic.
