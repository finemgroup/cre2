import { describe, expect, it } from 'vitest';

import { createAnalyticsEvent } from '@/lib/analytics/events';
import { getCollectedEvents, resetCollectedEvents, trackEvent } from '@/lib/analytics/collector';
import { assertAnalyticsEventSafe, validateAnalyticsEvent } from '@/lib/analytics/redaction';

describe('analytics redaction harness', () => {
  it('allows redacted route and receipt events', () => {
    const event = createAnalyticsEvent({
      name: 'export_receipt_generated',
      actorClass: 'org-member',
      route: '/export/demo-001',
      propertyId: 'demo-001',
      receiptId: 'rcpt_1234abcd',
      phase: 'receipt',
    });

    expect(assertAnalyticsEventSafe(event)).toEqual(event);
  });

  it('rejects raw private values and source-owner identity', () => {
    const result = validateAnalyticsEvent({
      name: 'candidate_evidence_created',
      actorClass: 'source-owner',
      propertyId: 'demo-001',
      authorityLabel: 'private rent roll from source-alex',
    });

    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('rejects forbidden analytics payload keys', () => {
    const result = validateAnalyticsEvent({
      name: 'upload_stage_changed',
      actorClass: 'free-contributor',
      // The type system blocks this in app code; the test simulates unsafe unknown telemetry.
      rawDocumentText: 'lease clause text',
    } as never);

    expect(result.valid).toBe(false);
  });

  it('collects only validated local analytics events', () => {
    resetCollectedEvents();
    trackEvent({
      name: 'pricing_cta_clicked',
      actorClass: 'anonymous',
      phase: 'Plan upgrade',
    });

    expect(getCollectedEvents()).toHaveLength(1);
    expect(() =>
      trackEvent({
        name: 'evidence_drawer_opened',
        actorClass: 'anonymous',
        authorityLabel: 'private rent roll',
      })
    ).toThrow(/Forbidden analytics value/i);
    expect(getCollectedEvents()).toHaveLength(1);
  });
});
