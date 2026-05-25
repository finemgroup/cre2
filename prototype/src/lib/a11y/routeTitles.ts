import { getDealIdFromPath, getStudioDeal } from '@/data/studio';

export function getPublicRouteTitle(pathname: string): string {
  if (pathname === '/') return 'Search - Sophex';
  if (pathname.startsWith('/property/') && pathname.endsWith('/comps')) {
    return 'Comparable Sales - Sophex';
  }
  if (pathname.startsWith('/property/')) return 'Property Intelligence - Sophex';
  if (pathname === '/upload') return 'Upload Documents - Sophex';
  if (pathname === '/comps') return 'Comparable Sales - Sophex';
  if (pathname.startsWith('/report/')) return 'Report Preview - Sophex';
  if (pathname.startsWith('/export/')) return 'Export Gate - Sophex';
  return 'Page Not Found - Sophex';
}

function dealScopedTitle(suffix: string, dealId: string): string {
  const dealName = getStudioDeal(dealId)?.name ?? 'Deal';
  return `${suffix} - ${dealName} - Finem CRE Studio`;
}

export function getStudioRouteTitle(pathname: string): string {
  if (pathname === '/studio') return 'Finem CRE Studio';
  if (pathname === '/studio/onboarding') return 'Onboarding - Finem CRE Studio';
  if (pathname === '/studio/dashboard') return 'Dashboard - Finem CRE Studio';
  if (pathname === '/studio/settings/billing') return 'Billing & Plans - Finem CRE Studio';
  if (pathname === '/studio/settings/white-label') return 'White Label Settings - Finem CRE Studio';
  if (pathname === '/studio/broker-os') return 'Broker OS - Finem CRE Studio';

  const dealId = getDealIdFromPath(pathname);

  if (/\/intake$/.test(pathname)) return dealScopedTitle('Deal Intake', dealId);
  if (/\/comps$/.test(pathname)) return dealScopedTitle('Comps', dealId);
  if (/\/underwriting$/.test(pathname)) return dealScopedTitle('Underwriting', dealId);
  if (/\/scenarios$/.test(pathname)) return dealScopedTitle('Scenario Comparison', dealId);
  if (/^\/studio\/deals\/[^/]+$/.test(pathname)) {
    return `${getStudioDeal(dealId)?.name ?? 'Deal'} - Finem CRE Studio`;
  }
  if (pathname.startsWith('/studio/reports/')) return dealScopedTitle('Report Builder', dealId);

  return 'Studio - Finem CRE Studio';
}
