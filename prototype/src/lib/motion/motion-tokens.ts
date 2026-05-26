import type { MotionProps, Transition } from 'framer-motion';

export type MotionSpec = {
  initial?: MotionProps['initial'];
  animate?: MotionProps['animate'];
  exit?: MotionProps['exit'];
  transition?: Transition;
};

export type SophexMotionSpecName =
  | 'reveal'
  | 'stageItem'
  | 'listStagger'
  | 'railEnter'
  | 'navRail'
  | 'tabPanel'
  | 'workbenchPanel'
  | 'mapSelection'
  | 'collapse'
  | 'sheetBackdrop'
  | 'sheetPanel'
  | 'drawerRight';

export type SophexMotionSpecAlias = 'listReveal';

export const MOTION_DURATION_MS = {
  instantFeedback: 100,
  standardReveal: 180,
  emphasizedContinuity: 260,
  review: 220,
} as const;

export const MOTION_EASING = {
  standard: [0.2, 0, 0, 1] as const,
  emphasize: [0.16, 1, 0.3, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  linear: 'linear' as const,
};

function msToSeconds(ms: number): number {
  return ms / 1000;
}

export const LIST_STAGGER_CHILD_DELAY_S = 0.06;

export const SOPHEX_MOTION_SPECS: Record<SophexMotionSpecName, MotionSpec> = {
  reveal: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.standardReveal),
      ease: MOTION_EASING.standard,
    },
  },
  stageItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.instantFeedback),
      ease: MOTION_EASING.standard,
    },
  },
  listStagger: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.standardReveal),
      ease: MOTION_EASING.standard,
    },
  },
  railEnter: {
    initial: { opacity: 0, x: -6 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -4 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.instantFeedback),
      ease: MOTION_EASING.standard,
    },
  },
  navRail: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -6 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.review),
      ease: MOTION_EASING.emphasize,
    },
  },
  tabPanel: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.standardReveal),
      ease: MOTION_EASING.standard,
    },
  },
  workbenchPanel: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.review),
      ease: MOTION_EASING.standard,
    },
  },
  mapSelection: {
    initial: { opacity: 0, scale: 0.985 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.99 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.standardReveal),
      ease: MOTION_EASING.standard,
    },
  },
  collapse: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.review),
      ease: MOTION_EASING.standard,
    },
  },
  sheetBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.instantFeedback),
      ease: MOTION_EASING.standard,
    },
  },
  sheetPanel: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.emphasizedContinuity),
      ease: MOTION_EASING.emphasize,
    },
  },
  drawerRight: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      duration: msToSeconds(MOTION_DURATION_MS.standardReveal),
      ease: MOTION_EASING.emphasize,
    },
  },
};

export function getMotionSpec(name: SophexMotionSpecName | SophexMotionSpecAlias): MotionSpec {
  if (name === 'listReveal') return SOPHEX_MOTION_SPECS.listStagger;
  return SOPHEX_MOTION_SPECS[name];
}

export function getMotionProps(
  spec: MotionSpec,
  reducedMotion = false
): Pick<MotionProps, 'initial' | 'animate' | 'exit' | 'transition'> {
  if (reducedMotion) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0.01 },
    };
  }

  return {
    initial: spec.initial,
    animate: spec.animate,
    exit: spec.exit,
    transition: spec.transition,
  };
}

export const WORKFLOW_TRANSITION_PRESETS = {
  page: SOPHEX_MOTION_SPECS.reveal,
  section: SOPHEX_MOTION_SPECS.stageItem,
  list: SOPHEX_MOTION_SPECS.listStagger,
  rail: SOPHEX_MOTION_SPECS.railEnter,
  navRail: SOPHEX_MOTION_SPECS.navRail,
  tabPanel: SOPHEX_MOTION_SPECS.tabPanel,
  workbenchPanel: SOPHEX_MOTION_SPECS.workbenchPanel,
  mapSelection: SOPHEX_MOTION_SPECS.mapSelection,
  drawerRight: SOPHEX_MOTION_SPECS.drawerRight,
} as const;

export type WorkflowTransitionPreset = keyof typeof WORKFLOW_TRANSITION_PRESETS;

export function getWorkflowTransitionProps(
  preset: WorkflowTransitionPreset,
  reducedMotion = false
) {
  return getMotionProps(WORKFLOW_TRANSITION_PRESETS[preset], reducedMotion);
}
