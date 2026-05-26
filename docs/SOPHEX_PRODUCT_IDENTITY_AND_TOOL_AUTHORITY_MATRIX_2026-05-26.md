# Sophex Product Identity And Tool Authority Matrix

Date: 2026-05-26

Lane: `docs/sophex-product-identity-tool-authority-matrix`

Status: docs-only authority gate

## 1. Executive Decision

Sophex is currently a mock/sandbox-only public CRE intelligence and reporting prototype. It is not CRE schema authority, not a production runtime, not a production database owner, and not approved to execute production tools, agents, queues, providers, sends, billing, exports, or deploys.

Sophex may proceed only through product identity and authority gates. Every future implementation lane must preserve the external trust boundary: Sophex may present public, permissioned, and mock/sandbox projections, but it must not become the system of record for CRE canonical data unless a later explicit bridge gate approves that relationship.

Current recommended identity for the next build:

**Sophex is a public CRE intelligence marketplace with an evidence-first valuation/reporting cockpit.**

This means the next product work should clarify and polish the public reporting journey before adding tool execution, production integrations, billing, export, or CRE runtime coupling.

## 2. Product Identity Matrix

| Product identity | Current posture | Recommendation | Reason |
| --- | --- | --- | --- |
| Public CRE intelligence marketplace | Strong | Primary | `docs/PRODUCT_VISION.md` and `docs/PROJECT_BOUNDARY.md` define Sophex around public property intelligence, comps, evidence contribution, and permissioned views. |
| User-facing valuation/reporting cockpit | Strong | Primary next build focus | `docs/VALUATION_REPORTING_PRODUCT.md`, `/report/:id`, `/export/:id`, and Studio report builder already point to evidence-first reports as the user value. |
| Contribution marketplace | Strong but gated | Secondary | Upload and contribution exchange are core to the flywheel, but real uploads require contribution terms, file safety, review, and visibility gates. |
| Report/content engine | Partial | Secondary | Content/reporting doctrine is useful, but real report-generation runtime and Content Engine automation remain explicitly deferred. |
| Studio workflow prototype | Strong prototype | Supporting | Studio demonstrates the broker/analyst workflow, but remains fixture/sandbox and should not imply production CRE authority. |
| Operator-lite projection | Useful but narrow | Supporting/internal | Broker OS can show sanitized status and agent inventory, but raw queues, logs, worker IDs, and PII stay internal-only. |
| Agent/tool marketplace | Not ready | Blocked | Tool/agent execution authority, safety, registry truth, and customer-facing semantics are not approved. |

## 3. First Product Outcome

Recommended safest first outcome:

**Evidence-backed valuation/reporting output with a gated report draft and blocked export posture.**

This is safer than a BPO, broker proposal, investment memo, paid export, or marketplace package because it can stay in mock/sandbox mode while proving the product contract:

1. Public property baseline.
2. Evidence and source posture.
3. Comps and assumptions with authority labels.
4. Warnings and gap register.
5. Draft report sections.
6. Section review posture.
7. Export blocked until consent, source rights, review, and receipts clear.

| Candidate outcome | Current decision | Reason |
| --- | --- | --- |
| Valuation/reporting output | Recommended first | Best aligned to current docs and prototype surfaces. |
| BPO | Deferred | Requires CRE/BOV authority, comp promotion, valuation owner, and client-output governance. |
| Pitch/proposal | Deferred | Requires branding, legal copy, output approval, send/export governance, and customer-ready claims. |
| Underwriting report | Deferred | Requires stronger assumptions, versioning, evidence snapshot, and reviewer identity. |
| Comp-supported rent/value opinion | Deferred | Requires comp database authority and source-rights proof. |
| Market research pack | Deferred | Requires provider/source licensing and export/indexing decisions. |
| Marketplace listing/package | Deferred | Requires package publishing model, tool authority, billing, and public contribution terms. |

## 4. Read / Write / Execution Authority Matrix

| Sophex surface | Current examples | Authority classification | Production posture |
| --- | --- | --- | --- |
| Public landing/search | `/`, `public-landing.ts`, public search fixtures | Fixture/mock read | Allowed in prototype only. |
| Public property page | `/property/:id`, `public-property.ts` | Fixture/mock read | No private/CRE production data. |
| Public comps | `/property/:id/comps`, `public-comps.ts` | Fixture/mock read | Provider/source-rights blocked. |
| Upload/contribution | `/upload`, `public-upload.ts`, `upload-flow.ts` | Draft-write simulation | Metadata-only in sandbox/prototype; no real bytes. |
| Public report | `/report/:id`, `report-flow.ts` | Customer-visible draft | Draft/report preview only; no production claim. |
| Export gate | `/export/:id`, `public-export-gate.ts`, `export-policy.ts` | Blocked customer-visible final output | Export remains disabled/gated until approval. |
| Studio marketing | `/studio` | Fixture/mock read | Marketing shell only. |
| Studio onboarding | `/studio/onboarding`, `onboarding-flow.ts` | Draft/local profile simulation | No account/org creation authority. |
| Billing/settings | `/studio/settings/billing`, `billing-plans.ts` | Fixture/mock read and simulated CTA | No billing activation. |
| Studio dashboard/deal workflow | `/studio/dashboard`, `/studio/deals/:dealId` | Fixture/mock read | No CRE production data authority. |
| Studio intake/data review | `/studio/deals/:dealId/intake`, `/data-review` | Draft/candidate workflow simulation | Candidate evidence only; no promotion authority. |
| Studio underwriting/source trace/debt/scenarios/versions | Studio deal workflow pages | Fixture/mock read and advisory workflow | No version lock, override, or production model authority. |
| Studio report builder | `/studio/reports/:dealId/builder` | Customer-visible draft | No final export/share authority. |
| White-label settings | `/studio/settings/white-label` | Draft/simulated write | No tenant storage or branding persistence. |
| Broker OS | `/studio/broker-os` | Internal projection | Sanitized projection only; no raw queue/tool execution. |
| Design reference routes | capital stack, IC packet, HITL review, design system | Reference/mock | No legal, IC, review, or export authority. |

Blocked classifications:

- `external-send`: blocked.
- `production-write`: blocked.
- `customer-visible final output`: blocked.
- autonomous tool/agent execution: blocked.
- billing activation: blocked.

## 5. Tool / Agent Authority Matrix

Every agent role below is conceptual until a later explicit tool authority lane approves execution. Agent output is candidate evidence, status, or draft report material only.

| Conceptual role | Allowed inputs | Allowed outputs | Write authority | Execution authority | Approval requirement | Blocked actions |
| --- | --- | --- | --- | --- | --- | --- |
| Ingestion Classifier | Mock file metadata, declared source type, size/type hints | Ingestion route suggestion, needs-review flag, cost tier estimate | None in production; sandbox metadata only after approval | Blocked outside sandbox | Terms/file safety approval | Real upload, OCR, byte storage, provider calls, public publication |
| Evidence Extractor | Permitted mock evidence, source snippets, fixture chunks | Extraction candidates with source refs and confidence | None to canonical data | Blocked outside sandbox | HITL before public/report use | Promoting facts, writing CRE tables, using private docs without terms |
| Valuation Report Generator | Approved mock report sections, permitted evidence, assumptions | Draft report sections, warnings, citations, reviewRequired posture | Draft only | Blocked outside sandbox | HITL/export approval | Headline valuation as final, PDF/export/share, hidden-source leakage |
| Source Confidence Scorer | Mock observations, review state, source family, freshness | Confidence band, freshness label, dispute hint | None | Blocked outside sandbox | Public promotion review | Auto-promotion, permission bypass, confidence-as-authority |
| HITL Reviewer | Candidate facts, report drafts, permission context | Review recommendation/status projection | No direct production write in Sophex | Blocked outside approved review lane | Human reviewer authority | Treating queue completion as approval, public export unlock |
| Marketplace Moderation Assistant | Upload metadata, candidate observations, contributor history | Moderation signal and priority | None | Blocked outside sandbox | Human moderation decision | Auto-ban, auto-publication, suppression without policy |
| Audit / Correlation Receipt Writer | Governed action metadata, actor, target, idempotency key | Redacted receipt projection | Sandbox receipt only after approval | Blocked outside sandbox | Export/share gate approval | Raw receipt leakage, production audit writes, retry without idempotency |
| Background Job Status Projector | Internal run state after sanitization | User-safe phase label, blocked reason, safe status | Projection only | Blocked from controlling jobs | Operator/tool authority approval | Raw logs, queue names, worker IDs, PII, success from incomplete runs |

## 6. CRE Boundary Matrix

Hard rule: Sophex must not write to CRE schema, CRE canonical data, CRE production databases, CRE candidate tables, or CRE promotion flows without a later explicit bridge gate.

| CRE-related reference | Examples | Classification | Allowed posture | Blocked posture |
| --- | --- | --- | --- | --- |
| CRE doctrine harvest | `CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md`, `PROJECT_BOUNDARY.md` | Doctrine/reference only | Use concepts for evidence, audit, comp governance, and UX language. | Copying CRE code/data or claiming CRE runtime authority. |
| Sister schema docs | `SISTER_SCHEMA_HARVEST_PACKET.md`, `SISTER_SCHEMA_BORROWING_GATE.md`, schema docs | Integration placeholder | Plan future contracts and borrowing gates. | Schema edits, Prisma, generated clients, CRE migrations. |
| CRE-style underwriting/BOV patterns | `CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md`, valuation/report docs | Doctrine/reference only unless separately approved | Use as product inspiration and governance language. | Treating BOV/underwriting outputs as live CRE data. |
| CRE property/comps/evidence data | Public/studio mock fixtures | Blocked production dependency | Use synthetic fixtures and sandbox projections only. | Direct reads/writes to CRE production or canonical tables. |
| CRE promotion/review flows | HITL/review doctrine | Integration placeholder | Represent as gated status in mock UI. | Letting Sophex queue/review UI promote CRE evidence. |
| CRE APIs | Future contracts in `API_CONTRACT_DRAFT.md` | Not yet approved API dependency | Define sandbox contract shape only. | Calling CRE APIs without bridge approval. |
| CRE internal workflow controls | Broker OS projection concepts | Unsafe coupling if raw | Show sanitized projections only. | Raw queues, worker IDs, logs, internal controls, PII context. |

## 7. Reporting Golden Path

Safe mock/sandbox reporting path:

1. Public property page shows public baseline and authority labels.
2. Evidence posture explains source, visibility, freshness, and review state.
3. Comps and assumptions show blocked/provider/private labels when needed.
4. Warnings/gaps are visible before report sections imply conclusions.
5. Report draft assembles permitted sections with citations and confidence language.
6. Section review remains simulated or gated.
7. Export is visibly blocked until consent, source rights, section review, and receipts clear.
8. Receipt/audit posture is shown as redacted projection, not production truth.

Acceptance criteria for this path:

- No hidden private/provider-restricted values in public HTML or errors.
- No final valuation claim without visible evidence and review posture.
- No export/share/download control becomes active until the export gate is approved.
- No raw internal engine nouns appear in customer-facing copy.

## 8. Export / Billing Gate

Before download:

- Actor context and entitlement are known.
- Consent copy/version is captured.
- Section review is clear.
- Source-rights filters are applied.
- Idempotency and receipt contract are approved.

Before share link:

- Viewer permissions are enforced server-side.
- Private/provider sources are redacted or blocked.
- Link lifecycle, revocation, and audit posture are approved.

Before paid export:

- Billing/auth provider is approved.
- Entitlements are server-side.
- Export gate cannot be bypassed by payment status.

Before public marketplace listing:

- Contribution terms are accepted.
- Public-use rights are clear.
- Review/promotion decision exists.
- Indexing policy permits exposure.

Before contribution publishing:

- Source-owner rights, revocation, attribution, and visibility class are recorded.
- Candidate evidence is reviewed.
- Public projection is separate from private report use.

Before provider send:

- Outbound consent stack is approved.
- Provider terms and suppression/opt-out are enforced.
- No CRM/email/partner send occurs from prototype.

## 9. Operator-Lite Posture

Broker OS / operator-lite surfaces may show:

- Sanitized job streams.
- Agent inventory summaries.
- Review queue status projections.
- Safe readiness labels.
- Redacted context payloads.
- Non-production callouts.

They must not show:

- Raw queue names.
- Worker IDs.
- Fabricator logs.
- Raw run logs.
- PII-bearing context.
- Provider secrets.
- Internal CRE controls.
- Direct execution buttons.
- Any statement implying queue completion equals evidence promotion or export authority.

## 10. Recommended Next Lanes

| Lane | Purpose | Allowed scope | Forbidden scope | Dependencies | Validation | Risk | Recommended order |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SOPHEX-PROD-001` Product identity matrix | Lock identity and first output. | Docs only. | Runtime, schema, provider, billing, export implementation. | This document. | Markdown review and branch scope check. | Low. | 1 |
| `SOPHEX-AUTH-001` Tool authority matrix | Decide what future tools/agents may read, draft, write, or execute. | Docs only; conceptual role matrix. | Tool execution, Railway, queue, providers. | `SOPHEX-PROD-001`. | Boundary review. | Medium. | 2 |
| `SOPHEX-CRE-001` CRE boundary matrix | Separate doctrine/reference from future integration. | Docs only. | CRE writes, Prisma, schema, CRE runtime. | `SOPHEX-PROD-001`. | Confirm no CRE repo/files touched. | High if skipped. | 3 |
| `SOPHEX-REPORT-001` Reporting golden path | Define safe public report draft journey. | Docs/design/prototype copy only if approved. | Final export/share, production report generation. | Product identity and export gate. | Route/copy review. | Medium. | 4 |
| `SOPHEX-EXPORT-001` Export/billing gate | Define preconditions for download/share/paid export. | Docs only. | Billing provider, export implementation, send. | Product identity, tool authority. | Gate checklist review. | High. | 5 |
| `SOPHEX-SANDBOX-001` Sandbox service contract | Refine synthetic sandbox API contracts. | Docs/contract only unless later approved. | Production DB, CRE APIs, deploy, provider, queue. | CRE boundary and export/billing gates. | Contract tests only in future lane. | High. | 6 |
| `SOPHEX-UX-001` Public reporting polish pass | Improve public report clarity after gates are agreed. | Prototype UI/copy if separately approved. | Production runtime or final output. | Golden path. | Unit/visual tests in future lane. | Medium. | 7 |

## 11. Non-Authorizations

This matrix does not authorize:

- CRE writes.
- CRE schema authority.
- Prisma, migrations, generated clients, or database DDL.
- Production database access.
- Railway execution or settings changes.
- Provider/send actions.
- Production export/share enablement.
- Billing activation.
- Queue/worker execution.
- Autonomous agent execution.
- Tool execution.
- Runtime/API implementation.
- Customer-visible final output.
- Public marketplace publishing.
- User-uploaded real file storage.
- Production deploys.

Any future lane that touches those areas must open a separate, explicit approval
gate with operator signoff.
