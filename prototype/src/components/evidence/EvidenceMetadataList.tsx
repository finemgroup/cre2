import type { ReactElement } from 'react';

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { normalizeAuthorityPosture } from '@/lib/authority/authority-vocabulary';

export type EvidenceMetadataItem = {
  label: string;
  value: string;
  authorityLabel?: string;
  safeExplanation: string;
  sourceId?: string;
  asOf?: string;
};

type EvidenceMetadataListProps = {
  items: EvidenceMetadataItem[];
  heading?: string;
};

export function EvidenceMetadataList({ items, heading }: EvidenceMetadataListProps): ReactElement {
  return (
    <section aria-label={heading ?? 'Evidence metadata'}>
      {heading ? <h3 className="evidence-metadata-heading">{heading}</h3> : null}
      <ul className="evidence-list evidence-metadata-list">
        {items.map((item) => {
          const posture = item.authorityLabel
            ? normalizeAuthorityPosture(item.authorityLabel)
            : null;

          return (
            <li key={`${item.label}-${item.sourceId ?? item.value}`}>
              <div className="evidence-metadata-row">
                <strong>{item.label}</strong>
                {posture ? (
                  <AuthorityBadge label={posture} />
                ) : item.authorityLabel ? (
                  <span className="muted">{item.authorityLabel}</span>
                ) : null}
              </div>
              <p>{item.value}</p>
              <p className="muted">{item.safeExplanation}</p>
              {item.sourceId || item.asOf ? (
                <dl className="evidence-metadata-meta">
                  {item.sourceId ? (
                    <>
                      <dt>Source ref</dt>
                      <dd>
                        <code>{item.sourceId}</code>
                      </dd>
                    </>
                  ) : null}
                  {item.asOf ? (
                    <>
                      <dt>As of</dt>
                      <dd>{item.asOf}</dd>
                    </>
                  ) : null}
                </dl>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
