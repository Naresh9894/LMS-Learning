import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'
import Certificate from './Certificate'

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate, userData,
    fetchUserEnrolledCourses, backendUrl, getToken, calculateNoofLectures } = useContext(AppContext)
  const { pageTheme } = usePageTheme()
  const [progressMap, setProgressMap] = useState({})

  // ✅ Certificate state
  const [showCertificate, setShowCertificate] = useState(false)
  const [certificateData, setCertificateData] = useState(null)

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id }, { headers: { Authorization: `Bearer ${token}` } })
          const { data: quizData } = await axios.post(`${backendUrl}/api/quiz/check-all`,
            { courseId: course._id }, { headers: { Authorization: `Bearer ${token}` } })
          const totalLectures = calculateNoofLectures(course)
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
          return {
            courseId: course._id,
            totalLectures,
            lectureCompleted,
            allQuizPassed: quizData?.success ? quizData.allPassed : false,
          }
        })
      )
      const map = {}
      tempProgressArray.forEach(p => { map[p.courseId] = p })
      setProgressMap(map)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { if (userData) fetchUserEnrolledCourses() }, [userData])
  useEffect(() => { if (enrolledCourses.length > 0) getCourseProgress() }, [enrolledCourses])

  // ✅ Open certificate
  const handleGetCertificate = (course) => {
    const educatorName = typeof course.educator === 'object'
      ? course.educator?.name || 'Instructor'
      : 'Instructor'

    setCertificateData({
      studentName:    userData?.name || 'Student',
      courseTitle:    course.courseTitle,
      educatorName:   educatorName,
      completionDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      certificateId:  `SL-${course._id.slice(-6).toUpperCase()}-${userData?._id?.slice(-4).toUpperCase()}`,
    })
    setShowCertificate(true)
  }

  return (
    <div style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}>
      <div className='md:px-36 px-8 pt-20 min-h-screen pb-16'>

        {/* Dot grid */}
        <div className='fixed inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }} />

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className='flex flex-col gap-1 mb-8 relative z-10'>
          <p className='text-xs uppercase tracking-widest' style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Student</p>
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
          style={{ border: `1px solid ${pageTheme.border}`, background: pageTheme.bgCard, transition: 'background 0.4s ease' }}>

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
                const progress = progressMap[course._id]
                const percent = progress ? Math.round((progress.lectureCompleted * 100) / progress.totalLectures) : 0
                const isCompleted = progress && progress.lectureCompleted === progress.totalLectures && progress.totalLectures > 0
                const quizPassed = progress ? progress.allQuizPassed : false
                const canGetCertificate = isCompleted && quizPassed

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
                                strokeColor={isCompleted ? '#22c55e' : theme.gold.bright}
                                trailColor={pageTheme.isDark ? 'rgba(212,168,67,0.1)' : 'rgba(212,168,67,0.2)'}
                                className='rounded-full' />
                            </div>
                            <span className='text-xs flex-shrink-0'
                              style={{ color: isCompleted ? '#22c55e' : theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
                              {percent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className='px-4 py-4 max-sm:hidden text-sm'
                      style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>
                      {calculateCourseDuration(course)}
                    </td>

                    {/* Completed */}
                    <td className='px-4 py-4 max-sm:hidden text-sm'
                      style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>
                      {progress
                        ? <span><span style={{ color: isCompleted ? '#22c55e' : theme.gold.bright }}>{progress.lectureCompleted}</span>/{progress.totalLectures} Lectures</span>
                        : '—'}
                    </td>

                    {/* Status + Certificate */}
                    <td className='px-4 py-4'>
                      <div className='flex flex-col gap-2 items-start'>
                        <motion.button
                          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                          onClick={() => navigate('/player/' + course._id)}
                          className='w-28 px-3 sm:px-3 py-2 rounded-lg max-sm:text-xs text-sm font-medium'
                          style={{
                            background: canGetCertificate ? theme.gradients.gold : 'rgba(212,168,67,0.1)',
                            color: canGetCertificate ? theme.navy.deepest : theme.gold.bright,
                            border: canGetCertificate ? 'none' : '1px solid rgba(212,168,67,0.3)',
                            fontFamily: "'DM Sans', sans-serif", willChange: 'transform',
                          }}>
                          {canGetCertificate ? '✓ Completed' : (isCompleted ? 'Quiz Pending' : 'On Going')}
                        </motion.button>

                        {/* ✅ Certificate button — only shows when lectures + quiz complete */}
                        <AnimatePresence>
                          {canGetCertificate && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(212,168,67,0.4)' }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleGetCertificate(course)}
                              className='w-28 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1'
                              style={{
                                background: 'rgba(212,168,67,0.08)',
                                border: '1px solid rgba(212,168,67,0.4)',
                                color: theme.gold.bright,
                                fontFamily: "'DM Sans', sans-serif",
                              }}>
                              🎓 Certificate
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </motion.tbody>
          </table>
        </motion.div>
      </div>
      <Footer />

      {/* ✅ Certificate Modal */}
      <AnimatePresence>
        {showCertificate && certificateData && (
          <Certificate
            studentName={certificateData.studentName}
            courseTitle={certificateData.courseTitle}
            educatorName={certificateData.educatorName}
            completionDate={certificateData.completionDate}
            certificateId={certificateData.certificateId}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MyEnrollments
