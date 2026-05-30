import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

import type { ExportFixtureStateId } from '@/lib/runtime/public-export-fixtures';

type StepId = 'property' | 'comps' | 'report' | 'export' | 'review' | 'sources';

const STEPS: readonly { id: StepId; label: string; nav: string }[] = [
  { id: 'property', label: 'Property', nav: '1 · Property' },
  { id: 'comps', label: 'Comps', nav: '2 · Comps' },
  { id: 'report', label: 'Report', nav: '3 · Report' },
  { id: 'export', label: 'Export gate', nav: '4 · Export gate' },
  { id: 'review', label: 'Review queue', nav: '5 · Review queue' },
  { id: 'sources', label: 'Source pack', nav: '6 · Source pack' },
];

const NARRATIVES: Record<ExportFixtureStateId, string> = {
  clean: 'Strong coverage — still prototype-only and export-gated.',
  blocked: 'Unresolved review and source-rights blockers keep export gated.',
  'low-evidence': 'Thin citation pack and lower confidence; export still disabled.',
  'provider-restricted': 'Source rights constrain export; prototype rights posture only.',
  'ready-for-review': 'Assembled for analyst review — not live approval or export.',
};

const FIXTURE_LABELS: readonly [ExportFixtureStateId, string][] = [
  ['clean', 'Clean'],
  ['blocked', 'Blocked'],
  ['low-evidence', 'Low evidence'],
  ['provider-restricted', 'Provider restricted'],
  ['ready-for-review', 'Ready for review'],
];

const ACTOR_STORAGE_KEY = 'sophex.prototype.actor-demo';
const ACTOR_LABELS = [
  ['public', 'Public baseline viewer'],
  ['sourceOwner', 'Source owner'],
  ['orgMember', 'Org member'],
  ['internalOperator', 'Internal operator'],
] as const;

type ActorDemoKey = (typeof ACTOR_LABELS)[number][0];

function readActorKey(): ActorDemoKey {
  if (typeof window === 'undefined') return 'public';
  const stored = window.localStorage.getItem(ACTOR_STORAGE_KEY);
  return ACTOR_LABELS.some(([key]) => key === stored) ? (stored as ActorDemoKey) : 'public';
}

function storeActorKey(key: ActorDemoKey): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACTOR_STORAGE_KEY, key);
  window.dispatchEvent(new CustomEvent('sophex:actor-demo-change', { detail: key }));
}

function demoPath(propertyId: string, stepId: StepId, stateId: ExportFixtureStateId): string {
  const q = `?state=${stateId}`;
  if (stepId === 'property') return `/property/${propertyId}${q}`;
  if (stepId === 'comps') return `/property/${propertyId}/comps${q}`;
  if (stepId === 'report') return `/report/${propertyId}${q}`;
  if (stepId === 'export') return `/export/${propertyId}${q}`;
  if (stepId === 'review') return `/review/${propertyId}${q}`;
  return `/sources/${propertyId}${q}`;
}

type DemoControlsDrawerProps = {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  stepId: StepId;
  stateId: ExportFixtureStateId;
  fixtureLabel: string;
  actorKey: ActorDemoKey;
  onActorChange: (key: ActorDemoKey) => void;
};

export function DemoControlsDrawer({
  open,
  onClose,
  propertyId,
  stepId,
  stateId,
  fixtureLabel,
  actorKey,
  onActorChange,
}: DemoControlsDrawerProps): ReactElement | null {
  if (!open) return null;

  const step = STEPS.find((entry) => entry.id === stepId);
  if (!step) return null;

  const stepIndex = STEPS.findIndex((entry) => entry.id === step.id);
  const nextStep = stepIndex >= 0 && stepIndex < STEPS.length - 1 ? STEPS[stepIndex + 1] : null;

  return (
    <>
      <button
        type="button"
        className="demo-controls-scrim"
        aria-label="Close demo controls"
        onClick={onClose}
      />
      <aside
        id="demo-controls-drawer"
        className="demo-controls-drawer open"
        aria-label="Demo controls drawer"
      >
        <div className="demo-controls-drawer__header">
          <div>
            <p className="micro-label">Prototype management</p>
            <h2>Demo Controls</h2>
          </div>
          <button
            type="button"
            className="btn btn-ghost demo-controls-drawer__close"
            aria-label="Close demo controls"
            onClick={onClose}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>
        <div className="demo-controls-warning" role="note">
          Internal operator utility. Prototype-only; not production navigation.
        </div>
        <nav className="guided-demo-rail" aria-label="Guided demo path">
          <p className="micro-label">Guided path</p>
          <div className="guided-demo-rail__links" aria-label="Public intelligence demo steps">
            {STEPS.map((entry) => (
              <Link
                key={entry.id}
                to={demoPath(propertyId, entry.id, stateId)}
                aria-current={entry.id === step.id ? 'page' : undefined}
                onClick={onClose}
              >
                {entry.nav}
              </Link>
            ))}
          </div>
        </nav>
        <section className="demo-controls-section" aria-label="Route shortcuts">
          <p className="micro-label">Route shortcuts</p>
          <div className="guided-demo-rail__links">
            <Link to="/" onClick={onClose}>
              Explore
            </Link>
            <Link to="/upload" onClick={onClose}>
              Upload
            </Link>
          </div>
        </section>
        <section className="demo-controls-section" aria-label="Current demo posture">
          <p className="micro-label">Current posture</p>
          <p>
            Step: <strong>{step.label}</strong>
          </p>
          <p>
            Fixture: <strong>{fixtureLabel}</strong>
          </p>
          <p className="muted">{NARRATIVES[stateId]}</p>
          {nextStep ? (
            <Link
              to={demoPath(propertyId, nextStep.id, stateId)}
              className="btn btn-secondary"
              onClick={onClose}
            >
              Continue to {nextStep.label}
            </Link>
          ) : (
            <p className="muted">End of guided path</p>
          )}
        </section>
        <section className="demo-controls-section" aria-label="Fixture state switcher">
          <p className="micro-label">Fixture state</p>
          <div className="guided-demo-rail__links">
            {FIXTURE_LABELS.map(([id, label]) => (
              <Link
                key={id}
                to={demoPath(propertyId, step.id, id)}
                aria-current={id === stateId ? 'true' : undefined}
                onClick={onClose}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
        <section className="demo-controls-section" aria-label="Prototype actor controls">
          <label className="actor-demo-selector">
            <span>Prototype actor</span>
            <select
              value={actorKey}
              aria-label="Prototype actor context"
              onChange={(event) => onActorChange(event.target.value as ActorDemoKey)}
            >
              {ACTOR_LABELS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>
        <section className="demo-controls-section" aria-label="Demo reset">
          <p className="muted">
            Public Intelligence · Not an appraisal · Advisory / Model-Inferred · Export gated · No
            live valuation, source retrieval, or export
          </p>
          <Link
            to={demoPath(propertyId, 'property', 'clean')}
            className="btn btn-secondary"
            onClick={onClose}
          >
            Reset demo
          </Link>
        </section>
      </aside>
    </>
  );
}

export { readActorKey, storeActorKey, STEPS, type StepId, type ActorDemoKey };

export function resolveDemoRoute(pathname: string): { propertyId: string; stepId: StepId } | null {
  const propertyMatch = pathname.match(/^\/property\/([^/]+)(?:\/comps)?$/);
  if (propertyMatch) {
    return {
      propertyId: propertyMatch[1],
      stepId: pathname.endsWith('/comps') ? 'comps' : 'property',
    };
  }
  const routeMatch = pathname.match(/^\/(report|export|review|sources)\/([^/]+)$/);
  if (routeMatch) {
    return { propertyId: routeMatch[2], stepId: routeMatch[1] as StepId };
  }
  return null;
}
