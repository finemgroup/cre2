export type SourceCitation = {
  id: string;
  label: string;
  sourceType: 'OM' | 'Rent roll' | 'T12' | 'Comp set' | 'Model';
  page?: number;
  confidence: 'High' | 'Medium' | 'Low';
  visibility: 'Public' | 'Org-private' | 'Premium-private' | 'Candidate-only';
};

export type SourceEvidenceBlock = {
  id: string;
  title: string;
  posture: 'ready' | 'degraded' | 'blocked';
  citations: SourceCitation[];
  missingCitations?: string[];
  notes: string;
};

export type SourceBundleSummary = {
  posture: 'ready' | 'degraded' | 'blocked';
  citationCount: number;
  blockedActions: string[];
  warnings: string[];
};

export function summarizeSourceBundle(blocks: SourceEvidenceBlock[]): SourceBundleSummary {
  const citationCount = blocks.reduce((total, block) => total + block.citations.length, 0);
  const warnings = blocks.flatMap((block) => block.missingCitations ?? []);
  const blocked = blocks.some((block) => block.posture === 'blocked');
  const degraded = warnings.length > 0 || blocks.some((block) => block.posture === 'degraded');

  return {
    posture: blocked ? 'blocked' : degraded ? 'degraded' : 'ready',
    citationCount,
    warnings,
    blockedActions: blocked || degraded ? ['Export PDF', 'Client share link', 'White-label delivery'] : [],
  };
}

export const mockSourceBlocks: SourceEvidenceBlock[] = [
  {
    id: 'om-summary',
    title: 'Offering Memorandum',
    posture: 'degraded',
    notes: 'Purchase price and unit count are candidate evidence until source review clears.',
    citations: [
      { id: 'om-1', label: 'OM page 4 - Executive summary', sourceType: 'OM', page: 4, confidence: 'High', visibility: 'Candidate-only' },
      { id: 'om-2', label: 'OM page 12 - Unit mix', sourceType: 'OM', page: 12, confidence: 'Medium', visibility: 'Candidate-only' },
    ],
    missingCitations: ['Tax reassessment source still missing.'],
  },
  {
    id: 'rent-roll',
    title: 'Rent Roll',
    posture: 'ready',
    notes: 'Rent roll supports vacancy and unit count assumptions for prototype review.',
    citations: [
      { id: 'rr-1', label: 'Rent roll tab - occupied units', sourceType: 'Rent roll', confidence: 'High', visibility: 'Org-private' },
    ],
  },
  {
    id: 'comp-set',
    title: 'Comparable Sales',
    posture: 'blocked',
    notes: 'Premium-private comp cannot be exported into public/client-facing report output.',
    citations: [
      { id: 'comp-1', label: 'Reviewed comp set v0.3', sourceType: 'Comp set', confidence: 'Medium', visibility: 'Premium-private' },
    ],
    missingCitations: ['Provider-restricted comp must be removed or summarized before export.'],
  },
];
