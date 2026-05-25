import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getPublicPropertyView } from '@/lib/runtime/public-property';

const propertyView = getPublicPropertyView('demo-001', fixtureActors.public);

const meta = {
  title: 'Public/MapLayerControlPanel',
  component: MapLayerControlPanel,
  parameters: {
    surface: 'public',
  },
} satisfies Meta<typeof MapLayerControlPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PropertyLayers: Story = {
  args: {
    layers: propertyView?.spatialContext.layers ?? [],
    evidenceByLayer: propertyView?.spatialContext.evidenceByLayer ?? {},
    heading: 'Map layer controls',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: /Map layer controls/i })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Public property centroid/i })).toBeVisible();
  },
};
