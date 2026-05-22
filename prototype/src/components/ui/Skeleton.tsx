import type { ReactElement } from 'react';

type SkeletonProps = {
  lines?: number;
};

export function Skeleton({ lines = 3 }: SkeletonProps): ReactElement {
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-line" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}
