# SOPHEX-DEMO-STORY-003 Closeout: Guided Demo States

Date: 2026-05-29

Branch: `ui/sophex-guided-demo-states`

## Scope

`SOPHEX-DEMO-STORY-003` adds a mock-only guided demo layer that helps users move through the full Sophex public intelligence path across fixture states without enabling live APIs, real export, provider behavior, persistence, CRE bridge behavior, schema/DB work, Railway, deploy, or package/lock changes.

## What Changed

- Added `GuidedDemoRail` in `PublicShell` for `/property/:id`, `/property/:id/comps`, `/report/:id`, `/export/:id`, `/review/:id`, and `/sources/:id`.
- Added `appendExportFixtureStateQuery` helper in `public-export-fixtures.ts` for URL-only state continuity.
- Preserved `?state=` continuity on property → comps → report handoffs and across guided demo step links.
- Added concise narrative copy for fixture states: `clean`, `blocked`, `low-evidence`, `provider-restricted`, and `ready-for-review`.
- Added focused e2e coverage in `prototype/e2e/guided-demo.spec.ts`.
- Updated mock registry, visual/runtime matrix, e2e coverage, and closeout.
- Raised total JS bundle budget to 548 KiB (+4 KiB) and CSS budget to 69 KiB (+1 KiB) after compact guided demo rail implementation; no package or lockfile changes.

## Guardrails Preserved

- No real export or PDF generation.
- No billing activation.
- No provider/send behavior.
- No queues or workers.
- No live API integration or real document/source retrieval.
- No CRE bridge.
- No schema, Prisma, DB, migration, Railway, deploy, package, or lockfile changes.
- Fixture state is URL/query-state only — no persistence, sessions, or API writes.
- Export remains disabled/gated in every fixture state.

## Next Batch

Pause for product review/demo pass before starting any runtime/API work.
