import type { AuthorityPosture } from '@/lib/authority/authority-vocabulary';

export type ExportFixtureStateId =
  | 'clean'
  | 'blocked'
  | 'low-evidence'
  | 'provider-restricted'
  | 'ready-for-review';

export type ExportGateFixtureState = readonly [
  ExportFixtureStateId,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  readonly string[],
  readonly AuthorityPosture[],
];

export const EXPORT_FIXTURE_STATES: ExportGateFixtureState[] = [
  [
    'clean',
    'Clean',
    'High source coverage',
    '94% source coverage',
    'Consent not recorded',
    'Source-rights checklist clear in fixture, receipt storage still gated',
    'Reviewer approval still required for external delivery',
    'Reviewed sections staged, export receipt disabled',
    'Clean review posture, but no live export authority.',
    ['Governed receipt generation remains disabled in prototype.'],
    ['advisory', 'model-inferred', 'reviewed'],
  ],
  [
    'blocked',
    'Blocked',
    'Review blockers present',
    '72% source coverage',
    'Consent missing',
    'Source-rights review incomplete',
    'Reviewer approval missing',
    'Comparable Sales and Underwriting Assumptions are not export-ready',
    'Blocked: consent, section review, reviewer approval, and source rights remain open.',
    ['Comparable sales review, source rights, and reviewer approval are incomplete.'],
    ['advisory', 'reviewer-required', 'source-pending', 'blocked'],
  ],
  [
    'low-evidence',
    'Low evidence',
    'Thin citation pack',
    '48% source coverage',
    'Consent missing',
    'Evidence coverage below export threshold',
    'Reviewer cannot approve thin source pack',
    'Draft report sections remain evidence-gated',
    'Blocked: low evidence coverage cannot support export.',
    ['Assessor, rent roll, and map support need review before export.'],
    ['advisory', 'candidate-evidence', 'source-pending'],
  ],
  [
    'provider-restricted',
    'Provider restricted',
    'Source rights constrained',
    '81% source coverage',
    'Consent missing',
    'Provider-restricted comps cannot ship',
    'Reviewer must remove or summarize restricted evidence',
    'Comp appendix is summary-only',
    'Blocked: restricted comps must be removed or summarized before export.',
    ['Premium-private comp rows are summary-only.'],
    ['advisory', 'source-pending', 'blocked'],
  ],
  [
    'ready-for-review',
    'Ready for review',
    'Analyst queue ready',
    '89% source coverage',
    'Consent pending',
    'Source-rights packet assembled for review',
    'Analyst approval not recorded',
    'Sections are staged for reviewer signoff',
    'Gated: ready for analyst review, not export.',
    ['Analyst approval and export receipt are not recorded.'],
    ['advisory', 'reviewer-required', 'reviewed'],
  ],
];

export function resolveExportFixtureState(value: string | null): ExportGateFixtureState {
  return (
    EXPORT_FIXTURE_STATES.find(([stateId]) => stateId === value) ??
    EXPORT_FIXTURE_STATES.find(([stateId]) => stateId === 'blocked') ??
    EXPORT_FIXTURE_STATES[0]
  );
}
