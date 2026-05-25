# Motion And Interaction Guidelines

Sophex motion should feel restrained, legible, and confidence-building. This is a CRE evidence and valuation product, not an AI toy.

Primary reference: CRE clean-master `apps/core/lib/motion-tokens.ts`, `apps/core/lib/motion/workflow-motion.ts`, `apps/core/components/os/OSMotion.tsx`, and [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) (doctrine only — do not copy runtime dependency graph into Sophex setup). P51 high-end animation supplement: [P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md). Map/GIS supplement: [ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md).

## Motion Tiers

| Tier | Duration | Use |
| --- | --- | --- |
| Execution | ~120ms linear | Step ticks, upload progress increments |
| Standard reveal | ~180ms standard easing | Page, section, and timeline reveal |
| Review | ~220ms ease-out | Page reveal, drawer open, section expand |
| Emphasized continuity | ~260ms emphasized easing | Drawer/sheet continuity when context must stay clear |
| Forbidden (MVP0 public) | — | Pulse loops, gamification celebrations, bounce easing |

P51 CRE adds explicit duration bands:

| Band | Target | Sophex posture |
| --- | ---: | --- |
| Instant feedback | 80-120ms | Button/chip/timeline feedback |
| Standard reveal | 150-220ms | Page, panel, card, and evidence reveal |
| Emphasized continuity | 220-320ms | Table-to-detail, map-to-drawer, report-step continuity |
| Avoid by default | >320ms | Rare only; never for public financial polish |
| Reduced motion | near-instant | Stable layout and opacity only |

## Canonical Presets (CRE-Inspired)

- **reveal** — page/content enter on route change (`PageTransitionShell` pattern).
- **osReveal / osStageItem / osRailEnter / osCollapse** — OS motion primitives for shell and workflow surfaces.
- **osSheetBackdrop / osSheetPanel / osRecede** — sheet lifecycle and soft exit primitives.
- **fade** — opacity-only transitions for panels and overlays.
- **scaleIn** — subtle modal/drawer enter (scale 0.96 → 1).
- **tooltip** — small y-offset fade for helper text.
- **listStagger** — 0.03–0.04s stagger for evidence citation lists only.

Always honor **reduced motion**: collapse animations to instant or near-instant opacity when user prefers reduced motion (`getMotionProps` / `useReducedMotionPreference` pattern).

CRE `OSMotion` also confirms that drawers/sheets should restore focus, trap focus while open, support Escape, and use `aria-modal` for modal surfaces.

## Workflow Continuity

P51 CRE reinforces a workflow-first rule: route changes are authority boundaries, but ordinary handoffs should not feel like product exits. Sophex should keep property, evidence, comp, report, and export context visible through:

- Persistent workflow header: route role, selected property/report, stage, source/proof posture, and return target.
- Stage rail or concise stepper on upload, report generation, and export gates.
- Disclosure ladder: inline row detail → split panel → inspector drawer → full workstation route.
- Back-to-workflow handoff after inspecting evidence, map regions, or report output.
- Layout-matched skeletons that preserve final geometry.

Route progress is a navigation cue only. It must never imply extraction, review, report generation, export, or publication completion.

## Appropriate Motion

- Small state transitions when a value changes authority state.
- Evidence drawer reveal for source, confidence, visibility, and freshness.
- Step transitions from property to evidence to comp set to valuation report.
- Upload and report progress timelines with user-safe phase labels.
- Map layer toggle with short opacity crossfade only.
- Route progress bar on internal navigation (CRE `RouteProgressBar` pattern).
- Underwriting readiness transitions should move gates from pending to warn/block/ready without implying approval or export authority.

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

Authoritative CRE references include route-level property skeletons, HITL queue skeleton rows, BOV wizard progress, BOV mission-control gate counts, generated-document version timelines, and publication hold `role="alert"` banners.

## Report Generation Progress

- Multi-step wizard progression (template → filters → customize → export intent).
- Section approval gates before export unlock.
- Loading overlay during generate; single success toast on complete.
- Show receipt/hash placeholder after export.

## Comparison And Map Interaction

- Row highlight on comp selection; drawer enter with `briefPanel`-style motion.
- Map pin select: CSS transition only; no infinite pin pulse on public maps.
- Heatmap layer add/remove: immediate or short opacity fade.
- **Metric drill-down transitions** — expand row or callout to reveal evidence panel with citation list stagger.
- **Comparison expand/collapse** — accordion or drawer for comp detail without full page navigation.
- **Map click-to-region** — select region updates comparison context; must not imply precision on mock data.
- **Layer-control HUD updates** — toggles update labels and visible features without full-page motion.
- **Spatial evidence drawer** — selected features reveal source, precision, freshness, review state, and allowed actions in a stable drawer.
- **Heavy layer loading** — use honest loading/empty/error states; never animate hidden provider latency as proof.
- **Save-report interaction** — short scale/fade confirm; stops at account/consent gate in MVP0.
- **Gated export progress** — multi-step wizard (sections → consent → generating → receipt placeholder).
- **Contribution unlock progress** — upload phase labels tied to real or honest indeterminate states.

## Content Engine Motion Warning

Avoid gamified or over-animated marketing patterns from generic conversion playbooks (bounce easing, pulse loops, urgency animations, celebration overlays). Sophex is a CRE evidence and valuation product — motion must reinforce trust and seriousness, not distract from source limitations.

## Primitive Graduation Checklist

Before a motion pattern becomes a shared Sophex primitive, require:

- Token defined and named in Sophex-neutral language.
- Consumer wired through the token/helper, not hardcoded timing.
- Reduced-motion behavior verified.
- Keyboard and focus behavior verified for sheets, drawers, and collapses.
- Mobile density tested with long lists or small screens.
- Context reviewed: universal, report-only, map-only, or operator-only.
- Proof exists: unit, E2E, or manual QA note.

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
- `statusPulse`, `pinPulse`, typing-dot, and spin loops on public financial data.
- P51/ICSC `war-room-*` naming or legacy 500ms/ease-heavy bulk motion fixes.
- Map ring pulses or animated precision halos on public financial data.
- Gate animations that make advisory underwriting output look approved.
- Count-up metrics that imply live recalculation when data is mocked or stale.
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
