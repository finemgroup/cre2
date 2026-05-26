export type AuthorityPosture =
  | 'public-baseline'
  | 'user-submission'
  | 'candidate-evidence'
  | 'reviewed'
  | 'unreviewed'
  | 'blocked'
  | 'model-inferred'
  | 'advisory'
  | 'source-pending'
  | 'reviewer-required'
  | 'approved-private-use'
  | 'approved-public-projection'
  | 'approximate-centroid'
  | 'sample-map-data'
  | 'not-legal-boundary';

export const PUBLIC_AUTHORITY_LABELS: Record<AuthorityPosture, string> = {
  'public-baseline': 'Public baseline',
  'user-submission': 'User submission',
  'candidate-evidence': 'Candidate evidence only',
  reviewed: 'Reviewed',
  unreviewed: 'Unreviewed',
  blocked: 'Blocked',
  'model-inferred': 'Model-inferred',
  advisory: 'Advisory',
  'source-pending': 'Source pending',
  'reviewer-required': 'Reviewer required',
  'approved-private-use': 'Approved private-use',
  'approved-public-projection': 'Approved public projection',
  'approximate-centroid': 'Approximate centroid',
  'sample-map-data': 'Sample map data',
  'not-legal-boundary': 'Not legal boundary',
};

export type StudioTrustPosture =
  | 'Public baseline'
  | 'Candidate evidence'
  | 'Reviewed'
  | 'Needs review'
  | 'Blocked'
  | 'Model inferred';

export const ALL_AUTHORITY_POSTURES = Object.keys(PUBLIC_AUTHORITY_LABELS) as AuthorityPosture[];

export const STUDIO_TRUST_POSTURES: StudioTrustPosture[] = [
  'Public baseline',
  'Candidate evidence',
  'Reviewed',
  'Needs review',
  'Blocked',
  'Model inferred',
];

const PUBLIC_TO_STUDIO: Record<
  Extract<
    AuthorityPosture,
    | 'public-baseline'
    | 'candidate-evidence'
    | 'reviewed'
    | 'unreviewed'
    | 'blocked'
    | 'model-inferred'
    | 'advisory'
    | 'reviewer-required'
  >,
  StudioTrustPosture
> = {
  'public-baseline': 'Public baseline',
  'candidate-evidence': 'Candidate evidence',
  reviewed: 'Reviewed',
  unreviewed: 'Needs review',
  blocked: 'Blocked',
  'model-inferred': 'Model inferred',
  advisory: 'Needs review',
  'reviewer-required': 'Needs review',
};

export function normalizeAuthorityPosture(state: string): AuthorityPosture | null {
  const normalizedKey = state.toLowerCase().replace(/[^a-z]+/g, '-') as AuthorityPosture;
  if (normalizedKey in PUBLIC_AUTHORITY_LABELS) return normalizedKey;
  return null;
}

export function toStudioTrustPosture(label: AuthorityPosture): StudioTrustPosture {
  if (label in PUBLIC_TO_STUDIO) {
    return PUBLIC_TO_STUDIO[label as keyof typeof PUBLIC_TO_STUDIO];
  }
  if (label === 'source-pending' || label === 'user-submission') return 'Needs review';
  if (label === 'approved-private-use' || label === 'approved-public-projection') return 'Reviewed';
  if (label === 'approximate-centroid' || label === 'sample-map-data' || label === 'not-legal-boundary') {
    return 'Public baseline';
  }
  return 'Needs review';
}

export function getPublicAuthorityLabel(label: AuthorityPosture): string {
  return PUBLIC_AUTHORITY_LABELS[label];
}

export function formatTrustBadgeState(state: string): { display: string; ariaLabel: string } {
  const normalized = normalizeAuthorityPosture(state);
  if (normalized) {
    const display = toStudioTrustPosture(normalized);
    return { display, ariaLabel: `Authority state: ${display}` };
  }
  if (STUDIO_TRUST_POSTURES.includes(state as StudioTrustPosture)) {
    return { display: state, ariaLabel: `Authority state: ${state}` };
  }
  return { display: state, ariaLabel: `Authority state: ${state}` };
}

const STATUS_BADGE_VOCABULARY: Record<string, { display: string; classSuffix: string }> = {
  'policy-clear': { display: 'Policy clear', classSuffix: 'reviewed' },
  'policy-blocked': { display: 'Policy blocked', classSuffix: 'blocked' },
  'export-gated': { display: 'Export gated', classSuffix: 'blocked' },
  approved: { display: 'Approved', classSuffix: 'approved' },
  'needs-review': { display: 'Needs review', classSuffix: 'needs-review' },
  draft: { display: 'Draft', classSuffix: 'draft' },
  blocked: { display: 'Blocked', classSuffix: 'blocked' },
  pass: { display: 'Pass', classSuffix: 'reviewed' },
  warn: { display: 'Needs review', classSuffix: 'needs-review' },
  overridden: { display: 'Overridden', classSuffix: 'needs-review' },
  reviewed: { display: 'Reviewed', classSuffix: 'reviewed' },
  'candidate-evidence': { display: 'Candidate evidence', classSuffix: 'candidate-evidence' },
  'source-pending': { display: 'Source pending', classSuffix: 'source-pending' },
};

export function formatStatusBadge(status: string): {
  display: string;
  ariaLabel: string;
  classSuffix: string;
} {
  const normalized = status.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  const mapped = STATUS_BADGE_VOCABULARY[normalized];
  if (mapped) {
    return {
      display: mapped.display,
      ariaLabel: `Status: ${mapped.display}`,
      classSuffix: mapped.classSuffix,
    };
  }

  const authority = normalizeAuthorityPosture(status);
  if (authority) {
    const display = getPublicAuthorityLabel(authority);
    return {
      display,
      ariaLabel: `Status: ${display}`,
      classSuffix: authority,
    };
  }

  const fallbackSuffix = status.toLowerCase().replace(/[^a-z]+/g, '-');
  return {
    display: status,
    ariaLabel: `Status: ${status}`,
    classSuffix: fallbackSuffix,
  };
}

export function isExportBlockingPosture(label: AuthorityPosture | StudioTrustPosture): boolean {
  if (label === 'blocked' || label === 'Blocked') return true;
  if (label === 'candidate-evidence' || label === 'Candidate evidence') return true;
  if (label === 'unreviewed' || label === 'Needs review') return true;
  if (label === 'reviewer-required') return true;
  return false;
}
