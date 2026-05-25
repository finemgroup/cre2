import { Link } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

import { MaterialIcon, StatusBadge } from '@/components/studio/StudioPrimitives';

export type BentoTileState = 'loading' | 'error' | 'empty' | 'ok';
export type BentoTileVariant = 'metric' | 'list' | 'action' | 'status' | 'composite';
export type BentoTileSpan = 1 | 2 | 3 | 4 | 'full';

export function BentoGrid({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}): ReactElement {
  return <div className={`sophex-bento-grid ${className}`}>{children}</div>;
}

export function BentoSection({
  title,
  eyebrow,
  children,
  actions,
}: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
}): ReactElement {
  return (
    <section className="sophex-bento-section">
      {(title || eyebrow || actions) && (
        <header className="sophex-bento-section-header">
          <div>
            {eyebrow ? <p className="studio-eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {actions ? <div className="studio-actions">{actions}</div> : null}
        </header>
      )}
      <BentoGrid>{children}</BentoGrid>
    </section>
  );
}

export function BentoTile({
  title,
  subtitle,
  state = 'ok',
  variant = 'composite',
  span = 1,
  primary,
  secondary,
  children,
  actions,
  to,
  status,
  loadingMessage,
  emptyMessage,
  errorMessage,
  className = '',
}: {
  title: string;
  subtitle?: string;
  state?: BentoTileState;
  variant?: BentoTileVariant;
  span?: BentoTileSpan;
  primary?: ReactNode;
  secondary?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  to?: string;
  status?: string;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  className?: string;
}): ReactElement {
  const content = (
    <>
      <header className="sophex-bento-tile-header">
        <div>
          <p className="studio-eyebrow">{variant}</p>
          <h3>{title}</h3>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        <div className="sophex-bento-tile-header-actions">
          {status ? <StatusBadge status={status} /> : null}
          {secondary}
        </div>
      </header>
      {primary && state === 'ok' ? <div className="sophex-bento-primary">{primary}</div> : null}
      <BentoStatePanel
        state={state}
        loadingMessage={loadingMessage}
        emptyMessage={emptyMessage}
        errorMessage={errorMessage}
      >
        {children}
      </BentoStatePanel>
      {actions ? <footer className="sophex-bento-actions">{actions}</footer> : null}
    </>
  );

  const tileClass = `sophex-bento-tile sophex-bento-${variant} sophex-bento-state-${state} sophex-bento-span-${span} ${className}`;

  if (to) {
    return (
      <Link to={to} className={`${tileClass} sophex-bento-link`}>
        {content}
      </Link>
    );
  }

  return <article className={tileClass}>{content}</article>;
}

export function BentoCardSkeleton({
  label = 'Loading cockpit tile',
}: {
  label?: string;
}): ReactElement {
  return (
    <div className="sophex-bento-skeleton" role="status" aria-label={label}>
      <span />
      <span />
      <span />
    </div>
  );
}

function BentoStatePanel({
  state,
  loadingMessage,
  emptyMessage,
  errorMessage,
  children,
}: {
  state: BentoTileState;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  children?: ReactNode;
}): ReactElement {
  if (state === 'loading') {
    return (
      <div className="sophex-bento-state-panel" role="status">
        <BentoCardSkeleton label="Loading tile data" />
        <p>{loadingMessage ?? 'Loading advisory state from the sandbox runtime.'}</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="sophex-bento-state-panel sophex-bento-error">
        <MaterialIcon name="error" />
        <p>
          {errorMessage ?? 'This tile could not load. Keep the workflow blocked until refreshed.'}
        </p>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="sophex-bento-state-panel">
        <MaterialIcon name="inbox" />
        <p>
          {emptyMessage ??
            'No rows are available. This may mean filters are tight or upstream mock data is empty, not that business activity is zero.'}
        </p>
      </div>
    );
  }

  return <div className="sophex-bento-body">{children}</div>;
}
