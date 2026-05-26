import {
  agentCapabilities,
  brandConfig,
  comps,
  deals,
  getStudioDeal,
  jobStreams,
  scenarios,
  underwritingAssumptionsByDeal,
  underwritingProvenanceByDeal,
  type AuthorityState,
} from '@/data/studio';
import { fixtureActors } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';
import { decideVisibility } from '@/lib/contracts/visibility';
import { getValuationVersionForActor } from '@/lib/contracts/valuation-version';
import { getSourceBlocksForDeal } from '@/lib/source-bundle';
import { getStudioReportSections, getLinkedPropertyId, resolvePropertyIdForDeal } from '@/lib/workflow-identity';
import { evaluateExportReadiness } from '@/lib/report-governance';
import { getPublicPropertyView } from '@/lib/runtime/public-property';
import {
  evaluateSourceRightsManifest,
  getVerificationSummary,
  listTradeAreasForReport,
  summarizeGisManifest,
} from '@/lib/gis';
import { buildGisPerformanceBudgets, summarizeGisPerformance } from '@/lib/gis/performance';
import { fixtureMapLayerManifests, getMapLayerManifestsForActor } from '@/lib/contracts/spatial';
import { getReviewQueue } from '@/lib/runtime/review-queue';
import {
  ASSUMPTION_TRACE_ITEMS,
  UNIT_CONFLICT_OPTIONS,
  VERSION_SNAPSHOTS,
} from '@/pages/studio/deals/deal-route-shared';
import {
  calculateUnderwritingMetrics,
} from '@/lib/underwriting';
import {
  mockCandidateFields,
  mockNormalizationCandidates,
  mockUploadFiles,
} from '@/lib/staged-import';

function authorityToVisibility(authority: AuthorityState) {
  if (authority === 'Premium-private') return 'provider-restricted' as const;
  if (authority === 'Candidate evidence') return 'shared-with-permission' as const;
  if (authority === 'Blocked') return 'internal-only' as const;
  return 'public-baseline' as const;
}

export function getStudioDashboardView(actor: ActorContext = fixtureActors.orgAdmin) {
  return {
    deals,
    activityActor: actor.id,
    planUsage: { used: 1, available: 2, percentage: 50 },
  };
}

export function getStudioDealView(dealId: string | undefined, actor: ActorContext = fixtureActors.orgAdmin) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  return {
    deal,
    sourceBlocks: getSourceBlocksForDeal(deal.id),
    actorId: actor.id,
  };
}

export function getStudioCompViews(actor: ActorContext = fixtureActors.orgAdmin) {
  return comps.map((comp) => {
    const decision = decideVisibility(actor, {
      visibility: authorityToVisibility(comp.authority),
      requiredEntitlement: comp.authority === 'Premium-private' ? 'premium-comps' : undefined,
    });
    return {
      ...comp,
      visible: decision.decision === 'allow',
      safeExplanation: decision.safeExplanation,
    };
  });
}

export function getStudioReportBuilderView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  const sections = getStudioReportSections(deal.id);
  const sourceBlocks = getSourceBlocksForDeal(deal.id);
  const readiness = evaluateExportReadiness(sections, sourceBlocks);
  const linkedPropertyId = resolvePropertyIdForDeal(deal.id);
  return {
    deal,
    actorId: actor.id,
    sections,
    sourceBlocks,
    readiness,
    valuationVersion: getValuationVersionForActor({
      actor,
      propertyId: linkedPropertyId ?? deal.id,
      reportId: `studio-report-${deal.id}`,
      exportConsent: false,
      sourceRightsClear: readiness.ready,
      spatialSourceClear: true,
    }),
    brandConfig,
  };
}

export function getStudioScenarioView() {
  return { scenarios };
}

export function getStudioUnderwritingView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  const assumptions =
    underwritingAssumptionsByDeal[deal.id] ?? underwritingAssumptionsByDeal['riverside-flats'];
  const reviewedCompCount = getStudioCompViews(actor).filter(
    (comp) => comp.authority === 'Reviewed' && comp.visible
  ).length;
  return {
    deal,
    actorId: actor.id,
    assumptions,
    provenance: underwritingProvenanceByDeal[deal.id],
    reviewedCompCount,
    sourceBlocks: getSourceBlocksForDeal(deal.id),
  };
}

export function getStudioSpatialWorkbenchView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  const propertyId = getLinkedPropertyId(deal.id) ?? 'demo-001';
  const context = 'report' as const;
  const performanceBudgets = buildGisPerformanceBudgets(fixtureMapLayerManifests);
  const propertyView = getPublicPropertyView(propertyId, actor);
  return {
    deal,
    propertyId,
    actorId: actor.id,
    summary: summarizeGisManifest(actor, context, propertyId),
    sourceRights: evaluateSourceRightsManifest(actor, context),
    verification: getVerificationSummary(actor, propertyId),
    tradeAreas: listTradeAreasForReport(actor, propertyId),
    layers: getMapLayerManifestsForActor(actor, context),
    performanceBudgets,
    performanceSummary: summarizeGisPerformance(performanceBudgets),
    spatialContext: propertyView?.spatialContext,
  };
}

export function getStudioValuationVersionsView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  const propertyId = getLinkedPropertyId(deal.id) ?? deal.id;
  return {
    deal,
    actorId: actor.id,
    snapshots: VERSION_SNAPSHOTS,
    sourceBlocks: getSourceBlocksForDeal(deal.id),
    valuationVersion: getValuationVersionForActor({
      actor,
      propertyId,
      reportId: `studio-report-${deal.id}`,
      exportConsent: false,
      sourceRightsClear: false,
      spatialSourceClear: true,
    }),
  };
}

export function getStudioSourceTraceView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  return {
    deal,
    actorId: actor.id,
    traceItems: ASSUMPTION_TRACE_ITEMS,
    conflictOptions: UNIT_CONFLICT_OPTIONS,
    sourceBlocks: getSourceBlocksForDeal(deal.id),
  };
}

export function getStudioDataReviewView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  return {
    deal,
    actorId: actor.id,
    uploadFiles: mockUploadFiles,
    normalizationRows: mockNormalizationCandidates,
    conflictOptions: UNIT_CONFLICT_OPTIONS,
    sourceBlocks: getSourceBlocksForDeal(deal.id),
  };
}

export function getStudioDebtPanelView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  const assumptions =
    underwritingAssumptionsByDeal[deal.id] ?? underwritingAssumptionsByDeal['riverside-flats'];
  const metrics = calculateUnderwritingMetrics(assumptions);
  const debtTraceItem =
    ASSUMPTION_TRACE_ITEMS.find((item) => item.id === 'debt-service') ?? null;
  return {
    deal,
    actorId: actor.id,
    assumptions,
    metrics,
    debtTraceItem,
    quotePending: debtTraceItem?.posture === 'Source pending',
    sourceBlocks: getSourceBlocksForDeal(deal.id),
  };
}

export function getStudioDealIntakeView(
  dealId: string | undefined,
  actor: ActorContext = fixtureActors.orgAdmin
) {
  const deal = getStudioDeal(dealId);
  if (!deal) return undefined;
  const uploadFiles = mockUploadFiles;
  const candidateFields = mockCandidateFields;
  return {
    deal,
    actorId: actor.id,
    uploadFiles,
    candidateFields,
    sourceBlocks: getSourceBlocksForDeal(deal.id),
    activeStageIndex: 2,
    filesNeedingReview: uploadFiles.filter(
      (file) =>
        file.status === 'needs review' ||
        file.status === 'blocked' ||
        Boolean(file.issue)
    ).length,
  };
}

export const BROKER_OS_OPERATOR_TAXONOMY = {
  externalSurfaces: [
    {
      id: 'readiness',
      label: 'Readiness summary',
      scope: 'Sanitized job stream counts, latency posture, and error rate bands.',
    },
    {
      id: 'agents',
      label: 'Agent inventory',
      scope: 'Capability tags and online status without raw worker identifiers.',
    },
    {
      id: 'review-queue',
      label: 'Review queue projection',
      scope: 'Field keys and advisory trust tiers only — no promotion authority.',
    },
  ],
  internalOnly: [
    'Raw Fabricator execution logs',
    'Worker queue depth and retry counters',
    'PII-bearing execution context',
    'Unsanitized planning payloads',
  ],
} as const;

export function getBrokerOsProjection() {
  return {
    jobStreams,
    agentCapabilities,
    rawLogsExposed: false,
    safeProjectionLabel: 'Sanitized Broker OS projection',
    taxonomy: BROKER_OS_OPERATOR_TAXONOMY,
  };
}

export function getBrokerOsView() {
  return {
    ...getBrokerOsProjection(),
    reviewQueuePreview: getReviewQueue().slice(0, 5),
  };
}
