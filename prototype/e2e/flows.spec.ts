import { expect, test } from '@playwright/test';

import { gotoRoute, stabilizePage } from './helpers';

test.beforeEach(async ({ page }) => {
  await stabilizePage(page);
});

test.describe('public end-to-end flows', () => {
  test('search to gated export readiness across property context', async ({ page }) => {
    await gotoRoute(page, '/');
    await page.getByLabel(/Property or market/i).fill('Austin');
    await page.getByRole('button', { name: /^Search$/ }).click();
    await page
      .getByRole('link', { name: /View property/i })
      .first()
      .click();

    await expect(page.getByRole('heading', { name: /1200 Commerce St/i })).toBeVisible();
    const compareCompsLink = page.getByRole('link', { name: /Compare comps/i });
    await expect(compareCompsLink).toBeVisible();
    await compareCompsLink.press('Enter');
    await expect(page.getByRole('heading', { name: /Side-by-side comp dashboard/i })).toBeVisible();

    const previewReportLink = page.getByRole('link', { name: /Preview report/i });
    await expect(previewReportLink).toBeVisible();
    await previewReportLink.press('Enter');
    await expect(page.getByRole('heading', { name: /Report for 1200 Commerce St/i })).toBeVisible();
    await page.getByRole('link', { name: /Continue to export gate/i }).click();

    await expect(page).toHaveURL(/\/export\/demo-001\?state=blocked/);
    await expect(
      page.getByRole('heading', { name: /Review readiness for 1200 Commerce St/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export/i })).toBeDisabled();
    await expect(page.getByText(/Consent gate must clear before export/i)).toBeVisible();
    await page.getByRole('radio', { name: /preview/i }).check();
    await expect(
      page.getByRole('button', { name: /Generate export receipt disabled/i })
    ).toBeDisabled();
  });

  test('evidence drawer shows structured source metadata', async ({ page }) => {
    await gotoRoute(page, '/property/demo-001');
    await page.getByRole('button', { name: /View evidence drawer/i }).click();
    const drawer = page.getByRole('dialog', { name: /Evidence drawer/i });
    await expect(drawer.getByRole('heading', { name: /Field evidence/i })).toBeVisible();
    await expect(drawer.getByText(/evidence-public-assessor/i)).toBeVisible();
    await expect(drawer.locator('dd').filter({ hasText: '2026-05-01' }).first()).toBeVisible();
  });

  test('route guards block missing property and comps context', async ({ page }) => {
    await gotoRoute(page, '/property/not-real');
    await expect(page.getByRole('heading', { name: /Property not found/i })).toBeVisible();

    await gotoRoute(page, '/comps');
    await expect(page.getByRole('heading', { name: /Comp comparison unavailable/i })).toBeVisible();
  });
});

test.describe('Studio end-to-end flows', () => {
  test('deal workflow tabs preserve riverside-flats context', async ({ page }) => {
    await gotoRoute(page, '/studio/deals/riverside-flats');
    await expect(page.getByRole('heading', { name: /Riverside Flats/i })).toBeVisible();

    await page.locator('a.tab-link', { hasText: 'Comps' }).click();
    await expect(page).toHaveURL(/\/studio\/deals\/riverside-flats\/comps$/);
    await expect(page.getByRole('heading', { name: /Comparable Sales Review/i })).toBeVisible();

    await page.locator('a.tab-link', { hasText: 'Underwriting' }).click();
    await expect(page).toHaveURL(/\/studio\/deals\/riverside-flats\/underwriting$/);
    await expect(page.getByRole('button', { name: /Override/i }).first()).toBeVisible();

    await page.locator('a.tab-link', { hasText: 'Scenarios' }).click();
    await expect(page).toHaveURL(/\/studio\/deals\/riverside-flats\/scenarios$/);
    await expect(page.getByText('Scenario comparison', { exact: true })).toBeVisible();
  });

  test('document evidence drawer exposes source refs on deal overview', async ({ page }) => {
    await gotoRoute(page, '/studio/deals/riverside-flats');
    await page.getByRole('button', { name: /Open drawer/i }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /Open drawer/i }).click({ force: true });
    const drawer = page.getByRole('dialog', { name: /Document Evidence/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(/doc-om-riverside-flats/i)).toBeVisible();
  });

  test('onboarding tier selection reaches dashboard continuity', async ({ page }) => {
    await gotoRoute(page, '/studio/onboarding');
    await page.getByRole('button', { name: /Boutique/i }).click();
    await page.getByRole('button', { name: /^Continue$/i }).click();
    await page.getByRole('button', { name: /^Continue$/i }).click();
    await page.getByRole('button', { name: /^Continue$/i }).click();
    await page.getByRole('button', { name: /^Finish$/i }).click();

    await expect(page).toHaveURL(/\/studio\/dashboard$/);
    await expect(page.getByText(/Workspace configured/i)).toBeVisible();
  });

  test('report builder standalone shell keeps export gated', async ({ page }) => {
    await gotoRoute(page, '/studio/reports/riverside-flats/builder');
    await expect(page.getByRole('heading', { name: /Report Builder/i })).toBeVisible();
    await expect(
      page
        .locator('span')
        .filter({ hasText: /Export is disabled until section review/i })
        .first()
    ).toBeVisible();
    await page.getByRole('button', { name: /^Export$/i }).click();
    await expect(page.getByText(/Report export is simulated/i)).toBeVisible();
  });

  test('broker os inventory remains read-only with prototype feedback', async ({ page }) => {
    await gotoRoute(page, '/studio/broker-os');
    await page.getByRole('button', { name: /Refresh streams/i }).click();
    await expect(page.getByText(/Broker OS job refresh is simulated/i)).toBeVisible();
  });

  test('Stitch workstation interactions remain mock-only and gated', async ({ page }) => {
    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting');
    await expect(page.getByText(/Advisory valuation range/i)).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: /Underwriting workflow spine/i })
    ).toBeVisible();
    await page.getByRole('button', { name: /Open DSCR calculation breakdown/i }).click();
    await expect(page.getByRole('dialog', { name: /DSCR calculation breakdown/i })).toBeVisible();
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: /Review Version Lock/i }).click();
    await expect(page.getByRole('dialog', { name: /Lock Version/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Lock Version$/i })).toBeDisabled();
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: /Open analyst review drawer/i }).click();
    const hitlDrawer = page.getByRole('dialog', { name: /Analyst review queue/i });
    await expect(hitlDrawer).toBeVisible();
    await expect(hitlDrawer.getByText(/Internal-only HITL projection/i)).toBeVisible();
    const openAssignmentButton = hitlDrawer
      .getByRole('button', { name: /Open assignment/i })
      .first();
    await expect(openAssignmentButton).toBeVisible();
    await openAssignmentButton.press('Enter');
    const detailDrawer = page.getByRole('dialog', { name: /Reviewer assignment detail/i });
    await expect(detailDrawer).toBeVisible();
    await expect(detailDrawer.getByText(/Reviewer decision required/i)).toBeVisible();
    await expect(detailDrawer.getByRole('button', { name: /Approve for export/i })).toBeDisabled();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');

    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting/sources');
    await page.getByRole('button', { name: /Resolve conflict/i }).click();
    await expect(page.getByRole('dialog', { name: /Unit Count Discrepancy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Confirm Decision/i })).toBeDisabled();
  });

  test('new workstation routes render source, debt, data, scenario, and version surfaces', async ({
    page,
  }) => {
    await gotoRoute(page, '/studio/deals/riverside-flats/data-review');
    await expect(
      page.getByRole('heading', { name: /Rent roll \/ T12 normalization/i })
    ).toBeVisible();
    await page.getByRole('button', { name: /Resolve Unit Count Conflict/i }).click();
    await expect(page.getByRole('dialog', { name: /Unit Count Discrepancy/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await page
      .getByRole('link', { name: /Review Source Trace/i })
      .first()
      .click();
    await expect(
      page.locator('.studio-page-title').getByRole('heading', { name: /^Assumption Source Trace$/ })
    ).toBeVisible();

    await gotoRoute(page, '/studio/deals/riverside-flats/underwriting/debt');
    await expect(page.getByRole('heading', { name: /Debt \/ lender quote panel/i })).toBeVisible();
    await page.getByRole('button', { name: /Add Mock Lender Quote/i }).click();
    await expect(page.getByRole('dialog', { name: /Add mock lender quote/i })).toBeVisible();
    await page.keyboard.press('Escape');

    await gotoRoute(page, '/studio/deals/riverside-flats/scenarios');
    await expect(page.getByRole('heading', { name: /Driver Comparison/i })).toBeVisible();
    await expect(page.getByText(/Gate implication/i)).toBeVisible();
    await page
      .getByRole('button', { name: /Open sensitivity drilldown/i })
      .first()
      .click();
    await expect(page.getByRole('dialog', { name: /Sensitivity cell drilldown/i })).toBeVisible();
    await page.keyboard.press('Escape');

    await gotoRoute(page, '/studio/deals/riverside-flats/versions');
    await expect(page.getByRole('heading', { name: /Valuation snapshots/i })).toBeVisible();
    await expect(page.getByText(/EVID-SNAP-992/i)).toBeVisible();
  });

  test('wave 3 design reference and spatial routes stay mock-only', async ({ page }) => {
    await gotoRoute(page, '/studio/deals/riverside-flats/capital-stack');
    await expect(page.getByRole('heading', { name: /Capital Stack & Waterfall/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export Waterfall/i })).toBeDisabled();

    await gotoRoute(page, '/studio/deals/riverside-flats/ic-packet');
    await expect(page.getByRole('heading', { name: /Investment Committee Packet/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Send to IC/i })).toBeDisabled();

    await gotoRoute(page, '/studio/deals/riverside-flats/hitl-review');
    await page
      .getByRole('button', { name: /Open assignment/i })
      .first()
      .click();
    await expect(page.getByRole('dialog', { name: /Reviewer assignment detail/i })).toBeVisible();
    await page.keyboard.press('Escape');

    await gotoRoute(page, '/studio/deals/riverside-flats/spatial');
    await expect(
      page.getByRole('heading', { name: /Spatial Manifest & Trade Area Workbench/i })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /Layer Performance Budgets/i })).toBeVisible();

    await gotoRoute(page, '/studio/deals/riverside-flats/versions');
    await expect(page.getByText(/Version export posture/i)).toBeVisible();
  });

  test('cross-entity demo paths link public properties to studio deals', async ({ page }) => {
    await gotoRoute(page, '/property/demo-001');
    await expect(page.getByRole('heading', { name: /1200 Commerce St/i })).toBeVisible();
    const underwriteInStudioLink = page.getByRole('link', { name: /Underwrite in Studio/i });
    await expect(underwriteInStudioLink).toBeVisible();
    await underwriteInStudioLink.press('Enter');
    await expect(page).toHaveURL(/\/studio\/deals\/riverside-flats\/intake$/);
    await gotoRoute(page, '/studio/deals/riverside-flats');
    await page.locator('a.tab-link', { hasText: 'Underwriting' }).click();
    await expect(page).toHaveURL(/\/studio\/deals\/riverside-flats\/underwriting$/);
    await page
      .locator('.studio-card', {
        has: page.getByRole('heading', { name: /^Next Handoff$/ }),
      })
      .getByRole('link', { name: /Open spatial workbench/i })
      .click();
    await expect(page).toHaveURL(/\/studio\/deals\/riverside-flats\/spatial$/);
    await page.getByRole('link', { name: /Return to cockpit/i }).click();
    await expect(page).toHaveURL(/\/studio\/deals\/riverside-flats\/underwriting$/);

    await gotoRoute(page, '/property/demo-002');
    await expect(page.getByRole('heading', { name: /4400 Research Blvd/i })).toBeVisible();
    const researchCompareCompsLink = page.getByRole('link', { name: /Compare comps/i });
    await expect(researchCompareCompsLink).toBeVisible();
    await researchCompareCompsLink.press('Enter');
    await expect(page).toHaveURL(/\/property\/demo-002\/comps$/);
    const researchPreviewReportLink = page.getByRole('link', { name: /Preview report/i });
    await expect(researchPreviewReportLink).toBeVisible();
    await researchPreviewReportLink.press('Enter');
    await expect(page).toHaveURL(/\/report\/demo-002$/);
    await page.getByRole('link', { name: /Continue to export gate/i }).click();
    await expect(page).toHaveURL(/\/export\/demo-002\?state=blocked$/);
    await page.getByRole('link', { name: /1200-tech/i }).click();
    await expect(page).toHaveURL(/\/studio\/deals\/1200-tech\/underwriting$/);
    await page.getByRole('link', { name: /Review capital stack/i }).click();
    await expect(page).toHaveURL(/\/studio\/deals\/1200-tech\/capital-stack$/);
  });
});
