import { cleanup, render, screen, waitFor, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';

import App from '@/App';

export async function renderRoute(path: string): Promise<RenderResult> {
  cleanup();
  const view = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

  await waitFor(
    () => {
      expect(screen.queryByText(/Loading view…/i)).toBeNull();
    },
    { timeout: 5000 }
  );

  return view;
}
