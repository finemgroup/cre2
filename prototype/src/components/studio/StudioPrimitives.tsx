import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { getMotionProps, getMotionSpec, useReducedMotionPreference } from '@/lib/motion';
import { formatTrustBadgeState } from '@/lib/authority/authority-vocabulary';
import type { AuthorityState, JobStatusProjection } from '@/data/studio';

type ChildrenProps = {
  children: ReactNode;
};

export function MaterialIcon({ name }: { name: string }): ReactElement {
  return (
    <span className="material-symbols-outlined" aria-hidden="true">
      {name}
    </span>
  );
}

export function StudioCard({
  title,
  eyebrow,
  children,
  actions,
  className = '',
}: ChildrenProps & {
  title?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <section className={`studio-card ${className}`}>
      {(title || eyebrow || actions) && (
        <header className="studio-card-header">
          <div>
            {eyebrow ? <p className="studio-eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {actions ? <div className="studio-actions">{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageTitle({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
}): ReactElement {
  return (
    <header className="studio-page-title">
      <div>
        {eyebrow ? <p className="studio-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </div>
      {actions ? <div className="studio-actions">{actions}</div> : null}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon = 'check_circle',
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: string;
}): ReactElement {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail ?? 'Mock projection'}</small>
      <MaterialIcon name={icon} />
    </div>
  );
}

export function TrustBadge({ state }: { state: AuthorityState | string }): ReactElement {
  const { display, ariaLabel } = formatTrustBadgeState(state);
  const normalized = display.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <span className={`trust-badge trust-${normalized}`} aria-label={ariaLabel}>
      {display}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }): ReactElement {
  const normalized = status.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <span className={`status-badge status-${normalized}`} aria-label={`Status: ${status}`}>
      {status}
    </span>
  );
}

export function NonProductionCallout({ children }: ChildrenProps): ReactElement {
  return (
    <div className="studio-callout">
      <MaterialIcon name="info" />
      <span>{children}</span>
    </div>
  );
}

export function WorkflowContextHeader({
  dealName,
  stage,
  returnTo,
  returnLabel = 'Return to dashboard',
}: {
  dealName: string;
  stage: string;
  returnTo?: string;
  returnLabel?: string;
}): ReactElement {
  return (
    <div className="workflow-context">
      <div>
        <p className="studio-eyebrow">Workflow context</p>
        <h1>{dealName}</h1>
        <span>{stage}</span>
      </div>
      {returnTo ? (
        <Link to={returnTo} className="btn btn-secondary">
          {returnLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function StageStepper({
  stages,
  activeIndex,
}: {
  stages: string[];
  activeIndex: number;
}): ReactElement {
  return (
    <ol className="studio-stepper" aria-label="Progress">
      {stages.map((stage, index) => (
        <li
          key={stage}
          className={index === activeIndex ? 'active' : index < activeIndex ? 'done' : ''}
          aria-current={index === activeIndex ? 'step' : undefined}
        >
          <span>{index + 1}</span>
          {stage}
        </li>
      ))}
    </ol>
  );
}

export function AnimatedList({
  children,
  className = '',
  id,
}: ChildrenProps & { className?: string; id?: string }): ReactElement {
  const reducedMotion = useReducedMotionPreference();
  const props = getMotionProps(getMotionSpec('listStagger'), reducedMotion);
  return (
    <motion.div id={id} className={className} data-sophex-motion="listStagger" {...props}>
      {children}
    </motion.div>
  );
}

export function MotionBlock({
  children,
  className = '',
  motionName = 'stageItem',
}: ChildrenProps & {
  className?: string;
  motionName?: 'stageItem' | 'listStagger' | 'railEnter' | 'collapse';
}): ReactElement {
  const reducedMotion = useReducedMotionPreference();
  const props = getMotionProps(getMotionSpec(motionName), reducedMotion);

  return (
    <motion.div className={className} data-sophex-motion={motionName} {...props}>
      {children}
    </motion.div>
  );
}

export function DetailDrawer({
  isOpen,
  onClose,
  title,
  children,
}: ChildrenProps & {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}): ReactElement {
  return (
    <SophexSheet isOpen={isOpen} onClose={onClose} label={title}>
      {children}
    </SophexSheet>
  );
}

export function DataTable({
  headers,
  rows,
  caption,
  getRowKey,
}: {
  headers: string[];
  rows: Array<ReactNode[]>;
  caption?: string;
  getRowKey?: (row: ReactNode[], index: number) => string;
}): ReactElement {
  return (
    <div className="studio-table-wrap">
      <table className="studio-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={getRowKey ? getRowKey(row, index) : row.map((cell) => String(cell)).join('|')}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StickyActionBar({ children }: ChildrenProps): ReactElement {
  return <div className="sticky-action-bar">{children}</div>;
}

export function PaywallOverlay({ children }: ChildrenProps): ReactElement {
  return (
    <div className="paywall-overlay">
      <div className="paywall-card">
        <MaterialIcon name="lock" />
        {children}
      </div>
    </div>
  );
}

export function JsonContextViewer({ value }: { value: unknown }): ReactElement {
  return (
    <pre className="json-viewer" aria-label="Planning context JSON">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function JobStreamsTable({ jobs }: { jobs: JobStatusProjection[] }): ReactElement {
  return (
    <DataTable
      caption="Sanitized Broker OS job streams"
      headers={['Job ID', 'Type', 'Status', 'Duration']}
      rows={jobs.map((job) => [
        <PrototypeActionButton
          key={job.id}
          feature={`Job stream ${job.id}`}
          className="linkish"
          aria-label={`View job stream ${job.id}`}
        >
          {job.id}
        </PrototypeActionButton>,
        job.type,
        <StatusBadge status={job.status} />,
        job.duration,
      ])}
    />
  );
}

export function Swatch({ color }: { color: string }): ReactElement {
  return <span className="color-swatch" style={{ '--swatch': color } as CSSProperties} />;
}
