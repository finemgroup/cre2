import { useEffect, useRef, type ReactElement } from 'react';

import { PrototypeActionAnchor } from '@/components/overlays/PrototypeActionAnchor';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
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
          <PrototypeActionAnchor href="#workflow-guide" feature="Deal workflow guide">
            Deal workflow guide (prototype)
          </PrototypeActionAnchor>
        </li>
        <li>
          <PrototypeActionAnchor href="#source-trust" feature="Source trust tiers guide">
            Understanding source trust tiers
          </PrototypeActionAnchor>
        </li>
        <li>
          <PrototypeActionAnchor href="#export-governance" feature="Export governance checklist">
            Export governance checklist
          </PrototypeActionAnchor>
        </li>
      </ul>
      <p className="muted">Support chat is mock-only in MVP0.</p>
    </TopbarPanel>
  );
}

const NOTIFICATIONS = [
  {
    id: 'comp-review',
    feature: 'Comp set review notification',
    title: 'Comp set review due',
    detail: 'Riverside Flats · 2 sections need approval',
  },
  {
    id: 'upload-complete',
    feature: 'Upload extraction notification',
    title: 'Upload extraction complete',
    detail: '1200 Tech Boulevard rent roll · candidate evidence',
  },
  {
    id: 'plan-usage',
    feature: 'Plan usage notification',
    title: 'Plan usage at 72%',
    detail: 'Premium mock tier · 1 of 2 deals active',
  },
] as const;

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
        {NOTIFICATIONS.map((item) => (
          <li key={item.id}>
            <PrototypeActionButton feature={item.feature} className="notification-item">
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </PrototypeActionButton>
          </li>
        ))}
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
          <p>Prototype support surfaces only — no tickets are created.</p>
          <PrototypeActionButton feature="Support chat" className="btn btn-secondary">
            Open support chat
          </PrototypeActionButton>
          <PrototypeActionButton feature="Support email" className="btn btn-ghost">
            Email support@finem.studio
          </PrototypeActionButton>
        </>
      ) : (
        <>
          <p>Sign out is simulated in the clickable prototype.</p>
          <PrototypeActionButton feature="Studio sign out" className="btn btn-secondary">
            Sign out of Studio
          </PrototypeActionButton>
        </>
      )}
    </TopbarPanel>
  );
}
