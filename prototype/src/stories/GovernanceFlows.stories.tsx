import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import { StatusBadge } from '@/components/studio/StudioPrimitives';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { createReceipt, resetReceiptStore } from '@/lib/contracts/receipts';
import { getReviewQueue } from '@/lib/runtime/review-queue';
import { evaluateExportPolicy } from '@/lib/runtime/export-policy';
import { assertAnalyticsEventSafe } from '@/lib/analytics/redaction';
import type { ExportReadiness } from '@/lib/report-governance';

const blockedReadiness: ExportReadiness = {
  ready: false,
  approvedCount: 1,
  totalCount: 2,
  warnings: ['Provider-restricted source must be summarized before export.'],
  blockedReasons: ['Provider-restricted comp blocked by source posture'],
};

const blockedDecision = evaluateExportPolicy({
  actor: fixtureActors.orgAdmin,
  reportId: 'storybook-report',
  scope: 'share',
  readiness: blockedReadiness,
  consent: true,
  idempotencyKey: 'storybook-share',
});

const meta = {
  title: 'Studio/GovernanceFlows',
  parameters: {
    surface: 'studio',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExportBlockedModal: Story = {
  render: () => (
    <ExportGovernanceModal
      isOpen
      onClose={() => undefined}
      readiness={blockedReadiness}
      policyDecision={blockedDecision}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText(/source-rights/i)[0]).toBeInTheDocument();
  },
};

export const ReviewQueueProjection: Story = {
  render: () => (
    <div className="card">
      <h2>Review queue projection</h2>
      {getReviewQueue(fixtureActors.internalOperator).map((item) => (
        <div key={item.observation.id} className="review-summary">
          <strong>{item.observation.fieldKey}</strong>
          <StatusBadge status={item.observation.reviewState} />
          <span>{item.safeStatus}</span>
        </div>
      ))}
    </div>
  ),
};

export const RedactedReceipt: Story = {
  render: () => {
    resetReceiptStore();
    const receipt = createReceipt({
      actor: fixtureActors.public,
      targetId: 'storybook-export',
      kind: 'blocked',
      idempotencyKey: 'storybook-redacted-receipt',
      policyDecision: 'blocked',
      evidenceRefs: ['evidence-private-rent-roll'],
      safeMessage: 'Export blocked by source-rights policy.',
    });

    return (
      <div className="receipt">
        <h2>Redacted receipt</h2>
        <p>{receipt.id}</p>
        <p>{receipt.safeMessage}</p>
        <p>{receipt.redactedEvidenceRefs.join(', ')}</p>
      </div>
    );
  },
};

export const AnalyticsSafeEvent: Story = {
  render: () => {
    const event = assertAnalyticsEventSafe({
      name: 'export_receipt_generated',
      actorClass: 'org-member',
      route: '/export/demo-001',
      propertyId: 'demo-001',
      receiptId: 'rcpt_storybook',
      phase: 'preview',
    });

    return (
      <div className="card">
        <h2>Analytics-safe event</h2>
        <code>{event.name}</code>
        <p>{event.receiptId}</p>
      </div>
    );
  },
};
