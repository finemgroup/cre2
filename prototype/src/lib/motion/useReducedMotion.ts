import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/** Canonical reduced-motion source for Sophex prototype. */
export function useReducedMotionPreference(): boolean {
  return Boolean(useFramerReducedMotion());
}
