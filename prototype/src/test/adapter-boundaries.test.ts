import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const pagesDir = join(process.cwd(), 'src/pages');
const bannedDataImports = ['mockProperties', 'mockComps', 'mockReportSections'];
const bannedStudioImports = [
  'agentCapabilities',
  'comps',
  'deals',
  'getStudioDeal',
  'jobStreams',
  'reportSections',
];

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

describe('adapter import boundaries', () => {
  it('keeps page-level routes from importing raw mock datasets when adapters exist', () => {
    const offenders = collectFiles(pagesDir).flatMap((file) => {
      if (!/\.(tsx|ts)$/.test(file)) return [];
      const source = readFileSync(file, 'utf8');
      const mockImport = source.match(/import\s+\{([^}]+)\}\s+from ['"]@\/data\/mock['"]/);
      const studioImport = source.match(/import\s+\{([^}]+)\}\s+from ['"]@\/data\/studio['"]/);
      const matches = [
        ...bannedDataImports.filter((name) => mockImport?.[1].includes(name)),
        ...bannedStudioImports.filter((name) => studioImport?.[1].includes(name)),
      ];
      return matches.length > 0 ? [`${file}: ${matches.join(', ')}`] : [];
    });

    expect(offenders).toEqual([]);
  });
});
