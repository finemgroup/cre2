import { Link, NavLink, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { getStudioNavItems } from '@/data/studio';

type StudioMobileNavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: ReturnType<typeof getStudioNavItems>;
  isActiveMatch: (path: string, match: string) => boolean;
  onSupport: () => void;
  onSignOut: () => void;
};

export function StudioMobileNavDrawer({
  isOpen,
  onClose,
  navItems,
  isActiveMatch,
  onSupport,
  onSignOut,
}: StudioMobileNavDrawerProps): ReactElement {
  const location = useLocation();

  return (
    <SophexSheet isOpen={isOpen} onClose={onClose} label="Studio navigation">
      <Link to="/studio/deal-intake" className="studio-new-deal" onClick={onClose}>
        <MaterialIcon name="add" />
        New Deal
      </Link>
      <nav className="studio-mobile-nav" aria-label="Studio mobile navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              isActive || isActiveMatch(location.pathname, item.match) ? 'active' : undefined
            }
          >
            <MaterialIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="studio-mobile-nav-footer">
        <button type="button" className="btn btn-ghost" onClick={onSupport}>
          <MaterialIcon name="contact_support" />
          Support
        </button>
        <button type="button" className="btn btn-ghost" onClick={onSignOut}>
          <MaterialIcon name="logout" />
          Sign Out
        </button>
      </div>
    </SophexSheet>
  );
}
