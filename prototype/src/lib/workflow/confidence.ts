import type { HitlTrustTier } from '@/components/workflow/HitlTrustTierBadge';

export type ConfidenceTier = 'high' | 'medium' | 'low';
export type EscalationLevel = 'auto' | 'confirm' | 'review' | 'blocked';

export type ConfidenceAssessment = {
  tier: ConfidenceTier | null;
  escalation: EscalationLevel | null;
  trustTier: HitlTrustTier;
  label: string;
  safeMessage: string;
};

export function getConfidenceTier(confidence?: number | null): ConfidenceTier | null {
  if (typeof confidence !== 'number') return null;
  if (confidence >= 90) return 'high';
  if (confidence >= 70) return 'medium';
  return 'low';
}

export function getEscalationLevel(
  confidence?: number | null,
  blocked = false
): EscalationLevel | null {
  if (blocked) return 'blocked';
  if (typeof confidence !== 'number') return null;
  if (confidence >= 90) return 'auto';
  if (confidence >= 70) return 'confirm';
  return 'review';
}

export function requiresHumanReview(confidence?: number | null, blocked = false): boolean {
  const escalation = getEscalationLevel(confidence, blocked);
  return escalation === 'review' || escalation === 'blocked';
}

export function assessConfidence(
  confidence?: number | null,
  blocked = false
): ConfidenceAssessment {
  const tier = getConfidenceTier(confidence);
  const escalation = getEscalationLevel(confidence, blocked);
  const trustTier = escalationToHitlTier(escalation);

  if (escalation === 'blocked') {
    return {
      tier,
      escalation,
      trustTier,
      label: 'Blocked',
      safeMessage:
        'This action remains blocked until evidence, review, and source-rights gates clear.',
    };
  }

  if (escalation === 'review') {
    return {
      tier,
      escalation,
      trustTier,
      label: 'Human review required',
      safeMessage:
        'This recommendation needs analyst or reviewer confirmation before it can progress.',
    };
  }

  if (escalation === 'confirm') {
    return {
      tier,
      escalation,
      trustTier,
      label: 'Confirm before proceeding',
      safeMessage: 'Confidence is moderate; capture a rationale before treating this as reviewed.',
    };
  }

  if (escalation === 'auto') {
    return {
      tier,
      escalation,
      trustTier,
      label: 'Auto-eligible advisory',
      safeMessage:
        'High-confidence advisory state only. Runtime gates still control export authority.',
    };
  }

  return {
    tier,
    escalation,
    trustTier,
    label: 'Confidence unavailable',
    safeMessage: 'No confidence score is available; keep the action in reviewer workflow.',
  };
}

function escalationToHitlTier(escalation: EscalationLevel | null): HitlTrustTier {
  if (escalation === 'auto') return 'AUTO';
  if (escalation === 'confirm') return 'NOTIFY';
  if (escalation === 'blocked') return 'BLOCK';
  return 'HITL';
}
