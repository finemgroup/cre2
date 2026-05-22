# Data Privacy And Marketplace Rules

Sophex can become a data marketplace only if contribution terms, privacy boundaries, and permission enforcement are explicit from the start.

## Contribution Terms

Users must understand what they are contributing and what they receive in return. Free valuation or reporting access in exchange for source documents, comps, or corrections must clearly state whether contributed data may be public, private, shared, anonymized, aggregated, or used internally.

## Private Uploads

Private uploads must not leak to public comps, public reports, partner feeds, or other users. A private lease, rent roll, appraisal, contract, or mortgage can inform that user's report without becoming global marketplace truth.

## Aggregation And Anonymization

Aggregation and anonymization rules must be defined before marketplace launch. Aggregated outputs should prevent reconstruction of private facts, source-owner identity, or deal-specific sensitive values unless permission allows disclosure.

## Source Ownership

Source owners may need controls for visibility, sharing, deletion requests, revocation, attribution, and marketplace participation. Exact rights are open questions until legal and product terms are defined.

## Sends And Automation

No sending or marketing automation may operate without consent, suppression/unsubscribe handling, idempotency, auditability, and operator approval. This applies to email, CRM sync, provider sends, partner notifications, queue-driven workflows, retargeting, and paid ads using contributed intelligence.

Explicitly disabled until gates clear:

- n8n or similar email nurture sequences.
- Salesforce/HubSpot auto-sync.
- Content syndication to Medium/LinkedIn/industry publications when content includes user-derived facts.
- Exit-intent email capture before terms are clear.

## SEO, Indexing, And Syndication

- **No indexing of user-contributed facts** until visibility rules, review states, and source-use terms exist.
- **No syndication of private observations** to third-party channels (Medium, LinkedIn, industry publications, partner feeds).
- **No public terms ambiguity** for free-user uploads — contribution terms must be explicit before capture.
- Content Engine syndication concepts apply to **operator-authored public reports** using public baseline or approved aggregates — not private uploads, comps, or user-derived facts.
- Public market and property pages may be indexed only when they show public baseline or operator-approved aggregates.

## Send Automation Gate

No send automation until **all** of the following are proven:

- Provider integration and queue/worker reliability.
- Consent capture, suppression, unsubscribe, and idempotency.
- Audit trail and operator approval for outbound actions.

This blocks email nurture, CRM-triggered sends, partner notifications, and queue-driven marketing workflows in setup and MVP0.

## Analytics Redaction Rules

- Analytics events must not carry raw PII in public or shared logging pipelines.
- Engagement scoring may be used **internally** for prioritization before outbound is allowed — it must not trigger outbound until consent stack clears.
- Do not attach contributed document content, private comp values, or source-owner identity to analytics payloads.
- A/B test hooks for copy/layout are acceptable in MVP0 prototypes; do not wire conversion events to CRM or email until gates clear.

## Export, Download, And Share Audit

- Export/download/share actions require consent copy where applicable and an audit trail (receipt, hash, or governed action record).
- Gated PDF must not leak private fields into public templates.
- Export actions require idempotency and operator-auditable receipts when implemented.
- Share actions must log actor, artifact, visibility class, and consent posture.

## Engagement Scoring And Outbound

- Internal engagement scoring (page depth, comparison usage, save-report intent) may inform product and sales prioritization.
- **Engagement scoring cannot trigger outbound** (email, CRM tasks, retargeting, syndication) until consent, suppression, unsubscribe, idempotency, audit, and operator approval are proven.

## Fabricator-Derived Privacy And Idempotency Rules (Provisional)

- **Fail-closed idempotency** — duplicate governed actions return prior receipt or reject; never double-promote candidates or double-export.
- **No queue-as-truth** — job/workflow completion does not imply evidence acceptance, public promotion, or export eligibility.
- **No send automation** without full consent, suppression, unsubscribe, idempotency, audit, and operator approval stack.
- **No raw logs in public progress views** — no worker IDs, queue names, stack traces, PII, or secrets in contributor-facing timelines.
- **JobStatusProjection only** — public UI shows sanitized phase labels tied to real transitions or honest indeterminate state.

## Marketplace Rule Of Thumb

The marketplace can reward contribution and improve public intelligence, but it cannot expose private facts across users merely because those facts are valuable.

## Highest-Risk Mistakes To Avoid

- Leaking private observations into public comps.
- Enforcing permissions only in UI.
- Confusing public baseline with private/user-submitted facts.
- Publishing extracted lease or rent roll data without source-use rights.
- Letting free-user contribution terms be broad or implicit.
- Using public search indexing before visibility rules are implemented.
- Treating AI confidence as authority.
- Storing raw private payloads where references, hashes, or evidence records are sufficient.
- Feeding model training with user contributions without explicit consent.
- Automating sends without consent, suppression, unsubscribe, idempotency, audit, and operator approval.
- Treating Fabricator queue or job completion as evidence promotion or export eligibility.
- Showing raw Fabricator run logs, PII, or secrets in public progress UI.
