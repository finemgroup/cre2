import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { getDealIdFromPath, getStudioNavItems, studioDealPath, studioReportPath } from '@/data/studio';

function isActiveMatch(path: string, match: string): boolean {
  if (match === 'dashboard') return path === '/studio/dashboard' || path === '/studio';
  if (match === 'deal-intake') return path === '/studio/deal-intake';
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
        <div className="studio-sidebar-footer">
          <a href="#support">
            <MaterialIcon name="contact_support" />
            Support
          </a>
          <a href="#sign-out">
            <MaterialIcon name="logout" />
            Sign Out
          </a>
        </div>
      </aside>
      <div className="studio-main">
        {isBrokerOs ? null : <header className="studio-topbar">
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
            <button type="button" aria-label="Notifications">
              <MaterialIcon name="notifications" />
            </button>
            <button type="button" aria-label="Help">
              <MaterialIcon name="help" />
            </button>
            <span className="avatar" aria-label="User avatar" />
          </div>
        </header>}
        <main className="studio-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
