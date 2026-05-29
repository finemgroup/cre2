# SOPHEX-REVIEW-QUEUE-001 Closeout: Review Queue Source Gap Cockpit

Date: 2026-05-29

Branch: `ui/sophex-review-queue-source-gap-cockpit`

## Scope

`SOPHEX-REVIEW-QUEUE-001` adds a mock-only public `/review/:id` source gap resolution cockpit after the export gate. It shows what an analyst must resolve before a report can be considered ready while export remains disabled and all behavior stays prototype-only.

## What Changed

- Added `/review/:id?state=...` with deterministic fixture states: `clean`, `blocked`, `low-evidence`, `provider-restricted`, and `ready-for-review`.
- Preserved route continuity: property → comps → report → export gate → review queue → report/export gate.
- Added source gap register table with section, blocker type, evidence status, source-rights posture, confidence impact, recommended reviewer action, and export block posture.
- Added prototype-only reviewer actions: mark gap reviewed (local state), expand blocker detail, fixture state toggles, copy mock reviewer note, and navigation back to report/export gate.
- Kept every generate/export action disabled.
- Updated mock registry, visual/runtime matrix, e2e coverage, and visual snapshot for the review queue.

## Guardrails Preserved

- No real export or PDF generation.
- No billing activation.
- No provider/send behavior.
- No queues or workers.
- No live API integration beyond existing sandbox fixture adapters.
- No CRE bridge.
- No schema, Prisma, DB, migration, Railway, deploy, package, or lockfile changes.
- Review actions do not persist and do not clear export gates.
