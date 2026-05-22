# Sophex Schema Contracts

This folder contains local schema contract artifacts only.

## Current Artifacts

- `sophex-foundation.contract.sql` — conceptual additive SQL contract draft.
- `sophex-foundation.static-checklist.md` — static validation checklist because the repo has no root schema test framework.

## Rules

- Do not execute these files against a database.
- Do not treat them as migrations.
- Do not add DB URLs, secrets, seeds, or runtime clients.
- Do not run Prisma, Drizzle, Kysely, migration, or deploy commands from this lane.
- Use these contracts to guide future reviewed implementation waves only.
