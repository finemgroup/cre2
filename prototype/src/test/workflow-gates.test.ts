import { describe, expect, it } from 'vitest';

import { evaluateWorkflowGates } from '@/lib/contracts/workflow-gates';

describe('workflow readiness gates', () => {
  it('fails closed when required underwriting inputs are missing', () => {
    const result = evaluateWorkflowGates({
      assumptionsComplete: false,
      evidenceLinked: true,
      scenariosCompared: true,
      reviewState: 'approved-private-use',
      exportConsent: true,
      sourceRightsClear: true,
      spatialSourceClear: true,
    });

    expect(result.ready).toBe(false);
    expect(result.blockerCategories).toContain('assumption');
    expect(result.safeNextAction).toMatch(/assumption/i);
  });

  it('treats scenario comparison as advisory warning, not export authority', () => {
    const result = evaluateWorkflowGates({
      assumptionsComplete: true,
      evidenceLinked: true,
      scenariosCompared: false,
      reviewState: 'approved-private-use',
      exportConsent: true,
      sourceRightsClear: true,
      spatialSourceClear: true,
    });

    expect(result.ready).toBe(true);
    expect(result.gates.find((gate) => gate.family === 'scenario')?.status).toBe('warning');
  });

  it('blocks export when review, source rights, or spatial source gates are unresolved', () => {
    const result = evaluateWorkflowGates({
      assumptionsComplete: true,
      evidenceLinked: true,
      scenariosCompared: true,
      reviewState: 'needs-review',
      exportConsent: true,
      sourceRightsClear: false,
      spatialSourceClear: false,
    });

    expect(result.ready).toBe(false);
    expect(result.blockerCategories).toEqual(['review', 'source-rights', 'spatial-source']);
    expect(JSON.stringify(result)).not.toContain('private rent roll');
  });
});
