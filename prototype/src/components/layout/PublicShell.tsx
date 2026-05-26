import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState, type ReactElement } from 'react';

import { PublicMobileNavDrawer } from '@/components/overlays/PublicMobileNavDrawer';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { NonProductionBanner } from '@/components/ui/NonProductionBanner';
import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { ScreenReaderAnnouncement } from '@/components/workflow/WorkflowPrimitives';
import { getPublicRouteTitle } from '@/lib/a11y/routeTitles';
import { useRouteAnnouncement } from '@/lib/a11y/useRouteAnnouncement';
import { PrototypeActionAnchor } from '@/components/overlays/PrototypeActionAnchor';
import { ActorDemoSelector } from '@/components/runtime/ActorDemoSelector';
import { RuntimePostureChip } from '@/components/runtime/RuntimePostureChip';
import { useStudioSurfaceFonts } from '@/lib/fonts/useStudioSurfaceFonts';
import { PresentationModeToggle } from '@/components/layout/PresentationModeToggle';
import { usePresentationMode } from '@/lib/studio/usePresentationMode';

export function PublicShell(): ReactElement {
  const location = useLocation();
  const routeAnnouncement = useRouteAnnouncement(getPublicRouteTitle(location.pathname));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useStudioSurfaceFonts();
  const { enabled: presentationMode } = usePresentationMode();

  return (
    <div className={presentationMode ? 'shell presentation-mode' : 'shell'}>
      <ScreenReaderAnnouncement message={routeAnnouncement} />
      <a href="#page-content" className="skip-link">
        Skip to content
      </a>
      <NonProductionBanner />
      <RouteProgress />
      <header className="shell-header">
        <div className="shell-brand-block">
          <Link to="/" className="brand">
            Sophex
          </Link>
          <p className="micro-label shell-tagline">Evidence-first CRE intelligence</p>
        </div>
        <button
          type="button"
          className="public-mobile-menu btn btn-ghost"
          aria-label="Open navigation menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <MaterialIcon name="menu" />
        </button>
        <nav className="shell-nav" aria-label="Primary">
          <NavLink to="/" end aria-label="Search properties">
            Search
          </NavLink>
          <NavLink to="/upload" aria-label="Upload documents">
            Upload
          </NavLink>
          <NavLink to="/studio" aria-label="Open Finem CRE Studio">
            Studio
          </NavLink>
        </nav>
        <PresentationModeToggle className="btn btn-ghost presentation-mode-toggle public-presentation-toggle" />
        <RuntimePostureChip />
        <ActorDemoSelector />
      </header>
      <PublicMobileNavDrawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <main className="shell-main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <footer className="shell-footer">
        <nav aria-label="Trust and legal">
          <Link to="/upload">Contribute evidence</Link>
          <Link to="/studio/settings/billing">Plans</Link>
          <PrototypeActionAnchor href="#source-trust" feature="Source trust tiers">
            Source trust tiers
          </PrototypeActionAnchor>
          <PrototypeActionAnchor href="#privacy" feature="Privacy policy">
            Privacy (prototype)
          </PrototypeActionAnchor>
        </nav>
        <p>Mock marketplace prototype — no live valuations, exports, or syndication.</p>
      </footer>
    </div>
  );
}
