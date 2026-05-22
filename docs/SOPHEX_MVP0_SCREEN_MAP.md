# Sophex MVP0 Screen Map

This screen map is **future-gated** for clickable prototype or mock-data MVP0 only. No runtime implementation is authorized by this document.

## Screen Inventory

| Screen | Purpose | Core components (conceptual) | State model | Motion needs | Evidence/trust needs |
| --- | --- | --- | --- | --- | --- |
| Public landing / search | Discovery and segment entry | Hero search, market stat cards, segment chips, soft CTA | `idle → searching → results → selected` | Route progress, fade-in results | Non-production banner on mock data |
| Property intelligence page | Public baseline property view | Field cards, provenance cells, map/heatmap stub, source citations | `loading → public projection → auth unlock` | Layout skeleton, section expand | Authority label per field; hide private observations |
| Upload / intake flow | Document contribution exchange | Drag/drop upload, consent checkbox, clean-vs-scanned warning | `empty → validating → uploading → queued → extracted (mock)` | Per-file progress | Explicit contribution terms; no auto-publish |
| Evidence review panel | Moderator/user review of extracts | Evidence panel, document viewer modal, approve/reject | `unreviewed → in_review → approved/disputed` | Drawer slide, source list stagger | Version/hash for moderators; HITL gate |
| Comp comparison dashboard | Side-by-side comp analysis | Data table, comparison columns, map stub, metric drawer | `select → compare → save set → export intent` | Row highlight, drawer enter | Permission-filtered comps; private comps masked |
| Valuation report preview | Evidence-first report surface | Section cards, confidence indicator, provenance summary | `generating → partial → section approvals → ready` | Step progress, section reveal | Non-production banner; citations on sections |
| Report export gate | Consent and audit before export | Export options dialog, disabled export card, consent modal | `locked → consent → generating → receipt → download` | Loading overlay, single success toast | Disabled until review complete; audit hash |
| My reports / workspace | Saved reports for actor | Card list, filters, status badges | `draft / preview / exported / archived` | List skeleton | Visibility badge per report |
| Contribution history | Upload and comp contribution trail | Activity timeline, privacy badges | `submitted → processing → accepted/rejected` | Timeline expand only | Public vs private outcome labels |
| Moderation / review queue | Operator review surface | Queue table, trust tier badges, notification degraded state | `queued → assigned → decided` | Row enter stagger | Operator-only; idempotent decisions |

## Shell Rules

- **Public routes:** lightweight shell without operator nav, Jarvis, dialer, gamification, or command palette.
- **Authenticated routes:** minimal workspace header with account, reports, upload, and privacy settings.
- **Do not import:** CRE PersistentMainMenu, full RootProviders tree, or Fabricator mission control as MVP0 shell.

## Mock-Data Safety

All MVP0 screens that show sample comps, valuations, or market stats must display a non-production/stub banner until real data contracts and consent gates exist.

## Sister-Project References

- UX/motion patterns: CRE `apps/core` (see `docs/SISTER_PROJECT_SOURCE_MAP.md`)
- Interactive marketing patterns: Content Engine reference docs
- Workflow status labels: Finem Fabricator control-plane concepts
