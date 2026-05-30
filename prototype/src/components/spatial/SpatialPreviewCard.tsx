import type { ReactElement, ReactNode } from 'react';

type SpatialPreviewCardProps = {
  title: string;
  caption: string;
  badges?: readonly string[];
  children?: ReactNode;
};

export function SpatialPreviewCard({
  title,
  caption,
  badges = [],
  children,
}: SpatialPreviewCardProps): ReactElement {
  return (
    <figure className="spatial-preview-card sophex-reveal" aria-label={title}>
      <div className="spatial-preview-card__canvas" role="img" aria-label={caption}>
        <span className="spatial-preview-card__grid" aria-hidden="true" />
        <span className="spatial-preview-card__pin" aria-hidden="true" />
      </div>
      <figcaption>
        <strong>{title}</strong>
        <span>{caption}</span>
      </figcaption>
      {badges.length ? (
        <div className="spatial-preview-card__badges" aria-label="Spatial source labels">
          {badges.map((badge) => (
            <span key={badge} className="trust-chip">
              {badge}
            </span>
          ))}
        </div>
      ) : null}
      {children}
    </figure>
  );
}
