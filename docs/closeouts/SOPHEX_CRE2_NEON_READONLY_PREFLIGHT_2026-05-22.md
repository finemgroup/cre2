# Sophex CRE2 Neon Read-Only Preflight

**Status:** Read-only preflight complete  
**Date:** 2026-05-22  
**Branch:** `schema/sophex-foundation-contracts-2026-05-22`

## Safety Posture

The local `.env` file is ignored by Git and contains the actual connection values locally. This closeout intentionally records no password, token, full URL, or secret.

This preflight did not apply schema contracts, migrations, seed data, RLS, triggers, functions, or runtime clients.

## Preflight Result

| Check | Result |
| --- | --- |
| Pooled URL present locally | Yes |
| Direct URL present locally | Yes |
| Pooled host | `ep-long-dawn-aqxnrnk2-pooler.c-8.us-east-1.aws.neon.tech` |
| Direct host | `ep-long-dawn-aqxnrnk2.c-8.us-east-1.aws.neon.tech` |
| Database | `neondb` |
| Current user | `neondb_owner` |
| Current schema | `public` |
| Public table count | `0` |
| Schema count | `4` |
| Server version | `PostgreSQL 17.10` |

## SQL Executed

Read-only metadata selects only:

- current database/user/schema/version;
- public table count;
- schema count.

## Non-Actions

- SQL contract not applied.
- No DDL executed.
- No migration executed.
- No Prisma action executed.
- No Drizzle action executed.
- No seed action executed.
- No runtime DB client committed.
- No deploy action executed.
- No provider/send or queue action executed.

## Next Gate

Before creating real tables, create a separate DB activation plan or update this PR with an explicit migration/tooling decision. The current schema SQL remains a contract draft, not an executable migration.

Local `.env` is active for development use and is documented in `docs/project/SOPHEX_CRE2_NEON_DEV_CONFIGURATION_2026-05-22.md` and `docs/closeouts/SOPHEX_LOCAL_ENV_ACTIVE_2026-05-22.md`.
