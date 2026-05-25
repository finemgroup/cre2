import { Link, useLocation, useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { StudioCard } from '@/components/studio/StudioPrimitives';
import { AdvancedWorkflowNav } from '@/components/workstation/AdvancedWorkflowNav';
import { DealContextStrip } from '@/components/workflow/DealContextStrip';
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
  const tabGroups = [
    {
      label: 'Core',
      tabs: [
        ['Overview', studioDealPath(deal.id), /^\/studio\/deals\/[^/]+$/],
        ['Inputs', studioDealPath(deal.id, 'intake'), /\/intake$/],
      ],
    },
    {
      label: 'Evidence',
      tabs: [
        ['Evidence', studioDealPath(deal.id, 'data-review'), /\/data-review$/],
        ['Comps', studioDealPath(deal.id, 'comps'), /\/comps$/],
      ],
    },
    {
      label: 'Model',
      tabs: [
        [
          'Underwriting',
          studioDealPath(deal.id, 'underwriting'),
          /\/underwriting(?:\/(?:sources|debt))?$/,
        ],
        ['Scenarios', studioDealPath(deal.id, 'scenarios'), /\/scenarios$/],
      ],
    },
    {
      label: 'Delivery',
      tabs: [
        ['Snapshots', studioDealPath(deal.id, 'versions'), /\/versions$/],
        ['Reports', studioReportPath(deal.id), /^\/studio\/reports\//],
      ],
    },
  ] as const;

  return (
    <>
      <DealContextStrip dealId={deal.id} dealName={deal.name} />
      <DealStageStepper dealId={deal.id} />
      <div className="deal-workflow-nav-groups" aria-label="Deal workflow sections">
        {tabGroups.map((group) => (
          <section key={group.label} className="deal-workflow-nav-group">
            <p className="studio-eyebrow">{group.label}</p>
            <nav className="tabs-row" aria-label={`${group.label} workflow links`}>
              {group.tabs.map(([tab, href, matcher]) => {
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
          </section>
        ))}
      </div>
      <AdvancedWorkflowNav dealId={deal.id} />
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
