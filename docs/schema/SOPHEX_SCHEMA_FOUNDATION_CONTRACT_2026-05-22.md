# Sophex Schema Foundation Contract

**Status:** Schema foundation contract  
**Date:** 2026-05-22  
**Implementation status:** `CONTRACT_ONLY`

## Purpose

This document defines Sophex's local schema foundation as contracts and target table families. It does not create a database, apply migrations, run Prisma, run Drizzle, or connect to production infrastructure.

The goal is for the Sophex repo to understand the model, trust boundaries, and wave sequence before any database provider or migration tool is selected.

## No DB Apply

- No DB URL is required.
- No SQL is executed.
- No migration is generated or applied.
- No Prisma schema is modified.
- No Drizzle/Kysely/Prisma dependency is added.
- `schema/sophex-foundation.contract.sql` is a contract draft only.

## Table Family Overview

| Family | Contract Purpose |
| --- | --- |
| Organizations / actors | Account and organization scope for future permissions |
| Public property baseline | Public-safe property projection separate from private observations |
| Document evidence | Source identity, source-use policy, review state, hashes, receipts |
| Source observations | Raw sourced facts from documents, public records, users, or agents |
| Field observations | Field-level candidate values derived from source observations |
| Visibility policies | Who can see or reuse a specific observation |
| Comp candidates | Evidence-backed comp ecosystem records, not one master comp truth table |
| Deal ecosystem records | Linked sale/lease/deal posture with record type/subtype |
| Leases / tenants / rent schedules | First-class lease economics and tenant facts |
| Investment details projection | Derived NOI, WALT, occupancy, cap-rate projections |
| Entity edges / named joins | Rich relationship records with confidence/source metadata |
| Report artifacts | Valuation/report output with citations, warnings, review state, export policy |

## Entity / Edge / Evidence / Observation Model

Sophex should model entities and relationships as evidence-backed candidates:

1. `DocumentEvidence` identifies source material and policy posture.
2. `SourceObservation` records raw observed facts with source/correlation metadata.
3. `FieldObservation` turns source facts into typed field candidates.
4. `ObservationVisibilityPolicy` determines who may read/use them.
5. `ResolvedFieldValue` is a future query projection: the latest/highest-ranked value the actor is allowed to see.
6. `CompCandidate`, lease/tenant/rent schedule candidates, and deal ecosystem records use evidence refs and review state before promotion.

## Foundation Invariants

- Documents are evidence, not automatic truth.
- Chunks and embeddings are sidecars.
- A master comp means a comp candidate ecosystem, not a giant canonical table.
- Lease/rent schedules feed investment projections later.
- O2-B-style audit/idempotency/correlation concepts are required before mutating workflows.
- Public/private visibility is query-level, not UI-only.
- Physical DB sharing with CRE is not decided.
