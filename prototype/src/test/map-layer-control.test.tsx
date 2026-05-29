import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { evaluateSpatialSourceClear } from '@/lib/contracts/spatial';
import { getPublicPropertyView } from '@/lib/runtime/public-property';

describe('MapLayerControlPanel', () => {
  it('renders layer toggles and selected layer detail without accessibility violations', async () => {
    const propertyView = getPublicPropertyView('demo-001', fixtureActors.public);
    const layers = propertyView?.spatialContext.layers ?? [];
    const { container } = render(
      <MapLayerControlPanel
        layers={layers}
        evidenceByLayer={propertyView?.spatialContext.evidenceByLayer ?? {}}
      />
    );

    expect(screen.getByRole('heading', { name: /Map layers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Public property centroid/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('region', { name: /Selected layer details/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports keyboard selection and visibility toggles', async () => {
    const user = userEvent.setup();
    const propertyView = getPublicPropertyView('demo-001', fixtureActors.public);
    const layers = propertyView?.spatialContext.layers ?? [];
    render(
      <MapLayerControlPanel
        layers={layers}
        evidenceByLayer={propertyView?.spatialContext.evidenceByLayer ?? {}}
      />
    );

    const secondLayer = layers[1];
    if (!secondLayer) return;

    await user.click(screen.getByRole('button', { name: secondLayer.label }));
    expect(screen.getByRole('button', { name: secondLayer.label })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(
      screen.getByRole('region', {
        name: new RegExp(`Selected layer details for ${secondLayer.label}`),
      })
    ).toBeInTheDocument();

    const checkbox = screen.getAllByRole('checkbox')[0];
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('shows geometry load posture labels for lazy layers', async () => {
    const propertyView = getPublicPropertyView('demo-001', fixtureActors.public);
    const layers = propertyView?.spatialContext.layers ?? [];
    render(
      <MapLayerControlPanel
        layers={layers}
        evidenceByLayer={propertyView?.spatialContext.evidenceByLayer ?? {}}
      />
    );

    expect(
      screen.getAllByText(/Geometry loaded \(mock\)|Metadata only|Geometry not loaded/i).length
    ).toBeGreaterThan(0);
  });
});

describe('evaluateSpatialSourceClear', () => {
  it('returns true for public actors with only sample trade areas', () => {
    expect(evaluateSpatialSourceClear(fixtureActors.public, 'demo-001')).toBe(true);
  });
});
