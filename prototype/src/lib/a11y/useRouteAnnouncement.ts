import { useEffect } from 'react';

export function useRouteAnnouncement(title: string): string {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return `Navigated to ${title}`;
}
