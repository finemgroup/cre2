import { screen, waitFor, within } from '@testing-library/react';
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
    expect(screen.getByRole('link', { name: /Open spatial workbench/i })).toHaveAttribute(
      'href',
      '/studio/deals/1200-tech/spatial'
    );
  });

  it('labels comps with the active subject property', async () => {
    await renderRoute('/property/demo-002/comps');
    expect(screen.getByText(/Sample comp set for 4400 Research Blvd/i)).toBeInTheDocument();
    expect(screen.getByText(/Comp set readiness/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Preview report for 4400 Research Blvd/i })
    ).toHaveAttribute('href', '/report/demo-002');
    expect(screen.getByRole('heading', { name: /Map context fallback/i })).toBeInTheDocument();
  });

  it('opens the public evidence drawer with prototype feedback', async () => {
    const user = userEvent.setup();
    await renderRoute('/property/demo-001');
    await user.click(screen.getByRole('button', { name: /View evidence drawer/i }));
    expect(screen.getByText(/Public evidence drawer is simulated/i)).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /Evidence drawer/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Source ref/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/As of/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Field evidence/i })).toBeInTheDocument();
  });

  it('shows spatial provenance labels and a non-map fallback on property pages', async () => {
    await renderRoute('/property/demo-001');

    expect(screen.getByText(/Public ↔ Studio continuity/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sample map data/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Approximate centroid/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Not legal boundary/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Map facts as list/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Map layer controls/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Sample map layer/i })).toBeInTheDocument();
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

    expect(
      screen
        .getByRole('progressbar', { name: /Uploading rent-roll\.pdf/i })
        .getAttribute('aria-valuetext')
    ).toMatch(/\d+% complete/);
    expect(screen.queryByRole('button', { name: /Start upload/i })).not.toBeInTheDocument();
  });

  it('renders candidate evidence metadata and upload receipt after completion', async () => {
    const user = userEvent.setup();
    await renderRoute('/upload');

    await user.upload(screen.getByLabelText(/Drag lease/i), new File(['sample'], 'rent-roll.pdf'));
    await user.click(screen.getByRole('checkbox', { name: /source-use/i }));
    await user.click(screen.getByRole('button', { name: /Start upload/i }));

    await waitFor(() => expect(screen.getByText(/Upload receipt:/i)).toBeInTheDocument(), {
      timeout: 1500,
    });
    expect(screen.getByText(/Candidate evidence created for review/i)).toBeInTheDocument();
  });

  it('shows linked studio deal context on report preview', async () => {
    await renderRoute('/report/demo-002');
    expect(screen.getByText(/Linked Studio deal:/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /1200-tech/i })).toHaveAttribute(
      'href',
      '/studio/deals/1200-tech/underwriting'
    );
  });

  it('sets document titles for public routes', async () => {
    await renderRoute('/upload');
    expect(document.title).toBe('Upload Documents - Sophex');

    await renderRoute('/property/demo-001');
    expect(document.title).toBe('Property Intelligence - 1200 Commerce St - Sophex');

    await renderRoute('/property/demo-001/comps');
    expect(document.title).toBe('Comparable Sales - 1200 Commerce St - Sophex');

    await renderRoute('/report/demo-001');
    expect(document.title).toBe('Report Preview - 1200 Commerce St - Sophex');
  });

  it('renders report preview sections with authority posture', async () => {
    await renderRoute('/report/demo-001');

    expect(
      screen.getByRole('heading', { name: /Report for 1200 Commerce St/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Readiness rail/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Review required before export/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: /Mark section reviewed/i }).length
    ).toBeGreaterThan(0);
  });

  it('opens comp detail when inspecting a permitted comp row', async () => {
    const user = userEvent.setup();
    await renderRoute('/property/demo-001/comps');

    const inspectButtons = screen.getAllByRole('button', { name: /^Inspect$/i });
    const enabledInspect = inspectButtons.find((button) => !button.hasAttribute('disabled'));
    expect(enabledInspect).toBeDefined();
    await user.click(enabledInspect!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders report and export routes without basic accessibility violations', async () => {
    const report = await renderRoute('/report/demo-001');
    expect(await axe(report.container)).toHaveNoViolations();

    const exportPage = await renderRoute('/export/demo-001');
    expect(await axe(exportPage.container)).toHaveNoViolations();
  });

  it('derives distinct export blockers for linked property contexts', async () => {
    await renderRoute('/export/demo-002');
    expect(screen.getByRole('heading', { name: /4400 Research Blvd/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate export/i })).toBeDisabled();
  });

  it('derives export blockers from report governance readiness', async () => {
    await renderRoute('/export/demo-001');
    const blockers = screen.getByRole('list', { name: /Export blockers/i });

    expect(within(blockers).getByText(/consent/i)).toBeInTheDocument();
    expect(within(blockers).getByText(/source-rights/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate export/i })).toBeDisabled();
  });

  it('generates a redacted preview receipt from the export policy', async () => {
    const user = userEvent.setup();
    await renderRoute('/export/demo-001');

    await user.click(screen.getByRole('radio', { name: /preview/i }));
    await user.click(screen.getByRole('button', { name: /Generate export receipt/i }));

    await waitFor(() => expect(screen.getByText(/Redacted evidence refs/i)).toBeInTheDocument(), {
      timeout: 1500,
    });
    expect(screen.getByText(/Export manifest/i)).toBeInTheDocument();
    expect(screen.getByText(/draft-preview/i)).toBeInTheDocument();
  });

  it('switches the prototype actor context without exposing private values', async () => {
    const user = userEvent.setup();
    await renderRoute('/property/demo-001');

    await user.selectOptions(screen.getByLabelText(/Prototype actor context/i), 'sourceOwner');
    expect(screen.getByText(/Public records aggregate/i)).toBeInTheDocument();
    expect(screen.queryByText(/private rent roll/i)).not.toBeInTheDocument();
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
    expect(screen.getByRole('link', { name: /Underwrite in Studio/i })).toHaveAttribute(
      'href',
      '/studio/deals/1200-tech/intake'
    );
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

  it('shows prototype feedback for public trust footer anchors', async () => {
    const user = userEvent.setup();
    await renderRoute('/');

    await user.click(screen.getByRole('link', { name: /Source trust tiers/i }));
    expect(screen.getByText(/Source trust tiers is simulated/i)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /Privacy \(prototype\)/i }));
    expect(screen.getByText(/Privacy policy is simulated/i)).toBeInTheDocument();
  });

  it('shows prototype feedback when marking a report section reviewed', async () => {
    const user = userEvent.setup();
    await renderRoute('/report/demo-001');

    await user.click(screen.getAllByRole('button', { name: /Mark section reviewed/i })[0]);
    expect(screen.getByText(/Mark section reviewed is simulated/i)).toBeInTheDocument();
  });
});
