import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/test/renderRoute';

describe('prototype CTA feedback', () => {
  it('explains simulated report section review actions', async () => {
    const user = userEvent.setup();
    await renderRoute('/report/demo-001');

    await user.click(screen.getAllByRole('button', { name: /Mark section reviewed/i })[0]);
    expect(screen.getByText(/Mark section reviewed is simulated/i)).toBeInTheDocument();
  });

  it('explains simulated public trust footer anchors', async () => {
    const user = userEvent.setup();
    await renderRoute('/property/demo-001');

    await user.click(screen.getByRole('link', { name: /Source trust tiers/i }));
    expect(screen.getByText(/Source trust tiers is simulated/i)).toBeInTheDocument();
  });

  it('explains simulated studio sidebar support actions', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/dashboard');

    await user.click(screen.getByRole('button', { name: /^Support$/i }));
    await user.click(screen.getByRole('button', { name: /Open support chat/i }));
    expect(screen.getByText(/Support chat is simulated/i)).toBeInTheDocument();
  });

  it('explains simulated report builder export actions', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/reports/riverside-flats/builder');

    await user.click(screen.getByRole('button', { name: /Export Excel/i }));
    expect(screen.getByText(/Export Excel is simulated/i)).toBeInTheDocument();
  });

  it('documents disabled wave 3 export CTAs with aria-describedby', async () => {
    await renderRoute('/studio/deals/riverside-flats/capital-stack');

    const exportWaterfall = screen.getByRole('button', { name: /Export Waterfall/i });
    expect(exportWaterfall).toBeDisabled();
    expect(exportWaterfall).toHaveAttribute('aria-describedby', 'export-waterfall-blocked');
    expect(document.getElementById('export-waterfall-blocked')).toHaveTextContent(
      /Export waterfall is disabled in prototype/i
    );
  });

  it('documents disabled IC send CTA with aria-describedby', async () => {
    await renderRoute('/studio/deals/riverside-flats/ic-packet');

    const sendIc = screen.getByRole('button', { name: /Send to IC/i });
    expect(sendIc).toBeDisabled();
    expect(sendIc).toHaveAttribute('aria-describedby', 'ic-send-blocked');
    expect(document.getElementById('ic-send-blocked')).toHaveTextContent(
      /IC delivery is simulated and disabled/i
    );
  });

  it('documents disabled HITL approve CTA with aria-describedby', async () => {
    const user = userEvent.setup();
    await renderRoute('/studio/deals/riverside-flats/hitl-review');

    await user.click(screen.getAllByRole('button', { name: /Open assignment/i })[0]);
    const approve = screen.getByRole('button', { name: /Approve for export/i });
    expect(approve).toBeDisabled();
    expect(approve).toHaveAttribute('aria-describedby', 'hitl-no-promote');
    expect(document.getElementById('hitl-no-promote')).toHaveTextContent(
      /Approval is disabled in prototype/i
    );
  });
});
