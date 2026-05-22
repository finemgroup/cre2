import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps): ReactElement {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <SophexMotionSurface key={location.pathname} motionName="reveal" className="page-transition">
        <div id="page-content" tabIndex={-1}>
          {children}
        </div>
      </SophexMotionSurface>
    </AnimatePresence>
  );
}
