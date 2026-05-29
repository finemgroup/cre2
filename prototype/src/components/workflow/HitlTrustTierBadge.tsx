import type { ReactElement } from 'react';

export type HitlTrustTier = 'AUTO' | 'NOTIFY' | 'HITL' | 'BLOCK';

const TIER_COPY: Record<HitlTrustTier, { label: string; detail: string }> = {
  AUTO: {
    label: 'Auto-eligible',
    detail: 'Baseline public projection only; not promotion authority.',
  },
  NOTIFY: {
    label: 'Notify reviewer',
    detail: 'Reviewer should be notified; queue completion is not promotion.',
  },
  HITL: {
    label: 'HITL required',
    detail: 'Human review required before export or public projection.',
  },
  BLOCK: {
    label: 'Blocked',
    detail: 'Export and public projection remain blocked until cleared.',
  },
};

export function HitlTrustTierBadge({ tier }: { tier: HitlTrustTier }): ReactElement {
  const copy = TIER_COPY[tier];
  return (
    <span
      className={`hitl-tier-badge hitl-tier-${tier.toLowerCase()}`}
      title={copy.detail}
      aria-label={`Trust tier ${copy.label}. ${copy.detail}`}
    >
      {copy.label}
    </span>
  );
}

export function reviewStateToHitlTier(reviewState: string): HitlTrustTier {
  if (reviewState === 'approved-public-projection' || reviewState === 'approved-private-use') {
    return 'AUTO';
  }
  if (reviewState === 'held') return 'NOTIFY';
  if (reviewState === 'rejected' || reviewState === 'blocked') return 'BLOCK';
  return 'HITL';
}
