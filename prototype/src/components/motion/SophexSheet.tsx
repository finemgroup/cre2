import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, type ReactElement, type ReactNode } from 'react';

import { getMotionProps, getMotionSpec, useReducedMotionPreference } from '@/lib/motion';

type SophexSheetProps = {
  isOpen: boolean;
  label: string;
  children: ReactNode;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function SophexSheet({ isOpen, label, children, onClose }: SophexSheetProps): ReactElement {
  const reducedMotion = useReducedMotionPreference();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const invokerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    invokerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    return () => {
      invokerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

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

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const backdropProps = getMotionProps(getMotionSpec('sheetBackdrop'), reducedMotion);
  const panelProps = getMotionProps(getMotionSpec('drawerRight'), reducedMotion);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="sheet-root" role="presentation">
          <motion.button
            type="button"
            className="sheet-backdrop"
            aria-label="Close panel"
            onClick={onClose}
            {...backdropProps}
          />
          <motion.div
            ref={panelRef}
            className="sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            data-sophex-motion="drawerRight"
            {...panelProps}
          >
            <header className="sheet-header">
              <h2 id={titleId}>{label}</h2>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Close
              </button>
            </header>
            <div className="sheet-body">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
