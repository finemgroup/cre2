import type { ReactElement } from 'react';

import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';import { SophexModal } from '@/components/overlays/SophexModal';
import { MaterialIcon } from '@/components/studio/StudioPrimitives';

type UpgradePlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  detail?: string;
};

const PREMIUM_FEATURES = [
  'Private and provider-restricted comp sets',
  'Sensitivity heatmaps and advanced scenario views',
  'White-label export branding',
  'Priority analyst support queue',
];

export function UpgradePlanModal({
  isOpen,
  onClose,
  feature,
  detail,
}: UpgradePlanModalProps): ReactElement {
  return (
    <SophexModal isOpen={isOpen} onClose={onClose} label="Upgrade to Premium" size="md">
      <div className="upgrade-hero">
        <MaterialIcon name="lock" />
        <p>
          <strong>{feature}</strong> requires a Premium plan in this prototype.
        </p>
        {detail ? <p className="muted">{detail}</p> : null}
      </div>
      <ul className="upgrade-feature-list">
        {PREMIUM_FEATURES.map((item) => (
          <li key={item}>
            <MaterialIcon name="check_circle" />
            {item}
          </li>
        ))}
      </ul>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Not now
        </button>
        <PrototypeActionLink
          to="/studio/settings/billing"
          className="btn btn-primary"
          feature="Premium plan upgrade"
          onClick={onClose}
        >
          View plans
        </PrototypeActionLink>
      </div>
    </SophexModal>
  );
}
