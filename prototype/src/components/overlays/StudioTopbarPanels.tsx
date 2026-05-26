import { useEffect, useId, useRef, type ReactElement } from 'react';

import { PrototypeActionAnchor } from '@/components/overlays/PrototypeActionAnchor';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

type PanelProps = {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  panelId?: string;
  children: React.ReactNode;
};

function TopbarPanel({
  isOpen,
  onClose,
  label,
  panelId,
  children,
}: PanelProps): ReactElement | null {
  const generatedId = useId();
  const resolvedPanelId = panelId ?? generatedId;
  const panelRef = useRef<HTMLDivElement>(null);
  const invokerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    invokerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    return () => {
      invokerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
    <div
      ref={panelRef}
      id={resolvedPanelId}
      className="topbar-panel"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
    >
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
  panelId,
}: {
  isOpen: boolean;
  onClose: () => void;
  panelId?: string;
}): ReactElement | null {
  return (
    <TopbarPanel isOpen={isOpen} onClose={onClose} label="Help" panelId={panelId}>
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
  panelId,
}: {
  isOpen: boolean;
  onClose: () => void;
  panelId?: string;
}): ReactElement | null {
  return (
    <TopbarPanel isOpen={isOpen} onClose={onClose} label="Notifications" panelId={panelId}>
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
  panelId,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: 'support' | 'sign-out';
  panelId?: string;
}): ReactElement | null {
  return (
    <TopbarPanel
      isOpen={isOpen}
      onClose={onClose}
      label={mode === 'support' ? 'Support' : 'Sign out'}
      panelId={panelId}
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
