export type AuthorityState =
  | 'Public baseline'
  | 'Candidate evidence'
  | 'Reviewed'
  | 'Premium-private'
  | 'Blocked'
  | 'Model-inferred';

export type DealStage = 'Screening' | 'Underwriting' | 'IC Review' | 'Report Draft';

export type Deal = {
  id: string;
  name: string;
  address: string;
  market: string;
  assetClass: string;
  stage: DealStage;
  value: string;
  noi: string;
  capRate: string;
  status: string;
  authority: AuthorityState;
};

export type Comp = {
  id: string;
  name: string;
  distance: string;
  units: number;
  year: number;
  salePrice: string;
  pricePerUnit: string;
  capRate: string;
  authority: AuthorityState;
};

export type Scenario = {
  id: string;
  name: string;
  irr: string;
  equityMultiple: string;
  exitCap: string;
  status: string;
};

export type ReportSection = {
  id: string;
  name: string;
  status: 'Approved' | 'Needs review' | 'Draft';
  citationCount: number;
};

export type BrandConfig = {
  company: string;
  supportEmail: string;
  primaryColor: string;
  accentColor: string;
  domain: string;
  disclaimer: string;
  footer: string;
};

export type AgentCapability = {
  id: string;
  name: string;
  description: string;
  status: 'Online' | 'Standby';
  tags: string[];
};

export type JobStatusProjection = {
  id: string;
  type: string;
  status: 'Running' | 'Complete' | 'Needs review' | 'Blocked';
  duration: string;
};

export const studioNavItems = [
  { label: 'Dashboard', href: '/studio/dashboard', icon: 'dashboard' },
  { label: 'Deal Intake', href: '/studio/deal-intake', icon: 'add_box' },
  { label: 'Deals', href: '/studio/deals/riverside-flats', icon: 'business_center' },
  { label: 'Comps', href: '/studio/deals/riverside-flats/comps', icon: 'analytics' },
  { label: 'Underwriting', href: '/studio/deals/riverside-flats/underwriting', icon: 'calculate' },
  { label: 'Reports', href: '/studio/reports/riverside-flats/builder', icon: 'assessment' },
  { label: 'Settings', href: '/studio/settings/white-label', icon: 'settings' },
];

export const deals: Deal[] = [
  {
    id: 'riverside-flats',
    name: 'Riverside Flats',
    address: '2400 East Riverside Dr',
    market: 'Austin, TX',
    assetClass: 'Multifamily',
    stage: 'Underwriting',
    value: '$42.5M',
    noi: '$2.9M',
    capRate: '5.8%',
    status: 'Active',
    authority: 'Candidate evidence',
  },
  {
    id: '1200-tech',
    name: '1200 Tech Boulevard',
    address: '1200 Tech Blvd',
    market: 'Nashville, TN',
    assetClass: 'Office',
    stage: 'IC Review',
    value: '$63.0M',
    noi: '$4.1M',
    capRate: '6.2%',
    status: 'Review',
    authority: 'Model-inferred',
  },
  {
    id: 'canyon-logistics',
    name: 'Canyon Logistics Park',
    address: '8100 Canyon Loop',
    market: 'Phoenix, AZ',
    assetClass: 'Industrial',
    stage: 'Screening',
    value: '$88.0M',
    noi: '$5.7M',
    capRate: '6.5%',
    status: 'New',
    authority: 'Public baseline',
  },
];

export const comps: Comp[] = [
  {
    id: 'comp-1',
    name: 'Eastline Apartments',
    distance: '0.8 mi',
    units: 218,
    year: 2018,
    salePrice: '$48.2M',
    pricePerUnit: '$221k',
    capRate: '5.6%',
    authority: 'Reviewed',
  },
  {
    id: 'comp-2',
    name: 'Lakeshore Commons',
    distance: '1.6 mi',
    units: 184,
    year: 2015,
    salePrice: '$39.9M',
    pricePerUnit: '$217k',
    capRate: '5.9%',
    authority: 'Candidate evidence',
  },
  {
    id: 'comp-3',
    name: 'Southbank Lofts',
    distance: '2.4 mi',
    units: 142,
    year: 2020,
    salePrice: '$36.4M',
    pricePerUnit: '$256k',
    capRate: '5.3%',
    authority: 'Premium-private',
  },
];

export const scenarios: Scenario[] = [
  { id: 'base', name: 'Base Case', irr: '14.8%', equityMultiple: '1.82x', exitCap: '5.75%', status: 'Current' },
  { id: 'upside', name: 'Upside', irr: '18.4%', equityMultiple: '2.05x', exitCap: '5.50%', status: 'Draft' },
  { id: 'downside', name: 'Downside', irr: '10.1%', equityMultiple: '1.42x', exitCap: '6.25%', status: 'Stress' },
  { id: 'renovation', name: 'Renovation Push', irr: '16.7%', equityMultiple: '1.94x', exitCap: '5.65%', status: 'Review' },
];

export const reportSections: ReportSection[] = [
  { id: 'summary', name: 'Executive Summary', status: 'Approved', citationCount: 4 },
  { id: 'market', name: 'Market Overview', status: 'Approved', citationCount: 6 },
  { id: 'comps', name: 'Comparable Sales', status: 'Needs review', citationCount: 8 },
  { id: 'underwriting', name: 'Underwriting Assumptions', status: 'Draft', citationCount: 5 },
];

export const brandConfig: BrandConfig = {
  company: 'Acme Real Estate Partners',
  supportEmail: 'investors@acmecapital.com',
  primaryColor: '#0F172A',
  accentColor: '#2563EB',
  domain: 'investors.acmecapital.com',
  disclaimer:
    'Confidential and proprietary. Do not distribute without explicit permission from Acme Real Estate Partners.',
  footer: '(c) 2024 Acme Real Estate Partners LLC.',
};

export const agentCapabilities: AgentCapability[] = [
  {
    id: 'data-extractor',
    name: 'Data_Extractor_v2',
    description: 'Parses OM PDFs and extracts key financial metrics into structured JSON.',
    status: 'Online',
    tags: ['PDF', 'NLP'],
  },
  {
    id: 'comp-matcher',
    name: 'Comp_Matcher_AI',
    description: 'Queries approved comparable-sale sources based on asset profile.',
    status: 'Online',
    tags: ['API', 'Search'],
  },
  {
    id: 'memo-generator',
    name: 'IC_Memo_Generator',
    description: 'Drafts initial investment committee memos from structured deal data.',
    status: 'Standby',
    tags: ['GenAI', 'Standby'],
  },
];

export const jobStreams: JobStatusProjection[] = [
  { id: 'REQ-8902', type: 'Market_Scrape', status: 'Running', duration: '45s' },
  { id: 'REQ-8901', type: 'Underwrite_Model', status: 'Complete', duration: '1m 12s' },
  { id: 'REQ-8899', type: 'Report_Assembly', status: 'Needs review', duration: '4m 08s' },
];

export const activity = [
  'Riverside Flats rent roll uploaded as candidate evidence.',
  'Comp set refreshed with 2 reviewed and 1 premium-private sale.',
  'Underwriting flags require analyst review before export.',
  'White-label portal preview updated for Acme Real Estate Partners.',
];
