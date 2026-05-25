# Observability Event Taxonomy

This taxonomy defines redacted product analytics and observability events for future sandbox/runtime work.
It does not configure any analytics provider, queue, CRM, outbound send, or production telemetry sink.

## Allowed Event Shape

Events may include:

- Event name.
- Actor class.
- Route.
- Property id.
- Deal id.
- Phase label.
- Receipt id.
- Authority label.
- Blocker category.

Events must not include:

- Email, phone, full names, or raw PII.
- Document text.
- Raw private values.
- Private comp values.
- Source-owner identity.
- Raw evidence payloads.
- Provider payloads.
- Secrets, stack traces, worker ids, or queue logs.

## Initial Event Names

| Event | Purpose |
| --- | --- |
| `route_viewed` | Navigation and funnel analysis. |
| `search_submitted` | Public search usage. |
| `evidence_drawer_opened` | Evidence explanation engagement. |
| `upload_stage_changed` | Upload flow health. |
| `candidate_evidence_created` | Contribution workflow measurement without payloads. |
| `export_blocker_reviewed` | Export blocker comprehension. |
| `export_receipt_generated` | Governed action completion. |
| `pricing_cta_clicked` | Plan interest. |
| `report_section_reviewed` | Report workflow progress. |

## Redaction Rule

Any event that cannot be represented safely with ids, phases, receipt refs, and labels should be dropped rather than partially sent.

## Outbound Boundary

Analytics may inform product and internal prioritization.
Analytics must not trigger email, CRM tasks, retargeting, partner notifications, or syndication until outbound consent gates are separately approved.
