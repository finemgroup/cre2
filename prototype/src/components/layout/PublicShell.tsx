import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { NonProductionBanner } from '@/components/ui/NonProductionBanner';
import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { getPublicRouteTitle } from '@/lib/a11y/routeTitles';
import { useRouteTitle } from '@/lib/a11y/useRouteTitle';
import { ActorDemoSelector } from '@/components/runtime/ActorDemoSelector';

export function PublicShell(): ReactElement {
  const location = useLocation();
  useRouteTitle(getPublicRouteTitle(location.pathname));

  return (
    <div className="shell">
      <a href="#page-content" className="skip-link">
        Skip to content
      </a>
      <NonProductionBanner />
      <RouteProgress />
      <header className="shell-header">
        <Link to="/" className="brand">
          Sophex
        </Link>
        <nav className="shell-nav" aria-label="Primary">
          <NavLink to="/" end>
            Search
          </NavLink>
          <NavLink to="/upload">Upload</NavLink>
          <NavLink to="/studio">Studio</NavLink>
        </nav>
        <ActorDemoSelector />
      </header>
      <main className="shell-main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <footer className="shell-footer">
        <nav aria-label="Trust and legal">
          <Link to="/upload">Contribute evidence</Link>
          <Link to="/studio/settings/billing">Plans</Link>
          <a href="#source-trust">Source trust tiers</a>
          <a href="#privacy">Privacy (prototype)</a>
        </nav>
        <p>Mock marketplace prototype — no live valuations, exports, or syndication.</p>
      </footer>
    </div>
  );
}
