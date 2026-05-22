# Frontend UX Inheritance

Sophex should inherit UX doctrine from CRE Platform and Finem Fabricator without copying internal screens or runtime code.

## Shell And Workstations

Use a simple public shell for navigation, account state, search, upload, reports, contributions, and privacy. Keep workstations focused:

- Property intelligence page.
- Upload/intake workspace.
- Evidence and observation review view.
- Comp comparison workspace.
- Valuation/reporting workspace.
- Account, organization, and privacy settings.

Do not duplicate shell chrome inside each workflow.

## Evidence-First UI

Every important value should support a source/evidence panel. Depending on actor permissions, the panel may show:

- Public record source.
- User-uploaded source document.
- Source type and date.
- Review state.
- Confidence/freshness label.
- Visibility class.
- Why the actor is allowed to see the value.

Unauthorized viewers must not see private actor identity, private values, or private source documents.

## Authority Labels

Sophex UI should visibly label values as:

- Public baseline.
- User-submitted.
- Organization-private.
- Shared-with-permission.
- Reviewed.
- Unreviewed.
- Stale.
- Disputed.
- Blocked.
- Promoted.
- Model-inferred.

Authority labels prevent public records, private observations, AI extraction, and reviewed facts from looking equally authoritative.

## Change Log UI

Field-level change logs should explain conflicting observations without leaking private data. For example, a public viewer may see that acreage is public GIS baseline, while an internal reviewer sees the full observation history and source lineage.

## Upload Intake UX

The upload flow should explain:

- Clean digital PDFs are preferred.
- Scanned documents may cost more and require review.
- User must choose or accept source-use and visibility terms.
- Extraction is candidate evidence, not automatic truth.
- Some documents may be blocked until review.

## Comparison And Map UX

Comparison surfaces should distinguish:

- User-uploaded comps.
- Public/platform comps.
- Private organization comps.
- Excluded comps.
- Stale or disputed comps.

Map and GIS overlays should support parcel, comp radius, zoning, traffic, demographic, and proximity views, but must not present GIS-derived results as legal/title conclusions.

## Report UX

Valuation reports should show assumptions, comp basis, evidence appendix, confidence language, review state, and export/share gates. White-label presentation must not hide source limitations or permission boundaries.
