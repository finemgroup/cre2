import type { ReactElement } from 'react';

export function NonProductionBanner(): ReactElement {
  return (
    <aside className="stub-banner" role="status" aria-live="polite">
      Non-production prototype — sample data only. No live valuations, exports, or syndication.
    </aside>
  );
}
