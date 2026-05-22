# Finem Fabricator Alignment

Finem Fabricator is the workflow, agent, and orchestration factory. It can inform Sophex agent design and control-panel patterns, but it is not the canonical CRE or Sophex data owner.

## Useful Patterns

- Control-panel UX for workflow visibility.
- Agent orchestration for ingestion and report drafting.
- Human-in-the-loop review queues.
- Report-generation patterns.
- Confidence scoring and moderation workflows.
- User-safe background job status projections.
- Failure, cost, retry, and blocked-state handling patterns.

## Potential Future Agents

- Ingestion classifier.
- Evidence extractor.
- Valuation report generator.
- HITL reviewer.
- Source confidence scorer.
- Marketplace moderation assistant.

## Boundary

Fabricator-inspired agents must operate inside Sophex permission rules and future CRE evidence contracts. They may help create, review, or route observations, but they do not define canonical truth or bypass source visibility.

Agent outputs should be treated as candidates, summaries, labels, or workflow state until reviewed and governed. Fabricator may provide process inspiration, but Sophex owns its marketplace UX and public/private trust boundary.

## Not Now

No Fabricator runtime build, agent implementation, queue launch, workflow deployment, provider send, or production orchestration is authorized by this setup packet.
