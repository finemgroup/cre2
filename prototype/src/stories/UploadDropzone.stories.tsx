import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { PrototypeToastProvider } from '@/components/overlays/PrototypeToast';
import { UploadDropzone } from '@/components/upload/UploadDropzone';
import { mockUploadFiles } from '@/lib/staged-import';

const meta = {
  title: 'Studio/UploadDropzone',
  component: UploadDropzone,
  parameters: {
    surface: 'studio',
  },
  decorators: [
    (Story) => (
      <PrototypeToastProvider>
        <Story />
      </PrototypeToastProvider>
    ),
  ],
} satisfies Meta<typeof UploadDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QueueWithProgress: Story = {
  args: {
    files: mockUploadFiles,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('progressbar', { name: /Offering memorandum\.pdf/i })
    ).toHaveAttribute('aria-valuenow', '86');
    await expect(canvas.getByText(/Scan quality requires review/i)).toBeInTheDocument();
  },
};

export const EmptyDropzone: Story = {
  args: {
    files: [],
  },
};
