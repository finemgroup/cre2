import { useState, type ReactElement } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import {
  HelpPanel,
  NotificationsPanel,
  SupportSignOutPanel,
} from '@/components/overlays/StudioTopbarPanels';
import { StudioMobileNavDrawer } from '@/components/overlays/StudioMobileNavDrawer';
import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import {
  getDealIdFromPath,
  getStudioNavItems,
  studioDealPath,
  studioReportPath,
} from '@/data/studio';
import { useRouteTitle } from '@/lib/a11y/useRouteTitle';

function isActiveMatch(path: string, match: string): boolean {
  if (match === 'dashboard') return path === '/studio/dashboard' || path === '/studio';
  if (match === 'deal-intake') return path === '/studio/deal-intake' || /\/intake$/.test(path);
  if (match === 'deal-overview') return /^\/studio\/deals\/[^/]+$/.test(path);
  if (match === 'comps') return /\/comps$/.test(path);
  if (match === 'underwriting') return /\/underwriting$/.test(path) || /\/scenarios$/.test(path);
  if (match === 'reports') return path.startsWith('/studio/reports/');
  if (match === 'billing') return path === '/studio/settings/billing';
  if (match === 'white-label') return path === '/studio/settings/white-label';
  if (match === 'broker-os') return path === '/studio/broker-os';
  return path.startsWith(match);
}

export function StudioAppShell(): ReactElement {
  const location = useLocation();
  const isStandaloneMarketing =
    location.pathname === '/studio' || location.pathname === '/studio/onboarding';
  const isBrokerOs = location.pathname === '/studio/broker-os';
  const activeDealId = getDealIdFromPath(location.pathname);
  const navItems = getStudioNavItems(activeDealId);
  const activeItem = navItems.find((item) => isActiveMatch(location.pathname, item.match));
  useRouteTitle(`${activeItem?.label ?? 'Studio'} - Finem CRE Studio`);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  if (isStandaloneMarketing) {
    return (
      <div className="studio-standalone studio-marketing-shell">
        <a href="#page-content" className="skip-link">
          Skip to content
        </a>
        <RouteProgress />
        <main className="studio-standalone-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    );
  }

  return (
    <div className={isBrokerOs ? 'studio-shell broker-os-shell' : 'studio-shell'}>
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
            <span>Enterprise Plan</span>
          </div>
        </div>
        <Link to="/studio/deal-intake" className="studio-new-deal">
          <MaterialIcon name="add" />
          New Deal
        </Link>
        <div className="studio-nav-scroll-wrap">
          <nav className="studio-nav" aria-label="Finem Studio navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  isActive || isActiveMatch(location.pathname, item.match) ? 'active' : undefined
                }
              >
                <MaterialIcon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
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
        {isBrokerOs ? null : (
          <header className="studio-topbar">
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
            <nav aria-label="Studio quick links">
              <Link to="/studio/dashboard">Dashboard</Link>
              <Link to={studioDealPath(activeDealId)}>Deals</Link>
              <Link to={studioReportPath(activeDealId)}>Reports</Link>
              <Link to="/">Sophex</Link>
            </nav>
            <div className="studio-topbar-actions">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
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
                onClick={() => {
                  setHelpOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
              >
                <MaterialIcon name="help" />
              </button>
              <span className="avatar" aria-label="User avatar" />
              <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
              <NotificationsPanel
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>
          </header>
        )}
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
