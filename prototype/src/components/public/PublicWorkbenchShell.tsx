import type { ReactElement, ReactNode } from 'react';

import { PublicTrustStrip, type PublicTrustLabel } from '@/components/public/PublicTrustStrip';

type PublicWorkbenchShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  trustLabels?: readonly PublicTrustLabel[];
  headerActions?: ReactNode;
  visualPanel: ReactNode;
  evidenceRail: ReactNode;
  mobileCta?: ReactNode;
};

export function PublicWorkbenchShell({
  eyebrow,
  title,
  description,
  trustLabels,
  headerActions,
  visualPanel,
  evidenceRail,
  mobileCta,
}: PublicWorkbenchShellProps): ReactElement {
  return (
    <div className="public-workbench-shell">
      <header className="public-workbench-shell__header">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {description ? <p className="lede">{description}</p> : null}
        </div>
        {headerActions ? (
          <div className="public-workbench-shell__actions">{headerActions}</div>
        ) : null}
      </header>
      {trustLabels?.length ? <PublicTrustStrip labels={trustLabels} /> : null}
      <div className="public-workbench-shell__split">
        <div className="public-workbench-shell__visual">{visualPanel}</div>
        <div className="public-workbench-shell__rail">{evidenceRail}</div>
      </div>
      {mobileCta ? <div className="public-workbench-shell__mobile-cta">{mobileCta}</div> : null}
    </div>
  );
}
