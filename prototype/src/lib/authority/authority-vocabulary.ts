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

export type StudioTrustPosture =
  | 'Public baseline'
  | 'Candidate evidence'
  | 'Reviewed'
  | 'Needs review'
  | 'Blocked'
  | 'Model inferred';

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
  const normalizedKey = state.toLowerCase().replace(/[^a-z]+/g, '-') as AuthorityPosture;
  if (normalizedKey in PUBLIC_AUTHORITY_LABELS) {
    const display = toStudioTrustPosture(normalizedKey);
    return { display, ariaLabel: `Authority state: ${display}` };
  }
  return { display: state, ariaLabel: `Authority state: ${state}` };
}

export function isExportBlockingPosture(label: AuthorityPosture | StudioTrustPosture): boolean {
  if (label === 'blocked' || label === 'Blocked') return true;
  if (label === 'candidate-evidence' || label === 'Candidate evidence') return true;
  if (label === 'unreviewed' || label === 'Needs review') return true;
  if (label === 'reviewer-required') return true;
  return false;
}
