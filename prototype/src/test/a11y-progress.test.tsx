import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { RouteProgress } from '@/components/layout/RouteProgress';
import { StageRail } from '@/components/ui/StageRail';
import { AccessibleBarChart } from '@/components/visualization/AccessibleBarChart';

describe('accessibility progress semantics', () => {
  it('keeps route progress decorative without progressbar semantics', () => {
    render(
      <MemoryRouter initialEntries={['/upload']}>
        <RouteProgress />
      </MemoryRouter>
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('marks the active workflow stage with aria-current=step', () => {
    render(<StageRail stages={['Select files', 'Terms', 'Upload', 'Candidate']} activeIndex={2} />);

    const steps = screen.getAllByRole('listitem');
    expect(steps[2]).toHaveAttribute('aria-current', 'step');
    expect(steps[0]).not.toHaveAttribute('aria-current');
  });

  it('exposes chart values in a data table and summary label', async () => {
    const { container } = render(
      <AccessibleBarChart
        title="IRR by scenario"
        caption="IRR by scenario"
        items={[
          { id: 'base', label: 'Base Case', value: '14.8%', ratio: 0.8 },
          { id: 'upside', label: 'Upside', value: '16.2%', ratio: 1 },
        ]}
      />
    );

    expect(screen.getByRole('img', { name: /IRR by scenario/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /IRR by scenario values/i })).toBeInTheDocument();
    expect(screen.getAllByText('16.2%').length).toBeGreaterThan(0);
    expect(await axe(container)).toHaveNoViolations();
  });
});
