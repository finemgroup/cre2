import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';

describe('RuntimeResourceStatus', () => {
  it('renders branded loading copy for studio deal routes', () => {
    render(<RuntimeResourceStatus loading variant="studio-deal" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/opening deal workstation/i)).toBeInTheDocument();
  });

  it('renders warning empty state when runtime read fails', () => {
    render(<RuntimeResourceStatus error="Sandbox API request failed." variant="public" />);

    expect(screen.getByText(/runtime read unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/sandbox api request failed/i)).toBeInTheDocument();
  });

  it('renders nothing when idle', () => {
    const { container } = render(<RuntimeResourceStatus loading={false} />);

    expect(container).toBeEmptyDOMElement();
  });
});
