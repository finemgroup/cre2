# HTML Design Snippets — Import Queue

Saved from Google design exports. All 12 snippets collected — ready for prototype build integration.

| # | File | Screen | Status |
|---|------|--------|--------|
| 1 | `01-landing.html` | Finem CRE Studio — Public landing page | Saved |
| 2 | `02-pricing.html` | Billing & Plans — Settings pricing page | Saved |
| 3 | `03-onboarding.html` | Onboarding — 4-step wizard (all steps in one file) | Saved |
| 4 | `04-dashboard.html` | Main Deal Dashboard — pipeline overview | Saved |
| 5 | `05-deal-overview.html` | Deal Overview — Riverside Flats workspace | Saved |
| 6 | `06-deal-intake.html` | Deal Intake — form + packet preview | Saved |
| 7 | `07-underwriting-cockpit.html` | Underwriting Cockpit — 1200 Tech Boulevard | Saved |
| 8 | `08-comps.html` | Comps — Riverside Flats sales comparables | Saved |
| 9 | `09-scenario-comparison.html` | Scenario Comparison — multi-scenario matrix | Saved |
| 10 | `10-report-builder.html` | Report Builder — PDF preview + branding | Saved |
| 11 | `11-white-label-settings.html` | White Label Settings — enterprise branding | Saved |
| 12 | `12-broker-os-control-panel.html` | Broker OS Control Panel — ops monitoring | Saved |

## Snippet 1 — Landing Page

- **HTML:** `01-landing.html`
- **Reference image:** `images/01-landing.png`
- **Brand:** Finem CRE Studio
- **Sections:** Header, Hero + product mockup, How it works (4 steps), CRE Workflows bento grid, Pricing CTA strip, Footer
- **Stack in source:** Tailwind CDN, Inter, Material Symbols

## Snippet 2 — Billing & Plans

- **HTML:** `02-pricing.html`
- **Reference image:** `images/02-pricing.png`
- **Shell:** App sidebar (Settings active) + top app bar
- **Sections:** Hero + monthly/annual toggle, 3 pricing cards (Free/Premium/Enterprise), feature comparison table, FAQ, footer
- **Stack in source:** Tailwind CDN, Inter, Material Symbols, inline toggle JS

## Snippet 3 — Onboarding Wizard

- **HTML:** `03-onboarding.html`
- **Reference image:** `images/03-onboarding-step1.png` (step 1 shown)
- **Shell:** Centered modal card, no app sidebar
- **Steps:** (1) Tier selection — Boutique vs Institutional, (2) Account credentials, (3) Workspace config + asset class chips, (4) First deal workflow picker
- **Stack in source:** Tailwind CDN, Inter, Material Symbols, multi-step JS with progress bar

## Snippet 4 — Main Deal Dashboard

- **HTML:** `04-dashboard.html`
- **Reference image:** `images/04-dashboard.png`
- **Shell:** App sidebar (Dashboard active) + main content + right panel
- **Sections:** Welcome header + plan usage, 4 KPI cards, deal pipeline table, upgrade CTA, recent activity feed, footer
- **Stack in source:** Tailwind CDN, Inter, Material Symbols

## Snippet 5 — Deal Overview (Riverside Flats)

- **HTML:** `05-deal-overview.html`
- **Reference image:** `images/05-deal-overview.png`
- **Shell:** App sidebar (Deals active) + deal context header + sub-nav tabs + right drawer
- **Sections:** 4 metric cards, property snapshot + workflow timeline, source documents table, analyst notes, deal team panel
- **Stack in source:** Tailwind CDN, Inter, Material Symbols

## Snippet 6 — Deal Intake

- **HTML:** `06-deal-intake.html`
- **Reference image:** `images/06-deal-intake.png`
- **Shell:** App sidebar (Deal Intake active) + split form/preview layout + sticky action bar
- **Sections:** Property basics, deal basics (validation error), financial assumptions, source materials upload, packet preview panel, save/continue footer
- **Stack in source:** Tailwind CDN, Inter, Material Symbols

## Snippet 7 — Underwriting Cockpit

- **HTML:** `07-underwriting-cockpit.html`
- **Reference image:** `images/07-underwriting-cockpit.png`
- **Shell:** App sidebar (Underwriting active) + scenario header + 3-column cockpit layout
- **Sections:** Assumptions editor, KPI metrics, pro forma cash flow table, review flags panel
- **Stack in source:** Tailwind CDN, Inter, Material Symbols, warning color tokens

## Snippet 8 — Comps (Riverside Flats)

- **HTML:** `08-comps.html`
- **Reference image:** `images/08-comps.png`
- **Shell:** App sidebar (Comps active) + deal header + table/drawer layout
- **Sections:** Subject property card, view mode toggle, sales comparables table, comp detail drawer, upgrade paywall
- **Stack in source:** Tailwind CDN, Inter, Material Symbols

## Snippet 9 — Scenario Comparison

- **HTML:** `09-scenario-comparison.html`
- **Reference image:** `images/09-scenario-comparison.png`
- **Shell:** App sidebar (Underwriting active) + comparison header
- **Sections:** 4 scenario cards, key metrics matrix with freemium blur overlay, IRR bar chart, locked sensitivity heatmap
- **Stack in source:** Tailwind CDN, Inter, Material Symbols

## Snippet 10 — Report Builder

- **HTML:** `10-report-builder.html`
- **Reference image:** `images/10-report-builder.png`
- **Shell:** Top nav (Reports active) + 3-column builder layout (no app sidebar)
- **Sections:** Section checklist, live PDF cover preview, branding settings (logo/color/font/disclaimer), export actions
- **Stack in source:** Tailwind CDN, Inter, Material Symbols

## Snippet 11 — White Label Settings

- **HTML:** `11-white-label-settings.html`
- **Reference image:** `images/11-white-label-settings.png`
- **Shell:** App sidebar (Settings active) + top nav + form/preview split
- **Sections:** Brand basics, logo uploads, colors/typography, report branding, custom domain (Enterprise), live portal preview toggle
- **Stack in source:** Tailwind CDN, Inter, Material Symbols, preview toggle JS

## Snippet 12 — Broker OS Control Panel

- **HTML:** `12-broker-os-control-panel.html`
- **Reference image:** `images/12-broker-os-control-panel.png`
- **Shell:** App sidebar (Dashboard active, Broker OS section) + page header (no desktop top nav)
- **Sections:** Readiness summary metrics, active job streams table, agent inventory list, planning context builder (syntax-highlighted JSON)
- **Stack in source:** Tailwind CDN, Inter, Material Symbols, custom JSON syntax CSS
