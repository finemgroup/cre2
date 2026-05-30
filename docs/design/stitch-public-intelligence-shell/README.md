# Stitch Public Intelligence Shell Artifacts

Date captured: 2026-05-29

Source: `web application/stitch/projects/6002986368956333925/screens/5df492c3f9c446ccb952f56744fbf700`

## Purpose

This folder preserves the Google Stitch package for Sophex's public intelligence product shell. It supersedes the sparse `Search / Upload / Studio` prototype menu direction for stakeholder-demo work and serves as the visual gate for public route adoption.

**Generated HTML is design evidence only.** Do not copy Tailwind CDN markup or generated image URLs into `prototype/` source. Adapt structure into existing Sophex React/CSS primitives.

## Contents

| Path | Role |
| --- | --- |
| `wave-1/screenshots/` | Screen captures (`SPI-01` through `SPI-08`) |
| `wave-1/raw-html/` | Reference stubs summarizing pasted Stitch HTML structure |
| `wave-1/raw-html/00-source-map.md` | Screen-to-route adoption map |

## Screenshot provenance

Original Stitch PNG exports were not present in repo history at archive time. Files under `wave-1/screenshots/` are **post-implementation Playwright baselines** captured from the merged prototype (PR #13, 2026-05-30) so every `SPI-*` screen has a linked visual artifact.

| File | Source |
| --- | --- |
| `01-public-product-shell.png` | Playwright visual baseline — landing desktop |
| `02-property-profile-hero.png` | Playwright visual baseline — property desktop |
| `03-comps-map-grid.png` | Playwright visual baseline — comps desktop |
| `04-underwrite-shell.png` | Playwright visual baseline — Studio underwriting desktop (SPI-04 handoff target) |
| `05-source-pack-drilldown.png` | Playwright visual baseline — source pack desktop |
| `06-demo-controls-drawer.png` | Live capture — report route with Demo drawer open |
| `07-review-export-gate.png` | Playwright visual baseline — export gate desktop |
| `08-mobile-property-profile.png` | Live capture — property mobile (320×800) |

Replace individual files with original Stitch exports when those assets are imported; update this table accordingly.

## Screen Index

| ID | Stitch screen | Target route | Adoption ticket |
| --- | --- | --- | --- |
| `SPI-01` | Explore Intelligence | `/` | `SOPHEX-EXPLORE-UI-001` |
| `SPI-02` | Property Profile Hero | `/property/:id` | `SOPHEX-PROPERTY-HERO-002` |
| `SPI-03` | Comps map/grid | `/property/:id/comps` | `SOPHEX-COMPS-UI-001` |
| `SPI-04` | Underwrite shell | Studio handoff / deferred preview | `SOPHEX-UNDERWRITE-PREVIEW-001` |
| `SPI-05` | Source pack drilldown | `/sources/:id` | `SOPHEX-SOURCE-UI-001` |
| `SPI-06` | Demo controls drawer | Demo drawer (not product nav) | `SOPHEX-PRIMITIVES-001` |
| `SPI-07` | Review/export gate | `/review/:id`, `/export/:id` | `SOPHEX-REVIEW-EXPORT-UI-001` |
| `SPI-08` | Mobile property profile | `/property/:id` (mobile) | `SOPHEX-MOBILE-UI-001` |

## Related Docs

- [SOPHEX_STITCH_DELTA_AND_PRIMITIVES_PLAN.md](../../SOPHEX_STITCH_DELTA_AND_PRIMITIVES_PLAN.md)
- [SOPHEX_STITCH_IMPLEMENTATION_BRIDGE_PLAN.md](../../SOPHEX_STITCH_IMPLEMENTATION_BRIDGE_PLAN.md)
- [stitch-underwriting-workstation](../stitch-underwriting-workstation/README.md) — Studio underwriting references
