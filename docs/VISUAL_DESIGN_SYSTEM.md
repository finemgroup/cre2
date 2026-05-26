# Sophex Visual Design System

Institutional CRE visual language for the mock-only prototype. Harvested from **cre-platform** (ink/gold/green tokens, elevation ladder, inst-table density) and **ICSC Map Recovery** (warm parchment chrome, micro-labels, map HUD).

## Principles

1. **Institutional, not generic SaaS** — forest green + metallic gold accents on warm parchment; no default blue-primary drift.
2. **Evidence posture stays visible** — polish must not hide authority badges, non-production labels, or blocked export copy.
3. **Restrained motion** — see [MOTION_AND_INTERACTION_GUIDELINES.md](./MOTION_AND_INTERACTION_GUIDELINES.md); no pulse loops on public financial surfaces.
4. **Budget discipline** — total CSS ≤ 68 KB (Wave 13 visual initiative); split tokens before adding decorative rules.

## Token files

| File | Role |
| --- | --- |
| `prototype/src/styles/design-tokens.css` | Canonical CSS custom properties + public/studio bridges |
| `prototype/src/styles/visual-utilities.css` | Micro-labels, elevation, map HUD, inst-table, empty/skeleton states |
| `prototype/src/index.css` | Surface layouts and component rules (imports token layers first) |

## Core palette

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0F1110` | Display text, map HUD chrome |
| `--paper` / `--parchment` | `#F9F9F7` / `#F6F4EF` | Page backgrounds |
| `--cre-green` | `#1F5A3A` | Primary actions, studio primary (replaces legacy blue) |
| `--cre-gold` | `#D6B469` | Active nav indicator, bento hover, map HUD hairlines |
| `--chrome-forest` | `#1E392D` | Public header gradient |

## Typography

- **Family:** Inter (public + studio via `useStudioSurfaceFonts`)
- **Micro-label:** `.micro-label` / `.studio-eyebrow` — 11px, uppercase, wide tracking
- **Financial values:** `.fin-value` — tabular nums for KPIs and table cells

## Utilities

| Class | Purpose |
| --- | --- |
| `.elevation-low` / `.elevation-medium` | Shadow ladder |
| `.hover-lift` / `.hover-lift-subtle` | Card/button hover (disabled under reduced motion) |
| `.map-hud-panel` / `.map-hud-detail` | Frosted map overlay panels |
| `.inst-table` on `.studio-table` | Dense institutional table (via `DataTable dense`) |
| `.empty-state` | Honest empty panels with next action |
| `.skeleton-shimmer` | Gold-tinted loading shimmer |
| `.presentation-mode` | Demo/tablet polish toggle on public + studio shells |
| Route loading panels | Branded lazy-route fallbacks per surface family (`RouteLoadingPanel`) |

## Live reference

Route: **`/studio/design-system`** — token swatches, typography, buttons, badges, bento, tables, and states.

## Sister project harvest map

| Pattern | Source | Sophex adoption | Parity notes |
| --- | --- | --- | --- |
| Institutional green/gold | cre-platform `tokens.css` | `design-tokens.css` | Studio primary is CRE green; legacy blue removed |
| Micro-label typography | cre `globals.css` | `.micro-label` | Matches eyebrow + HUD labels |
| 6-layer elevation | cre `tokens.css` | `--shadow-elevation-*` | `.elevation-low/medium` on cards and route loading |
| Warm public chrome | ICSC war room header | `.shell-header` gradient | Forest gradient + pill nav on public shell |
| Map glass HUD | cre map controls + ICSC legend | `.map-hud-panel` | Mock map uses frosted HUD, not live tiles |
| Sidebar gold active bar | cre globals | `.studio-nav a.active` | Gold hairline + parchment active fill |
| Button press feedback | cre `Button` CVA | `:active scale(0.98)` | Shared across public, studio, modal shells |
| Dense institutional tables | cre data grids | `.inst-table` via `DataTable` | Dense default everywhere |
| Presentation / demo mode | ICSC tablet polish | `.presentation-mode` toggle | localStorage; marketing + studio shells |
| Branded route loading | cre loading states | `RouteLoadingPanel` variants | Per-surface copy; keeps e2e SR hook |

## Quality gates

After each visual wave:

- `npm run test` — unit + story tests
- `npm run test:e2e:visual` — snapshot regression
- `npm run budget:check` — CSS/JS ceilings
- axe on representative public + studio routes

## Wave ledger

| Wave | Focus | Status |
| --- | --- | --- |
| 13 | Token foundation, CSS split, design-system route | Implemented |
| 14 | Shell + component polish (badges, bento, buttons) | Implemented (Wave 13 overlap) |
| 15 | inst-table rollout, map HUD, loading/empty states | Implemented (dense default + branded route loading) |
| 16 | Presentation mode, doc sync, cross-project visual matrix | Implemented (nav link, snapshots, contextual triggers closeout) |

See also [WORLD_CLASS_PROTOTYPE_SPEC.md](./WORLD_CLASS_PROTOTYPE_SPEC.md) for product invariants.
