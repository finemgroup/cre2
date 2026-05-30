import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, type FormEvent, type ReactElement } from 'react';

import { PublicMobileNavDrawer } from '@/components/overlays/PublicMobileNavDrawer';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { NonProductionBanner } from '@/components/ui/NonProductionBanner';
import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { ScreenReaderAnnouncement } from '@/components/workflow/WorkflowPrimitives';
import { getPublicRouteTitle } from '@/lib/a11y/routeTitles';
import { useRouteAnnouncement } from '@/lib/a11y/useRouteAnnouncement';
import { PrototypeActionAnchor } from '@/components/overlays/PrototypeActionAnchor';
import { useStudioSurfaceFonts } from '@/lib/fonts/useStudioSurfaceFonts';
import { GuidedDemoRail } from '@/components/demo/GuidedDemoRail';
import { usePresentationMode } from '@/lib/studio/usePresentationMode';
import { getPublicProductLinks } from '@/lib/public/public-product-nav';

export function PublicShell(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const routeAnnouncement = useRouteAnnouncement(getPublicRouteTitle(location.pathname));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  useStudioSurfaceFonts();
  const { enabled: presentationMode } = usePresentationMode();
  const productLinks = getPublicProductLinks(location.pathname, location.search);

  function onHeaderSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = headerQuery.trim();
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
  }

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
          <form className="shell-search" role="search" onSubmit={onHeaderSearch}>
            <MaterialIcon name="search" />
            <input
              type="search"
              placeholder="Search properties, owners, markets..."
              value={headerQuery}
              onChange={(event) => setHeaderQuery(event.target.value)}
              aria-label="Search properties, owners, markets"
            />
          </form>
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
          {productLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={link.active ? 'active' : undefined}
              aria-current={link.active ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link to="/studio" className="shell-studio-entry" aria-label="Open Sophex Studio">
          Studio
        </Link>
      </header>
      <PublicMobileNavDrawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <GuidedDemoRail />
      <main className="shell-main" id="page-content">
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
