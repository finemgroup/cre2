# Implementation Quality Discipline

This checklist applies to every rapid implementation wave in the mock-only Sophex prototype lane.

It is intentionally repeatable so Composer-style agents can execute quickly without weakening the project boundary.

## Boundary Check

Before implementation:

- Confirm work is under `prototype/` or `docs/`.
- Confirm the change uses deterministic mock data.
- Confirm no `.env` values, credentials, provider SDKs, production data, schemas, migrations, generated clients, queue workers, deploy commands, or database commands are needed.
- Confirm any sister-schema dependency is deferred to `SISTER_SCHEMA_HARVEST_PACKET.md`.
- Confirm new UI uses proof-honest labels and does not imply authorization, appraisal certainty, persisted truth, or real export.

## Design-System Check

Every UI change should answer:

- Does it reuse `StudioCard`, `MetricCard`, `DataTable`, `TrustBadge`, `StatusBadge`, `SophexModal`, `SophexSheet`, or workstation primitives before adding new patterns?
- Does it use the standard posture vocabulary?
- Does it show source ref, as-of date, confidence, and explanation near important values?
- Does it make disabled/gated actions understandable?
- Does it remain usable by keyboard and screen reader?
- Does it avoid copying raw Stitch HTML, Tailwind CDN markup, external image URLs, or duplicated font links?

## Required Validation By Change Type

| Change type                                         | Required checks                                                                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Docs only                                           | Prettier check for touched docs.                                                                                  |
| Component or primitive                              | `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:stories`.                                      |
| Route or workflow                                   | Component checks plus `npm run build`, `npm run budget:check`, and `npx playwright test e2e/flows.spec.ts`.       |
| Shell/layout/major visual change                    | Route checks plus intentional visual review with `npm run test:e2e:visual` or snapshot update only when approved. |
| Route list or performance/accessibility gate change | Route checks plus `npm run test:lighthouse`.                                                                      |

## Standard Command Set

Run from `prototype/` unless otherwise noted:

```powershell
npm run typecheck
npm run lint
npm run test
npm run test:stories
npm run build
npm run budget:check
npx playwright test e2e/flows.spec.ts
npm run test:lighthouse
```

Use focused subsets when the change is docs-only or clearly narrower, but record any skipped checks in the closeout.

## Visual Baseline Policy

- Add visual coverage for new high-value routes and modal/drawer states.
- Do not update screenshots casually.
- Snapshot updates require intentional review of layout, copy, trust labels, responsive behavior, and non-production banners.
- Treat Stitch screenshots as design references, not pixel-perfect source.

## Closeout Requirements

Every implementation closeout should state:

- What changed.
- Which plan/tickets were covered.
- Which checks passed.
- Which checks were skipped and why.
- Whether runtime/schema/deploy boundaries remained closed.
- Any follow-up tickets or open questions.

## Current Rapid Build Gates

The current rapid product workflow ticket pack is `COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_PRODUCT_WORKFLOWS.md`.

The current schema-readiness packet is `SISTER_SCHEMA_HARVEST_PACKET.md`.

The current completed-ticket inventory is `RAPID_BUILD_TICKET_INVENTORY_2026-05-25.md`.
