import { Link, type LinkProps } from 'react-router-dom';
import type { ReactElement } from 'react';

import { usePrototypeAction } from '@/lib/prototype/usePrototypeAction';

type PrototypeActionLinkProps = LinkProps & {
  feature: string;
};

export function PrototypeActionLink({
  feature,
  onClick,
  children,
  ...props
}: PrototypeActionLinkProps): ReactElement {
  const notifyPrototype = usePrototypeAction();

  return (
    <Link
      {...props}
      onClick={(event) => {
        notifyPrototype(feature);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
