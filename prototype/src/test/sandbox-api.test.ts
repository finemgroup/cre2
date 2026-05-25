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
