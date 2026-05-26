/**
 * @deprecated Split complete (Wave 17/20). Do not re-run — it will corrupt the barrel
 * and overwrite per-route modules with bloated import headers.
 *
 * Use `node scripts/validate-deal-routes.mjs` to verify the barrel matches `deals/*`.
 */
import fs from 'fs';
import path from 'path';

const barrelPath = 'src/pages/studio/DealRoutes.tsx';
const barrel = fs.readFileSync(barrelPath, 'utf8');
const isBarrelOnly =
  !barrel.includes('export function StudioDashboardPage') &&
  barrel.includes("from './deals/StudioDashboardPage'");

if (!isBarrelOnly) {
  console.error(
    'split-deal-routes.mjs is deprecated. DealRoutes.tsx is already split into deals/* modules.'
  );
  console.error('Re-running this script would corrupt route modules. Aborting.');
  process.exit(1);
}

console.log('Deal routes already split. No action taken.');
console.log('Validated barrel exports in', barrelPath);

const outDir = 'src/pages/studio/deals';
const expected = [
  'StudioDashboardPage.tsx',
  'StudioDealOverviewPage.tsx',
  'StudioDealIntakePage.tsx',
  'StudioCompsPage.tsx',
  'StudioUnderwritingPage.tsx',
  'StudioScenarioComparisonPage.tsx',
  'StudioAssumptionSourceTracePage.tsx',
  'StudioDataReviewPage.tsx',
  'StudioDebtPanelPage.tsx',
  'StudioValuationVersionTimelinePage.tsx',
];

const missing = expected.filter((file) => !fs.existsSync(path.join(outDir, file)));
if (missing.length > 0) {
  console.error('Missing deal route modules:', missing.join(', '));
  process.exit(1);
}

console.log(`All ${expected.length} deal route modules present.`);
