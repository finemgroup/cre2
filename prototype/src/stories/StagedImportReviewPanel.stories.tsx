import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, expect, within, waitFor } from '@storybook/test';

import { StagedImportReviewPanel } from '@/components/review/StagedImportReviewPanel';
import { mockCandidateFields, mockUploadFiles } from '@/lib/staged-import';

const meta = {
  title: 'Studio/StagedImportReviewPanel',
  component: StagedImportReviewPanel,
  parameters: {
    surface: 'studio',
  },
} satisfies Meta<typeof StagedImportReviewPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CandidateReview: Story = {
  args: {
    files: mockUploadFiles,
    candidates: mockCandidateFields,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/candidate fields/i)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /Review flagged fields/i }));
    await waitFor(() =>
      expect(canvas.getByRole('dialog', { name: /Candidate field review/i })).toBeInTheDocument()
    );
  },
};

export const NoFlaggedFields: Story = {
  args: {
    files: mockUploadFiles.filter((file) => !file.issue),
    candidates: mockCandidateFields.filter((candidate) => !candidate.issue),
  },
};
