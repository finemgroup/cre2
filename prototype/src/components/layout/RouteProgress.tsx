import { useEffect, useState, type ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteProgress(): ReactElement | null {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 320);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div
      className="route-progress"
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext="Loading page"
    />
  );
}
