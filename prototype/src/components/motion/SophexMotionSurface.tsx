import { m, type HTMLMotionProps, type Transition } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';

import {
  LIST_STAGGER_CHILD_DELAY_S,
  getMotionProps,
  getMotionSpec,
  useReducedMotionPreference,
  type SophexMotionSpecName,
} from '@/lib/motion';

type SophexMotionSurfaceProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  motionName: SophexMotionSpecName;
  children: ReactNode;
  staggerIndex?: number;
  staggerStepS?: number;
};

export function SophexMotionSurface({
  motionName,
  className,
  children,
  staggerIndex,
  staggerStepS = LIST_STAGGER_CHILD_DELAY_S,
  ...props
}: SophexMotionSurfaceProps): ReactElement {
  const reducedMotion = useReducedMotionPreference();
  const motionProps = getMotionProps(getMotionSpec(motionName), reducedMotion);
  const staggerDelay =
    staggerIndex != null && !reducedMotion ? staggerIndex * staggerStepS : undefined;
  const transition =
    staggerDelay != null
      ? ({ ...(motionProps.transition as Transition), delay: staggerDelay } as Transition)
      : motionProps.transition;

  return (
    <m.div
      {...props}
      {...motionProps}
      transition={transition}
      className={className}
      data-sophex-motion={motionName}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      data-stagger-index={staggerIndex != null ? String(staggerIndex) : undefined}
    >
      {children}
    </m.div>
  );
}
