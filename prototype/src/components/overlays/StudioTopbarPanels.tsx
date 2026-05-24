import { useEffect, useRef, type ReactElement } from 'react';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';

type PanelProps = {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
};

function TopbarPanel({ isOpen, onClose, label, children }: PanelProps): ReactElement | null {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={panelRef} className="topbar-panel" role="dialog" aria-label={label}>
      <header>
        <strong>{label}</strong>
        <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Close panel">
          <MaterialIcon name="close" />
        </button>
      </header>
      <div className="topbar-panel-body">{children}</div>
    </div>
  );
}

export function HelpPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement | null {
  return (
    <TopbarPanel isOpen={isOpen} onClose={onClose} label="Help">
      <ul className="panel-link-list">
        <li>
          <a href="#workflow-guide">Deal workflow guide (prototype)</a>
        </li>
        <li>
          <a href="#source-trust">Understanding source trust tiers</a>
        </li>
        <li>
          <a href="#export-governance">Export governance checklist</a>
        </li>
      </ul>
      <p className="muted">Support chat is mock-only in MVP0.</p>
    </TopbarPanel>
  );
}

export function NotificationsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement | null {
  return (
    <TopbarPanel isOpen={isOpen} onClose={onClose} label="Notifications">
      <ul className="notification-list">
        <li>
          <strong>Comp set review due</strong>
          <span>Riverside Flats · 2 sections need approval</span>
        </li>
        <li>
          <strong>Upload extraction complete</strong>
          <span>1200 Tech Boulevard rent roll · candidate evidence</span>
        </li>
        <li>
          <strong>Plan usage at 72%</strong>
          <span>Premium mock tier · 1 of 2 deals active</span>
        </li>
      </ul>
    </TopbarPanel>
  );
}

export function SupportSignOutPanel({
  isOpen,
  onClose,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: 'support' | 'sign-out';
}): ReactElement | null {
  return (
    <TopbarPanel
      isOpen={isOpen}
      onClose={onClose}
      label={mode === 'support' ? 'Support' : 'Sign out'}
    >
      {mode === 'support' ? (
        <>
          <p id="support-disabled-note">Prototype support surfaces only — no tickets are created.</p>
          <button
            type="button"
            className="btn btn-secondary"
            disabled
            aria-describedby="support-disabled-note"
          >
            Open support chat
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled
            aria-describedby="support-disabled-note"
          >
            Email support@finem.studio
          </button>
        </>
      ) : (
        <>
          <p id="signout-disabled-note">Sign out is disabled in the clickable prototype.</p>
          <button
            type="button"
            className="btn btn-secondary"
            disabled
            aria-describedby="signout-disabled-note"
          >
            Sign out of Studio
          </button>
        </>
      )}
    </TopbarPanel>
  );
}
