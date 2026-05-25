import type { Meta, StoryObj } from '@storybook/react';

import { DealStageStepper } from '@/components/workflow/DealStageStepper';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { DealContextStrip } from '@/components/workflow/DealContextStrip';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { DealWorkflowTabs } from '@/pages/studio/StudioShared';
import { getStudioDealView } from '@/lib/runtime/studio-workspace';

const meta = {
  title: 'Studio/Wave10Workflow',
  parameters: { surface: 'studio' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const deal = getStudioDealView('riverside-flats')!.deal;

export const MockBoundaryVariants: Story = {
  render: () => (
    <div className="story-stack">
      <MockBoundaryBanner variant="evidence" />
      <MockBoundaryBanner variant="scenario" />
      <MockBoundaryBanner variant="snapshot" />
      <MockBoundaryBanner variant="export" />
    </div>
  ),
};

export const ContextualTriggersStory: Story = {
  name: 'Contextual surface triggers',
  render: () => <ContextualSurfaceTriggers dealId="riverside-flats" route="scenarios" />,
};

export const DealContextStripStory: Story = {
  name: 'Deal context strip',
  render: () => <DealContextStrip dealId="riverside-flats" dealName={deal.name} />,
};

export const GroupedDealNavStory: Story = {
  name: 'Grouped deal workflow nav',
  render: () => <DealWorkflowTabs deal={deal} />,
};

export const DealStageStepperStory: Story = {
  name: 'Deal stage stepper',
  render: () => <DealStageStepper dealId="riverside-flats" />,
};
