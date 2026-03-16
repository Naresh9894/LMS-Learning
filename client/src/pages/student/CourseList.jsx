import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import Coursecard from '../../components/student/Coursecard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'
import { theme, scaleIn } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext)
  const { pageTheme } = usePageTheme()  // ✅
  const { input } = useParams()
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice()
      input
        ? setFilteredCourse(tempCourses.filter(item => item.courseTitle.toLowerCase().includes(input.toLowerCase())))
        : setFilteredCourse(tempCourses)
    }
  }, [allCourses, input])

  return (
    <div style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}>
      <div className='relative md:px-36 px-8 pt-20 pb-16 text-left min-h-screen'>

        {/* Dot grid */}
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,${pageTheme.isDark ? '0.05' : '0.08'}) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className='flex md:flex-row flex-col gap-6 items-start justify-between w-full relative z-10'>
          <div>
            <p className='text-xs uppercase tracking-widest mb-1'
              style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Explore</p>
            <h1 className='text-4xl font-semibold'
              style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
              Course List
            </h1>
            <p className='text-sm mt-1' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
              <span className='cursor-pointer' style={{ color: theme.gold.bright }} onClick={() => navigate('/')}>Home</span>
              {' / '}
              <span style={{ color: pageTheme.textMuted }}>Course List</span>
            </p>
            <motion.div className='w-10 h-px mt-3' style={{ background: theme.gradients.gold }}
              initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }} />
          </div>
          <SearchBar data={input} />
        </motion.div>

        {/* Filter badge */}
        <AnimatePresence>
          {input && (
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.25 }}
              className='inline-flex items-center gap-3 px-4 py-2 rounded-full mt-8 relative z-10'
              style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.3)' }}>
              <p className='text-sm' style={{ color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>"{input}"</p>
              <motion.img src={assets.cross_icon} alt="clear" className='cursor-pointer w-3 h-3'
                style={{ filter: pageTheme.isDark ? 'brightness(4)' : 'brightness(0.2)' }}
                whileHover={{ scale: 1.3, rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => navigate('/course-list')} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
          className='text-sm mt-6 relative z-10'
          style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
          {filteredCourse.length} {filteredCourse.length === 1 ? 'course' : 'courses'} found
          {input ? ` for "${input}"` : ''}
        </motion.p>

        {/* Course grid */}
        <motion.div variants={scaleIn.container} initial="hidden" animate="visible"
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-8 gap-5 relative z-10'>
          <AnimatePresence>
            {filteredCourse.map((course, index) => (
              <motion.div key={course._id || index} variants={scaleIn.item} layout
                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                <Coursecard course={course} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filteredCourse.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className='flex flex-col items-center justify-center py-24 relative z-10'>
              <p className='text-5xl mb-4' style={{ color: 'rgba(212,168,67,0.3)' }}>✦</p>
              <p className='text-xl font-semibold mb-2'
                style={{ color: pageTheme.textSec, fontFamily: "'Cormorant Garamond', serif", transition: 'color 0.4s ease' }}>
                No courses found
              </p>
              <p className='text-sm mb-6' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                Try a different search term
              </p>
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(212,168,67,0.3)' }}
                whileTap={{ scale: 0.97 }} onClick={() => navigate('/course-list')}
                className='px-6 py-2.5 rounded-full text-sm font-medium'
                style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif" }}>
                View All Courses
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}

export default CourseList