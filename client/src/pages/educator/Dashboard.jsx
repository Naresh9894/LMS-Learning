import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import { theme } from '../../hooks/useAnimationVariants'

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) setDashboardData(data.dashboardData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) fetchDashboardData()
  }, [isEducator])

  return dashboardData ? (
    <div
      className='min-h-screen flex flex-col items-start gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'
      style={{ background: theme.navy.deepest }}
    >

      {/* ── Page heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col gap-1'
      >
        <p className='text-xs uppercase tracking-widest'
          style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>
          Overview
        </p>
        <h1 className='text-2xl font-bold'
          style={{ color: theme.text.primary, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Educator Dashboard
        </h1>
        <div className='w-10 h-px mt-1' style={{ background: theme.gradients.gold }} />
      </motion.div>

      <div className='space-y-8 w-full'>

        {/* ── Stat cards — original structure ── */}
        <div className='flex flex-wrap gap-5 items-stretch'>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(212,168,67,0.2)' }}
            transition={{ type: 'spring', stiffness: 250 }}
            className='flex items-center gap-3 p-4 w-56 rounded-xl'
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,168,67,0.2)',
            }}
          >
            <img src={assets.patients_icon} alt="patients_icon" className='w-8 h-8' />
            <div>
              <p className='text-2xl font-medium'
                style={{ color: theme.gold.bright, fontFamily: "'Cormorant Garamond', serif" }}>
                {dashboardData.enrolledStudentData.length}
              </p>
              <p className='text-sm' style={{ color: theme.text.muted }}>Total Students</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(212,168,67,0.2)' }}
            transition={{ type: 'spring', stiffness: 250 }}
            className='flex items-center gap-3 p-4 w-56 rounded-xl'
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,168,67,0.2)',
            }}
          >
            <img src={assets.appointments_icon} alt="appointments_icon" className='w-8 h-8' />
            <div>
              <p className='text-2xl font-medium'
                style={{ color: theme.gold.bright, fontFamily: "'Cormorant Garamond', serif" }}>
                {dashboardData.totalCourses || 0}
              </p>
              <p className='text-sm' style={{ color: theme.text.muted }}>Total Courses</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(212,168,67,0.2)' }}
            transition={{ type: 'spring', stiffness: 250 }}
            className='flex items-center gap-3 p-4 w-56 rounded-xl'
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,168,67,0.2)',
            }}
          >
            <img src={assets.earning_icon} alt="earning_icon" className='w-8 h-8' />
            <div>
              <p className='text-lg font-small'
                style={{ color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
                {currency}{dashboardData.totalEarnings}
              </p>
              <p className='text-sm' style={{ color: theme.text.muted }}>Total Earnings</p>
            </div>
          </motion.div>

        </div>

        {/* ── Latest Enrollments — original table structure ── */}
        <div>
          <h2 className='pb-4 text-lg font-medium'
            style={{ color: theme.text.primary, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Latest Enrollments
          </h2>

          <div
            className='max-w-4xl w-full overflow-hidden rounded-xl'
            style={{
              border: '1px solid rgba(212,168,67,0.15)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <table className='table-fixed md:table-auto w-full border-collapse'>
              <thead style={{ borderBottom: '1px solid rgba(212,168,67,0.15)' }}>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell text-xs uppercase'
                    style={{ color: theme.gold.pure }}>S.No</th>
                  <th className='px-4 py-3 font-semibold text-left text-xs uppercase'
                    style={{ color: theme.gold.pure }}>Student Name</th>
                  <th className='px-4 py-3 font-semibold text-left text-xs uppercase'
                    style={{ color: theme.gold.pure }}>Course Title</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.enrolledStudentData.map((item, index) => (
                  <tr
                    key={index}
                    className='transition-colors duration-200 hover:bg-white/5'
                    style={{ borderBottom: '1px solid rgba(212,168,67,0.06)' }}
                  >
                    <td className='px-4 py-3 text-center hidden sm:table-cell text-sm'
                      style={{ color: theme.text.muted }}>{index + 1}</td>
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
                    <td className='px-4 py-3 truncate text-sm'
                      style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif" }}>
                      {item.courseTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  ) : <Loading />
}

export default Dashboard