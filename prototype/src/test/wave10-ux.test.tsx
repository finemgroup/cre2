import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';

describe('Wave 10 UX polish', () => {
  it('renders route-specific contextual surface triggers', () => {
    render(
      <MemoryRouter>
        <ContextualSurfaceTriggers dealId="riverside-flats" route="scenarios" />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Advanced surfaces for this stage/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Valuation snapshots/i })).toHaveAttribute(
      'href',
      '/studio/deals/riverside-flats/versions'
    );
    expect(screen.getByText(/do not authorize export/i)).toBeInTheDocument();
  });

  it('includes public export handoff for report builder route', () => {
    render(
      <MemoryRouter>
        <ContextualSurfaceTriggers
          dealId="riverside-flats"
          route="report-builder"
          propertyId="demo-001"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Public export gate/i })).toHaveAttribute(
      'href',
      '/export/demo-001'
    );
  });

  it('renders overview and spatial contextual handoffs', () => {
    const { rerender } = render(
      <MemoryRouter>
        <ContextualSurfaceTriggers dealId="riverside-flats" route="overview" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Underwriting cockpit/i })).toHaveAttribute(
      'href',
      '/studio/deals/riverside-flats/underwriting'
    );

    rerender(
      <MemoryRouter>
        <ContextualSurfaceTriggers dealId="riverside-flats" route="spatial" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Report builder/i })).toHaveAttribute(
      'href',
      '/studio/reports/riverside-flats/builder'
    );
  });

  it('renders evidence and scenario mock boundary banners', () => {
    const { rerender } = render(<MockBoundaryBanner variant="evidence" />);
    expect(screen.getByText(/CANDIDATE EVIDENCE/i)).toBeInTheDocument();

    rerender(<MockBoundaryBanner variant="scenario" />);
    expect(screen.getByText(/SCENARIO ADVISORY/i)).toBeInTheDocument();
  });
});
