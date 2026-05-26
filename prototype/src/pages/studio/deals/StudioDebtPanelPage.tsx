import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

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
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import {
  EvidenceTraceList,
  WorkstationDrawer,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { formatCurrency, formatMultiple, formatPercent } from '@/lib/underwriting';
import { getStudioDebtPanelView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound } from '@/pages/studio/StudioShared';

export function StudioDebtPanelPage(): ReactElement {
  const { dealId } = useParams();
  const debtState = useRuntimeResource(
    () => runtimeServices.studio.getDebtPanel(dealId),
    `debt-panel-${dealId ?? 'missing'}`,
    getStudioDebtPanelView(dealId)
  );
  const debtView = debtState.value;
  const deal = debtView?.deal;
  const assumptions = debtView?.assumptions;
  const metrics = debtView?.metrics;
  const debtTraceItem = debtView?.debtTraceItem;
  const quotePending = debtView?.quotePending ?? true;
  const sourceBlocks = debtView?.sourceBlocks ?? [];
  const [quoteOpen, setQuoteOpen] = useState(false);

  if (!deal && !debtState.loading) return <StudioDealNotFound />;

  return (
    <div>
      {deal ? (
        <WorkflowContextHeader
          dealName={deal.name}
          stage="Debt / lender quote panel"
          returnTo={studioDealPath(deal.id, 'underwriting')}
          returnLabel="Return to cockpit"
        />
      ) : null}
      <PageTitle
        eyebrow="Debt posture"
        title="Debt / lender quote panel"
        lede="Track DSCR, LTV, debt yield, and source-pending lender quote gates."
      />
      <NonProductionCallout>
        Lender quote capture is mock-only. No files, providers, storage, or borrower data are used.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <RuntimeResourceStatus
        loading={debtState.loading}
        error={debtState.error}
        variant="studio-deal"
      />
      {deal && assumptions && metrics && !debtState.loading ? (
        <>
          <ReviewPostureBanner blocks={sourceBlocks} />
          <div className="proof-strip" aria-label="Debt quote posture">
            {[
              [quotePending ? 'Pending' : 'Attached', 'Lender quote'],
              [formatMultiple(metrics.dscr), 'DSCR'],
              [formatPercent(assumptions.ltv), 'LTV'],
              [debtTraceItem ? 'Linked' : 'Missing', 'Source trace row'],
            ].map(([value, label]) => (
              <article key={String(label)}>
                <strong className="fin-value">{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <GateResolutionCallout
            action="Lock assumptions"
            prerequisite="A lender quote is missing and DSCR remains source pending."
            owner="An analyst"
            resolveTo={studioDealPath(deal.id, 'underwriting-sources')}
            resolveLabel="Open assumption source trace"
          />
          <div className="metric-grid four">
            <MetricCard
              label="DSCR"
              value={formatMultiple(metrics.dscr)}
              detail={quotePending ? 'Source pending' : 'Reviewed'}
              icon={quotePending ? 'warning' : undefined}
            />
            <MetricCard
              label="LTV"
              value={formatPercent(assumptions.ltv)}
              detail="Mock lender case"
            />
            <MetricCard
              label="Debt amount"
              value={formatCurrency(metrics.debtAmount)}
              detail="Formula-backed"
            />
            <MetricCard
              label="Annual debt service"
              value={formatCurrency(metrics.annualDebtService)}
              detail={quotePending ? 'Quote pending' : 'Reviewed'}
              icon={quotePending ? 'pending' : undefined}
            />
          </div>
          <div className="dashboard-grid">
            <StudioCard title="Lender Quote Gate" className="wide-card">
              <div className="blocked-panel">
                <strong>
                  {quotePending ? 'Lender quote missing' : 'Lender quote candidate attached'}
                </strong>
                <p>
                  DSCR and debt yield remain advisory until a reviewed term sheet or lender quote is
                  attached as candidate evidence.
                </p>
              </div>
              {debtTraceItem ? (
                <EvidenceTraceList items={[debtTraceItem]} />
              ) : (
                <p className="muted">
                  No debt-service trace row returned from the runtime adapter.
                </p>
              )}
              <div className="studio-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setQuoteOpen(true)}
                >
                  Add Mock Lender Quote
                </button>
                <PrototypeActionLink
                  to={studioDealPath(deal.id, 'underwriting-sources')}
                  className="btn btn-secondary"
                  feature="Open debt source trace"
                >
                  Open source trace
                </PrototypeActionLink>
              </div>
            </StudioCard>
            <StudioCard title="Debt Assumptions">
              <DataTable
                caption="Debt assumptions"
                headers={['Assumption', 'Value', 'Posture']}
                rows={[
                  [
                    'Interest rate',
                    formatPercent(assumptions.interestRate),
                    <TrustBadge state={quotePending ? 'Source pending' : 'Reviewed'} />,
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
              <Link to={studioDealPath(deal.id, 'underwriting')} className="btn btn-secondary">
                Return to underwriting cockpit
              </Link>
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
        </>
      ) : null}
    </div>
  );
}
