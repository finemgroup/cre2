import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { DealContextStrip } from '@/components/workflow/DealContextStrip';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { DealWorkflowTabs } from '@/pages/studio/StudioShared';
import { getStudioDealView } from '@/lib/runtime/studio-workspace';

describe('Wave 11 UX closeout', () => {
  it('renders deal context strip with advisory posture copy', () => {
    render(
      <MemoryRouter initialEntries={['/studio/deals/riverside-flats/underwriting']}>
        <DealContextStrip dealId="riverside-flats" dealName="Riverside Flats" />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Deal cockpit context')).toBeInTheDocument();
    expect(screen.getByText('Riverside Flats')).toBeInTheDocument();
    expect(screen.getByText(/Stage:/i)).toBeInTheDocument();
    expect(screen.getByText(/never authorizes export/i)).toBeInTheDocument();
  });

  it('renders grouped deal workflow navigation', () => {
    const deal = getStudioDealView('riverside-flats')!.deal;

    render(
      <MemoryRouter initialEntries={['/studio/deals/riverside-flats/underwriting']}>
        <DealWorkflowTabs deal={deal} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Deal workflow sections')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Core workflow links' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Evidence workflow links' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Model workflow links' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Delivery workflow links' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Underwriting' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('renders intake and source-trace contextual triggers', () => {
    const { rerender } = render(
      <MemoryRouter>
        <ContextualSurfaceTriggers dealId="riverside-flats" route="intake" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Normalization workbench/i })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ContextualSurfaceTriggers dealId="riverside-flats" route="source-trace" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Underwriting cockpit/i })).toBeInTheDocument();
  });
});
