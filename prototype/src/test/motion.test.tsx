import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AnimatedList } from '@/components/studio/StudioPrimitives';
import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { getMotionProps, getMotionSpec } from '@/lib/motion';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => false,
    motion: {
      div: ({ children, ...props }: React.ComponentProps<'div'>) => (
        <div {...props}>{children}</div>
      ),
    },
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
    expect(getMotionSpec('workbenchPanel').initial).toEqual({ opacity: 0, y: 8 });
    expect(getMotionSpec('mapSelection').initial).toEqual({ opacity: 0, scale: 0.985 });
  });
});

describe('SophexMotionSurface', () => {
  it('exposes motion metadata attributes', () => {
    render(
      <SophexMotionSurface motionName="stageItem">
        <span>Child</span>
      </SophexMotionSurface>
    );

    const surface = screen.getByText('Child').parentElement;
    expect(surface).toHaveAttribute('data-sophex-motion', 'stageItem');
    expect(surface).toHaveAttribute('data-reduced-motion', 'false');
  });
});

describe('AnimatedList', () => {
  it('exposes list stagger motion metadata and child wrappers', () => {
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
});

describe('list stagger timing', () => {
  it('uses a child delay constant for staggered lists', async () => {
    const { LIST_STAGGER_CHILD_DELAY_S } = await import('@/lib/motion/motion-tokens');
    expect(LIST_STAGGER_CHILD_DELAY_S).toBeGreaterThan(0);
  });
});

describe('DataWorkbenchShell motion', () => {
  it('animates view changes through the workbench panel preset', () => {
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
});
