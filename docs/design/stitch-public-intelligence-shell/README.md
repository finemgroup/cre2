# Stitch Public Intelligence Shell Artifacts

Date captured: 2026-05-29

Source: `web application/stitch/projects/6002986368956333925/screens/5df492c3f9c446ccb952f56744fbf700`

## Purpose

This folder preserves the Google Stitch package for Sophex's public intelligence product shell. It supersedes the sparse `Search / Upload / Studio` prototype menu direction for stakeholder-demo work and serves as the visual gate for public route adoption.

**Generated HTML is design evidence only.** Do not copy Tailwind CDN markup or generated image URLs into `prototype/` source. Adapt structure into existing Sophex React/CSS primitives.

## Contents

| Path | Role |
| --- | --- |
| `wave-1/screenshots/` | Stitch screen captures (`SPI-01` through `SPI-08`) |
| `wave-1/raw-html/` | Reference stubs summarizing pasted Stitch HTML structure |
| `wave-1/raw-html/00-source-map.md` | Screen-to-route adoption map |

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
