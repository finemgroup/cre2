import type { ReactElement } from 'react';

export type PublicTrustLabel =
  | 'Advisory / model-inferred'
  | 'Not an appraisal'
  | 'Source-confirmed'
  | 'Public baseline'
  | 'Export gated'
  | 'Mock-only';

type PublicTrustStripProps = {
  labels: readonly PublicTrustLabel[];
  className?: string;
  'aria-label'?: string;
};

export function PublicTrustStrip({
  labels,
  className,
  'aria-label': ariaLabel = 'Advisory and source posture',
}: PublicTrustStripProps): ReactElement {
  const rootClass = className ? `public-trust-strip ${className}` : 'public-trust-strip';
  return (
    <div className={rootClass} aria-label={ariaLabel}>
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}
