import { Link, useLocation, useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { StudioCard } from '@/components/studio/StudioPrimitives';
import { DealStageStepper } from '@/components/workflow/DealStageStepper';
import { studioDealPath, studioReportPath, type Deal } from '@/data/studio';
import { getStudioDealView } from '@/lib/runtime/studio-workspace';

export function useStudioDeal(): Deal | undefined {
  const { dealId } = useParams();
  return getStudioDealView(dealId)?.deal;
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
    ['Inputs', studioDealPath(deal.id, 'intake'), /\/intake$/],
    ['Evidence', studioDealPath(deal.id, 'data-review'), /\/data-review$/],
    ['Comps', studioDealPath(deal.id, 'comps'), /\/comps$/],
    [
      'Underwriting',
      studioDealPath(deal.id, 'underwriting'),
      /\/underwriting(?:\/(?:sources|debt))?$/,
    ],
    ['Scenarios', studioDealPath(deal.id, 'scenarios'), /\/scenarios$/],
    ['Snapshots', studioDealPath(deal.id, 'versions'), /\/versions$/],
    ['Reports', studioReportPath(deal.id), /^\/studio\/reports\//],
  ] as const;

  return (
    <>
      <DealStageStepper dealId={deal.id} />
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
      {/\/underwriting(?:\/(?:sources|debt))?$/.test(location.pathname) ? (
        <UnderwritingSubTabs deal={deal} />
      ) : null}
    </>
  );
}

export function UnderwritingSubTabs({ deal }: { deal: Deal }): ReactElement {
  const location = useLocation();
  const tabs = [
    ['Cockpit', studioDealPath(deal.id, 'underwriting'), /\/underwriting$/],
    ['Source trace', studioDealPath(deal.id, 'underwriting-sources'), /\/underwriting\/sources$/],
    ['Debt / lender quote', studioDealPath(deal.id, 'underwriting-debt'), /\/underwriting\/debt$/],
  ] as const;

  return (
    <nav className="tabs-row underwriting-sub-tabs" aria-label="Underwriting panels">
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
