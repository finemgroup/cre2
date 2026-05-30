export const DEFAULT_DEMO_PROPERTY_ID = 'demo-001';
export const DEFAULT_DEMO_DEAL_ID = 'riverside-flats';

export type PublicProductNavLink = {
  label: string;
  to: string;
  active: boolean;
  icon: string;
};

export function demoQuery(search: string): string {
  const state = new URLSearchParams(search).get('state');
  return state ? `?state=${encodeURIComponent(state)}` : '';
}

export function getPublicProductLinks(pathname: string, search: string): PublicProductNavLink[] {
  const stateQuery = demoQuery(search);
  return [
    { label: 'Explore', to: '/', active: pathname === '/', icon: 'explore' },
    {
      label: 'Comps',
      to: `/property/${DEFAULT_DEMO_PROPERTY_ID}/comps${stateQuery}`,
      active: pathname.includes('/comps'),
      icon: 'compare_arrows',
    },
    {
      label: 'Intelligence',
      to: `/property/${DEFAULT_DEMO_PROPERTY_ID}${stateQuery}`,
      active: pathname.startsWith('/property/') && !pathname.includes('/comps'),
      icon: 'psychology',
    },
    {
      label: 'Underwrite',
      to: `/studio/deals/${DEFAULT_DEMO_DEAL_ID}/underwriting`,
      active: pathname.includes('/underwriting'),
      icon: 'analytics',
    },
    {
      label: 'Review',
      to: `/review/${DEFAULT_DEMO_PROPERTY_ID}${stateQuery}`,
      active:
        pathname.startsWith('/review/') ||
        pathname.startsWith('/export/') ||
        pathname.startsWith('/sources/'),
      icon: 'task_alt',
    },
  ];
}
