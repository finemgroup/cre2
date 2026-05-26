import { useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';

import { StatusBadge } from '@/components/studio/StudioPrimitives';
import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';

export type DataWorkbenchViewMode = 'table' | 'list' | 'grid';
export type DataWorkbenchViews = Partial<Record<DataWorkbenchViewMode, ReactNode>>;

export function DataWorkbenchShell({
  title,
  subtitle,
  storageKey,
  defaultView = 'table',
  views,
  actions,
  aiSlot,
  secondaryControls,
}: {
  title: string;
  subtitle?: string;
  storageKey?: string;
  defaultView?: DataWorkbenchViewMode;
  views: DataWorkbenchViews;
  actions?: ReactNode;
  aiSlot?: ReactNode;
  secondaryControls?: ReactNode;
}): ReactElement {
  const availableModes = useMemo(
    () => (Object.keys(views) as DataWorkbenchViewMode[]).filter((mode) => views[mode]),
    [views]
  );
  const [mode, setMode] = useState<DataWorkbenchViewMode>(() => {
    const persisted = storageKey ? safeRead(storageKey) : null;
    const candidate = (persisted as DataWorkbenchViewMode | null) ?? defaultView;
    return availableModes.includes(candidate) ? candidate : (availableModes[0] ?? 'table');
  });
  const selectedMode = availableModes.includes(mode) ? mode : (availableModes[0] ?? 'table');

  function chooseMode(nextMode: DataWorkbenchViewMode) {
    setMode(nextMode);
    if (storageKey) safeWrite(storageKey, nextMode);
  }

  return (
    <section className="data-workbench-shell">
      <header className="data-workbench-header">
        <div>
          <p className="studio-eyebrow">Evidence workbench</p>
          <h2>{title}</h2>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
          {aiSlot ? <div className="data-workbench-ai-slot">{aiSlot}</div> : null}
        </div>
        <div className="data-workbench-controls">
          {secondaryControls}
          <ViewModeToggle
            modes={availableModes}
            selectedMode={selectedMode}
            onSelect={chooseMode}
          />
          {actions}
        </div>
      </header>
      <div className="data-workbench-status">
        <StatusBadge status={`${selectedMode} view`} />
        <span>View state is local and mock-only; it does not change evidence authority.</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <SophexMotionSurface
          key={selectedMode}
          motionName="workbenchPanel"
          className={`data-workbench-content data-workbench-${selectedMode}`}
        >
          {views[selectedMode]}
        </SophexMotionSurface>
      </AnimatePresence>
    </section>
  );
}

function ViewModeToggle({
  modes,
  selectedMode,
  onSelect,
}: {
  modes: DataWorkbenchViewMode[];
  selectedMode: DataWorkbenchViewMode;
  onSelect: (mode: DataWorkbenchViewMode) => void;
}): ReactElement {
  return (
    <div className="view-mode-toggle" role="group" aria-label="Workbench view mode">
      {modes.map((mode) => (
        <button
          key={mode}
          type="button"
          className={mode === selectedMode ? 'active' : ''}
          aria-pressed={mode === selectedMode}
          onClick={() => onSelect(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}

function safeRead(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Local view persistence is optional.
  }
}
