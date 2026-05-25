import { describe, expect, it } from 'vitest';

import { fixtureActors, fixtureObservations } from '@/lib/contracts/fixtures';
import { resolveFieldForActor } from '@/lib/contracts/evidence';
import { decideVisibility } from '@/lib/contracts/visibility';

describe('permission matrix contract simulator', () => {
  it('keeps public actors on public baseline when private observations exist', () => {
    const resolved = resolveFieldForActor(
      fixtureActors.public,
      'demo-001',
      'capRate',
      fixtureObservations
    );

    expect(resolved?.value).toBe('6.1%');
    expect(resolved?.safeExplanation).toMatch(/public baseline/i);
  });

  it('lets source owners see their private upload candidate', () => {
    const resolved = resolveFieldForActor(
      fixtureActors.sourceOwner,
      'demo-001',
      'capRate',
      fixtureObservations
    );

    expect(resolved?.value).toContain('private rent roll');
    expect(resolved?.authorityLabel).toBe('User-private');
  });

  it('lets matching org members see organization-private observations', () => {
    const resolved = resolveFieldForActor(
      fixtureActors.orgMember,
      'demo-001',
      'acreage',
      fixtureObservations
    );

    expect(resolved?.value).toContain('org survey');
  });

  it('does not let premium entitlement bypass missing provider partner scope for partner APIs', () => {
    const decision = decideVisibility(fixtureActors.partnerApi, {
      visibility: 'provider-restricted',
      requiredPartnerScope: 'provider-comp-read',
    });

    expect(decision.decision).toBe('deny');
    expect(decision.safeExplanation).not.toMatch(/5\.8|provider comp/i);
  });

  it('allows internal operators to inspect internal-only review projections', () => {
    expect(
      decideVisibility(fixtureActors.internalOperator, { visibility: 'internal-only' }).decision
    ).toBe('allow');
    expect(decideVisibility(fixtureActors.public, { visibility: 'internal-only' }).decision).toBe(
      'redact'
    );
  });
});
