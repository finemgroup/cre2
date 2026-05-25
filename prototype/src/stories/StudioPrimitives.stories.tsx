import type { Meta, StoryObj } from '@storybook/react';

import {
  MetricCard,
  NonProductionCallout,
  StatusBadge,
  StudioCard,
  TrustBadge,
} from '@/components/studio/StudioPrimitives';

const meta = {
  title: 'Studio/Primitives',
  parameters: {
    surface: 'studio',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrustAndStatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      <TrustBadge state="public-baseline" />
      <TrustBadge state="candidate-evidence" />
      <TrustBadge state="blocked" />
      <TrustBadge state="Reviewed" />
      <StatusBadge status="Ready" />
      <StatusBadge status="Needs review" />
      <StatusBadge status="Draft" />
    </div>
  ),
};

export const MetricCardDefault: Story = {
  render: () => (
    <div className="metric-grid">
      <MetricCard label="Net IRR" value="14.2%" detail="Base scenario" icon="trending_up" />
      <MetricCard
        label="Equity multiple"
        value="1.84x"
        detail="5-year hold"
        icon="account_balance"
      />
    </div>
  ),
};

export const StudioCardWithActions: Story = {
  render: () => (
    <StudioCard
      eyebrow="Deal pipeline"
      title="Riverside Flats"
      actions={
        <button type="button" className="btn btn-secondary">
          Open deal
        </button>
      }
    >
      <p>Mock underwriting and comps are wired for this deal identity.</p>
    </StudioCard>
  ),
};

export const NonProductionCalloutDefault: Story = {
  render: () => (
    <NonProductionCallout>
      Prototype-only surface. Metrics, exports, and syndication are simulated.
    </NonProductionCallout>
  ),
};
