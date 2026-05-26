import type { EvidenceTraceItem } from '@/components/workstation/UnderwritingWorkstationPrimitives';

const OPEN_POSTURES = new Set([
  'Blocked',
  'Source pending',
  'Reviewer required',
  'Candidate evidence',
]);

export function summarizeEvidenceTracePosture(items: EvidenceTraceItem[]) {
  const reviewed = items.filter((item) => item.posture === 'Reviewed').length;
  const open = items.filter((item) => OPEN_POSTURES.has(item.posture)).length;
  return {
    reviewed,
    open,
    total: items.length,
  };
}
