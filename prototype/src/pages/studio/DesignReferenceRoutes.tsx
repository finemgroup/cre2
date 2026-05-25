import { useMemo, useState, type ReactElement } from 'react';

import { ReviewerAssignmentDrawer } from '@/components/workstation/ReviewerAssignmentDrawer';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import {
  DataTable,
  MaterialIcon,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StatusBadge,
  StickyActionBar,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import {
  HitlTrustTierBadge,
  reviewStateToHitlTier,
} from '@/components/workflow/HitlTrustTierBadge';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getReviewQueue } from '@/lib/runtime/review-queue';
import {
  getContextualReviewAssignments,
  type ReviewAssignment,
} from '@/lib/workflow/review-assignments';
import { studioDealPath, studioReportPath } from '@/data/studio';
import { DealWorkflowTabs, StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

const CAPITAL_STACK = [
  {
    tier: 'Senior debt',
    amount: '$28.5M',
    share: '67%',
    rate: '6.75%',
    posture: 'Source pending' as const,
  },
  {
    tier: 'Mezzanine',
    amount: '$4.2M',
    share: '10%',
    rate: '9.50%',
    posture: 'Candidate evidence' as const,
  },
  {
    tier: 'Equity',
    amount: '$9.8M',
    share: '23%',
    rate: '—',
    posture: 'Reviewed' as const,
  },
];

const WATERFALL_ROWS = [
  ['Return of capital', '100%', 'LP', 'Included in mock stack'],
  ['Preferred return', '8.0% IRR', 'LP', 'Advisory mock tier'],
  ['Catch-up', '—', 'GP', 'Reviewer required'],
  ['Promote split', '70 / 30', 'GP / LP', 'Not legal or tax advice'],
];

const IC_SECTIONS = [
  { name: 'Executive summary', status: 'Approved', citations: 4 },
  { name: 'Market & comps', status: 'Needs Review', citations: 12 },
  { name: 'Underwriting summary', status: 'Approved', citations: 8 },
  { name: 'Risk & mitigants', status: 'Draft', citations: 3 },
  { name: 'Capital stack appendix', status: 'Blocked', citations: 0 },
];

export function StudioCapitalStackPage(): ReactElement {
  const deal = useStudioDeal();
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Capital stack / waterfall"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <DealWorkflowTabs deal={deal} />
      <PageTitle
        eyebrow="Design reference promoted"
        title="Capital Stack & Waterfall"
        lede="Advisory mock economics — structure only, not LP reporting or legal conclusions."
      />
      <NonProductionCallout>
        Waterfall math is simplified prototype output. Export, LP reporting, and legal review remain
        gated.
      </NonProductionCallout>
      <div className="capital-stack-grid">
        <StudioCard title="Visual Capital Stack" eyebrow="Mock-only">
          <div className="capital-stack-chart" role="img" aria-label="Capital stack proportions">
            {CAPITAL_STACK.map((tier) => (
              <div
                key={tier.tier}
                className="capital-stack-segment"
                style={{ flexGrow: Number.parseInt(tier.share, 10) }}
              >
                <span>{tier.tier}</span>
                <strong>{tier.share}</strong>
              </div>
            ))}
          </div>
          <DataTable
            caption="Capital stack tiers"
            headers={['Tier', 'Amount', 'Share', 'Rate', 'Posture']}
            rows={CAPITAL_STACK.map((tier) => [
              tier.tier,
              tier.amount,
              tier.share,
              tier.rate,
              <TrustBadge key={tier.tier} state={tier.posture} />,
            ])}
          />
        </StudioCard>
        <StudioCard title="Waterfall Structure" eyebrow="Advisory">
          <DataTable
            caption="Mock waterfall tiers"
            headers={['Tier', 'Target', 'Recipient', 'Notes']}
            rows={WATERFALL_ROWS}
          />
          <div className="metric-grid two">
            <MetricCard label="LP IRR (mock)" value="14.2%" detail="Advisory" />
            <MetricCard label="GP promote" value="30%" detail="Reviewer required" />
          </div>
          <PrototypeActionButton
            feature="Export waterfall"
            className="btn btn-primary"
            disabled
            aria-describedby="export-waterfall-blocked"
          >
            Export Waterfall
          </PrototypeActionButton>
          <p className="sr-only" id="export-waterfall-blocked">
            Export waterfall is disabled in prototype. LP reporting and legal review remain gated.
          </p>
        </StudioCard>
      </div>
    </div>
  );
}

export function StudioIcPacketPage(): ReactElement {
  const deal = useStudioDeal();
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Investment committee packet"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <DealWorkflowTabs deal={deal} />
      <PageTitle
        eyebrow="Design reference promoted"
        title="Investment Committee Packet"
        lede="Pre-export IC review surface with section posture, blockers, and mock signoff gates."
      />
      <NonProductionCallout>
        IC packet delivery is simulated. Real reviewer assignment, legal workflow, and audit events
        remain runtime gated.
      </NonProductionCallout>
      <MockBoundaryBanner variant="ic" />
      <div className="dashboard-grid">
        <StudioCard title="Packet Readiness">
          <ReadinessRailMock />
          <StatusBadge status="Export gated" />
          <p className="muted">
            Two sections blocked; capital stack appendix withheld pending review.
          </p>
        </StudioCard>
        <StudioCard title="Section Review">
          {IC_SECTIONS.map((section) => (
            <div key={section.name} className="section-check governance-section">
              <MaterialIcon
                name={
                  section.status === 'Approved'
                    ? 'check_circle'
                    : section.status === 'Blocked'
                      ? 'block'
                      : 'pending'
                }
              />
              <div>
                <strong>{section.name}</strong>
                <span>
                  {section.citations} citations ·{' '}
                  {section.status === 'Approved'
                    ? 'Ready for IC inclusion'
                    : section.status === 'Blocked'
                      ? 'Excluded until blockers clear'
                      : 'Reviewer required before IC'}
                </span>
              </div>
              <StatusBadge status={section.status} />
            </div>
          ))}
        </StudioCard>
      </div>
      <StickyActionBarMock dealId={deal.id} />
    </div>
  );
}

export function StudioHitlReviewPage(): ReactElement {
  const deal = useStudioDeal();
  const [selected, setSelected] = useState<ReviewAssignment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const queue = useMemo(() => getReviewQueue(fixtureActors.internalOperator), []);
  const assignments = useMemo(() => getContextualReviewAssignments(), []);
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Reviewer assignment / HITL"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <DealWorkflowTabs deal={deal} />
      <PageTitle
        eyebrow="Internal-only projection"
        title="Reviewer Assignment Queue"
        lede="Mock HITL queue showing who must review what and why — queue completion is not promotion authority."
      />
      <NonProductionCallout>
        Assignments use mock internal users only. Notifications, SLAs, and persisted decisions are
        not implemented.
      </NonProductionCallout>
      <MockBoundaryBanner variant="review" />
      <div className="split-workstation-grid">
        <StudioCard title="Assigned Reviews" className="wide-card">
          <DataTable
            caption="HITL reviewer assignments"
            headers={['Field', 'Assignee', 'Queue state', 'Posture', 'Trust tier', 'Action']}
            rows={assignments.map((assignment) => [
              assignment.field,
              assignment.assignee,
              assignment.queueState,
              <TrustBadge key={`${assignment.id}-posture`} state={assignment.posture} />,
              <HitlTrustTierBadge key={`${assignment.id}-tier`} tier={assignment.trustTier} />,
              <button
                key={`${assignment.id}-action`}
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelected(assignment);
                  setDrawerOpen(true);
                }}
              >
                Open assignment
              </button>,
            ])}
          />
        </StudioCard>
        <StudioCard title="Operator Queue Projection">
          <p>
            <strong>{queue.length}</strong> candidate observations in operator queue
          </p>
          <ul className="governance-list">
            {queue.slice(0, 4).map((item) => (
              <li key={item.observation.id}>
                {item.observation.fieldKey} · {item.safeStatus}{' '}
                <HitlTrustTierBadge tier={reviewStateToHitlTier(item.observation.reviewState)} />
              </li>
            ))}
          </ul>
          <PrototypeActionLink
            to="/studio/broker-os"
            className="btn btn-secondary"
            feature="Broker OS queue"
          >
            Open Broker OS
          </PrototypeActionLink>
        </StudioCard>
      </div>
      <ReviewerAssignmentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        assignment={selected}
      />
    </div>
  );
}

function ReadinessRailMock(): ReactElement {
  return (
    <ul className="governance-list">
      <li>Assumptions · warning · two candidate values open</li>
      <li>Evidence · blocked · lender quote missing</li>
      <li>Review · pending · senior signoff required</li>
      <li>Export · blocked · IC packet not cleared</li>
    </ul>
  );
}

function StickyActionBarMock({ dealId }: { dealId: string }): ReactElement {
  return (
    <StickyActionBar>
      <span>IC delivery simulated · no live send</span>
      <PrototypeActionLink
        to={studioReportPath(dealId)}
        className="btn btn-secondary"
        feature="Open report builder"
      >
        Open Report Builder
      </PrototypeActionLink>
      <PrototypeActionButton
        feature="Send IC packet"
        className="btn btn-primary"
        disabled
        aria-describedby="ic-send-blocked"
      >
        Send to IC
      </PrototypeActionButton>
      <span className="sr-only" id="ic-send-blocked">
        IC delivery is simulated and disabled until section and evidence gates clear.
      </span>
    </StickyActionBar>
  );
}
