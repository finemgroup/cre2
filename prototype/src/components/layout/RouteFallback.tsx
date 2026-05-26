import type { ReactElement } from 'react';

import { RouteLoadingPanel } from '@/components/layout/RouteLoadingPanel';

export function RouteFallback(): ReactElement {
  return <RouteLoadingPanel />;
}
