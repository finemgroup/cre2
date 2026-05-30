import { useLocation, useSearchParams } from 'react-router-dom';
import { useState, type ReactElement } from 'react';

import {
  DemoControlsDrawer,
  readActorKey,
  resolveDemoRoute,
  storeActorKey,
} from '@/components/demo/DemoControlsDrawer';
import { resolveExportFixtureState } from '@/lib/runtime/public-export-fixtures';

export function GuidedDemoRail(): ReactElement | null {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [actorKey, setActorKey] = useState(() => readActorKey());
  const route = resolveDemoRoute(pathname);
  if (!route) return null;

  const fixture = resolveExportFixtureState(searchParams.get('state'));
  const [stateId, fixtureLabel] = fixture;

  return (
    <>
      <button
        type="button"
        className="demo-controls-trigger"
        aria-expanded={open}
        aria-controls="demo-controls-drawer"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          tuning
        </span>
        <span>Demo</span>
      </button>
      <DemoControlsDrawer
        open={open}
        onClose={() => setOpen(false)}
        propertyId={route.propertyId}
        stepId={route.stepId}
        stateId={stateId}
        fixtureLabel={fixtureLabel}
        actorKey={actorKey}
        onActorChange={(key) => {
          setActorKey(key);
          storeActorKey(key);
        }}
      />
    </>
  );
}
