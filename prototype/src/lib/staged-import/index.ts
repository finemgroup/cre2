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
