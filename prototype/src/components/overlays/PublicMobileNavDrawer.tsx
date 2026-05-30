import { Link, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { getPublicProductLinks } from '@/lib/public/public-product-nav';

type PublicMobileNavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PublicMobileNavDrawer({
  isOpen,
  onClose,
}: PublicMobileNavDrawerProps): ReactElement {
  const location = useLocation();
  const links = getPublicProductLinks(location.pathname, location.search);

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
