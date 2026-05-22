# Sophex Decisions

This file is the initial ADR-style decision log for the Sophex setup phase.

## ADR-0001: Sophex Is A Separate Product And Trust Boundary

- Status: Accepted
- Date: 2026-05-22
- Decision: Sophex is a public-facing CRE intelligence marketplace with an external user trust boundary.
- Consequence: Sophex must not be treated as a casual extension of internal CRE production workflows.

## ADR-0002: CRE Platform Remains The Governed Substrate

- Status: Accepted
- Date: 2026-05-22
- Decision: CRE Platform remains the governed internal substrate for canonical documents, source observations, comp intelligence, audit, idempotency, and correlation.
- Consequence: Sophex should later align through approved APIs and contracts, not direct database coupling or copy-paste migrations.

## ADR-0003: Finem Fabricator Is Not The Data Owner

- Status: Accepted
- Date: 2026-05-22
- Decision: Finem Fabricator can provide workflow, agent, report-generation, and HITL patterns, but it is not the canonical Sophex or CRE data owner.
- Consequence: Fabricator-inspired agents must respect Sophex permissions and CRE evidence contracts.

## ADR-0004: Field Values Resolve From Permissioned Observations

- Status: Accepted
- Date: 2026-05-22
- Decision: Displayed property field values resolve from the latest observation/change-log entry that the actor has permission to see.
- Consequence: Permissions must be enforced at the query/API layer, not only in UI rendering.

## ADR-0005: Uploaded Documents Are Evidence

- Status: Accepted
- Date: 2026-05-22
- Decision: Uploaded PDFs, leases, rent rolls, deeds, mortgages, contracts, appraisals, listings, and trade records become evidence and source material, not automatic canonical truth.
- Consequence: Extracted values require source, actor, timestamp, confidence, visibility, and lineage.

## ADR-0006: No Schema Or Runtime In Setup Phase

- Status: Accepted
- Date: 2026-05-22
- Decision: This setup packet authorizes documentation and project rules only.
- Consequence: Runtime implementation, schema design syntax, migrations, provider sends, queues, and deploys are future-gated.

## ADR-0007: No Worktrees

- Status: Accepted
- Date: 2026-05-22
- Decision: This Sophex setup lane does not use worktrees.
- Consequence: Branch hygiene is handled with a single docs branch and explicit path staging.

## ADR-0008: Local Git Bootstrap Uses Master

- Status: Accepted
- Date: 2026-05-22
- Decision: Local Git is initialized on `master` for the initial project shell bootstrap.
- Consequence: Remote/default branch policy can change later only after a Sophex remote URL and operator approval are provided.

## ADR-0009: Sophex Inherits Doctrine, Not Code

- Status: Accepted
- Date: 2026-05-22
- Decision: Sophex should inherit evidence, observation, permission, audit, UX, and workflow doctrine from CRE Platform and Finem Fabricator, not production code or data by copy-paste.
- Consequence: Cross-project alignment must happen through future contracts, APIs, mock data, or approved read models.

## ADR-0010: Chunks And Embeddings Are Sidecars

- Status: Accepted
- Date: 2026-05-22
- Decision: Document metadata and evidence identity are business records; chunks and embeddings are derived retrieval sidecars.
- Consequence: Retrieval material must not become canonical truth or bypass document/evidence permissions.

## ADR-0011: Authority Labels Are Product Requirements

- Status: Accepted
- Date: 2026-05-22
- Decision: Sophex must show authority labels for public baseline, private, reviewed, unreviewed, stale, disputed, blocked, promoted, and model-inferred values.
- Consequence: Future UX and APIs must carry enough review, source, freshness, and visibility context to explain why a value is shown.

## ADR-0012: Retrieval Must Be Permission-Filtered At Every Hop

- Status: Accepted
- Date: 2026-05-22
- Decision: Search, source panels, report generation, export, future APIs, and model inputs must respect actor, org, source-use, review, freshness, and public/private boundaries.
- Consequence: UI hiding is not a security model; query/API filtering is required before implementation.

## ADR-0013: Schema Concepts Remain Future-Gated

- Status: Accepted
- Date: 2026-05-22
- Decision: Conceptual entities and invariants may be documented, but schema, migrations, generated-client edits, and database writes remain unauthorized.
- Consequence: `docs/FUTURE_SCHEMA_CONCEPTS.md` is a contract-thinking artifact only.

## ADR-0014: CRE Platform Is Primary UX And Design-System Reference

- Status: Accepted
- Date: 2026-05-22
- Decision: CRE `apps/core` is the primary sister-project reference for shell patterns, provenance UI, motion tokens, report export gates, and trust visualization — inherited as doctrine, not copied code.
- Consequence: Sophex MVP0 should reimplement minimal patterns against Sophex contracts; do not import CRE operator shell or runtime packages.

## ADR-0015: Content Engine Patterns Apply To Public Surfaces Only

- Status: Accepted
- Date: 2026-05-22
- Decision: Content Engine interactive marketing, SEO/GEO, comparison, and gated-export patterns may inform Sophex public acquisition surfaces, but must not drive syndication or indexing of user-contributed private observations.
- Consequence: Operator-authored public content and user-contribution marketplace remain separate lanes with different consent rules.

## ADR-0016: Send, Nurture, And Syndication Automation Remain Disabled

- Status: Accepted
- Date: 2026-05-22
- Decision: Email nurture, CRM sync, provider sends, retargeting, and third-party syndication remain unauthorized until provider, queue, worker, consent, suppression, unsubscribe, idempotency, audit, and operator approval are proven.
- Consequence: MVP0 may mock capture and export gates only; no outbound automation in setup or early prototype phases.

## ADR-0017: MVP0 Preview Surfaces Require Non-Production Labeling

- Status: Accepted
- Date: 2026-05-22
- Decision: Mock-data previews, sample comparisons, and stub reporting surfaces must display explicit non-production/stub labeling.
- Consequence: Borrow CRE `NonProductionReportingBanner` pattern conceptually for all MVP0 clickable prototypes.

## ADR-0018: Export Actions Require Review Gate And Audit Receipt

- Status: Accepted
- Date: 2026-05-22
- Decision: Report export/download/share requires section review completion, consent where applicable, and an audit receipt or content hash reference.
- Consequence: Export UI may be prototyped disabled-first; no live export pipeline in setup phase.

## ADR-0019: Fabricator Job Status Is Projection Not Truth

- Status: Accepted
- Date: 2026-05-22
- Decision: Finem Fabricator workflow and queue completion signals are user-safe status projections only; they do not promote observations, comps, or reports to canonical truth.
- Consequence: HITL review and permission filters remain mandatory after any agent or workflow completion event.

## ADR-0020: Fabricator Supplies Workflow And Agent Patterns Only

- Status: Accepted
- Date: 2026-05-22
- Decision: Finem Fabricator informs Sophex workflow, HITL, evidence envelope, and control-plane doctrine only; it is not the Sophex or CRE data owner and is not a runtime dependency in setup phase.
- Consequence: No Fabricator queue/worker coupling, remotes, or operator cockpits in Sophex MVP0; provisional harvest from dirty Fabricator tree is directional only.

## ADR-0021: Public Sophex Uses JobStatusProjection Not Raw Run Logs

- Status: Accepted
- Date: 2026-05-22
- Decision: Contributor-facing progress UI must use sanitized JobStatusProjection phase timelines; raw Fabricator run logs, queue names, worker IDs, SSE debug streams, and receipt internals are operator-only.
- Consequence: No simulated progress; no raw log panes in public UI; SSE/streaming patterns remain future-gated and operator-scoped until reviewed.

## ADR-0022: Report Generation Must Carry Warnings Citations And ReviewRequired

- Status: Accepted
- Date: 2026-05-22
- Decision: Valuation/report outputs inspired by Fabricator Analysis OS must include confidence, warnings, citations, and reviewRequired semantics; no headline valuation without evidence and review posture.
- Consequence: ReportGenerationRun artifacts are candidates until HITL and export gates clear; white-label output cannot hide warnings or permission limits.

## ADR-0023: Content Engine Is Product UX Reference Only Not Runtime Authority

- Status: Accepted
- Date: 2026-05-22
- Decision: Content Engine reference material in the untracked `Content Engine/` folder informs Sophex product strategy, UX doctrine, and marketplace concepts only. It is not an authoritative runtime repository and does not authorize SQL, n8n, CRM, send automation, or analytics implementation in Sophex setup.
- Consequence: See [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](docs/CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md); integrated doctrine lives in topic docs per harvest hierarchy.

## ADR-0024: Sophex Reports Are Interactive Evidence-First Not Static Essay PDF-First

- Status: Accepted
- Date: 2026-05-22
- Decision: Sophex valuation and reporting surfaces should prioritize interactive evidence-first UX (comparison, heat map, drill-down, citations) over static long-form essay or PDF-first delivery.
- Consequence: MVP0 clickable concepts should prototype comparison dashboard, heat map, and report preview; PDF/export remains gated and audited.

## ADR-0025: Gated Export Is Permissioned Audited Value Exchange Not Simple Lead Form

- Status: Accepted
- Date: 2026-05-22
- Decision: Gated PDF/export/share flows are permissioned value exchanges requiring consent, section review, and audit trail — not generic lead-capture forms.
- Consequence: Export UI may be prototyped disabled-first; contribution exchange (upload → unlock depth) requires explicit terms before capture.

## ADR-0026: Public SEO GEO Surfaces Require Public Baseline Or Aggregates Only

- Status: Accepted
- Date: 2026-05-22
- Decision: Public SEO/GEO property and market pages may use public baseline data or approved aggregated/anonymized statistics only until visibility rules, review states, and source-use terms exist for user-contributed facts.
- Consequence: No indexing or syndication of user-contributed observations; operator-authored public content remains a separate lane from contribution marketplace data.

## ADR-0027: Authoritative CRE Clean-Master Harvest Supersedes Stale Provisional Packet

- Status: Accepted
- Date: 2026-05-22
- Decision: The CRE harvest from clean clone `C:\Projects\cre-platform-master-clean` on `master` at `5300e7e5510e27d5ba505bfba8bec39990f68f7c` supersedes the earlier CRE provisional packet generated from stale/dirty branch `agent/03-operating-lens-navigation`.
- Consequence: `CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md` is the current CRE source archive for Sophex docs doctrine; provisional CRE packets remain archive-only and must not drive implementation.

## ADR-0028: Authoritative UX Motion Clean-Master Validation Supersedes Stale UX Provisional Packet

- Status: Accepted
- Date: 2026-05-22
- Decision: The UX/Motion harvest from clean CRE `apps/core` at `C:\Projects\cre-platform-master-clean\apps\core` on `master` at `5300e7e5510e27d5ba505bfba8bec39990f68f7c` supersedes the stale UX/Motion provisional packet from `agent/03-operating-lens-navigation`.
- Consequence: `UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md` is the current UX/motion source archive for Sophex docs doctrine; stale UX/Motion packets remain archive-only.
