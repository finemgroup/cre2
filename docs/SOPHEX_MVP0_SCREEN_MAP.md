# Sophex MVP0 Screen Map

This screen map is **future-gated** for clickable prototype or mock-data MVP0 only. No runtime implementation is authorized by this document.

## Screen Inventory

| Screen | Purpose | Core components (conceptual) | State model | Motion needs | Evidence/trust needs |
| --- | --- | --- | --- | --- | --- |
| Public landing / search | Discovery and segment entry | Lightweight shell, hero search, market stat cards, segment chips, soft CTA | `idle → searching → results → selected` | Route progress, fade-in results | Non-production banner on mock data |
| Property intelligence page | Public baseline property view | Field cards, provenance cells, map/evidence drawer, source citations | `loading → public projection → auth unlock` | Layout skeleton, section expand | Authority label per field; hide private observations |
| Upload / intake flow | Document contribution exchange | UploadZone-style drag/drop, consent checkbox, clean-vs-scanned warning | `empty → validating → uploading → queued → candidate` | Per-file progress | Explicit contribution terms; candidate-only; no auto-publish |
| Evidence review panel | Moderator/user review of extracts | Staged import panel, source citation list, evidence drawer | `unreviewed → in_review → accepted/rejected/blocked` | Drawer slide, source list stagger | Candidate-only; HITL gate |
| Comp comparison dashboard | Side-by-side comp analysis | Candidate comp table, comparison columns, map drawer, metric drawer | `select → compare → save set → export intent` | Row highlight, drawer enter | Permission-filtered comps; private/provider-restricted comps masked |
| Valuation report preview | Evidence-first report surface | BOV section cards, confidence indicator, provenance summary | `generating → partial → section approvals → ready` | Step progress, section reveal | Non-production banner; citations and warnings on sections |
| Report export gate | Consent and audit before export | Export options dialog, disabled export card, output-guard warnings, consent modal | `locked → consent → generating → receipt → download` | Loading overlay, single success toast | Disabled until review, consent, and rights clear; audit hash |
| My reports / workspace | Saved reports for actor | Card list, filters, proof/status badges | `draft / preview / exported / archived` | List skeleton | Visibility badge per report |
| Contribution history | Upload and comp contribution trail | Activity timeline, proof badges, privacy badges | `submitted → processing → accepted/rejected/blocked` | Timeline expand only | Public vs private outcome labels |
| Moderation / review queue | Operator review surface | Queue table, trust tier/proof badges, source cards | `queued → assigned → decided` | Row enter stagger | Operator-only; idempotent decisions |

## Shell Rules

- **Public routes:** lightweight shell without operator nav, Jarvis, dialer, gamification, or command palette.
- **Authenticated routes:** minimal workspace header with account, reports, upload, and privacy settings.
- **Do not import:** CRE PersistentMainMenu, full RootProviders tree, or Fabricator mission control as MVP0 shell.

## Mock-Data Safety

All MVP0 screens that show sample comps, valuations, or market stats must display a non-production/stub banner until real data contracts and consent gates exist.

## Sister-Project References

- UX/motion patterns: CRE clean-master `apps/core` (see `docs/SISTER_PROJECT_SOURCE_MAP.md` and `CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md`)
- Interactive marketing patterns: Content Engine reference docs
- Workflow status labels: Finem Fabricator control-plane concepts

## Authoritative CRE MVP0 Additions

- Property intelligence page should borrow the clean-master property detail tab structure only as doctrine: overview, comps, documents, activity, relationships, and tasks become Sophex-specific public/private tabs.
- Evidence review panel should borrow staged import/source-bundle/generated-document-authority patterns: candidate-only labels, source citations, publication holds, and blocked actions.
- Report preview/export should borrow BOV wizard, output guard, publication-hold banner, and export readiness patterns.
- Map screens should prefer map selection plus evidence drawer over duplicate heatmap components.
- All mock/report screens retain non-production banners until real data rights and source-use policy exist.
