import type { ReactElement } from 'react';

export function NonProductionBanner(): ReactElement {
  return (
    <div className="stub-banner" role="status" aria-live="polite">
      Prototype mode · sample data only · no live valuations, exports, or syndication.
    </div>
  );
}
