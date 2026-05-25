import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { MapPlaceholderPreview } from '@/components/spatial/MapPlaceholderPreview';

const meta = {
  title: 'Public/MapPlaceholderPreview',
  component: MapPlaceholderPreview,
  parameters: {
    surface: 'public',
  },
} satisfies Meta<typeof MapPlaceholderPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PropertyContext: Story = {
  args: {
    caption: 'Sample map layer — no live geo precision. Not a legal boundary.',
    children: (
      <>
        <div className="provenance-labels">
          <AuthorityBadge label="sample-map-data" />
          <AuthorityBadge label="approximate-centroid" />
          <AuthorityBadge label="not-legal-boundary" />
        </div>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: /Sample map layer/i })).toBeVisible();
  },
};
