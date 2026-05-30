import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { getPublicRouteTitle } from '@/lib/a11y/routeTitles';
import { renderRoute } from '@/test/renderRoute';

describe('accessibility navigation', () => {
  it('maps property-aware public document titles', () => {
    expect(getPublicRouteTitle('/property/demo-002')).toBe(
      'Property Intelligence - 4400 Research Blvd - Sophex'
    );
    expect(getPublicRouteTitle('/report/demo-001')).toBe(
      'Report Preview - 1200 Commerce St - Sophex'
    );
    expect(getPublicRouteTitle('/export/demo-002')).toBe(
      'Export Gate - 4400 Research Blvd - Sophex'
    );
  });

  it('marks active public navigation links with aria-current', async () => {
    await renderRoute('/property/demo-001/comps');
    expect(screen.getByRole('link', { name: /Comps/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Explore/i })).not.toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('announces route changes to screen readers on the public shell', async () => {
    await renderRoute('/property/demo-001');
    expect(
      screen.getByText(/Navigated to Property Intelligence - 1200 Commerce St/i)
    ).toBeInTheDocument();
  });

  it('passes axe on representative public routes', async () => {
    const landing = await renderRoute('/');
    expect(await axe(landing.container)).toHaveNoViolations();

    const property = await renderRoute('/property/demo-001');
    expect(await axe(property.container)).toHaveNoViolations();

    const upload = await renderRoute('/upload');
    expect(await axe(upload.container)).toHaveNoViolations();

    const comps = await renderRoute('/property/demo-001/comps');
    expect(await axe(comps.container)).toHaveNoViolations();
  }, 20000);
});
