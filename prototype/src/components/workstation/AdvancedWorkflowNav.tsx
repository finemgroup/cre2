import { Link, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { studioDealPath } from '@/data/studio';

const ADVANCED_LINKS = [
  {
    label: 'Capital structure',
    to: (dealId: string) => studioDealPath(dealId, 'capital-stack'),
    gate: 'After scenario selection',
  },
  {
    label: 'IC packet',
    to: (dealId: string) => studioDealPath(dealId, 'ic-packet'),
    gate: 'Requires locked snapshot',
  },
  {
    label: 'Analyst review',
    to: (dealId: string) => studioDealPath(dealId, 'hitl-review'),
    gate: 'Internal-only',
  },
  {
    label: 'Location intelligence',
    to: (dealId: string) => studioDealPath(dealId, 'spatial'),
    gate: 'Evidence stage',
  },
] as const;

export function AdvancedWorkflowNav({ dealId }: { dealId: string }): ReactElement {
  const location = useLocation();

  return (
    <nav className="advanced-workflow-nav" aria-label="Advanced delivery surfaces">
      <p className="studio-eyebrow">Advanced / delivery</p>
      <div className="tabs-row">
        {ADVANCED_LINKS.map((link) => {
          const to = link.to(dealId);
          const active = location.pathname === to;
          return (
            <Link
              key={link.label}
              to={to}
              className={active ? 'active tab-link' : 'tab-link'}
              aria-current={active ? 'page' : undefined}
              title={link.gate}
            >
              {link.label}
              <small className="advanced-nav-gate">{link.gate}</small>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
