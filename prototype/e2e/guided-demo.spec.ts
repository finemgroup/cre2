import { expect, test } from '@playwright/test';

import { gotoRoute, stabilizePage } from './helpers';

test.beforeEach(async ({ page }) => {
  await stabilizePage(page);
});

test.describe('guided demo states', () => {
  test('guided demo rail renders on key public routes with prototype posture', async ({ page }) => {
    await gotoRoute(page, '/report/demo-001?state=provider-restricted');

    const rail = page.getByRole('navigation', { name: /Guided demo path/i });
    await expect(rail).toBeVisible();
    await expect(rail.getByText(/Public intelligence walkthrough/i)).toBeVisible();
    await expect(rail.getByText(/Export gated/i)).toBeVisible();
    await expect(rail.getByText(/Source rights constrain export/i)).toBeVisible();
    await expect(rail.getByRole('link', { name: /3 · Report/i })).toHaveAttribute(
      'aria-current',
      'page'
    );

    await gotoRoute(page, '/export/demo-001?state=provider-restricted');
    await expect(page.getByRole('navigation', { name: /Guided demo path/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /4 · Export gate/i })).toHaveAttribute(
      'aria-current',
      'page'
    );

    await gotoRoute(page, '/property/demo-001?state=provider-restricted');
    await expect(page.getByRole('navigation', { name: /Guided demo path/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /1 · Property/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  test('state links preserve provider-restricted through report export review and source pack', async ({
    page,
  }) => {
    await gotoRoute(page, '/report/demo-001?state=provider-restricted');

    await page
      .getByRole('navigation', { name: /Guided demo path/i })
      .getByRole('link', {
        name: /4 · Export gate/i,
      })
      .click();
    await expect(page).toHaveURL(/\/export\/demo-001\?state=provider-restricted/);

    await page
      .getByRole('navigation', { name: /Guided demo path/i })
      .getByRole('link', {
        name: /5 · Review queue/i,
      })
      .click();
    await expect(page).toHaveURL(/\/review\/demo-001\?state=provider-restricted/);

    await page
      .getByRole('navigation', { name: /Guided demo path/i })
      .getByRole('link', {
        name: /6 · Source pack/i,
      })
      .click();
    await expect(page).toHaveURL(/\/sources\/demo-001\?state=provider-restricted/);
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
  });

  test('property and comps handoffs preserve fixture state query', async ({ page }) => {
    await gotoRoute(page, '/property/demo-001?state=low-evidence');

    await page.getByRole('link', { name: /Compare comps/i }).click();
    await expect(page).toHaveURL(/\/property\/demo-001\/comps\?state=low-evidence/);

    await page.getByRole('link', { name: /Preview report for/i }).click();
    await expect(page).toHaveURL(/\/report\/demo-001\?state=low-evidence/);

    await gotoRoute(page, '/property/demo-001');
    await page.getByRole('link', { name: /Compare comps/i }).click();
    await expect(page).toHaveURL(/\/property\/demo-001\/comps$/);
  });

  test('export remains gated and no live export action is enabled', async ({ page }) => {
    await gotoRoute(page, '/export/demo-001?state=clean');

    await expect(page.getByRole('button', { name: /Generate export/i })).toBeDisabled();
    await expect(
      page.getByRole('navigation', { name: /Guided demo path/i }).getByText(/Export gated/i)
    ).toBeVisible();
    await expect(page.getByText(/Prototype-only/i).first()).toBeVisible();
  });
});
