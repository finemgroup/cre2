import { Link, Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';

import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';

export function StudioStandaloneShell(): ReactElement {
  return (
    <div className="studio-standalone">
      <a href="#page-content" className="skip-link">
        Skip to content
      </a>
      <RouteProgress />
      <header className="studio-report-nav">
        <Link to="/studio" className="studio-topbar-brand">
          Finem CRE Studio
        </Link>
        <nav aria-label="Report builder links">
          <Link to="/studio/dashboard">Dashboard</Link>
          <Link to="/studio/deals/riverside-flats">Deals</Link>
          <Link to="/studio/settings/white-label">White Label</Link>
        </nav>
      </header>
      <main id="page-content" className="studio-standalone-content">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
