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

  test('export gate surfaces review readiness blockers', async ({ page }) => {
    await gotoRoute(page, '/export/demo-001?state=provider-restricted');
    await expect(
      page.getByRole('heading', { name: /Review readiness for 1200 Commerce St/i })
    ).toBeVisible();
    await expect(page.getByText(/Provider-restricted comps cannot ship/i)).toBeVisible();
    await expect(page.getByText(/Premium-private comp rows are summary-only/i)).toBeVisible();
    await expect(page.getByText(/Prototype-only\. No live export/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Generate export receipt disabled/i })
    ).toBeDisabled();
    await page.getByRole('button', { name: /Review blockers/i }).click();
    await expect(page.getByRole('dialog', { name: /Export blocked/i })).toBeVisible();
  });

  test('export fixture states keep generation disabled', async ({ page }) => {
    await gotoRoute(page, '/export/demo-001?state=low-evidence');
    await page.getByRole('radio', { name: /preview/i }).check();
    await expect(page.getByText(/Evidence coverage below export threshold/i)).toBeVisible();
    await expect(page.getByText(/low evidence coverage cannot support export/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Generate export receipt disabled/i })
    ).toBeDisabled();
  });

  test('review queue renders source gaps and keeps export gated', async ({ page }) => {
    await gotoRoute(page, '/review/demo-001?state=provider-restricted');
    await expect(
      page.getByRole('heading', { name: /Review queue for 1200 Commerce St/i })
    ).toBeVisible();
    await expect(page.getByText(/Source gap register/i)).toBeVisible();
    await expect(page.getByText(/Provider-restricted/i).first()).toBeVisible();
    await expect(page.getByText(/Premium comp row/i).first()).toBeVisible();
    await expect(
      page.locator('.page-header').getByText(/Prototype-only \/ no live approval/i)
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
    const markReviewed = page
      .getByRole('button', { name: /Mark gap reviewed \(prototype\)/i })
      .first();
    await markReviewed.scrollIntoViewIfNeeded();
    await markReviewed.click({ force: true });
    await expect(page.getByText(/Export remains gated/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
  });

  test('review queue low-evidence state shows blocker posture', async ({ page }) => {
    await gotoRoute(page, '/review/demo-001?state=low-evidence');
    await expect(page.locator('.page-header').getByText(/Thin citation pack/i)).toBeVisible();
    await expect(page.getByText(/Evidence coverage below export threshold/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
    const exportGateLink = page.getByRole('link', { name: /Return to export gate/i });
    await exportGateLink.scrollIntoViewIfNeeded();
    await exportGateLink.press('Enter');
    await expect(page).toHaveURL(/\/export\/demo-001\?state=low-evidence/);
  });

  test('export gate links into review queue with fixture continuity', async ({ page }) => {
    await gotoRoute(page, '/export/demo-001?state=blocked');
    const reviewLink = page.getByRole('link', { name: /Open source gap review queue/i });
    await reviewLink.scrollIntoViewIfNeeded();
    await reviewLink.press('Enter');
    await expect(page).toHaveURL(/\/review\/demo-001\?state=blocked/);
    await page.getByRole('link', { name: /Return to report preview/i }).press('Enter');
    await expect(page).toHaveURL(/\/report\/demo-001\?state=blocked/);
  });

  test('source pack renders citations and keeps export gated', async ({ page }) => {
    await gotoRoute(page, '/sources/demo-001?state=provider-restricted');
    await expect(
      page.getByRole('heading', { name: /Source pack for 1200 Commerce St/i })
    ).toBeVisible();
    await expect(page.getByText(/Citation Drilldown/i).first()).toBeVisible();
    await expect(
      page.getByText(/Prototype-only \/ no live source retrieval/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Provider-restricted sources cannot be exported directly/i).first()
    ).toBeVisible();
    await expect(page.getByText(/Premium-private comp row/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
    const expand = page.getByRole('button', { name: /Expand citation detail/i }).first();
    await expand.scrollIntoViewIfNeeded();
    await expand.click({ force: true });
    await expect(
      page.getByText(/Prototype-only; does not clear export gates/i).first()
    ).toBeVisible();
  });

  test('source pack low-evidence state shows thin citation posture', async ({ page }) => {
    await gotoRoute(page, '/sources/demo-001?state=low-evidence');
    await expect(page.locator('.page-header').getByText(/Thin citation pack/i)).toBeVisible();
    await expect(
      page.getByText(/Low-evidence source pack requires reviewer action/i).first()
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate export disabled/i })).toBeDisabled();
  });

  test('review queue links into source pack with fixture continuity', async ({ page }) => {
    await gotoRoute(page, '/review/demo-001?state=blocked');
    const sourceLink = page.getByRole('link', { name: /Open source pack/i });
    await sourceLink.scrollIntoViewIfNeeded();
    await sourceLink.press('Enter');
    await expect(page).toHaveURL(/\/sources\/demo-001\?state=blocked/);
    await expect(
      page.getByText(/Blocked state requires source-rights and reviewer clearance/i).first()
    ).toBeVisible();
    await page.getByRole('link', { name: /Return to review queue/i }).press('Enter');
    await expect(page).toHaveURL(/\/review\/demo-001\?state=blocked/);
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
