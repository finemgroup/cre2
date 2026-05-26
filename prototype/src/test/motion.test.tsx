import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AnimatedList, MotionBlock } from '@/components/studio/StudioPrimitives';
import { PageTransition } from '@/components/motion/PageTransition';
import { TabPanelTransition } from '@/components/motion/TabPanelTransition';
import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getPublicPropertyView } from '@/lib/runtime/public-property';
import { getMotionProps, getMotionSpec, getPageTransitionKey } from '@/lib/motion';

let reducedMotionEnabled = false;

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => reducedMotionEnabled,
    motion: {
      div: ({ children, ...props }: React.ComponentProps<'div'>) => (
        <div {...props}>{children}</div>
      ),
      button: ({ children, ...props }: React.ComponentProps<'button'>) => (
        <button type="button" {...props}>
          {children}
        </button>
      ),
    },
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/upload' }),
  };
});

describe('motion tokens', () => {
  it('flattens motion under reduced motion', () => {
    const props = getMotionProps(getMotionSpec('reveal'), true);
    const transition = props.transition as { duration?: number };
    expect(transition.duration).toBe(0.01);
    expect(props.animate).toEqual({ opacity: 1 });
  });

  it('uses standard reveal timing when motion is allowed', () => {
    const props = getMotionProps(getMotionSpec('reveal'), false);
    expect(props.initial).toEqual({ opacity: 0, y: 10 });
    expect(props.animate).toEqual({ opacity: 1, y: 0 });
  });

  it('flattens right-drawer motion under reduced motion', () => {
    const props = getMotionProps(getMotionSpec('drawerRight'), true);
    expect(props.initial).toEqual({ opacity: 1 });
    expect(props.animate).toEqual({ opacity: 1 });
  });

  it('resolves listReveal alias to listStagger timing', () => {
    expect(getMotionSpec('listReveal')).toEqual(getMotionSpec('listStagger'));
  });

  it('defines universal shell, workbench, and map motion specs', () => {
    expect(getMotionSpec('navRail').initial).toEqual({ opacity: 0, x: -10 });
    expect(getMotionSpec('tabPanel').initial).toEqual({ opacity: 0, y: 8 });
    expect(getMotionSpec('workbenchPanel').initial).toEqual({ opacity: 0, y: 8 });
    expect(getMotionSpec('mapSelection').initial).toEqual({ opacity: 0, scale: 0.985 });
  });

  it('keeps deal workflow routes on a stable page transition key', () => {
    expect(getPageTransitionKey('/studio/deals/riverside/comps')).toBe('/studio/deals/riverside');
    expect(getPageTransitionKey('/studio/deals/riverside/underwriting/sources')).toBe(
      '/studio/deals/riverside'
    );
    expect(getPageTransitionKey('/studio/dashboard')).toBe('/studio/dashboard');
  });
});

describe('SophexMotionSurface', () => {
  it('exposes motion metadata attributes', () => {
    reducedMotionEnabled = false;
    render(
      <SophexMotionSurface motionName="stageItem">
        <span>Child</span>
      </SophexMotionSurface>
    );

    const surface = screen.getByText('Child').parentElement;
    expect(surface).toHaveAttribute('data-sophex-motion', 'stageItem');
    expect(surface).toHaveAttribute('data-reduced-motion', 'false');
  });

  it('marks reduced motion when preference is enabled', () => {
    reducedMotionEnabled = true;
    render(
      <SophexMotionSurface motionName="navRail">
        <span>Reduced child</span>
      </SophexMotionSurface>
    );

    const surface = screen.getByText('Reduced child').parentElement;
    expect(surface).toHaveAttribute('data-reduced-motion', 'true');
  });
});

describe('AnimatedList', () => {
  it('exposes list stagger motion metadata and child wrappers', () => {
    reducedMotionEnabled = false;
    render(
      <AnimatedList>
        <span>Activity</span>
        <span>Follow-up</span>
      </AnimatedList>
    );

    const list = screen.getByText('Activity').parentElement?.parentElement;
    expect(list).toHaveAttribute('data-sophex-motion', 'listStagger');
    expect(list).toHaveAttribute('data-stagger-children', 'true');
    expect(screen.getByText('Activity').parentElement).toHaveAttribute(
      'data-sophex-motion',
      'listStaggerChild'
    );
  });

  it('renders a static list when reduced motion is enabled', () => {
    reducedMotionEnabled = true;
    render(
      <AnimatedList>
        <span>Static item</span>
      </AnimatedList>
    );

    const list = screen.getByText('Static item').parentElement;
    expect(list).toHaveAttribute('data-sophex-motion', 'listStagger');
    expect(list).not.toHaveAttribute('data-stagger-children');
  });
});

describe('MotionBlock', () => {
  it('applies navRail metadata to workflow chrome', () => {
    reducedMotionEnabled = false;
    render(
      <MotionBlock motionName="navRail">
        <span>Nav group</span>
      </MotionBlock>
    );

    expect(screen.getByText('Nav group').parentElement).toHaveAttribute(
      'data-sophex-motion',
      'navRail'
    );
  });
});

describe('PageTransition', () => {
  it('skips animated route wrapper when reduced motion is enabled', () => {
    reducedMotionEnabled = true;
    render(
      <PageTransition>
        <p>Route body</p>
      </PageTransition>
    );

    expect(screen.getByText('Route body').closest('.page-transition')).toBeInTheDocument();
    expect(screen.getByText('Route body').closest('[data-sophex-motion]')).not.toBeInTheDocument();
  });
});

describe('list stagger timing', () => {
  it('uses a child delay constant for staggered lists', async () => {
    const { LIST_STAGGER_CHILD_DELAY_S } = await import('@/lib/motion/motion-tokens');
    expect(LIST_STAGGER_CHILD_DELAY_S).toBeGreaterThan(0);
  });
});

describe('DataWorkbenchShell motion', () => {
  it('animates view changes through the workbench panel preset', () => {
    reducedMotionEnabled = false;
    render(
      <DataWorkbenchShell
        title="Evidence Workbench"
        views={{
          table: <p>Table view</p>,
          list: <p>List view</p>,
        }}
      />
    );

    expect(screen.getByText('Table view').parentElement).toHaveAttribute(
      'data-sophex-motion',
      'workbenchPanel'
    );

    fireEvent.click(screen.getByRole('button', { name: 'list' }));

    expect(screen.getByText('List view').parentElement).toHaveAttribute(
      'data-sophex-motion',
      'workbenchPanel'
    );
  });

  it('renders static workbench content when reduced motion is enabled', () => {
    reducedMotionEnabled = true;
    render(
      <DataWorkbenchShell
        title="Evidence Workbench"
        views={{
          table: <p>Static table</p>,
          list: <p>Static list</p>,
        }}
      />
    );

    expect(screen.getByText('Static table').parentElement).not.toHaveAttribute(
      'data-sophex-motion'
    );
    fireEvent.click(screen.getByRole('button', { name: 'list' }));
    expect(screen.getByText(/list view selected/i)).toBeInTheDocument();
  });
});

describe('TabPanelTransition', () => {
  it('animates panel switches through the tabPanel preset', () => {
    reducedMotionEnabled = false;
    const { rerender } = render(
      <TabPanelTransition panelKey="table">
        <p>Table panel</p>
      </TabPanelTransition>
    );

    expect(screen.getByText('Table panel').parentElement).toHaveAttribute(
      'data-sophex-motion',
      'tabPanel'
    );

    rerender(
      <TabPanelTransition panelKey="map">
        <p>Map panel</p>
      </TabPanelTransition>
    );

    expect(screen.getByText('Map panel').parentElement).toHaveAttribute(
      'data-sophex-motion',
      'tabPanel'
    );
  });

  it('renders static tab content when reduced motion is enabled', () => {
    reducedMotionEnabled = true;
    render(
      <TabPanelTransition panelKey="portal">
        <p>Static preview</p>
      </TabPanelTransition>
    );

    expect(screen.getByText('Static preview').closest('.tab-panel-transition')).toBeInTheDocument();
    expect(screen.getByText('Static preview').closest('[data-sophex-motion]')).not.toBeInTheDocument();
  });
});

describe('MapLayerControlPanel motion', () => {
  it('applies mapSelection metadata to selected layer details', () => {
    reducedMotionEnabled = false;
    const propertyView = getPublicPropertyView('demo-001', fixtureActors.public);
    const layers = propertyView?.spatialContext.layers ?? [];
    render(
      <MapLayerControlPanel
        layers={layers}
        evidenceByLayer={propertyView?.spatialContext.evidenceByLayer ?? {}}
      />
    );

    expect(screen.getByRole('region', { name: /Selected layer details/i })).toHaveAttribute(
      'data-sophex-motion',
      'mapSelection'
    );
  });
});
