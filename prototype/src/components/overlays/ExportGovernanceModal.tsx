import type { ReactElement } from 'react';

import { SophexModal } from '@/components/overlays/SophexModal';
import { StatusBadge } from '@/components/studio/StudioPrimitives';
import type { ExportReadiness } from '@/lib/report-governance';

type ExportGovernanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  readiness: ExportReadiness;
  onConfirm?: () => void;
};

export function ExportGovernanceModal({
  isOpen,
  onClose,
  readiness,
  onConfirm,
}: ExportGovernanceModalProps): ReactElement {
  return (
    <SophexModal
      isOpen={isOpen}
      onClose={onClose}
      label={readiness.ready ? 'Export ready' : 'Export blocked'}
      size="md"
    >
      {readiness.ready ? (
        <>
          <StatusBadge status="Ready" />
          <p>All review and source-use gates are clear for this prototype export.</p>
          <ul className="governance-list">
            <li>Receipt hash: {readiness.receiptHash}</li>
            <li>Approved sections: {readiness.approvedCount}/{readiness.totalCount}</li>
          </ul>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              Proceed to export
            </button>
          </div>
        </>
      ) : (
        <>
          <StatusBadge status="Blocked" />
          <p>Export remains disabled until these governance issues are resolved:</p>
          <ul className="governance-list" aria-label="Export blockers">
            {readiness.blockedReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          {readiness.warnings.length > 0 ? (
            <>
              <p className="muted">Additional warnings:</p>
              <ul className="governance-list">
                {readiness.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </>
          ) : null}
          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Review sections
            </button>
          </div>
        </>
      )}
    </SophexModal>
  );
}
