# CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET

> **Superseded — use [CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CONTENT_ENGINE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md).** Canonical integration: `docs/HARVEST_DOC_HIERARCHY.md`.

**Mode:** `CONTENT_ENGINE_TO_SOPHEX_READ_ONLY_HARVEST`  
**Source:** `C:\Projects\Sophex Marketplace and Content Engine\Content Engine\`  
**Harvest date:** 2026-05-22  
**Status:** Reference-only. Untracked folder. No runtime implementation.

---

## Location Check

| Check | Result |
| --- | --- |
| Path | `Content Engine/` (8 markdown reference docs) |
| Git repo | Parent Sophex repo; folder untracked |
| Branch | `master` |
| Assigned lane | Reference harvest for Sophex docs |
| Collision posture | Marketing/interactive UX doctrine only |

---

## 1. Content Engine Executive Takeaway For Sophex

### Best content/marketplace ideas to borrow

1. **Interactive evidence-first reports** — comparison dashboards, heat maps, drill-down metrics beat static essays.
2. **Outcome-first hero + segment selector** — investor/broker/advisor relevance without heavy signup.
3. **Public property intelligence / market pages** — SEO/GEO surfaces with **public baseline only**.
4. **Soft then hard lead capture** — preview → save → upload → export ladder.
5. **Mid-article and progressive CTAs** — multiple capture points with progressive profiling.
6. **Gated export as value exchange** — online partial view; PDF/export gates account + consent.
7. **Comparison + regional heat map widgets** — reusable for comps and market context.
8. **Authority labels and proof above fold** — citations, freshness, review posture before CTAs.
9. **Content flywheel → data flywheel** — reports → leads → comp contribution → proprietary dataset (permissioned).
10. **Analytics loop without send automation** — track engagement first; defer email/CRM.

### Unsafe until consent/legal/data-rights gates clear

1. Auto email nurture (5–21 day drips, Salesforce/HubSpot sync).
2. Syndication of user-contributed or private comp data to Medium/LinkedIn/publications.
3. SEO indexing of user-submitted facts before visibility rules.
4. Public master comps or crowdsourced edits without review.
5. Exit-intent popups before privacy/terms are clear.
6. Scraping/third-party data assumptions (CoStar, SEC) without licensing.
7. “Better than appraisal” marketing claims.
8. Free tier = all uploads public without explicit opt-in.
9. CRM lead scoring driving outbound without suppression/unsubscribe/audit.
10. Paid ads/retargeting using contributed intelligence.

---

## 2. Public Marketplace / SEO Surface Ideas

| Concept | Source doc | Sophex adaptation | Privacy caveat | Future gate |
| --- | --- | --- | --- | --- |
| Public property intelligence pages | `MARKET_RESEARCH_STRATEGY.md`, `EXPANSION_STRATEGY_PHASE_2_3.md` | `/property/[id]` public baseline + upload CTA | Never index private observations | Visibility + licensing |
| Market pages | Same | Regional aggregated stats only | No user comp details in aggregates | Aggregation policy |
| Tenant/asset comparison pages | `UX_CONVERSION_DESIGN_DEEP_DIVE.md`, `INTERACTIVE_CONTENT_TECH_BLUEPRINT.md` | Public baseline + reviewed comps only | User comps private until reviewed | Comp review workflow |
| Interactive reports | UX + blueprint docs | Evidence-first valuation/market report | Claims trace to visible evidence | HITL + report contract |
| Valuation previews | Expansion + executive summary | Partial preview for contribution exchange | No leak of private model/user data | Legal terms |
| Gated exports | UX doc, `CONTENT_ENGINE_TECH_SPEC.md` | Export gated by permissions | Export audit required | Idempotency on export |
| User contribution flywheel | Expansion strategy | Free valuation for docs/comps | Explicit contribution terms | Phase 5 privacy hardening |
| SEO/GEO content engine | `MARKET_RESEARCH_STRATEGY.md`, tech spec | Operator-authored public pages only | E-E-A-T + human review | Content review workflow |

---

## 3. Interactive Frontend Patterns

| Pattern | Source | Sophex adaptation | MVP0 mock safe? |
| --- | --- | --- | --- |
| Comparison dashboard | `INTERACTIVE_CONTENT_TECH_BLUEPRINT.md` | Compare tenants/comps/properties | Yes — sample data |
| Heat map / regional map | Blueprint + UX doc | Cap-rate/opportunity map | Yes — mock GeoJSON |
| Filters/sort/search | Blueprint, UX doc | Property/comp/market filters | Yes |
| Personalized report builder | Executive summary, UX doc | Segment-based report sections | Yes — UI prototype |
| Data visualization | Blueprint (Recharts) | Cap trends, comp distributions | Yes |
| Mobile conversion layout | UX doc | Swipe comparison, sticky CTA | Yes |
| CTA placement | UX doc | Hero → upload → save → export | Partial — consent copy needed |
| Progressive disclosure | Blueprint InvestorForm | 3-field first, expand on return | Yes |

---

## 4. Report / Export / Lead Capture Patterns

| Category | Guidance |
| --- | --- |
| **Borrow** | Save report, progressive form, internal engagement scoring, citation/warning report pattern, admin analytics concept, A/B hooks |
| **Requires consent** | Email capture, syndication, model training use, third-party report share, retargeting |
| **Requires audit/idempotency** | Export/download/share, account+upload binding, comp submission affecting visibility, publish/contribute actions |
| **Must stay disabled** | n8n nurture, CRM sync, provider/send, exit-intent email, public indexing of contributions, syndication, live paid ads |
| **Mock first** | Comparison dashboard, heat map, property page, valuation preview, gated export stopping at consent, upload UI, contribution flywheel UX |

---

## 5. Privacy / Consent / Send-Automation Warnings

1. No send automation until provider, queue, worker, consent, suppression, unsubscribe, idempotency, audit, and operator approval are proven.
2. No syndication of private observations.
3. No indexing user-contributed facts before visibility rules.
4. No public terms ambiguity on free-tier contribution.
5. No CRM/outbound coupling on first launch.
6. No scraping/legal assumptions without licensing review.
7. No raw PII in analytics events.
8. No gated PDF without audit trail.
9. No social proof using private user counts without aggregation.
10. No contributor identity exposure without permission.

---

## 6. Sophex Doc Updates (Applied)

- `docs/VALUATION_REPORTING_PRODUCT.md`
- `docs/DATA_PRIVACY_AND_MARKETPLACE_RULES.md`
- `docs/FRONTEND_UX_INHERITANCE.md`
- `docs/INITIAL_ROADMAP.md`
- `docs/SOPHEX_MVP0_SCREEN_MAP.md`
- `DECISIONS.md` (ADR-0015, ADR-0016)

---

## 7. File Path Appendix

| Area | Path | Why Sophex should inspect it |
| --- | --- | --- |
| Market research strategy | `Content Engine/MARKET_RESEARCH_STRATEGY.md` | SEO/GEO funnel architecture |
| Expansion flywheel | `Content Engine/EXPANSION_STRATEGY_PHASE_2_3.md` | Comps marketplace vision |
| Executive summary | `Content Engine/EXECUTIVE_SUMMARY_INTERACTIVE_CONTENT.md` | Interactive vs static ROI |
| UX conversion | `Content Engine/UX_CONVERSION_DESIGN_DEEP_DIVE.md` | Hero, CTAs, mobile, personalization |
| Interactive blueprint | `Content Engine/INTERACTIVE_CONTENT_TECH_BLUEPRINT.md` | Component shapes (conceptual) |
| Tech spec | `Content Engine/CONTENT_ENGINE_TECH_SPEC.md` | Pipeline concepts — **not** authorized SQL/n8n |
| Executive brief | `Content Engine/EXECUTIVE_BRIEF_CONTENT.md` | One-page funnel summary |
| 90-day plan | `Content Engine/90_DAY_IMPLEMENTATION.md` | Sequencing reference only |

---

## Final Recommendation

Use Content Engine for **public interactive UX, SEO surface design, and contribution exchange framing**. Defer all send, nurture, CRM, and syndication automation until consent and privacy gates are documented and approved.
