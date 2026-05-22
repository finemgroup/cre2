# Harvest Doc Hierarchy

Single map of **where Sophex doctrine lives** after sister-project harvest integration. Prevents drift across overlapping packets and alignment docs.

## Rule

1. **Packets** = source archives + caveats + path appendices. Do not copy their body text into other docs.
2. **This hierarchy + `CROSS_PROJECT_HARVEST.md`** = integrated summary and cross-links.
3. **Topic docs below** = canonical place to update doctrine when harvest findings change.
4. **Superseded drafts/provisional packets** remain archives only. Use the current authoritative/reference packet for each source.

## Source Archives

| Packet | File | Trust |
| --- | --- | --- |
| CRE | [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) | ✅ Clean CRE `master` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c` |
| Fabricator | [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | ⚠️ Dirty Fabricator worktree |
| Content Engine | [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md) | ⚠️ Untracked reference folder |
| UX/Motion | [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | ⚠️ Same stale CRE checkout |

Index: [HARVEST_PACKET_INDEX.md](HARVEST_PACKET_INDEX.md)

## Integrated Summary

| Doc | Role |
| --- | --- |
| [CROSS_PROJECT_HARVEST.md](CROSS_PROJECT_HARVEST.md) | Cross-project summary, gap list, carry-forward / do-not-carry |
| [SISTER_PROJECT_SOURCE_MAP.md](SISTER_PROJECT_SOURCE_MAP.md) | Sister-project paths and why they matter |
| [SOPHEX_REFERENCE_PATHS.md](SOPHEX_REFERENCE_PATHS.md) | Workspace paths and forbidden zones |
| [SOPHEX_CONCEPTUAL_CONTRACTS.md](SOPHEX_CONCEPTUAL_CONTRACTS.md) | Conceptual contracts (no schema syntax) |

## Topic → Canonical Doc

| Topic | Canonical doc |
| --- | --- |
| CRE alignment & evidence substrate | [CRE_PLATFORM_ALIGNMENT.md](CRE_PLATFORM_ALIGNMENT.md) |
| Fabricator workflow/control-plane | [FINEM_FABRICATOR_ALIGNMENT.md](FINEM_FABRICATOR_ALIGNMENT.md) |
| Trust, permissions, visibility | [TRUST_AND_PERMISSIONS_MODEL.md](TRUST_AND_PERMISSIONS_MODEL.md) |
| Evidence & observations | [EVIDENCE_AND_OBSERVATION_MODEL.md](EVIDENCE_AND_OBSERVATION_MODEL.md) |
| Document ingestion | [DOCUMENT_INGESTION_MODEL.md](DOCUMENT_INGESTION_MODEL.md) |
| Agent roles & HITL | [AGENT_WORKFLOW_CONCEPTS.md](AGENT_WORKFLOW_CONCEPTS.md) |
| Valuation & reporting product | [VALUATION_REPORTING_PRODUCT.md](VALUATION_REPORTING_PRODUCT.md) |
| Frontend UX (public shell, comparison, upload) | [FRONTEND_UX_INHERITANCE.md](FRONTEND_UX_INHERITANCE.md) |
| Motion & progress UI | [MOTION_AND_INTERACTION_GUIDELINES.md](MOTION_AND_INTERACTION_GUIDELINES.md) |
| Trust badges & provenance UI | [SOPHEX_TRUST_UI_GUIDELINES.md](SOPHEX_TRUST_UI_GUIDELINES.md) |
| MVP0 screens | [SOPHEX_MVP0_SCREEN_MAP.md](SOPHEX_MVP0_SCREEN_MAP.md) |
| Privacy, consent, marketplace rules | [DATA_PRIVACY_AND_MARKETPLACE_RULES.md](DATA_PRIVACY_AND_MARKETPLACE_RULES.md) |
| Future schema concepts (conceptual only) | [FUTURE_SCHEMA_CONCEPTS.md](FUTURE_SCHEMA_CONCEPTS.md) |
| Roadmap phases | [INITIAL_ROADMAP.md](INITIAL_ROADMAP.md) |
| Non-goals | [NON_GOALS.md](NON_GOALS.md) |
| Open decisions | [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) |
| ADRs | [DECISIONS.md](../DECISIONS.md) |

## Authoritative Rerun Checklist (Future)

When clean sister checkouts exist, create `*_HARVEST_PACKET_AUTHORITATIVE.md`, diff against provisional, update topic docs once, then mark provisional files superseded. CRE now follows this pattern; Fabricator and UX/motion still need clean-source reruns.
