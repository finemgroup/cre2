import { useEffect } from 'react';

import { ensureStudioSurfaceFonts } from '@/lib/fonts/font-loader';

export function useStudioSurfaceFonts(): void {
  useEffect(() => {
    ensureStudioSurfaceFonts();
  }, []);
}
