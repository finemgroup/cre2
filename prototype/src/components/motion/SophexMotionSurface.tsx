import { motion, type HTMLMotionProps } from 'framer-motion';
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
};

export function SophexMotionSurface({
  motionName,
  className,
  children,
  ...props
}: SophexMotionSurfaceProps): ReactElement {
  const reducedMotion = useReducedMotionPreference();
  const motionProps = getMotionProps(getMotionSpec(motionName), reducedMotion);

  return (
    <motion.div
      {...props}
      {...motionProps}
      className={className}
      data-sophex-motion={motionName}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      {children}
    </motion.div>
  );
}
