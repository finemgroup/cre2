import { getDealIdFromPath, getStudioDeal } from '@/data/studio';
import { getPropertyRecord } from '@/lib/workflow-identity';

function propertyScopedTitle(suffix: string, propertyId: string): string {
  const property = getPropertyRecord(propertyId);
  const label = property?.address ?? propertyId;
  return `${suffix} - ${label} - Sophex`;
}

function extractPublicPropertyId(pathname: string): string | undefined {
  const match = pathname.match(/^\/(?:property|report|export)\/([^/]+)/);
  return match?.[1];
}

export function getPublicRouteTitle(pathname: string): string {
  const propertyId = extractPublicPropertyId(pathname);

  if (pathname === '/') return 'Search - Sophex';
  if (pathname.startsWith('/property/') && pathname.endsWith('/comps')) {
    return propertyId
      ? propertyScopedTitle('Comparable Sales', propertyId)
      : 'Comparable Sales - Sophex';
  }
  if (pathname.startsWith('/property/')) {
    return propertyId
      ? propertyScopedTitle('Property Intelligence', propertyId)
      : 'Property Intelligence - Sophex';
  }
  if (pathname === '/upload') return 'Upload Documents - Sophex';
  if (pathname === '/comps') return 'Comparable Sales - Sophex';
  if (pathname.startsWith('/report/')) {
    return propertyId
      ? propertyScopedTitle('Report Preview', propertyId)
      : 'Report Preview - Sophex';
  }
  if (pathname.startsWith('/export/')) {
    return propertyId ? propertyScopedTitle('Export Gate', propertyId) : 'Export Gate - Sophex';
  }
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
  if (/\/data-review$/.test(pathname)) return dealScopedTitle('Data Review', dealId);
  if (/\/comps$/.test(pathname)) return dealScopedTitle('Comps', dealId);
  if (/\/underwriting\/sources$/.test(pathname))
    return dealScopedTitle('Assumption Source Trace', dealId);
  if (/\/underwriting\/debt$/.test(pathname)) return dealScopedTitle('Debt Quote Panel', dealId);
  if (/\/underwriting$/.test(pathname)) return dealScopedTitle('Underwriting', dealId);
  if (/\/scenarios$/.test(pathname)) return dealScopedTitle('Scenario Comparison', dealId);
  if (/\/versions$/.test(pathname)) return dealScopedTitle('Valuation Versions', dealId);
  if (/\/capital-stack$/.test(pathname)) return dealScopedTitle('Capital Stack', dealId);
  if (/\/ic-packet$/.test(pathname)) return dealScopedTitle('IC Packet', dealId);
  if (/\/hitl-review$/.test(pathname)) return dealScopedTitle('HITL Review', dealId);
  if (/\/spatial$/.test(pathname)) return dealScopedTitle('Spatial Workbench', dealId);
  if (/^\/studio\/deals\/[^/]+$/.test(pathname)) {
    return `${getStudioDeal(dealId)?.name ?? 'Deal'} - Finem CRE Studio`;
  }
  if (pathname.startsWith('/studio/reports/')) return dealScopedTitle('Report Builder', dealId);

  return 'Studio - Finem CRE Studio';
}
