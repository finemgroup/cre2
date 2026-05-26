import { DEFAULT_DEAL_ID } from '@/data/studio';
import { getLinkedDealId } from '@/lib/workflow-identity';

export const PUBLIC_UPLOAD_STAGES = [
  'Select files',
  'Terms',
  'Upload',
  'Candidate',
] as const;

export function getPublicUploadGuideView(propertyId = 'demo-001') {
  return {
    propertyId,
    linkedDealId: getLinkedDealId(propertyId) ?? DEFAULT_DEAL_ID,
    supportedTypes: [
      'Lease abstract',
      'Rent roll',
      'Offering memorandum',
      'T12 operating statement',
    ],
    stages: [...PUBLIC_UPLOAD_STAGES],
    reviewPolicy:
      'Candidate evidence only until source-use, normalization, and reviewer gates clear.',
  };
}

export type PublicUploadGuideView = ReturnType<typeof getPublicUploadGuideView>;
