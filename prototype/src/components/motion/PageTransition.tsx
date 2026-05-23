import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps): ReactElement {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <SophexMotionSurface key={location.pathname} motionName="reveal" className="page-transition">
        <div ref={contentRef} id="page-content" tabIndex={-1}>
          {children}
        </div>
      </SophexMotionSurface>
    </AnimatePresence>
  );
}
