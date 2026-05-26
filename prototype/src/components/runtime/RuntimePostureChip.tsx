import type { ReactElement } from 'react';

import { getRuntimePosture } from '@/lib/runtime/runtime-posture';
import { runtimeServices } from '@/lib/runtime/runtime-services';

type RuntimePostureChipProps = {
  className?: string;
};

export function RuntimePostureChip({ className = '' }: RuntimePostureChipProps): ReactElement {
  const posture = getRuntimePosture(runtimeServices.mode);

  return (
    <span
      className={`runtime-posture-chip ${className}`.trim()}
      title={posture.description}
      aria-label={`${posture.label}. ${posture.description}`}
    >
      {posture.label}
    </span>
  );
}
