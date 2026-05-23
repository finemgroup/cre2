import { Suspense, type ComponentType, type ReactElement } from 'react';

import { RouteFallback } from '@/components/layout/RouteFallback';

export function LazyPage({ page: Page }: { page: ComponentType }): ReactElement {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Page />
    </Suspense>
  );
}
