import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { PageTransition } from '@/components/motion/PageTransition';
import { RouteProgress } from '@/components/layout/RouteProgress';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { studioNavItems } from '@/data/studio';

function isActiveMatch(path: string, href: string): boolean {
  if (href === '/studio/dashboard') return path === href || path === '/studio';
  if (href.includes('/settings/white-label')) return path.startsWith('/studio/settings');
  if (href.includes('/comps')) return path.includes('/comps');
  if (href.includes('/underwriting')) return path.includes('/underwriting') || path.includes('/scenarios');
  if (href.includes('/reports')) return path.includes('/reports');
  if (href.includes('/deals/riverside-flats')) return path === href;
  return path.startsWith(href);
}

export function StudioAppShell(): ReactElement {
  const location = useLocation();

  return (
    <div className="studio-shell">
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
        <nav className="studio-nav">
          {studioNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive || isActiveMatch(location.pathname, item.href) ? 'active' : undefined
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
        <header className="studio-topbar">
          <Link to="/studio" className="studio-topbar-brand">
            Finem CRE Studio
          </Link>
          <nav aria-label="Studio quick links">
            <Link to="/studio/dashboard">Dashboard</Link>
            <Link to="/studio/deals/riverside-flats">Deals</Link>
            <Link to="/studio/reports/riverside-flats/builder">Reports</Link>
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
        </header>
        <main id="page-content" className="studio-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
