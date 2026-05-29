import { expect, test } from '@playwright/test';

import { gotoRoute } from './helpers';

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

  test('public property workflow reaches report and export policy', async ({ page }) => {
    await gotoRoute(page, '/property/demo-001');
    await page.getByRole('button', { name: /View evidence drawer/i }).click();
    await expect(page.getByRole('dialog', { name: /Evidence drawer/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: /Evidence drawer/i })).toBeHidden();
    await gotoRoute(page, '/property/demo-001/comps');
    await expect(page.getByRole('heading', { name: /Side-by-side comp dashboard/i })).toBeVisible();
    await gotoRoute(page, '/report/demo-001');
    await expect(page.getByRole('heading', { name: /Report for 1200 Commerce St/i })).toBeVisible();
  });

  test('public report fixture states keep trust copy and export gate visible', async ({ page }) => {
    await gotoRoute(page, '/report/demo-001?state=provider-restricted');

    await expect(page.getByText(/Public Intelligence/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Not an appraisal$/i })).toBeVisible();
    await expect(page.getByText(/Advisory \/ Model-Inferred valuation range/i)).toBeVisible();
    await expect(page.getByText(/Source Coverage/i).first()).toBeVisible();
    await expect(page.getByText(/Warning & Gap Register/i)).toBeVisible();
    await expect(page.getByText(/Authority Labels Applied/i)).toBeVisible();
    await expect(page.getByText(/Draft report sections/i).first()).toBeVisible();
    await expect(page.getByText(/Prototype-only\. No live valuation or export\./i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
    await expect(page.getByRole('link', { name: /Continue to export gate/i })).toBeVisible();

    await page.getByRole('link', { name: /Low evidence/i }).click();
    await expect(page).toHaveURL(/state=low-evidence/);
    await expect(page.locator('.report-trust-hero').getByText(/Thin citation pack/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
  });

  test('upload produces candidate evidence receipt copy', async ({ page }) => {
    await gotoRoute(page, '/upload');
    await page.locator('#file-input').setInputFiles({
      name: 'rent-roll.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('sample'),
    });
    await page.getByRole('checkbox', { name: /source-use/i }).check();
    await page.getByRole('button', { name: /Start upload/i }).click();
    await expect(page.getByText(/Upload receipt:/i)).toBeVisible();
  });

  test('export gate surfaces governance blockers', async ({ page }) => {
    await gotoRoute(page, '/export/demo-001');
    await expect(page.getByRole('button', { name: /Generate export/i })).toBeDisabled();
    await page.getByRole('button', { name: /Review blockers/i }).click();
    await expect(page.getByRole('dialog', { name: /Export blocked/i })).toBeVisible();
  });

  test('export preview generates governed receipt without sending files', async ({ page }) => {
    await gotoRoute(page, '/export/demo-001');
    await page.getByRole('radio', { name: /preview/i }).check();
    await page.getByRole('button', { name: /Generate export receipt/i }).click();
    await expect(page.getByText(/Redacted evidence refs/i)).toBeVisible();
  });

  test('public footer exposes trust links', async ({ page }) => {
    await gotoRoute(page, '/');
    await expect(page.getByRole('navigation', { name: /Trust and legal/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Source trust tiers/i })).toBeVisible();
  });

  test('public mobile navigation drawer opens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, '/');
    await page.getByRole('button', { name: /Open navigation menu/i }).click();
    await expect(page.getByRole('dialog', { name: /Public navigation/i })).toBeVisible();
  });
});

test.describe('Finem CRE Studio smoke', () => {
  test('dashboard and deal workflow render', async ({ page }) => {
    await gotoRoute(page, '/studio/dashboard');
    await expect(page.getByRole('heading', { name: /Main Deal Dashboard/i })).toBeVisible();
    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting');
    await expect(page.getByRole('button', { name: /Override/i }).first()).toBeVisible();
  });

  test('studio intake and report expose governance projections', async ({ page }) => {
    await gotoRoute(page, '/studio/deals/riverside-flats/intake');
    await expect(page.getByText(/operator review queue items/i)).toBeVisible();
    await page.getByRole('button', { name: /Review flagged fields/i }).click();
    await expect(page.getByRole('dialog', { name: /Candidate field review/i })).toBeVisible();
    await gotoRoute(page, '/studio/reports/riverside-flats/builder');
    await expect(page.getByText(/Policy blocked/i)).toBeVisible();
  });

  test('mobile navigation drawer opens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, '/studio/dashboard');
    await page.getByRole('button', { name: /Open navigation menu/i }).click();
    await expect(page.getByRole('dialog', { name: /Studio navigation/i })).toBeVisible();
  });

  test('broker-os mobile navigation remains reachable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, '/studio/broker-os');
    await page.getByRole('button', { name: /Open navigation menu/i }).click();
    await expect(page.getByRole('dialog', { name: /Studio navigation/i })).toBeVisible();
  });
});
