import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, within } from '@storybook/test';

import { PresentationModeToggle } from '@/components/layout/PresentationModeToggle';
import { RouteLoadingPanel } from '@/components/layout/RouteLoadingPanel';

const meta = {
  title: 'Wave 16/Visual Polish',
  parameters: {
    surface: 'studio',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PresentationToggle: Story = {
  render: () => <PresentationModeToggle className="btn btn-secondary" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Enter presentation mode/i })).toBeEnabled();
  },
};

export const StudioRouteLoading: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/studio/deals/riverside-flats/underwriting']}>
      <RouteLoadingPanel />
    </MemoryRouter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Loading view/i)).toBeInTheDocument();
  },
};

export const PublicRouteLoading: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/property/demo-001']}>
      <RouteLoadingPanel />
    </MemoryRouter>
  ),
};
