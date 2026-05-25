import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/test/renderRoute';

describe('surface token scoping', () => {
  it('renders the public shell root surface class', async () => {
    const publicRender = await renderRoute('/');
    expect(publicRender.container.querySelector('.shell')).toBeTruthy();
    expect(publicRender.container.querySelector('.studio-shell')).toBeNull();
  });

  it('renders the studio shell root surface class', async () => {
    await renderRoute('/studio/dashboard');
    expect(document.querySelector('.studio-shell')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Main Deal Dashboard/i })).toBeInTheDocument();
  });
});
