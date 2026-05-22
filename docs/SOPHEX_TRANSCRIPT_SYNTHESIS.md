# Sophex Transcript Synthesis

Source: conversation transcript supplied in Cursor chat on 2026-05-22.

This note preserves the product, boundary, evidence, and implementation-gating ideas from the transcript. It is documentation only and does not authorize runtime code, schema, migrations, provider sends, queues, deploys, or production service access.

## Core Thesis

Sophex is a public-facing CRE intelligence and valuation product built around property evidence, user contribution, and permissioned field resolution. The product starts with public property records, allows users to contribute first-party documents and comps, and produces valuation/reporting outputs in exchange for data contribution.

The transcript repeatedly frames property facts as evidence-backed observations rather than mutable global fields. A property field like acreage should not be treated as one universal value. It should resolve from a change log or observation ledger according to what the current actor is allowed to see.

## Permissioned Change Log Model

The acreage example is the clearest system primitive:

- Public GIS record says acreage is `3.00`.
- User submissions later say `3.01`, `3.01`, `3.09`, and `3.90`.
- Publicly, Sophex may still display `3.00` because that is the public GIS baseline.
- A source owner or private user may see their submitted value.
- Internal operators may see the observation history and source lineage.
- Other users should not automatically see each other's private values.

The field displayed in the UI is effectively a lookup: latest value this actor has permission to see. This must be enforced in future queries/API contracts, not only in UI rendering.

## Public Baseline Versus User Evidence

Public property records are not proprietary by default. Public baseline data may include:

- County and title/public records.
- GIS acreage and parcel data.
- Zoning.
- Traffic counts.
- Demographics.
- Distance to highways, ports, hubs, and other valuation features.

User-submitted evidence may include:

- Deeds.
- Leases.
- Mortgages.
- Rent rolls.
- Contracts.
- Appraisals.
- Listings.
- Actual trade records.
- Submitted comps and corrections.

These user inputs become observations or source evidence. They do not automatically overwrite public truth.

## Wiki-Like Contribution Product

The transcript describes a public-facing comps database that behaves like a wiki, but with permission controls. Users can submit comps and clean up data without exposing every submitted fact to everyone else.

The intended exchange is:

1. A user gets free or low-cost valuation/reporting access.
2. The user contributes source documents, comps, or verified facts.
3. Sophex extracts evidence and builds richer property intelligence.
4. Public, private, and paid views resolve differently according to permissions.

The free tier may require public contribution. A future paid tier may allow users to keep private data while still accessing public data and storing private analyses.

## Document Ingestion Paths

The transcript distinguishes sharply between clean digital PDFs and scanned documents.

Clean digital PDFs are the cheap path. The preferred workflow is a user printing or exporting to Adobe PDF rather than scanning. Clean PDFs are easier to vectorize, chunk, extract, and review.

Scanned leases and old documents may be very valuable, but they require a more expensive OCR and extraction path. They should carry different cost assumptions, lower initial confidence, and more human review.

## Valuation And Reporting Product

The product surface is a valuation/reporting tool:

1. User logs in and selects a property or uploads documents.
2. Sophex links public baseline data and user-provided evidence.
3. Sophex offers comp selection and model suggestions.
4. User receives an analysis or valuation report.
5. Report output can be white-labeled with the user's logo, name, or face.
6. Export/share behavior is gated by permissions and contribution terms.

The transcript suggests reports should be source-backed and explainable enough for trust, while not necessarily exposing proprietary model internals. A report may disclose top drivers and predictive confidence without revealing the full algorithm.

## Valuation Feature Ideas

The transcript names potential valuation variables and model factors:

- Distance to interstate.
- Ceiling heights.
- Property age.
- Demographics.
- Distance to hubs and ports.
- Traffic counts.
- GIS attributes.
- Zoning context.
- Comparable sale or lease evidence.
- Industrial subtype, such as big-box industrial or flex industrial.

The stated ambition is an evidence-rich property profile or "future fingerprint" of a property that could support valuation, title verification, liquidity, and eventually tokenization-related concepts.

## CRE Platform And Fabricator Relationship

The transcript surfaces uncertainty about how Sophex relates to the CRE tool and Finem Fabricator.

The boundary decision for this setup packet is:

- CRE Platform remains the governed internal substrate and should not be casually forked.
- Finem Fabricator can inspire workflow, vectorization, agent, and report-generation patterns.
- Sophex should be a separate public-facing trust boundary that later integrates through approved APIs/contracts.

The transcript reinforces the need to decide which pieces belong in CRE, which belong in Fabricator-style orchestration, and which belong in Sophex as a public marketplace product.

## Future Agent Ideas

The transcript includes adjacent real estate-specific agent concepts:

- Rezoning likelihood agent.
- Zoning minutes and news article collector.
- Zoning summary table generator.
- Ingestion classifier.
- Evidence extractor.
- Valuation model recommender.

These are future-gated ideas only. They require product spec, data terms, source review, and implementation approval before runtime work.

## Legal And Privacy Risks

The transcript explicitly raises uncertainty around who can see another party's lease or private document. That legal question is not resolved here.

Before implementation or marketplace launch, Sophex needs terms and policy for:

- Public contribution versus private upload.
- Lease, rent roll, appraisal, mortgage, and contract visibility.
- Source-owner rights.
- Anonymization and aggregation.
- Whether free use requires public contribution.
- Whether paid tiers allow private storage and private report generation.
- How private facts are prevented from leaking into public comps.

## Setup-Phase Non-Authorization

This transcript should inform product architecture and documentation. It does not authorize:

- Schema creation.
- Neon or Prisma migration work.
- Vectorization runtime.
- Database ingestion.
- Provider sends or marketing automation.
- Queue launch.
- Production CRE or Fabricator integration.
- Public marketplace launch.

All implementation should remain future-gated behind a product spec, legal/privacy decisions, approved data contracts, and explicit operator authorization.
