import { describe, expect, it } from 'vitest';

import { evaluationToReadinessRailItems } from '@/components/workflow/ValuationReadinessRail';
import { evaluateWorkflowGates } from '@/lib/contracts/workflow-gates';

describe('ValuationReadinessRail', () => {
  it('maps workflow gates into five readiness stages', () => {
    const evaluation = evaluateWorkflowGates({
      assumptionsComplete: true,
      evidenceLinked: true,
      scenariosCompared: false,
      reviewState: 'needs-review',
      exportConsent: false,
      sourceRightsClear: false,
      spatialSourceClear: true,
    });
    const items = evaluationToReadinessRailItems(evaluation);
    expect(items).toHaveLength(5);
    expect(items.find((item) => item.label === 'Review')?.status).toBe('blocked');
    expect(items.find((item) => item.label === 'Export')?.status).toBe('blocked');
  });
});
