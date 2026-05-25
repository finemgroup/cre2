# Open Questions

- Should Sophex remain a separate repo, become an app package later, or stay a planning-only project for now?
- What is the initial market or geography?
- Which public records provider should seed property baseline data?
- What are the terms for free contributor data?
- Which user-submitted values may become public, shared, anonymized, or aggregated?
- What boundaries apply to paid/private data?
- What report formats are required first: web, PDF, spreadsheet, API, or white-label?
- When should CRE API contract design begin?
- How should identity, organizations, teams, and source ownership work?
- What white-label requirements matter for brokers, partners, or enterprise customers?
- Which data can be aggregated without exposing private facts?
- What source types require mandatory HITL review?
- What confidence threshold is needed before an observation can affect a public projection?
- What deletion, revocation, or correction rights should source owners have?
- Which marketplace actions require operator approval?
- What is the approved GitHub remote URL for this separate Sophex project?
- What legal position will Sophex take on contributed leases, rent rolls, appraisals, mortgages, and contracts?
- Which valuation model details can be disclosed in reports without exposing proprietary algorithms?
- Does the free tier require public contribution, and can paid users keep uploaded data private by default?
- Which GIS, traffic, title, and public-record providers are acceptable for the initial property baseline?
- Will Sophex consume CRE APIs, shared packages, or mocked contracts in MVP0?
- What is the first MVP: public upload/report, comp comparison, property page, or valuation model demo?
- Are free-user uploads automatically public, or only extracted facts after terms and review?
- Can users upload leases, rent rolls, appraisals, mortgages, or contracts they do not own?
- What data can Sophex show publicly from CRE Platform?
- What data must never cross from CRE internal workflows into Sophex?
- Who owns moderation and review of public contributions?
- What field-level visibility is required for MVP0 versus later phases?
- What claims can be made about appraisal accuracy or prediction quality?
- What is the cost policy for scanned documents?
- Should user contributions feed model training, and under what consent?
- What export/share actions require consent and audit?
- Which CRE schema or evidence contract wave must land before Sophex can use real data?
- Which public pages may be indexed first under SEO/GEO strategy?
- **What data rights support public baseline pages** (GIS, records, aggregates) before indexing?
- **What does free tier contribute publicly vs keep private** by default?
- **What are gated export terms** (consent copy, audit, section eligibility)?
- **What is white-label broker report scope** (branding, evidence appendix, permission boundaries)?
- What minimum consent copy is required for forms, uploads, and gated exports?
- Can engagement scoring be used internally before outbound sales automation is allowed?
- Which syndication channels are permitted for operator-authored vs user-derived content?
- Which P51/CRE motion primitives belong in Sophex's slimmer public subset versus authenticated review/report workstations?
- Is command palette in scope for MVP0 or post-MVP power-user feature?
- What stub/mock labeling standard should MVP0 clickable prototypes use?
- Which CRE UX components should be reimplemented first: provenance cell, export gate, or comparison dashboard?
- Should Content Engine reference files be committed to Sophex Git, or remain external with only provisional harvest MD in `docs/`?
- **Which authoritative CRE concepts should become first real Sophex contracts: DocumentEvidence, SourceObservation, CompCandidate, ReportArtifact, or AuditReceipt?**
- **Which clean-master UX pattern should anchor the first MVP0 prototype: upload intake, evidence review drawer, comp comparison, or report export gate?**
- **Which proof/status labels should ship in public MVP0 versus operator-only moderation?**
- **Should command palette remain post-MVP only, or appear in an authenticated operator prototype behind strict permission filtering?**
- **Which CRE provider-restricted/output-guard concepts map to Sophex public reports before any data provider contract exists?**
- **What is the unified external job ID contract between Sophex JobStatusProjection and future worker/queue implementations?**
- **What is the HITL timeout policy when review decisions are pending (escalate vs block vs auto-hold)?**
- **What is the scan/OCR cost policy for contributors (free tier limits, paid unlock, operator approval)?**
- **Where is the exact public vs operator UI boundary for progress, receipts, and moderation queues?**
- **How should source confidence label calibration work across public baseline, user submission, and model-inferred values?**
- **Should Sophex keep Fabricator-style review decisions as recommend/reject/hold, or add separate accepted-public/private states only in the promotion authority layer?**
- **What audit receipt fields can be safely exposed to public contributors versus operator-only review screens?**
- **When should P51 animation doctrine be reconciled against a clean authoritative CRE checkout before implementation?**
- **Should Sophex define one canonical reduced-motion hook/source before any clickable prototype work?**
- **When should the provisional CRE underwriting annex be re-harvested from a clean authoritative checkout before any valuation/runtime/schema work?**
- **Which underwriting readiness gates are MVP0-visible versus authenticated-workstation-only: assumptions, evidence, scenarios, review, export, or publication?**
- **What is the first approved `ValuationVersion`/`EvidenceSnapshot` contract shape for public reports and private workbench exports?**
- **Which scenario/sensitivity outputs can be shown publicly as advisory without legal/appraisal overclaim risk?**
- **Which GIS/spatial providers, licenses, and source-rights policies can support public property maps, comp maps, and trade-area reports?**
- **What precision labels are required for public map claims: parcel, approximate centroid, inferred region, provider polygon, sample/mock, or legal boundary unavailable?**
- **What map accessibility fallback is mandatory before a public map can become a core interaction rather than decorative context?**
- **What map layer and geometry payload budgets apply before real KML/polygon layers can ship?**
- **Which spatial observations require HITL review before they can influence comps, reports, exports, or indexable public pages?**

## Converted To Decision Packets

The following open questions now have recommended MVP stances documented for future approval:

- Free contributor data, public/private defaults, attribution, revocation, and model training: `CONTRIBUTION_TERMS_DECISION_PACKET.md`.
- Upload file allowlist, byte access, hash identity, retention, scanning, and OCR sidecar boundaries: `FILE_SAFETY_AND_RETENTION_PLAN.md`.
- HITL timeout, promotion authority, queue/job boundaries, and review receipt requirements: `REVIEW_AUTHORITY_AND_HITL_POLICY.md`.
- Public indexing eligibility, JSON-LD boundaries, sitemap/robots exclusions, and revocation removal: `SEO_INDEXING_GATE_PLAN.md`.
- Privacy requests, evidence revocation, export takedown, security incident triage, and launch stop conditions: `INCIDENT_RESPONSE_AND_PRIVACY_RUNBOOKS.md`.
- Spatial provider/source-rights, retention/cache, export/share, precision labels, and indexable map claims: `SPATIAL_SOURCE_RIGHTS_DECISION_PACKET.md`.

These packets are recommendations, not final approvals. Runtime, schema, deploy, provider, queue, and outbound work still require explicit operator approval in the correct lane.
