# Finem Fabricator Alignment

Finem Fabricator is the workflow, agent, and orchestration factory. It supplies **workflow and control-plane patterns only**. It is not the canonical CRE or Sophex data owner.

**Harvest source:** [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) — provisional; clean Fabricator checkout rerun pending.

## What Fabricator Supplies

- Control-panel UX for workflow visibility (`docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md`).
- Agent orchestration patterns for ingestion and report drafting.
- Human-in-the-loop review queues and HITL handler concepts.
- Analysis OS / AnalysisResponse-style report contracts (`src/lib/analysis-os/`).
- Evidence envelope and audit receipt patterns (`agents/DatabaseEvidenceToolkit_MCP/`).
- Confidence scoring and moderation workflow concepts.
- User-safe background job status projections (`JobStatusProjection`).
- Failure, cost, retry, and blocked-state handling patterns.
- Source adapter patterns for governed ingestion — outputs remain candidates until reviewed.

## What Fabricator Does Not Own

- **Sophex marketplace truth** — observations, comps, and reports are governed by Sophex permissions and CRE evidence contracts.
- **Canonical promotion** — queue or job completion is **not** evidence promotion.
- **Public Sophex UX defaults** — Fabricator mission control and operator cockpits are reference-only, not MVP0 public shell.
- **Runtime coupling** — no Fabricator queue, worker, or remote connection in setup phase.

## Critical Boundaries

- Fabricator must **not** own Sophex marketplace truth.
- Queue completion or job success must **not** be treated as evidence promotion or canonical fact.
- Agent outputs are candidates, summaries, labels, or workflow projections until HITL and permissions apply.
- Fabricator runtime internals (queues, workers, raw run logs, SSE streams) are **reference-only** — not Sophex defaults.
- Mission control and operator dashboards are inspiration for **internal moderation**, not public contributor UI.

## Potential Future Agents

See `docs/AGENT_WORKFLOW_CONCEPTS.md` for full role definitions:

- Ingestion classifier.
- Evidence extractor.
- Valuation report generator.
- Source confidence scorer.
- HITL reviewer.
- Marketplace moderation assistant.
- Audit/correlation receipt writer.
- Background job status projector.

## Boundary

Fabricator-inspired agents must operate inside Sophex permission rules and future CRE evidence contracts. They may help create, review, or route observations, but they do not define canonical truth or bypass source visibility.

Agent outputs should be treated as candidates, summaries, labels, or workflow state until reviewed and governed. Fabricator may provide process inspiration, but Sophex owns its marketplace UX and public/private trust boundary.

## Not Now

No Fabricator runtime build, agent implementation, queue launch, workflow deployment, provider send, or production orchestration is authorized by this setup packet.
