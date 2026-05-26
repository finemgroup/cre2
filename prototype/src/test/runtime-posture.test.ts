import { describe, expect, it } from 'vitest';

import { getRuntimePosture } from '@/lib/runtime/runtime-posture';
import { createSandboxApiRuntimeServices } from '@/lib/runtime/sandbox-api-client';
import { fixtureRuntimeServices } from '@/lib/runtime/service-ports';

describe('runtime posture', () => {
  it('describes fixture runtime without production claims', () => {
    const posture = getRuntimePosture('fixture');

    expect(posture.label).toContain('Fixture');
    expect(posture.description).toContain('Synthetic');
    expect(posture.fixtureFallbackAvailable).toBe(true);
  });

  it('describes sandbox API runtime with fallback posture', () => {
    const posture = getRuntimePosture('api');

    expect(posture.label).toContain('Sandbox');
    expect(posture.fixtureFallbackAvailable).toBe(true);
  });

  it('uses in-process sandbox when api client has no base URL', async () => {
    const services = createSandboxApiRuntimeServices();
    expect(services.mode).toBe('api');

    const fixtureProperties = await fixtureRuntimeServices.public.searchProperties('Austin');
    const apiProperties = await services.public.searchProperties('Austin');
    expect(apiProperties.length).toBeGreaterThan(0);
    expect(apiProperties.map((item) => item.id)).toEqual(fixtureProperties.map((item) => item.id));
  });
});
