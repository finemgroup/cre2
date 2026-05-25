import type { AnchorHTMLAttributes, ReactElement } from 'react';

import { usePrototypeAction } from '@/lib/prototype/usePrototypeAction';

type PrototypeActionAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  feature: string;
};

export function PrototypeActionAnchor({
  feature,
  onClick,
  children,
  ...props
}: PrototypeActionAnchorProps): ReactElement {
  const notifyPrototype = usePrototypeAction();

  return (
    <a
      {...props}
      onClick={(event) => {
        notifyPrototype(feature);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
