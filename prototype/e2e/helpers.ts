import { expect, type Page } from '@playwright/test';

const STABILIZATION_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
    font-family: Arial, Helvetica, sans-serif !important;
  }
  html, body, #root {
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }
  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined' !important;
  }
`;

export async function gotoRoute(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Loading view…/i)).toBeHidden({ timeout: 15_000 });
}

export async function stabilizePage(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript((css) => {
    const applyStabilizationStyles = () => {
      if (document.querySelector('[data-sophex-e2e-stabilization]')) return;
      const style = document.createElement('style');
      style.dataset.sophexE2eStabilization = 'true';
      style.textContent = css;
      document.head.appendChild(style);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyStabilizationStyles, { once: true });
    } else {
      applyStabilizationStyles();
    }
  }, STABILIZATION_CSS);
  await page.addStyleTag({
    content: STABILIZATION_CSS,
  });
  await page.evaluate((css) => {
    if (!document.querySelector('[data-sophex-e2e-stabilization]')) {
      const style = document.createElement('style');
      style.dataset.sophexE2eStabilization = 'true';
      style.textContent = css;
      document.head.appendChild(style);
    }
  }, STABILIZATION_CSS);
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  });
}
