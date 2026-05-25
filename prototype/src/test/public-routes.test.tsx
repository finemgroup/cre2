import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/test/renderRoute';

describe('public Sophex routes', () => {
  it('renders the public shell without basic accessibility violations', async () => {
    const { container } = await renderRoute('/');
    expect(
      screen.getByRole('heading', { name: /Evidence-first property intelligence/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Start with a market or address/i })
    ).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('searches sample properties and keeps property links route-scoped', async () => {
    const user = userEvent.setup();
    await renderRoute('/');

    await user.type(screen.getByLabelText(/Property or market/i), 'Austin');
    await user.click(screen.getByRole('button', { name: /^Search$/ }));

    expect(screen.getAllByRole('link', { name: /View property/i })[0]).toHaveAttribute(
      'href',
      '/property/demo-001'
    );
  });

  it('shows an empty-state message when search returns no matches', async () => {
    const user = userEvent.setup();
    await renderRoute('/');

    await user.type(screen.getByLabelText(/Property or market/i), 'zzzz-no-match');
    await user.click(screen.getByRole('button', { name: /^Search$/ }));

    expect(screen.getByRole('heading', { name: /No sample matches/i })).toBeInTheDocument();
  });

  it('keeps the selected property context through comps and report links', async () => {
    await renderRoute('/property/demo-002');

    expect(screen.getByRole('heading', { name: /4400 Research Blvd/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Compare comps/i })).toHaveAttribute(
      'href',
      '/property/demo-002/comps'
    );
    expect(screen.getByRole('link', { name: /Preview report/i })).toHaveAttribute(
      'href',
      '/report/demo-002'
    );
  });

  it('labels comps with the active subject property', async () => {
    await renderRoute('/property/demo-002/comps');
    expect(screen.getByText(/Sample comp set for 4400 Research Blvd/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Preview report for 4400 Research Blvd/i })
    ).toHaveAttribute('href', '/report/demo-002');
  });

  it('opens the public evidence drawer with prototype feedback', async () => {
    const user = userEvent.setup();
    await renderRoute('/property/demo-001');
    await user.click(screen.getByRole('button', { name: /View evidence drawer/i }));
    expect(screen.getByText(/Public evidence drawer is simulated/i)).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /Evidence drawer/i })).toBeInTheDocument();
  });

  it('shows prototype feedback when selecting a public upload file', async () => {
    const user = userEvent.setup();
    await renderRoute('/upload');
    await user.upload(
      screen.getByLabelText(/Drag lease/i),
      new File(['sample'], 'rent-roll.pdf', { type: 'application/pdf' })
    );
    expect(screen.getByText(/Public document upload is simulated/i)).toBeInTheDocument();
  });

  it('runs upload as an exclusive stage flow with progress semantics', async () => {
    const user = userEvent.setup();
    await renderRoute('/upload');

    await user.upload(screen.getByLabelText(/Drag lease/i), new File(['sample'], 'rent-roll.pdf'));
    await user.click(screen.getByRole('checkbox', { name: /source-use/i }));
    await user.click(screen.getByRole('button', { name: /Start upload/i }));

    expect(screen.getByRole('progressbar', { name: /Uploading sample document/i })).toHaveAttribute(
      'aria-valuetext',
      '0% complete'
    );
    expect(screen.queryByRole('button', { name: /Start upload/i })).not.toBeInTheDocument();
  });

  it('sets document titles for public routes', async () => {
    await renderRoute('/upload');
    expect(document.title).toBe('Upload Documents - Sophex');
  });

  it('derives export blockers from report governance readiness', async () => {
    await renderRoute('/export/demo-001');
    const blockers = screen.getByRole('list', { name: /Export blockers/i });

    expect(within(blockers).getByText(/Comparable Sales is review required/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate export/i })).toBeDisabled();
  });

  it('opens the export governance modal from the export page', async () => {
    const user = userEvent.setup();
    await renderRoute('/export/demo-001');

    await user.click(screen.getByRole('button', { name: /Review blockers/i }));
    expect(screen.getByRole('dialog', { name: /Export blocked/i })).toBeInTheDocument();
  });

  it('renders explicit route guards for missing pages and properties', async () => {
    await renderRoute('/property/not-real');
    expect(screen.getByRole('heading', { name: /Property not found/i })).toBeInTheDocument();

    await renderRoute('/not-a-route');
    expect(screen.getByRole('heading', { name: /Page not found/i })).toBeInTheDocument();
  });

  it('shows a route guard when comps are opened without a property id', async () => {
    await renderRoute('/comps');
    expect(
      screen.getByRole('heading', { name: /Comp comparison unavailable/i })
    ).toBeInTheDocument();
  });

  it('links public properties to linked Studio deals', async () => {
    await renderRoute('/property/demo-002');
    expect(screen.getByRole('link', { name: /Open linked Studio deal/i })).toHaveAttribute(
      'href',
      '/studio/deals/1200-tech'
    );
  });

  it('shows public trust footer links', async () => {
    await renderRoute('/');
    expect(screen.getByRole('navigation', { name: /Trust and legal/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Source trust tiers/i })).toBeInTheDocument();
  });
});
