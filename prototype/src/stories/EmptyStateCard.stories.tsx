import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';

const meta = {
  title: 'Shared/EmptyStateCard',
  component: EmptyStateCard,
  parameters: {
    surface: 'studio',
  },
} satisfies Meta<typeof EmptyStateCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: {
    title: 'No comps matched your filters',
    description: 'Try widening the radius or relaxing the authority tier filter.',
    actions: (
      <button type="button" className="btn btn-secondary">
        Reset filters
      </button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', { name: /No comps matched your filters/i })
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Reset filters/i })).toBeEnabled();
  },
};

export const Warning: Story = {
  args: {
    icon: 'warning',
    tone: 'warning',
    title: 'Export blocked',
    description: 'Two report sections still need reviewer approval before delivery.',
  },
};

export const Success: Story = {
  args: {
    icon: 'check_circle',
    tone: 'success',
    title: 'All gates clear',
    description: 'Mock export readiness checks passed for this deal.',
  },
};
