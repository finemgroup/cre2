import type { HitlTrustTier } from '@/components/workflow/HitlTrustTierBadge';
import { assessConfidence, type ConfidenceAssessment } from '@/lib/workflow/confidence';

export type ReviewAssignment = {
  id: string;
  field: string;
  reason: string;
  assignee: string;
  queueState: string;
  posture: string;
  trustTier: HitlTrustTier;
  confidence: number;
  resolutionSurface: string;
  confidenceAssessment: ConfidenceAssessment;
};

const BASE_ASSIGNMENTS = [
  {
    id: 'assign-unit-count',
    field: 'Unit count conflict',
    reason: 'OM and rent roll disagree; export blocked until resolved.',
    assignee: 'Sarah Jenkins (VP)',
    queueState: 'Assigned',
    posture: 'Blocked',
    trustTier: 'BLOCK' as const,
    confidence: 36,
    resolutionSurface: 'Evidence workbench',
    blocked: true,
  },
  {
    id: 'assign-lender-quote',
    field: 'Lender quote missing',
    reason: 'DSCR gate requires term sheet citation.',
    assignee: 'Mike Chen (Analyst)',
    queueState: 'Queued',
    posture: 'Source pending',
    trustTier: 'HITL' as const,
    confidence: 58,
    resolutionSurface: 'Debt / lender quote',
    blocked: false,
  },
  {
    id: 'assign-rent-growth',
    field: 'Upside rent growth',
    reason: 'Scenario upside driver remains candidate evidence.',
    assignee: 'Internal operator queue',
    queueState: 'Needs review',
    posture: 'Reviewer required',
    trustTier: 'NOTIFY' as const,
    confidence: 74,
    resolutionSurface: 'Scenario comparison',
    blocked: false,
  },
] as const;

export function getContextualReviewAssignments(): ReviewAssignment[] {
  return BASE_ASSIGNMENTS.map((assignment) => ({
    ...assignment,
    confidenceAssessment: assessConfidence(assignment.confidence, assignment.blocked),
  }));
}
