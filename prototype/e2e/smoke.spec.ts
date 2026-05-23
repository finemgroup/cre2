import { expect, test, type Page } from '@playwright/test';

async function gotoRoute(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Loading view…/i)).toBeHidden({ timeout: 15_000 });
}

test.describe('public Sophex smoke', () => {
  test('landing search returns sample properties', async ({ page }) => {
    await gotoRoute(page, '/');
    await expect(
      page.getByRole('heading', { name: /Evidence-first property intelligence/i })
    ).toBeVisible();
    await page.getByLabel(/Property or market/i).fill('Austin');
    await page.getByRole('button', { name: /^Search$/ }).click();
    await expect(page.getByRole('link', { name: /View property/i }).first()).toBeVisible();
  });

  test('export gate surfaces governance blockers', async ({ page }) => {
    await gotoRoute(page, '/export/demo-001');
    await expect(page.getByRole('button', { name: /Generate export/i })).toBeDisabled();
    await page.getByRole('button', { name: /Review blockers/i }).click();
    await expect(page.getByRole('dialog', { name: /Export blocked/i })).toBeVisible();
  });

  test('public footer exposes trust links', async ({ page }) => {
    await gotoRoute(page, '/');
    await expect(page.getByRole('navigation', { name: /Trust and legal/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Source trust tiers/i })).toBeVisible();
  });
});

test.describe('Finem CRE Studio smoke', () => {
  test('dashboard and deal workflow render', async ({ page }) => {
    await gotoRoute(page, '/studio/dashboard');
    await expect(page.getByRole('heading', { name: /Main Deal Dashboard/i })).toBeVisible();
    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting');
    await expect(page.getByRole('button', { name: /Override/i }).first()).toBeVisible();
  });

  test('mobile navigation drawer opens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, '/studio/dashboard');
    await page.getByRole('button', { name: /Open navigation menu/i }).click();
    await expect(page.getByRole('dialog', { name: /Studio navigation/i })).toBeVisible();
  });
});
