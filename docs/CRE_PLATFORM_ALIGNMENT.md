# CRE Platform Alignment

The CRE Platform remains the governed internal professional operating system and canonical substrate for CRE evidence, source observations, comp intelligence, audit, idempotency, and correlation.

## Alignment Posture

Sophex should later integrate with CRE through approved APIs, contracts, event boundaries, or read models. It must not directly couple to CRE production databases during setup, and it must not copy production truth into Sophex by hand.

## Future Concepts To Align

- Source observation ledger.
- Canonical document evidence.
- `documents.file_ref` style evidence references.
- Document evidence registry.
- Operational receipts.
- Idempotency keys.
- Correlation identifiers.
- Audit trails.
- Comp intelligence contracts.
- Read-only proof before schema/data work.
- Private operator review workflows.
- Relationship-truth doctrine: do not collapse notes, comments, audit events, and evidence into one feed.
- BOV/UW report section review and export gate patterns.
- Provenance UI patterns: source citation, provenance cell, provenance modal, section approval cards.
- Shell vs workstation separation: lightweight public shell vs authenticated workspace.
- Motion tokens and reduced-motion handling for restrained transitions.
- Non-production/stub banners on reporting and preview surfaces.

## UX And Design-System Reference (Doctrine Only)

CRE `apps/core` is the richest sister-project frontend reference. Sophex should inherit patterns from:

- `components/ui/source-citation.tsx` — inline evidence links.
- `components/data-studio/ProvenanceCell.tsx` — table-cell trust micro-UI.
- `components/alphaDrop/v2/ProvenanceModal.tsx` — deep provenance drill-down.
- `components/bov/BOVSectionCard.tsx`, `BOVExportCard.tsx`, `BOVProvenanceCard.tsx` — report review and export gate.
- `components/providers/RootProviders.tsx` — public vs operator shell split.
- `lib/motion-tokens.ts` — restrained animation presets.
- `components/surfaces/NonProductionReportingBanner.tsx` — MVP0 stub warning.

Do not copy CRE components into Sophex runtime. Reimplement against Sophex contracts when implementation is authorized.

## Harvest Warnings

- CRE harvest was performed read-only; sister repo may be on a non-`master` branch with local modifications.
- `prisma/schema.prisma` and internal evidence tables are **conceptual reference only** — no schema copy into Sophex.
- CRE `components/sophex/ai/AIUnderwritingInterface.tsx` exists as a named stub; reframe as valuation preview with evidence tabs, not autonomous approve/reject UX.

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
