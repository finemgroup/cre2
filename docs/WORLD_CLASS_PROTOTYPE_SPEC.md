# World-Class Prototype Product Specification

This file freezes the current `prototype/` build as the product specification for future runtime work.
It is not a runtime authorization, schema, migration, provider, queue, or deploy plan.

## Purpose

The current prototype proves the public Sophex marketplace surface and the Finem CRE Studio workflow shape with mock data only.
Future implementation should preserve the behaviors documented here unless a later product decision replaces them.

## Route Acceptance Matrix

| Route | Surface | User intent | Data posture | Launch readiness |
| --- | --- | --- | --- | --- |
| `/` | Public | Search sample properties and understand the marketplace promise. | Public baseline only. | Prototype-ready; production needs real public-data source contracts and analytics redaction. |
| `/property/:id` | Public | Review property intelligence, authority labels, evidence drawer, and Studio handoff. | Public baseline with no private observations. | Prototype-ready; production needs server-side field resolution and permissioned evidence queries. |
| `/property/:id/comps` | Public | Compare comps for a subject property. | Mock comp set with blocked/private labels. | Prototype-ready; production needs comp source rights, provider restrictions, and private-value isolation. |
| `/comps` | Public | Guard against missing subject property context. | No data exposure. | Ready as a guard pattern. |
| `/upload` | Public | Show contribution exchange, source-use consent, upload progress, and candidate-evidence result. | No real files sent; candidate evidence only. | Prototype-ready; production needs legal terms, file scanning, storage, source metadata, extraction candidates, and review gates. |
| `/report/:id` | Public | Preview a property report with source posture. | Mock report sections with public/candidate states. | Prototype-ready; production needs permission-filtered source bundles and section review state. |
| `/export/:id` | Public | Show consent, blocker review, export progress, and receipt placeholder. | No live export; receipt is simulated. | Prototype-ready; production needs idempotent export receipts and source-rights filtering. |
| `/studio` | Studio marketing | Explain broker workflow and drive onboarding/dashboard/pricing. | Mock marketing and workspace examples. | Prototype-ready; production needs auth-aware routing and conversion analytics redaction. |
| `/studio/onboarding` | Studio marketing | Select tier/account/workspace/first-deal path. | Mock account fields only. | Prototype-ready; production needs account creation, org creation, billing, and terms acceptance. |
| `/studio/settings/billing` | Studio settings | Compare plans and select/contact sales. | Mock plan tiers only. | Prototype-ready; production needs billing provider, plan entitlements, and no outbound automation until consent gates clear. |
| `/studio/dashboard` | Studio workspace | Monitor mock deal pipeline, plan usage, activity, and upgrade coverage. | Mock deal metrics and candidate/review labels. | Prototype-ready; production needs authenticated org-scoped reads. |
| `/studio/deals/:dealId/intake` | Studio workflow | Review deal inputs, staged imports, uploads, and draft save. | Mock deal, file, and staged-import data. | Prototype-ready; production needs upload service, staged extraction, review queue, and audit records. |
| `/studio/deals/:dealId` | Studio workflow | Inspect deal overview, metrics, source evidence, and trust drawer. | Mock deal and source blocks. | Prototype-ready; production needs permissioned deal membership and evidence service reads. |
| `/studio/deals/:dealId/comps` | Studio workflow | Review comps, authority tiers, and locked premium sources. | Mock reviewed/candidate/provider-restricted comps. | Prototype-ready; production needs provider-rights enforcement and plan gates server-side. |
| `/studio/deals/:dealId/underwriting` | Studio workflow | Review assumptions, gates, metrics, and source posture. | Mock underwriting and governance gates. | Prototype-ready; production needs versioned assumptions, gate audit, and reviewer identity. |
| `/studio/deals/:dealId/scenarios` | Studio workflow | Compare scenario matrix, IRR chart, and premium heatmap. | Mock scenario outputs; model-inferred labels. | Prototype-ready; production needs model input lineage and no AI-confidence-as-authority. |
| `/studio/reports/:dealId/builder` | Studio standalone | Review sections, source bundles, export blockers, PDF preview, and branding. | Mock report sections and source blocks. | Prototype-ready; production needs section approval, source-rights filtering, and artifact receipts. |
| `/studio/settings/white-label` | Studio settings | Configure branding, logo placeholders, preview portal/report states. | Mock branding only. | Prototype-ready; production needs tenant branding storage and no hiding of evidence posture. |
| `/studio/broker-os` | Studio operator | View sanitized job streams, agent inventory, and planning context. | Mock operational projections only. | Prototype-ready; production must keep raw logs, worker IDs, secrets, and PII out of public/operator-lite views. |

## Cross-Route Product Invariants

- Public routes never show user-private, organization-private, internal-only, raw extracted, or provider-restricted facts.
- Private uploads remain candidate evidence until explicit review and source-use gates clear.
- Export, share, and download actions are gated by consent, source rights, and review state.
- Authority labels are product requirements, not decorative badges.
- Prototype toasts signal simulated actions; production must replace them with governed receipts, confirmations, or real navigation.
- Broker OS and workflow status surfaces are projections; queues, agents, or job completion are never evidence authority.

## Launch Readiness Labels

- **Prototype-ready:** valuable as mock UI/product spec; no runtime trust.
- **Contract-ready:** can be implemented once API, permission, and receipt contracts are approved.
- **Production-ready:** requires runtime implementation, security review, privacy/legal approval, observability, and CI/CD gates.

Current state: routes are **prototype-ready**. None are production-ready.

## Prototype Quality Gates

These gates lock UX truth after Phase 2 waves without implying production readiness.

### Lighthouse CI

- **Config:** `prototype/lighthouserc.cjs`
- **CI job:** `.github/workflows/prototype-ci.yml` → `npm run test:lighthouse` against the Vite preview server.
- **Representative routes measured (10):**
  - Public: `/`, `/upload`, `/property/demo-001`, `/property/demo-001/comps`, `/report/demo-001`, `/export/demo-001`
  - Studio: `/studio/dashboard`, `/studio/deals/riverside-flats/underwriting`, `/studio/settings/billing`, `/studio/reports/riverside-flats/builder`

| Category | CI posture | Minimum score | Notes |
| --- | --- | --- | --- |
| Accessibility | **Blocking (error)** | 0.85 | Regressions fail CI; fix before merge. |
| Best practices | Warn only | 0.8 | Surfaces console/security drift without blocking mock work. |
| Performance | Warn only | 0.7 | Mock bundles and preview server timing fluctuate; treat as informational. |
| SEO | Off | — | Prototype is not indexed; SEO scores are not product requirements. |

### Visual regression

- **Spec:** `prototype/e2e/visual.spec.ts` (Chromium visual project).
- **Baselines:** `prototype/e2e/visual.spec.ts-snapshots/` — landing, property map, report preview, upload, comps, export gate, dashboard, underwriting, pricing, report builder, tablet/mobile breakpoints.
- **Rebaseline intentionally:** `npm run test:e2e:update-snapshots` when UI changes are expected; review PNG diffs in PRs.
- **`maxDiffPixelRatio`:** 0.03 desktop shells; 0.1 for narrow mobile clips.

### Public route RTL coverage

- **File:** `prototype/src/test/public-routes.test.tsx`
- Covers search, property intelligence, comps, upload stages, report sections, export blockers/receipts, route guards, actor demo, and axe on representative shells.
- Runs in Vitest CI without Playwright.

### Prototype CTA feedback

- Inert actions use `PrototypeActionButton`, `PrototypeActionLink`, or `PrototypeActionAnchor` to show simulated-action toasts.
- Disabled export/generate controls remain explicitly disabled with blocker copy; they are not silent no-ops.
