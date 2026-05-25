import { describe, expect, it } from 'vitest';

import { fixtureActors } from '@/lib/contracts/fixtures';
import { evaluateExportPolicy } from '@/lib/runtime/export-policy';
import type { ExportReadiness } from '@/lib/report-governance';

const ready: ExportReadiness = {
  ready: true,
  approvedCount: 2,
  totalCount: 2,
  warnings: [],
  blockedReasons: [],
  receiptHash: 'sha256-ready',
};

const blocked: ExportReadiness = {
  ready: false,
  approvedCount: 1,
  totalCount: 2,
  warnings: ['Provider-restricted source must be removed.'],
  blockedReasons: ['Provider-restricted comp blocked by source posture'],
};

describe('contract-shaped export policy', () => {
  it('blocks downloads when consent is missing', () => {
    const decision = evaluateExportPolicy({
      actor: fixtureActors.orgAdmin,
      reportId: 'report-001',
      scope: 'download',
      readiness: ready,
      consent: false,
      idempotencyKey: 'download-no-consent',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.blockerCategories).toContain('consent');
    expect(decision.exportManifest).toBeUndefined();
  });

  it('blocks share when source-rights readiness fails', () => {
    const decision = evaluateExportPolicy({
      actor: fixtureActors.orgAdmin,
      reportId: 'report-001',
      scope: 'share',
      readiness: blocked,
      consent: true,
      idempotencyKey: 'share-blocked',
    });

    expect(decision.allowed).toBe(false);
    expect(decision.blockerCategories).toContain('source-rights');
    expect(JSON.stringify(decision.receipt)).not.toContain('Provider-restricted comp blocked');
    expect(decision.exportManifest).toBeUndefined();
  });

  it('returns a draft manifest for preview scope without granting download authority', () => {
    const decision = evaluateExportPolicy({
      actor: fixtureActors.public,
      reportId: 'report-001',
      scope: 'preview',
      readiness: blocked,
      consent: false,
      idempotencyKey: 'preview-draft-manifest',
    });

    expect(decision.allowed).toBe(true);
    expect(decision.exportManifest?.status).toBe('draft-preview');
    expect(decision.exportManifest?.safeSummary).toMatch(/draft preview/i);
  });

  it('allows partner delivery only for partner actors with ready policy', () => {
    const userDecision = evaluateExportPolicy({
      actor: fixtureActors.orgAdmin,
      reportId: 'report-001',
      scope: 'partner-delivery',
      readiness: ready,
      consent: true,
      idempotencyKey: 'partner-user-blocked',
    });
    const partnerDecision = evaluateExportPolicy({
      actor: fixtureActors.partnerApi,
      reportId: 'report-001',
      scope: 'partner-delivery',
      readiness: ready,
      consent: true,
      idempotencyKey: 'partner-allowed',
    });

    expect(userDecision.allowed).toBe(false);
    expect(userDecision.blockerCategories).toContain('partner-scope');
    expect(partnerDecision.allowed).toBe(true);
    expect(partnerDecision.exportManifest?.status).toBe('approved');
    expect(partnerDecision.exportManifest?.checksum).toBe('sha256-ready');
  });
});
