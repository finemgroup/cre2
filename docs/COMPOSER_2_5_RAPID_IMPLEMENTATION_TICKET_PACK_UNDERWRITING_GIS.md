# Composer 2.5 Rapid Implementation Ticket Pack: Underwriting And GIS

This packet expands the provisional CRE underwriting and ICSC Map Recovery harvest backlog into Composer-ready implementation tickets.
It is designed for rapid **mock-only Sophex prototype and documentation work**.

## Execution Boundary

Allowed:

- `prototype/` mock-only TypeScript, React, CSS, Storybook, and tests.
- `docs/` contract, UX, decision, and checklist updates.
- Deterministic fixtures and pure functions under existing mock contract/runtime patterns.

Forbidden:

- Prisma, SQL, migrations, generated clients, database writes, or schema changes.
- Deploys, provider calls, queue workers, production services, or CRE/Fabricator runtime imports.
- Real KML/GeoJSON assets, SharePoint links, provider keys, `.env` reads, or external GIS services.
- Excel/Python underwriting runtime, autonomous approve/reject flows, or appraisal-superiority claims.

Primary references:

- [CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md](CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md)
- [ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)
- [SOPHEX_CONCEPTUAL_CONTRACTS.md](SOPHEX_CONCEPTUAL_CONTRACTS.md)
- [EVIDENCE_PERMISSION_CONTRACTS.md](EVIDENCE_PERMISSION_CONTRACTS.md)
- [FRONTEND_UX_INHERITANCE.md](FRONTEND_UX_INHERITANCE.md)
- [VALUATION_REPORTING_PRODUCT.md](VALUATION_REPORTING_PRODUCT.md)

## Recommended Build Order

| Wave | Tickets | Why first |
| --- | --- | --- |
| Wave 1: Contract spine | `SOPHEX-CONTRACT-GATES`, `SOPHEX-CONTRACT-VALUATION-VERSION`, `SOPHEX-GIS-MANIFEST`, `SOPHEX-GIS-VERIFICATION`, `SOPHEX-GIS-TRADE-AREA` | Gives UI tickets typed mock inputs and fail-closed policy behavior. |
| Wave 2: Report/export governance | `SOPHEX-CONTRACT-EXPORT-MANIFEST`, `SOPHEX-PROVENANCE-LABELS`, `SOPHEX-TIER-HITL` | Turns underwriting doctrine into visible, testable report/export state. |
| Wave 3: UX surfaces | `SOPHEX-UX-READINESS`, `SOPHEX-GIS-PROVENANCE`, `SOPHEX-GIS-A11Y` | Adds visible product value after the mock contracts exist. |
| Wave 4: Quality gates and docs | `SOPHEX-GIS-PERFORMANCE`, `SOPHEX-GIS-SOURCE-RIGHTS`, `SOPHEX-HARVEST-REBASE`, `SOPHEX-GIS-HARVEST-REBASE` | Locks future runtime boundaries and prevents accidental overreach. |

## Definition Of Done For Every Ticket

- Uses existing Sophex mock contract/runtime patterns where possible.
- Adds or updates focused tests for the behavior introduced.
- Keeps all public copy proof-honest: advisory, source pending, review required, blocked, approved private-use, approved public projection.
- Adds no schema, provider, queue, deploy, or production data dependency.
- Does not copy sister-project source code or assets.
- Updates docs when a new concept becomes a prototype convention.

## Ticket SOPHEX-CONTRACT-GATES

**Objective:** Add a mock `WorkflowGate` contract and evaluator for assumptions, evidence, review, export, and map/spatial readiness.

**Likely files:**

- `prototype/src/lib/contracts/`
- `prototype/src/test/`
- `docs/SOPHEX_CONCEPTUAL_CONTRACTS.md`
- `docs/EVIDENCE_PERMISSION_CONTRACTS.md`

**Implementation notes:**

- Define gate severity: `info`, `warn`, `block`.
- Define gate status: `pending`, `passed`, `warning`, `blocked`.
- Gate families should include `assumption`, `evidence`, `scenario`, `review`, `export`, `spatial-source`, `source-rights`.
- Add a pure evaluator that accepts a mock valuation/report context and returns ordered gates plus a safe next action.
- Missing gate inputs must fail closed for export/public projection.

**Acceptance criteria:**

- Unit tests cover all severities and at least one missing-input fail-closed case.
- Export/public projection is blocked if a required `block` gate is unresolved.
- Safe blocker copy never leaks private values or source names to public actors.

**Out of scope:** Real workflow engines, queues, database state, or schema definitions.

## Ticket SOPHEX-CONTRACT-VALUATION-VERSION

**Objective:** Add a mock `ValuationVersion` contract that snapshots assumptions, scenario refs, source bundle refs, review state, and readiness state.

**Likely files:**

- `prototype/src/lib/contracts/`
- `prototype/src/lib/runtime/report-flow.ts`
- `prototype/src/lib/runtime/studio-workspace.ts`
- `prototype/src/test/`
- `docs/VALUATION_REPORTING_PRODUCT.md`

**Implementation notes:**

- Keep the implementation as a pure TypeScript model with fixtures.
- Include actor context, property/report ref, assumption set, scenario refs, evidence snapshot ref, review state, export policy, and receipt refs.
- Report adapters should return a current mock valuation version where relevant.
- Approved/exported versions should not mutate when source observations change in the fixture.

**Acceptance criteria:**

- Tests prove version identity and as-of timestamps remain stable across repeated reads.
- Public report views expose only redacted/safe valuation metadata.
- Studio/internal views can display richer mock state only through actor-gated adapters.

**Out of scope:** Real valuation engine, Excel/Python calculation runtime, or proprietary model internals.

## Ticket SOPHEX-CONTRACT-EXPORT-MANIFEST

**Objective:** Add a mock approved-only export manifest tied to evidence snapshots, section readiness, checksum concepts, and governed receipts.

**Likely files:**

- `prototype/src/lib/contracts/receipts.ts`
- `prototype/src/lib/runtime/export-policy.ts`
- `prototype/src/lib/runtime/report-flow.ts`
- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/pages/studio/ReportRoutes.tsx`
- `prototype/src/test/export-policy.test.ts`
- `prototype/src/test/export-idempotency.test.ts`

**Implementation notes:**

- Extend mock export policy results with an `exportManifest` only when eligible.
- Manifest fields should include included section ids, redacted evidence refs, excluded reason counts, checksum placeholder, actor scope, and receipt ref.
- Reuse existing idempotent receipt behavior.
- Preview scope can show a draft manifest; download/share scope requires all blocking gates to pass.

**Acceptance criteria:**

- Tests cover blocked export, preview manifest, approved manifest, and idempotent replay.
- UI shows manifest details without raw private source names.
- Export copy says "Generate governed receipt" or equivalent proof-honest language, not "final production export."

**Out of scope:** PDF/ZIP generation, file storage, real hashing of bytes, provider delivery.

## Ticket SOPHEX-PROVENANCE-LABELS

**Objective:** Expand provenance/authority labels for assumptions, source family, as-of date, freshness, confidence, spatial precision, and review posture.

**Likely files:**

- `prototype/src/components/provenance/`
- `prototype/src/components/AuthorityBadge` or equivalent existing trust UI components.
- `prototype/src/pages/PropertyPage.tsx`
- `prototype/src/pages/ReportPage.tsx`
- `prototype/src/pages/studio/ReportRoutes.tsx`
- `prototype/src/test/`
- `docs/SOPHEX_TRUST_UI_GUIDELINES.md`

**Implementation notes:**

- Keep label taxonomy compact and readable.
- Add labels for `advisory`, `source pending`, `reviewer required`, `approved private-use`, `approved public projection`, `approximate centroid`, `sample map data`, and `not legal boundary`.
- Avoid color-only semantics; labels need text.

**Acceptance criteria:**

- Tests or story coverage prove labels render for valuation/report and spatial/map contexts.
- Public routes do not display private source identity.
- Axe checks remain clean for modified pages/stories.

**Out of scope:** New design system package or copied CRE components.

## Ticket SOPHEX-TIER-HITL

**Objective:** Adapt mock tier/routing behavior to HITL review policy without auto-approval or autonomous approve/reject language.

**Likely files:**

- `prototype/src/lib/contracts/review-state.ts`
- `prototype/src/lib/runtime/review-queue.ts`
- `prototype/src/components/review/StagedImportReviewPanel.tsx`
- `prototype/src/test/review-state.test.ts`
- `prototype/src/test/review-queue.test.ts`
- `docs/REVIEW_AUTHORITY_AND_HITL_POLICY.md`

**Implementation notes:**

- Use states such as `needs_review`, `approved_private_use`, `approved_public_projection`, `held`, `blocked`.
- Machine or model output can recommend, flag, or hold; it cannot approve public projection by itself.
- Queue completion is not publication authority.

**Acceptance criteria:**

- Tests prove recommendations do not promote evidence/report output to public projection.
- Review queue UI uses HITL-safe language.
- Public routes see safe blocked/held labels without internal queue detail.

**Out of scope:** Real operator assignment, queue timeouts, or notification sends.

## Ticket SOPHEX-UX-READINESS

**Objective:** Add a prototype readiness rail for valuation/report flows from assumptions through export using mock gates and proof-honest labels.

**Likely files:**

- `prototype/src/pages/ReportPage.tsx`
- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/pages/studio/ReportRoutes.tsx`
- `prototype/src/components/`
- `prototype/src/index.css`
- `prototype/src/test/public-routes.test.tsx`
- `prototype/src/test/studio.test.tsx`

**Implementation notes:**

- Rail steps: `Assumptions`, `Evidence`, `Scenarios`, `Review`, `Export`.
- Public pages can show compact readiness summary; authenticated/studio report routes can show richer gate detail.
- Gate indicators must be text-accessible and should not imply final approval unless a gate explicitly passes.

**Acceptance criteria:**

- Public and studio report pages render readiness state from mock runtime adapters.
- Blocked/warning gates show safe next action copy.
- Keyboard and screen-reader semantics are valid.
- Existing route tests and axe checks pass.

**Out of scope:** Real calculations, live progress, or approval workflow automation.

## Ticket SOPHEX-GIS-MANIFEST

**Objective:** Define a mock `MapLayerManifest` contract and fixtures for spatial layers used by property, comp, and report surfaces.

**Likely files:**

- `prototype/src/lib/contracts/`
- `prototype/src/lib/runtime/`
- `prototype/src/test/`
- `docs/EVIDENCE_PERMISSION_CONTRACTS.md`
- `docs/SOPHEX_CONCEPTUAL_CONTRACTS.md`

**Implementation notes:**

- Manifest fields: layer id, source label, visibility class, precision class, as-of date, review state, payload size class, lazy-load policy, allowed contexts, source-rights policy.
- Include mock layers for public property centroid, sample comp radius, private trade area, aggregate demographic layer, and blocked provider layer.
- Do not include real geometry beyond tiny mock coordinates already suitable for prototype display.

**Acceptance criteria:**

- Tests prove unauthorized actors cannot access private/provider-blocked layer details.
- Runtime adapter returns only layer metadata safe for the current actor.
- Public layers are labeled sample/approximate where appropriate.

**Out of scope:** Real KML/GeoJSON ingestion, provider fetches, or spatial indexing.

## Ticket SOPHEX-GIS-PROVENANCE

**Objective:** Add spatial provenance labels to public property, comp, and report map contexts.

**Likely files:**

- `prototype/src/pages/PropertyPage.tsx`
- `prototype/src/pages/CompsPage.tsx`
- `prototype/src/pages/ReportPage.tsx`
- `prototype/src/components/provenance/`
- `prototype/src/lib/runtime/public-property.ts`
- `prototype/src/lib/runtime/public-comps.ts`
- `prototype/src/test/public-routes.test.tsx`

**Implementation notes:**

- Labels should include source, precision, freshness/as-of date, review state, and safe caveats.
- Public map copy should include `Sample map data`, `Approximate centroid`, and `Not legal boundary` where applicable.
- Map-derived report claims should point to permitted spatial evidence refs.

**Acceptance criteria:**

- Public property and comps routes display spatial provenance labels without private data.
- Report route shows map/spatial caveats when map section exists.
- Tests assert the presence of sample/approximate/not-legal-boundary labels.

**Out of scope:** Map provider SDK changes, real geometry, or legal boundary assertions.

## Ticket SOPHEX-GIS-A11Y

**Objective:** Add public map accessibility checklist and prototype list/drawer fallback pattern for map-derived facts.

**Likely files:**

- `docs/FRONTEND_UX_INHERITANCE.md`
- `docs/MOTION_AND_INTERACTION_GUIDELINES.md`
- `prototype/src/pages/PropertyPage.tsx`
- `prototype/src/pages/CompsPage.tsx`
- `prototype/src/components/`
- `prototype/src/test/public-routes.test.tsx`

**Implementation notes:**

- Every map summary should have a non-map list equivalent.
- Layer controls need text labels and keyboard reachability.
- Selected feature details must be available in a drawer or detail panel, not only by pin interaction.
- Color scales need text labels or discrete legend copy.

**Acceptance criteria:**

- Axe checks pass on public routes with map sections.
- Tests verify that visible map facts are also available in a list/detail region.
- Keyboard focus order reaches map layer controls and selected-feature details.

**Out of scope:** Full keyboard map navigation implementation for third-party map SDKs.

## Ticket SOPHEX-GIS-PERFORMANCE

**Objective:** Add map layer performance budgets and checks suitable for mock MVP0 and future real-layer work.

**Likely files:**

- `prototype/scripts/check-bundle-budget.mjs`
- `prototype/package.json`
- `.github/workflows/prototype-ci.yml`
- `docs/MOTION_AND_INTERACTION_GUIDELINES.md`
- `docs/ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md`

**Implementation notes:**

- Extend existing bundle budget language or script with map-specific budget comments/config if the current script supports it cleanly.
- Suggested future budgets: initial map route JS, layer metadata JSON, per-layer geometry payload, max visible mock features.
- For MVP0, enforce only what can be measured locally without real assets; document the rest as future gates.

**Acceptance criteria:**

- Budget check still passes for existing prototype build.
- Docs specify map-specific payload thresholds or placeholders.
- No real map assets are added.

**Out of scope:** Large geometry fixtures, tile servers, CDN, or runtime profiling.

## Ticket SOPHEX-GIS-VERIFICATION

**Objective:** Define mock coordinate/geocode verification states and attach them to spatial evidence/runtime adapters.

**Likely files:**

- `prototype/src/lib/contracts/`
- `prototype/src/lib/runtime/public-property.ts`
- `prototype/src/lib/runtime/public-comps.ts`
- `prototype/src/test/public-adapters.test.ts`
- `docs/EVIDENCE_PERMISSION_CONTRACTS.md`

**Implementation notes:**

- Verification states: `unverified`, `provider_verified`, `human_verified`, `conflict`, `sample`.
- Precision classes: `parcel`, `approximate_centroid`, `inferred_region`, `custom_polygon`, `sample_mock`.
- Public copy should never imply legal survey precision.

**Acceptance criteria:**

- Tests cover at least one verified, unverified, conflict, and sample case.
- Public adapters return safe precision labels.
- Conflicts show safe next action or review-required copy.

**Out of scope:** Geocoder integration, coordinate transforms, or actual parcel verification.

## Ticket SOPHEX-GIS-TRADE-AREA

**Objective:** Define a mock `TradeArea` abstraction for radius, drive-time, market region, and custom polygon contexts.

**Likely files:**

- `prototype/src/lib/contracts/`
- `prototype/src/lib/runtime/public-comps.ts`
- `prototype/src/lib/runtime/report-flow.ts`
- `prototype/src/test/public-adapters.test.ts`
- `docs/SOPHEX_CONCEPTUAL_CONTRACTS.md`

**Implementation notes:**

- Include method, origin ref, parameters, source label, precision class, as-of date, permitted metrics, and report eligibility.
- Fixtures should include one public sample radius, one private trade area, and one blocked provider-derived area.
- Report flow should include only eligible trade-area summaries.

**Acceptance criteria:**

- Tests prove blocked/private trade areas do not leak to public reports.
- Public report/comps views show permitted trade-area label and caveat.
- Export policy can block or redact a section if trade-area source rights fail.

**Out of scope:** Real drive-time APIs, isochrones, routing engines, or spatial calculations.

## Ticket SOPHEX-GIS-SOURCE-RIGHTS

**Objective:** Create a decision packet for spatial provider/source-rights policy before real GIS providers or assets are approved.

**Likely files:**

- `docs/SPATIAL_SOURCE_RIGHTS_DECISION_PACKET.md`
- `docs/OPEN_QUESTIONS.md`
- `docs/SECURITY_PRIVACY_LAUNCH_GATES.md`
- `docs/DATA_PRIVACY_AND_MARKETPLACE_RULES.md`

**Implementation notes:**

- Cover public baseline maps, comp maps, trade-area reports, demographics, traffic, zoning, parcel, and user-uploaded regions.
- Define default stances for MVP0: mock/sample only; no real provider claims.
- Include approval questions for provider terms, retention, caching, export rights, indexing, and revocation.

**Acceptance criteria:**

- New decision packet exists and is linked from index/open questions.
- Packet distinguishes public display, private report use, export/share, and indexable pages.
- Launch gates state that real spatial layers require provider/source-rights approval.

**Out of scope:** Selecting a provider or negotiating terms.

## Ticket SOPHEX-HARVEST-REBASE

**Objective:** Document the required re-harvest checklist before CRE underwriting concepts can move from provisional to authoritative.

**Likely files:**

- `docs/CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md`
- `docs/HARVEST_PACKET_INDEX.md`
- `docs/SISTER_PROJECT_SOURCE_MAP.md`
- `docs/OPEN_QUESTIONS.md`

**Implementation notes:**

- Checklist should require clean checkout, branch, commit hash, upstream status, dirty-file check, path inventory, stale/deprecated route review, and diff against provisional packet.
- State that no schema/runtime adoption is authorized until re-harvest and operator approval.

**Acceptance criteria:**

- Provisional annex has an authoritative rerun checklist.
- Source maps point to the checklist.
- Open questions include the re-harvest approval decision.

**Out of scope:** Running the re-harvest now or editing sister projects.

## Ticket SOPHEX-GIS-HARVEST-REBASE

**Objective:** Document the required re-harvest checklist before ICSC mapping concepts can move from provisional to authoritative.

**Likely files:**

- `docs/ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md`
- `docs/HARVEST_PACKET_INDEX.md`
- `docs/SISTER_PROJECT_SOURCE_MAP.md`
- `docs/OPEN_QUESTIONS.md`

**Implementation notes:**

- Checklist should require clean/tagged source, asset inventory, license/source-rights review, provider key audit, local/SharePoint link exclusion, stale layer detection, and diff against provisional packet.
- State that KML/GeoJSON assets cannot be copied into Sophex without explicit rights approval.

**Acceptance criteria:**

- Provisional packet has an authoritative rerun checklist.
- Source maps point to the checklist.
- Open questions include provider/source-rights and clean-source approval decisions.

**Out of scope:** Copying assets, running GIS scripts, or connecting map providers.

## Composer Prompt Template

Use this template when assigning any ticket to Composer 2.5:

```text
Implement ticket <TICKET_ID> from docs/COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md.

Hard boundaries:
- Mock-only prototype/docs work.
- No schema, Prisma, migrations, deploys, provider calls, queues, production services, real GIS assets, .env reads, or sister-project runtime imports.
- Follow existing prototype contract/runtime adapter patterns.

Required output:
- Implement only the ticket scope and its direct dependencies.
- Add/update focused tests.
- Update docs only when the ticket says to.
- Run relevant prototype checks if code changes are made.
- Report files changed, tests run, and any blocked items.
```

## Rapid Implementation Cut Line

The fastest safe implementation set is:

1. `SOPHEX-CONTRACT-GATES`
2. `SOPHEX-CONTRACT-VALUATION-VERSION`
3. `SOPHEX-CONTRACT-EXPORT-MANIFEST`
4. `SOPHEX-UX-READINESS`
5. `SOPHEX-GIS-MANIFEST`
6. `SOPHEX-GIS-VERIFICATION`
7. `SOPHEX-GIS-PROVENANCE`
8. `SOPHEX-GIS-A11Y`

These produce visible product progress while staying inside mock-only boundaries.

Defer until after those land:

- `SOPHEX-GIS-PERFORMANCE`
- `SOPHEX-GIS-TRADE-AREA`
- `SOPHEX-GIS-SOURCE-RIGHTS`
- `SOPHEX-TIER-HITL`
- `SOPHEX-PROVENANCE-LABELS`
- `SOPHEX-HARVEST-REBASE`
- `SOPHEX-GIS-HARVEST-REBASE`
