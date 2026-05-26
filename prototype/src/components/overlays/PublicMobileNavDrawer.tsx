import { NavLink } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';

type PublicMobileNavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PublicMobileNavDrawer({
  isOpen,
  onClose,
}: PublicMobileNavDrawerProps): ReactElement {
  return (
    <SophexSheet isOpen={isOpen} onClose={onClose} label="Public navigation">
      <nav className="public-mobile-nav" aria-label="Primary">
        <NavLink to="/" end onClick={onClose} aria-label="Search properties">
          Search
        </NavLink>
        <NavLink to="/upload" onClick={onClose} aria-label="Upload documents">
          Upload
        </NavLink>
        <NavLink to="/studio" onClick={onClose} aria-label="Open Finem CRE Studio">
          Studio
        </NavLink>
      </nav>
    </SophexSheet>
  );
}
