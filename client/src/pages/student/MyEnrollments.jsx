import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate, userData,
    fetchUserEnrolledCourses, backendUrl, getToken, calculateNoofLectures } = useContext(AppContext)
  const { pageTheme } = usePageTheme()  // ✅
  const [progressArray, setProgressArray] = useState([])

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id }, { headers: { Authorization: `Bearer ${token}` } })
          const totalLectures = calculateNoofLectures(course)
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
          return { totalLectures, lectureCompleted }
        })
      )
      setProgressArray(tempProgressArray)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { if (userData) fetchUserEnrolledCourses() }, [userData])
  useEffect(() => { if (enrolledCourses.length > 0) getCourseProgress() }, [enrolledCourses])

  return (
    <div style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}>
      <div className='md:px-36 px-8 pt-20 min-h-screen pb-16'>

        {/* Dot grid */}
        <div className='fixed inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }} />

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className='flex flex-col gap-1 mb-8 relative z-10'>
          <p className='text-xs uppercase tracking-widest'
            style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Student</p>
          <h1 className='text-2xl font-bold'
            style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
            My Enrollments
          </h1>
          <motion.div className='w-10 h-px mt-1' style={{ background: theme.gradients.gold }}
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }} />
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='w-full overflow-hidden rounded-xl relative z-10'
          style={{ border: `1px solid ${pageTheme.border}`, background: pageTheme.bgCard, transition: 'background 0.4s ease, border-color 0.4s ease' }}>

          <table className='md:table-auto table-fixed w-full'>
            <thead>
              <tr className='max-sm:hidden' style={{ borderBottom: `1px solid ${pageTheme.border}` }}>
                {['Course', 'Duration', 'Completed', 'Status'].map(h => (
                  <th key={h} className='px-4 py-4 text-left text-xs uppercase font-semibold truncate'
                    style={{ color: theme.gold.pure, letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>

            <motion.tbody initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
              {enrolledCourses.map((course, index) => {
                const progress = progressArray[index]
                const percent = progress ? Math.round((progress.lectureCompleted * 100) / progress.totalLectures) : 0
                const isCompleted = progress && progress.lectureCompleted / progress.totalLectures === 1

                return (
                  <motion.tr key={index}
                    variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
                    style={{ borderBottom: `1px solid ${pageTheme.border}` }}
                    className='transition-colors duration-200'
                    onMouseEnter={e => e.currentTarget.style.background = pageTheme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(212,168,67,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                    {/* Course + progress */}
                    <td className='md:px-4 pl-2 md:pl-4 py-4'>
                      <div className='flex items-center gap-3'>
                        <img src={course.courseThumbnail} alt=""
                          className='w-14 sm:w-24 md:w-28 rounded-lg object-cover flex-shrink-0'
                          style={{ border: `1px solid ${pageTheme.border}` }} />
                        <div className='flex-1 min-w-0'>
                          <p className='mb-2 max-sm:text-sm truncate'
                            style={{ color: pageTheme.text, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                            {course.courseTitle}
                          </p>
                          <div className='flex items-center gap-2'>
                            <div className='flex-1'>
                              <Line strokeWidth={3} percent={percent}
                                strokeColor={theme.gold.bright}
                                trailColor={pageTheme.isDark ? 'rgba(212,168,67,0.1)' : 'rgba(212,168,67,0.2)'}
                                className='rounded-full' />
                            </div>
                            <span className='text-xs flex-shrink-0'
                              style={{ color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
                              {percent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className='px-4 py-4 max-sm:hidden text-sm'
                      style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                      {calculateCourseDuration(course)}
                    </td>

                    {/* Completed */}
                    <td className='px-4 py-4 max-sm:hidden text-sm'
                      style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                      {progress
                        ? <span><span style={{ color: theme.gold.bright }}>{progress.lectureCompleted}</span>/{progress.totalLectures} Lectures</span>
                        : '—'}
                    </td>

                    {/* Status */}
                    <td className='px-4 py-4 max-sm:text-right'>
                      <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 0 16px rgba(212,168,67,0.25)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/player/' + course._id)}
                        className='w-28 px-3 sm:px-5 py-2 rounded-lg max-sm:text-xs text-sm font-medium'
                        style={{
                          background: isCompleted ? theme.gradients.gold : 'rgba(212,168,67,0.1)',
                          color: isCompleted ? theme.navy.deepest : theme.gold.bright,
                          border: isCompleted ? 'none' : '1px solid rgba(212,168,67,0.3)',
                          fontFamily: "'DM Sans', sans-serif", willChange: 'transform',
                        }}>
                        {isCompleted ? '✓ Completed' : 'On Going'}
                      </motion.button>
                    </td>
                  </motion.tr>
                )
              })}
            </motion.tbody>
          </table>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default MyEnrollments