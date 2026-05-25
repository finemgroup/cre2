import type { ReactElement, ReactNode } from 'react';

type MapPlaceholderPreviewProps = {
  label?: string;
  caption: string;
  children?: ReactNode;
};

export function MapPlaceholderPreview({
  label = 'Regional map preview',
  caption,
  children,
}: MapPlaceholderPreviewProps): ReactElement {
  return (
    <figure className="map-placeholder" aria-label={label}>
      <div className="map-placeholder-canvas" role="img" aria-label={caption}>
        <span className="map-placeholder-grid" aria-hidden="true" />
        <span className="map-placeholder-pin" aria-hidden="true" />
      </div>
      <figcaption>{caption}</figcaption>
      {children}
    </figure>
  );
}
