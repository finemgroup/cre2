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
      maxDiffPixelRatio: 0.1,
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

  test('public property map placeholder', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/property/demo-001');
    await expect(page.getByRole('heading', { name: /1200 Commerce St/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /Sample map layer/i })).toBeVisible();
    await expect(page).toHaveScreenshot('public-property-map-desktop.png', {
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

  test('studio source trace workstation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting/sources');
    await expect(page.getByRole('heading', { name: /Assumption Sources/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-source-trace-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio scenario diff workstation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/scenarios');
    await expect(page.getByRole('heading', { name: /Driver Comparison/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-scenario-diff-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio version timeline workstation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/versions');
    await expect(page.getByRole('heading', { name: /Valuation snapshots/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-version-timeline-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('public report preview', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/report/demo-001');
    await expect(page.getByRole('heading', { name: /Report for 1200 Commerce St/i })).toBeVisible();
    await expect(page).toHaveScreenshot('public-report-preview-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('public upload flow', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/upload');
    await expect(page.getByRole('heading', { name: /Upload documents/i })).toBeVisible();
    await expect(page).toHaveScreenshot('public-upload-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('public comps dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/property/demo-001/comps');
    await expect(page.getByRole('heading', { name: /Side-by-side comp dashboard/i })).toBeVisible();
    await expect(page).toHaveScreenshot('public-comps-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio capital stack design reference', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/capital-stack');
    await expect(page.getByRole('heading', { name: /Capital Stack & Waterfall/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-capital-stack-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio ic packet design reference', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/ic-packet');
    await expect(page.getByRole('heading', { name: /Investment Committee Packet/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-ic-packet-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio hitl review queue', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/hitl-review');
    await expect(page.getByRole('heading', { name: /Reviewer Assignment Queue/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-hitl-review-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio spatial workbench with layer budgets', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/spatial');
    await expect(
      page.getByRole('heading', { name: /Spatial Manifest & Trade Area Workbench/i })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /Spatial Evidence Workbench/i })).toBeVisible();
    await expect(page.getByText(/Source rights clear|Source rights blocked/i)).toBeVisible();
    await expect(page).toHaveScreenshot('studio-spatial-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('deal cockpit overview desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats');
    await expect(page.getByRole('heading', { name: /Deal Cockpit/i })).toBeVisible();
    await expect(page.getByText(/Stage Posture/i)).toBeVisible();
    await expect(page).toHaveScreenshot('studio-deal-cockpit-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('deal cockpit overview mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, '/studio/deals/riverside-flats');
    await expect(page.getByRole('heading', { name: /Deal Cockpit/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-deal-cockpit-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.08,
    });
  });

  test('underwriting cockpit desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting');
    await expect(page.getByRole('heading', { name: /Executive Underwriting Cockpit/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-underwriting-cockpit-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio design system reference', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/design-system');
    await expect(page.getByRole('heading', { name: /Sophex Visual Language/i })).toBeVisible();
    await expect(page).toHaveScreenshot('studio-design-system-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('studio version timeline with readiness rail', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, '/studio/deals/riverside-flats/versions');
    await expect(page.getByText(/Version export posture/i)).toBeVisible();
    await expect(page).toHaveScreenshot('studio-version-readiness-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.03,
    });
  });
});
