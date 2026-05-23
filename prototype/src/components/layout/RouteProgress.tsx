import type { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteProgress(): ReactElement {
  const location = useLocation();

  return (
    <div
      key={`${location.pathname}${location.search}`}
      className="route-progress"
      aria-hidden="true"
    />
  );
}
