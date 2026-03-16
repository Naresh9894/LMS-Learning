import React from 'react'
import { motion } from 'framer-motion'
import { assets, dummyTestimonial } from '../../assets/assets'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { cinematic, scaleIn, theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const Testmonialsection = () => {
  const { pageTheme } = usePageTheme()  // ✅

  const { ref: headingRef, inView: headingInView } = useScrollAnimation()
  const { ref: gridRef,    inView: gridInView    } = useScrollAnimation()
  const { container, item } = cinematic

  // Light mode uses a warm subtle gradient, dark keeps the navy depth gradient
  const sectionBg = pageTheme.isDark
    ? 'linear-gradient(180deg, #050d1a 0%, #0a1628 50%, #050d1a 100%)'
    : 'linear-gradient(180deg, #f8f6f0 0%, #f0ebe0 50%, #f8f6f0 100%)'

  const cardHeaderBg = pageTheme.isDark
    ? 'rgba(212,168,67,0.06)'
    : 'rgba(212,168,67,0.08)'

  return (
    <div
      className='w-full py-10 px-8 md:px-40'
      style={{
        background: sectionBg,                                    // ✅
        boxShadow: 'inset 0 0 160px rgba(212,168,67,0.03)',
        transition: 'background 0.4s ease',
      }}
    >
      {/* Heading */}
      <motion.div
        ref={headingRef}
        variants={container}
        initial="hidden"
        animate={headingInView ? 'visible' : 'hidden'}
        className='flex flex-col items-center text-center gap-3 mb-14'
      >
        <motion.p variants={item} className='text-xs uppercase tracking-widest'
          style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>
          Student Stories
        </motion.p>

        <motion.h2 variants={item} className='text-3xl font-bold'
          style={{
            color: pageTheme.text,                                // ✅
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            transition: 'color 0.4s ease',
          }}>
          Testimonials
        </motion.h2>

        <motion.div variants={item} className='w-12 h-px'
          style={{ background: theme.gradients.gold }} />

        <motion.p variants={item} className='text-sm leading-relaxed max-w-xl'
          style={{
            color: pageTheme.textSec,                             // ✅
            fontFamily: "'DM Sans', sans-serif",
            transition: 'color 0.4s ease',
          }}>
          Hear from our learners as they share their journeys of transformation, success,
          and how our platform has made a difference in their lives.
        </motion.p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        ref={gridRef}
        variants={scaleIn.container}
        initial="hidden"
        animate={gridInView ? 'visible' : 'hidden'}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        {dummyTestimonial.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={scaleIn.item}
            whileHover={{ y: -5, boxShadow: `0 16px 40px rgba(212,168,67,${pageTheme.isDark ? '0.15' : '0.1'})` }}
            transition={{ type: 'spring', stiffness: 250, damping: 22 }}
            className='flex flex-col rounded-xl overflow-hidden'
            style={{
              background: pageTheme.bgCard,                       // ✅
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${pageTheme.border}`,            // ✅
              willChange: 'transform',
              boxShadow: pageTheme.isDark
                ? 'none'
                : '0 4px 16px rgba(0,0,0,0.06)',                  // ✅ soft shadow in light
              transition: 'background 0.4s ease, border-color 0.4s ease',
            }}
          >
            {/* Header */}
            <div
              className='flex items-center gap-4 px-5 py-4'
              style={{
                background: cardHeaderBg,                         // ✅
                borderBottom: `1px solid ${pageTheme.border}`,    // ✅
                transition: 'background 0.4s ease',
              }}
            >
              <img
                className='h-12 w-12 rounded-full object-cover'
                style={{ border: '2px solid rgba(212,168,67,0.4)' }}
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className='text-sm font-semibold'
                  style={{
                    color: pageTheme.text,                        // ✅
                    fontFamily: "'Cormorant Garamond', serif",
                    transition: 'color 0.4s ease',
                  }}>
                  {testimonial.name}
                </h1>
                <p className='text-xs'
                  style={{ color: theme.gold.pure, fontFamily: "'DM Sans', sans-serif" }}>
                  {testimonial.role}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className='p-5 flex flex-col flex-1 gap-3'>
              {/* Stars */}
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <img key={i} className='h-4'
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt='star'
                    style={{ filter: i < Math.floor(testimonial.rating) ? 'sepia(1) saturate(4) hue-rotate(5deg)' : 'brightness(0.4)' }}
                  />
                ))}
              </div>

              {/* Feedback */}
              <p className='text-sm leading-relaxed flex-1'
                style={{
                  color: pageTheme.textSec,                       // ✅
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'color 0.4s ease',
                }}>
                {testimonial.feedback}
              </p>

              {/* Read more */}
              <motion.a href='#' className='text-xs font-semibold w-fit'
                style={{ color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}
                whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}>
                Read more →
              </motion.a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Testmonialsection