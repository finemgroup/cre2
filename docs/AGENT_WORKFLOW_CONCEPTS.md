# Agent Workflow Concepts

Finem Fabricator can inspire Sophex workflows and agents, but agents do not own truth. Every agent output is candidate evidence, workflow status, or report material until reviewed, permissioned, and governed.

**Source:** [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) (provisional — clean Fabricator rerun pending).

## Ingestion Classifier

| Field | Detail |
| --- | --- |
| **Conceptual role** | Classify uploads and route to correct ingestion path and cost tier. |
| **Inputs** | File metadata, text-layer presence, MIME/type, user-declared source type, size, quality signals. |
| **Outputs** | Ingestion path (clean PDF vs scanned/OCR), cost tier, extraction expectations, blocked or needs-review flag, `IngestionRun` reference. |
| **Human gate** | Scanned, high-risk, private, or legally sensitive documents require operator review before extraction. |
| **Failure modes** | Unknown type → blocked; oversize → rejected; missing consent/terms → blocked; ambiguous scan quality → needs-review. |
| **Future boundary** | No public publication; no extraction on blocked docs; outputs are routing decisions only, not facts. |

## Evidence Extractor

| Field | Detail |
| --- | --- |
| **Conceptual role** | Extract candidate property facts, lease terms, rent schedules, sale data, and source spans from permitted documents. |
| **Inputs** | Document evidence identity, chunks/parser output, ingestion classification, visibility policy. |
| **Outputs** | `ExtractionCandidate` records with source references, confidence, spans, method (clean parse vs OCR). |
| **Human gate** | Required before public use, export, or canonical promotion; low-confidence/high-value fields route to HITL. |
| **Failure modes** | OCR failure → needs-review; table reconstruction failure → partial candidates flagged; permission mismatch → blocked. |
| **Future boundary** | Extraction is not truth; candidates only; redaction-first envelope before any model or public surface. |

## Valuation Report Generator

| Field | Detail |
| --- | --- |
| **Conceptual role** | Assemble white-labeled valuation/report artifacts from approved inputs visible to the actor. |
| **Inputs** | Resolved comp set, permitted observations, model assumptions, branding scope, review decisions. |
| **Outputs** | `ReportGenerationRun` artifact with AnalysisResponse-style fields: sections, confidence, warnings, citations, `reviewRequired`, white-label metadata. |
| **Human gate** | External export and public-facing report require HITL approval when `reviewRequired` is true. |
| **Failure modes** | Missing comps → warning + blocked export; permission gap → omit section; model timeout → retry/receipt, not silent success. |
| **Future boundary** | No headline valuation without evidence/citations/review state; no send automation without full consent stack. |

## Source Confidence Scorer

| Field | Detail |
| --- | --- |
| **Conceptual role** | Rank observations and candidates using source type, recency, review state, contradiction, completeness, contributor trust. |
| **Inputs** | Observation/candidate, related observations, review history, source metadata. |
| **Outputs** | `SourceConfidenceScore` with confidence band, freshness label, dispute hint. |
| **Human gate** | Threshold changes and public promotion require operator review. |
| **Failure modes** | Conflicting sources → dispute flag; stale source → downgrade; unknown provenance → unreviewed default. |
| **Future boundary** | Scoring informs resolution but never bypasses permissions or auto-promotes to public. |

## HITL Reviewer

| Field | Detail |
| --- | --- |
| **Conceptual role** | Human authority layer for candidate facts, comps, report sections, and publication eligibility. |
| **Inputs** | Extraction candidates, moderation signals, report drafts, permission context. |
| **Outputs** | `ReviewDecision`: accepted public, accepted private, rejected, needs-more-evidence, superseded, revoked, blocked. |
| **Human gate** | The reviewer **is** the gate; automation may route queue items only. |
| **Failure modes** | Timeout → escalate/not auto-approve (policy TBD); conflicting decisions → dispute state; missing audit → fail-closed. |
| **Future boundary** | Reviewer UI respects permissions; no auto-publication from reviewer-adjacent agents. |

## Marketplace Moderation Assistant

| Field | Detail |
| --- | --- |
| **Conceptual role** | Detect spam, bad comps, suspicious uploads, adversarial data, duplicates, source-use risk. |
| **Inputs** | Upload metadata, candidate observations, contributor history, pattern signals. |
| **Outputs** | `ModerationSignal` with severity, reason codes, suggested queue priority — not final decisions. |
| **Human gate** | Ban, removal, and publication decisions require human operator authority. |
| **Failure modes** | False positive → human override; adversarial evasion → escalate; duplicate detection uncertain → needs-review. |
| **Future boundary** | No auto-ban or auto-publication in MVP; signals only. |

## Audit / Correlation Receipt Writer

| Field | Detail |
| --- | --- |
| **Conceptual role** | Emit replay-safe receipts for governed actions with idempotency and correlation identifiers. |
| **Inputs** | Action type, actor, target entity, idempotency key, correlation ID, outcome payload hash. |
| **Outputs** | `AgentRunReceipt` / operational receipt reference linkable to ingestion, extraction, review, report, export. |
| **Human gate** | Disputed or failed receipts may require operator investigation before retry. |
| **Failure modes** | Duplicate idempotency key → fail-closed return prior receipt; missing correlation → block downstream export. |
| **Future boundary** | Receipts are audit artifacts, not user-facing truth; public UI never shows raw receipt internals. |

## Background Job Status Projector

| Field | Detail |
| --- | --- |
| **Conceptual role** | Project Fabricator/workflow internal state into user-safe phase timelines for public and contributor UI. |
| **Inputs** | Internal run state (operator-only), phase transition events, failure/blocked flags. |
| **Outputs** | `JobStatusProjection`: phase label, percent or step index (only if tied to real transitions), blocked reason (sanitized). |
| **Human gate** | Blocked and failed states may require user action or operator review before retry. |
| **Failure modes** | Stale projection → refresh; worker crash → blocked with safe message; never show success on incomplete run. |
| **Future boundary** | **Queue completion is not canonical truth.** Public users see projections only — no queue names, worker IDs, or raw logs. |

## Fabricator Rule (All Agents)

Job/workflow/agent completion is a **status projection**, not evidence promotion or canonical marketplace truth. HITL review and permission filters remain mandatory after any completion event.
