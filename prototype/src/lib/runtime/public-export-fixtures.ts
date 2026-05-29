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
    'Source-rights clear in fixture',
    'Reviewer approval required',
    'Sections staged, export disabled',
    'Clean review posture, but no live export authority.',
    [
      'Governed receipt generation remains disabled in prototype.',
      'Clean fixture still blocks live export until consent exists.',
    ],
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
    'Comparable Sales not export-ready',
    'Blocked: consent, section review, reviewer approval, and source rights remain open.',
    [
      'Comparable sales review incomplete.',
      'Blocked state requires source-rights and reviewer clearance before export.',
    ],
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
    [
      'Assessor and rent roll need review.',
      'Low-evidence source pack requires reviewer action before export consideration.',
    ],
    ['advisory', 'candidate-evidence', 'source-pending'],
  ],
  [
    'provider-restricted',
    'Provider restricted',
    'Source rights constrained',
    '81% source coverage',
    'Consent missing',
    'Provider-restricted comps cannot ship',
    'Remove or summarize restricted evidence',
    'Comp appendix is summary-only',
    'Blocked: restricted comps must be removed or summarized before export.',
    [
      'Premium-private comp rows are summary-only.',
      'Provider-restricted sources cannot be exported directly; summarize or remove.',
    ],
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
    [
      'Analyst approval and export receipt are not recorded.',
      'Ready-for-review is still not live approval; export remains disabled/gated.',
    ],
    ['advisory', 'reviewer-required', 'reviewed'],
  ],
];

type Cit = readonly [string, string, string, string, boolean];

const CITATIONS: Record<ExportFixtureStateId, readonly Cit[]> = {
  clean: [
    [
      'c1',
      'Travis CAD parcel',
      'Assessor · Property facts · Low',
      'Assessor fixture excerpt.',
      false,
    ],
  ],
  blocked: [
    [
      'b1',
      'Premium comp row (blocked)',
      'Comp set · Comparable Sales · High',
      'Comparable sales review incomplete.',
      true,
    ],
  ],
  'low-evidence': [
    [
      'l1',
      'Assessor excerpt (thin)',
      'Assessor · Property facts · High',
      'Thin assessor citation.',
      true,
    ],
  ],
  'provider-restricted': [
    [
      'p1',
      'Premium-private comp row',
      'Comp set · Comp appendix · High',
      'Premium-private comp rows are summary-only.',
      true,
    ],
  ],
  'ready-for-review': [
    [
      'r1',
      'Executive summary pack',
      'OM · Executive summary · Low',
      'Staged for analyst read-through.',
      true,
    ],
  ],
};

export function getCitationRows(stateId: ExportFixtureStateId) {
  return CITATIONS[stateId].map(([id, title, meta, excerpt, blocksExport]) => ({
    id,
    title,
    meta,
    excerpt,
    blocksExport,
  }));
}

export function resolveExportFixtureState(value: string | null): ExportGateFixtureState {
  return (
    EXPORT_FIXTURE_STATES.find(([stateId]) => stateId === value) ??
    EXPORT_FIXTURE_STATES.find(([stateId]) => stateId === 'blocked') ??
    EXPORT_FIXTURE_STATES[0]
  );
}

export function appendExportFixtureStateQuery(path: string, stateParam: string | null): string {
  if (!stateParam) {
    return path;
  }
  const fixtureStateId = resolveExportFixtureState(stateParam)[0];
  return `${path}${path.includes('?') ? '&' : '?'}state=${fixtureStateId}`;
}

export function sourcePackBlocker(stateId: ExportFixtureStateId): string {
  return EXPORT_FIXTURE_STATES.find(([id]) => id === stateId)?.[9].at(-1) ?? '';
}
