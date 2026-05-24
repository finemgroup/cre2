import { Link, useLocation, useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { StudioCard } from '@/components/studio/StudioPrimitives';
import { getStudioDeal, studioDealPath, studioReportPath, type Deal } from '@/data/studio';

export function useStudioDeal(): Deal | undefined {
  const { dealId } = useParams();
  return getStudioDeal(dealId);
}

export function StudioDealNotFound(): ReactElement {
  return (
    <StudioCard title="Deal not found" eyebrow="Route guard">
      <p>The requested sample deal does not exist in the prototype mock dataset.</p>
      <Link to="/studio/dashboard" className="btn btn-primary">
        Return to dashboard
      </Link>
    </StudioCard>
  );
}

export function DealWorkflowTabs({ deal }: { deal: Deal }): ReactElement {
  const location = useLocation();
  const tabs = [
    ['Overview', studioDealPath(deal.id), /^\/studio\/deals\/[^/]+$/],
    ['Inputs', `/studio/deals/${deal.id}/intake`, /\/intake$/],
    ['Comps', studioDealPath(deal.id, 'comps'), /\/comps$/],
    ['Underwriting', studioDealPath(deal.id, 'underwriting'), /\/underwriting$/],
    ['Scenarios', studioDealPath(deal.id, 'scenarios'), /\/scenarios$/],
    ['Reports', studioReportPath(deal.id), /^\/studio\/reports\//],
  ] as const;

  return (
    <nav className="tabs-row" aria-label="Deal workflow sections">
      {tabs.map(([tab, href, matcher]) => {
        const active = matcher.test(location.pathname);
        return (
          <Link
            key={tab}
            className={active ? 'active tab-link' : 'tab-link'}
            to={href}
            aria-current={active ? 'page' : undefined}
          >
            {tab}
          </Link>
        );
      })}
    </nav>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (nextValue: T) => void;
}): ReactElement {
  return (
    <div className="segmented-control" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          className={value === option ? 'active' : ''}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
