import type { ReactElement } from 'react';

import { SophexModal } from '@/components/overlays/SophexModal';
import { DataTable, MaterialIcon, StatusBadge } from '@/components/studio/StudioPrimitives';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import type { ExportReadiness } from '@/lib/report-governance';
import type { ExportPolicyDecision } from '@/lib/runtime/export-policy';

type ExportGovernanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  readiness: ExportReadiness;
  policyDecision?: ExportPolicyDecision;
};

export function ExportGovernanceModal({
  isOpen,
  onClose,
  readiness,
  policyDecision,
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
          <div className="manifest-split">
            <section>
              <h3>Included report sections</h3>
              <ul className="governance-list">
                <li>Executive Summary</li>
                <li>Core Assumptions</li>
                <li>Sales & Rent Comps</li>
              </ul>
            </section>
            <section>
              <h3>Excluded sections</h3>
              <p className="muted">No blocked sections in this mock-ready path.</p>
            </section>
            <section>
              <h3>Evidence appendix</h3>
              <p className="muted">
                Source citations attach as an appendix when section review and source rights clear.
                LP identifiers remain redacted in prototype manifests.
              </p>
            </section>
          </div>
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
            <button type="button" className="btn btn-primary" disabled>
              Generate Export Disabled
            </button>
          </div>
        </>
      ) : (
        <>
          <StatusBadge status="Blocked" />
          <p>Export remains disabled until these governance issues are resolved:</p>
          <div className="manifest-split">
            <section>
              <h3>Excluded sections</h3>
              <ul className="governance-list" aria-label="Export blockers">
                {(policyDecision?.blockerCategories.length
                  ? policyDecision.blockerCategories
                  : readiness.blockedReasons
                ).map((reason) => (
                  <li key={reason}>
                    <MaterialIcon name="block" /> {reason}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Included report sections</h3>
              <ul className="governance-list">
                <li>Executive Summary</li>
                <li>Core Assumptions</li>
                <li>Sales & Rent Comps</li>
              </ul>
            </section>
            <section>
              <h3>Evidence appendix</h3>
              <p className="muted">
                Appendix withheld while blockers remain. Redacted LP identifiers stay out of public
                delivery manifests.
              </p>
            </section>
          </div>
          <DataTable
            caption="Audit manifest details"
            headers={['Manifest field', 'Value']}
            rows={[
              [
                'Pre-flight checksum',
                policyDecision?.exportManifest?.checksum ?? 'a7f9b2c4e1-prototype',
              ],
              ['Session receipt ref', readiness.receiptHash ?? 'REQ-8824-XV'],
              [
                'Permissions and redactions',
                'Sensitive LP identifiers and advisory chips are redacted in this mock manifest.',
              ],
            ]}
          />
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
              Return to Gates
            </button>
            <PrototypeActionButton feature="Request export review" className="btn btn-secondary">
              Request Review
            </PrototypeActionButton>
            <button type="button" className="btn btn-secondary" disabled>
              Generate Export
            </button>
          </div>
        </>
      )}
    </SophexModal>
  );
}
