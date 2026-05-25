import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import { studioDealPath } from '@/data/studio';

type PublicStudioContinuityProps = {
  linkedDealId?: string | null;
  surface: 'property' | 'report' | 'export' | 'landing';
};

const SURFACE_COPY: Record<PublicStudioContinuityProps['surface'], string> = {
  landing:
    'Public search shows baseline and candidate evidence. Studio underwriting adds reviewer gates, version lock, and export governance.',
  property:
    'Public property views show baseline authority labels. Linked Studio deals add source trace, conflict resolution, and export gates.',
  report:
    'Public report preview mirrors Studio section posture: reviewed, candidate evidence, blocked, and export gated.',
  export:
    'Public export uses the same authority vocabulary as Studio — blocked until consent, section review, and source-use terms clear.',
};

export function PublicStudioContinuityBanner({
  linkedDealId,
  surface,
}: PublicStudioContinuityProps): ReactElement {
  return (
    <aside className="public-studio-continuity" role="note">
      <MaterialIcon name="hub" />
      <div>
        <strong>Public ↔ Studio continuity</strong>
        <p>{SURFACE_COPY[surface]}</p>
        {linkedDealId ? (
          <p>
            Linked Studio deal:{' '}
            <Link to={studioDealPath(linkedDealId, 'underwriting')}>{linkedDealId}</Link>
          </p>
        ) : (
          <p className="muted">No private Studio data is exposed on public routes.</p>
        )}
      </div>
    </aside>
  );
}
