import { useState, type ReactElement } from 'react';

import {
  DataTable,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import {
  EvidenceTraceList,
  WorkstationDrawer,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import {
  calculateUnderwritingMetrics,
  formatCurrency,
  formatMultiple,
  formatPercent,
} from '@/lib/underwriting';
import { studioDealPath, underwritingAssumptionsByDeal } from '@/data/studio';
import { StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

import { ASSUMPTION_TRACE_ITEMS } from './deal-route-shared';

export function StudioDebtPanelPage(): ReactElement {
  const deal = useStudioDeal();
  const assumptions =
    underwritingAssumptionsByDeal[deal?.id ?? ''] ??
    underwritingAssumptionsByDeal['riverside-flats'];
  const metrics = calculateUnderwritingMetrics(assumptions);
  const [quoteOpen, setQuoteOpen] = useState(false);
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Debt / lender quote panel"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <PageTitle
        eyebrow="Debt posture"
        title="Debt / lender quote panel"
        lede="Track DSCR, LTV, debt yield, and source-pending lender quote gates."
      />
      <NonProductionCallout>
        Lender quote capture is mock-only. No files, providers, storage, or borrower data are used.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <GateResolutionCallout
        action="Lock assumptions"
        prerequisite="A lender quote is missing and DSCR remains source pending."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'underwriting')}
        resolveLabel="Go to Underwriting"
      />
      <div className="metric-grid four">
        <MetricCard
          label="DSCR"
          value={formatMultiple(metrics.dscr)}
          detail="Source pending"
          icon="warning"
        />
        <MetricCard label="LTV" value={formatPercent(assumptions.ltv)} detail="Mock lender case" />
        <MetricCard
          label="Debt amount"
          value={formatCurrency(metrics.debtAmount)}
          detail="Formula-backed"
        />
        <MetricCard
          label="Annual debt service"
          value={formatCurrency(metrics.annualDebtService)}
          detail="Quote pending"
          icon="pending"
        />
      </div>
      <div className="dashboard-grid">
        <StudioCard title="Lender Quote Gate" className="wide-card">
          <div className="blocked-panel">
            <strong>Lender quote missing</strong>
            <p>
              DSCR and debt yield remain advisory until a reviewed term sheet or lender quote is
              attached as candidate evidence.
            </p>
          </div>
          <EvidenceTraceList
            items={ASSUMPTION_TRACE_ITEMS.filter((item) => item.id === 'debt-service')}
          />
          <button type="button" className="btn btn-primary" onClick={() => setQuoteOpen(true)}>
            Add Mock Lender Quote
          </button>
        </StudioCard>
        <StudioCard title="Debt Assumptions">
          <DataTable
            caption="Debt assumptions"
            headers={['Assumption', 'Value', 'Posture']}
            rows={[
              [
                'Interest rate',
                formatPercent(assumptions.interestRate),
                <TrustBadge state="Source pending" />,
              ],
              [
                'Amortization',
                `${assumptions.amortizationYears} years`,
                <TrustBadge state="Model-inferred" />,
              ],
              [
                'Loan-to-value',
                formatPercent(assumptions.ltv),
                <TrustBadge state="Candidate evidence" />,
              ],
            ]}
          />
        </StudioCard>
      </div>
      <WorkstationDrawer
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        title="Add mock lender quote"
        footer={
          <PrototypeActionButton
            feature="Save lender quote candidate evidence"
            className="btn btn-primary"
          >
            Save Candidate Quote
          </PrototypeActionButton>
        }
      >
        <label className="form-field">
          Lender
          <input defaultValue="Regional Bank term sheet (mock)" />
        </label>
        <label className="form-field">
          Rate
          <input defaultValue="6.75%" />
        </label>
        <label className="form-field">
          Term
          <input defaultValue="5 years fixed, 30-year amortization" />
        </label>
        <p className="muted">
          Saving creates candidate evidence only and does not upload, store, or send files.
        </p>
      </WorkstationDrawer>
      <ContextualSurfaceTriggers dealId={deal.id} route="debt" />
    </div>
  );
}
