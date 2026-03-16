import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import { theme } from '../../hooks/useAnimationVariants'

const Mycourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext)
  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      data.success && setCourses(data.courses)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) fetchEducatorCourses()
  }, [isEducator])

  return courses ? (
    <div
      className='min-h-screen flex flex-col items-start md:p-8 md:pb-0 p-4 pt-8 pb-0'
      style={{ background: theme.navy.deepest }}
    >

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col gap-1 mb-6 w-full'
      >
        <p className='text-xs uppercase tracking-widest'
          style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>
          Educator
        </p>
        <h1 className='text-2xl font-bold'
          style={{ color: theme.text.primary, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          My Courses
        </h1>
        <motion.div
          className='w-10 h-px mt-1'
          style={{ background: theme.gradients.gold }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='max-w-4xl w-full overflow-hidden rounded-xl'
        style={{
          border: '1px solid rgba(212,168,67,0.15)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <table className='md:table-auto table-fixed w-full'>

          {/* Head */}
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.15)' }}>
              {['All Courses', 'Earnings', 'Students', 'Published On'].map((h) => (
                <th
                  key={h}
                  className='px-4 py-4 text-left text-xs uppercase font-semibold truncate'
                  style={{ color: theme.gold.pure, letterSpacing: '0.08em' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body — motion.tbody + motion.tr safe pattern */}
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } }
            }}
          >
            {courses.map((course) => (
              <motion.tr
                key={course._id}
                variants={{
                  hidden:   { opacity: 0, x: -20 },
                  visible:  { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
                }}
                className='transition-colors duration-200 hover:bg-white/5'
                style={{ borderBottom: '1px solid rgba(212,168,67,0.06)' }}
              >
                {/* Course thumbnail + title */}
                <td className='md:px-4 pl-2 md:pl-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={course.courseThumbnail}
                      alt="thumbnail"
                      className='w-16 h-10 object-cover rounded-md flex-shrink-0'
                      style={{ border: '1px solid rgba(212,168,67,0.2)' }}
                    />
                    <span
                      className='truncate hidden md:block text-sm'
                      style={{ color: theme.text.primary, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {course.courseTitle}
                    </span>
                  </div>
                </td>

                {/* Earnings */}
                <td className='px-4 py-3 text-sm font-medium'
                  style={{ color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
                  {currency}{Math.floor(
                    course.enrolledStudents.length *
                    (course.coursePrice - course.discount * course.coursePrice / 100)
                  )}
                </td>

                {/* Students */}
                <td className='px-4 py-3 text-sm'
                  style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif" }}>
                  {course.enrolledStudents.length}
                </td>

                {/* Date */}
                <td className='px-4 py-3 text-sm'
                  style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </div>
  ) : <Loading />
}

export default Mycourses