import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { ExportReadinessCard } from '@/components/report-governance/ReportGovernanceCards';
import {
  DEFAULT_UNDERWRITING_ASSUMPTIONS,
  buildSensitivityGrid,
  calculateUnderwritingMetrics,
  evaluateUnderwritingGates,
} from '@/lib/underwriting';
import { mockSourceBlocks } from '@/lib/source-bundle';
import { evaluateExportReadiness } from '@/lib/report-governance';
import { reportSections } from '@/data/studio';

describe('CRE harvest underwriting adapters', () => {
  it('calculates formula-backed underwriting metrics', () => {
    const metrics = calculateUnderwritingMetrics(DEFAULT_UNDERWRITING_ASSUMPTIONS);
    expect(metrics.noi).toBeGreaterThan(0);
    expect(metrics.dscr).toBeGreaterThan(1);
    expect(metrics.equityMultiple).toBeGreaterThan(1);
  });

  it('builds sensitivity cells for price and exit cap assumptions', () => {
    const grid = buildSensitivityGrid(DEFAULT_UNDERWRITING_ASSUMPTIONS);
    expect(grid.rows).toHaveLength(5);
    expect(grid.columns).toHaveLength(5);
    expect(grid.cells[0][0].irr).toBeGreaterThan(0);
  });

  it('evaluates review gates from metrics and comp readiness', () => {
    const metrics = calculateUnderwritingMetrics(DEFAULT_UNDERWRITING_ASSUMPTIONS);
    const gates = evaluateUnderwritingGates(DEFAULT_UNDERWRITING_ASSUMPTIONS, metrics, 1);
    expect(gates.some((gate) => gate.status === 'WARN')).toBe(true);
    expect(gates.map((gate) => gate.id)).toContain('GATE_UW_DSCR');
  });
});

describe('CRE harvest provenance and report governance adapters', () => {
  it('renders source bundle posture with blocked actions', () => {
    render(<ReviewPostureBanner blocks={mockSourceBlocks} />);
    expect(screen.getByText(/Source bundle posture/i)).toBeInTheDocument();
    expect(screen.getByText(/White-label delivery/i)).toBeInTheDocument();
  });

  it('explains why report export is blocked', () => {
    render(<ExportReadinessCard sections={reportSections} sourceBlocks={mockSourceBlocks} />);
    expect(screen.getByText(/Export remains disabled/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeDisabled();
  });

  it('evaluates readiness from passed source blocks instead of hidden global state', () => {
    const readiness = evaluateExportReadiness(
      [{ id: 'summary', name: 'Executive summary', status: 'Approved' }],
      []
    );

    expect(readiness.ready).toBe(false);
    expect(readiness.blockedReasons[0]).toMatch(/no evidence blocks/i);
  });
});
