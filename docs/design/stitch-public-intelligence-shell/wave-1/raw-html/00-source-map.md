# Raw HTML Source Map

Date captured: 2026-05-29

Source screen: `web application/stitch/projects/6002986368956333925/screens/5df492c3f9c446ccb952f56744fbf700`

The full generated Stitch HTML was pasted into the planning thread as eight consecutive HTML documents. This folder records screen titles, source path, screenshot pairing, and implementation-relevant structure so the design can be tracked beside the screenshots without treating generated Tailwind CDN output as prototype source.

## Screen References

| ID | Title in pasted HTML | Screenshot | Reference stub | Target route | Ticket |
| --- | --- | --- | --- | --- | --- |
| `SPI-01` | Sophex - Explore Intelligence | `../screenshots/01-public-product-shell.png` | `01-public-product-shell.reference.html` | `/` | `SOPHEX-EXPLORE-UI-001` |
| `SPI-02` | Property Profile - 1200 Commerce St | `02-property-profile-hero.png` | `02-property-profile-hero.reference.html` | `/property/demo-001` | `SOPHEX-PROPERTY-HERO-002` |
| `SPI-03` | Sophex - Comps | `03-comps-map-grid.png` | `03-comps-map-grid.reference.html` | `/property/demo-001/comps` | `SOPHEX-COMPS-UI-001` |
| `SPI-04` | Sophex - Underwrite | `04-underwrite-shell.png` | `04-underwrite-shell.reference.html` | Studio `/underwriting` | `SOPHEX-UNDERWRITE-PREVIEW-001` |
| `SPI-05` | Sophex - Source Pack Drilldown | `05-source-pack-drilldown.png` | `05-source-pack-drilldown.reference.html` | `/sources/demo-001` | `SOPHEX-SOURCE-UI-001` |
| `SPI-06` | Property Hero & Demo Controls | `06-demo-controls-drawer.png` | `06-demo-controls-drawer.reference.html` | Demo drawer | `SOPHEX-PRIMITIVES-001` |
| `SPI-07` | Sophex - Review | `07-review-export-gate.png` | `07-review-export-gate.reference.html` | `/export/demo-001`, `/review/demo-001` | `SOPHEX-REVIEW-EXPORT-UI-001` |
| `SPI-08` | Property Profile - Mobile | `08-mobile-property-profile.png` | `08-mobile-property-profile.reference.html` | `/property/demo-001` mobile | `SOPHEX-MOBILE-UI-001` |

## Non-Negotiables

- HTML stubs are structural evidence, not importable source.
- Screenshots are the primary visual gate when HTML diverges from implementation.
- Every adoption ticket must preserve mock-only, export-gated, and advisory posture.
