# CRE Platform Alignment

The CRE Platform remains the governed internal professional operating system and canonical substrate for CRE evidence, source observations, comp intelligence, audit, idempotency, and correlation.

**Authoritative harvest:** [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) from clean `C:\Projects\cre-platform-master-clean` on `master` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c`.

## Alignment Posture

Sophex should later integrate with CRE through approved APIs, contracts, event boundaries, or read models. It must not directly couple to CRE production databases during setup, and it must not copy production truth into Sophex by hand.

## Future Concepts To Align

- Relationship Truth Doctrine: notes, documents, comments, activities, evidence, receipts, and projections remain distinct.
- Document byte-pointer authority (`documents.file_ref`) with evidence metadata and policy separate from storage bytes.
- DocumentEvidence-style registry for source family, hashes, review/promotion, receipts, idempotency, correlation, supersession, freshness, and HITL state.
- Staged import and document extraction review: upload -> candidates -> governed promotion.
- Operational and policy receipts with redacted evidence refs, replay hashes, idempotency keys, and correlation identifiers.
- Comp intelligence contracts with source, confidence, verification, provider-rights, adjustment grids, and BOV/report linkage.
- Audit, activity, comments, notes, and document annotations as separate feeds.
- Permission-filtered retrieval across chunks, embeddings, graph/RAG, command palette, reports, and exports.
- Read-only proof before schema/data work.
- Private operator review workflows.
- BOV/UW report section review and export gate patterns.
- Provenance UI patterns: source citation, provenance cell, provenance modal, section approval cards.
- Shell vs workstation separation: lightweight public shell vs authenticated workspace.
- Motion tokens and reduced-motion handling for restrained transitions.
- Non-production/stub banners on reporting and preview surfaces.

## UX And Design-System Reference (Doctrine Only)

CRE `apps/core` is the richest sister-project frontend reference. Sophex should inherit patterns from:

- `apps/core/components/providers/RootProviders.tsx`, `SessionGate.tsx` — public/auth route shell vs authenticated shell.
- `apps/core/lib/navigation/os-workstation-matrix.ts`, `operating-lenses.ts` — route role/maturity and surface classification.
- `components/ui/source-citation.tsx`, `apps/core/components/documents/staged-import/SourceCitationList.tsx` — inline evidence links.
- `apps/core/components/data-studio/ProvenanceCell.tsx` — table-cell trust micro-UI.
- `apps/core/components/alphaDrop/v2/ProvenanceModal.tsx` — deep provenance drill-down.
- `apps/core/components/bov/BOVSectionCard.tsx`, `BOVExportCard.tsx`, `BOVProvenanceCard.tsx`, `apps/core/lib/bov/output-guard.ts` — report review, source-rights filtering, and export gate.
- `apps/core/components/documents/generated-document-authority/` — publication holds, file-ref authority, provenance tables.
- `apps/core/lib/motion-tokens.ts`, `apps/core/components/os/OSMotion.tsx` — restrained animation presets, sheets, focus traps.
- `apps/core/components/surfaces/NonProductionReportingBanner.tsx` — MVP0 stub warning.
- `apps/core/app/map/MapClient.tsx`, `apps/core/components/map/selected-object/` — map with evidence drawer.

Do not copy CRE components into Sophex runtime. Reimplement against Sophex contracts when implementation is authorized.

## Harvest Warnings

- CRE authoritative harvest was performed read-only from a clean `master` clone. It still authorizes **docs doctrine only**, not implementation.
- `prisma/schema.prisma` and internal evidence tables are **conceptual reference only** — no schema copy into Sophex.
- CRE `components/sophex/ai/AIUnderwritingInterface.tsx` exists as a named stub; reframe as valuation preview with evidence tabs, not autonomous approve/reject UX.
- `packages/shared-shell/**` was not present on clean master; shell references should point to `apps/core/components/**` and navigation libs.

## Setup-Phase Prohibitions

- No CRE production DB reads or writes.
- No schema migrations.
- No Prisma migrate, db push, migrate resolve, generated-client edits, or destructive DDL.
- No production service calls.
- No direct coupling between Sophex docs and CRE runtime packages.

## Expected Future Direction

Sophex should consume or align with governed CRE evidence and observation APIs once those contracts are intentionally designed. Sophex public/private marketplace behavior should remain separate from CRE internal operator workflows even when they share evidence concepts.

## Do Not Copy Directly

- Do not expose CRE internal document evidence directly to public users.
- Do not import internal CRE comps or user-private comps into Sophex without a contract.
- Do not assume internal CRE roles map cleanly to public marketplace roles.
- Do not expose raw operational logs or internal receipt implementation to public users.
- Do not couple Sophex to CRE production databases during setup or MVP0.
