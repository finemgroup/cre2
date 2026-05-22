# Sophex Trust UI Guidelines

Visual trust language for Sophex MVP0 and later phases. These guidelines inherit CRE UX patterns as **doctrine only**, not copied components.

## Design Principles

1. Evidence before persuasion — show source, confidence, freshness, and review state alongside values.
2. Authority labels are first-class UI — never let public baseline, private submission, and model inference look equivalent.
3. Privacy state is visible — Public, Account-private, Contribution-shared, and Premium-private must be distinguishable.
4. Export and share are gated actions — disabled states must explain why.
5. Non-production surfaces must be obvious — stub/mock/demo banners on MVP0 previews.

## Authority Badge Taxonomy

| Label | Meaning | Typical color posture |
| --- | --- | --- |
| Public baseline | Lawful public record or platform public projection | Neutral / info |
| Licensed provider | Third-party licensed feed | Info |
| User submission | Contributor-uploaded observation | Secondary |
| Platform reviewed | Operator or workflow accepted | Success |
| Unreviewed | Candidate not yet reviewed | Warning outline |
| Stale | Exceeds freshness policy | Warning |
| Disputed | Conflicting observations exist | Error outline |
| Blocked | Cannot be used in outputs | Error |
| Model-inferred | AI/model derived, not verified fact | Purple/info outline |
| Premium-private | Paid-tier private data | Muted + lock icon |
| Candidate evidence only | Extracted/imported evidence not promoted to truth | Warning outline |
| Publication hold | Blocked from public/client/share/export surfaces | Error / blocked |
| Provider-restricted | Licensed source cannot be displayed/exported publicly | Error outline |
| AI estimate needs confirmation | Synthetic value pending human/source confirmation | Purple warning |

Do not rely on color alone; every badge needs readable text.

## Confidence Presentation

- Use confidence to mean **evidence coverage and agreement**, not model bravado.
- Prefer ring or sublabel patterns (CRE `ConfidenceIndicator` doctrine) with source and freshness text.
- Never equate confidence percentage with legal valuation certainty.
- Similarity/match bands (high/medium/low) apply to document citations, not comp quality alone.

## Privacy State Labels

Apply at field, document, comp, and report levels:

- **Public** — safe for anonymous viewers under current policy.
- **Account-private** — visible to submitting account only.
- **Contribution-shared** — shared per explicit contribution terms.
- **Premium-private** — paid-tier private; never shown on public templates.

## Review State Labels

Map to workflow posture inspired by CRE trust tiers (AUTO/NOTIFY/HITL/BLOCK adapted for marketplace):

- **Auto-eligible** — low-risk public baseline only; not for user submissions by default.
- **Notify** — visible internally; may surface to contributor.
- **HITL required** — human review before public use or export.
- **Blocked** — cannot affect reports, exports, or public pages.

## Provenance UI Patterns

### Inline citation
Compact source button linking to document and page (CRE `SourceCitation` pattern).

### Table provenance cell
Value plus source chip, confidence dot, freshness text (CRE `ProvenanceCell` pattern).

### Provenance drawer/modal
Deep drill-down with sources, conflicts, reliability (CRE `ProvenanceModal` pattern).

### Report provenance summary
Section approval counts, source UW/report version reference, export hash (CRE `BOVProvenanceCard` / `BOVExportCard` pattern).

Unauthorized viewers receive filtered provenance only.

Authoritative CRE clean-master also points to source-bundle review panels, generated-document authority panels, provider export readiness banners, and `output-guard` style blocked-output explanations. Sophex should show why a report, public page, share link, or export is blocked rather than hiding the control silently.

## Report And Export Trust

- Section-level approve before export (BOV section card pattern).
- Export button disabled until review complete and consent captured.
- Show content hash or receipt reference after export.
- White-label branding must not hide source limitations or permission boundaries.

## Content Engine / Marketing Trust Boundaries

- Interactive comparison and heat maps may use mock data with explicit sample labels.
- Gated PDF/export requires account and consent copy.
- No exit-intent capture, email nurture, CRM sync, or syndication until consent stack is proven.
- No SEO indexing of user-contributed facts before visibility rules exist.

## Accessibility

- Skip link to main content on all shells.
- Provenance available via click/tap, not hover-only.
- `role="status"` for stub banners and export progress.
- Decorative sparklines and confidence rings need text equivalents nearby.

## Pitfalls (from CRE + Content Engine harvest)

- Gamification, celebration overlays, and pulse loops on financial data.
- Approve/reject AI underwriting tone instead of evidence-first valuation preview.
- Placeholder maps presented as live geo precision.
- Command palette or global search indexing private observations.
- Treating AI confidence badges as authority without review state.
