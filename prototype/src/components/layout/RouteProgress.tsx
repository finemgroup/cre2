import type { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteProgress(): ReactElement {
  const location = useLocation();
  const isStudioRoute = location.pathname.startsWith('/studio');

  return (
    <div
      key={`${location.pathname}${location.search}`}
      className={
        isStudioRoute
          ? 'route-progress route-progress-studio'
          : 'route-progress route-progress-public'
      }
      aria-hidden="true"
    />
  );
}
