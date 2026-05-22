# Sophex No-Database-Yet Operating Rules

**Status:** Operating rules  
**Date:** 2026-05-22  
**Implementation status:** `CONTRACT_ONLY`

## Current Posture

Sophex has no real database connection yet. Schema foundation work is local schema-as-code/contracts/docs only.

## Rules

- No DB URL is required.
- Do not commit live `.env*` files or database URLs.
- `.env.example` may document placeholder variable names only.
- Local `.env.local` may be used later after credential rotation, but it must remain ignored and uncommitted.
- Do not apply migrations.
- Do not run Prisma, Drizzle, Kysely, SQL clients, seeds, or migration deploy commands.
- Do not connect to Neon, Railway, CRE production DB, MotherDuck, R2/Docling, vector runtime, provider/send, or queues.
- Do not copy production data from CRE.
- Do not assume physical DB sharing with CRE.
- Do not assume Railway is canonical DB infrastructure.
- Contract tests/static validation only.

## If A Real DB Is Selected Later

Create a separate DB setup plan before implementation. That plan must cover:

- provider decision;
- migration tool decision;
- environment/secrets handling;
- local vs preview vs production separation;
- source-use/privacy/legal gates;
- backup/restore;
- RLS/permission defense-in-depth;
- API boundary with CRE;
- rollback;
- proof gates.

## Static Validation Scope

For SOPHEX-S0, validation means:

- SQL contract file exists;
- file is marked `CONTRACT ONLY` and `NOT APPLIED`;
- no destructive DML/DDL intent;
- no triggers/functions;
- no DB URL or secrets;
- no runtime DB client code;
- no package/lock edits for schema tooling.

## CRE2 Neon Dev Note

If CRE2 Neon is used later as an isolated Sophex development database, first rotate any credentials exposed outside a secret manager. Then configure local ignored environment values only. This schema-contract branch still does not connect to the database or apply the SQL contract.
