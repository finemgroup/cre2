import { screen, within, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/test/renderRoute';

describe('accessibility chart alternatives', () => {
  it('exposes underwriting metrics in a non-visual table', async () => {
    await renderRoute('/studio/deals/riverside-flats/underwriting');

    const metricsTable = await waitFor(() =>
      screen.getByRole('table', {
        name: /Base Case calculated metrics/i,
      })
    );
    expect(within(metricsTable).getByRole('rowheader', { name: /^IRR$/i })).toBeInTheDocument();
    const irrRow = within(metricsTable)
      .getAllByRole('row')
      .find((row) => within(row).queryByRole('rowheader', { name: /^IRR$/i }));
    expect(irrRow).toBeDefined();
    expect(within(irrRow!).getByRole('cell').textContent).toMatch(/%/);
  });

  it('provides table fallbacks for scenario comparison charts', async () => {
    await renderRoute('/studio/deals/riverside-flats/scenarios');

    expect(screen.getByRole('table', { name: /Scenario comparison metrics/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /IRR by scenario values/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /Sensitivity grid values/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /IRR by scenario/i })).toBeInTheDocument();
  });

  it('passes axe on the scenario comparison route', async () => {
    const view = await renderRoute('/studio/deals/riverside-flats/scenarios');
    expect(await axe(view.container)).toHaveNoViolations();
  });
});
