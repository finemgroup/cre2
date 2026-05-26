import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, beforeEach } from 'vitest';

import { RouteLoadingPanel } from '@/components/layout/RouteLoadingPanel';
import { PresentationModeToggle } from '@/components/layout/PresentationModeToggle';
import { readPresentationMode, writePresentationMode } from '@/lib/studio/presentation-mode';

describe('presentation mode', () => {
  beforeEach(() => {
    writePresentationMode(false);
  });

  it('persists presentation mode in local storage', () => {
    render(
      <MemoryRouter>
        <PresentationModeToggle />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /enter presentation mode/i }));
    expect(readPresentationMode()).toBe(true);
    expect(screen.getByRole('button', { name: /exit presentation mode/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});

describe('RouteLoadingPanel', () => {
  it('keeps the legacy loading fallback text for route wait helpers', () => {
    render(
      <MemoryRouter initialEntries={['/studio/deals/riverside-flats/comps']}>
        <RouteLoadingPanel />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading view…/i)).toBeInTheDocument();
    expect(screen.getByText(/Opening deal workstation/i)).toBeVisible();
  });
});
