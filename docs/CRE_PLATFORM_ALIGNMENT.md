# CRE Platform Alignment

The CRE Platform remains the governed internal professional operating system and canonical substrate for CRE evidence, source observations, comp intelligence, audit, idempotency, and correlation.

## Alignment Posture

Sophex should later integrate with CRE through approved APIs, contracts, event boundaries, or read models. It must not directly couple to CRE production databases during setup, and it must not copy production truth into Sophex by hand.

## Future Concepts To Align

- Source observation ledger.
- Canonical document evidence.
- `documents.file_ref` style evidence references.
- Operational receipts.
- Idempotency keys.
- Correlation identifiers.
- Audit trails.
- Comp intelligence contracts.
- Private operator review workflows.

## Setup-Phase Prohibitions

- No CRE production DB reads or writes.
- No schema migrations.
- No Prisma migrate, db push, migrate resolve, generated-client edits, or destructive DDL.
- No production service calls.
- No direct coupling between Sophex docs and CRE runtime packages.

## Expected Future Direction

Sophex should consume or align with governed CRE evidence and observation APIs once those contracts are intentionally designed. Sophex public/private marketplace behavior should remain separate from CRE internal operator workflows even when they share evidence concepts.
