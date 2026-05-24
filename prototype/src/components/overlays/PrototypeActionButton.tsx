import type { ButtonHTMLAttributes, ReactElement } from 'react';

import { usePrototypeAction } from '@/lib/prototype/usePrototypeAction';

type PrototypeActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  feature: string;
};

export function PrototypeActionButton({
  feature,
  onClick,
  children,
  type = 'button',
  ...props
}: PrototypeActionButtonProps): ReactElement {
  const notifyPrototype = usePrototypeAction();

  return (
    <button
      {...props}
      type={type}
      onClick={(event) => {
        notifyPrototype(feature);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}
