# Frontend UX Inheritance

Sophex should inherit UX doctrine from CRE Platform (`apps/core`), Content Engine reference materials, and Finem Fabricator control-panel patterns — without copying internal screens or runtime code.

## Primary Reference

CRE Platform `apps/core` in the clean clone `C:\Projects\cre-platform-master-clean` is the richest sister-project design-system source. See `docs/SISTER_PROJECT_SOURCE_MAP.md` and [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) for paths. Finem Fabricator has minimal UI stubs; Content Engine provides marketing/interactive patterns.

## Public Marketing Surfaces Vs Authenticated Workstations

| Surface | Purpose | Content Engine patterns allowed |
| --- | --- | --- |
| **Public marketing shell** | Landing, SEO/GEO market pages, sample interactive reports, comparison/heatmap demos | Outcome-first hero, segment selector, scannable callouts, soft CTAs, mock comparison/heatmap |
| **Authenticated contribution workstation** | Upload, save report, contribution exchange, privacy settings | Progressive form, upload → unlock depth, gated export intent |
| **Authenticated report workstation** | Full report builder, section review, export gate | Personalized report builder, citations/warnings, BOV-style section approve |

Public surfaces must use public baseline or sample/mock data with stub banners. Authenticated workstations handle private uploads and permissioned report depth.

## Content Engine UX Patterns (Reference-Only)

From [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md):

- **Outcome-first hero** — clear outcome headline, proof above fold, segment selector (investor/broker/advisor).
- **Comparison dashboard** — interactive comp/tenant compare with filters, sort, search.
- **Heat map / regional map** — anonymized or sample regional layers; explicit sample labels in MVP0.
- **Filters / sort / search** — comp discovery and report section navigation.
- **Personalized report builder** — toggle charts, map, table, statistics before export.
- **Progressive form** — minimal fields first; expand on save/upload intent.
- **Scannable callout layout** — metrics and proof in callout boxes, not wall-of-text.
- **Mobile conversion patterns** — sticky soft CTA, swipe comparison, collapsible evidence panels.

Do **not** implement on public surfaces: exit-intent popups, email nurture hooks, CRM auto-sync, syndication widgets.

## Shell And Workstations

Use a **lightweight public shell** for landing, search, market pages, and sample interactive reports. Use a **minimal authenticated workspace** for upload, reports, contributions, and privacy settings.

Authoritative CRE confirms this split in `RootProviders.tsx` and `SessionGate.tsx`: public/auth route prefixes receive lightweight handling, while authenticated workstations mount TopBar, route transitions, mobile nav, command palette, and fuller providers. Sophex should keep the principle but simplify the operator shell.

Authenticated workstations:

- Property intelligence page.
- Upload/intake workspace.
- Evidence and observation review view.
- Comp comparison workspace.
- Valuation/reporting workspace.
- Account, organization, and privacy settings.

**Do not import into MVP0:**

- CRE PersistentMainMenu and operating-lens navigation complexity.
- Jarvis, dialer, gamification overlays, and celebration toasts.
- Full RootProviders provider tree (20+ providers).
- Universal command palette as primary navigation (future-gated, permission-filtered).
- Legacy duplicate mobile nav from `apps/core/components/navigation/MobileBottomNav.tsx`; clean master shows canonical mobile nav under `apps/core/components/mobile/MobileBottomNav.tsx`.

## Evidence-First UI

Every important value should support a source/evidence panel. Depending on actor permissions, the panel may show:

- Public record source.
- User-uploaded source document.
- Source type and date.
- Review state.
- Confidence/freshness label.
- Visibility class.
- Why the actor is allowed to see the value.

Borrow CRE patterns as doctrine:

- **SourceCitation** — compact/detailed inline citation buttons.
- **ProvenanceCell** — table rows with source chip, confidence dot, freshness.
- **ProvenanceModal** — tabbed deep provenance with conflicts and reliability.
- **BOVSectionCard / BOVProvenanceCard** — report section review and chain summary.
- **SelectedObjectDrawer / SourceEvidenceBlockCard / StagedImportReviewPanel** — evidence-first drawer and review panels.
- **Generated document authority panels** — publication holds, version timelines, and file-ref authority.

Unauthorized viewers must not see private actor identity, private values, or private source documents.

## Authority Labels

See `docs/SOPHEX_TRUST_UI_GUIDELINES.md` for full taxonomy. Sophex UI should visibly label values as:

- Public baseline.
- User-submitted.
- Organization-private.
- Shared-with-permission.
- Reviewed / Unreviewed.
- Stale / Disputed / Blocked.
- Promoted.
- Model-inferred.
- Premium-private.

## Change Log UI

Field-level change logs should explain conflicting observations without leaking private data. For example, a public viewer may see that acreage is public GIS baseline, while an internal reviewer sees the full observation history and source lineage.

## Upload Intake UX

The upload flow should explain:

- Clean digital PDFs are preferred.
- Scanned documents may cost more and require review.
- User must choose or accept source-use and visibility terms.
- Extraction is candidate evidence, not automatic truth.
- Some documents may be blocked until review.

Borrow CRE `FileUpload` behavior conceptually: drag/drop, validation errors per file, progress states.

## Comparison, Heat Map, And Map UX

From Content Engine and CRE map patterns:

- Interactive tenant/property/comp comparison dashboard (mock-safe for MVP0).
- Regional heat map with anonymized or sample data and explicit sample labels.
- Filters, sort, search, and progressive disclosure for comp sets.
- Map/GIS overlays for parcel, comp radius, zoning, traffic, demographics — **not** legal/title conclusions.

Distinguish comp types:

- User-uploaded comps.
- Public/platform comps.
- Private organization comps.
- Excluded, stale, or disputed comps.

CRE `CompMapView` is stubbed; do not ship fake geo precision. Label mock maps clearly.

Clean-master map references are stronger around `MapClient`, `SelectedObjectDrawer`, `MapFocusModeShell`, and eligibility-gated action baskets. Treat duplicate heatmap widgets as reference only; do not pick a duplicated component as canonical.

## Report And Marketing UX (Content Engine)

Borrow for public surfaces only:

- Outcome-first hero with segment selector (investor/broker/advisor).
- Scannable callout boxes instead of wall-of-text reports.
- Soft then hard CTA ladder: preview → save report → upload docs → export.
- Mid-article and progressive capture points.
- Gated PDF/export with consent screen (UI only until send stack proven).

Do **not** borrow: exit-intent popups, email nurture sequences, CRM auto-sync, Medium/LinkedIn syndication of user-derived content.

## Report UX

Valuation reports should show assumptions, comp basis, evidence appendix, confidence language, review state, and export/share gates. White-label presentation must not hide source limitations or permission boundaries.

Borrow CRE BOV patterns:

- Per-section approve before export.
- Export disabled until all required sections approved.
- SHA-256 or receipt reference after export.

## Mobile Layout

- Sticky soft CTA on comparison and property pages.
- Swipe-friendly comparison on small screens.
- Collapsible evidence panels.
- CRE CoreMobileShell is operator-focused; Sophex mobile should prioritize search, upload, report preview, and account.

## Accessibility

- Skip link to main content.
- Provenance via click/tap, not hover-only.
- Stub/non-production banners use `role="status"`.
- Table sort and export controls need text labels.

## Non-Production Surfaces

MVP0 mock pages must use a visible stub banner (CRE `NonProductionReportingBanner` pattern) so previews are never mistaken for production reporting.

## Fabricator Vs Sophex Shell (Provisional)

| Surface | Role | Sophex posture |
| --- | --- | --- |
| **Public Sophex shell** | Landing, search, upload, report preview, contribution | Lightweight; no operator cockpit |
| **Authenticated workspace** | Reports, uploads, account, privacy | Minimal header; no mission control |
| **Fabricator mission control** | Operator workflow visibility, run logs, agent orchestration | **Reference only** — do not copy into public Sophex |
| **Fabricator ops hub** | Internal monitoring stubs | Not Sophex MVP0 default |

### Progress / Status / Review Patterns To Borrow Conceptually

- User-safe **JobStatusProjection** phase timelines (uploaded → extracting → reviewing → ready).
- Blocked/failed states with sanitized messages — no worker names or queue IDs.
- HITL review queue for operators — separate from public contributor UI.
- AnalysisResponse-style report preview with warnings and `reviewRequired` badge.

### Do Not Copy Into Public Sophex

- Fabricator mission control HTML/templates.
- Raw run log panes, SSE debug streams, or agent orchestration dashboards.
- Simulated progress bars untied to real phases.
- Internal operator cockpit chrome as public navigation.
