import { useEffect } from 'react';

export function useRouteTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
