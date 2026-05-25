import { useState, type ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from '@storybook/test';

import { TrustExplainerDrawer } from '@/components/overlays/TrustExplainerDrawer';

function TrustExplainerDemo({
  initialOpen = true,
  context,
}: {
  initialOpen?: boolean;
  context?: string;
}): ReactElement {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>
        Open trust explainer
      </button>
      <TrustExplainerDrawer
        isOpen={open}
        onClose={() => setOpen(false)}
        context={context}
      />
    </>
  );
}

const meta = {
  title: 'Studio/TrustExplainerDrawer',
  parameters: {
    surface: 'studio',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenWithContext: Story = {
  render: () => (
    <TrustExplainerDemo
      context="Authority for Eastline Apartments is Candidate evidence."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByRole('dialog', { name: /Source trust explainer/i })).toBeInTheDocument()
    );
    await expect(canvas.getByLabelText(/Authority state: Blocked/i)).toBeInTheDocument();
  },
};

export const Closed: Story = {
  render: () => <TrustExplainerDemo initialOpen={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole('dialog', { name: /Source trust explainer/i })
    ).not.toBeInTheDocument();
  },
};
