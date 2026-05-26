import { Outlet, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { TabPanelTransition } from '@/components/motion/TabPanelTransition';
import {
  DealWorkflowTabs,
  StudioDealNotFound,
  useStudioDeal,
} from '@/pages/studio/StudioShared';

export function DealWorkflowLayout(): ReactElement {
  const location = useLocation();
  const deal = useStudioDeal();

  if (!deal) {
    return <StudioDealNotFound />;
  }

  return (
    <>
      <DealWorkflowTabs deal={deal} />
      <TabPanelTransition panelKey={location.pathname}>
        <Outlet />
      </TabPanelTransition>
    </>
  );
}
