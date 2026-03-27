import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import Coursecard from '../../components/student/Coursecard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'
import { theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const CATEGORIES = [
  { label: 'All Courses',           icon: '🎓', value: 'all'                   },
  { label: 'Technology',            icon: '💻', value: 'Technology'             },
  { label: 'Web Development',       icon: '🌐', value: 'Web Development'        },
  { label: 'Programming Languages', icon: '🧑🏻‍💻', value: 'Programming Languages'  },
  { label: 'AI & Machine Learning', icon: '🤖', value: 'AI & Machine Learning'  },
  { label: 'Design',                icon: '🎨', value: 'Design'                 },
  { label: 'Photography',           icon: '📸', value: 'Photography'            },
  { label: 'Travel',                icon: '✈️', value: 'Travel'                 },
  { label: 'Business',              icon: '💼', value: 'Business'               },
  { label: 'Music',                 icon: '🎵', value: 'Music'                  },
  { label: 'Health & Fitness',      icon: '💪', value: 'Health & Fitness'       },
  { label: 'Language',              icon: '🗣️', value: 'Language'               },
  { label: 'Finance',               icon: '📈', value: 'Finance'                },
  { label: 'Marketing',             icon: '📢', value: 'Marketing'              },
]

const SORT_OPTIONS = [
  { label: 'Newest First',    value: 'newest'    },
  { label: 'Most Popular',    value: 'popular'   },
  { label: 'Highest Rated',   value: 'rating'    },
  { label: 'Price: Low→High', value: 'price_asc' },
  { label: 'Price: High→Low', value: 'price_desc'},
]

// ── Filter Chip ───────────────────────────────────────────────────────────────
const Chip = ({ label, onRemove }) => (
  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
    className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium'
    style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
    {label}
    <motion.button onClick={onRemove} whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.gold.bright, padding: 0, lineHeight: 1 }}>✕</motion.button>
  </motion.div>
)

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ activeCategory, setActiveCategory, filters, setFilters, counts, pageTheme }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className='flex flex-col gap-6'>
      {/* Departments */}
      <div>
        <p className='text-xs uppercase tracking-widest mb-3 px-1'
          style={{ color: theme.gold.pure, letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif" }}>
          Departments
        </p>
        <div className='flex flex-col gap-0.5'>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value
            const count = cat.value === 'all'
              ? Object.values(counts).reduce((a, b) => a + b, 0)
              : (counts[cat.value] || 0)
            return (
              <motion.button key={cat.value}
                onClick={() => { setActiveCategory(cat.value); setMobileOpen(false) }}
                whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300 }}
                className='flex items-center justify-between px-3 py-2.5 rounded-xl text-left w-full'
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(212,168,67,0.3)' : '1px solid transparent',
                  borderLeft: isActive ? `3px solid ${theme.gold.bright}` : '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}>
                <div className='flex items-center gap-2.5'>
                  <span className='text-base'>{cat.icon}</span>
                  <span className='text-sm' style={{ color: isActive ? theme.gold.bright : pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 600 : 400 }}>
                    {cat.label}
                  </span>
                </div>
                <span className='text-xs px-1.5 py-0.5 rounded-full'
                  style={{ background: isActive ? 'rgba(212,168,67,0.2)' : pageTheme.isDark ?  'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: isActive ? theme.gold.bright : pageTheme.textMuted }}>
                  {count}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className='h-px' style={{ background: pageTheme.border }} />

      {/* Free Only */}
      <div>
        <p className='text-xs uppercase tracking-widest mb-3 px-1' style={{ color: theme.gold.pure, letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif" }}>Price</p>
        <button onClick={() => setFilters(f => ({ ...f, freeOnly: !f.freeOnly }))}
          className='flex items-center gap-3 px-3 py-2.5 rounded-xl w-full'
          style={{ background: filters.freeOnly ? 'rgba(212,168,67,0.1)' : 'transparent', border: `1px solid ${filters.freeOnly ? 'rgba(212,168,67,0.35)' : pageTheme.border}`, transition: 'all 0.2s ease' }}>
          <div className='w-4 h-4 rounded flex items-center justify-center flex-shrink-0'
            style={{ background: filters.freeOnly ? theme.gradients.gold : 'transparent', border: `1.5px solid ${filters.freeOnly ? 'transparent' : 'rgba(212,168,67,0.4)'}` }}>
            {filters.freeOnly && <span style={{ color: theme.navy.deepest, fontSize: '10px', fontWeight: 700 }}>✓</span>}
          </div>
          <span className='text-sm' style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>Free Courses Only</span>
        </button>
      </div>

      {/* Min Rating */}
      <div>
        <p className='text-xs uppercase tracking-widest mb-3 px-1' style={{ color: theme.gold.pure, letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif" }}>Min Rating</p>
        <div className='flex flex-col gap-1.5'>
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setFilters(f => ({ ...f, minRating: r }))}
              className='flex items-center gap-2 px-3 py-2 rounded-xl w-full'
              style={{ background: filters.minRating === r ? 'rgba(212,168,67,0.1)' : 'transparent', border: `1px solid ${filters.minRating === r ? 'rgba(212,168,67,0.3)' : 'transparent'}` }}>
              <div className='flex gap-0.5'>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: s <= Math.ceil(r) ? theme.gold.bright : pageTheme.textMuted, fontSize: '12px' }}>★</span>
                ))}
              </div>
              <span className='text-xs' style={{ color: filters.minRating === r ? theme.gold.bright : pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>
                {r === 0 ? 'Any rating' : `${r}+ stars`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className='text-xs uppercase tracking-widest mb-3 px-1' style={{ color: theme.gold.pure, letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif" }}>Duration</p>
        <div className='flex flex-col gap-1.5'>
          {[
            { label: 'Any length', value: 'any' },
            { label: 'Under 3hrs', value: 'short' },
            { label: '3–10 hrs',   value: 'medium' },
            { label: '10+ hrs',    value: 'long' },
          ].map((d) => (
            <button key={d.value} onClick={() => setFilters(f => ({ ...f, duration: d.value }))}
              className='flex items-center gap-2.5 px-3 py-2 rounded-xl w-full text-left'
              style={{ background: filters.duration === d.value ? 'rgba(212,168,67,0.1)' : 'transparent', border: `1px solid ${filters.duration === d.value ? 'rgba(212,168,67,0.3)' : 'transparent'}` }}>
              <div className='w-3.5 h-3.5 rounded-full flex-shrink-0'
                style={{ border: `1.5px solid ${filters.duration === d.value ? theme.gold.bright : 'rgba(212,168,67,0.4)'}`, background: filters.duration === d.value ? theme.gold.bright : 'transparent' }} />
              <span className='text-sm' style={{ color: filters.duration === d.value ? theme.gold.bright : pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      <AnimatePresence>
        {(filters.freeOnly || filters.minRating > 0 || filters.duration !== 'any') && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFilters({ freeOnly: false, minRating: 0, duration: 'any' })}
            className='w-full py-2 rounded-xl text-sm font-medium'
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.25)', color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}
            whileHover={{ background: 'rgba(212,168,67,0.14)' }}>
            Clear Filters ✕
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className='hidden lg:block w-64 flex-shrink-0'>
        <div className='sticky top-24 rounded-2xl p-4 overflow-y-auto max-h-[calc(100vh-7rem)]'
          style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, transition: 'background 0.4s ease' }}>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile */}
      <div className='lg:hidden'>
        <motion.button onClick={() => setMobileOpen(true)}
          className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4'
          style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          ☰ Filters & Departments
        </motion.button>
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className='fixed inset-0 z-40' style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                onClick={() => setMobileOpen(false)} />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className='fixed left-0 top-0 bottom-0 z-50 w-72 overflow-y-auto p-5'
                style={{ background: pageTheme.isDark ? theme.navy.mid : '#fff', borderRight: `1px solid ${pageTheme.border}` }}>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='font-semibold' style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', serif" }}>Departments & Filters</h3>
                  <button onClick={() => setMobileOpen(false)}
                    style={{ color: pageTheme.textMuted, fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// ── Main CourseList ───────────────────────────────────────────────────────────
const CourseList = () => {
  const { navigate, allCourses, calculateRating } = useContext(AppContext)
  const { pageTheme } = usePageTheme()
  const { input } = useParams()

  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy]                 = useState('newest')
  const [filters, setFilters]               = useState({ freeOnly: false, minRating: 0, duration: 'any' })
  const [filteredCourses, setFilteredCourses] = useState([])

  const counts = allCourses.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1
    return acc
  }, {})

  const getCourseHours = (course) => {
    let mins = 0
    course.courseContent?.forEach(ch => ch.chapterContent?.forEach(l => { mins += Number(l.lectureDuration) || 0 }))
    return mins / 60
  }

  useEffect(() => {
    let result = [...allCourses]
    if (input) result = result.filter(c => c.courseTitle.toLowerCase().includes(input.toLowerCase()))
    if (activeCategory !== 'all') result = result.filter(c => c.category === activeCategory)
    if (filters.freeOnly) result = result.filter(c => c.coursePrice === 0 || c.discount === 100)
    if (filters.minRating > 0) result = result.filter(c => (calculateRating ? calculateRating(c) : 0) >= filters.minRating)
    if (filters.duration !== 'any') {
      result = result.filter(c => {
        const hrs = getCourseHours(c)
        if (filters.duration === 'short')  return hrs < 3
        if (filters.duration === 'medium') return hrs >= 3 && hrs <= 10
        if (filters.duration === 'long')   return hrs > 10
        return true
      })
    }
    result.sort((a, b) => {
      if (sortBy === 'newest')     return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'popular')    return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0)
      if (sortBy === 'rating')     return (calculateRating ? calculateRating(b) - calculateRating(a) : 0)
      if (sortBy === 'price_asc')  return a.coursePrice - b.coursePrice
      if (sortBy === 'price_desc') return b.coursePrice - a.coursePrice
      return 0
    })
    setFilteredCourses(result)
  }, [allCourses, input, activeCategory, filters, sortBy])

  const activeCategoryLabel = CATEGORIES.find(c => c.value === activeCategory)?.label || 'All Courses'
  const activeCategoryIcon  = CATEGORIES.find(c => c.value === activeCategory)?.icon  || '🎓'

  return (
    <div style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}>
      <div className='min-h-screen px-4 md:px-8 lg:px-16 pt-24 pb-16'>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className='mb-8'>
          <p className='text-xs uppercase tracking-widest mb-1' style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Explore</p>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold'
                style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
                {activeCategoryIcon} {activeCategoryLabel}
              </h1>
              <p className='text-sm mt-1' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                <span className='cursor-pointer' style={{ color: theme.gold.bright }} onClick={() => navigate('/')}>Home</span>
                {' / '}Courses
                {activeCategory !== 'all' && <span> / {activeCategoryLabel}</span>}
              </p>
            </div>
            <SearchBar data={input} />
          </div>
          <motion.div className='w-12 h-px mt-4' style={{ background: theme.gradients.gold }}
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }} />
        </motion.div>

        {/* Main layout */}
        <div className='flex gap-8 items-start'>
          <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            filters={filters} setFilters={setFilters} counts={counts} pageTheme={pageTheme} />

          <div className='flex-1 min-w-0'>
            {/* Sort + results */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className='flex items-center justify-between mb-5 flex-wrap gap-3'>
              <p className='text-sm' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: theme.gold.bright, fontWeight: 600 }}>{filteredCourses.length}</span>
                {' '}{filteredCourses.length === 1 ? 'course' : 'courses'} found
                {input && <span> for "<span style={{ color: theme.gold.bright }}>{input}</span>"</span>}
              </p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className='text-sm px-4 py-2 rounded-xl outline-none cursor-pointer'
                style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, color: pageTheme.text, fontFamily: "'DM Sans', sans-serif" }}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} style={{ background: pageTheme.isDark ? '#0a1628' : '#fff' }}>{o.label}</option>
                ))}
              </select>
            </motion.div>

            {/* Active filter chips */}
            <AnimatePresence>
              {(activeCategory !== 'all' || filters.freeOnly || filters.minRating > 0 || filters.duration !== 'any' || input) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className='flex flex-wrap gap-2 mb-5'>
                  {activeCategory !== 'all' && <Chip label={`${activeCategoryIcon} ${activeCategoryLabel}`} onRemove={() => setActiveCategory('all')} />}
                  {filters.freeOnly && <Chip label="Free Only" onRemove={() => setFilters(f => ({ ...f, freeOnly: false }))} />}
                  {filters.minRating > 0 && <Chip label={`${filters.minRating}+ Stars`} onRemove={() => setFilters(f => ({ ...f, minRating: 0 }))} />}
                  {filters.duration !== 'any' && <Chip label={filters.duration === 'short' ? 'Under 3hrs' : filters.duration === 'medium' ? '3–10hrs' : '10+ hrs'} onRemove={() => setFilters(f => ({ ...f, duration: 'any' }))} />}
                  {input && <Chip label={`"${input}"`} onRemove={() => navigate('/course-list')} />}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Course grid */}
            {filteredCourses.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {filteredCourses.map((course, index) => (
                  <motion.div key={course._id || index}
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}>
                    <Coursecard course={course} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className='flex flex-col items-center justify-center py-32 text-center'>
                <p className='text-5xl mb-4' style={{ color: 'rgba(212,168,67,0.3)' }}>✦</p>
                <p className='text-xl font-semibold mb-2'
                  style={{ color: pageTheme.textSec, fontFamily: "'Cormorant Garamond', serif" }}>No courses found</p>
                <p className='text-sm mb-6' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                  Try a different department or clear your filters
                </p>
                <motion.button onClick={() => { setActiveCategory('all'); setFilters({ freeOnly: false, minRating: 0, duration: 'any' }); navigate('/course-list') }}
                  className='px-6 py-2.5 rounded-full text-sm font-medium'
                  style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif" }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  View All Courses
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CourseList