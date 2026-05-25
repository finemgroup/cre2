import { fixtureActors } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';
import { evaluateExportReadiness } from '@/lib/report-governance';
import {
  getPropertyRecord,
  getPublicReportSections,
  getSourceBlocksForProperty,
} from '@/lib/workflow-identity';
import { evaluateExportPolicy, type ExportScope } from '@/lib/runtime/export-policy';

export function getPublicReportView(propertyId: string | undefined) {
  const property = getPropertyRecord(propertyId);
  if (!property) return undefined;
  const sections = getPublicReportSections(propertyId);
  const sourceBlocks = getSourceBlocksForProperty(propertyId);
  const readiness = evaluateExportReadiness(sections, sourceBlocks);
  return { property, sections, sourceBlocks, readiness };
}

export function getPublicExportDecision(input: {
  propertyId: string;
  actor?: ActorContext;
  scope?: ExportScope;
  consent: boolean;
  idempotencyKey: string;
}) {
  const report = getPublicReportView(input.propertyId);
  if (!report) return undefined;
  return evaluateExportPolicy({
    actor: input.actor ?? fixtureActors.public,
    reportId: `report-${input.propertyId}`,
    scope: input.scope ?? 'download',
    readiness: report.readiness,
    consent: input.consent,
    idempotencyKey: input.idempotencyKey,
  });
}
