import { Variants } from "framer-motion";

/**
 * Standard transition for most UI elements
 */
export const SPRING_TRANSITION = {
  type: "spring",
  bounce: 0,
  duration: 0.4,
} as const;

export const SPRING_BOUNCE_TRANSITION = {
  type: "spring",
  bounce: 0.2,
  duration: 0.6,
} as const;

/**
 * Entrance Animations
 */
export const FADE_IN: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const SLIDE_UP: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * Staggered Container & Items
 */
export const STAGGER_CONTAINER: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const STAGGER_ITEM: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: SPRING_TRANSITION 
  },
};

/**
 * Dropdowns & Modals
 */
export const DROPDOWN_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

export const MODAL_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

/**
 * Content Expansion (Accordions, Feed Actions)
 */
export const HEIGHT_TRANSITION: Variants = {
  initial: { opacity: 0, y: -4 },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  },
};

/**
 * Tab Indicators
 */
export const TAB_INDICATOR_TRANSITION = {
  type: "spring",
  bounce: 0.2,
  duration: 0.6,
} as const;
