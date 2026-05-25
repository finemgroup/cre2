import { motion, type HTMLMotionProps, type Transition } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';

import {
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
  staggerStepS = 0.04,
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
    <motion.div
      {...props}
      {...motionProps}
      transition={transition}
      className={className}
      data-sophex-motion={motionName}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      data-stagger-index={staggerIndex != null ? String(staggerIndex) : undefined}
    >
      {children}
    </motion.div>
  );
}
