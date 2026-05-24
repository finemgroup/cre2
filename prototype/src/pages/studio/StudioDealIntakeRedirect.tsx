import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';

import { DEFAULT_DEAL_ID } from '@/data/studio';

export function StudioDealIntakeRedirect(): ReactElement {
  return <Navigate to={`/studio/deals/${DEFAULT_DEAL_ID}/intake`} replace />;
}
