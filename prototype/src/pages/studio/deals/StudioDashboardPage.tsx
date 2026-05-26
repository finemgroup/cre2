import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import {
  AnimatedList,
  DataTable,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StatusBadge,
  StudioCard,
  TrustBadge,
} from '@/components/studio/StudioPrimitives';
import { ActivityTimelinePanel } from '@/components/workflow/WorkflowPrimitives';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { activity, DEFAULT_DEAL_ID, studioDealPath } from '@/data/studio';
import { getStudioDashboardView } from '@/lib/runtime/studio-workspace';
import { formatOnboardingSummary, getOnboardingProfile } from '@/lib/studio/onboarding-profile';

export function StudioDashboardPage(): ReactElement {
  const dashboardView = getStudioDashboardView();
  const onboardingProfile = getOnboardingProfile();

  return (
    <div>
      <PageTitle
        eyebrow={onboardingProfile ? 'Workspace configured' : 'Welcome back, Alex'}
        title="Main Deal Dashboard"
        lede={
          onboardingProfile
            ? `${formatOnboardingSummary(onboardingProfile)} — mock broker workspace ready for review.`
            : 'Track active mandates, plan usage, and source-aware broker workflow activity.'
        }
        actions={
          <>
            <div className="usage-pill">
              <span>Plan usage</span>
              <strong>
                {onboardingProfile?.tier === 'Boutique' ? '1 of 3 deals' : '1 of 2 deals'}
              </strong>
              <div
                className="progress-bar progress-bar-compact"
                role="progressbar"
                aria-label="Plan usage"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={50}
                aria-valuetext="50% of deal quota used"
              >
                <div className="progress-fill progress-fill-half" />
              </div>
            </div>
            <Link to={studioDealPath(DEFAULT_DEAL_ID, 'intake')} className="btn btn-primary">
              Import OM
            </Link>
            <Link to={studioDealPath(DEFAULT_DEAL_ID, 'intake')} className="btn btn-secondary">
              New Deal
            </Link>
          </>
        }
      />
      <NonProductionCallout>
        Dashboard KPIs are synthetic projections for product validation.
      </NonProductionCallout>
      <div className="metric-grid four">
        <MetricCard label="Active pipeline" value="$193.5M" detail="3 tracked deals" />
        <MetricCard label="Reports drafted" value="12" detail="4 need review" icon="description" />
        <MetricCard label="Comp sets" value="28" detail="7 premium-private" icon="analytics" />
        <MetricCard label="Plan usage" value="72%" detail="Premium mock tier" icon="speed" />
      </div>
      <div className="dashboard-grid">
        <StudioCard title="Deal Pipeline" className="wide-card">
          {dashboardView.deals.length === 0 ? (
            <p className="muted" role="status">
              No active deals in this mock workspace. Start with Import OM or New Deal.
            </p>
          ) : (
            <DataTable
              caption="Deal pipeline"
              headers={['Deal', 'Market', 'Stage', 'Value', 'Authority']}
              getRowKey={(_row, index) => dashboardView.deals[index].id}
              rows={dashboardView.deals.map((deal) => [
                <Link key={deal.id} to={studioDealPath(deal.id)}>
                  {deal.name}
                </Link>,
                deal.market,
                <StatusBadge status={deal.stage} />,
                deal.value,
                <TrustBadge state={deal.authority} />,
              ])}
            />
          )}
        </StudioCard>
        <div>
          <StudioCard title="Upgrade Coverage">
            <p>
              Premium unlocks additional comp authority tiers, scenario sensitivity, and white-label
              exports.
            </p>
            <PrototypeActionLink
              to="/studio/settings/billing"
              className="btn btn-primary"
              feature="Plan upgrade"
            >
              Upgrade plan
            </PrototypeActionLink>
          </StudioCard>
          <StudioCard title="Recent Activity">
            <AnimatedList className="activity-list">
              <ActivityTimelinePanel items={activity} />
            </AnimatedList>
          </StudioCard>
        </div>
      </div>
      <footer className="studio-footer">Finem CRE Studio dashboard - mock data only.</footer>
    </div>
  );
}
