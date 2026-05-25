/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local',
      url: [
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/upload',
        'http://127.0.0.1:4173/property/demo-001',
        'http://127.0.0.1:4173/property/demo-001/comps',
        'http://127.0.0.1:4173/report/demo-001',
        'http://127.0.0.1:4173/export/demo-001',
        'http://127.0.0.1:4173/studio/dashboard',
        'http://127.0.0.1:4173/studio/deals/riverside-flats/underwriting',
        'http://127.0.0.1:4173/studio/settings/billing',
        'http://127.0.0.1:4173/studio/reports/riverside-flats/builder',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
