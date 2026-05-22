# Sophex Pseudo-Graph Target Model

**Status:** Target model thesis  
**Date:** 2026-05-22  
**Implementation status:** `CONTRACT_ONLY`

## Why This Is A Target Model

The uploaded PostgreSQL pseudo-graph schema is useful as an architecture thesis, not as executable production authority. Sophex has no database yet, so the right move is to preserve the model and sequence it into waves rather than run a big-bang SQL implementation.

## Core Nodes / Records

### Properties

Properties have public baseline facts and may have private user/org observations. Public baseline facts are not overwritten by private observations; actor-specific resolution happens through permissioned field observation contracts.

### Deal / Comp Ecosystem Records

A master comp should not become one giant canonical truth table. Sophex should model comp candidates and deal ecosystem records with record type/subtype posture:

- on-market sale;
- sold comp;
- on-market lease;
- executed lease comp;
- ghost/incomplete record.

### Leases

Lease economics are first-class records. Rent, term, lease type, expiration, tenant, and space should not be hardcoded onto one giant deal row.

### Tenants

Tenants can be known, partial, or ghost. Ghost tenants are useful when a building is known to have multiple spaces or tenants but full data is missing.

### Rent Schedules

Rent schedules represent one row per period/escalation. NOI, WALT, occupancy, lease expiration exposure, and rent projections derive from these rows later.

### Investment Details Projection

Investment details are read-model projections, not canonical truth. They derive from lease, tenant, rent schedule, property, and comp candidate facts, and they carry confidence/freshness/review state.

## Edges / Rich Joins

Named rich join tables are preferred for hot paths:

- property-to-deal;
- deal-to-lease;
- tenant-to-lease;
- tenant-to-property;
- comp-to-document-evidence;
- report-to-source-observation.

Each edge should carry relationship type, confidence, source/evidence refs, review state, and idempotency/correlation refs.

Universal `entity_edges` may be useful later, but it needs a governance contract first because it weakens FK clarity and can become a catch-all.

## Ghost Records

Ghost records are placeholders for known-but-incomplete entities:

- building has three spaces but only one tenant is known;
- lease exists but expiration/rent schedule is incomplete;
- comp exists but source document is partial;
- contact exists but role is unclear.

Ghost records must be labeled and cannot become public truth without review and source-use clearance.

## Explicit Exclusions

- No trigger-heavy calculation model.
- No universal audit trigger as final truth.
- No ORM/migration tool decision is settled.
- No Neo4j migration/export code.
- No live RLS policy implementation.
- No shared Railway production DB assumption.
