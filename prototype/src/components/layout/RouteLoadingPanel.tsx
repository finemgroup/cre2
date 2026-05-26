import { useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { getRouteLoadingCopy, resolveRouteLoadingVariant } from '@/lib/studio/route-loading';

export function RouteLoadingPanel(): ReactElement {
  const { pathname } = useLocation();
  const variant = resolveRouteLoadingVariant(pathname);
  const copy = getRouteLoadingCopy(variant);

  return (
    <div
      className={`route-loading route-loading-${variant}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading view…</span>
      <div className="route-loading-card elevation-low">
        <p className="micro-label">{copy.eyebrow}</p>
        <div className="route-loading-heading">
          <MaterialIcon name={getLoadingIcon(variant)} />
          <strong>{copy.title}</strong>
        </div>
        <p className="muted">{copy.detail}</p>
        <div className="route-loading-shimmer" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function getLoadingIcon(variant: ReturnType<typeof resolveRouteLoadingVariant>): string {
  switch (variant) {
    case 'public':
      return 'travel_explore';
    case 'studio-deal':
      return 'account_balance';
    case 'studio-report':
      return 'description';
    case 'studio-operator':
      return 'hub';
    default:
      return 'dashboard';
  }
}
