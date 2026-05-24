import type { ReactElement } from 'react';

export function NonProductionBanner(): ReactElement {
  return (
    <div className="stub-banner" role="status" aria-live="polite">
      Non-production prototype — sample data only. No live valuations, exports, or syndication.
    </div>
  );
}
