# Sophex CRE2 Neon Dev Configuration

**Status:** Local configuration plan  
**Date:** 2026-05-22  
**Implementation status:** `CONFIG_TEMPLATE_ONLY`

## Secret Handling Stop

Live Neon connection strings were pasted into chat on 2026-05-22. Treat those credentials as exposed. Rotate the Neon password before putting any value into local environment files, shell profiles, CI settings, or deployment settings.

Do not commit live database URLs. Use `.env.local` for local-only values. The repository only tracks `.env.example` with placeholders.

## Intended Database

The CRE2 Neon database is intended to be a new isolated Sophex/CRE2 development database. It is not CRE Platform production and must not be treated as shared CRE production truth.

## Local Variables

| Variable | Purpose | Commit? |
| --- | --- | --- |
| `CRE2_DATABASE_URL` | Pooled Neon URL for future app/runtime clients | No |
| `CRE2_DATABASE_URL_DIRECT` | Direct Neon URL for future approved admin/migration lane | No |
| `SOPHEX_DB_CONNECTION_STATUS` | Local status marker | Example only |

## Configuration Steps

1. Rotate the exposed Neon password.
2. Confirm the database is an isolated dev database for Sophex/CRE2.
3. Put rotated values in local `.env.local` only.
4. Keep `.env.local` ignored by Git.
5. Do not run SQL, migrations, seeds, Prisma, Drizzle, or deployment commands from the schema-contract branch.

## What This Branch Does

- Adds `.env.example` placeholders.
- Documents safe variable names.
- Preserves no-DB-apply posture for schema contracts.
- Records a read-only Neon preflight in `docs/closeouts/SOPHEX_CRE2_NEON_READONLY_PREFLIGHT_2026-05-22.md` after local `.env` was filled in.

## What This Branch Does Not Do

- No DB connection attempt.
- No write or migration DB connection attempt. A read-only metadata preflight was run after operator approval.
- No SQL execution.
- No migration apply.
- No package/lock edits.
- No runtime DB client.
- No production data copy.
- No deploy.

## Local `.env` Status (2026-05-22)

- Local ignored file: `.env` (not committed).
- Read-only preflight succeeded against database `neondb`.
- Current schema: `public`.
- Public table count at preflight: `0`.
- Server version observed: PostgreSQL 17.10.
- `schema/sophex-foundation.contract.sql` has not been applied to this database.
- Next approved step: choose migration/tooling and create a separate DB activation lane.

## Future Activation Gate

Before any real connection or migration work, create a separate DB setup plan that names:

- DB provider and environment tier;
- migration tool decision;
- secret storage location;
- local/preview/prod separation;
- rollback and backup posture;
- legal/source-use/privacy readiness;
- field-level permission enforcement strategy;
- whether Sophex consumes CRE via API, copy, projection, or shared physical DB.
