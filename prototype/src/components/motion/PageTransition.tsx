import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { getPageTransitionKey, useReducedMotionPreference } from '@/lib/motion';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps): ReactElement {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const transitionKey = getPageTransitionKey(location.pathname);

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
  }, [transitionKey]);

  if (reducedMotion) {
    return (
      <div className="page-transition">
        <div ref={contentRef} id="page-content" tabIndex={-1}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <SophexMotionSurface key={transitionKey} motionName="reveal" className="page-transition">
        <div ref={contentRef} id="page-content" tabIndex={-1}>
          {children}
        </div>
      </SophexMotionSurface>
    </AnimatePresence>
  );
}
