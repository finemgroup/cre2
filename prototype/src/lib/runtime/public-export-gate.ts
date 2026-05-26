import type { ActorContext } from '@/lib/contracts/actor-context';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { getLinkedDealId } from '@/lib/workflow-identity';

export const PUBLIC_EXPORT_SCOPES = ['preview', 'download', 'share', 'partner-delivery'] as const;

export function getPublicExportGateView(
  propertyId: string | undefined,
  actor: ActorContext = fixtureActors.public
) {
  const report = getPublicReportView(propertyId, actor);
  if (!report) return undefined;

  const linkedDealId = getLinkedDealId(report.property.id);
  const readySections = report.sections.filter((section) => section.status === 'ready').length;

  return {
    propertyId: report.property.id,
    linkedDealId,
    reportPath: `/report/${report.property.id}`,
    studioReportPath: linkedDealId ? `/studio/reports/${linkedDealId}/builder` : undefined,
    evidenceSnapshotId: report.valuationVersion.evidenceSnapshot.id,
    manifestPrefix: report.valuationVersion.evidenceSnapshot.manifestHash.slice(0, 12),
    exportReady: report.readiness.ready,
    blockerCount: report.readiness.blockedReasons.length,
    readySections,
    totalSections: report.sections.length,
    scopes: [...PUBLIC_EXPORT_SCOPES],
    governanceNote:
      'Export receipts remain fixture-only until legal consent, source-rights filtering, and idempotent receipt storage are approved.',
  };
}

export type PublicExportGateView = NonNullable<ReturnType<typeof getPublicExportGateView>>;
