# CRE Underwriting Harvest Annex Provisional

This annex records underwriting concepts harvested from `C:\Projects\p51 Site Selection Tool\cre-platform`.
It is a **provisional** harvest because this path is a working tree, not the clean authoritative CRE checkout used by prior Sophex packets.
It does not authorize code copying, schema work, migrations, generated clients, runtime imports, provider calls, queues, production services, or deploys.

## Source Posture

| Signal | Finding |
| --- | --- |
| Source path | `C:\Projects\p51 Site Selection Tool\cre-platform` |
| Git status | Authoritative cleanliness was not established for this underwriting annex. Prior P51 harvest notes recorded untracked `.tmp` artifacts, so this remains provisional. |
| Trust level | Provisional concept harvest only. |
| Use in Sophex | Docs/contracts/UX doctrine and future ticket ideas. |
| Do not use for | Prisma/schema, migrations, Excel/Python runtime, queue/provider runtime, production underwriting logic. |

## High-Value Underwriting Concepts

### Two-Surface Underwriting UX

CRE separates underwriting into:

- **Deal tab preview**: status, readiness, and deep-link entry point.
- **Deep workstation**: assumptions, evidence, scenario comparison, approvals, validation gates, and export handoff.

Sophex should adapt this as:

- Public/property preview with light readiness labels.
- Authenticated valuation/report workbench with source posture, assumptions, scenario comparison, review state, and export policy.

### Readiness Ladder

CRE underwriting uses a gated readiness ladder that maps cleanly to Sophex valuation/export readiness:

| CRE readiness step | Sophex adaptation |
| --- | --- |
| Assumptions complete | Required valuation assumptions are present and labeled with source posture. |
| Evidence linked | Property, comps, public baseline, and private observations have permitted source refs. |
| Scenarios compared | Scenario or sensitivity outputs exist and are labeled advisory. |
| Approvals in flight | Review authority has approved private-use/public projection where required. |
| BOV/report generated | Report artifact or preview exists, still gated by export/share policy. |

### Workflow Gates

CRE gates combine machine-checkable status, severity, and next-best actions. Sophex should define analogous gates:

- Required fields.
- Required public/private source refs.
- Source-rights and provider restrictions.
- Reviewer approval or publication hold.
- Export/share consent.
- Formula or model integrity for valuation outputs.

Gate severity should be explicit: `info`, `warn`, `block`.

### Version Governance

CRE distinguishes compute/version records from deal-scoped workflow records. Sophex should not copy the ID model, but should adopt the concept of a governed valuation version:

- Actor context.
- Assumptions.
- Results.
- Scenario set.
- Source bundle snapshot.
- Change summary.
- Policy tier.
- Review status.
- Export/readiness status.
- Receipt refs.

### Evidence Snapshot At Decision Time

CRE export/approval flows emphasize preserving evidence state at the governed decision moment. Sophex should adopt this rule:

- Public projection and export decisions should reference a permission-filtered evidence snapshot.
- Live source links may inform draft views but should not silently change an approved/exported artifact.
- Revoked/superseded evidence remains auditable but must not be reused for public projection.

### Scenario Modeling With Advisory Posture

Sensitivity grids, Monte Carlo concepts, and scenario matrices are useful only when labeled correctly:

- Scenario output is advisory until review.
- AI/model confidence is not authority.
- Scenario comparison must trace to assumptions and evidence refs.
- Public-facing copy must avoid appraisal-superiority claims.

### Export Bundle Discipline

CRE export concepts worth adapting:

- Approved-only export.
- Manifest of included sections/sources.
- Checksum/hash for artifacts or source manifests.
- Evidence pack and validation summary.
- Idempotent receipt.

Sophex MVP should start with JSON/report preview manifests and redacted receipts before any PDF/ZIP runtime.

## Conceptual Contracts To Add Or Extend

| Contract | Purpose |
| --- | --- |
| `ValuationVersionContract` | Governed valuation snapshot with assumptions, outputs, source refs, review state, and receipts. |
| `UnderwritingReadinessContract` | Ordered readiness gates for assumptions, evidence, scenarios, review, and report/export. |
| `WorkflowGatesContract` | Machine-readable gate list with severity, blockers, next-best actions, and safe copy. |
| `EvidenceSnapshotContract` | Permission-filtered evidence/source snapshot captured at approval/export time. |
| `ScenarioComparisonContract` | Advisory sensitivity/scenario outputs tied to assumption versions and source posture. |
| `ExportManifestContract` | Redacted artifact/source manifest with checksum and receipt reference. |

## Proof-Honest Copy To Reuse

Sophex should use clear state language:

- Advisory.
- Proof pending.
- Source pending.
- Reviewer required.
- Staged.
- Degraded.
- Blocked.
- Approved private-use.
- Approved public projection.

Avoid copy that implies live underwriting authority, production-grade model certainty, completed export, or appraisal replacement.

## Do Not Copy

| Source concept | Reason |
| --- | --- |
| CRE Prisma/schema and migrations | Sophex schema gate is closed and CRE internal model is not a public marketplace model. |
| Excel/Python underwriting engine | Runtime compute authority is CRE-specific and not approved for Sophex. |
| Agent orchestration or AI approve/reject flows | Sophex public trust model requires HITL/policy authority, not autonomous approval tone. |
| Deprecated or mock underwriting APIs | CRE discovery includes mixed canonical, partial, deprecated, and mock routes. |
| Internal IC approval workflow | Sophex needs public/source-owner/org/partner permissions, not CRE internal deal approval semantics. |
| Raw portfolio risk/Monte Carlo runtime | Future-gated and must be advisory with provenance. |
| Archive folders and stale schema fragments | Explicit stale/forensic risk. |

## Recommended Sophex Tickets

Expanded Composer-ready versions of these tickets live in [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md).

| Ticket | Scope |
| --- | --- |
| `SOPHEX-UX-READINESS` | Add a prototype readiness rail from assumptions to export using proof-honest copy. |
| `SOPHEX-CONTRACT-GATES` | Add mock `WorkflowGatesContract` with severity, blockers, and next-best actions. |
| `SOPHEX-CONTRACT-VALUATION-VERSION` | Add `ValuationVersionContract` and tests around source snapshots. |
| `SOPHEX-CONTRACT-EXPORT-MANIFEST` | Add approved-only export manifest and checksum concept to report/export simulator. |
| `SOPHEX-PROVENANCE-LABELS` | Expand provenance labels for assumptions, as-of dates, source family, and confidence. |
| `SOPHEX-TIER-HITL` | Adapt tier routing to HITL review policy without auto-approval. |
| `SOPHEX-HARVEST-REBASE` | Re-run this harvest against a clean authoritative CRE checkout before schema/runtime adoption. |

## Authoritative Rerun Checklist

Before this provisional underwriting annex can become authoritative:

1. Confirm the CRE source path, branch, commit hash, and upstream status.
2. Confirm the source tree is clean or record all dirty/untracked artifacts.
3. Inventory underwriting routes, docs, components, contract references, test files, and deprecated/archive paths.
4. Identify stale, mock, deprecated, or internal-only underwriting APIs before any Sophex adoption.
5. Exclude Prisma/schema, migrations, Excel/Python runtime, internal IC approval semantics, and AI approve/reject flows.
6. Diff authoritative findings against this provisional annex.
7. Update topic docs once, then mark this annex superseded if an authoritative packet replaces it.

No schema, runtime, calculation engine, or provider adoption is authorized until that rerun and operator approval happen.

## Classification For Future Schema Gate

| CRE underwriting concept | Sophex classification |
| --- | --- |
| Readiness ladder | Reuse concept. |
| Workflow gates with severity | Reuse concept. |
| Evidence snapshots | Adapt for public/source-rights model. |
| Version governance | Adapt; avoid CRE internal ID semantics. |
| Export manifest/checksum | Reuse concept, start JSON/mock only. |
| Sensitivity/scenario compare | Adapt with advisory labels. |
| CalculationVersion/Excel artifact | Exclude runtime; adapt only as valuation artifact metadata. |
| AI approve/reject | Exclude. |
| Internal IC approval workflow | Adapt only after Sophex actor model review. |

## Sophex Adoption Rule

CRE underwriting should inform Sophex as a governed valuation spine:

`assumptions -> evidence snapshot -> calculations/scenarios -> gates -> review -> report/export receipt`

It should not become a copied runtime, schema, or internal CRE approval workflow.
