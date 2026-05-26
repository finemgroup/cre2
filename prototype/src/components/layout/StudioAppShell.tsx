import { useId, useState, type ReactElement } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import {
  HelpPanel,
  NotificationsPanel,
  SupportSignOutPanel,
} from '@/components/overlays/StudioTopbarPanels';
import { StudioMobileNavDrawer } from '@/components/overlays/StudioMobileNavDrawer';
import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { ScreenReaderAnnouncement } from '@/components/workflow/WorkflowPrimitives';
import { ActorDemoSelector } from '@/components/runtime/ActorDemoSelector';
import {
  DEFAULT_DEAL_ID,
  getDealIdFromPath,
  getStudioNavItems,
  studioDealPath,
  studioReportPath,
} from '@/data/studio';
import { useStudioSurfaceFonts } from '@/lib/fonts/useStudioSurfaceFonts';
import { useRouteAnnouncement } from '@/lib/a11y/useRouteAnnouncement';
import { getStudioRouteTitle } from '@/lib/a11y/routeTitles';
import { getOnboardingProfile } from '@/lib/studio/onboarding-profile';
import {
  PresentationModeToggle,
} from '@/components/layout/PresentationModeToggle';
import { usePresentationMode } from '@/lib/studio/usePresentationMode';

function isActiveMatch(path: string, match: string): boolean {
  if (match === 'dashboard') return path === '/studio/dashboard' || path === '/studio';
  if (match === 'deal-intake') return path === '/studio/deal-intake' || /\/intake$/.test(path);
  if (match === 'deal-overview') return /^\/studio\/deals\/[^/]+$/.test(path);
  if (match === 'comps') return /\/comps$/.test(path);
  if (match === 'underwriting') {
    return (
      /\/underwriting(\/sources|\/debt)?$/.test(path) ||
      /\/scenarios$/.test(path) ||
      /\/data-review$/.test(path) ||
      /\/capital-stack$/.test(path) ||
      /\/ic-packet$/.test(path) ||
      /\/hitl-review$/.test(path) ||
      /\/spatial$/.test(path)
    );
  }
  if (match === 'versions') return /\/versions$/.test(path);
  if (match === 'reports') return path.startsWith('/studio/reports/');
  if (match === 'billing') return path === '/studio/settings/billing';
  if (match === 'white-label') return path === '/studio/settings/white-label';
  if (match === 'broker-os') return path === '/studio/broker-os';
  if (match === 'design-system') return path === '/studio/design-system';
  return path.startsWith(match);
}

export function StudioAppShell(): ReactElement {
  const location = useLocation();
  const isStandaloneMarketing =
    location.pathname === '/studio' || location.pathname === '/studio/onboarding';
  const isBrokerOs = location.pathname === '/studio/broker-os';
  const activeDealId = getDealIdFromPath(location.pathname);
  const navItems = getStudioNavItems(activeDealId);
  const routeAnnouncement = useRouteAnnouncement(getStudioRouteTitle(location.pathname));
  const onboardingProfile = getOnboardingProfile();
  useStudioSurfaceFonts();
  const { enabled: presentationMode } = usePresentationMode();

  const helpPanelId = useId();
  const notificationsPanelId = useId();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  if (isStandaloneMarketing) {
    return (
      <div
        className={
          presentationMode
            ? 'studio-standalone studio-marketing-shell presentation-mode'
            : 'studio-standalone studio-marketing-shell'
        }
      >
        <ScreenReaderAnnouncement message={routeAnnouncement} />
        <a href="#page-content" className="skip-link">
          Skip to content
        </a>
        <RouteProgress />
        <header className="studio-report-nav studio-marketing-topbar">
          <Link to="/studio/dashboard" className="studio-topbar-brand">
            Finem CRE Studio
          </Link>
          <div className="studio-topbar-actions">
            <PresentationModeToggle />
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

  const shellClass = [
    'studio-shell',
    isBrokerOs ? 'broker-os-shell' : '',
    presentationMode ? 'presentation-mode' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={shellClass}>
      <ScreenReaderAnnouncement message={routeAnnouncement} />
      <a href="#page-content" className="skip-link">
        Skip to content
      </a>
      <RouteProgress />
      <aside className="studio-sidebar" aria-label="Finem Studio navigation">
        <div className="studio-sidebar-brand">
          <Link to="/studio/dashboard" className="studio-logo">
            F
          </Link>
          <div>
            <strong>Finem Studio</strong>
            <span>{onboardingProfile ? `${onboardingProfile.tier} Plan` : 'Enterprise Plan'}</span>
          </div>
        </div>
        <Link
          to={studioDealPath(activeDealId ?? DEFAULT_DEAL_ID, 'intake')}
          className="studio-new-deal"
        >
          <MaterialIcon name="add" />
          New Deal
        </Link>
        <div className="studio-nav-scroll-wrap">
          <nav className="studio-nav" aria-label="Finem Studio navigation">
            {navItems.map((item) => {
              const routeActive = isActiveMatch(location.pathname, item.match);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={routeActive ? 'active' : undefined}
                  aria-current={routeActive ? 'page' : undefined}
                >
                  <MaterialIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="studio-nav-scroll-hint">Scroll for more sections</p>
        </div>
        <div className="studio-sidebar-footer">
          <button type="button" className="btn btn-ghost" onClick={() => setSupportOpen(true)}>
            <MaterialIcon name="contact_support" />
            Support
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setSignOutOpen(true)}>
            <MaterialIcon name="logout" />
            Sign Out
          </button>
        </div>
      </aside>
      <div className="studio-main">
        <header className={isBrokerOs ? 'studio-topbar broker-os-topbar' : 'studio-topbar'}>
          <button
            type="button"
            className="studio-mobile-menu btn btn-ghost"
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <MaterialIcon name="menu" />
          </button>
          <Link to="/studio" className="studio-topbar-brand">
            Finem CRE Studio
          </Link>
          {isBrokerOs ? (
            <nav className="broker-os-topbar-links" aria-label="Broker OS quick links">
              <Link to="/studio/dashboard">Dashboard</Link>
            </nav>
          ) : (
            <nav aria-label="Studio quick links">
              <Link to="/studio/dashboard">Dashboard</Link>
              <Link to={studioDealPath(activeDealId)}>Deals</Link>
              <Link to={studioReportPath(activeDealId)}>Reports</Link>
              <Link to="/">Sophex</Link>
            </nav>
          )}
          {!isBrokerOs ? (
            <div className="studio-topbar-actions">
              <PresentationModeToggle />
              <ActorDemoSelector />
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                aria-controls={notificationsPanelId}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setHelpOpen(false);
                }}
              >
                <MaterialIcon name="notifications" />
              </button>
              <button
                type="button"
                aria-label="Help"
                aria-expanded={helpOpen}
                aria-controls={helpPanelId}
                onClick={() => {
                  setHelpOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
              >
                <MaterialIcon name="help" />
              </button>
              <span className="avatar" role="img" aria-label="User avatar" />
              <HelpPanel
                isOpen={helpOpen}
                onClose={() => setHelpOpen(false)}
                panelId={helpPanelId}
              />
              <NotificationsPanel
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                panelId={notificationsPanelId}
              />
            </div>
          ) : null}
        </header>
        <main className="studio-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      <StudioMobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        navItems={navItems}
        isActiveMatch={isActiveMatch}
        onSupport={() => {
          setMobileNavOpen(false);
          setSupportOpen(true);
        }}
        onSignOut={() => {
          setMobileNavOpen(false);
          setSignOutOpen(true);
        }}
      />
      <SupportSignOutPanel
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
        mode="support"
      />
      <SupportSignOutPanel
        isOpen={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        mode="sign-out"
      />
    </div>
  );
}
