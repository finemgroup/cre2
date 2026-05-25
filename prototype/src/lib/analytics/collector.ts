import { assertAnalyticsEventSafe } from '@/lib/analytics/redaction';
import type { AnalyticsEvent } from '@/lib/analytics/events';

const collectedEvents: AnalyticsEvent[] = [];

export function trackEvent(event: AnalyticsEvent): AnalyticsEvent {
  const safeEvent = assertAnalyticsEventSafe(event);
  collectedEvents.push(safeEvent);
  return safeEvent;
}

export function getCollectedEvents(): AnalyticsEvent[] {
  return [...collectedEvents];
}

export function resetCollectedEvents(): void {
  collectedEvents.length = 0;
}
