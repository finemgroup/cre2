import type { ReactElement } from 'react';

import { usePresentationMode } from '@/lib/studio/usePresentationMode';

export function PresentationModeToggle({
  className = 'btn btn-ghost presentation-mode-toggle',
}: {
  className?: string;
}): ReactElement {
  const { enabled, toggle } = usePresentationMode();

  return (
    <button
      type="button"
      className={className}
      aria-pressed={enabled}
      aria-label={enabled ? 'Exit presentation mode' : 'Enter presentation mode'}
      onClick={toggle}
    >
      {enabled ? 'Exit presentation' : 'Presentation'}
    </button>
  );
}
