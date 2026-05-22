# CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_REFERENCE

> **This packet is reference-only.** It was generated from `C:\Projects\Sophex Marketplace and Content Engine\Content Engine`, an untracked reference folder inside the parent Sophex repo, not from an authoritative runtime repository. Use as product, UX, content, and marketplace strategy input only. Do not treat SQL, n8n, CRM, send automation, analytics, or runtime implementation details as authorized for Sophex setup.

**Mode:** `SOPHEX_CONTENT_ENGINE_HARVEST_INTEGRATION` / `DOCS_ONLY`  
**Harvest date:** 2026-05-22  
**Status:** Reference-only. **Not authoritative runtime.**

---

## Location Check

| Check | Result |
| --- | --- |
| Source path | `Content Engine/` (8 markdown strategy docs, untracked in Sophex repo) |
| Parent repo | `C:\Projects\Sophex Marketplace and Content Engine` @ `master` |
| Sister runtime | None — reference markdown only |
| Canonical integration | Topic docs per [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md) |

---

## 1. Executive Takeaway For Sophex

Content Engine reference materials describe how Finem-style interactive market research can outperform static CRE content for engagement and conversion. Sophex should borrow **product strategy, UX doctrine, and marketplace concepts** — not SQL schemas, n8n workflows, CRM sync, email nurture, or syndication automation.

### Best ideas to borrow

1. **Interactive evidence-first reports** — comparison dashboard, regional heat map, metric drill-down, scannable callouts.
2. **Outcome-first hero + segment selector** — investor / broker / advisor paths with proof above fold.
3. **Partial valuation preview** — top drivers, confidence band, comp preview before full report unlock.
4. **Soft-then-hard CTA ladder** — preview → save report → upload docs/comps → gated export.
5. **Contribution exchange** — upload documents or comps to unlock report depth (explicit terms required).
6. **Gated PDF/export/share** — permissioned value exchange with consent screen and audit posture.
7. **Public property/market pages** — SEO/GEO surfaces using **public baseline or approved aggregates only**.
8. **Progressive profiling forms** — minimal fields first; progressive disclosure for deeper capture.
9. **Mobile conversion patterns** — sticky soft CTA, swipe comparison, collapsible evidence panels.
10. **White-label broker report possibility** — partner branding without hiding warnings, citations, or permission limits.
11. **Authority labels and source citations** — warnings, `reviewRequired`, and freshness visible in report UX.
12. **Content flywheel → permissioned data flywheel** — operator-authored public surfaces separate from user contributions.

### Deferred / forbidden for Sophex setup

- Email nurture sequences and auto-email pipelines.
- CRM sync (Salesforce, HubSpot, etc.).
- Provider/send automation and queue-driven outbound.
- n8n workflow runtime, SQL pipeline implementation, Content Engine tech-spec deployment.
- Syndication of user-derived or private observations to third-party channels.
- Public indexing of user-contributed facts before visibility/review/source-use gates exist.
- Exit-intent capture, retargeting, paid ads using contributed intelligence.
- Scraping without license; appraisal-superiority claims; implicit free-tier public contribution.
- Outbound lead scoring triggers before consent stack clears.

**Canonical integration:** `VALUATION_REPORTING_PRODUCT.md`, `FRONTEND_UX_INHERITANCE.md`, `DATA_PRIVACY_AND_MARKETPLACE_RULES.md`, `INITIAL_ROADMAP.md`, `NON_GOALS.md`.

---

## 2. Public Marketplace / SEO Surface Ideas

| Concept | Source doc | Sophex adaptation | Future gate |
| --- | --- | --- | --- |
| Property intelligence pages | `MARKET_RESEARCH_STRATEGY.md` | Public baseline + upload CTA | Visibility rules |
| Market/tenant research pages | `MARKET_RESEARCH_STRATEGY.md`, `EXPANSION_STRATEGY_PHASE_2_3.md` | Aggregated stats only; operator-authored | Data rights, aggregation policy |
| Comparison pages | `UX_CONVERSION_DESIGN_DEEP_DIVE.md` | Reviewed/public comps only | Comp review, HITL |
| Interactive reports | `EXECUTIVE_SUMMARY_INTERACTIVE_CONTENT.md`, `INTERACTIVE_CONTENT_TECH_BLUEPRINT.md` | Evidence-first report, not static essay | HITL, citations |
| Valuation previews | `EXPANSION_STRATEGY_PHASE_2_3.md` | Contribution exchange preview | Legal terms |
| Gated exports | `CONTENT_ENGINE_TECH_SPEC.md`, UX docs | Permission + audit export | Idempotency, consent |
| Contribution flywheel | `EXPANSION_STRATEGY_PHASE_2_3.md` | Explicit upload → unlock terms | Phase 5 privacy |
| SEO/GEO engine | `MARKET_RESEARCH_STRATEGY.md` | Operator-authored + public baseline only | Content review |

---

## 3. Interactive Frontend Patterns

From UX and blueprint reference docs (conceptual only):

| Pattern | Sophex use | MVP0 posture |
| --- | --- | --- |
| Outcome-first hero | Public landing, property pages | Mock + stub banner |
| Segment selector | Investor/broker/advisor | UI only |
| Comparison dashboard | Comp sets, tenant/property compare | Sample/mock data |
| Regional heat map | Market density, cap-rate bands | Anonymized/sample labels |
| Filters / sort / search | Comp and property discovery | Mock-safe |
| Personalized report builder | Section toggles before export | UI only |
| Progressive form | Upload and save-report flows | Stops at consent gate |
| Scannable callout layout | Report and market pages | Doctrine |
| Mobile sticky CTA | Comparison and property pages | Mock-safe |

**Do not duplicate full pattern specs here.** See `FRONTEND_UX_INHERITANCE.md` and `MOTION_AND_INTERACTION_GUIDELINES.md`.

---

## 4. Report / Export / Lead Capture

| Category | Guidance |
| --- | --- |
| **Borrow** | Save report, progressive form, internal engagement scoring (no outbound trigger), A/B hooks for copy |
| **Requires consent** | Email capture, syndication, model training, third-party share |
| **Requires audit** | Export, download, share, upload binding, comp visibility changes |
| **Disabled in setup** | n8n nurture, CRM, provider/send, exit-intent, public indexing of contributions, syndication, paid ads |
| **Mock first** | Comparison, heat map, property page, preview, export gate UI, upload/contribution exchange UI |

### Gated export posture

Gated export is a **permissioned, audited value exchange** — not a simple lead form. Export UI may show section toggles (charts, map, table, statistics), consent copy, and disabled export until review/consent preconditions pass.

### Contribution exchange

Upload docs/comps → unlock report depth is a core flywheel concept. Terms must state visibility (public vs private), review requirements, and what Sophex may do with contributed material.

---

## 5. Privacy / Send-Automation Warnings

- No send until provider, queue, worker, consent, suppression, unsubscribe, idempotency, audit, and operator approval are proven.
- No syndication of private observations.
- No indexing user facts before visibility rules and source-use terms exist.
- No ambiguous free-tier public contribution terms.
- No CRM coupling at launch.
- No raw PII in analytics pipelines.
- Engagement scoring may inform internal prioritization only until consent stack clears outbound.

---

## 6. Reference File Appendix (Untracked Source Folder)

| Path | Purpose | Sophex use |
| --- | --- | --- |
| `Content Engine/MARKET_RESEARCH_STRATEGY.md` | SEO/GEO funnel, syndication vision | Strategy only — defer syndication/send |
| `Content Engine/EXPANSION_STRATEGY_PHASE_2_3.md` | Marketplace flywheel, phases | Contribution exchange doctrine |
| `Content Engine/EXECUTIVE_SUMMARY_INTERACTIVE_CONTENT.md` | Interactive ROI, design philosophy | UX doctrine |
| `Content Engine/UX_CONVERSION_DESIGN_DEEP_DIVE.md` | Conversion UX, hero, CTAs | Frontend inheritance |
| `Content Engine/INTERACTIVE_CONTENT_TECH_BLUEPRINT.md` | Component shapes | Conceptual UI only |
| `Content Engine/CONTENT_ENGINE_TECH_SPEC.md` | Pipeline, SQL, n8n | **Not authorized** for Sophex setup |
| `Content Engine/EXECUTIVE_BRIEF_CONTENT.md` | Funnel summary | Strategy reference |
| `Content Engine/90_DAY_IMPLEMENTATION.md` | Sequencing | Roadmap reference only — no runtime |

---

## 7. Relationship To Other Packets

| File | Relationship |
| --- | --- |
| [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) | Prior provisional archive; this REFERENCE file is the operator-facing reference packet with explicit untracked-folder caveat |
| [HARVEST_DOC_HIERARCHY.md](HARVEST_DOC_HIERARCHY.md) | Canonical map — update topic docs, not duplicate packet bodies |
| [CROSS_PROJECT_HARVEST.md](CROSS_PROJECT_HARVEST.md) | Integrated cross-project summary |

---

## Final Recommendation

Use Content Engine reference material for **public interactive UX, SEO surface design, gated export UX, and contribution exchange doctrine** only. All send/nurture/CRM/syndication/SQL/n8n implementation remains forbidden in Sophex setup. Integrated living doctrine lives in topic docs listed in the hierarchy.
