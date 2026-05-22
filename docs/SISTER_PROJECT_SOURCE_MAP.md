# Sister Project Source Map

This map records **reference-only** sister-project paths that informed Sophex documentation. Do not copy source code, secrets, or runtime packages from these paths into Sophex.

## CRE Platform

| Area | Reference path | Why Sophex should inspect it |
| --- | --- | --- |
| Relationship truth doctrine | `cre-platform-master-clean/docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` | Governed truth posture; avoid collapsing notes, documents, comments, activities, audit, and evidence |
| Document evidence registry | `cre-platform-master-clean/prisma/schema.prisma` (`DocumentEvidence`); `apps/core/components/documents/generated-document-authority/` | Conceptual file identity, evidence posture, publication holds, receipt refs |
| Staged import / citations | `cre-platform-master-clean/apps/core/components/documents/staged-import/` | Candidate-only document extraction review and source citation patterns |
| Pilot document intake | `cre-platform-master-clean/apps/core/app/pilot/document-intake/`; `apps/core/lib/pilot/document-intake/` | Hash/idempotency/production-gate intake doctrine |
| Root shell | `cre-platform-master-clean/apps/core/components/providers/RootProviders.tsx`; `SessionGate.tsx` | Lightweight public/auth shell vs full authenticated shell |
| Navigation | `cre-platform-master-clean/apps/core/components/navigation/TopBar.tsx`; `PersistentMainMenu.tsx`; `UniversalCommandPalette.tsx`; `apps/core/components/mobile/MobileBottomNav.tsx` | Authenticated shell/search patterns; simplify for Sophex |
| Evidence citation | `cre-platform-master-clean/components/ui/source-citation.tsx`; `apps/core/components/documents/staged-import/SourceCitationList.tsx` | Inline source links with match/confidence labels |
| Provenance drill-down | `cre-platform-master-clean/apps/core/components/alphaDrop/v2/ProvenanceModal.tsx` | Field-level provenance drawer pattern |
| Provenance cell | `cre-platform-master-clean/apps/core/components/data-studio/ProvenanceCell.tsx` | Table-cell trust micro-UI |
| BOV provenance/export | `cre-platform-master-clean/apps/core/components/bov/BOVProvenanceCard.tsx`, `BOVExportCard.tsx`, `BOVSectionCard.tsx`; `apps/core/lib/bov/output-guard.ts` | Section review, output-rights guard, export gate patterns |
| Trust tier badge | `cre-platform-master-clean/apps/core/components/voltron/TrustTierBadge.tsx`; `packages/shared-types/src/voltron/trust.ts` | AUTO/NOTIFY/HITL/BLOCK review posture labels; no autonomous public publication |
| Motion tokens | `cre-platform-master-clean/apps/core/lib/motion-tokens.ts`; `apps/core/components/os/OSMotion.tsx` | Restrained framer-motion presets, sheets, focus traps, reduced-motion handling |
| Map/evidence drawer | `cre-platform-master-clean/apps/core/app/map/MapClient.tsx`; `apps/core/components/map/selected-object/`; `MapFocusModeShell.tsx` | Map selection with evidence panels and shell-preserving focus mode |
| Non-production banner | `cre-platform-master-clean/apps/core/components/surfaces/NonProductionReportingBanner.tsx` | MVP0 stub/demo warning pattern |
| Sophex-named surface | `cre-platform-master-clean/apps/core/components/sophex/ai/AIUnderwritingInterface.tsx`; `apps/core/app/sophex/**` | Existing CRE lab/stub surfaces; reframe as valuation preview, not approve/reject |
| UX assessment | `cre-platform-master-clean/apps/core/docs/SOPHEX_OS_UX_ASSESSMENT.md` | Scope warning against importing full OS complexity |
| Design system guide | `cre-platform-master-clean/apps/core/docs/DESIGN_SYSTEM_GUIDE.md` | Clarity, consistency, keyboard-first, AI transparency, and token stack |
| Route status | `cre-platform-master-clean/apps/core/config/route-status.config.ts`, `apps/core/components/navigation/RouteClassificationBanner.tsx` | Stub/working/legacy/canonical route labeling |
| Route progress | `cre-platform-master-clean/apps/core/components/navigation/RouteProgressBar.tsx` | Thin route loading feedback |
| Page transitions | `cre-platform-master-clean/apps/core/components/navigation/PageTransitionShell.tsx` | Reduced-motion-aware route reveal |
| OSMotion sheets | `cre-platform-master-clean/apps/core/components/os/OSMotion.tsx` | Focus-trapped sheets/drawers and reduced-motion hooks |
| Workflow badges | `cre-platform-master-clean/apps/core/components/ui/workflow/ProofStatusBadge.tsx`, `ActivityTimelinePanel.tsx` | Proof/status chips and timeline patterns |
| Source bundle review | `cre-platform-master-clean/apps/core/components/market-reports/source-bundle/` | Candidate/evidence-only report source review |
| UploadZone | `cre-platform-master-clean/apps/core/components/document-intelligence/UploadZone.tsx` | Drag/drop upload UX, progress, and state handling |
| Accessibility primitives | `cre-platform-master-clean/apps/core/components/accessibility/SkipLink.tsx`, `ScreenReaderAnnouncement.tsx`, `FocusTrap.tsx` | Skip nav, live regions, and focus management |

**Stale/forbidden for authoritative harvest:** `C:\Projects\cre-platform-erofs-master-landing` remains a dirty/stale checkout and should not be used for authoritative CRE path references.

## Finem Fabricator

| Area | Reference path | Why Sophex should inspect it |
| --- | --- | --- |
| Control plane overview | `finem_factory_mvp_clean/docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Workflow/agent orchestration doctrine; current truth vs horizon |
| Two-product doctrine | `finem_factory_mvp_clean/docs/blueprints/TWO_PRODUCT_DOCTRINE.md` | Engine vs vehicle separation; API boundary only |
| Evidence specs | `finem_factory_mvp_clean/docs/agent-factory/evidence-spec-v1.md`; `docs/agent-factory/evidence-pack-spec.md` | Evidence-first gate movement, correlation, idempotency, hash-chain proof |
| Evidence toolkit | `finem_factory_mvp_clean/agents/DatabaseEvidenceToolkit_MCP/` | Evidence envelope, source adapter, review decision, promotion policy patterns |
| Bridge envelope | `finem_factory_mvp_clean/docs/runbooks/CRE_READONLY_BRIDGE_ENVELOPE_CONTRACT_2026-05-20.md` | Pointers/digests/receipt refs instead of raw payloads |
| Analysis OS contracts | `finem_factory_mvp_clean/src/lib/analysis-os/` | AnalysisResponse-style report/analysis contract shapes |
| Governance/job approvals | `finem_factory_mvp_clean/apps/core/lib/bootstrap/`; `apps/core/lib/skills/` | Governance context, audit, idempotency, approval patterns |
| AXIS job status | `finem_factory_mvp_clean/src/api/axis/queues.ts`; `src/app/api/axis/jobs/[jobId]/route.ts` | Operator-only job state; do not expose raw queue internals publicly |
| Operator console | `finem_factory_mvp_clean/docs/broker-os/console.md`; `src/app/broker-os/console/page.tsx` | Current operator-control reference; stronger than mission-control stubs |
| Ops Hub HITL | `finem_factory_mvp_clean/ops_hub_app/ui/components/HITLModal.tsx` | Operator-only HITL modal inspiration |

**Superseded for authoritative harvest:** `C:\Projects\finem_factory_mvp` remains the dirty original checkout and should not be used for clean authoritative Fabricator path references.

## Content Engine (reference folder in Sophex workspace)

| Area | Reference path | Why Sophex should inspect it |
| --- | --- | --- |
| Market research strategy | `Content Engine/MARKET_RESEARCH_STRATEGY.md` | SEO/GEO funnel and lead capture architecture |
| Expansion flywheel | `Content Engine/EXPANSION_STRATEGY_PHASE_2_3.md` | Comps marketplace and contribution exchange vision |
| Interactive blueprint | `Content Engine/INTERACTIVE_CONTENT_TECH_BLUEPRINT.md` | Comparison dashboard, heat map, progressive form shapes |
| UX conversion | `Content Engine/UX_CONVERSION_DESIGN_DEEP_DIVE.md` | Hero, CTA ladder, scannable report layout |
| Tech spec | `Content Engine/CONTENT_ENGINE_TECH_SPEC.md` | Pipeline concepts; **not** authorized SQL/n8n implementation |
| Executive brief | `Content Engine/EXECUTIVE_BRIEF_CONTENT.md` | Funnel summary and risk framing |
| 90-day plan | `Content Engine/90_DAY_IMPLEMENTATION.md` | Sequencing reference only |

## Harvest Posture

- All paths above are **reference-only**.
- CRE, Fabricator, and UX/motion authoritative references now come from clean source clones. Content Engine remains reference-only from an untracked local folder.
- Sophex inherits patterns and contracts, not copied components, migrations, queues, or production data.
