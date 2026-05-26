const STORAGE_KEY = 'sophex-presentation-mode';

export function readPresentationMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function writePresentationMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
}
