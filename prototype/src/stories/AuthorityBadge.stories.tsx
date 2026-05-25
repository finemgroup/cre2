import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { ALL_AUTHORITY_POSTURES } from '@/lib/authority/authority-vocabulary';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';

const meta = {
  title: 'Public/AuthorityBadge',
  component: AuthorityBadge,
  parameters: {
    surface: 'public',
  },
  argTypes: {
    label: {
      control: 'select',
      options: ALL_AUTHORITY_POSTURES,
    },
  },
} satisfies Meta<typeof AuthorityBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicBaseline: Story = {
  args: { label: 'public-baseline' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Authority state: Public baseline/i)).toBeInTheDocument();
  },
};

export const CandidateEvidence: Story = {
  args: { label: 'candidate-evidence' },
};

export const Reviewed: Story = {
  args: { label: 'reviewed' },
};

export const Blocked: Story = {
  args: { label: 'blocked' },
};

export const AllLabels: Story = {
  args: { label: 'public-baseline' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      {ALL_AUTHORITY_POSTURES.map((label) => (
        <AuthorityBadge key={label} label={label} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Authority state: Sample map data/i)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/Authority state: Not legal boundary/i)).toBeInTheDocument();
  },
};
