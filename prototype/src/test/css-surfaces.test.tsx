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

  it('uses distinct primary button tokens on public and studio surfaces', async () => {
    const publicRender = await renderRoute('/');
    const publicButton = publicRender.container.querySelector('.shell .btn-primary');
    expect(publicButton).toBeTruthy();

    await renderRoute('/studio/dashboard');
    const studioButton = document.querySelector('.studio-shell .btn-primary');
    expect(studioButton).toBeTruthy();

    const publicColor = getComputedStyle(publicButton as Element).backgroundColor;
    const studioColor = getComputedStyle(studioButton as Element).backgroundColor;
    expect(publicColor).not.toBe(studioColor);
  });

  it('scopes route progress modifiers to the active product surface', async () => {
    const publicRender = await renderRoute('/');
    expect(publicRender.container.querySelector('.route-progress-public')).toBeTruthy();

    await renderRoute('/studio/dashboard');
    expect(document.querySelector('.route-progress-studio')).toBeTruthy();
  });
});
