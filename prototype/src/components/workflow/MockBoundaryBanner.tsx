import type { ReactElement } from 'react';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';

const COPY = {
  export: 'DEMO DATA — This export uses mock data. Not for distribution or decision-making.',
  ic: 'PROTOTYPE — IC packet assembly is simulated. No real data will be transmitted.',
  snapshot: 'DEMO SNAPSHOT — Valuation snapshot locking is simulated. No production records are created.',
  review: 'INTERNAL REVIEW — Analyst review actions are advisory and do not promote evidence authority.',
} as const;

export function MockBoundaryBanner({
  variant,
}: {
  variant: keyof typeof COPY;
}): ReactElement {
  return (
    <div className="mock-boundary-banner" role="note">
      <MaterialIcon name="warning" />
      <span>{COPY[variant]}</span>
    </div>
  );
}
