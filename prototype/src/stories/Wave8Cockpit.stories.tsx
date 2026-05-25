import type { Meta, StoryObj } from '@storybook/react';

import { BentoGrid, BentoTile } from '@/components/studio/BentoTile';
import { AiTaskPulse } from '@/components/workflow/AiTaskPulse';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { DealCockpitPanel } from '@/components/workflow/DealCockpitPanel';
import { DataTable, StudioCard } from '@/components/studio/StudioPrimitives';

const meta = {
  title: 'Studio/Wave8Cockpit',
  parameters: { surface: 'studio' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BentoStates: Story = {
  render: () => (
    <BentoGrid>
      <BentoTile title="Ready tile" subtitle="Ok state" state="ok">
        <p>Evidence posture and next action are available.</p>
      </BentoTile>
      <BentoTile title="Loading tile" state="loading" />
      <BentoTile title="Empty tile" state="empty" />
      <BentoTile title="Error tile" state="error" />
    </BentoGrid>
  ),
};

export const CockpitPanelStory: Story = {
  name: 'Deal cockpit panel',
  render: () => (
    <DealCockpitPanel
      dealId="riverside-flats"
      kpis={[
        { label: 'Indicated Value', value: '$46.8M', detail: 'Model-inferred' },
        { label: 'Target IRR', value: '14.8%', detail: 'Scenario draft' },
      ]}
      rail={<AiTaskPulse />}
    />
  ),
};

export const DataWorkbenchStory: Story = {
  name: 'Data workbench shell',
  render: () => (
    <DataWorkbenchShell
      title="Evidence workbench"
      subtitle="Table/list/grid switching without authority changes."
      views={{
        table: (
          <DataTable
            headers={['Field', 'Posture']}
            rows={[
              ['Unit count', 'Blocked'],
              ['T12 revenue', 'Reviewed'],
            ]}
          />
        ),
        list: (
          <StudioCard title="List view">
            <ul className="governance-list">
              <li>Unit count conflict requires reviewer resolution.</li>
              <li>T12 revenue is reviewed.</li>
            </ul>
          </StudioCard>
        ),
        grid: (
          <BentoGrid>
            <BentoTile title="Blocked fields" primary={<strong>1</strong>} />
            <BentoTile title="Reviewed fields" primary={<strong>1</strong>} />
          </BentoGrid>
        ),
      }}
    />
  ),
};
