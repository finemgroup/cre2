import { useState, type ReactElement } from 'react';

import { SophexModal } from '@/components/overlays/SophexModal';

type GateOverrideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  gateLabel: string;
  gateDetail?: string;
  onConfirm: (reason: string) => void;
};

export function GateOverrideModal({
  isOpen,
  onClose,
  gateLabel,
  gateDetail,
  onConfirm,
}: GateOverrideModalProps): ReactElement {
  const [reason, setReason] = useState('');

  function handleClose() {
    setReason('');
    onClose();
  }

  function handleConfirm() {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason('');
    onClose();
  }

  return (
    <SophexModal isOpen={isOpen} onClose={handleClose} label="Override workflow gate" size="md">
      <p>
        You are requesting an override for <strong>{gateLabel}</strong>.
      </p>
      {gateDetail ? <p className="muted">{gateDetail}</p> : null}
      <p className="warning">Overrides are audited and require a documented reason in production.</p>
      <label htmlFor="override-reason">
        Override reason
        <textarea
          id="override-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={4}
          placeholder="Explain why this gate can proceed with elevated risk..."
        />
      </label>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!reason.trim()}
          onClick={handleConfirm}
        >
          Confirm override
        </button>
      </div>
    </SophexModal>
  );
}
