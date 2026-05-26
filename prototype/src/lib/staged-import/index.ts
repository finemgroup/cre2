export type MockUploadFile = {
  id: string;
  name: string;
  type: 'OM' | 'Rent roll' | 'T12';
  status: 'validated' | 'extracting' | 'needs review' | 'blocked';
  progress: number;
  issue?: string;
};

export type CandidateField = {
  field: string;
  value: string;
  source: string;
  confidence: 'High' | 'Medium' | 'Low';
  issue?: string;
};

export type NormalizationCandidateRow = {
  id: string;
  field: string;
  extracted: string;
  normalized: string;
  source: string;
  confidence: 'High' | 'Medium' | 'Low';
  posture: string;
};

export const mockUploadFiles: MockUploadFile[] = [
  { id: 'om', name: 'Offering memorandum.pdf', type: 'OM', status: 'needs review', progress: 86 },
  { id: 'rr', name: 'Rent roll.xlsx', type: 'Rent roll', status: 'validated', progress: 100 },
  {
    id: 't12',
    name: 'T12.pdf',
    type: 'T12',
    status: 'extracting',
    progress: 64,
    issue: 'Scan quality requires review.',
  },
];

export const mockCandidateFields: CandidateField[] = [
  { field: 'Purchase price', value: '$42,500,000', source: 'OM page 4', confidence: 'High' },
  { field: 'Unit count', value: '196', source: 'Rent roll', confidence: 'High' },
  {
    field: 'Vacancy',
    value: '4.5%',
    source: 'Rent roll',
    confidence: 'Medium',
    issue: 'Needs rent-roll citation confirmation.',
  },
  { field: 'T12 NOI', value: '$2,900,000', source: 'T12 page 2', confidence: 'Medium' },
];

export const mockNormalizationCandidates: NormalizationCandidateRow[] = [
  {
    id: 'unit-count',
    field: 'Unit count',
    extracted: '194 / 196 conflict',
    normalized: '195 held',
    source: 'OM + Rent roll',
    confidence: 'Medium',
    posture: 'Blocked',
  },
  {
    id: 't12-revenue',
    field: 'T12 revenue',
    extracted: '$7.52M',
    normalized: '$7.52M',
    source: 'T12 page 1',
    confidence: 'High',
    posture: 'Reviewed',
  },
  {
    id: 'property-taxes',
    field: 'Property taxes',
    extracted: '$315k',
    normalized: '$315k',
    source: 'County tax record',
    confidence: 'High',
    posture: 'Reviewed',
  },
  {
    id: 'insurance-premium',
    field: 'Insurance premium',
    extracted: '$185k estimate',
    normalized: '$185k',
    source: 'Broker estimate',
    confidence: 'Low',
    posture: 'Source pending',
  },
];
