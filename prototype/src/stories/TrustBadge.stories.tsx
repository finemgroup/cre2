import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import {
  ALL_AUTHORITY_POSTURES,
  getPublicAuthorityLabel,
  toStudioTrustPosture,
} from '@/lib/authority/authority-vocabulary';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { TrustBadge } from '@/components/studio/StudioPrimitives';

const meta = {
  title: 'Studio/TrustBadge',
  parameters: {
    surface: 'studio',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicToStudioCrosswalk: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {ALL_AUTHORITY_POSTURES.map((label) => (
        <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AuthorityBadge label={label} />
          <span aria-hidden="true">→</span>
          <TrustBadge state={label} />
          <span className="muted">{toStudioTrustPosture(label)}</span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByLabelText(/Authority state: Public baseline/i).length).toBeGreaterThan(0);
    expect(canvas.getAllByLabelText(/Authority state: Candidate evidence/i).length).toBeGreaterThan(0);
    expect(canvas.getByLabelText(/Authority state: Sample map data/i)).toBeInTheDocument();
  },
};

export const StudioNativeStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      <TrustBadge state="Public baseline" />
      <TrustBadge state="Candidate evidence" />
      <TrustBadge state="Reviewed" />
      <TrustBadge state="Needs review" />
      <TrustBadge state="Blocked" />
      <TrustBadge state="Model inferred" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Authority state: Needs review/i)).toBeInTheDocument();
  },
};

export const LabelReference: Story = {
  render: () => (
    <ul>
      {ALL_AUTHORITY_POSTURES.map((label) => (
        <li key={label}>
          <code>{label}</code> — {getPublicAuthorityLabel(label)} → {toStudioTrustPosture(label)}
        </li>
      ))}
    </ul>
  ),
};
