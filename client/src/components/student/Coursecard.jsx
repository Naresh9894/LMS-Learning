import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const Coursecard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)
  const { pageTheme } = usePageTheme()

  const rating      = calculateRating(course)
  const ratingCount = (course.ratings || course.courseRatings || []).length
  const price       = (course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)
  const hasDiscount = course.discount > 0

  // ✅ FIX 1 — safe educator name, won't crash when educator is a string ID
  const educatorName = typeof course.educator === 'object'
    ? course.educator?.name || 'Instructor'
    : 'Instructor'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: `0 16px 40px rgba(212,168,67,${pageTheme.isDark ? '0.25' : '0.15'})` }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      style={{ willChange: 'transform' }}
      className='h-full'
    >
      <Link
        to={'/course/' + course._id}
        onClick={() => scrollTo(0, 0)}
        className='flex flex-col h-full overflow-hidden rounded-xl'
        style={{
          background: pageTheme.bgCard,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${pageTheme.border}`,
          boxShadow: pageTheme.isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.08)',
          textDecoration: 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Thumbnail */}
        <div className='overflow-hidden flex-shrink-0'>
          <motion.img className='w-full object-cover' style={{ height: '160px' }}
            src={course.courseThumbnail} alt={course.courseTitle}
            whileHover={{ scale: 1.05 }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </div>

        {/* Card body */}
        <div className='p-4 flex flex-col flex-1 gap-1.5'>

          {/* Title */}
          <h3 className='text-base font-semibold leading-snug line-clamp-2'
            style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', transition: 'color 0.4s ease' }}>
            {course.courseTitle}
          </h3>

          {/* ✅ Safe educator name */}
          <p className='text-xs'
            style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
            {educatorName}
          </p>

          {/* ✅ FIX 2 — CSS stars instead of broken image assets */}
          <div className='flex items-center gap-1.5'>
            <span className='text-xs font-bold' style={{ color: theme.gold.bright }}>{rating}</span>
            <div className='flex gap-0.5'>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ fontSize: '12px', color: i < Math.floor(rating) ? theme.gold.bright : 'rgba(212,168,67,0.25)', lineHeight: 1 }}>★</span>
              ))}
            </div>
            <p className='text-xs' style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>({ratingCount})</p>
          </div>

          <div className='flex-1' />

          {/* Gold divider */}
          <div className='w-full h-px mb-1'
            style={{ background: 'linear-gradient(to right, rgba(212,168,67,0.4), transparent)' }} />

          {/* Price row */}
          <div className='flex items-center justify-between'>
            <div className='flex items-baseline gap-2'>
              <span className='font-bold'
                style={{ fontSize: '1rem', color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
                {currency}{price}
              </span>
              {hasDiscount && (
                <span className='text-xs line-through' style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>
                  {currency}{course.coursePrice}
                </span>
              )}
            </div>
            <motion.span className='text-xs font-semibold'
              style={{ color: theme.gold.pure, fontFamily: "'DM Sans', sans-serif" }}
              whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}>
              Enroll →
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default Coursecard