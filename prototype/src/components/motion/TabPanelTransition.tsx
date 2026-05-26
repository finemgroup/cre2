import { AnimatePresence } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { useReducedMotionPreference } from '@/lib/motion';

type TabPanelTransitionProps = {
  panelKey: string;
  children: ReactNode;
  className?: string;
  motionName?: 'tabPanel' | 'workbenchPanel' | 'stageItem';
};

export function TabPanelTransition({
  panelKey,
  children,
  className = 'tab-panel-transition',
  motionName = 'tabPanel',
}: TabPanelTransitionProps): ReactElement {
  const reducedMotion = useReducedMotionPreference();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="sync" initial={false}>
      <SophexMotionSurface key={panelKey} motionName={motionName} className={className}>
        {children}
      </SophexMotionSurface>
    </AnimatePresence>
  );
}
