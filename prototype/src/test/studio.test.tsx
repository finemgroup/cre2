import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { saveOnboardingProfile } from '@/lib/studio/onboarding-profile';
import { renderRoute } from '@/test/renderRoute';

describe('Finem CRE Studio routes', () => {
  it.each([
    ['/studio', 'From intake packet to investor-ready report', 1],
    ['/studio/onboarding', 'Set up Finem CRE Studio', 2],
    ['/studio/settings/billing', 'Billing & Plans', 1],
    ['/studio/dashboard', 'Main Deal Dashboard', 1],
    ['/studio/deals/riverside-flats/intake', 'Deal Intake', 1],
    ['/studio/deals/riverside-flats', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/comps', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/underwriting', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/scenarios', 'Riverside Flats', 1],
    ['/studio/reports/riverside-flats/builder', 'Report Builder', 1],
    ['/studio/settings/white-label', 'White Label Settings', 1],
    ['/studio/design-system', 'Sophex Visual Language', 1],
    ['/studio/broker-os', 'Broker OS Control Panel', 1],
  ])('renders %s', async (path, text, level) => {
    await renderRoute(path);
    expect(screen.getByRole('heading', { name: new RegExp(text), level })).toBeInTheDocument();
  });

  it('redirects legacy deal intake to the default deal-scoped intake route', async () => {
    await renderRoute('/studio/deals/riverside-flats/intake');
    expect(screen.getByRole('heading', { name: /Deal Intake/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Riverside Flats')).toBeInTheDocument();
  });

  it('sets deal-aware document titles for studio routes', async () => {
    await renderRoute('/studio/deals/riverside-flats/comps');
    expect(document.title).toBe('Comps - Riverside Flats - Finem CRE Studio');
  });

  it('shows source metadata in the deal document evidence drawer', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats');

    await user.click(screen.getByRole('button', { name: /Open drawer/i }));
    expect(screen.getByRole('dialog', { name: /Document Evidence/i })).toBeInTheDocument();
    expect(screen.getByText(/doc-om-riverside-flats/i)).toBeInTheDocument();
    expect(screen.getAllByText(/As of/i).length).toBeGreaterThan(0);
  });

  it('shows prototype feedback for inert report builder actions', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/reports/riverside-flats/builder');
    await user.click(screen.getByRole('button', { name: /Export Excel/i }));
    expect(screen.getByText(/Export Excel is simulated/i)).toBeInTheDocument();
  });

  it('renders report readiness gates and manifest-ready copy in Studio reports', async () => {
    await renderRoute('/studio/reports/riverside-flats/builder');

    expect(screen.getByRole('heading', { name: /Readiness Gates/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Assumptions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Export is disabled until section review/i).length).toBeGreaterThan(0);
  });

  it('renders representative studio routes without basic accessibility violations', async () => {
    const dashboard = await renderRoute('/studio/dashboard');
    expect(await axe(dashboard.container)).toHaveNoViolations();

    const report = await renderRoute('/studio/reports/riverside-flats/builder');
    expect(await axe(report.container)).toHaveNoViolations();
  });

  it('shows prototype feedback for billing plan actions', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/settings/billing');
    await user.click(screen.getByRole('link', { name: /Contact sales/i }));
    expect(screen.getByText(/Enterprise sales contact is simulated/i)).toBeInTheDocument();
  });

  it('shows prototype feedback for Broker OS inventory actions', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/broker-os');
    await user.click(screen.getByRole('button', { name: /Refresh streams/i }));
    expect(screen.getByText(/Broker OS job refresh is simulated/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /View Comp_Matcher_AI agent details/i }));
    expect(screen.getByText(/Comp_Matcher_AI agent inventory is simulated/i)).toBeInTheDocument();
  });

  it('shows prototype feedback when saving white-label branding', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/settings/white-label');
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(screen.getByText(/Save branding changes is simulated/i)).toBeInTheDocument();
    expect(screen.getByText(/Prototype branding changes saved/i)).toBeInTheDocument();
  });

  it('shows prototype feedback for white-label asset uploads', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/settings/white-label');
    await user.click(screen.getByRole('button', { name: /Primary logo mock upload/i }));
    expect(screen.getByText(/Primary logo upload is simulated/i)).toBeInTheDocument();
  });

  it('requires a valid deal id on deal-scoped intake', async () => {
    await renderRoute('/studio/deals/not-real/intake');
    expect(screen.getByRole('heading', { name: /Deal not found/i })).toBeInTheDocument();
  });

  it('uses the active deal id in deal workflow pages', async () => {
    await renderRoute('/studio/deals/1200-tech/comps');
    expect(screen.getByRole('heading', { name: '1200 Tech Boulevard' })).toBeInTheDocument();
  });

  it('advances onboarding steps and toggles asset chips', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/onboarding');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    const office = screen.getByRole('button', { name: /Office/i });
    await user.click(office);
    expect(office).toHaveAttribute('aria-pressed', 'true');
  });

  it('reflects saved onboarding profile on the dashboard', async () => {
    saveOnboardingProfile({
      tier: 'Boutique',
      assetClasses: ['Multifamily', 'Office'],
      companyName: 'Acme Real Estate Partners',
    });
    await renderRoute('/studio/dashboard');
    expect(screen.getByText(/Boutique workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/1 of 3 deals/i)).toBeInTheDocument();
  });

  it('opens and closes a comp detail drawer with keyboard focus restored', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/comps');
    const trigger = screen.getByRole('button', { name: /Eastline Apartments/i });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: /Eastline Apartments/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /Eastline Apartments/i })).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps deal workflow links on the active deal id', async () => {
    await renderRoute('/studio/deals/1200-tech/comps');
    expect(screen.getAllByRole('link', { name: /Inputs/i }).at(-1)).toHaveAttribute(
      'href',
      '/studio/deals/1200-tech/intake'
    );
    expect(screen.getAllByRole('link', { name: /Underwriting/i }).at(-1)).toHaveAttribute(
      'href',
      '/studio/deals/1200-tech/underwriting'
    );
    expect(screen.getAllByRole('link', { name: /Reports/i }).at(-1)).toHaveAttribute(
      'href',
      '/studio/reports/1200-tech/builder'
    );
  });

  it('marks active sidebar navigation from route patterns', async () => {
    await renderRoute('/studio/deals/1200-tech/scenarios');
    const sidebar = screen.getByRole('navigation', { name: /Finem Studio navigation/i });
    expect(within(sidebar).getByRole('link', { name: /Underwriting/i })).toHaveClass('active');
    expect(within(sidebar).getByRole('link', { name: /Underwriting/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('switches billing cadence with pressed state', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/settings/billing');
    const monthly = screen.getByRole('button', { name: /Monthly/i });
    await user.click(monthly);
    expect(monthly).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('$199/mo')).toBeInTheDocument();
  });

  it('switches comp view mode and white-label preview mode', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/comps');
    await user.click(screen.getByRole('button', { name: /map/i }));
    expect(screen.getByText(/Sample map view/i)).toBeInTheDocument();
  });

  it('updates underwriting metrics when scenario controls change', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/underwriting');

    const initialAnnouncement = screen.getByText(/Base Case scenario: IRR/i).textContent;
    await user.click(screen.getByRole('button', { name: /^Upside$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Upside scenario: IRR/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Upside scenario: IRR/i).textContent).not.toBe(initialAnnouncement);
  });

  it('renders explicit route guard for unknown deal ids', async () => {
    await renderRoute('/studio/deals/not-a-deal/comps');
    expect(screen.getByRole('heading', { name: /Deal not found/i })).toBeInTheDocument();
  });

  it('shows prototype feedback from standalone report shell actions', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/reports/riverside-flats/builder');
    const exportButtons = screen.getAllByRole('button', { name: /^Export$/i });
    await user.click(exportButtons[0]);
    expect(screen.getByText(/Report export is simulated/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Report help/i }));
    expect(screen.getByText(/Report help is simulated/i)).toBeInTheDocument();
  });

  it('shows prototype feedback for marketing landing CTAs', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio');
    await user.click(screen.getByRole('link', { name: /Start workspace/i }));
    expect(screen.getByText(/Start workspace is simulated/i)).toBeInTheDocument();
  });

  it('shows prototype feedback for studio support and notifications', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/dashboard');
    await user.click(screen.getByRole('button', { name: /^Support$/i }));
    await user.click(screen.getByRole('button', { name: /Open support chat/i }));
    expect(screen.getByText(/Support chat is simulated/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Notifications/i }));
    await user.click(screen.getByRole('button', { name: /Comp set review due/i }));
    expect(screen.getByText(/Comp set review notification is simulated/i)).toBeInTheDocument();
  });

  it('opens help and notifications panels from the top bar', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/dashboard');

    await user.click(screen.getByRole('button', { name: /Help/i }));
    expect(screen.getByRole('dialog', { name: /Help/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Notifications/i }));
    expect(screen.getByRole('dialog', { name: /Notifications/i })).toBeInTheDocument();
  });

  it('requires a reason before confirming a gate override', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/underwriting');

    const overrideButtons = screen.getAllByRole('button', { name: /Override/i });
    await user.click(overrideButtons[0]);
    expect(screen.getByRole('dialog', { name: /Override workflow gate/i })).toBeInTheDocument();

    const confirm = screen.getByRole('button', { name: /Confirm override/i });
    expect(confirm).toBeDisabled();

    await user.type(screen.getByLabelText(/Override reason/i), 'Analyst approved temporary basis.');
    await user.click(confirm);

    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: /Override workflow gate/i })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByText(/Override recorded for Comp readiness/i)).toBeInTheDocument();
  });

  it('opens the premium upgrade modal from locked comps', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/comps');

    await user.click(screen.getByRole('button', { name: /^Upgrade$/i }));
    expect(screen.getByRole('dialog', { name: /Upgrade to Premium/i })).toBeInTheDocument();
  });

  it('shows save draft feedback on deal intake', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/intake');

    await user.click(screen.getByRole('button', { name: /Save draft/i }));
    expect(screen.getByText(/Draft saved locally/i)).toBeInTheDocument();
  });

  it('surfaces internal review queue projection and explicit review action', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/intake');

    expect(screen.getByText(/operator review queue items/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Review flagged fields/i }));
    await user.click(screen.getByRole('button', { name: /Apply explicit review action/i }));
    expect(screen.getByText(/Explicit review action recorded/i)).toBeInTheDocument();
  });

  it('uses governed export policy copy in Studio report builder', async () => {
    await renderRoute('/studio/reports/riverside-flats/builder');

    expect(screen.getByText(/Policy blocked/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Generate governed receipt/i })[0]).toBeDisabled();
  });
});
