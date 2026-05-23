export type PropertyRecord = {
  id: string;
  address: string;
  market: string;
  assetType: string;
  capRate: string;
  authority: 'public-baseline' | 'model-inferred';
};

export type CompRecord = {
  id: string;
  name: string;
  distanceMi: number;
  capRate: string;
  authority: 'public-baseline' | 'candidate-evidence' | 'blocked';
  note?: string;
};

export type ReportSection = {
  id: string;
  title: string;
  status: 'ready' | 'review-required' | 'blocked';
  citation: string;
};

export const mockProperties: PropertyRecord[] = [
  {
    id: 'demo-001',
    address: '1200 Commerce St',
    market: 'Austin, TX',
    assetType: 'Retail NNN',
    capRate: '6.1%',
    authority: 'public-baseline',
  },
  {
    id: 'demo-002',
    address: '4400 Research Blvd',
    market: 'Austin, TX',
    assetType: 'Office',
    capRate: '7.4%',
    authority: 'model-inferred',
  },
];

export const mockComps: CompRecord[] = [
  {
    id: 'comp-1',
    name: 'Circle K — North Lamar',
    distanceMi: 1.2,
    capRate: '5.9%',
    authority: 'public-baseline',
  },
  {
    id: 'comp-2',
    name: 'Strip Center — Burnet Rd',
    distanceMi: 2.4,
    capRate: '6.4%',
    authority: 'candidate-evidence',
    note: 'Contributor upload — candidate only',
  },
  {
    id: 'comp-3',
    name: 'Provider-restricted comp',
    distanceMi: 0.8,
    capRate: '—',
    authority: 'blocked',
    note: 'Omitted from public comparison',
  },
];

export const mockReportSections: ReportSection[] = [
  {
    id: 'summary',
    title: 'Executive summary',
    status: 'ready',
    citation: 'Public baseline + 2 comps',
  },
  {
    id: 'comps',
    title: 'Comp set',
    status: 'review-required',
    citation: '1 candidate comp pending review',
  },
  { id: 'map', title: 'Regional context', status: 'ready', citation: 'Sample aggregate layer' },
  {
    id: 'export',
    title: 'Export eligibility',
    status: 'blocked',
    citation: 'Review and consent required',
  },
];
