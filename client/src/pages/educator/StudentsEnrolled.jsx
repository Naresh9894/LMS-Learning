import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import { theme } from '../../hooks/useAnimationVariants'

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) setEnrolledStudents(data.enrolledStudents.reverse())
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) fetchEnrolledStudents()
  }, [isEducator])

  return enrolledStudents ? (
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
          Students Enrolled
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
        <table className='table-fixed md:table-auto w-full'>

          {/* Head */}
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.15)' }}>
              <th className='px-4 py-4 text-center hidden sm:table-cell text-xs uppercase font-semibold'
                style={{ color: theme.gold.pure, letterSpacing: '0.08em' }}>S.No</th>
              <th className='px-4 py-4 text-left text-xs uppercase font-semibold'
                style={{ color: theme.gold.pure, letterSpacing: '0.08em' }}>Student Name</th>
              <th className='px-4 py-4 text-left text-xs uppercase font-semibold'
                style={{ color: theme.gold.pure, letterSpacing: '0.08em' }}>Course Title</th>
              <th className='px-4 py-4 text-left text-xs uppercase font-semibold hidden sm:table-cell'
                style={{ color: theme.gold.pure, letterSpacing: '0.08em' }}>Date</th>
            </tr>
          </thead>

          {/* Body — safe motion.tbody + motion.tr pattern */}
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } }
            }}
          >
            {enrolledStudents.map((item, index) => (
              <motion.tr
                key={index}
                variants={{
                  hidden:  { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
                }}
                className='transition-colors duration-200 hover:bg-white/5'
                style={{ borderBottom: '1px solid rgba(212,168,67,0.06)' }}
              >
                {/* S.No */}
                <td className='px-4 py-3 text-center hidden sm:table-cell text-sm'
                  style={{ color: theme.text.muted }}>
                  {index + 1}
                </td>

                {/* Student */}
                <td className='md:px-4 px-2 py-3'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={item.student.imageUrl}
                      alt="profile"
                      className='w-9 h-9 rounded-full object-cover flex-shrink-0'
                      style={{ border: '1.5px solid rgba(212,168,67,0.35)' }}
                    />
                    <span className='truncate text-sm'
                      style={{ color: theme.text.primary, fontFamily: "'DM Sans', sans-serif" }}>
                      {item.student.name}
                    </span>
                  </div>
                </td>

                {/* Course */}
                <td className='px-4 py-3 truncate text-sm'
                  style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif" }}>
                  {item.courseTitle}
                </td>

                {/* Date */}
                <td className='px-4 py-3 text-sm hidden sm:table-cell'
                  style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </div>
  ) : <Loading />
}

export default StudentsEnrolled