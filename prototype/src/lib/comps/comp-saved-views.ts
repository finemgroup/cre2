export type CompSavedViewId = 'all' | 'inspectable' | 'nearby' | 'reviewed';

export type CompSavedView = {
  id: CompSavedViewId;
  label: string;
  description: string;
};

export const PUBLIC_COMP_SAVED_VIEWS: CompSavedView[] = [
  { id: 'all', label: 'Full set', description: 'All sample comps with authority labels.' },
  {
    id: 'inspectable',
    label: 'Inspectable',
    description: 'Comps available for detail inspection in this actor context.',
  },
  { id: 'nearby', label: 'Within 1 mi', description: 'Distance-filtered comp subset.' },
  {
    id: 'reviewed',
    label: 'Reviewed / public',
    description: 'Public baseline comps only.',
  },
];

export const STUDIO_COMP_SAVED_VIEWS: CompSavedView[] = [
  { id: 'all', label: 'Full set', description: 'All mock comps including locked rows.' },
  { id: 'inspectable', label: 'Visible', description: 'Comps visible to the current workspace actor.' },
  { id: 'nearby', label: 'Within 1 mi', description: 'Distance-filtered comp subset.' },
  {
    id: 'reviewed',
    label: 'Reviewed',
    description: 'Reviewed or premium-private authority only.',
  },
];

type PublicCompFilterInput = {
  id: string;
  distanceMi: number;
  authority: string;
  canInspect: boolean;
};

type StudioCompFilterInput = {
  id: string;
  distance: string;
  authority: string;
  visible: boolean;
};

function parseDistanceMi(distance: string): number {
  return Number.parseFloat(distance);
}

export function filterPublicComps<T extends PublicCompFilterInput>(
  comps: T[],
  viewId: CompSavedViewId
): T[] {
  switch (viewId) {
    case 'inspectable':
      return comps.filter((comp) => comp.canInspect);
    case 'nearby':
      return comps.filter((comp) => comp.distanceMi <= 1);
    case 'reviewed':
      return comps.filter((comp) => comp.authority === 'public-baseline');
    default:
      return comps;
  }
}

export function filterStudioComps<T extends StudioCompFilterInput>(
  comps: T[],
  viewId: CompSavedViewId
): T[] {
  switch (viewId) {
    case 'inspectable':
      return comps.filter((comp) => comp.visible);
    case 'nearby':
      return comps.filter((comp) => parseDistanceMi(comp.distance) <= 1);
    case 'reviewed':
      return comps.filter(
        (comp) => comp.authority === 'Reviewed' || comp.authority === 'Premium-private'
      );
    default:
      return comps;
  }
}
