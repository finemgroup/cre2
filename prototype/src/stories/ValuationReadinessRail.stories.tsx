import type { Meta, StoryObj } from '@storybook/react';

import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { evaluateWorkflowGates } from '@/lib/contracts/workflow-gates';

const meta: Meta<typeof ValuationReadinessRail> = {
  title: 'Workflow/ValuationReadinessRail',
  component: ValuationReadinessRail,
};

export default meta;
type Story = StoryObj<typeof ValuationReadinessRail>;

const blockedEvaluation = evaluateWorkflowGates({
  assumptionsComplete: true,
  evidenceLinked: true,
  scenariosCompared: true,
  reviewState: 'needs-review',
  exportConsent: false,
  sourceRightsClear: false,
  spatialSourceClear: false,
});

export const BlockedExport: Story = {
  render: () => <ValuationReadinessRail evaluation={blockedEvaluation} />,
};
