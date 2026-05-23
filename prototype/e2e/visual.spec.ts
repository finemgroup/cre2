import { expect, test } from '@playwright/test';

import { gotoRoute, stabilizePage } from './helpers';

test.describe('route shell visuals', () => {
  test.beforeEach(async ({ page }) => {
    await stabilizePage(page);
  });

  test('public landing', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/');
    await expect(
      page.getByRole('heading', { name: /Evidence-first property intelligence/i })
    ).toBeVisible();
    await expect(page).toHaveScreenshot('public-landing-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/dashboard');
    await expect(page.getByRole('heading', { name: /Main Deal Dashboard/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-dashboard-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('deal underwriting workflow', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting');
    await expect(page.getByRole('button', { name: /Override/i }).first()).toBeVisible();
    await expect(page).toHaveScreenshot('studio-underwriting-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('export governance gate', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/export/demo-001');
    await expect(page.getByRole('button', { name: /Review blockers/i })).toBeVisible();
    await expect(page).toHaveScreenshot('public-export-gate-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio tablet nav affordance', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await gotoRoute(page, '/studio/dashboard');
    const scrollWrap = page.locator('.studio-nav-scroll-wrap');
    await expect(scrollWrap).toBeVisible();
    await expect(scrollWrap.locator('.studio-nav-scroll-hint')).toHaveCSS('display', 'block');
    await expect(scrollWrap).toHaveScreenshot('studio-dashboard-tablet-nav.png', {
      maxDiffPixelRatio: 0.03,
    });
  });

  test('public landing mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await gotoRoute(page, '/');
    await expect(
      page.getByRole('heading', { name: /Evidence-first property intelligence/i })
    ).toBeVisible();
    await expect(page).toHaveScreenshot('public-landing-mobile-320.png', {
      clip: { x: 0, y: 0, width: 320, height: 420 },
      maxDiffPixelRatio: 0.05,
    });
  });

  test('studio dashboard at 1000px breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 900 });
    await gotoRoute(page, '/studio/dashboard');
    await expect(page.getByRole('heading', { name: /Main Deal Dashboard/i })).toBeVisible();
    const scrollWrap = page.locator('.studio-nav-scroll-wrap');
    await expect(scrollWrap.locator('.studio-nav-scroll-hint')).toHaveCSS('display', 'block');
    await expect(page).toHaveScreenshot('studio-dashboard-1000px.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio pricing', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/settings/billing');
    await expect(page.getByRole('heading', { name: /Billing & Plans/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-pricing-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio report builder', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/reports/riverside-flats/builder');
    await expect(page.getByRole('heading', { name: /Report Builder/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-report-builder-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });
});
