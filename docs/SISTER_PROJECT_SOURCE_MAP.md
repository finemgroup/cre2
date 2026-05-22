# Sister Project Source Map

This map records **reference-only** sister-project paths that informed Sophex documentation. Do not copy source code, secrets, or runtime packages from these paths into Sophex.

## CRE Platform

| Area | Reference path | Why Sophex should inspect it |
| --- | --- | --- |
| Relationship truth doctrine | `cre-platform-erofs-master-landing/docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` | Governed truth posture; avoid collapsing notes, audit, and evidence |
| Root shell | `cre-platform-erofs-master-landing/apps/core/components/providers/RootProviders.tsx` | Lightweight public shell vs full operator shell |
| Evidence citation | `cre-platform-erofs-master-landing/apps/core/components/ui/source-citation.tsx` | Inline source links with match/confidence labels |
| Provenance drill-down | `cre-platform-erofs-master-landing/apps/core/components/alphaDrop/v2/ProvenanceModal.tsx` | Field-level provenance drawer pattern |
| Provenance cell | `cre-platform-erofs-master-landing/apps/core/components/data-studio/ProvenanceCell.tsx` | Table-cell trust micro-UI |
| BOV provenance/export | `cre-platform-erofs-master-landing/apps/core/components/bov/BOVProvenanceCard.tsx`, `BOVExportCard.tsx`, `BOVSectionCard.tsx` | Section review and export gate patterns |
| Trust tier badge | `cre-platform-erofs-master-landing/apps/core/components/voltron/TrustTierBadge.tsx` | AUTO/NOTIFY/HITL/BLOCK review posture labels |
| Motion tokens | `cre-platform-erofs-master-landing/apps/core/lib/motion-tokens.ts` | Restrained framer-motion presets and reduced-motion handling |
| Command palette | `cre-platform-erofs-master-landing/apps/core/components/navigation/UniversalCommandPalette.tsx` | Future power-user search; permission-filter required |
| Map/heatmap | `cre-platform-erofs-master-landing/apps/core/components/map/PropertyHeatmap.tsx` | Regional opportunity visualization concept |
| Non-production banner | `cre-platform-erofs-master-landing/apps/core/components/surfaces/NonProductionReportingBanner.tsx` | MVP0 stub/demo warning pattern |
| Sophex-named surface | `cre-platform-erofs-master-landing/apps/core/components/sophex/ai/AIUnderwritingInterface.tsx` | Existing Sophex UI stub; reframe as valuation preview, not approve/reject |
| UX assessment | `cre-platform-erofs-master-landing/apps/core/docs/SOPHEX_OS_UX_ASSESSMENT.md` | Scope warning against importing full OS complexity |

## Finem Fabricator

| Area | Reference path | Why Sophex should inspect it |
| --- | --- | --- |
| Control plane overview | `finem_factory_mvp/docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Workflow/agent orchestration doctrine |
| Evidence toolkit | `finem_factory_mvp/agents/DatabaseEvidenceToolkit_MCP/` | Evidence envelope and audit receipt patterns |
| Analysis OS contracts | `finem_factory_mvp/src/lib/analysis-os/` | Report/analysis contract shapes |
| Mission control UI | `finem_factory_mvp/mission_control_bridge/templates/index.html` | Operator control-panel inspiration only |

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
- Sister repos may be on dirty or non-`master` branches; harvest doctrine still applies, but no runtime coupling is authorized.
- Sophex inherits patterns and contracts, not copied components, migrations, queues, or production data.
