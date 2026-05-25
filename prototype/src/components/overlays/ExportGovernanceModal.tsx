import type { ReactElement } from 'react';

import { SophexModal } from '@/components/overlays/SophexModal';
import { StatusBadge } from '@/components/studio/StudioPrimitives';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import type { ExportReadiness } from '@/lib/report-governance';
import type { ExportPolicyDecision } from '@/lib/runtime/export-policy';

type ExportGovernanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  readiness: ExportReadiness;
  policyDecision?: ExportPolicyDecision;
  onConfirm?: () => void;
};

export function ExportGovernanceModal({
  isOpen,
  onClose,
  readiness,
  policyDecision,
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
            <li>
              Approved sections: {readiness.approvedCount}/{readiness.totalCount}
            </li>
            {policyDecision ? <li>Selected scope: {policyDecision.scope}</li> : null}
            {policyDecision?.exportManifest ? (
              <li>Manifest checksum: {policyDecision.exportManifest.checksum}</li>
            ) : null}
          </ul>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <PrototypeActionButton
              feature="PDF export"
              className="btn btn-primary"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              Proceed to export
            </PrototypeActionButton>
          </div>
        </>
      ) : (
        <>
          <StatusBadge status="Blocked" />
          <p>Export remains disabled until these governance issues are resolved:</p>
          <ul className="governance-list" aria-label="Export blockers">
            {(policyDecision?.blockerCategories.length
              ? policyDecision.blockerCategories
              : readiness.blockedReasons
            ).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          {policyDecision ? (
            <p className="muted">Policy decision: {policyDecision.safeMessage}</p>
          ) : null}
          {policyDecision?.exportManifest ? (
            <p className="muted">Draft manifest: {policyDecision.exportManifest.safeSummary}</p>
          ) : null}
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
