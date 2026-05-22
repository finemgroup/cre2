# CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE

> **Authoritative source archive for CRE doctrine.** This packet was generated read-only from the clean CRE clone at `C:\Projects\cre-platform-master-clean` on `master` with `HEAD == origin/master` and a clean working tree. It supersedes the provisional CRE packet generated from stale/dirty branch `agent/03-operating-lens-navigation`.
>
> This packet is still **reference-only for Sophex docs**. It does not authorize runtime code, schema, Prisma, migrations, production DB access, deploys, provider/send, queues, or copying CRE source code.

**Mode:** `SOPHEX_AUTHORITATIVE_CRE_HARVEST_INTEGRATION` / `DOCS_ONLY`  
**Harvest date:** 2026-05-22  
**CRE source path:** `C:\Projects\cre-platform-master-clean`  
**CRE branch:** `master`  
**CRE HEAD:** `5300e7e5510e27d5ba505bfba8bec39990f68f7c`  
**CRE origin/master:** `5300e7e5510e27d5ba505bfba8bec39990f68f7c`  
**Clean confirmation:** `git status --short --branch --untracked-files=all` returned `## master...origin/master` only.

---

## 1. CRE Executive Takeaway For Sophex

### Concepts Sophex should inherit

1. **Relationship Truth Doctrine** — notes, documents, comments, activities, evidence, receipts, and projections remain separate concepts.
2. **Document byte-pointer authority** — source files are referenced by durable file identity; business records carry metadata and policy.
3. **DocumentEvidence registry** — evidence posture is a governed sidecar with review, source family, hashes, receipts, supersession, idempotency, and correlation.
4. **Staged import before promotion** — extraction and review produce candidates; nothing becomes public truth by extraction alone.
5. **Chunks and embeddings as sidecars** — retrieval projections support search and extraction but never become canonical business truth.
6. **Permission-filtered retrieval at every hop** — search, command palette, RAG, evidence panels, report generation, export, and APIs must filter by actor and visibility.
7. **Policy and operational receipts** — governed decisions and actions need idempotency, correlation, redacted evidence refs, and replay safety.
8. **Comp intelligence with verification gates** — comps need source, confidence, verification, provider rights, and HITL before public use.
9. **BOV/report section review and export gates** — reports need section approval, provenance coverage, publication holds, output guards, and artifact hashes.
10. **Public shell vs authenticated workstation** — Sophex public routes should stay lightweight; workstations can carry richer nav, HITL, command, and review UX.

### Things Sophex must not copy directly

1. CRE `prisma/schema.prisma`, migrations, generated clients, or database model syntax.
2. CRE production data, internal document evidence, private comps, or internal activity logs.
3. Internal CRE roles as public marketplace roles without a separate public trust model.
4. Full operator shell complexity (Jarvis, dialer, gamification, large provider tree, operating-lens chrome).
5. Command palette/RAG/graph results without public visibility filtering.
6. Queue, receipt, or display-table completion as authority to publish or export.
7. BOV/GHL/send/provider workflow fields or export/send automation.
8. Duplicate app-partition components as canonical source; prefer `apps/core` paths where confirmed.
9. AI approve/reject underwriting tone for public valuation UX.
10. Staged-import fixture controls, mock approval timelines, or non-production fixtures as production authority.

---

## 2. Schema / Data Concepts To Borrow Conceptually

No Prisma syntax, SQL, migration steps, or generated-client guidance is authorized.

| Concept | CRE source path(s) | What it does in CRE | Sophex should borrow | Public trust changes | Do not copy | Future gate |
| --- | --- | --- | --- | --- | --- | --- |
| Relationship truth | `docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md`; `docs/governance/RELATIONSHIP_TRUTH_RECONCILIATION_INDEX_2026-04-29.md` | Defines canonical vs mirror/staging/derived and keeps notes, documents, comments, activities, and evidence distinct | Marketplace constitution for evidence vs narrative vs audit | Public views need publication holds and client visibility enums | Airtable/internal workflow assumptions | Product/legal approval of public visibility model |
| Documents / file identity | `prisma/schema.prisma` (`documents`); document authority audits | Uses file pointer plus metadata, permissions, sharing, and source links | Separate blob pointer from evidence metadata | Add redaction, provider-rights, and source-use gates before public views | Deal-required document coupling | DocumentEvidence contract review |
| Document evidence | `prisma/schema.prisma` (`DocumentEvidence`); `prisma/migrations/20260522_dci_e1_document_evidence_registry/`; `apps/core/tests/unit/dci-e1-document-evidence/no-bypass-static.test.ts` | Registry for source family, hashes, review/promotion, receipts, idempotency, correlation, supersession, freshness, HITL | Evidence identity table concept separate from source file row | Include revocation, retention, publication eligibility, and source-use policy | CRE holding contexts as marketplace contexts | Public upload/intake contract |
| Source observations | `DocumentEvidence.sourceObservedAt`, `sourceUploadedAt`, `extractedAt`, `sourceHash`, `payloadDigest` | Captures temporal/digest lineage for source material | Observation timestamps and hash lineage on every artifact | Show observed-at/freshness on public claims | Treat upload time as observation time | Observation contract review |
| Comp candidate / comp intelligence | `prisma/schema.prisma` (`comparable`, `SaleComparable`, `BovComp`, `AdjustmentGridRow`, `market_intel`); `docs/program/market-reports/MARKET_REPORT_COMP_INGESTION_MVP_ROADMAP_2026-05-07.md` | Tracks comps, source data, confidence, verification, BOV links, adjustments, and market intel validation | First-class comp candidates with verification and source rights | Require provider rights and HITL before public comp display | Dual comp models or agent promotion without review | Comp rights and source matrix |
| Field-level authority | `ai_field_updates`; `apps/core/components/data-studio/ProvenanceCell.tsx`; `apps/core/components/underwriting/DataProvenanceLabel.tsx` | Records field updates and shows source/freshness/confidence labels | Per-field authority and provenance labels | AI-estimate fields blocked from public until confirmed | Contact-only scope for all field authority | Field authority label taxonomy |
| Permissions / visibility | `documents.accessLevel`; `document_permissions`; `document_share_links`; `apps/core/app/api/documents/upload/route.ts`; access-control docs referenced in consolidation plans | Checks permission at upload and stores document ACL/share links | Upload permission checks plus per-artifact visibility | Add anonymous/public/client/private scopes at query/API layer | UI-only hiding or generic viewer defaults | Permission model review |
| User / org / contact separation | `organizations`; `users`; `Contact`; `client_portal_users`; `client_portal_onboarding_step_completed` | Separates org, internal users, CRM contacts, and client portal identities | Keep public users, source owners, orgs, operators, and contacts distinct | Contact PII/enrichment cannot leak to public marketplace | Contact table as universal identity | Identity and org design |
| Audit / activity / events | `activities`; `BovActivityLog`; `audit_logs`; `packages/shared-types/src/agent-events.ts`; `packages/shared-types/src/actions.ts` | Separates activities and typed agent events from notes/evidence | Structured event envelope and actor/time/action audit | Public timeline is a filtered projection, not internal activity | Overloaded activity table as public audit | Audit/read-model contract |
| Receipts / idempotency / correlation | `PolicyDecisionReceipt*`; `OperationalActionReceipt*`; `IdempotencyLedger`; `OutboxMessage`; `DocumentEvidence.*ReceiptRef` | Persists policy/action receipts, replay hashes, idempotency, correlation, redacted refs | Separate policy decisions from operational actions; fail-closed idempotency | Redact response bodies and evidence refs for public routes | Receipt row existence as approval to execute | Receipt contract and retention policy |
| Notes / comments / evidence separation | `notes`; `comments`; `document_comments`; `document_annotations`; `docs/runbooks/NOTES_EMAIL_CALL_DOCUMENT_INTEL_MODEL_AUDIT_CLOSEOUT_2026-05-08.md` | Documents fragmentation and doctrine target for notes/comments/activity/evidence separation | Avoid new per-surface note silos; keep artifact comments scoped | `isInternal` notes must never join public retrieval | Universal `intel_artifacts` without proof gates | Collaboration model design |
| Retrieval / chunks / embeddings | `DoclingChunk`; `apps/core/lib/documents/execute-docling-ingest.ts`; `apps/core/lib/document-intelligence/queue.ts`; `UniversalCommandPalette.tsx` | Chunks link to documents/context and support search/RAG; command palette merges entity/RAG/graph/doc hits | Derived retrieval sidecars with explicit source tags | Filter by actor visibility at every retrieval hop | Vector/chunk as canonical truth | Retrieval permission test plan |

---

## 3. Frontend / UX Concepts

| Pattern | CRE source path(s) | Pattern description | Sophex adaptation | Public/private caveat |
| --- | --- | --- | --- | --- |
| Global shell vs workstation | `apps/core/components/providers/RootProviders.tsx`; `SessionGate.tsx`; `apps/core/lib/navigation/os-workstation-matrix.ts`; `operating-lenses.ts` | Lightweight public/auth route shell; authenticated shell with TopBar, transitions, mobile nav, command palette; route matrix marks canonical/legacy/client-safe roles | Public marketplace shell plus authenticated contribution/report workstations | Public routes skip internal providers; authenticated routes still session-gated |
| Navigation primitives | `TopBar.tsx`; `PersistentMainMenu.tsx`; `apps/core/components/mobile/MobileBottomNav.tsx`; `PageTransitionShell.tsx`; `RouteClassificationBanner.tsx`; `RouteProgressBar.tsx` | Operator shell, mobile nav, route progress, maturity banners | Borrow simple route progress, mobile tab posture, stub route banners | Do not copy operator lens menu complexity into public MVP0 |
| Property intelligence page | `apps/core/app/properties/page.tsx`; `apps/core/app/properties/[id]/PropertyDetailClient.tsx`; `PropertyValuationSummary.tsx`; `CoreObjectDetailShell.tsx` | Property registry/detail with tabs, comps, documents, activity, relationships, tasks, valuation cards | Sophex property profile with evidence-first tabs | Internal CRE tabs require public visibility filtering |
| Evidence/source drawers | `SelectedObjectDrawer.tsx`; `SelectedObjectDrawerPanels.tsx`; `SourceEvidenceBlockCard.tsx`; `MarketReportSourceBundleReviewPanel.tsx`; `StagedImportReviewPanel.tsx` | Evidence-first drawer/review surfaces with citations, authority labels, blocked actions | Listing/map/report evidence drawer and review panel | Hide private docs, actor identity, provider-restricted source names |
| Confidence/authority labels | `market-reports/source-bundle/types.ts`; `ReviewPostureBanner.tsx`; `TrustTierBadge.tsx`; `packages/shared-types/src/voltron/trust.ts`; `DataProvenanceLabel.tsx` | Candidate-only, blocked-action, trust tier, and source-confidence labels | Public baseline/user/private/model-inferred/reviewed/blocked UI | No AUTO public publication; AI estimates blocked until confirmed |
| Comparison tables | `CandidateCompPreviewTable.tsx`; `BOVCompTable.tsx`; `TermsComparisonTable.tsx`; `LinkCandidateReviewTable.tsx` | Accessible tables with confidence badges, candidate/evidence-only columns, gap lists | Comp and valuation comparison dashboard | Public tables require reviewed/public comps or samples |
| Maps/geospatial UI | `apps/core/app/map/MapClient.tsx`; `MapFocusModeShell.tsx`; `ActionBasketPanel.tsx`; `EligibilityBadge.tsx` | Map workbench with selected-object drawer, focus mode, eligibility gating | Property map and heatmap with evidence drawer | No non-public deal markers or fake precision |
| Valuation/report/BOV surfaces | `BOVWorkbench.tsx`; `BOVGenerationWizard.tsx`; `BOVMissionControl.tsx`; `apps/core/lib/bov/output-guard.ts`; generated document authority panels; provider export readiness panels | Report wizard, mission control, output guard, publication holds, version timeline, public export hold | Report builder, section review, output-rights guard, export readiness | Public export blocked until source rights, holds, and consent clear |
| Upload/intake flows | `apps/core/app/pilot/document-intake/page.tsx`; `PilotIntakeUploader.tsx`; `UploadMetadataModal.tsx`; `DocumentExtractionStagedPayloadReviewWorkbench.tsx`; `apps/core/app/bov/comps/import/page.tsx` | Drag/drop upload, hash/idempotency, duplicate detection, metadata modal, staged extraction review | Seller document intake and comp upload | Public upload needs malware/size/rate/source-use gates |
| Activity/timeline/HITL queue | `HitlQueuePanel.tsx`; `UnifiedActivityFeedPanel.tsx`; `BriefDelegationProgress.tsx`; `BriefHitlConfirmationDialog.tsx`; `HitlDecisionQueuePanel.tsx`; property activity tab | Internal activity and HITL queue surfaces | Operator moderation/review queue and sanitized contributor status | Internal actor/log detail never exposed publicly |
| Command palette/search/nav | `UniversalCommandPalette.tsx`; `CommandPaletteProvider.tsx`; `useCommandPalette.ts` | Global palette merges entity/RAG/graph/agent/document hits and ends governed flows in evidence stage | Future authenticated command/search surface | Not MVP0 primary nav; must permission-filter all hits |

---

## 4. Motion / Interaction / Visual Language

| Area | CRE source path(s) | Authoritative finding | Sophex adaptation |
| --- | --- | --- | --- |
| Motion tokens | `apps/core/lib/motion-tokens.ts`; `apps/core/lib/motion/workflow-motion.ts` | Execution/review duration tiers, OS motion specs, reduced-motion fallback | Use restrained named presets; no ad hoc over-animation |
| Page transitions | `PageTransitionShell.tsx`; `RouteProgressBar.tsx` | Route-keyed reveal and top progress bar | Low-motion route feedback for app and report steps |
| Drawers/modals | `apps/core/components/os/OSMotion.tsx`; `OSActionPrimitives.tsx`; `OSSheet` | Focus trap, Escape, aria-modal, restore focus, risk confirmation dialog | Standard evidence/action drawer behavior |
| Loading states | `apps/core/app/properties/loading.tsx`; `HitlQueuePanel.tsx`; `RootProviders.tsx` | Domain skeletons and list skeletons; global fallback | Prefer layout-matched skeletons over generic spinners |
| Progress timelines | `BOVGenerationWizard.tsx`; `BOVMissionControl.tsx`; generated-document authority version timeline | Wizard progress, gate counts, version timelines | Report generation and export readiness progress |
| Map interactions | `MapFocusModeShell.tsx`; `SelectedObjectDrawerPanels.tsx` | Focus mode preserves shell; map selection reveals evidence posture | Click-to-region/marker with evidence drawer and sample labels |
| Evidence reveal | `SourceEvidenceBlockCard.tsx`; `EvidencePanel`; `SourceCitationList` | Summary to flags to citation list with confidence and license notes | Expandable report/source evidence cards |
| Accessibility warnings | `AxeInitializer.tsx`; `SkipLink.tsx`; `accessibility.ts`; a11y tests; publication hold banners | Skip links, screen-reader announcements, `role=alert`, `aria-live`, captions, `sr-only` statuses | Governance UI must be keyboard and assistive-tech friendly |

---

## 5. API / Contract Ideas For Future Sophex

Conceptual only. These names are product contract anchors, not schema syntax.

| Contract | Purpose | Required invariants | CRE inspiration | Future gate |
| --- | --- | --- | --- | --- |
| DocumentEvidenceContract | Durable file/evidence identity and policy metadata | Bytes in storage; metadata/policy in evidence record; chunks are sidecars | `documents`, `DocumentEvidence`, generated document authority panels | Document upload policy and retention review |
| SourceObservationContract | Sourced claim about a field, comp, or report section | Observed-at, source hash, actor, visibility, confidence, lineage | `DocumentEvidence` temporal/digest fields; field update logs | Observation lifecycle design |
| ResolvedFieldValueContract | Actor-specific displayed value | Permission filtered; authority label; freshness/dispute state | Relationship Truth Doctrine, ProvenanceCell, DataProvenanceLabel | Query/API permission tests |
| ObservationVisibilityPolicy | Who can see an observation/source/derived value | Enforced server-side; public/private/client/org scopes | document ACLs, share links, access-control doctrine | Legal/source-use terms |
| CompCandidateContract | Submitted/extracted comp before review | Source, verification, confidence, provider rights, HITL status | `comparable`, `BovComp`, source bundle comp preview | Comp ingestion rights matrix |
| ReportArtifactContract | Evidence-backed valuation/report artifact | Sections, citations, warnings, holds, export eligibility, source manifest | BOV models, output guard, generated document authority panels | Report product/legal review |
| AuditReceiptContract | Governed action or policy decision receipt | Idempotency, correlation, redacted evidence refs, replay safety | PolicyDecisionReceipt, OperationalActionReceipt, IdempotencyLedger | Audit/retention review |
| JobStatusProjection | Public-safe phase timeline | Sanitized phases only; no raw queue/logs; honest indeterminate states | O1 review substrate, BOV mission control, Fabricator doctrine | Worker/queue implementation review |

---

## 6. Security / Privacy / Trust Warnings

- Retrieval must be permission-filtered across search, command palette, RAG, graph, chunk, evidence panel, report, export, and API access.
- UI-only permissions are insufficient.
- Do not render canonical-looking public views from weak, candidate-only, stale, disputed, or provider-restricted data.
- Chunks, embeddings, graph projections, and command-palette hits are projections, not truth.
- Private facts must not leak through public reports, maps, white-label PDFs, share links, snippets, analytics, or search results.
- Sophex must not directly couple to CRE production data or databases.
- Send automation, CRM sync, provider/send, queues, and outbound actions require consent, audit, idempotency, suppression/unsubscribe, and operator approval.
- Receipt/display tables do not grant execution authority by themselves.
- Public-facing map/report surfaces need source-rights and publication-hold checks.

---

## 7. File Path Appendix

| Area | Path | Why Sophex should inspect/reference it |
| --- | --- | --- |
| Relationship truth | `docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` | Canonical vs mirror/staging/derived; notes/documents/comments/activities/evidence separation |
| Governance kit | `docs/governance/README.md`; `docs/governance/PLATFORM_SOURCE_OF_TRUTH.md` | Source-of-truth and guardrail posture |
| Cross-domain consolidation | `docs/program/database-truth/CROSS_DOMAIN_FIELD_AND_OBJECT_CONSOLIDATION_PLAN_2026-05-07.md` | Projection-vs-authority and proof-gate doctrine |
| Schema conceptual inventory | `prisma/schema.prisma` | Concept names only; no schema copy |
| Document evidence | `DocumentEvidence`; `DoclingChunk`; `document_*` models | Evidence registry, chunks, comments, annotations |
| Generated doc authority | `apps/core/components/documents/generated-document-authority/` | Publication holds, file-ref authority, provenance tables |
| Staged import | `apps/core/components/documents/staged-import/` | Candidate review and source citation lists |
| Pilot intake | `apps/core/app/pilot/document-intake/`; `apps/core/lib/pilot/document-intake/` | Hash dedupe, idempotency, production gates |
| Root shell | `apps/core/components/providers/RootProviders.tsx`; `SessionGate.tsx` | Public/auth shell vs full authenticated shell |
| Navigation | `TopBar.tsx`; `PersistentMainMenu.tsx`; `apps/core/components/mobile/MobileBottomNav.tsx`; `UniversalCommandPalette.tsx` | Shell primitives and future command/search |
| Motion | `apps/core/lib/motion-tokens.ts`; `apps/core/components/os/OSMotion.tsx` | Reduced-motion-aware motion and sheets |
| Provenance UI | `apps/core/components/data-studio/ProvenanceCell.tsx`; `apps/core/components/alphaDrop/v2/ProvenanceModal.tsx`; `components/ui/source-citation.tsx` | Field and citation provenance patterns |
| BOV/reporting | `apps/core/components/bov/`; `apps/core/lib/bov/output-guard.ts`; provider export readiness panels | Report wizard, export gates, output rights |
| Map | `apps/core/app/map/MapClient.tsx`; `apps/core/components/map/selected-object/`; `MapFocusModeShell.tsx` | Map + evidence drawer |
| HITL/activity | `HitlQueuePanel.tsx`; `UnifiedActivityFeedPanel.tsx`; `ReviewDisplayRun` / O1 docs | Review display and queue patterns |
| Shared types | `packages/shared-types/src/agent-events.ts`; `actions.ts`; `content-engine.ts`; `voltron/trust.ts` | Event envelopes, content lifecycle, trust ceiling |
| Sophex lab artifacts | `apps/core/app/sophex/**`; `apps/core/components/sophex/ai/AIUnderwritingInterface.tsx`; `docs/SOPHEX_OS_UX_ASSESSMENT.md` | Internal/lab reference only, not public authority |

---

## 8. Differences From Prior Provisional CRE Packet

| Area | Authoritative finding | Provisional packet impact |
| --- | --- | --- |
| Source state | Clean `master`, `HEAD == origin/master` at `5300e7e5510e27d5ba505bfba8bec39990f68f7c` | Supersedes stale/dirty `agent/03-operating-lens-navigation` packet |
| Relationship truth | `docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` confirmed | Provisional doctrine confirmed |
| Evidence registry | `DocumentEvidence` and receipt/idempotency fields confirmed in clean master | Provisional concept confirmed and expanded |
| File-ref authority | `documents.file_ref` concept confirmed | Provisional concept confirmed |
| Provenance UI | Canonical paths under `apps/core/components/...`; root duplicates exist for some components | Path references updated away from stale root assumptions |
| BOV/export | `apps/core/components/bov/*`, `output-guard.ts`, generated document authority, provider export readiness panels confirmed | Expanded beyond basic BOV card references |
| Shell | `RootProviders`, `SessionGate`, route matrix, operating lenses confirmed | Provisional shell split confirmed, with public/auth route details |
| Mobile nav | Canonical mobile nav is `apps/core/components/mobile/MobileBottomNav.tsx`; `components/navigation/MobileBottomNav.tsx` is legacy duplicate | Provisional references needed clarification |
| Shared shell package | `packages/shared-shell/**` does not exist on clean master | Remove as expected source; shell is in `apps/core` |
| Map/heatmap | `PropertyHeatmap` exists but map workbench/evidence drawer patterns are stronger references | Do not treat duplicate heatmap as canonical |
| Sophex lab surfaces | `apps/core/app/sophex/**` stubs/lab routes exist | Use as cautionary reference, not authority |
| Remaining unverified | Current UX/motion provisional packet still points to stale CRE checkout metadata | Needs separate UX/motion validation update or supersession |

---

## 9. Recommended Sophex Doc Updates Applied

- `HARVEST_PACKET_INDEX.md`, `HARVEST_DOC_HIERARCHY.md`, `CROSS_PROJECT_HARVEST.md` now point to this authoritative CRE packet.
- `SISTER_PROJECT_SOURCE_MAP.md` and `SOPHEX_REFERENCE_PATHS.md` now record the clean CRE clone and stale dirty checkout distinction.
- CRE alignment, evidence, trust, ingestion, valuation, frontend, motion, trust UI, conceptual contracts, and future schema docs now reference clean-master findings.
- `OPEN_QUESTIONS.md` closes/revises the pending authoritative CRE harvest questions and keeps remaining implementation gates.
- `DECISIONS.md` records that authoritative clean-master CRE harvest supersedes the stale provisional packet.

---

## Final Recommendation

Use this packet as the **current CRE source archive** for Sophex doctrine. Keep topic docs as the living canonical guidance. Any implementation must still be separately authorized, scoped, reviewed, and built against future Sophex contracts rather than copied CRE schema or source code.
