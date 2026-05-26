import type { EvidenceMetadataItem } from '@/components/evidence/EvidenceMetadataList';
import type {
  ConflictOption,
  EvidenceTraceItem,
  ReadinessRailItem,
  VersionSnapshot,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';

export const DEAL_DOCUMENT_EVIDENCE: EvidenceMetadataItem[] = [
  {
    label: 'Offering memorandum.pdf',
    value: 'Purchase price and unit mix extracted as candidate fields',
    authorityLabel: 'Candidate evidence',
    safeExplanation: 'Document bytes stay prototype-only until review clears source-use.',
    sourceId: 'doc-om-riverside-flats',
    asOf: '2026-05-22',
  },
  {
    label: 'Rent roll.xlsx',
    value: 'Occupied units and in-place rents staged for analyst review',
    authorityLabel: 'Reviewed',
    safeExplanation: 'Reviewed org-private rent roll supports underwriting assumptions only.',
    sourceId: 'doc-rent-roll-riverside-flats',
    asOf: '2026-05-21',
  },
  {
    label: 'T12.pdf',
    value: 'Operating statement normalized to prototype expense categories',
    authorityLabel: 'Candidate evidence',
    safeExplanation: 'Expense normalization remains advisory until reviewer signoff.',
    sourceId: 'doc-t12-riverside-flats',
    asOf: '2026-05-19',
  },
];

export const ASSUMPTION_TRACE_ITEMS: EvidenceTraceItem[] = [
  {
    id: 'unit-count',
    label: 'Unit count',
    value: '195 units',
    posture: 'Blocked',
    sourceRef: 'OM p.14 / RentRoll p.1',
    asOf: '2026-05-22',
    confidence: 'Medium',
    detail: 'Offering memorandum and rent roll disagree; senior reviewer resolution is required.',
  },
  {
    id: 'exit-cap',
    label: 'Exit cap rate',
    value: '5.75%',
    posture: 'Candidate evidence',
    sourceRef: 'CompSet-Austin-MF-05',
    asOf: '2026-05-20',
    confidence: 'Medium',
    detail: 'Candidate market-comp evidence supports the current exit cap assumption.',
  },
  {
    id: 't12-noi',
    label: 'T12 NOI',
    value: '$2.9M',
    posture: 'Reviewed',
    sourceRef: 'T12_Normalized_04',
    asOf: '2026-05-19',
    confidence: 'High',
    detail: 'Reviewed normalization supports current NOI calculation inputs.',
  },
  {
    id: 'debt-service',
    label: 'Debt service',
    value: '$2.3M',
    posture: 'Source pending',
    sourceRef: 'Lender quote missing',
    asOf: 'Pending',
    confidence: 'Low',
    detail: 'Awaiting lender quote review before DSCR can clear export gates.',
  },
];

export const UNIT_CONFLICT_OPTIONS: ConflictOption[] = [
  {
    id: 'om',
    source: 'Offering Memorandum',
    value: '196',
    sourceRef: 'OM p.14',
    asOf: '2026-05-20',
    confidence: 'High',
  },
  {
    id: 'rent-roll',
    source: 'Rent Roll',
    value: '194',
    sourceRef: 'RentRoll p.1',
    asOf: '2026-05-21',
    confidence: 'Medium',
  },
  {
    id: 'analyst',
    source: 'Analyst Override',
    value: '195',
    sourceRef: 'J. Doe note',
    asOf: '2026-05-22',
    confidence: 'Low',
  },
];

export const VERSION_SNAPSHOTS: VersionSnapshot[] = [
  {
    id: 'v0.3',
    label: 'IC-Ready Draft',
    actor: 'Sarah Jenkins (VP)',
    createdAt: '2026-05-25 14:30',
    gateStatus: 'Cleared for IC',
    evidenceRef: 'EVID-SNAP-992',
    scenarioSet: 'Base + Conservative Refi',
    current: true,
  },
  {
    id: 'v0.2',
    label: 'Analyst Reviewed',
    actor: 'Mike Chen (Analyst)',
    createdAt: '2026-05-24 09:15',
    gateStatus: 'Analyst sign-off',
    evidenceRef: 'EVID-SNAP-991',
    scenarioSet: 'Base only',
  },
  {
    id: 'v0.1',
    label: 'Draft',
    actor: 'System Auto-Gen',
    createdAt: '2026-05-22 16:45',
    gateStatus: 'Pending review',
    evidenceRef: 'EVID-SNAP-980',
    scenarioSet: 'Default processing',
  },
];

export const READINESS_ITEMS: ReadinessRailItem[] = [
  {
    id: 'assumptions',
    label: 'Assumptions',
    status: 'warning',
    detail: 'Two candidate values need reviewer confirmation.',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    status: 'blocked',
    detail: 'Lender quote and unit count conflict unresolved.',
  },
  {
    id: 'scenarios',
    label: 'Scenarios',
    status: 'warning',
    detail: 'Scenario output remains advisory until gates clear.',
  },
  {
    id: 'review',
    label: 'Review',
    status: 'pending',
    detail: 'Senior reviewer signoff required before export.',
  },
];
