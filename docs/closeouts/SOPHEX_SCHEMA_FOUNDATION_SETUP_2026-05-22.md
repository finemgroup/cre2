# Sophex Schema Foundation Setup Closeout

**Status:** Complete for draft PR  
**Date:** 2026-05-22  
**Branch:** `schema/sophex-foundation-contracts-2026-05-22`

## Project Classification

| Check | Result |
| --- | --- |
| Repo path | `C:\Projects\Sophex Marketplace and Content Engine` |
| Default branch | `master` / `origin/master` |
| Project type | Docs/control-plane project with `prototype/` app |
| Root `package.json` | No |
| `prototype/package.json` | Yes |
| `docs/**` | Yes |
| `db/**` | No |
| `schema/**` before lane | No |
| root `src/**` | No |
| `prototype/src/**` | Yes |
| Drizzle | Not present |
| Prisma | Not present |
| Kysely | Not present |
| migrations folder | Not present |
| deployment config touched | No |
| environment files | None detected |

Classification: **A/D** — docs-first Sophex repo with a prototype app and no DB tooling. Schema foundation should use docs and SQL contract artifacts only.

## Files Created

- `docs/product/SOPHEX_PRODUCT_BOUNDARY_AND_POSITIONING_2026-05-22.md`
- `docs/architecture/SOPHEX_CRE_FABRICATOR_ALIGNMENT_2026-05-22.md`
- `docs/schema/SOPHEX_SCHEMA_FOUNDATION_CONTRACT_2026-05-22.md`
- `docs/schema/SOPHEX_PSEUDO_GRAPH_TARGET_MODEL_2026-05-22.md`
- `docs/schema/SOPHEX_PERMISSIONED_FIELD_OBSERVATION_MODEL_2026-05-22.md`
- `docs/roadmap/SOPHEX_SCHEMA_WAVE_ROADMAP_2026-05-22.md`
- `docs/project/SOPHEX_NO_DATABASE_YET_OPERATING_RULES_2026-05-22.md`
- `docs/closeouts/SOPHEX_SCHEMA_FOUNDATION_SETUP_2026-05-22.md`
- `schema/README.md`
- `schema/sophex-foundation.contract.sql`
- `schema/sophex-foundation.static-checklist.md`

## Schema Artifacts Created

`schema/sophex-foundation.contract.sql` defines contract-only table families for:

- organizations and account actors;
- public property baseline;
- document evidence;
- source observations;
- field observations;
- observation visibility policies;
- comp candidates;
- deal ecosystem records;
- tenants;
- leases;
- rent schedules;
- investment details projection;
- named deal/property/lease/tenant edges;
- report artifacts.

The SQL artifact is marked `CONTRACT ONLY`, `NOT APPLIED`, `NO DATABASE CONNECTION`, and `DO NOT RUN IN PRODUCTION`.

## Validation Run

- `git diff --check`: passed.
- Static SQL forbidden scan: no matches for destructive statements, trigger/function creation, DB URLs, or secret-like placeholders.
- Static checklist: created and marked complete.
- No package or lock files changed.
- No runtime app feature files changed.
- No deploy config changed.
- No environment files changed.
- No Prisma schema changed.
- No Drizzle config changed.
- No migrations folder created.

## Unresolved Decisions

- What is Sophex's actual DB provider later?
- Separate DB vs shared API vs shared physical DB?
- Does Sophex use Drizzle, Prisma, Kysely, or SQL contracts first?
- What data can be public?
- What uploaded docs can be reused?
- What are free-user contribution terms?
- What are paid/private data promises?
- Who owns legal review?
- What is the final field-level visibility model?
- Initial MVP: upload/report, property page, comps, or valuation model demo?
- When does Sophex consume CRE DCI-E1/DCI-C0 contracts?
- When, if ever, should universal `entity_edges` be activated?

## Non-Actions Ledger

- SQL action: not executed.
- DB connection: not attempted.
- Migration action: not executed.
- Prisma action: not executed.
- Drizzle action: no push/generate, not executed.
- Seed action: not executed.
- Runtime API action: not executed.
- Provider/send action: not executed.
- Queue/worker action: not executed.
- Deploy action: not executed.
- Production data copy: not performed.
- Merge action: not performed.
