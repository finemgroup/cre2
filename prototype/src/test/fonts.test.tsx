import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ensureMaterialSymbolsFont, ensureStudioFonts } from '@/lib/fonts/font-loader';
import { useStudioSurfaceFonts } from '@/lib/fonts/useStudioSurfaceFonts';

function FontLoaderProbe(): null {
  useStudioSurfaceFonts();
  return null;
}

describe('font loader', () => {
  it('loads studio fonts on demand without duplicating stylesheets', () => {
    document.getElementById('sophex-studio-inter-font')?.remove();

    ensureStudioFonts();
    ensureStudioFonts();

    expect(document.querySelectorAll('#sophex-studio-inter-font')).toHaveLength(1);
  });

  it('loads material symbols once from shell hook', () => {
    document.getElementById('sophex-material-symbols-font')?.remove();

    render(<FontLoaderProbe />);

    expect(document.getElementById('sophex-material-symbols-font')).toBeTruthy();
  });

  it('loads material symbols on demand without duplicating stylesheets', () => {
    document.getElementById('sophex-material-symbols-font')?.remove();

    ensureMaterialSymbolsFont();
    ensureMaterialSymbolsFont();

    expect(document.querySelectorAll('#sophex-material-symbols-font')).toHaveLength(1);
  });
});
