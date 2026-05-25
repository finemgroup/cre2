import type { AnchorHTMLAttributes, KeyboardEvent, ReactElement } from 'react';

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
  function handleKeyboard(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      notifyPrototype(feature);
    }
  }

  return (
    <a
      {...props}
      role={props.href ? undefined : 'button'}
      tabIndex={props.href ? props.tabIndex : (props.tabIndex ?? 0)}
      onKeyDown={(event) => {
        handleKeyboard(event);
        props.onKeyDown?.(event);
      }}
      onClick={(event) => {
        notifyPrototype(feature);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
