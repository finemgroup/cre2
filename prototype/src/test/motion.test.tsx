import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AnimatedList } from '@/components/studio/StudioPrimitives';
import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
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
  it('exposes list stagger motion metadata', () => {
    render(
      <AnimatedList>
        <span>Activity</span>
      </AnimatedList>
    );

    const list = screen.getByText('Activity').parentElement;
    expect(list).toHaveAttribute('data-sophex-motion', 'listStagger');
  });
});
