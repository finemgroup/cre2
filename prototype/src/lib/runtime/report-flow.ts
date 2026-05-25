import { fixtureActors } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';
import { evaluateExportReadiness } from '@/lib/report-governance';
import {
  getPropertyRecord,
  getPublicReportSections,
  getSourceBlocksForProperty,
} from '@/lib/workflow-identity';
import { evaluateSpatialSourceClear } from '@/lib/contracts/spatial';
import { getValuationVersionForActor } from '@/lib/contracts/valuation-version';
import { evaluateExportPolicy, type ExportScope } from '@/lib/runtime/export-policy';

export function getPublicReportView(
  propertyId: string | undefined,
  actor: ActorContext = fixtureActors.public
) {
  const property = getPropertyRecord(propertyId);
  if (!property) return undefined;
  const sections = getPublicReportSections(propertyId);
  const sourceBlocks = getSourceBlocksForProperty(propertyId);
  const readiness = evaluateExportReadiness(sections, sourceBlocks);
  const spatialSourceClear = evaluateSpatialSourceClear(actor, property.id);
  const valuationVersion = getValuationVersionForActor({
    actor,
    propertyId: property.id,
    reportId: `report-${property.id}`,
    sourceRightsClear: readiness.ready,
    spatialSourceClear,
  });
  return { property, sections, sourceBlocks, readiness, valuationVersion };
}

export function getPublicExportDecision(input: {
  propertyId: string;
  actor?: ActorContext;
  scope?: ExportScope;
  consent: boolean;
  idempotencyKey: string;
}) {
  const actor = input.actor ?? fixtureActors.public;
  const report = getPublicReportView(input.propertyId, actor);
  if (!report) return undefined;
  return evaluateExportPolicy({
    actor,
    reportId: `report-${input.propertyId}`,
    scope: input.scope ?? 'download',
    readiness: report.readiness,
    consent: input.consent,
    idempotencyKey: input.idempotencyKey,
  });
}
