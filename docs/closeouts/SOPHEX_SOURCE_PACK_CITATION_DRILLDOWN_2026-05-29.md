# SOPHEX-SOURCE-EVIDENCE-002 Closeout: Source Pack Citation Drilldown Cockpit

Date: 2026-05-29

Branch: `ui/sophex-source-pack-citation-drilldown`

## Scope

`SOPHEX-SOURCE-EVIDENCE-002` adds a mock-only public `/sources/:id` source pack / citation drilldown cockpit after the review queue. It lets a reviewer inspect evidence behind source coverage, warnings, confidence, authority labels, and export blockers while export remains disabled and all behavior stays prototype-only.

## What Changed

- Added `/sources/:id?state=...` with deterministic fixture states: `clean`, `blocked`, `low-evidence`, `provider-restricted`, and `ready-for-review`.
- Preserved route continuity: property → comps → report → export gate → review queue → source pack → review/export/report.
- Added citation drilldown register with title, source type, section used by, confidence impact, freshness, authority label, source-rights status, export block posture, mock excerpt, and reviewer action recommendation.
- Added source-rights and blocker posture copy for provider-restricted, low-evidence, blocked, and ready-for-review states.
- Added prototype-only citation actions: expand citation detail, filter by source posture, copy mock citation note, mark citation reviewed (local state), and navigation back to review queue, export gate, or report.
- Kept every generate/export action disabled.
- Updated mock registry, visual/runtime matrix, e2e coverage, and visual snapshot for the source pack.
- Raised total JS bundle budget to 544 KiB (+2 KiB) after deduping report fixture overlays and sharing review/sources cockpit code; net prototype growth stays mock-only.

## Guardrails Preserved

- No real export or PDF generation.
- No billing activation.
- No provider/send behavior.
- No queues or workers.
- No live API integration or real document/source retrieval.
- No CRE bridge.
- No schema, Prisma, DB, migration, Railway, deploy, package, or lockfile changes.
- Citation actions do not persist and do not clear export gates.

## Next Batch

`SOPHEX-DEMO-STORY-003` — Guided Demo States across property, comps, report, export, review, and source pack.
