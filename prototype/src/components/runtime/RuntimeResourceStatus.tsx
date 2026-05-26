import type { ReactElement } from 'react';

import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import {
  getRouteLoadingCopy,
  type RouteLoadingVariant,
} from '@/lib/studio/route-loading';

type RuntimeResourceStatusProps = {
  loading?: boolean;
  error?: string;
  variant?: RouteLoadingVariant;
};

export function RuntimeResourceStatus({
  loading = false,
  error,
  variant = 'public',
}: RuntimeResourceStatusProps): ReactElement | null {
  if (error) {
    return (
      <EmptyStateCard
        icon="error"
        tone="warning"
        title="Runtime read unavailable"
        description={`${error} Showing fixture fallback from ${runtimeServices.mode} mode.`}
      />
    );
  }

  if (!loading) return null;

  const copy = getRouteLoadingCopy(variant);

  return (
    <div
      className={`runtime-resource-status route-loading route-loading-${variant}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="route-loading-card elevation-low">
        <div className="route-loading-heading">
          <MaterialIcon name="sync" />
          <strong>{copy.title}</strong>
        </div>
        <p className="muted">
          {copy.detail} ({runtimeServices.mode} runtime)
        </p>
        <div className="route-loading-shimmer" aria-hidden>
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
