import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PrototypeToastProvider } from '@/components/overlays/PrototypeToast';
import { UploadDropzone } from '@/components/upload/UploadDropzone';

describe('UploadDropzone', () => {
  it('exposes progressbar semantics for queued files', () => {
    render(
      <PrototypeToastProvider>
        <UploadDropzone
          files={[
            {
              id: 'file-1',
              name: 'rent-roll.pdf',
              type: 'Rent roll',
              progress: 65,
              status: 'extracting',
            },
          ]}
        />
      </PrototypeToastProvider>
    );

    expect(screen.getByRole('progressbar', { name: /rent-roll\.pdf/i })).toHaveAttribute(
      'aria-valuenow',
      '65'
    );
  });

  it('shows prototype feedback when the dropzone is activated', async () => {
    const user = userEvent.setup();
    render(
      <PrototypeToastProvider>
        <UploadDropzone files={[]} />
      </PrototypeToastProvider>
    );

    await user.click(
      screen.getByRole('button', { name: /Drop OM, rent roll, and T12 files here/i })
    );
    expect(screen.getByRole('status')).toHaveTextContent(/Studio file dropzone is simulated/i);
  });
});
