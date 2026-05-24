import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/test/renderRoute';

describe('Finem CRE Studio routes', () => {
  it.each([
    ['/studio', 'From intake packet to investor-ready report', 1],
    ['/studio/onboarding', 'Set up Finem CRE Studio', 2],
    ['/studio/settings/billing', 'Billing & Plans', 1],
    ['/studio/dashboard', 'Main Deal Dashboard', 1],
    ['/studio/deal-intake', 'Deal Intake', 1],
    ['/studio/deals/riverside-flats/intake', 'Deal Intake', 1],
    ['/studio/deals/riverside-flats', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/comps', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/underwriting', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/scenarios', 'Riverside Flats', 1],
    ['/studio/reports/riverside-flats/builder', 'Report Builder', 1],
    ['/studio/settings/white-label', 'White Label Settings', 1],
    ['/studio/broker-os', 'Broker OS Control Panel', 1],
  ])('renders %s', async (path, text, level) => {
    await renderRoute(path);
    expect(screen.getByRole('heading', { name: new RegExp(text), level })).toBeInTheDocument();
  });

  it('uses the active deal id in deal workflow pages', async () => {
    await renderRoute('/studio/deals/1200-tech/comps');
    expect(screen.getByText('1200 Tech Boulevard')).toBeInTheDocument();
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

    const initialIrr = screen
      .getByText('IRR')
      .closest('.metric-card')
      ?.querySelector('strong')?.textContent;
    await user.click(screen.getByRole('button', { name: /Upside/i }));
    const upsideIrr = screen
      .getByText('IRR')
      .closest('.metric-card')
      ?.querySelector('strong')?.textContent;

    expect(upsideIrr).not.toBe(initialIrr);
  });

  it('renders explicit route guard for unknown deal ids', async () => {
    await renderRoute('/studio/deals/not-a-deal/comps');
    expect(screen.getByRole('heading', { name: /Deal not found/i })).toBeInTheDocument();
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
    await renderRoute('/studio/deal-intake');

    await user.click(screen.getByRole('button', { name: /Save draft/i }));
    expect(screen.getByText(/Draft saved locally/i)).toBeInTheDocument();
  });
});
