export type AuthorityPosture =
  | 'public-baseline'
  | 'candidate-evidence'
  | 'reviewed'
  | 'unreviewed'
  | 'blocked'
  | 'model-inferred'
  | 'advisory'
  | 'reviewer-required';

export type StudioTrustPosture =
  | 'Public baseline'
  | 'Candidate evidence'
  | 'Reviewed'
  | 'Needs review'
  | 'Blocked'
  | 'Model inferred';

const PUBLIC_TO_STUDIO: Record<AuthorityPosture, StudioTrustPosture> = {
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
  return PUBLIC_TO_STUDIO[label];
}

export function isExportBlockingPosture(label: AuthorityPosture | StudioTrustPosture): boolean {
  if (label === 'blocked' || label === 'Blocked') return true;
  if (label === 'candidate-evidence' || label === 'Candidate evidence') return true;
  if (label === 'unreviewed' || label === 'Needs review') return true;
  if (label === 'reviewer-required') return true;
  return false;
}
