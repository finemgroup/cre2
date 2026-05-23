import type { ReactElement } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { TrustBadge } from '@/components/studio/StudioPrimitives';

const TRUST_TIERS = [
  {
    state: 'Reviewed',
    summary: 'Human-reviewed evidence suitable for client-facing export when other gates clear.',
  },
  {
    state: 'Candidate evidence',
    summary: 'Extracted or contributed material awaiting review before promotion.',
  },
  {
    state: 'Needs review',
    summary: 'Conflicting or incomplete source signals require analyst resolution.',
  },
  {
    state: 'Blocked',
    summary: 'Source rights, consent, or policy constraints prevent export use.',
  },
] as const;

type TrustExplainerDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
};

export function TrustExplainerDrawer({
  isOpen,
  onClose,
  context,
}: TrustExplainerDrawerProps): ReactElement {
  return (
    <SophexSheet isOpen={isOpen} onClose={onClose} label="Source trust explainer">
      {context ? <p>{context}</p> : null}
      <p className="muted">
        Trust posture describes how evidence may be used — not whether a number is mathematically
        correct.
      </p>
      <ul className="trust-explainer-list">
        {TRUST_TIERS.map((tier) => (
          <li key={tier.state}>
            <TrustBadge state={tier.state} />
            <span>{tier.summary}</span>
          </li>
        ))}
      </ul>
    </SophexSheet>
  );
}
