import { useCallback, useState } from 'react';

export function useA11yAnnouncement(): {
  message: string;
  announce: (nextMessage: string) => void;
} {
  const [message, setMessage] = useState('');

  const announce = useCallback((nextMessage: string) => {
    setMessage('');
    window.setTimeout(() => setMessage(nextMessage), 10);
  }, []);

  return { message, announce };
}
