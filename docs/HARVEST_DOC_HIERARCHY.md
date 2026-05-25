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
| Fabricator | [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) | ✅ Clean Fabricator `main` @ `89b2a651a928a2d8cc1c80fba65f0861fc509e09` |
| Content Engine | [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE.md) | ⚠️ Untracked reference folder |
| UX/Motion | [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md) | ✅ Clean CRE `apps/core` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c` |
| P51 CRE Animation | [P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | ⚠️ P51 tracked `master` @ `af4a453b66bb62e79a147cae143dc61ed042906e`; untracked `.tmp` artifacts present |
| CRE Underwriting Annex | [CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md](CRE_UNDERWRITING_HARVEST_ANNEX_PROVISIONAL.md) | ⚠️ Provisional underwriting concept harvest from P51 working tree; docs/contracts only |
| ICSC Map Recovery | [ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](ICSC_MAP_RECOVERY_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | ⚠️ Provisional mapping/GIS concept harvest; no map asset/runtime reuse |

Index: [HARVEST_PACKET_INDEX.md](HARVEST_PACKET_INDEX.md)

## Integrated Summary

| Doc | Role |
| --- | --- |
| [CROSS_PROJECT_HARVEST.md](CROSS_PROJECT_HARVEST.md) | Cross-project summary, gap list, carry-forward / do-not-carry |
| [SISTER_PROJECT_SOURCE_MAP.md](SISTER_PROJECT_SOURCE_MAP.md) | Sister-project paths and why they matter |
| [SOPHEX_REFERENCE_PATHS.md](SOPHEX_REFERENCE_PATHS.md) | Workspace paths and forbidden zones |
| [SOPHEX_CONCEPTUAL_CONTRACTS.md](SOPHEX_CONCEPTUAL_CONTRACTS.md) | Conceptual contracts (no schema syntax) |
| [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md) | Composer-ready mock-only ticket cards from the underwriting and GIS harvests |

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
| Motion, progress UI, and high-end animation doctrine | [MOTION_AND_INTERACTION_GUIDELINES.md](MOTION_AND_INTERACTION_GUIDELINES.md) |
| Underwriting readiness, workflow gates, valuation versions | [SOPHEX_CONCEPTUAL_CONTRACTS.md](SOPHEX_CONCEPTUAL_CONTRACTS.md), [VALUATION_REPORTING_PRODUCT.md](VALUATION_REPORTING_PRODUCT.md) |
| Mapping/GIS provenance, trade areas, layer controls | [FRONTEND_UX_INHERITANCE.md](FRONTEND_UX_INHERITANCE.md), [EVIDENCE_PERMISSION_CONTRACTS.md](EVIDENCE_PERMISSION_CONTRACTS.md) |
| Trust badges & provenance UI | [SOPHEX_TRUST_UI_GUIDELINES.md](SOPHEX_TRUST_UI_GUIDELINES.md) |
| MVP0 screens | [SOPHEX_MVP0_SCREEN_MAP.md](SOPHEX_MVP0_SCREEN_MAP.md) |
| Privacy, consent, marketplace rules | [DATA_PRIVACY_AND_MARKETPLACE_RULES.md](DATA_PRIVACY_AND_MARKETPLACE_RULES.md) |
| Future schema concepts (conceptual only) | [FUTURE_SCHEMA_CONCEPTS.md](FUTURE_SCHEMA_CONCEPTS.md) |
| Roadmap phases | [INITIAL_ROADMAP.md](INITIAL_ROADMAP.md) |
| Non-goals | [NON_GOALS.md](NON_GOALS.md) |
| Open decisions | [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) |
| ADRs | [DECISIONS.md](../DECISIONS.md) |

## Authoritative Rerun Checklist (Future)

When clean sister checkouts exist, create `*_HARVEST_PACKET_AUTHORITATIVE.md`, diff against provisional, update topic docs once, then mark provisional files superseded. CRE, Fabricator, and UX/Motion now follow this pattern.
