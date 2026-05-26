import fs from 'fs';
import path from 'path';

const srcPath = 'src/pages/studio/DealRoutes.tsx';
const src = fs.readFileSync(srcPath, 'utf8');
const lines = src.split(/\r?\n/);

const headerEnd = lines.findIndex((l, i) => i > 100 && l.startsWith('const DEAL_DOCUMENT_EVIDENCE'));
const header = lines.slice(0, headerEnd).join('\n');

const sharedStart = headerEnd;
const sharedEnd = lines.findIndex((l) => l.startsWith('export function StudioDashboardPage'));
const sharedBody = lines.slice(sharedStart, sharedEnd).join('\n');

const exports = [
  ['StudioDashboardPage', 'StudioDashboardPage.tsx'],
  ['StudioDealOverviewPage', 'StudioDealOverviewPage.tsx'],
  ['StudioDealIntakePage', 'StudioDealIntakePage.tsx'],
  ['StudioCompsPage', 'StudioCompsPage.tsx'],
  ['StudioUnderwritingPage', 'StudioUnderwritingPage.tsx'],
  ['StudioScenarioComparisonPage', 'StudioScenarioComparisonPage.tsx'],
  ['StudioAssumptionSourceTracePage', 'StudioAssumptionSourceTracePage.tsx'],
  ['StudioDataReviewPage', 'StudioDataReviewPage.tsx'],
  ['StudioDebtPanelPage', 'StudioDebtPanelPage.tsx'],
  ['StudioValuationVersionTimelinePage', 'StudioValuationVersionTimelinePage.tsx'],
];

const outDir = 'src/pages/studio/deals';
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'deal-route-shared.ts'),
  sharedBody.replace(/^const /gm, 'export const ')
);

const exportIndexes = exports.map(([name]) =>
  lines.findIndex((l) => l.startsWith(`export function ${name}`))
);
const helperStart = lines.findIndex((l) => l.startsWith('function NormalizationCandidateCard'));
const helperEnd = lines.findIndex((l) => l.startsWith('export function StudioDebtPanelPage'));

const sharedImport =
  "\nimport {\n  DEAL_DOCUMENT_EVIDENCE,\n  ASSUMPTION_TRACE_ITEMS,\n  UNIT_CONFLICT_OPTIONS,\n  VERSION_SNAPSHOTS,\n  READINESS_ITEMS,\n} from './deal-route-shared';\n\n";

for (let i = 0; i < exports.length; i++) {
  const [name, file] = exports[i];
  const start = exportIndexes[i];
  let end = i + 1 < exports.length ? exportIndexes[i + 1] : lines.length;
  if (name === 'StudioUnderwritingPage') {
    end = exportIndexes[i + 1];
  }
  let body = lines.slice(start, end).join('\n').trimEnd();
  if (name === 'StudioDataReviewPage') {
    body += `\n\n${lines.slice(helperStart, helperEnd).join('\n').trimEnd()}`;
  }
  fs.writeFileSync(path.join(outDir, file), `${header}${sharedImport}${body}\n`);
}

const barrel = `${exports.map(([name, file]) => `export { ${name} } from './deals/${file.replace('.tsx', '')}';`).join('\n')}\n`;
fs.writeFileSync(srcPath, barrel);
console.log(`Split complete: ${exports.length} pages`);
