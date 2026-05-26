import type { NormalizationCandidateRow } from '@/lib/staged-import';

const OPEN_POSTURES = new Set([
  'Blocked',
  'Source pending',
  'Candidate evidence',
  'Reviewer required',
]);

export function summarizeNormalizationPosture(rows: NormalizationCandidateRow[]) {
  const reviewed = rows.filter((row) => row.posture === 'Reviewed').length;
  const blocked = rows.filter((row) => row.posture === 'Blocked').length;
  const open = rows.filter((row) => OPEN_POSTURES.has(row.posture)).length;
  return {
    reviewed,
    blocked,
    open,
    total: rows.length,
  };
}
