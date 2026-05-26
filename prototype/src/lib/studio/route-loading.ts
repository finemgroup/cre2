export type RouteLoadingVariant =
  | 'public'
  | 'studio'
  | 'studio-deal'
  | 'studio-report'
  | 'studio-operator';

export function resolveRouteLoadingVariant(pathname: string): RouteLoadingVariant {
  if (pathname.startsWith('/studio/reports')) return 'studio-report';
  if (pathname === '/studio/broker-os') return 'studio-operator';
  if (pathname.startsWith('/studio/deals')) return 'studio-deal';
  if (pathname.startsWith('/studio')) return 'studio';
  return 'public';
}

const LOADING_COPY: Record<
  RouteLoadingVariant,
  { eyebrow: string; title: string; detail: string }
> = {
  public: {
    eyebrow: 'Public marketplace',
    title: 'Loading property intelligence',
    detail: 'Resolving authority labels, spatial context, and evidence drawers.',
  },
  studio: {
    eyebrow: 'Finem CRE Studio',
    title: 'Opening studio workspace',
    detail: 'Preparing broker dashboard surfaces and governed workflow chrome.',
  },
  'studio-deal': {
    eyebrow: 'Deal workflow',
    title: 'Opening deal workstation',
    detail: 'Loading cockpit, evidence posture, and underwriting context.',
  },
  'studio-report': {
    eyebrow: 'Report builder',
    title: 'Opening report assembly',
    detail: 'Preparing section gates, source bundles, and export posture.',
  },
  'studio-operator': {
    eyebrow: 'Broker OS',
    title: 'Opening operator inventory',
    detail: 'Loading sanitized job streams and planning projections.',
  },
};

export function getRouteLoadingCopy(variant: RouteLoadingVariant): {
  eyebrow: string;
  title: string;
  detail: string;
} {
  return LOADING_COPY[variant];
}
