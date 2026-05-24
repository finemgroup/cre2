import { expect, type Page } from '@playwright/test';

export async function gotoRoute(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Loading view…/i)).toBeHidden({ timeout: 15_000 });
}

export async function stabilizePage(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        font-family: Arial, Helvetica, sans-serif !important;
      }
      .material-symbols-outlined {
        font-family: 'Material Symbols Outlined' !important;
      }
    `,
  });
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  });
}
