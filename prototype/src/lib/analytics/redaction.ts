import type { AnalyticsEvent } from '@/lib/analytics/events';

const FORBIDDEN_KEY_PATTERNS = [
  /email/i,
  /phone/i,
  /document/i,
  /raw/i,
  /private/i,
  /sourceOwner/i,
  /source_owner/i,
  /payload/i,
  /secret/i,
];

const FORBIDDEN_VALUE_PATTERNS = [
  /private rent roll/i,
  /org survey/i,
  /provider comp/i,
  /source-alex/i,
  /@/,
  /ssn/i,
];

export type AnalyticsValidation = {
  valid: boolean;
  violations: string[];
};

export function validateAnalyticsEvent(event: AnalyticsEvent): AnalyticsValidation {
  const violations: string[] = [];
  const entries = Object.entries(event);

  for (const [key, value] of entries) {
    if (FORBIDDEN_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
      violations.push(`Forbidden analytics key: ${key}`);
    }
    if (
      typeof value === 'string' &&
      FORBIDDEN_VALUE_PATTERNS.some((pattern) => pattern.test(value))
    ) {
      violations.push(`Forbidden analytics value on ${key}`);
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function assertAnalyticsEventSafe(event: AnalyticsEvent): AnalyticsEvent {
  const result = validateAnalyticsEvent(event);
  if (!result.valid) {
    throw new Error(result.violations.join('; '));
  }
  return event;
}
