import type { Meta, StoryObj } from '@storybook/react';

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
      options: [
        'public-baseline',
        'user-submission',
        'candidate-evidence',
        'reviewed',
        'unreviewed',
        'blocked',
        'model-inferred',
      ],
    },
  },
} satisfies Meta<typeof AuthorityBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicBaseline: Story = {
  args: { label: 'public-baseline' },
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
      {(
        [
          'public-baseline',
          'user-submission',
          'candidate-evidence',
          'reviewed',
          'unreviewed',
          'blocked',
          'model-inferred',
        ] as const
      ).map((label) => (
        <AuthorityBadge key={label} label={label} />
      ))}
    </div>
  ),
};
