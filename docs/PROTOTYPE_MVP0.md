# Sophex MVP0 Prototype Lane

> **Canonical spec:** Use [WORLD_CLASS_PROTOTYPE_SPEC.md](WORLD_CLASS_PROTOTYPE_SPEC.md) for the current route matrix, quality gates, and launch-readiness labels. This file retains the original Phase 1 lane snapshot for historical context.

Phase 1 clickable concept implementation. **Mock data only.** No schema, API, deploy, provider/send, queue, CRM, or sister-project runtime coupling.

## Location

- App: [`prototype/`](../prototype/)
- Runbook: [`prototype/README.md`](../prototype/README.md)

## What Was Made Real

| Layer                     | Path                                                                                                                                                   | Purpose                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Motion tokens             | `prototype/src/lib/motion/`                                                                                                                            | Sophex-native durations, easing, specs, reduced-motion helper                                                    |
| Motion components         | `prototype/src/components/motion/`                                                                                                                     | Surface, sheet, page transition                                                                                  |
| Trust UI                  | `prototype/src/components/ui/`                                                                                                                         | Stub banner, authority badges, stage rail                                                                        |
| MVP0 screens              | `prototype/src/pages/`                                                                                                                                 | Landing, property, upload, comps, report, export gate                                                            |
| Mock data                 | `prototype/src/data/mock.ts`                                                                                                                           | Sample properties, comps, report sections                                                                        |
| Tests                     | `prototype/src/test/motion.test.tsx`                                                                                                                   | Reduced-motion + motion metadata proof                                                                           |
| Finem CRE Studio import   | `prototype/src/pages/StudioPages.tsx`                                                                                                                  | 12-screen broker-workstation prototype from imported HTML snippets                                               |
| Studio shells             | `prototype/src/components/layout/StudioAppShell.tsx`; `StudioStandaloneShell.tsx`                                                                      | Sidebar app shell and report-builder shell for `/studio/*` routes                                                |
| Studio primitives         | `prototype/src/components/studio/StudioPrimitives.tsx`                                                                                                 | Metric cards, tables, drawers, stage stepper, paywall, JSON viewer, trust/status badges                          |
| Studio mock data          | `prototype/src/data/studio.ts`                                                                                                                         | Deals, comps, scenarios, reports, branding, agents, and sanitized job streams                                    |
| Studio tests              | `prototype/src/test/studio.test.tsx`                                                                                                                   | Route coverage, deal-id consistency, onboarding flow, and drawer smoke tests                                     |
| Wave 8 cockpit primitives | `prototype/src/components/studio/BentoTile.tsx`; `prototype/src/components/workflow/DealCockpitPanel.tsx`; `DataWorkbenchShell.tsx`; `AiTaskPulse.tsx` | CRE Platform-inspired, Sophex-native cockpit bento, evidence workbench, confidence/HITL, and task-pulse patterns |

## Doctrine Sources (Docs Only)

Implementation follows Sophex docs, not copied sister-project code:

- [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md)
- [P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)
- [MOTION_AND_INTERACTION_GUIDELINES.md](MOTION_AND_INTERACTION_GUIDELINES.md)
- [SOPHEX_MVP0_SCREEN_MAP.md](SOPHEX_MVP0_SCREEN_MAP.md)
- [SOPHEX_TRUST_UI_GUIDELINES.md](SOPHEX_TRUST_UI_GUIDELINES.md)

## Run

```bash
cd prototype
npm install
npm run dev
```

## Finem CRE Studio Routes

The imported HTML design queue is implemented as mock-only Studio routes:

| Route                                        | Screen                                |
| -------------------------------------------- | ------------------------------------- |
| `/studio`                                    | Landing / product entry               |
| `/studio/onboarding`                         | Four-step onboarding wizard           |
| `/studio/settings/billing`                   | Billing and plan comparison           |
| `/studio/dashboard`                          | Main deal dashboard                   |
| `/studio/deals/riverside-flats`              | Deal cockpit overview workspace       |
| `/studio/deal-intake`                        | Deal intake form and packet preview   |
| `/studio/deals/riverside-flats/comps`        | Comparable sales table and drawer     |
| `/studio/deals/riverside-flats/underwriting` | Executive underwriting cockpit        |
| `/studio/deals/riverside-flats/scenarios`    | Scenario comparison matrix            |
| `/studio/reports/riverside-flats/builder`    | Report builder and export gate        |
| `/studio/settings/white-label`               | White-label settings and live preview |
| `/studio/broker-os`                          | Read-only Broker OS control panel     |

These pages follow the execution matrix in `docs/PROTOTYPE_FINEM_CRE_STUDIO_EXECUTION_MATRIX.md`.

## Fidelity Hardening Notes

The `/studio/*` implementation now includes:

- Standalone shell posture for public landing and onboarding.
- Deal-aware routing for overview, comps, underwriting, and scenario pages.
- Expanded per-screen content for pricing FAQ, dashboard plan rail, deal notes/team, intake assumptions, comps view toggle, scenario chart, report branding pane, white-label report branding, and Broker OS JSON copy.
- Additional accessibility affordances: table captions, keyboard-operable upload zones, tab/radio-style state attributes, and retained drawer focus management.
- Studio route and interaction tests in `prototype/src/test/studio.test.tsx`.

## Still Future-Gated

- Real CRE/Fabricator APIs and contracts
- Database/schema and evidence persistence
- Production auth, org scope, permissions enforcement
- Real export/send/syndication
- Full operator moderation queue
- Authoritative reconciliation of P51 vs clean CRE SHA before promoting primitives to a shared package

## Promotion Path

When approved, extract `prototype/src/lib/motion` and shared UI primitives into a Sophex app package or design-system package. Do not import CRE/P51 repos directly.
