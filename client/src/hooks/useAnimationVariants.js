/**
 * useAnimationVariants
 * --------------------
 * Central hub for all Framer Motion variants.
 * Color theme: Deep Navy + Gold
 *
 * Usage:
 *   import { cinematic, fadeUp, slideInLeft, scaleIn, hoverGlow, theme } from '../../hooks/useAnimationVariants'
 */

// ── Brand Theme Tokens ────────────────────────────────────────────────────────
export const theme = {
  navy: {
    deepest:  '#050d1a',
    deep:     '#0a1628',
    mid:      '#0f2040',
    soft:     '#1a3460',
    muted:    '#2a4a7f',
  },
  gold: {
    pure:     '#d4a843',
    bright:   '#f0c455',
    light:    '#f7d98b',
    glow:     'rgba(212,168,67,0.25)',
    glowSoft: 'rgba(212,168,67,0.08)',
  },
  text: {
    primary:  '#f0e6cc',
    secondary:'#a8b8d0',
    muted:    '#5a7a9a',
  },
  gradients: {
    gold:     'linear-gradient(135deg, #d4a843 0%, #f0c455 50%, #f7d98b 100%)',
    navy:     'linear-gradient(135deg, #0a1628 0%, #0f2040 100%)',
    heroBase: 'linear-gradient(160deg, #050d1a 0%, #0a1628 40%, #0d1e38 70%, #050d1a 100%)',
    glow:     'radial-gradient(circle, rgba(212,168,67,0.18) 0%, transparent 70%)',
    glowBlue: 'radial-gradient(circle, rgba(30,80,160,0.3) 0%, transparent 70%)',
  }
}

// ── Cinematic (blur + fade + rise) ───────────────────────────────────────────
export const cinematic = {
  container: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.18, delayChildren: 0.1 },
    },
  },
 // cinematic item — FIXED (smooth)
item: {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
},
}

// ── Fade Up (no blur — lighter feel) ─────────────────────────────────────────
export const fadeUp = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  },
  item: {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
}

// ── Slide In Left ─────────────────────────────────────────────────────────────
export const slideInLeft = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  },
  item: {
    hidden:  { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
}

// ── Scale In (spring overshoot — great for cards) ─────────────────────────────
export const scaleIn = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  },
  item: {
    hidden:  { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1, scale: 1,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
    },
  },
}

// ── Hover Variants ────────────────────────────────────────────────────────────
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap:   { scale: 0.97 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
}

export const hoverGlow = {
  whileHover: {
    scale: 1.03,
    boxShadow: '0 0 35px rgba(212,168,67,0.35)',
  },
  whileTap:   { scale: 0.97 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
}