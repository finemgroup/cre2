# Finem CRE Studio Prototype Execution Matrix

Status: implementation baseline for the 12 imported HTML snippets in `design-imports/html-snippets/`.

## Architecture Decisions

- Build target: `prototype/` only.
- Route posture: preserve existing Sophex MVP0 routes and add a Finem CRE Studio route family under `/studio/*`.
- Styling posture: use a Sophex-native token layer compatible with the imported Tailwind design exports; do not import sister-project runtime design systems.
- Brand posture: imported screens keep Finem CRE Studio labels; trust, evidence, motion, and mock-data rules remain Sophex doctrine.
- Operator posture: Broker OS is a read-only internal/operator mock surface, not public contributor UX.

## Screen Matrix

| # | Route | Screen | Source HTML | CRE reuse posture | Fabricator reuse posture | Motion | Trust / boundary |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `/studio` | Landing | `01-landing.html` | Adapt bento/hero doctrine; build fresh marketing page | None | Hero reveal, bento stagger | Sample metric labels |
| 2 | `/studio/settings/billing` | Billing & Plans | `02-pricing.html` | Adapt billing quota/card doctrine | None | Toggle fade | Plan limits align to paywalls |
| 3 | `/studio/onboarding` | Onboarding Wizard | `03-onboarding.html` | Adapt wizard/step rail doctrine | Adapt project wizard progression only | Step reveal/collapse | Consent/source-use copy |
| 4 | `/studio/dashboard` | Deal Dashboard | `04-dashboard.html` | Port pipeline, KPI, activity doctrine | None | KPI/list stagger | Proof/status labels on activity |
| 5 | `/studio/deals/:dealId` | Deal Overview | `05-deal-overview.html` | Port detail shell, tabs, document list doctrine | None | Drawer continuity | Provenance cells and document review states |
| 6 | `/studio/deal-intake` | Deal Intake | `06-deal-intake.html` | Port UploadZone/intake/action rail doctrine | Adapt sanitized intake phases | Upload/validation reveal | Candidate-only packet preview |
| 7 | `/studio/deals/:dealId/underwriting` | Underwriting Cockpit | `07-underwriting-cockpit.html` | Port underwriting workbench doctrine | Analysis contract only | Section reveal | Synthetic data and review flags |
| 8 | `/studio/deals/:dealId/comps` | Comps | `08-comps.html` | Port comp table/authority/paywall doctrine | None | Row-to-drawer | Provider/private/review labels |
| 9 | `/studio/deals/:dealId/scenarios` | Scenario Comparison | `09-scenario-comparison.html` | Adapt sensitivity/scenario matrix doctrine | None | Matrix collapse, overlay fade | Premium lock and mock-data labels |
| 10 | `/studio/reports/:reportId/builder` | Report Builder | `10-report-builder.html` | Port BOV section/export gate doctrine | Adapt `AnalysisResponse` shape | Section reveal, preview fade | Export blocked until review state clears |
| 11 | `/studio/settings/white-label` | White Label Settings | `11-white-label-settings.html` | Adapt client branding/theme doctrine | None | Preview toggle crossfade | Enterprise domain caveat, disclaimer visible |
| 12 | `/studio/broker-os` | Broker OS Control Panel | `12-broker-os-control-panel.html` | Adapt agent command-center/JSON doctrine; avoid Jarvis chrome | Port Broker OS console/inventory/planning doctrine | Metric/list reveal | Read-only, sanitized `JobStatusProjection` |

## Targeted CRE Paths

- Shell and motion: `apps/core/components/navigation/PageTransitionShell.tsx`, `apps/core/components/os/OSMotion.tsx`, `apps/core/lib/motion-tokens.ts`.
- Deal core: `apps/core/components/deals/DealPipelineList.tsx`, `apps/core/components/deals/DealWorkstationTabs.tsx`, `apps/core/components/core-objects/detail-shell/`.
- Intake: `apps/core/app/pilot/document-intake/`, `apps/core/components/document-intelligence/UploadZone.tsx`.
- Analysis: `apps/core/components/underwriting/`, `apps/core/components/sophex/comparables/`, `apps/core/components/bov/`.
- Branding: `apps/core/lib/branding/ClientBrandingConfig.ts`, `apps/core/components/branding/ClientThemeProvider.tsx`.
- Operator: `apps/core/app/agent-command-center/`, `apps/core/components/agent-command-center/`.

## Targeted Fabricator Paths

- Broker OS: `src/app/broker-os/console/page.tsx`, `src/app/broker-os/inventory/page.tsx`, `src/app/broker-os/planning/page.tsx`.
- Analysis contracts: `src/lib/analysis-os/contracts.ts`.
- Status and jobs doctrine: `apps/core/app/api/skills/jobs/`, `src/app/api/axis/jobs/[jobId]/route.ts`.
- Evidence envelope: `agents/DatabaseEvidenceToolkit_MCP/evidence_envelope.py`.
- HITL/steppers: `ops_hub_app/ui/components/HITLModal.tsx`, `ops_hub_app/ui/components/HorizontalStepper.tsx`.

## Validation Gates

- Each wave must keep `npm run build` and `npm run test` green from `prototype/`.
- Every mock financial/report/comp/operator route needs visible non-production or sample-state labeling.
- Every drawer/modal must support keyboard close, focus containment, and focus restore.
- Sister-project source paths remain reference-only; no runtime imports, schema, queue, provider, or production service coupling.
