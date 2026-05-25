import { describe, expect, it } from 'vitest';

import { fixtureActors } from '@/lib/contracts/fixtures';
import { getPublicCompViews } from '@/lib/runtime/public-comps';
import { getPublicPropertyView } from '@/lib/runtime/public-property';
import { getPublicExportDecision, getPublicReportView } from '@/lib/runtime/report-flow';
import { createCandidateUpload } from '@/lib/runtime/upload-flow';

describe('public route runtime adapters', () => {
  it('resolves property evidence through actor-aware public baseline view', () => {
    const view = getPublicPropertyView('demo-001', fixtureActors.public);

    expect(view?.property.address).toBe('1200 Commerce St');
    expect(JSON.stringify(view)).not.toContain('private rent roll');
  });

  it('marks public comp details as blocked or summarized according to source posture', () => {
    const comps = getPublicCompViews(fixtureActors.public);
    const blocked = comps.find((comp) => comp.authority === 'blocked');
    const candidate = comps.find((comp) => comp.authority === 'candidate-evidence');

    expect(blocked?.canInspect).toBe(false);
    expect(candidate?.canInspect).toBe(false);
    expect(candidate?.safeExplanation).toMatch(/requires review/i);
  });

  it('creates candidate upload metadata without public promotion', () => {
    const result = createCandidateUpload({
      actor: fixtureActors.sourceOwner,
      propertyId: 'demo-001',
      fileName: 'Rent Roll.pdf',
      idempotencyKey: 'upload-rent-roll',
    });

    expect(result.evidence.reviewState).toBe('candidate');
    expect(result.evidence.visibility).toBe('user-private');
    expect(result.receipt.kind).toBe('upload');
  });

  it('returns report readiness and export policy decisions from adapters', () => {
    const report = getPublicReportView('demo-001');
    const decision = getPublicExportDecision({
      propertyId: 'demo-001',
      consent: false,
      idempotencyKey: 'public-export-test',
    });

    expect(report?.readiness.ready).toBe(false);
    expect(decision?.allowed).toBe(false);
    expect(decision?.blockerCategories).toContain('consent');
  });
});
