import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import {
  CalculationBreakdownDrawer,
  EvidenceConflictResolverModal,
  EvidenceTraceList,
  ReadinessRail,
  SensitivityCellDrilldownDrawer,
  VersionLockConfirmationModal,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import {
  DEFAULT_UNDERWRITING_ASSUMPTIONS,
  calculateUnderwritingMetrics,
  evaluateUnderwritingGates,
} from '@/lib/underwriting';

const metrics = calculateUnderwritingMetrics(DEFAULT_UNDERWRITING_ASSUMPTIONS);
const gates = evaluateUnderwritingGates(DEFAULT_UNDERWRITING_ASSUMPTIONS, metrics, 1);

const meta = {
  title: 'Studio/WorkstationPrimitives',
  parameters: {
    surface: 'studio',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadinessRailStory: Story = {
  name: 'Readiness rail',
  render: () => (
    <ReadinessRail
      orientation="horizontal"
      items={[
        {
          id: 'assumptions',
          label: 'Assumptions',
          status: 'warning',
          detail: 'Two values need review.',
        },
        { id: 'evidence', label: 'Evidence', status: 'blocked', detail: 'Lender quote missing.' },
        {
          id: 'scenarios',
          label: 'Scenarios',
          status: 'pending',
          detail: 'Scenario set not locked.',
        },
      ]}
    />
  ),
};

export const EvidenceTraceListStory: Story = {
  name: 'Evidence trace list',
  render: () => (
    <EvidenceTraceList
      items={[
        {
          id: 'exit-cap',
          label: 'Exit cap rate',
          value: '5.75%',
          posture: 'Candidate evidence',
          sourceRef: 'CompSet-Austin-MF-05',
          asOf: '2026-05-20',
          confidence: 'Medium',
          detail: 'Candidate market comp evidence supports this assumption.',
        },
      ]}
    />
  ),
};

export const CalculationDrawer: Story = {
  render: () => (
    <CalculationBreakdownDrawer
      isOpen
      onClose={() => undefined}
      metricLabel="DSCR"
      metricValue="1.24x"
      formula="NOI / Debt Service"
      metrics={metrics}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Input Traceability/i)).toBeInTheDocument();
  },
};

export const VersionLockModal: Story = {
  render: () => (
    <VersionLockConfirmationModal
      isOpen
      onClose={() => undefined}
      canLock={false}
      gates={gates}
      onConfirm={() => undefined}
    />
  ),
};

export const ConflictResolverModal: Story = {
  render: () => (
    <EvidenceConflictResolverModal
      isOpen
      onClose={() => undefined}
      options={[
        {
          id: 'om',
          source: 'Offering Memorandum',
          value: '196',
          sourceRef: 'OM p.14',
          asOf: '2026-05-20',
          confidence: 'High',
        },
        {
          id: 'rent-roll',
          source: 'Rent Roll',
          value: '194',
          sourceRef: 'RentRoll p.1',
          asOf: '2026-05-21',
          confidence: 'Medium',
        },
      ]}
      onConfirm={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText(/Offering Memorandum/i));
    await userEvent.type(
      canvas.getByLabelText(/Resolution rationale/i),
      'Reviewer selected the OM value.'
    );
    await expect(canvas.getByRole('button', { name: /Confirm Decision/i })).toBeEnabled();
  },
};

export const SensitivityDrawer: Story = {
  render: () => (
    <SensitivityCellDrilldownDrawer
      isOpen
      onClose={() => undefined}
      purchasePrice={DEFAULT_UNDERWRITING_ASSUMPTIONS.purchasePrice}
      exitCap={DEFAULT_UNDERWRITING_ASSUMPTIONS.exitCapRate}
      metrics={metrics}
    />
  ),
};
