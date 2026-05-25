import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { BentoTile } from '@/components/studio/BentoTile';
import { assessConfidence, getEscalationLevel } from '@/lib/workflow/confidence';
import { getDealCockpitProjection } from '@/lib/workflow/cockpit-projection';
import { getUnifiedDealNextAction } from '@/lib/workflow/next-action';

describe('Wave 8 cockpit primitives', () => {
  it('maps confidence to Sophex escalation levels', () => {
    expect(getEscalationLevel(95)).toBe('auto');
    expect(getEscalationLevel(75)).toBe('confirm');
    expect(getEscalationLevel(45)).toBe('review');
    expect(getEscalationLevel(95, true)).toBe('blocked');
    expect(assessConfidence(35).trustTier).toBe('HITL');
  });

  it('keeps blocked readiness gates ahead of stage progress actions', () => {
    const action = getUnifiedDealNextAction('riverside-flats', {
      ready: false,
      blockerCategories: ['review'],
      safeNextAction: 'Send the valuation packet to human review.',
      gates: [
        {
          id: 'gate-review',
          family: 'review',
          label: 'Review',
          severity: 'block',
          status: 'blocked',
          safeMessage: 'Reviewer approval is required before export.',
          nextSafeAction: 'Send the valuation packet to human review.',
        },
      ],
    });

    expect(action.source).toBe('readiness-gate');
    expect(action.to).toContain('/hitl-review');
    expect(action.confidence.trustTier).toBe('BLOCK');
  });

  it('renders honest empty-state bento copy', () => {
    render(
      <MemoryRouter>
        <BentoTile title="Evidence gaps" state="empty" />
      </MemoryRouter>
    );

    expect(screen.getByText(/No rows are available/i)).toBeInTheDocument();
    expect(screen.getByText(/not that business activity is zero/i)).toBeInTheDocument();
  });

  it('builds a unified cockpit projection with advisory tasks and review summary', () => {
    const projection = getDealCockpitProjection('riverside-flats');

    expect(projection.dealId).toBe('riverside-flats');
    expect(projection.nextAction.label.length).toBeGreaterThan(0);
    expect(projection.tasks.length).toBeGreaterThan(0);
    expect(projection.reviewSummary.visible).toBe(true);
    expect(projection.blockedStages.every((stage) => stage.label.length > 0)).toBe(true);
  });
});
