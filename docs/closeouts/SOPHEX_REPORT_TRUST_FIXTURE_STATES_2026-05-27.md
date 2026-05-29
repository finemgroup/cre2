# SOPHEX-REPORT-002 Closeout: Report Trust Fixture States

Date: 2026-05-27

Branch: `ui/sophex-report-trust-fixture-states-stacked`

Base: stacked on `chore/sophex-quality-baseline` / PR #4

## Scope

`SOPHEX-REPORT-002` refines the public `/report/:id` prototype so external readers cannot confuse fixture-backed report previews with live valuation, export authority, or appraisal work.

## What Changed

- Added an impossible-to-miss `Not an appraisal` posture to the report preview.
- Strengthened advisory/model-inferred valuation language and kept reviewer/source-rights gates visible.
- Added deterministic fixture states: `clean`, `blocked`, `low-evidence`, `provider-restricted`, and `ready-for-review`.
- Made source coverage, confidence, freshness, authority, redaction, and source posture visually dominant.
- Kept export disabled in the report while preserving the public property -> comps -> report -> export-gate path.
- Added E2E smoke coverage for report fixture-state switching and disabled export posture.
- Updated the mock registry and visual/runtime matrix to track the new report state posture.

## Guardrails Preserved

- Prototype-only and mock-only.
- No live valuation.
- No enabled export.
- No billing activation.
- No provider/send behavior.
- No queues or workers.
- No CRE bridge.
- No schema, Prisma, DB, migration, deploy, package, or lockfile changes.

## Validation Plan

Run from `prototype/` unless otherwise noted:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run e2e`
- `git diff --check` from repo root

## Merge Note

This branch is stacked. Do not merge before PR #4 lands.
