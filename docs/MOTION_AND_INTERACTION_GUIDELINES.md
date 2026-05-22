# Motion And Interaction Guidelines

Sophex motion should feel restrained, legible, and confidence-building. This is a CRE evidence and valuation product, not an AI toy.

Primary reference: CRE `apps/core/lib/motion-tokens.ts` (doctrine only — do not copy runtime dependency graph into Sophex setup).

## Motion Tiers

| Tier | Duration | Use |
| --- | --- | --- |
| Execution | ~120ms linear | Step ticks, upload progress increments |
| Review | ~220ms ease-out | Page reveal, drawer open, section expand |
| Forbidden (MVP0 public) | — | Pulse loops, gamification celebrations, bounce easing |

## Canonical Presets (CRE-Inspired)

- **reveal** — page/content enter on route change (`PageTransitionShell` pattern).
- **fade** — opacity-only transitions for panels and overlays.
- **scaleIn** — subtle modal/drawer enter (scale 0.96 → 1).
- **tooltip** — small y-offset fade for helper text.
- **listStagger** — 0.03–0.04s stagger for evidence citation lists only.

Always honor **reduced motion**: collapse animations to instant or near-instant opacity when user prefers reduced motion (`getMotionProps` / `useReducedMotionPreference` pattern).

## Appropriate Motion

- Small state transitions when a value changes authority state.
- Evidence drawer reveal for source, confidence, visibility, and freshness.
- Step transitions from property to evidence to comp set to valuation report.
- Upload and report progress timelines with user-safe phase labels.
- Map layer toggle with short opacity crossfade only.
- Route progress bar on internal navigation (CRE `RouteProgressBar` pattern).

## Loading And Progress States

Use real workflow labels where possible:

- Uploaded.
- Scanning.
- Parsing.
- Extracting.
- Needs review.
- Reviewing.
- Model run.
- Report assembly.
- Ready.
- Blocked.

Use layout-matched skeletons (property page, table, report sections) instead of generic spinners alone.

Do not expose internal queue names, provider details, raw receipts, or execution controls to public users.

## Report Generation Progress

- Multi-step wizard progression (template → filters → customize → export intent).
- Section approval gates before export unlock.
- Loading overlay during generate; single success toast on complete.
- Show receipt/hash placeholder after export.

## Comparison And Map Interaction

- Row highlight on comp selection; drawer enter with `briefPanel`-style motion.
- Map pin select: CSS transition only; no infinite pin pulse on public maps.
- Heatmap layer add/remove: immediate or short opacity fade.

## Trust Visualization

Use badges, panels, and accessible labels for:

- Public/private/premium distinction.
- Review state.
- Dispute state.
- Freshness.
- Confidence (with source/freshness subtext).
- Source type.
- Export/share eligibility.

See `docs/SOPHEX_TRUST_UI_GUIDELINES.md`.

## Pitfalls

- Over-animation that makes evidence feel unserious.
- Gamification celebration overlays (CRE has these; Sophex must not inherit).
- Hover-only provenance that fails on mobile or assistive technology.
- Treating AI confidence animation as authority.
- Hiding source limitations inside polished reports.
- Exposing proprietary model weights or overclaiming precision.
- Claiming superiority to appraisals without proof and legal review.
- Animated confidence rings implying live recalculation when data is mocked.

## MVP0 Restraint Level

Default to **low motion** on public SEO/GEO pages. Favor route progress bar, skeletons, drawer slide, and short fades. Defer command palette, notification drawer animations, and operator-shell transitions.

## Fabricator Job Phase Timelines (Provisional)

Borrow **phase labels** from Fabricator job projection doctrine — not raw run logs:

| Phase | Public-safe label | Notes |
| --- | --- | --- |
| Received | Uploaded | File accepted, not yet classified |
| Classifying | Checking document | Ingestion classifier running |
| Scanning | Scanning | OCR path only |
| Extracting | Extracting | Candidate generation |
| Review | Needs review / Reviewing | HITL gate |
| Generating | Building report | ReportGenerationRun |
| Ready | Ready | Export may still be gated |
| Blocked | Blocked | Sanitized reason only |

### SSE / Progress Patterns (Future-Gated)

- Server-sent events or streaming progress may inform **operator** dashboards only until consent and UX review complete.
- Public Sophex UI may subscribe to **JobStatusProjection** updates in a future phase — not Fabricator raw SSE payloads.
- **No simulated progress** — progress indicators must reflect real phase transitions or remain indeterminate with honest labels.
- **No raw log panes** in public UI — operator cockpits may show detailed logs; contributors see sanitized timelines only.

### Operator Vs Public UI Split

| Surface | Motion/progress allowed |
| --- | --- |
| **Public Sophex** | Phase labels, skeletons, blocked/ready states, export gate |
| **Authenticated contributor** | Same as public plus saved-report status |
| **Operator/moderation** | Richer timelines, queue hints, receipt links — future-gated, not MVP0 public |
| **Fabricator mission control** | Reference only — do not copy into public Sophex |
