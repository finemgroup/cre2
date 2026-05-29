import { Link, useLocation, useSearchParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import {
  resolveExportFixtureState,
  type ExportFixtureStateId,
} from '@/lib/runtime/public-export-fixtures';

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

function demoPath(propertyId: string, stepId: StepId, stateId: ExportFixtureStateId): string {
  const q = `?state=${stateId}`;
  if (stepId === 'property') return `/property/${propertyId}${q}`;
  if (stepId === 'comps') return `/property/${propertyId}/comps${q}`;
  if (stepId === 'report') return `/report/${propertyId}${q}`;
  if (stepId === 'export') return `/export/${propertyId}${q}`;
  if (stepId === 'review') return `/review/${propertyId}${q}`;
  return `/sources/${propertyId}${q}`;
}

function resolveRoute(pathname: string): { propertyId: string; stepId: StepId } | null {
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

export function GuidedDemoRail(): ReactElement | null {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const route = resolveRoute(pathname);
  if (!route) return null;

  const step = STEPS.find((entry) => entry.id === route.stepId);
  if (!step) return null;

  const fixture = resolveExportFixtureState(searchParams.get('state'));
  const stateId = fixture[0];
  const stepIndex = STEPS.findIndex((entry) => entry.id === step.id);
  const nextStep = stepIndex >= 0 && stepIndex < STEPS.length - 1 ? STEPS[stepIndex + 1] : null;

  return (
    <nav className="public-studio-continuity guided-demo-rail" aria-label="Guided demo path">
      <div>
        <strong>Guided demo · prototype only</strong>
        <p className="muted">
          Public Intelligence · Not an appraisal · Advisory / Model-Inferred · Export gated · No
          live valuation, source retrieval, or export
        </p>
        <p className="guided-demo-rail__meta">
          Step: <strong>{step.label}</strong> · Fixture: <strong>{fixture[1]}</strong>
          {nextStep ? (
            <>
              {' '}
              · Next:{' '}
              <Link to={demoPath(route.propertyId, nextStep.id, stateId)}>{nextStep.label}</Link>
            </>
          ) : (
            <> · End of guided path</>
          )}
        </p>
        <p className="guided-demo-rail__meta">{NARRATIVES[stateId]}</p>
        <nav className="guided-demo-rail__links" aria-label="Public intelligence demo steps">
          {STEPS.map((entry) => (
            <Link
              key={entry.id}
              to={demoPath(route.propertyId, entry.id, stateId)}
              aria-current={entry.id === step.id ? 'page' : undefined}
            >
              {entry.nav}
            </Link>
          ))}
        </nav>
        <div className="guided-demo-rail__links" aria-label="Fixture state switcher">
          <span className="micro-label">Fixture state</span>
          {FIXTURE_LABELS.map(([id, label]) => (
            <Link
              key={id}
              to={demoPath(route.propertyId, step.id, id)}
              aria-current={id === stateId ? 'true' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
