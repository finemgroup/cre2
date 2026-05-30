import { Link, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';

const DEFAULT_DEMO_PROPERTY_ID = 'demo-001';
const DEFAULT_DEMO_DEAL_ID = 'riverside-flats';

function demoQuery(search: string): string {
  const state = new URLSearchParams(search).get('state');
  return state ? `?state=${encodeURIComponent(state)}` : '';
}

type PublicMobileNavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PublicMobileNavDrawer({
  isOpen,
  onClose,
}: PublicMobileNavDrawerProps): ReactElement {
  const location = useLocation();
  const stateQuery = demoQuery(location.search);
  const links = [
    { label: 'Explore', to: '/', active: location.pathname === '/', icon: 'explore' },
    {
      label: 'Comps',
      to: `/property/${DEFAULT_DEMO_PROPERTY_ID}/comps${stateQuery}`,
      active: location.pathname.includes('/comps'),
      icon: 'compare_arrows',
    },
    {
      label: 'Intelligence',
      to: `/property/${DEFAULT_DEMO_PROPERTY_ID}${stateQuery}`,
      active: location.pathname.startsWith('/property/') && !location.pathname.includes('/comps'),
      icon: 'psychology',
    },
    {
      label: 'Underwrite',
      to: `/studio/deals/${DEFAULT_DEMO_DEAL_ID}/underwriting`,
      active: location.pathname.includes('/underwriting'),
      icon: 'analytics',
    },
    {
      label: 'Review',
      to: `/review/${DEFAULT_DEMO_PROPERTY_ID}${stateQuery}`,
      active:
        location.pathname.startsWith('/review/') ||
        location.pathname.startsWith('/export/') ||
        location.pathname.startsWith('/sources/'),
      icon: 'task_alt',
    },
  ];

  return (
    <SophexSheet isOpen={isOpen} onClose={onClose} label="Public navigation">
      <nav className="public-mobile-nav" aria-label="Primary">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={onClose}
            className={link.active ? 'active' : undefined}
            aria-current={link.active ? 'page' : undefined}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {link.icon}
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
        <Link to="/studio" onClick={onClose} className="public-mobile-nav__studio">
          <span className="material-symbols-outlined" aria-hidden="true">
            business_center
          </span>
          <span>Studio</span>
        </Link>
      </nav>
    </SophexSheet>
  );
}
