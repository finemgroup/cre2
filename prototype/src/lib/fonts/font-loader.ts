const STUDIO_FONT_ID = 'sophex-studio-inter-font';
const SYMBOLS_FONT_ID = 'sophex-material-symbols-font';

const STUDIO_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
const SYMBOLS_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';

function appendStylesheet(id: string, href: string): void {
  if (typeof document === 'undefined' || document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export function ensureStudioFonts(): void {
  appendStylesheet(STUDIO_FONT_ID, STUDIO_FONT_HREF);
}

export function ensureMaterialSymbolsFont(): void {
  appendStylesheet(SYMBOLS_FONT_ID, SYMBOLS_FONT_HREF);
}

export function ensureStudioSurfaceFonts(): void {
  ensureStudioFonts();
  ensureMaterialSymbolsFont();
}
