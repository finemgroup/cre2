import type { Meta, StoryObj } from '@storybook/react';

import {
  ExportReadinessCard,
  ReportProvenanceCard,
  ReportSectionReviewCard,
} from '@/components/report-governance/ReportGovernanceCards';
import type { ReportSection } from '@/data/studio';
import { getSourceBlocksForDeal } from '@/lib/source-bundle';
import { getStudioReportBuilderView } from '@/lib/runtime/studio-workspace';
import { expect, within } from '@storybook/test';

const reportSections = getStudioReportBuilderView('riverside-flats')?.sections ?? [];
const sourceBlocks = getSourceBlocksForDeal('riverside-flats');

const readySections: ReportSection[] = reportSections.map((section) => ({
  ...section,
  status: 'Approved',
}));

const meta = {
  title: 'Studio/ReportGovernance',
  parameters: {
    surface: 'studio',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SectionReviewCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {reportSections.map((section) => (
        <ReportSectionReviewCard key={section.id} section={section} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Executive Summary/i)).toBeInTheDocument();
  },
};

export const ProvenanceCoverage: Story = {
  render: () => <ReportProvenanceCard sections={reportSections} sourceBlocks={sourceBlocks} />,
};

export const ExportReadinessBlocked: Story = {
  render: () => <ExportReadinessCard sections={reportSections} sourceBlocks={sourceBlocks} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Export PDF/i })).toBeDisabled();
    await expect(canvas.getByText(/Export remains disabled/i)).toBeInTheDocument();
  },
};

export const ExportReadinessReady: Story = {
  render: () => (
    <ExportReadinessCard
      sections={readySections}
      sourceBlocks={getSourceBlocksForDeal('canyon-logistics')}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/All mock review gates are clear/i)).toBeInTheDocument();
  },
};
