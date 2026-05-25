import type { Meta, StoryObj } from '@storybook/react';

import {
  ExportReadinessCard,
  ReportProvenanceCard,
  ReportSectionReviewCard,
} from '@/components/report-governance/ReportGovernanceCards';
import type { ReportSection } from '@/data/studio';
import { getStudioReportBuilderView } from '@/lib/runtime/studio-workspace';

const reportSections = getStudioReportBuilderView('riverside-flats')?.sections ?? [];

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
};

export const ProvenanceCoverage: Story = {
  render: () => <ReportProvenanceCard sections={reportSections} />,
};

export const ExportReadinessBlocked: Story = {
  render: () => <ExportReadinessCard sections={reportSections} />,
};

export const ExportReadinessReady: Story = {
  render: () => <ExportReadinessCard sections={readySections} />,
};
