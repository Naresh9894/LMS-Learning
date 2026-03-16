import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { cinematic, theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const CallToAction = () => {
  const { ref, inView } = useScrollAnimation()
  const { container, item } = cinematic
  const { pageTheme } = usePageTheme()  // ✅

  // Light mode: warm cream with subtle gradient
  const sectionBg = pageTheme.isDark
    ? theme.navy.deepest
    : 'linear-gradient(180deg, #f0ebe0 0%, #f8f6f0 100%)'

  return (
    <div
      className='w-full py-24 px-8 md:px-0 relative overflow-hidden'
      style={{ background: sectionBg, transition: 'background 0.4s ease' }}  // ✅
    >
      {/* Gold glow behind content */}
      <motion.div
        className='absolute rounded-full blur-3xl pointer-events-none'
        style={{
          width: '500px', height: '300px',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: pageTheme.isDark ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3] }}  // ✅ dimmer in light
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top gold line */}
      <div className='absolute top-0 left-0 right-0 h-px'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className='relative z-10 flex flex-col items-center gap-5 text-center max-w-2xl mx-auto'
      >
        {/* Eyebrow */}
        <motion.p variants={item} className='text-xs uppercase tracking-widest'
          style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>
          Start Today
        </motion.p>

        {/* Heading */}
        <motion.h1 variants={item} className='font-bold leading-tight'
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            color: pageTheme.text,                                // ✅
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            transition: 'color 0.4s ease',
          }}>
          Learn anything, anytime, anywhere
        </motion.h1>

        {/* Gold divider */}
        <motion.div variants={item} className='w-12 h-px'
          style={{ background: theme.gradients.gold }} />

        {/* Subtitle */}
        <motion.p variants={item} className='text-sm leading-relaxed'
          style={{
            color: pageTheme.textSec,                             // ✅
            fontFamily: "'DM Sans', sans-serif",
            transition: 'color 0.4s ease',
          }}>
          It's not about being the best. It's about being better than you were yesterday.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={item} className='flex items-center gap-6 mt-2'>

          {/* Primary — gold always */}
          <motion.button
            className='px-10 py-3 rounded-md text-sm font-semibold'
            style={{
              background: theme.gradients.gold,
              color: theme.navy.deepest,
              fontFamily: "'DM Sans', sans-serif",
              willChange: 'transform',
            }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 28px rgba(212,168,67,0.45)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Get Started
          </motion.button>

          {/* Secondary — ghost */}
          <motion.button
            className='flex items-center gap-2 text-sm font-medium'
            style={{
              color: pageTheme.textSec,                           // ✅
              fontFamily: "'DM Sans', sans-serif",
              willChange: 'transform',
              transition: 'color 0.2s ease',
            }}
            whileHover={{ color: theme.gold.bright, x: 2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Learn more
            <motion.img
              src={assets.arrow_icon}
              alt='arrow'
              className='w-4 h-4'
              style={{ filter: pageTheme.isDark ? 'brightness(0.6)' : 'brightness(0.3)' }}  // ✅
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400 }}
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom gold line */}
      <div className='absolute bottom-0 left-0 right-0 h-px'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />
    </div>
  )
}

export default CallToAction