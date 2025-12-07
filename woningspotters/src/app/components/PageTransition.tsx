'use client';

import { motion, Transition, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// ============================================
// ANIMATIE CONFIGURATIE - PAS HIER AAN
// ============================================
const transitionConfig: Transition = {
  type: 'tween',        // 'tween' voor lineair, 'spring' voor bounce effect
  duration: 0.4,        // Snelheid in seconden (0.3 = snel, 0.6 = langzaam)
  ease: 'easeInOut',    // 'easeIn', 'easeOut', 'easeInOut', 'linear'
};

// Slide varianten - van rechts naar links
const slideVariants: Variants = {
  initial: {
    x: '100%',          // Start positie (100% = rechts, -100% = links)
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: '-100%',         // Exit positie (-100% = naar links, 100% = naar rechts)
    opacity: 0,
  },
};

// ============================================
// ALTERNATIEVE ANIMATIES (uncomment om te gebruiken)
// ============================================

// Fade only
// const slideVariants: Variants = {
//   initial: { opacity: 0 },
//   animate: { opacity: 1 },
//   exit: { opacity: 0 },
// };

// Slide van onder naar boven
// const slideVariants: Variants = {
//   initial: { y: '100%', opacity: 0 },
//   animate: { y: 0, opacity: 1 },
//   exit: { y: '-100%', opacity: 0 },
// };

// Zoom + Fade
// const slideVariants: Variants = {
//   initial: { scale: 0.8, opacity: 0 },
//   animate: { scale: 1, opacity: 1 },
//   exit: { scale: 1.2, opacity: 0 },
// };

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideVariants}
      transition={transitionConfig}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}
