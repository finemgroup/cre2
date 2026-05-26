import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { AdvancedWorkflowNav } from '@/components/workstation/AdvancedWorkflowNav';
import { ReviewerAssignmentDrawer } from '@/components/workstation/ReviewerAssignmentDrawer';
import { HitlTrustTierBadge } from '@/components/workflow/HitlTrustTierBadge';
import type { ReviewAssignment } from '@/lib/workflow/review-assignments';
import { assessConfidence } from '@/lib/workflow/confidence';

const SAMPLE_ASSIGNMENT: ReviewAssignment = {
  id: 'assign-unit-count',
  field: 'Unit count conflict',
  reason: 'OM and rent roll disagree; export blocked until resolved.',
  assignee: 'Sarah Jenkins (VP)',
  queueState: 'Assigned',
  posture: 'Blocked',
  trustTier: 'BLOCK',
  confidence: 36,
  resolutionSurface: 'Evidence workbench',
  resolutionRoute: '/studio/deals/riverside-flats/data-review',
  confidenceAssessment: assessConfidence(36, true),
};

const meta = {
  title: 'Studio/Wave3Polish',
  parameters: { surface: 'studio' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdvancedWorkflowNavStory: Story = {
  name: 'Advanced workflow nav',
  render: () => <AdvancedWorkflowNav dealId="riverside-flats" />,
};

export const HitlTrustTiers: Story = {
  render: () => (
    <div className="tag-row">
      <HitlTrustTierBadge tier="AUTO" />
      <HitlTrustTierBadge tier="NOTIFY" />
      <HitlTrustTierBadge tier="HITL" />
      <HitlTrustTierBadge tier="BLOCK" />
    </div>
  ),
};

export const ReviewerAssignmentDrawerStory: Story = {
  name: 'Reviewer assignment drawer',
  render: () => (
    <ReviewerAssignmentDrawer isOpen onClose={() => undefined} assignment={SAMPLE_ASSIGNMENT} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Internal-only HITL projection/i)).toBeInTheDocument();
    await userEvent.type(
      canvas.getByPlaceholderText(/Record rationale/i),
      'Mock reviewer note for prototype.'
    );
    await expect(canvas.getByRole('button', { name: /Approve for export/i })).toBeDisabled();
  },
};
