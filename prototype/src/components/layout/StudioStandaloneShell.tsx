import { Link, Outlet, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { getDealIdFromPath, studioDealPath } from '@/data/studio';
import { ScreenReaderAnnouncement } from '@/components/workflow/WorkflowPrimitives';
import { useStudioSurfaceFonts } from '@/lib/fonts/useStudioSurfaceFonts';
import { getStudioRouteTitle } from '@/lib/a11y/routeTitles';
import { useRouteAnnouncement } from '@/lib/a11y/useRouteAnnouncement';
import { PresentationModeToggle } from '@/components/layout/PresentationModeToggle';
import { usePresentationMode } from '@/lib/studio/usePresentationMode';

export function StudioStandaloneShell(): ReactElement {
  const location = useLocation();
  const routeAnnouncement = useRouteAnnouncement(getStudioRouteTitle(location.pathname));
  useStudioSurfaceFonts();
  const { enabled: presentationMode } = usePresentationMode();
  const dealId = getDealIdFromPath(location.pathname);

  return (
    <div className={presentationMode ? 'studio-standalone presentation-mode' : 'studio-standalone'}>
      <ScreenReaderAnnouncement message={routeAnnouncement} />
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
          <Link to={studioDealPath(dealId)}>Back to deal</Link>
          <Link to="/studio/settings/white-label">White Label</Link>
        </nav>
        <div className="studio-topbar-actions">
          <PresentationModeToggle />
          <PrototypeActionButton
            feature="Report export"
            className="btn btn-primary"
            aria-describedby="report-export-disabled-note"
          >
            Export
          </PrototypeActionButton>
          <p id="report-export-disabled-note" className="sr-only">
            Export stays gated until report sections and source-rights gates clear in the builder.
          </p>
          <PrototypeActionButton feature="Report help" className="btn btn-ghost" aria-label="Report help">
            <MaterialIcon name="help" />
          </PrototypeActionButton>
          <span className="avatar" role="img" aria-label="User avatar" />
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
