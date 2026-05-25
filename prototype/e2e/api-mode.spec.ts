import { expect, test } from '@playwright/test';

import { gotoRoute } from './helpers';

test.describe('sandbox api mode smoke', () => {
  test('landing search works when runtime mode is api', async ({ page }) => {
    await gotoRoute(page, '/');
    await expect(
      page.getByRole('heading', { name: /Evidence-first property intelligence/i })
    ).toBeVisible();
    await page.getByLabel(/Property or market/i).fill('Austin');
    await page.getByRole('button', { name: /^Search$/ }).click();
    await expect(page.getByRole('link', { name: /View property/i }).first()).toBeVisible();
  });

  test('property detail loads from sandbox api adapter', async ({ page }) => {
    await gotoRoute(page, '/property/demo-001');
    await expect(page.getByRole('heading', { name: /1200 Commerce St/i })).toBeVisible();
  });

  test('studio workflow progress renders in api mode', async ({ page }) => {
    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting');
    await expect(page.getByRole('navigation', { name: /Deal workflow sections/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /Underwriting panels/i })).toBeVisible();
  });
});
