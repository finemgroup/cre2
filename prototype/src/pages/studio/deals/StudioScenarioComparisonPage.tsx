import { useMemo, useState, type ReactElement } from 'react';

import {
  DataTable,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { SensitivityMatrix } from '@/components/underwriting/UnderwritingPanels';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { UpgradePlanModal } from '@/components/overlays/UpgradePlanModal';
import { AccessibleBarChart } from '@/components/visualization/AccessibleBarChart';
import { SensitivityHeatmap } from '@/components/visualization/SensitivityHeatmap';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import {
  ReadinessRail,
  SensitivityCellDrilldownDrawer,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import {
  buildSensitivityGrid,
  calculateUnderwritingMetrics,
  formatCurrency,
  formatMultiple,
  formatPercent,
} from '@/lib/underwriting';
import { listScenarioPresets } from '@/lib/underwriting/scenarios';
import { studioDealPath, underwritingAssumptionsByDeal } from '@/data/studio';
import { StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

export function StudioScenarioComparisonPage(): ReactElement {
  const deal = useStudioDeal();
  const heatmapLocked = false;
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    purchasePrice: number;
    exitCapRate: number;
    metrics: ReturnType<typeof calculateUnderwritingMetrics>;
  } | null>(null);
  const assumptions =
    underwritingAssumptionsByDeal[deal?.id ?? ''] ??
    underwritingAssumptionsByDeal['riverside-flats'];
  const grid = useMemo(() => buildSensitivityGrid(assumptions), [assumptions]);
  const scenarioMetrics = useMemo(
    () =>
      listScenarioPresets(assumptions).map(({ name, assumptions: scenarioAssumptions }) => ({
        name,
        metrics: calculateUnderwritingMetrics(scenarioAssumptions),
      })),
    [assumptions]
  );
  const irrValues = scenarioMetrics.map((scenario) => scenario.metrics.irr);
  const maxIrr = Math.max(...irrValues);
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Scenario comparison"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to underwriting"
      />
      <PageTitle
        eyebrow="Scenario governance"
        title="Scenario Comparison & Sensitivity"
        lede="Compare governed scenario presets, driver deltas, and advisory sensitivity output before lock."
      />
      <p className="muted">
        Scenario cards, tables, and the sensitivity heatmap support keyboard navigation. Heatmap
        selection opens an advisory drilldown drawer.
      </p>
      <NonProductionCallout>
        Scenario outputs are mock calculations and not investment recommendations. Lock remains
        disabled until source and lender gates clear.
      </NonProductionCallout>
      <MockBoundaryBanner variant="scenario" />
      <GateResolutionCallout
        action="Promote scenario to valuation snapshot"
        prerequisite="Upside rent growth remains candidate evidence and lender quote is still missing."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'underwriting-debt')}
        resolveLabel="Review debt / lender quote"
      />
      <div className="scenario-grid">
        {scenarioMetrics.map((scenario) => (
          <StudioCard key={scenario.name} title={scenario.name}>
            <MetricCard
              label="IRR"
              value={formatPercent(scenario.metrics.irr)}
              detail="Model-inferred"
            />
            <MetricCard
              label="Equity Multiple"
              value={formatMultiple(scenario.metrics.equityMultiple)}
              detail={`Value ${formatCurrency(scenario.metrics.indicatedValue)}`}
            />
          </StudioCard>
        ))}
      </div>
      <StudioCard title="Scenario metrics">
        <DataTable
          caption="Scenario comparison metrics"
          headers={['Scenario', 'IRR', 'Equity multiple', 'Indicated value']}
          rows={scenarioMetrics.map((scenario) => [
            scenario.name,
            formatPercent(scenario.metrics.irr),
            formatMultiple(scenario.metrics.equityMultiple),
            formatCurrency(scenario.metrics.indicatedValue),
          ])}
          getRowKey={(_row, index) => scenarioMetrics[index].name}
        />
      </StudioCard>
      <StudioCard
        title="Driver Comparison"
        actions={
          <PrototypeActionLink
            to={studioDealPath(deal.id, 'underwriting-sources')}
            className="btn btn-secondary"
            feature="Scenario driver evidence"
          >
            Open evidence trace
          </PrototypeActionLink>
        }
      >
        <DataTable
          caption="Scenario driver comparison with source posture"
          headers={[
            'Driver',
            'Base',
            'Upside',
            'Downside',
            'Max delta',
            'Source posture',
            'Gate implication',
          ]}
          rows={[
            [
              'Vacancy',
              '4.5%',
              '3.5%',
              '4.5%',
              '1.0%',
              <TrustBadge state="Reviewed" />,
              'Clear for scenario lock',
            ],
            [
              'Rent growth',
              '3.0%',
              '4.2%',
              '1.8%',
              '2.4%',
              <TrustBadge state="Candidate evidence" />,
              'Reviewer required before upside lock',
            ],
            [
              'Exit cap rate',
              '5.75%',
              '5.75%',
              '6.25%',
              '0.50%',
              <TrustBadge state="Candidate evidence" />,
              'Export blocked until comp citation clears',
            ],
            [
              'Interest rate',
              '6.75%',
              '6.75%',
              '6.75%',
              '-',
              <TrustBadge state="Source pending" />,
              'Lender quote required for DSCR gate',
            ],
            [
              'Renovation budget',
              '$2.4M',
              '$2.4M',
              '$2.4M',
              '-',
              <TrustBadge state="Reviewer required" />,
              'Senior signoff before IC memo export',
            ],
          ]}
        />
      </StudioCard>
      <StudioCard title="Key Metrics Matrix">
        <SensitivityMatrix grid={grid} />
      </StudioCard>
      <StudioCard title="IRR Bar Chart">
        <AccessibleBarChart
          title="IRR by scenario"
          caption="IRR by scenario. Bar heights are decorative; use the table for exact values."
          items={scenarioMetrics.map((scenario) => ({
            id: scenario.name,
            label: scenario.name,
            value: formatPercent(scenario.metrics.irr),
            ratio: scenario.metrics.irr / maxIrr,
          }))}
          tableHeaders={['Scenario', 'IRR']}
        />
      </StudioCard>
      <StudioCard title="Sensitivity Heatmap">
        <SensitivityHeatmap
          grid={grid}
          locked={heatmapLocked}
          onUnlock={() => setUpgradeOpen(true)}
          onSelectCell={(cell) => setSelectedCell(cell)}
        />
      </StudioCard>
      <StudioCard title="Scenario Gates">
        <ReadinessRail
          orientation="horizontal"
          items={[
            {
              id: 'base-reviewed',
              label: 'Base reviewed',
              status: 'ready',
              detail: 'IC memo v2 source references are linked.',
            },
            {
              id: 'upside-source',
              label: 'Upside source pending',
              status: 'warning',
              detail: 'Market comp data is candidate evidence.',
            },
            {
              id: 'downside-lender',
              label: 'Downside lender quote missing',
              status: 'blocked',
              detail: 'Term sheet draft is required before lock.',
            },
          ]}
        />
        <p className="muted" id="scenario-lock-blocked">
          Scenario set lock is simulated and disabled while downside lender quote and upside source
          gates remain open.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          disabled
          aria-describedby="scenario-lock-blocked"
        >
          Lock Scenario Set
        </button>
      </StudioCard>
      <UpgradePlanModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature="Sensitivity heatmap"
        detail="Premium unlocks IRR/DSCR heatmaps across purchase price and exit cap ranges."
      />
      <SensitivityCellDrilldownDrawer
        isOpen={selectedCell !== null}
        onClose={() => setSelectedCell(null)}
        purchasePrice={selectedCell?.purchasePrice ?? assumptions.purchasePrice}
        exitCap={selectedCell?.exitCapRate ?? assumptions.exitCapRate}
        metrics={selectedCell?.metrics ?? calculateUnderwritingMetrics(assumptions)}
      />
      <ContextualSurfaceTriggers dealId={deal.id} route="scenarios" />
    </div>
  );
}
