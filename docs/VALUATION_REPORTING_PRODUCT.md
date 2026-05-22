# Valuation Reporting Product

Sophex should use valuation and reporting as the immediate user-facing value of its evidence model. Reports are not just internal enrichment; they are the product surface that makes contribution worthwhile.

## User Journey

1. User selects a property or uploads source documents.
2. System extracts and links evidence to property fields and report sections.
3. User receives a valuation/reporting output with cited evidence.
4. User can contribute, correct, or verify facts.
5. User can save, export, or share the report according to permissions.

## Report Requirements

- Preserve auditability from report claim to source observation.
- Distinguish public baseline facts from private or user-submitted observations.
- Show confidence and review posture where appropriate.
- Respect field-level visibility for every viewer.
- Avoid leaking private source facts into public report templates.
- Support future white-label output where partner branding does not weaken source or permission controls.
- Include assumptions, comp basis, source freshness, confidence language, and review state.
- Gate export/share actions according to actor, source-use policy, and report visibility.
- Avoid claims such as "better than an appraisal" unless validated and legally approved.

## Lead-Gen And Content Engine Connections

The Content Engine reference materials point toward interactive reports, comparison tools, heat maps, market research pages, SEO/GEO-friendly content, gated PDF exports, and contribution flywheels.

Sophex may later use those patterns for lead generation and user acquisition on **operator-authored public surfaces**.

Borrow conceptually:

- Interactive comparison dashboard and regional heat map (mock data in MVP0).
- Outcome-first hero, segment selector, scannable callout layout.
- Soft-then-hard CTA ladder: preview → save → upload → export.
- Gated export dialog with section toggles (charts, map, table, statistics).
- Progressive profiling forms (minimal fields first).

This setup packet does not authorize marketing automation, email sends, CRM sync, syndication automation, provider actions, analytics wiring, report-generation runtime, n8n workflows, or deployment.

## Fabricator AnalysisResponse-Style Output (Provisional)

From Fabricator Analysis OS doctrine (conceptual only — see [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)):

Future Sophex report artifacts should support structured output comparable to AnalysisResponse:

| Field | Purpose |
| --- | --- |
| **sections** | Typed report sections with permitted evidence links |
| **confidence** | Evidence coverage and agreement — not model bravado |
| **warnings** | Stale comps, scan quality, missing data, permission limits |
| **citations** | Permitted source references only |
| **reviewRequired** | HITL gate before export or public surfacing |

### Rules

- **No headline valuation** without visible evidence, citations, and review state.
- **White-label report artifact** may carry partner branding but must retain warnings, citations, and permission boundaries.
- **Export gates** remain disabled when `reviewRequired` is true or consent/audit preconditions fail.
- Report generator outputs are **`ReportGenerationRun` candidates** until HITL and export gates clear.

## Report Section Review And Export Gate

From CRE BOV patterns (doctrine):

- Reports decompose into sections requiring explicit approve/review.
- Export remains disabled until required sections are approved and consent captured.
- Export completion should surface an audit hash or receipt reference.
- White-label output must retain evidence appendix and permission boundaries.

## Interactive Preview Surfaces

Public market and property pages may include:

- Partial valuation preview with top drivers and confidence band.
- Comp comparison preview with permission-filtered or sample comps.
- Save-report intent that stops at account/consent gate in MVP0.

All preview surfaces require non-production/stub labeling until live data and legal terms exist.

## Evidence-First Report UX

Reports should be polished but not source-blind. Each important claim should be traceable to a public baseline, permitted private observation, comp candidate, reviewed comp set, model assumption, or source document summary. Private values must not leak through a white-labeled report, source appendix, export, share link, or generated summary.

Model explanations may disclose top drivers, confidence ranges, and sensitivity concepts without exposing proprietary model internals.

## Future Output Possibilities

- Property valuation snapshot.
- Comp set report.
- Lease/rent-roll extraction summary.
- Investment memo.
- Market comparison report.
- Partner or broker white-label report.
- Exportable PDF with evidence appendix.
