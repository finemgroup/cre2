import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import App from '@/App';

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('Finem CRE Studio routes', () => {
  it.each([
    ['/studio', 'From intake packet to investor-ready report', 1],
    ['/studio/onboarding', 'Set up Finem CRE Studio', 2],
    ['/studio/settings/billing', 'Billing & Plans', 1],
    ['/studio/dashboard', 'Main Deal Dashboard', 1],
    ['/studio/deal-intake', 'Deal Intake', 1],
    ['/studio/deals/riverside-flats', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/comps', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/underwriting', 'Riverside Flats', 1],
    ['/studio/deals/riverside-flats/scenarios', 'Riverside Flats', 1],
    ['/studio/reports/riverside-flats/builder', 'Report Builder', 1],
    ['/studio/settings/white-label', 'White Label Settings', 1],
    ['/studio/broker-os', 'Broker OS Control Panel', 1],
  ])('renders %s', (path, text, level) => {
    renderRoute(path);
    expect(screen.getByRole('heading', { name: new RegExp(text), level })).toBeInTheDocument();
  });

  it('uses the active deal id in deal workflow pages', () => {
    renderRoute('/studio/deals/1200-tech/comps');
    expect(screen.getByText('1200 Tech Boulevard')).toBeInTheDocument();
  });

  it('advances onboarding steps', () => {
    renderRoute('/studio/onboarding');
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
  });

  it('opens a comp detail drawer from the comps table', () => {
    renderRoute('/studio/deals/riverside-flats/comps');
    fireEvent.click(screen.getByRole('button', { name: /Eastline Apartments/i }));
    expect(screen.getByRole('dialog', { name: /Eastline Apartments/i })).toBeInTheDocument();
  });
});
