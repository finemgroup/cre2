import type { ReactElement } from 'react';

export function RouteFallback(): ReactElement {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      Loading view…
    </div>
  );
}
