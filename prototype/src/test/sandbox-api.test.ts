import { describe, expect, it, beforeEach } from 'vitest';

import type { ActorContext } from '@/lib/contracts/actor-context';
import { fixtureActors, PRIVATE_SENTINELS } from '@/lib/contracts/fixtures';
import { resetReceiptStore } from '@/lib/contracts/receipts';
import { handleSandboxApiRequest, resetSandboxApiState } from '@/lib/runtime/sandbox-api';

const BASE_URL = 'http://sophex.test/sandbox/v0';

describe('sandbox API shell', () => {
  beforeEach(() => {
    resetReceiptStore();
    resetSandboxApiState();
  });

  it('serves a synthetic health route', async () => {
    const body = await readJson(await request('/health'));

    expect(body).toMatchObject({ status: 'ok', productionData: false });
  });

  it('filters private values from anonymous property responses', async () => {
    const response = await request('/properties/demo-001');
    const payload = JSON.stringify(await readJson(response));

    expect(response.status).toBe(200);
    PRIVATE_SENTINELS.forEach((sentinel) => {
      expect(payload).not.toContain(sentinel);
    });
  });

  it('lets source owners create metadata-only candidate evidence', async () => {
    const body = await readJson<{
      evidence: {
        visibility: string;
        reviewState: string;
        sourceUsePolicy: string;
      };
      receipt: {
        kind: string;
        policyDecision: string;
      };
    }>(
      await request('/uploads/candidates', {
        method: 'POST',
        actor: fixtureActors.sourceOwner,
        idempotencyKey: 'upload-rent-roll-001',
        body: {
          actorContext: fixtureActors.sourceOwner,
          propertyId: 'demo-001',
          fileName: 'Rent Roll.pdf',
          idempotencyKey: 'upload-rent-roll-001',
        },
      })
    );

    expect(body.evidence).toMatchObject({
      visibility: 'user-private',
      reviewState: 'candidate',
      sourceUsePolicy: 'private-use',
    });
    expect(body.receipt).toMatchObject({ kind: 'upload', policyDecision: 'allowed' });
  });

  it('keeps provider-blocked comps unavailable to paid users without source-rights policy', async () => {
    const body = await readJson<{
      comps: Array<{ authority: string; canInspect: boolean }>;
    }>(await request('/properties/demo-001/comps', { actor: fixtureActors.paidUser }));

    expect(
      body.comps.some((comp) => {
        return comp.authority === 'blocked' && !comp.canInspect;
      })
    ).toBe(true);
  });

  it('exposes review queue projections only to internal operators', async () => {
    const denied = await request('/review-queue', { actor: fixtureActors.public });
    const allowed = await readJson<{ items: unknown[] }>(
      await request('/review-queue', { actor: fixtureActors.internalOperator })
    );

    expect(denied.status).toBe(403);
    expect(allowed.items.length).toBeGreaterThan(0);
    expect(JSON.stringify(allowed)).toContain('HITL reviewer decision required');
  });

  it('serves studio dashboard and deal workflow projections', async () => {
    const dashboard = await readJson<{ deals: unknown[] }>(
      await request('/studio/dashboard', { actor: fixtureActors.orgAdmin })
    );
    const deal = await readJson<{ deal: { id: string } }>(
      await request('/studio/deals/riverside-flats', { actor: fixtureActors.orgAdmin })
    );
    const progress = await readJson<{ progress: Record<string, string> }>(
      await request('/studio/deals/riverside-flats/workflow/progress')
    );
    const nextAction = await readJson<{ label: string }>(
      await request('/studio/deals/riverside-flats/workflow/next-action')
    );
    const cockpit = await readJson<{
      dealId: string;
      nextAction: { label: string; confidence: { trustTier: string } };
      tasks: unknown[];
      reviewSummary: { visible: boolean; pendingCount: number };
    }>(await request('/studio/deals/riverside-flats/cockpit', { actor: fixtureActors.orgAdmin }));
    const underwriting = await readJson<{
      deal: { id: string };
      assumptions: { purchasePrice: number };
      reviewedCompCount: number;
    }>(
      await request('/studio/deals/riverside-flats/underwriting', { actor: fixtureActors.orgAdmin })
    );
    const spatial = await readJson<{
      deal: { id: string };
      summary: { layerCount: number };
      layers: unknown[];
    }>(await request('/studio/deals/riverside-flats/spatial', { actor: fixtureActors.orgAdmin }));
    const versions = await readJson<{
      deal: { id: string };
      snapshots: unknown[];
      valuationVersion: { evidenceSnapshot: { id: string } };
    }>(await request('/studio/deals/riverside-flats/versions', { actor: fixtureActors.orgAdmin }));
    const sourceTrace = await readJson<{
      deal: { id: string };
      traceItems: unknown[];
      conflictOptions: unknown[];
    }>(
      await request('/studio/deals/riverside-flats/source-trace', { actor: fixtureActors.orgAdmin })
    );
    const dataReview = await readJson<{
      deal: { id: string };
      uploadFiles: unknown[];
      normalizationRows: unknown[];
    }>(
      await request('/studio/deals/riverside-flats/data-review', { actor: fixtureActors.orgAdmin })
    );
    const debt = await readJson<{
      deal: { id: string };
      metrics: { dscr: number };
      quotePending: boolean;
    }>(await request('/studio/deals/riverside-flats/debt', { actor: fixtureActors.orgAdmin }));
    const intake = await readJson<{
      deal: { id: string };
      uploadFiles: unknown[];
      candidateFields: unknown[];
      filesNeedingReview: number;
    }>(await request('/studio/deals/riverside-flats/intake', { actor: fixtureActors.orgAdmin }));
    const brokerOs = await readJson<{
      jobStreams: unknown[];
      reviewQueuePreview: unknown[];
      rawLogsExposed: boolean;
    }>(await request('/studio/broker-os', { actor: fixtureActors.orgAdmin }));
    const uploadGuide = await readJson<{
      propertyId: string;
      linkedDealId: string;
      supportedTypes: unknown[];
    }>(await request('/upload/guide?propertyId=demo-001'));
    const landing = await readJson<{
      totalListings: number;
      featuredProperties: unknown[];
    }>(await request('/landing'));
    const billing = await readJson<{
      plans: unknown[];
      featureComparison: unknown[];
    }>(await request('/studio/billing', { actor: fixtureActors.orgAdmin }));
    const exportGate = await readJson<{
      propertyId: string;
      readySections: number;
      totalSections: number;
    }>(await request('/export-gate/demo-001'));
    const onboarding = await readJson<{
      steps: unknown[];
      tierOptions: unknown[];
    }>(await request('/studio/onboarding', { actor: fixtureActors.orgAdmin }));

    expect(dashboard.deals.length).toBeGreaterThan(0);
    expect(deal.deal.id).toBe('riverside-flats');
    expect(progress.progress.Underwriting).toBeTruthy();
    expect(nextAction.label.length).toBeGreaterThan(0);
    expect(cockpit.dealId).toBe('riverside-flats');
    expect(cockpit.nextAction.confidence.trustTier.length).toBeGreaterThan(0);
    expect(cockpit.tasks.length).toBeGreaterThan(0);
    expect(cockpit.reviewSummary.visible).toBe(true);
    expect(cockpit.reviewSummary.pendingCount).toBeGreaterThan(0);
    expect(underwriting.deal.id).toBe('riverside-flats');
    expect(underwriting.assumptions.purchasePrice).toBeGreaterThan(0);
    expect(underwriting.reviewedCompCount).toBeGreaterThanOrEqual(0);
    expect(spatial.deal.id).toBe('riverside-flats');
    expect(spatial.summary.layerCount).toBeGreaterThan(0);
    expect(spatial.layers.length).toBeGreaterThan(0);
    expect(versions.deal.id).toBe('riverside-flats');
    expect(versions.snapshots.length).toBeGreaterThan(0);
    expect(versions.valuationVersion.evidenceSnapshot.id).toBeTruthy();
    expect(sourceTrace.deal.id).toBe('riverside-flats');
    expect(sourceTrace.traceItems.length).toBeGreaterThan(0);
    expect(sourceTrace.conflictOptions.length).toBeGreaterThan(0);
    expect(dataReview.deal.id).toBe('riverside-flats');
    expect(dataReview.uploadFiles.length).toBeGreaterThan(0);
    expect(dataReview.normalizationRows.length).toBeGreaterThan(0);
    expect(debt.deal.id).toBe('riverside-flats');
    expect(debt.metrics.dscr).toBeGreaterThan(0);
    expect(debt.quotePending).toBe(true);
    expect(intake.deal.id).toBe('riverside-flats');
    expect(intake.uploadFiles.length).toBeGreaterThan(0);
    expect(intake.candidateFields.length).toBeGreaterThan(0);
    expect(intake.filesNeedingReview).toBeGreaterThan(0);
    expect(brokerOs.jobStreams.length).toBeGreaterThan(0);
    expect(brokerOs.reviewQueuePreview.length).toBeGreaterThan(0);
    expect(brokerOs.rawLogsExposed).toBe(false);
    expect(uploadGuide.propertyId).toBe('demo-001');
    expect(uploadGuide.linkedDealId).toBe('riverside-flats');
    expect(uploadGuide.supportedTypes.length).toBeGreaterThan(0);
    expect(landing.totalListings).toBeGreaterThan(0);
    expect(landing.featuredProperties.length).toBe(2);
    expect(billing.plans.length).toBe(3);
    expect(billing.featureComparison.length).toBeGreaterThan(0);
    expect(exportGate.propertyId).toBe('demo-001');
    expect(exportGate.totalSections).toBeGreaterThan(0);
    expect(onboarding.steps.length).toBe(4);
    expect(onboarding.tierOptions.length).toBe(2);
  });

  it('hides review summary from public actors in cockpit projection', async () => {
    const cockpit = await readJson<{
      reviewSummary: { visible: boolean; pendingCount: number };
    }>(await request('/studio/deals/riverside-flats/cockpit', { actor: fixtureActors.public }));

    expect(cockpit.reviewSummary.visible).toBe(false);
    expect(cockpit.reviewSummary.pendingCount).toBe(0);
  });

  it('replays identical export idempotency keys with the same receipt', async () => {
    const first = await readJson<{ receipt: { id: string } }>(
      await request('/exports', {
        method: 'POST',
        actor: fixtureActors.orgAdmin,
        idempotencyKey: 'export-demo-001-001',
        body: {
          actorContext: fixtureActors.orgAdmin,
          propertyId: 'demo-001',
          scope: 'download',
          consent: true,
          idempotencyKey: 'export-demo-001-001',
        },
      })
    );
    const replay = await readJson<{ receipt: { id: string } }>(
      await request('/exports', {
        method: 'POST',
        actor: fixtureActors.orgAdmin,
        idempotencyKey: 'export-demo-001-001',
        body: {
          actorContext: fixtureActors.orgAdmin,
          propertyId: 'demo-001',
          scope: 'download',
          consent: true,
          idempotencyKey: 'export-demo-001-001',
        },
      })
    );

    expect(replay.receipt.id).toBe(first.receipt.id);
  });

  it('fails closed on idempotency key conflicts', async () => {
    await request('/exports', {
      method: 'POST',
      actor: fixtureActors.orgAdmin,
      idempotencyKey: 'export-conflict-001',
      body: {
        actorContext: fixtureActors.orgAdmin,
        propertyId: 'demo-001',
        scope: 'download',
        consent: true,
        idempotencyKey: 'export-conflict-001',
      },
    });
    const conflict = await request('/exports', {
      method: 'POST',
      actor: fixtureActors.orgAdmin,
      idempotencyKey: 'export-conflict-001',
      body: {
        actorContext: fixtureActors.orgAdmin,
        propertyId: 'demo-001',
        scope: 'share',
        consent: true,
        idempotencyKey: 'export-conflict-001',
      },
    });
    const body = await readJson<{ error: { code: string } }>(conflict);

    expect(conflict.status).toBe(409);
    expect(body.error.code).toBe('idempotency_conflict');
  });
});

async function request(
  path: string,
  options: {
    method?: string;
    actor?: ActorContext;
    idempotencyKey?: string;
    body?: unknown;
  } = {}
): Promise<Response> {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (options.actor) headers.set('X-Sophex-Actor-Context', JSON.stringify(options.actor));
  if (options.idempotencyKey) headers.set('Idempotency-Key', options.idempotencyKey);
  return handleSandboxApiRequest(
    new Request(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  );
}

async function readJson<T = Record<string, unknown>>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}
