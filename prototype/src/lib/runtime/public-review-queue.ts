import type { ActorContext } from '@/lib/contracts/actor-context';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { getLinkedDealId } from '@/lib/workflow-identity';

export type ReviewFixtureStateId =
  | 'clean'
  | 'blocked'
  | 'low-evidence'
  | 'provider-restricted'
  | 'ready-for-review';

export type SourceGapRow = {
  id: string;
  section: string;
  blockerType: string;
  evidenceStatus: string;
  sourceRightsPosture: string;
  confidenceImpact: string;
  reviewerAction: string;
  blocksExport: boolean;
  detail: string;
};

type ReviewFixtureState = readonly [
  ReviewFixtureStateId,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  readonly SourceGapRow[],
];

export const REVIEW_FIXTURE_STATES: ReviewFixtureState[] = [
  [
    'clean',
    'Clean',
    'High source coverage',
    'Analyst queue idle',
    'Checklist clear in fixture',
    '4/4 sections reviewed in fixture',
    'Consent and receipt storage still gated',
    'Spot-check staged sections; export receipt remains disabled.',
    'Prototype-only review. Does not clear export gates.',
    [
      {
        id: 'clean-exec',
        section: 'Executive summary',
        blockerType: 'Receipt gate',
        evidenceStatus: 'Reviewed',
        sourceRightsPosture: 'Clear in fixture',
        confidenceImpact: 'Low',
        reviewerAction: 'Confirm no material edits before queue signoff',
        blocksExport: true,
        detail:
          'Clean fixture posture still blocks live export until consent and receipt contracts exist.',
      },
      {
        id: 'clean-comps',
        section: 'Comparable Sales',
        blockerType: 'Export receipt',
        evidenceStatus: 'Reviewed',
        sourceRightsPosture: 'Public aggregate',
        confidenceImpact: 'Low',
        reviewerAction: 'Spot-check comp citations for drift',
        blocksExport: true,
        detail:
          'Comp rows are reviewed in fixture only; governed receipt generation stays disabled.',
      },
      {
        id: 'clean-receipt',
        section: 'Export receipt',
        blockerType: 'Prototype gate',
        evidenceStatus: 'Not recorded',
        sourceRightsPosture: 'Receipt storage gated',
        confidenceImpact: 'None',
        reviewerAction: 'Do not enable export from this cockpit',
        blocksExport: true,
        detail: 'No PDF, partner delivery, or syndication is authorized in the prototype.',
      },
    ],
  ],
  [
    'blocked',
    'Blocked',
    'Review blockers present',
    'Reviewer required',
    'Checklist incomplete',
    '2/4 sections export-ready',
    'Consent missing; restricted comps unresolved',
    'Reconcile comp citations, source rights, and reviewer approval before export.',
    'Prototype-only review. Does not clear export gates.',
    [
      {
        id: 'blocked-comps',
        section: 'Comparable Sales',
        blockerType: 'Section review',
        evidenceStatus: 'Partial citations',
        sourceRightsPosture: 'Pending clearance',
        confidenceImpact: 'High',
        reviewerAction: 'Reconcile comp citations and remove blocked rows',
        blocksExport: true,
        detail: 'Comparable sales review, source rights, and reviewer approval are incomplete.',
      },
      {
        id: 'blocked-rights',
        section: 'Source rights checklist',
        blockerType: 'Consent / source-rights',
        evidenceStatus: 'Consent missing',
        sourceRightsPosture: 'Restricted summary',
        confidenceImpact: 'High',
        reviewerAction: 'Record consent placeholder and confirm source-use terms',
        blocksExport: true,
        detail: 'Source-rights review incomplete; export remains blocked until checklist clears.',
      },
      {
        id: 'blocked-underwriting',
        section: 'Underwriting Assumptions',
        blockerType: 'Reviewer approval',
        evidenceStatus: 'Staged draft',
        sourceRightsPosture: 'Advisory only',
        confidenceImpact: 'Medium',
        reviewerAction: 'Assign analyst signoff for assumption pack',
        blocksExport: true,
        detail: 'Reviewer approval missing; section is not export-ready.',
      },
    ],
  ],
  [
    'low-evidence',
    'Low evidence',
    'Thin citation pack',
    'Reviewer cannot approve thin pack',
    'Coverage below export threshold',
    '1/4 sections export-ready',
    'Assessor and rent roll support thin',
    'Refresh assessor, rent roll, and map support before export consideration.',
    'Prototype-only review. Does not clear export gates.',
    [
      {
        id: 'low-assessor',
        section: 'Property facts',
        blockerType: 'Low evidence',
        evidenceStatus: 'Thin citation',
        sourceRightsPosture: 'Public aggregate',
        confidenceImpact: 'High',
        reviewerAction: 'Refresh assessor row or mark as candidate-only',
        blocksExport: true,
        detail: 'Assessor, rent roll, and map support need review before export.',
      },
      {
        id: 'low-rentroll',
        section: 'Rent roll support',
        blockerType: 'Low evidence',
        evidenceStatus: 'Candidate only',
        sourceRightsPosture: 'Owner-restricted',
        confidenceImpact: 'High',
        reviewerAction: 'Upload summary or downgrade confidence label',
        blocksExport: true,
        detail:
          'Evidence coverage below export threshold; reviewer cannot approve thin source pack.',
      },
      {
        id: 'low-map',
        section: 'Regional map',
        blockerType: 'Spatial evidence',
        evidenceStatus: 'Sample layer',
        sourceRightsPosture: 'Spatial pending',
        confidenceImpact: 'Medium',
        reviewerAction: 'Confirm spatial source-rights posture',
        blocksExport: true,
        detail: 'Map layer remains evidence-gated and cannot ship in export appendix.',
      },
    ],
  ],
  [
    'provider-restricted',
    'Provider restricted',
    'Source rights constrained',
    'Reviewer must summarize restricted evidence',
    'Premium-private rows blocked',
    '2/4 sections export-ready',
    'Provider-restricted comps cannot ship',
    'Remove or summarize restricted comps before export consideration.',
    'Prototype-only review. Does not clear export gates.',
    [
      {
        id: 'restricted-comps',
        section: 'Comp appendix',
        blockerType: 'Provider-restricted',
        evidenceStatus: 'Summary only',
        sourceRightsPosture: 'Provider blocked',
        confidenceImpact: 'High',
        reviewerAction: 'Remove or summarize restricted comp rows',
        blocksExport: true,
        detail: 'Premium-private comp rows are summary-only and cannot ship.',
      },
      {
        id: 'restricted-premium',
        section: 'Premium comp row',
        blockerType: 'Provider-restricted',
        evidenceStatus: 'Redacted',
        sourceRightsPosture: 'Cannot ship',
        confidenceImpact: 'High',
        reviewerAction: 'Replace with public comp set or drop from export scope',
        blocksExport: true,
        detail: 'Provider-restricted comps cannot ship in governed export.',
      },
      {
        id: 'restricted-partner',
        section: 'Partner feed',
        blockerType: 'License posture',
        evidenceStatus: 'Licensed fixture',
        sourceRightsPosture: 'Summary posture required',
        confidenceImpact: 'Medium',
        reviewerAction: 'Confirm license text and summary-only delivery',
        blocksExport: true,
        detail: 'Restricted comps must be removed or summarized before export.',
      },
    ],
  ],
  [
    'ready-for-review',
    'Ready for review',
    'Analyst queue ready',
    'Analyst approval not recorded',
    'Packet assembled for review',
    '3/4 sections staged',
    'Consent pending; receipt disabled',
    'Record analyst approval placeholder; export receipt remains disabled.',
    'Prototype-only review. Does not clear export gates.',
    [
      {
        id: 'ready-exec',
        section: 'Executive summary',
        blockerType: 'Ready for review',
        evidenceStatus: 'Assembled',
        sourceRightsPosture: 'Clear in fixture',
        confidenceImpact: 'Low',
        reviewerAction: 'Analyst read-through and signoff placeholder',
        blocksExport: true,
        detail: 'Ready for analyst review, not export; approval is not recorded.',
      },
      {
        id: 'ready-bundle',
        section: 'Section bundle',
        blockerType: 'Ready for review',
        evidenceStatus: 'Staged',
        sourceRightsPosture: 'Advisory summary',
        confidenceImpact: 'Low',
        reviewerAction: 'Record reviewer approval placeholder',
        blocksExport: true,
        detail: 'Sections are staged for reviewer signoff; export receipt is not recorded.',
      },
      {
        id: 'ready-consent',
        section: 'Consent packet',
        blockerType: 'Consent pending',
        evidenceStatus: 'Pending consent',
        sourceRightsPosture: 'Receipt gated',
        confidenceImpact: 'Medium',
        reviewerAction: 'Confirm consent copy before any export rehearsal',
        blocksExport: true,
        detail: 'Analyst approval and export receipt are not recorded in this prototype.',
      },
    ],
  ],
];

export function resolveReviewFixtureState(value: string | null): ReviewFixtureState {
  return (
    REVIEW_FIXTURE_STATES.find(([stateId]) => stateId === value) ??
    REVIEW_FIXTURE_STATES.find(([stateId]) => stateId === 'blocked') ??
    REVIEW_FIXTURE_STATES[0]
  );
}

export function getPublicReviewQueueView(
  propertyId: string | undefined,
  actor: ActorContext = fixtureActors.public
) {
  const report = getPublicReportView(propertyId, actor);
  if (!report) return undefined;

  const linkedDealId = getLinkedDealId(report.property.id);
  const readySections = report.sections.filter((section) => section.status === 'ready').length;
  const reviewRequiredCount = report.sections.filter(
    (section) => section.status === 'review-required'
  ).length;
  const blockedSections = report.sections.filter((section) => section.status === 'blocked').length;

  return {
    propertyId: report.property.id,
    reportId: `report-${report.property.id}`,
    linkedDealId,
    reportPath: `/report/${report.property.id}`,
    exportPath: `/export/${report.property.id}`,
    evidenceSnapshotId: report.valuationVersion.evidenceSnapshot.id,
    readySections,
    reviewRequiredCount,
    blockedSections,
    totalSections: report.sections.length,
    exportReady: false,
    blockerCount: report.readiness.blockedReasons.length,
    governanceNote:
      'Review queue actions are prototype-only and do not clear export, consent, or source-rights gates.',
  };
}

export type PublicReviewQueueView = NonNullable<ReturnType<typeof getPublicReviewQueueView>>;
