import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import Coursecard from './Coursecard'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { cinematic, scaleIn, theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const RecommendedSection = () => {
  const { recommendedCourses, userData } = useContext(AppContext)
  const { pageTheme } = usePageTheme()

  const { ref: headingRef, inView: headingInView } = useScrollAnimation()
  const { ref: gridRef,    inView: gridInView    } = useScrollAnimation()
  const { container, item } = cinematic

  if (!userData) return null
  const hasPersonalized = Array.isArray(recommendedCourses) && recommendedCourses.length > 0
  const displayCourses = hasPersonalized ? recommendedCourses : []
  const hasAny = displayCourses.length > 0

  return (
    <div
      className='w-full py-20 px-8 md:px-40'
      style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}
    >
      <motion.div
        ref={headingRef}
        variants={container}
        initial="hidden"
        animate="visible"
        className='flex flex-col items-center text-center gap-3'
      >
        <motion.p variants={item} className='text-xs uppercase tracking-widest'
          style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>
          Recommended
        </motion.p>

        <motion.h2 variants={item} className='text-3xl font-bold'
          style={{
            color: pageTheme.text,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            transition: 'color 0.4s ease'
          }}>
          {'Picks for you'}
        </motion.h2>

        <motion.div variants={item} className='w-12 h-px'
          style={{ background: theme.gradients.gold }} />

        <motion.p variants={item} className='text-sm leading-relaxed max-w-xl text-center'
          style={{
            color: pageTheme.textSec,
            fontFamily: "'DM Sans', sans-serif",
            transition: 'color 0.4s ease'
          }}>
          {hasPersonalized
            ? 'Based on your learning activity, these courses match your interests.'
            : 'We will personalize this once you start learning.'}
        </motion.p>
      </motion.div>

      <motion.div
        ref={gridRef}
        variants={scaleIn.container}
        initial="hidden"
        animate={gridInView ? 'visible' : 'hidden'}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-12'
      >
        {hasAny ? (
          displayCourses.map((course, index) => (
            <Coursecard key={course._id || index} course={course} />
          ))
        ) : (
          <p className='text-sm text-center col-span-full'
            style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>
            Recommendations will appear after you enroll or view a course.
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default RecommendedSection
