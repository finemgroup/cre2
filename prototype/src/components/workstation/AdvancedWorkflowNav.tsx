import { Link, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { studioDealPath } from '@/data/studio';

export function AdvancedWorkflowNav({ dealId }: { dealId: string }): ReactElement {
  const location = useLocation();
  const links = [
    { label: 'Capital stack', to: studioDealPath(dealId, 'capital-stack') },
    { label: 'IC packet', to: studioDealPath(dealId, 'ic-packet') },
    { label: 'HITL review', to: studioDealPath(dealId, 'hitl-review') },
    { label: 'Spatial workbench', to: studioDealPath(dealId, 'spatial') },
  ] as const;

  return (
    <nav className="advanced-workflow-nav" aria-label="Advanced mock-only surfaces">
      <p className="studio-eyebrow">Wave 3 surfaces</p>
      <div className="tabs-row">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.label}
              to={link.to}
              className={active ? 'active tab-link' : 'tab-link'}
              aria-current={active ? 'page' : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
