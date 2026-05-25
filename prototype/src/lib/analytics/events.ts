export type AnalyticsEventName =
  | 'route_viewed'
  | 'search_submitted'
  | 'evidence_drawer_opened'
  | 'upload_stage_changed'
  | 'candidate_evidence_created'
  | 'export_blocker_reviewed'
  | 'export_receipt_generated'
  | 'pricing_cta_clicked'
  | 'report_section_reviewed';

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  actorClass: string;
  route?: string;
  propertyId?: string;
  dealId?: string;
  phase?: string;
  receiptId?: string;
  authorityLabel?: string;
  blockerCategory?: string;
};

export function createAnalyticsEvent(event: AnalyticsEvent): AnalyticsEvent {
  return event;
}
