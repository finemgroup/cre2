import {
  agentCapabilities,
  brandConfig,
  comps,
  deals,
  getStudioDeal,
  jobStreams,
  scenarios,
  type AuthorityState,
} from '@/data/studio';
import { fixtureActors } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';
import { decideVisibility } from '@/lib/contracts/visibility';
import { getValuationVersionForActor } from '@/lib/contracts/valuation-version';
import { getSourceBlocksForDeal } from '@/lib/source-bundle';
import { getStudioReportSections, resolvePropertyIdForDeal } from '@/lib/workflow-identity';
import { evaluateExportReadiness } from '@/lib/report-governance';

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

export function getBrokerOsProjection() {
  return {
    jobStreams,
    agentCapabilities,
    rawLogsExposed: false,
    safeProjectionLabel: 'Sanitized Broker OS projection',
  };
}
