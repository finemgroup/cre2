import { Link, Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';

import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { DEFAULT_DEAL_ID, studioDealPath } from '@/data/studio';
import { useRouteTitle } from '@/lib/a11y/useRouteTitle';

export function StudioStandaloneShell(): ReactElement {
  useRouteTitle('Report Builder - Finem CRE Studio');

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
          <Link to={studioDealPath(DEFAULT_DEAL_ID)}>Deals</Link>
          <Link to="/studio/settings/white-label">White Label</Link>
        </nav>
        <div className="studio-topbar-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled
            aria-describedby="report-export-disabled-note"
          >
            Export
          </button>
          <p id="report-export-disabled-note" className="sr-only">
            Export stays disabled until report sections and source-rights gates clear.
          </p>
          <button
            type="button"
            aria-label="Report help"
            disabled
            title="Prototype report help is not wired"
          >
            <MaterialIcon name="help" />
          </button>
          <span className="avatar" aria-label="User avatar" />
        </div>
      </header>
      <main className="studio-standalone-content">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
