import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';
import {
  ensureStudioFonts,
} from '@/lib/fonts/font-loader';

describe('font loader', () => {
  it('loads studio fonts on demand without duplicating stylesheets', () => {
    document.getElementById('sophex-studio-inter-font')?.remove();

    ensureStudioFonts();
    ensureStudioFonts();

    expect(document.querySelectorAll('#sophex-studio-inter-font')).toHaveLength(1);
  });

  it('loads material symbols when MaterialIcon renders', () => {
    document.getElementById('sophex-material-symbols-font')?.remove();

    render(<MaterialIcon name="upload_file" />);

    expect(document.getElementById('sophex-material-symbols-font')).toBeTruthy();
  });
});
