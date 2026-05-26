# Sophex Shell Motion Harvest

This packet records the approved **docs-only** harvest direction for Sophex shell, sidebar, rail, drawer, and spatial workbench motion. It synthesizes CRE clean-master shell doctrine, CRE/UX motion tokens, P51 workflow-continuity guidance, and ICSC map interaction patterns into Sophex-native guidance.

It does not authorize copying sister-project source code, importing runtime components, adding schema, adding providers, deploying, reusing ICSC assets, or adopting CRE operator-shell complexity.

## Source Inputs

| Source | Status | Use |
| --- | --- | --- |
| `CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md` | Authoritative clean CRE `master` archive | Public/auth shell split, authenticated workstation nav, evidence drawers, route progress, reduced-motion expectations |
| `UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md` | Authoritative clean CRE `apps/core` motion archive | Motion tiers, page transitions, sheet/drawer behavior, focus and reduced-motion rules |
| `P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md` | Provisional supplement | Workflow continuity, stage rails, panel handoffs, restraint warnings |
| `ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md` | Provisional map/GIS supplement | Layer HUD, map selection to evidence drawer, lazy layer loading, spatial provenance, map a11y |
| `FRONTEND_UX_INHERITANCE.md` and `MOTION_AND_INTERACTION_GUIDELINES.md` | Living Sophex doctrine | Canonical adaptation rules and exclusions |

## Scope

Allowed scope for this harvest:

- Authenticated Studio shell and left-rail/sidebar behavior.
- Deal workflow grouping, stage rails, context strips, and delivery surface handoffs.
- Report builder and spatial workbench panel transitions.
- Drawer/sheet lifecycle behavior: focus placement, Escape close, focus restore, and reduced-motion fallback.
- Map layer controls, selected feature detail, and spatial evidence drawer transitions.
- Shared Sophex-native motion tokens and CSS/React helpers in `prototype/` when implementation is explicitly requested.

Out of scope:

- Public marketplace hero animations beyond restrained route/page feedback.
- CRE `PersistentMainMenu` wholesale adoption.
- Operating-lens chrome, Jarvis, dialer, gamification, command palette as primary navigation, or large provider-tree imports.
- ICSC KML, GeoJSON, SharePoint links, local assets, provider credentials, schema, SQL, or runtime map services.
- Pulses, precision halos, bounce easing, celebration overlays, hover-only provenance, or animation that implies approval, export readiness, live valuation, or legal boundary certainty.

## Product Principle

Motion is an orientation aid. It helps users keep deal, property, stage, evidence, report, and spatial context while moving across surfaces. It is never proof, never approval, never publication authority, and never a substitute for source labels.

## Adoption Model

### Adopt Now

These patterns are appropriate for MVP0 prototype polish:

- **Unified motion tokens** — execution, standard reveal, review, and emphasized continuity durations with reduced-motion collapse.
- **Route transitions** — low-motion page reveal and route progress as navigation feedback only.
- **Studio sidebar feedback** — subtle active/hover transitions for authenticated workstations.
- **Workflow rail transitions** — stage stepper, grouped tabs, advanced nav, and contextual handoff surfaces.
- **Workbench panel transitions** — table/list/grid switches in evidence, source trace, spatial, and future report workbenches.
- **Drawer transitions** — right-side evidence/action drawers with focus trap, Escape, and focus restore.
- **Map interaction transitions** — short opacity/position changes for layer toggles and selected detail cards.

### Adapt Later

These patterns should wait for stronger contracts or runtime gates:

- Permission-filtered command palette and global search.
- Richer operator/moderation cockpit rail with live queue state.
- Streaming progress from sandbox/runtime job status projections.
- Map layer skeletons tied to real lazy geometry fetches.
- Receipt-aware report/export progress once governed receipts are live.

### Exclude

These should not be imported into Sophex:

- CRE operator-shell complexity or internal productivity chrome as public navigation.
- ICSC map assets, legacy map runtime code, hardcoded coordinates without provenance, or unlabeled polygon layers.
- Infinite pin pulses, map rings, precision halos, and animated confidence rings.
- Hover-only source/provenance disclosure.
- Any animation that makes candidate evidence, mocked metrics, AI confidence, or queue completion look production-approved.

## Implementation Guardrails

When implementation is authorized, every new shared motion primitive must satisfy:

1. Token name is Sophex-neutral, not copied from CRE/P51/ICSC naming.
2. Reduced-motion behavior is verified.
3. Keyboard and focus behavior is verified for drawers, sheets, collapses, and panel switches.
4. Public map/list fallbacks remain available without hover or pointer-only interaction.
5. Motion does not hide source limitations, proof posture, blocked gates, or non-production banners.
6. Bundle budget and visual regression impacts are reviewed intentionally.

## Current Prototype Alignment

The current `prototype/` already has the right foundation:

- `lib/motion/*` for tokenized motion and reduced-motion helpers.
- `PageTransition` and `RouteProgress` for navigation feedback.
- `SophexSheet` and `SophexModal` for drawer/modal lifecycle.
- `DealContextStrip`, `DealStageStepper`, grouped `DealWorkflowTabs`, and `AdvancedWorkflowNav` for Studio workflow orientation.
- `DataWorkbenchShell` for evidence/source/spatial table-list-grid switching.
- Spatial provenance labels, layer controls, and non-map fallback lists.

The recommended next implementation lane, when desired, is a small mock-only **Sophex shell motion closeout**:

| Ticket | Scope | Required checks |
| --- | --- | --- |
| `SOPHEX-SHELL-MOTION-TOKENS` | Extend Sophex-native motion token names for nav rails, workbench panels, map selections, and drawer continuity. | Unit tests for reduced motion and token resolution |
| `SOPHEX-SHELL-NAV-MOTION` | Apply restrained hover/active transitions to authenticated Studio shell, grouped tabs, stage rails, and delivery nav. | A11y nav tests and visual review |
| `SOPHEX-WORKBENCH-PANEL-MOTION` | Animate Evidence Workbench table/list/grid switches without changing authority state. | Workbench unit test and reduced-motion coverage |
| `SOPHEX-SPATIAL-MOTION-A11Y` | Apply map-layer and selected-detail transitions while preserving list/drawer fallback. | Map a11y tests and no precision-overclaim copy |
| `SOPHEX-MOTION-DOC-SYNC` | Keep this packet, `MOTION_AND_INTERACTION_GUIDELINES.md`, `FRONTEND_UX_INHERITANCE.md`, and `WORLD_CLASS_PROTOTYPE_SPEC.md` aligned. | Docs review |

## Acceptance Criteria

- No sister-project source code, assets, or runtime dependencies are copied.
- No public route receives operator-cockpit navigation chrome.
- Reduced-motion users see stable layout and near-instant opacity/state changes.
- Motion upgrades preserve explicit mock, advisory, blocked, source-pending, and export-gated copy.
- Map motion keeps every spatial claim tied to source, precision, freshness, permission, and fallback text.

