# Sophex Underwriting Workflow UX Review - 2026-05-25

This review converts the current underwriting workflow critique into an actionable product and UX strategy artifact for the mock-only prototype lane.

It does not authorize schema, migrations, production data, provider calls, queues, deploys, real document handling, real exports, or persisted reviewer decisions.

## Executive Verdict

The Sophex prototype now has the right underwriting ingredients: intake, evidence review, source trace, comps, debt, assumptions, gates, scenarios, version governance, review, report building, and export posture. The next product risk is not missing screen coverage. The risk is that users cannot quickly understand where they are, what is ready, what is blocked, who owns the blocker, and where to go next.

The workflow should be treated as structurally sound but not yet workflow-legible. The next prototype wave should focus on stage clarity, gate-resolution copy, contextual advanced surfaces, and a stronger next-best-action model.

## Accepted Findings

These findings should guide the next UX polish wave:

- A persistent stage model is needed across deal routes.
- Gate copy should become actionable: `[Action] requires [prerequisite]. Go to [resolution surface].`
- Advanced surfaces should be contextual, secondary, or gated rather than equal-weight workflow destinations.
- `Versions` should be reframed as `Valuation Snapshots` or `Lock Valuation Snapshot`.
- Scenario, snapshot, HITL review, and export eligibility need a visible mental model.
- The deal overview should become a true deal cockpit with one clear next-best action.
- Public/private boundaries must remain explicit, especially on report, export, IC packet, HITL, and capital structure surfaces.

## Corrected Findings

The external critique is directionally strong, but these points need correction before becoming tickets:

- Public-to-Studio continuity already exists through linked Studio deal paths, but it is not framed strongly enough as `Underwrite this deal`.
- Several disabled CTAs now have blocker copy and accessibility descriptions. The remaining issue is mainly lack of resolution routing, not total absence of copy.
- HITL should not disappear as a route. Keep a deep-linkable route for reviewers and QA, but present HITL to analysts as a workflow state drawer or contextual review layer.
- Capital stack, IC packet, HITL review, and spatial should not be fully hidden. They should move into a secondary `Advanced / Delivery` group with visible gate labels and contextual promotion.
- Moving report builder under `/studio/deals/:dealId/report` may be product-clean, but a breadcrumb and deal-context header may solve most of the orientation problem with less routing churn.

## Current Journey Map

| Stage | Current routes | Current user goal | Primary friction |
| --- | --- | --- | --- |
| Discovery | `/property/:id`, `/property/:id/comps`, `/report/:id`, `/export/:id` | Understand a public property and preview output posture | Studio on-ramp is present but not strong enough |
| Intake | `/studio/deals/:dealId/intake` | Capture deal context and documents | Completion state and next action are not dominant |
| Evidence | `/studio/deals/:dealId/data-review`, `/studio/deals/:dealId/underwriting/sources`, `/studio/deals/:dealId/spatial` | Validate candidate evidence and source posture | Data review, source trace, and spatial validation feel separated |
| Underwriting | `/studio/deals/:dealId/underwriting`, `/studio/deals/:dealId/underwriting/debt`, `/studio/deals/:dealId/comps` | Review assumptions, debt, comps, and gates | Parent and child routes do not feel like one underwriting model |
| Scenarios | `/studio/deals/:dealId/scenarios`, `/studio/deals/:dealId/capital-stack` | Compare cases and structure capital | Scenario-to-snapshot and debt-to-capital-stack relationships need clearer copy |
| Governance | `/studio/deals/:dealId/versions`, `/studio/deals/:dealId/hitl-review` | Lock a governed snapshot and route review | Version locking and HITL authority are conceptually complex |
| Delivery | `/studio/deals/:dealId/ic-packet`, `/studio/reports/:dealId/builder`, `/export/:id` | Assemble IC/report/export artifacts | Report builder feels like a different shell at the last mile |

## Target Journey Map

| Target stage | Stage promise | Primary surface | Secondary/contextual surfaces |
| --- | --- | --- | --- |
| 1. Intake | Define the deal and upload/source expected evidence | `/intake` | Deal overview, draft save |
| 2. Evidence | Validate candidate facts before underwriting | `/data-review` | Source trace, location intelligence |
| 3. Underwriting | Lock working assumptions and model health | `/underwriting` | Sources tab, Debt tab, Comps panel |
| 4. Scenarios | Explore cases and select one for governance | `/scenarios` | Capital structure panel |
| 5. Governance | Lock a valuation snapshot and route review | `/versions` | Analyst review drawer, reviewer route |
| 6. Delivery | Assemble packet/report and enforce export gates | Deal report surface | IC packet, export gate |

## Recommended Navigation Model

Use a six-stage deal stepper across all deal routes:

```text
Intake -> Evidence -> Underwriting -> Scenarios -> Governance -> Delivery
```

Each stage should show:

- Completion state: `Not started`, `In progress`, `Blocked`, `Ready`, `Complete`
- Primary blocker count
- Next recommended action
- Link to the strongest resolution surface

Keep current routes for now, but visually group them:

| Group | Routes |
| --- | --- |
| Intake | `/intake` |
| Evidence | `/data-review`, `/underwriting/sources`, `/spatial` |
| Underwriting | `/underwriting`, `/underwriting/debt`, `/comps` |
| Scenarios | `/scenarios`, `/capital-stack` |
| Governance | `/versions`, `/hitl-review` |
| Delivery | `/ic-packet`, `/studio/reports/:dealId/builder`, `/export/:id` |

## Primary CTA Model

| Stage | Primary CTA | Secondary CTA | Disabled-state copy pattern |
| --- | --- | --- | --- |
| Intake | `Save & Validate Intake` | `Save Draft` | `Complete required deal fields before validation.` |
| Evidence | `Approve Evidence Set` | `Flag for Review` | `Resolve N candidate evidence items before approving evidence.` |
| Underwriting | `Lock Assumptions` | `Open Source Trace` | `Finalize comp set and source blockers before locking assumptions.` |
| Scenarios | `Promote Scenario to Snapshot` | `Add Scenario` | `A complete base case is required before promotion.` |
| Governance | `Lock Valuation Snapshot` | `Compare Snapshots` | `Resolve evidence and review blockers before locking a snapshot.` |
| Analyst review | `Submit for Analyst Review` | `Flag Item` | `Lock a valuation snapshot before requesting review.` |
| Delivery | `Assemble Report` | `Preview IC Packet` | `Requires locked snapshot and review clearance.` |
| Export | `Generate Export Receipt` | `Review Blockers` | `Export requires consent, source rights, and reviewed sections.` |

## Gate Resolution Pattern

Every blocker should answer four questions:

1. What action is blocked?
2. What prerequisite is missing?
3. Who owns the next step?
4. Where does the user resolve it?

Recommended copy format:

```text
[Action] is blocked because [prerequisite] is missing.
[Owner] should resolve this in [surface].
[Go to resolution surface]
```

Examples:

| Blocker | Improved copy |
| --- | --- |
| Comp set not finalized | `Lock assumptions is blocked because the comp set is not finalized. An analyst should resolve comp selection in Comparable Sales. Go to Comps.` |
| Source rights warning | `Export is blocked because source rights are not cleared. Review included and excluded sections in the export manifest. Open Export Manifest.` |
| Scenario not ready | `Promote scenario is blocked because required base-case assumptions are incomplete. Complete underwriting assumptions first. Go to Underwriting.` |
| HITL review unavailable | `Analyst review requires a locked valuation snapshot. Lock a snapshot before submitting review. Go to Valuation Snapshots.` |
| IC packet unavailable | `IC packet assembly requires a locked snapshot and review clearance. Complete Governance before Delivery.` |

## Naming Decisions

These label changes should be evaluated in the next UX wave:

| Current label | Recommended label | Reason |
| --- | --- | --- |
| `Data Review` | `Evidence Review` | Matches the product trust model more directly |
| `Versions` | `Valuation Snapshots` | Communicates governance and capture semantics |
| `Create version` | `Lock Valuation Snapshot` | Makes consequence explicit |
| `HITL Review` | `Analyst Review` or `Review Queue` | Reduces jargon for broker-facing workflow |
| `Spatial` | `Location Intelligence` | More user-legible |
| `Capital Stack` | `Capital Structure` | More accessible label; keep detailed title in page |
| `Sources` | `Data Sources & Attribution` | Makes source-trace purpose clearer |

## Scenario, Snapshot, And Export Mental Model

The prototype should make this model visible on scenario and snapshot surfaces:

```text
Scenario Draft -> Scenario Complete -> Promote -> Valuation Snapshot Locked -> Analyst Review -> Export Eligible
```

Recommended explanatory copy:

> A scenario is a working set of assumptions. A valuation snapshot locks one scenario with its evidence state, comp set, as-of dates, and gate posture. Reports and exports should point to a locked snapshot, never to a live working scenario.

Rules to preserve:

- Changing inputs after a snapshot creates new work; it does not mutate the locked snapshot.
- Export eligibility belongs to a specific snapshot.
- HITL review recommends readiness; it does not replace permission and export gates.

## Advanced Surface Strategy

| Surface | Current posture | Recommended UX treatment |
| --- | --- | --- |
| Capital stack / waterfall | Promoted mock-only design reference | Keep route, but surface contextually from scenarios and debt as `Capital Structure` |
| IC packet | Promoted mock-only design reference | Keep route, but treat as Delivery-stage preflight |
| HITL review | Promoted mock-only design reference | Keep route for reviewer workflows; expose to analysts as drawer/state layer |
| Spatial workbench | Mock-only GIS surface | Treat as Evidence-stage `Location Intelligence`; deep workbench remains secondary |
| Broker OS HITL projection | Operator projection | Keep out of normal deal progression except as internal/operator context |

## Role-Based Visibility Guidance

| Surface/action | Broker | Analyst | Reviewer | Public |
| --- | --- | --- | --- | --- |
| Public property/report pages | View public baseline | View public baseline | View public baseline | View public baseline |
| Intake | Edit own deals | Edit assigned deals | Read-only as needed | Hidden |
| Evidence review | Read or comment | Resolve and approve evidence set | Review flagged items | Hidden |
| Underwriting model | View or collaborate | Edit and lock assumptions | Read-only review context | Hidden |
| Scenarios | View scenarios | Create/promote scenarios | Review promoted snapshot context | Hidden |
| Valuation snapshots | View | Lock snapshot | Recommend/hold/review | Hidden |
| Analyst review | Hidden or submitted state only | Submit items | Recommend, hold, escalate | Hidden |
| IC/report builder | Preview governed output | Assemble | Review delivery readiness | Hidden |
| Export | Governed output only | Governed output only | Governed output only | Public-safe output only |

Public routes must not show candidate evidence, internal analyst notes, reviewer identities, HITL status, scenario assumptions, sensitivity ranges, debt terms, capital stack details, provider-restricted facts, version history, or IC packet content.

## Efficiency Scorecard

| Dimension | Current score | Target score | Main lever |
| --- | --- | --- | --- |
| Workflow clarity | 2.5 / 5 | 4 / 5 | Persistent six-stage stepper |
| Task speed | 2.5 / 5 | 4 / 5 | Fewer equal-weight routes; contextual advanced panels |
| Trust and evidence | 3.5 / 5 | 4.5 / 5 | More prominent source posture and as-of dates |
| Gate explainability | 2 / 5 | 4.5 / 5 | Resolution copy and route-linked blockers |
| Decision confidence | 2.5 / 5 | 4 / 5 | Deal cockpit next-best-action layer |

Composite current assessment: structurally sound, not yet workflow-legible.

## Next UX Polish Ticket Pack

These are prototype/docs-only tickets. They should stay within `prototype/` and `docs/`.

| Ticket | Goal | Suggested scope |
| --- | --- | --- |
| `SOPHEX-FE-UW-STAGE-STEPPER` | Add persistent stage model | Deal-wide six-stage stepper with stage state and blocker count |
| `SOPHEX-FE-UW-GATE-RESOLUTION-COPY` | Make blockers actionable | Standardize blocked CTA copy and add route-linked resolution actions |
| `SOPHEX-FE-UW-DEAL-COCKPIT-NEXT-ACTION` | Strengthen deal overview | Convert overview into stage progress, blockers, and next recommended action |
| `SOPHEX-FE-UW-NAV-GROUPING` | Reduce navigation ambiguity | Group main, secondary, advanced, and delivery surfaces visibly |
| `SOPHEX-FE-UW-SNAPSHOT-LANGUAGE` | Clarify versions | Rename/copy-test `Valuation Snapshots` and scenario-to-snapshot model |
| `SOPHEX-FE-UW-ADVANCED-SURFACE-TRIGGERS` | Promote advanced surfaces at the right moment | Add contextual links from evidence, scenarios, governance, and delivery |
| `SOPHEX-FE-UW-REPORT-BREADCRUMB` | Preserve deal context in report builder | Add persistent `Back to Deal` breadcrumb and snapshot context |
| `SOPHEX-FE-UW-MOCK-BOUNDARY-BANNERS` | Make high-risk prototype surfaces unmistakable | Add stronger prototype banners to export, IC packet, snapshots, HITL |

## Non-Goals

- Do not wire real uploads, OCR, comps providers, GIS providers, report generation, or exports.
- Do not implement schema, migrations, generated clients, queues, deploys, or production services.
- Do not persist reviewer decisions or gate overrides.
- Do not treat UI stage completion as authorization.
- Do not expose internal reviewer state or candidate evidence on public routes.

## Follow-Up Docs

- Update `WORLD_CLASS_PROTOTYPE_SPEC.md` route acceptance matrix to include Wave 3 through Wave 5 routes.
- Keep `MOCK_RESOLUTION_REGISTRY.md` as the source of truth for mock-to-runtime resolution.
- Convert accepted tickets above into the rapid build inventory only after operator confirms the next UX polish wave.
