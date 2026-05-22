import { Link, Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';

import { NonProductionBanner } from '@/components/ui/NonProductionBanner';
import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';

export function PublicShell(): ReactElement {
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
          <Link to="/">Search</Link>
          <Link to="/property/demo-001">Property</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/comps">Comps</Link>
          <Link to="/report/demo-001">Report</Link>
          <Link to="/export/demo-001">Export</Link>
        </nav>
      </header>
      <main className="shell-main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
