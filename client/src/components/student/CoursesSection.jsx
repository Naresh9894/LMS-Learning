import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Coursecard from './Coursecard'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { cinematic, scaleIn, theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)
  const { pageTheme } = usePageTheme()  // ✅

  const { ref: headingRef, inView: headingInView } = useScrollAnimation()
  const { ref: gridRef,    inView: gridInView    } = useScrollAnimation()
  const { ref: btnRef,     inView: btnInView     } = useScrollAnimation()
  const { container, item } = cinematic

  return (
    <div
      className='w-full py-20 px-4 sm:px-8 md:px-40'
      style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}
    >
      {/* ── Heading ── */}
      <motion.div
        ref={headingRef}
        variants={container}
        initial="hidden"
        animate={headingInView ? 'visible' : 'hidden'}
        className='flex flex-col items-center text-center gap-3'
      >
        <motion.p variants={item} className='text-xs uppercase tracking-widest'
          style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>
          Featured Courses
        </motion.p>

        <motion.h2 variants={item} className='text-3xl font-bold'
          style={{
            color: pageTheme.text,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            transition: 'color 0.4s ease'
          }}>
          Learn from the best
        </motion.h2>

        <motion.div variants={item} className='w-12 h-px'
          style={{ background: theme.gradients.gold }} />

        <motion.p variants={item} className='text-sm leading-relaxed max-w-xl text-center'
          style={{
            color: pageTheme.textSec,
            fontFamily: "'DM Sans', sans-serif",
            transition: 'color 0.4s ease'
          }}>
          Discover our top-rated courses across various categories. From coding and design to
          business and wellness, our courses are crafted to deliver results.
        </motion.p>
      </motion.div>

      {/* ── Course grid ── */}
      <motion.div
        ref={gridRef}
        variants={scaleIn.container}
        initial="hidden"
        animate={gridInView ? 'visible' : 'hidden'}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-12'
      >
        {allCourses.slice(0, 4).map((course, index) => (
          <Coursecard key={index} course={course} />
        ))}
      </motion.div>

      {/* ── Show all button ── */}
      <motion.div
        ref={btnRef}
        initial={{ opacity: 0, y: 20 }}
        animate={btnInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex justify-center'
      >
        <motion.div
          whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(212,168,67,0.2)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{ willChange: 'transform' }}
        >
          <Link
            to='/course-list'
            onClick={() => scrollTo(0, 0)}
            className='inline-block px-10 py-3 rounded text-sm font-semibold tracking-wide'
            style={{
              color: theme.gold.bright,
              border: '1px solid rgba(212,168,67,0.35)',
              background: 'rgba(212,168,67,0.05)',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.05em',
            }}
          >
            Show all courses
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CoursesSection
