import { LazyMotion, domAnimation } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';

type MotionRootProps = {
  children: ReactNode;
};

export function MotionRoot({ children }: MotionRootProps): ReactElement {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
