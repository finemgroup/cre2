import { mockProperties, type PropertyRecord } from '@/data/mock';
import { fixtureObservations } from '@/lib/contracts/fixtures';
import { PUBLIC_ACTOR, type ActorContext } from '@/lib/contracts/actor-context';
import { resolveFieldForActor } from '@/lib/contracts/evidence';

export type PublicEvidenceDrawerItem = {
  label: string;
  value: string;
  authorityLabel: string;
  safeExplanation: string;
};

export type PublicPropertyView = {
  property: PropertyRecord;
  evidenceDrawer: PublicEvidenceDrawerItem[];
};

export function getPublicPropertyView(
  propertyId: string | undefined,
  actor: ActorContext = PUBLIC_ACTOR
): PublicPropertyView | undefined {
  const property = mockProperties.find((record) => record.id === propertyId);
  if (!property) return undefined;

  const capRate = resolveFieldForActor(actor, property.id, 'capRate', fixtureObservations);

  return {
    property,
    evidenceDrawer: [
      {
        label: 'Cap rate',
        value: capRate?.value ?? property.capRate,
        authorityLabel: capRate?.authorityLabel ?? 'Public baseline',
        safeExplanation: capRate?.safeExplanation ?? 'Visible because it is public baseline.',
      },
      {
        label: 'Source',
        value: 'Public records aggregate',
        authorityLabel: 'Public baseline',
        safeExplanation: 'Private contributor observations are hidden from public routes.',
      },
    ],
  };
}
