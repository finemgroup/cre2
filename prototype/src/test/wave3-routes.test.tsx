import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/test/renderRoute';

describe('wave 3 studio routes', () => {
  it('renders capital stack with advisory mock copy', async () => {
    await renderRoute('/studio/deals/riverside-flats/capital-stack');
    expect(screen.getByRole('heading', { name: /Capital Stack & Waterfall/i })).toBeInTheDocument();
    expect(screen.getByText(/not LP reporting or legal conclusions/i)).toBeInTheDocument();
  });

  it('renders IC packet with blocked export posture', async () => {
    await renderRoute('/studio/deals/riverside-flats/ic-packet');
    expect(
      screen.getByRole('heading', { name: /Investment Committee Packet/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Export gated/i)).toBeInTheDocument();
  });

  it('renders HITL review queue as internal-only projection', async () => {
    await renderRoute('/studio/deals/riverside-flats/hitl-review');
    expect(screen.getByRole('heading', { name: /Reviewer Assignment Queue/i })).toBeInTheDocument();
    expect(screen.getAllByText(/queue completion is not promotion authority/i).length).toBeGreaterThan(
      0
    );
  });

  it('renders spatial workbench manifest and trade areas', async () => {
    await renderRoute('/studio/deals/riverside-flats/spatial');
    expect(
      screen.getByRole('heading', { name: /Spatial Manifest & Trade Area Workbench/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Map Layer Manifest/i })).toBeInTheDocument();
  });
});
