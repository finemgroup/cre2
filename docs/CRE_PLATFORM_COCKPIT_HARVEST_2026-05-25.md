# CRE Platform Cockpit Harvest

**Date:** 2026-05-25  
**Purpose:** Identify which CRE Platform cockpit patterns Sophex should copy, adapt, or keep as reference for the mock-only Wave 8 cockpit pass.

This document is a UI inheritance record only. It does not authorize schema, provider, queue, upload/OCR, production deploy, or persisted HITL work.

## Source Boundary

Primary source checkout:

```text
C:\Projects\p51 Site Selection Tool\cre-platform
```

High-value files inspected:

- `packages/shared-ui/src/WarRoom.tsx`
- `packages/shared-ui/src/BentoBoard.tsx`
- `packages/shared-ui/src/BentoTile.tsx`
- `packages/shared-ui/src/BentoSection.tsx`
- `packages/shared-ui/src/BentoCardSkeleton.tsx`
- `packages/shared-ui/src/confidence.ts`
- `packages/shared-ui/src/NextActionRecommendation.tsx`
- `packages/shared-ui/src/data-workbench/DataWorkbench.tsx`
- `packages/shared-ui/src/data-workbench/SavedViews.tsx`
- `packages/shared-ui/src/ViewModeToggle.tsx`
- `packages/shared-ui/src/hooks/useReducedMotion.ts`

## Copy / Adapt / Reference Matrix

| CRE source                                                                | Sophex action          | Sophex target                                              | Notes                                                                                           |
| ------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `confidence.ts`                                                           | Copy/adapt             | `prototype/src/lib/workflow/confidence.ts`                 | Pure thresholds; translate to Sophex advisory language.                                         |
| `BentoTile.tsx` state model                                               | Adapt                  | `prototype/src/components/studio/BentoTile.tsx`            | Keep `loading` / `error` / `empty` / `ok`; replace Tailwind/CVA tokens with Sophex CSS classes. |
| `BentoBoard.tsx`, `BentoSection.tsx`                                      | Adapt                  | `prototype/src/components/studio/BentoTile.tsx`            | Use a smaller component set for prototype cockpit density.                                      |
| `DataWorkbench.tsx`                                                       | Adapt                  | `prototype/src/components/workflow/DataWorkbenchShell.tsx` | Keep slot-based view switching; support table/list/grid only.                                   |
| `ViewModeToggle.tsx`                                                      | Adapt                  | `DataWorkbenchShell`                                       | Avoid kanban/map/gantt modes until real views exist.                                            |
| `WarRoom.tsx` `KpiStrip`, `ContextStrip`, `BriefPanel`, `AgentPulseBadge` | Adapt by pattern       | `DealCockpitPanel`, `AiTaskPulse`                          | Do not import CRE `war-room-theme`, lucide icons, or operator shell naming.                     |
| `NextActionRecommendation.tsx`                                            | Pattern only           | `DealWorkflowActionCard`, HITL assignment detail           | Use confidence/escalation behavior, not email/call/text channels.                               |
| `apps/core/components/intelligence/*` HITL workbenches                    | Reference only         | Evidence Workbench and reviewer queue IA                   | Too coupled to CRE extraction/intel runtime types.                                              |
| `AskAiWidget` / widget fetchers                                           | Reference only         | Mock-only AI task widgets                                  | Do not carry over `/api/dashboard/widgets/*` fetch URLs.                                        |
| Radix `Dialog` / `Sheet`                                                  | Reference only for now | Existing `SophexSheet` and modal stack                     | Sophex already has focus trapping and reduced-motion sheets.                                    |

## Explicit Non-Imports

- No `@acme/*` packages.
- No React Query hooks, CRE API clients, dashboard registries, CRM routes, or provider URLs.
- No CRE operator cockpit chrome, dual mobile nav, gamified motion, raw job logs, or production service semantics.
- No CRE domain terms such as broker war room, prospecting channel, family office pipeline, or call/email/text recommendation.

## Wave 8 Utilization Targets

- Deal Cockpit composition: stage posture, next action, blocker count, KPI bento, AI/reviewer task pulse, and contextual rail.
- Bento state contract: honest `loading`, `error`, `empty`, and `ok` states before more live API work.
- Confidence-aware advisory actions: `auto`, `confirm`, `review`, and `blocked` states that never authorize runtime promotion.
- Evidence Workbench shell: shared view switching and toolbar slots for data review, source trace, and spatial evidence posture.
- AI task widgets: mock-only queued/running/completed/error projections for evidence, comps, lender quote, source rights, and export readiness.

## Decision

Proceed with a Sophex-native implementation. Copy only pure logic and small component ideas; adapt all UI to existing Sophex primitives and CSS tokens.
