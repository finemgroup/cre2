import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { studioDealPath, studioReportPath, type StudioDealSection } from '@/data/studio';

export type ContextualSurfaceRoute =
  | 'data-review'
  | 'scenarios'
  | 'versions'
  | 'report-builder'
  | 'intake'
  | 'comps'
  | 'debt'
  | 'source-trace';

type SurfaceTrigger = {
  section: StudioDealSection | 'report-builder' | 'export';
  label: string;
  reason: string;
};

const TRIGGERS: Record<ContextualSurfaceRoute, SurfaceTrigger[]> = {
  'data-review': [
    {
      section: 'underwriting-sources',
      label: 'Assumption source trace',
      reason: 'Resolve unit count and rent roll conflicts before promotion.',
    },
    {
      section: 'spatial',
      label: 'Spatial evidence workbench',
      reason: 'Check source rights and verification before report context.',
    },
    {
      section: 'hitl-review',
      label: 'Analyst review queue',
      reason: 'Reviewer assignments stay advisory until gates clear.',
    },
  ],
  scenarios: [
    {
      section: 'versions',
      label: 'Valuation snapshots',
      reason: 'Lock one scenario with evidence refs before export.',
    },
    {
      section: 'capital-stack',
      label: 'Capital stack reference',
      reason: 'Review advisory stack and waterfall before IC packet.',
    },
    {
      section: 'underwriting-debt',
      label: 'Debt / lender quote',
      reason: 'DSCR and upside scenarios need term sheet citation.',
    },
  ],
  versions: [
    {
      section: 'scenarios',
      label: 'Scenario comparison',
      reason: 'Trace which scenario assumptions feed the active snapshot.',
    },
    {
      section: 'report-builder',
      label: 'Report builder',
      reason: 'Section review and export gates follow snapshot lock.',
    },
    {
      section: 'ic-packet',
      label: 'IC packet reference',
      reason: 'Delivery simulation remains export gated.',
    },
  ],
  'report-builder': [
    {
      section: 'versions',
      label: 'Valuation snapshots',
      reason: 'Export posture follows snapshot lock and evidence refs.',
    },
    {
      section: 'hitl-review',
      label: 'Analyst review queue',
      reason: 'Section approval does not equal export authority.',
    },
    {
      section: 'export',
      label: 'Public export gate',
      reason: 'Preview the redacted export posture for this property.',
    },
  ],
  intake: [
    {
      section: 'data-review',
      label: 'Normalization workbench',
      reason: 'Review candidate fields before assumption promotion.',
    },
    {
      section: 'underwriting-sources',
      label: 'Assumption source trace',
      reason: 'Line up intake uploads with cited source refs.',
    },
    {
      section: 'spatial',
      label: 'Spatial evidence workbench',
      reason: 'Confirm location intelligence posture early.',
    },
  ],
  comps: [
    {
      section: 'underwriting',
      label: 'Underwriting cockpit',
      reason: 'Apply comp authority to model assumptions.',
    },
    {
      section: 'underwriting-sources',
      label: 'Assumption source trace',
      reason: 'Verify comp citations before scenario lock.',
    },
    {
      section: 'scenarios',
      label: 'Scenario comparison',
      reason: 'Compare exit cap and rent growth sensitivity.',
    },
  ],
  debt: [
    {
      section: 'underwriting',
      label: 'Underwriting cockpit',
      reason: 'Return to headline metrics and gate posture.',
    },
    {
      section: 'scenarios',
      label: 'Scenario comparison',
      reason: 'Stress DSCR under downside lender assumptions.',
    },
    {
      section: 'versions',
      label: 'Valuation snapshots',
      reason: 'Debt quote gates affect snapshot export eligibility.',
    },
  ],
  'source-trace': [
    {
      section: 'data-review',
      label: 'Normalization workbench',
      reason: 'Resolve candidate conflicts before source promotion.',
    },
    {
      section: 'hitl-review',
      label: 'Analyst review queue',
      reason: 'Escalate blocked assumptions to reviewer queue.',
    },
    {
      section: 'underwriting',
      label: 'Underwriting cockpit',
      reason: 'Apply cleared sources back to model assumptions.',
    },
  ],
};

export function ContextualSurfaceTriggers({
  dealId,
  route,
  propertyId,
}: {
  dealId: string;
  route: ContextualSurfaceRoute;
  propertyId?: string;
}): ReactElement {
  const triggers = TRIGGERS[route].map((trigger) => ({
    ...trigger,
    to: resolveTriggerPath(dealId, trigger.section, propertyId),
  }));

  return (
    <aside className="contextual-surface-triggers" aria-label="Related workflow surfaces">
      <header>
        <p className="studio-eyebrow">Contextual handoffs</p>
        <h2>Advanced surfaces for this stage</h2>
        <p className="muted">
          These links promote the next mock-only review surface. They do not authorize export or
          evidence promotion.
        </p>
      </header>
      <ul className="contextual-trigger-list">
        {triggers.map((trigger) => (
          <li key={trigger.label}>
            <Link to={trigger.to} className="handoff-link">
              <MaterialIcon name="arrow_forward" />
              <span>
                <strong>{trigger.label}</strong>
                <small>{trigger.reason}</small>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function resolveTriggerPath(
  dealId: string,
  section: StudioDealSection | 'report-builder' | 'export',
  propertyId?: string
): string {
  if (section === 'report-builder') return studioReportPath(dealId);
  if (section === 'export') return `/export/${propertyId ?? 'demo-001'}`;
  return studioDealPath(dealId, section);
}
