import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'
import { theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const Player = () => {
  const { enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses } = useContext(AppContext)
  const { pageTheme } = usePageTheme()  // ✅
  const { courseId } = useParams()
  const [courseData,    setCourseData]    = useState(null)
  const [openSection,   setOpenSection]   = useState({})
  const [playerData,    setPlayerData]    = useState(null)
  const [progressData,  setProgressData]  = useState(null)
  const [initialRating, setInitialRating] = useState(0)

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        const normalizedRatings = course.ratings || course.courseRatings || []
        setCourseData({ ...course, ratings: normalizedRatings })
        normalizedRatings.forEach((item) => {
          if (userData && item.userId === userData._id) setInitialRating(item.rating)
        })
      }
    })
  }

  const toggleSection = (index) => setOpenSection(prev => ({ ...prev, [index]: !prev[index] }))

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/update-course-progress',
        { courseId, lectureId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) { toast.success(data.message); getCourseProgress() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress',
        { courseId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) setProgressData(data.progressData)
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const handleRate = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/add-rating',
        { courseId, rating }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) { toast.success(data.message); fetchUserEnrolledCourses() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const getYouTubeVideoId = (url) => {
    if (!url) return null
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  useEffect(() => { if (enrolledCourses.length > 0) getCourseData() }, [enrolledCourses])
  useEffect(() => { getCourseProgress() })

  // arrow icon filter switches with theme
  const arrowFilter = pageTheme.isDark ? 'brightness(4)' : 'brightness(0.3)'
  const iconFilter  = pageTheme.isDark ? 'brightness(3)' : 'brightness(0.3)'

  return courseData ? (
    <div style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}>
      <div className='min-h-screen p-4 sm:p-20 flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:px-20 lg:px-36'>

        {/* Dot grid */}
        <div className='fixed inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }} />

        {/* ── LEFT — Course Structure ── */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }} className='relative z-10'>

          <div className='flex flex-col gap-1 mb-5'>
            <p className='text-xs uppercase tracking-widest' style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Player</p>
            <h2 className='text-xl font-semibold'
              style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
              Course Structure
            </h2>
            <motion.div className='w-10 h-px mt-1' style={{ background: theme.gradients.gold }}
              initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }} />
          </div>

          <div className='flex flex-col gap-2'>
            {courseData.courseContent.map((chapter, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.4 }} className='rounded-xl overflow-hidden'
                style={{ border: `1px solid ${pageTheme.border}`, background: pageTheme.bgCard, transition: 'background 0.4s ease' }}>

                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                  onClick={() => toggleSection(index)}
                  style={{ borderBottom: openSection[index] ? `1px solid ${pageTheme.border}` : 'none' }}>
                  <div className='flex items-center gap-2'>
                    <motion.img animate={{ rotate: openSection[index] ? 180 : 0 }} transition={{ duration: 0.25 }}
                      src={assets.down_arrow_icon} alt="arrow" style={{ filter: arrowFilter }} />
                    <p className='font-medium md:text-base text-sm'
                      style={{ color: pageTheme.text, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className='text-xs flex-shrink-0' style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>
                    {chapter.chapterContent.length} lectures · {calculateChapterTime(chapter)}
                  </p>
                </div>

                <AnimatePresence>
                  {openSection[index] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <ul className='md:pl-8 pl-4 pr-4 py-2 flex flex-col gap-0.5'>
                        {chapter.chapterContent.map((lecture, i) => {
                          const isCompleted = progressData && progressData.lectureCompleted.includes(lecture.lectureId)
                          const isActive = playerData && playerData.lectureId === lecture.lectureId
                          return (
                            <li key={i} className='flex items-start gap-2 py-2 px-2 rounded-lg transition-colors duration-200'
                              style={{
                                background: isActive ? 'rgba(212,168,67,0.08)' : 'transparent',
                                borderLeft: isActive ? '2px solid rgba(212,168,67,0.6)' : '2px solid transparent',
                              }}>
                              <img src={isCompleted ? assets.blue_tick_icon : assets.play_icon} alt=""
                                className='w-4 h-4 mt-0.5 flex-shrink-0'
                                style={{ filter: isCompleted ? 'sepia(1) saturate(4) hue-rotate(5deg)' : iconFilter }} />
                              <div className='flex items-center justify-between w-full gap-2 text-xs md:text-sm'>
                                <p style={{ color: isActive ? theme.gold.bright : pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s' }}>
                                  {lecture.lectureTitle}
                                </p>
                                <div className='flex gap-3 flex-shrink-0 items-center'>
                                  {lecture.lectureUrl && (
                                    <motion.p whileHover={{ scale: 1.05 }}
                                      onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                                      className='cursor-pointer text-xs px-2 py-0.5 rounded-full'
                                      style={{ color: theme.gold.bright, border: '1px solid rgba(212,168,67,0.3)', background: 'rgba(212,168,67,0.07)' }}>
                                      Watch
                                    </motion.p>
                                  )}
                                  <p className='text-xs' style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>
                                    {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                                  </p>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Rating */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className='flex items-center gap-3 py-4 mt-8 px-4 rounded-xl'
            style={{ background: pageTheme.isDark ? 'rgba(212,168,67,0.05)' : 'rgba(212,168,67,0.06)', border: `1px solid ${pageTheme.border}`, transition: 'background 0.4s ease' }}>
            <h3 className='text-base font-semibold'
              style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
              Rate this Course
            </h3>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </motion.div>
        </motion.div>

        {/* ── RIGHT — Video Player ── */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }} className='md:mt-10 relative z-10'>
          <AnimatePresence mode='wait'>
            {playerData ? (
              <motion.div key="player" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }} className='rounded-2xl overflow-hidden'
                style={{ border: `1px solid ${pageTheme.border}`, background: pageTheme.bgCard, boxShadow: pageTheme.shadow, transition: 'background 0.4s ease' }}>
                <div className='bg-black rounded-t-xl overflow-hidden'>
                  {getYouTubeVideoId(playerData.lectureUrl) ? (
                    <YouTube videoId={getYouTubeVideoId(playerData.lectureUrl)} iframeClassName="w-full aspect-video" />
                  ) : (
                    <div className='w-full aspect-video flex items-center justify-center'>
                      <p style={{ color: '#ff6b6b' }}>Invalid video URL</p>
                    </div>
                  )}
                </div>
                <div className='flex justify-between items-center px-5 py-4 gap-4'
                  style={{ borderTop: `1px solid ${pageTheme.border}` }}>
                  <p className='text-sm font-medium truncate'
                    style={{ color: pageTheme.text, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                    <span style={{ color: theme.gold.bright }}>{playerData.chapter}.{playerData.lecture}</span>{' '}{playerData.lectureTitle}
                  </p>
                  <motion.button onClick={() => markLectureAsCompleted(playerData.lectureId)}
                    whileHover={{ scale: 1.04, boxShadow: '0 0 16px rgba(212,168,67,0.3)' }} whileTap={{ scale: 0.97 }}
                    className='flex-shrink-0 text-xs px-4 py-2 rounded-lg font-medium'
                    style={{
                      background: progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? theme.gradients.gold : 'rgba(212,168,67,0.1)',
                      color: progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? theme.navy.deepest : theme.gold.bright,
                      border: progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'none' : '1px solid rgba(212,168,67,0.3)',
                      fontFamily: "'DM Sans', sans-serif", willChange: 'transform',
                    }}>
                    {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? '✓ Completed' : 'Mark as Completed'}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="thumbnail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className='rounded-2xl overflow-hidden relative'
                style={{ border: `1px solid ${pageTheme.border}` }}>
                <img src={courseData.courseThumbnail} alt="thumbnail" className='w-full object-cover' />
                <div className='absolute inset-0 flex items-center justify-center'
                  style={{ background: pageTheme.isDark ? 'rgba(5,13,26,0.5)' : 'rgba(240,235,224,0.6)' }}>
                  <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className='flex flex-col items-center gap-2'>
                    <div className='w-14 h-14 rounded-full flex items-center justify-center'
                      style={{ background: 'rgba(212,168,67,0.15)', border: '2px solid rgba(212,168,67,0.5)' }}>
                      <img src={assets.play_icon} alt="play" className='w-6 h-6' style={{ filter: iconFilter }} />
                    </div>
                    <p className='text-sm' style={{ color: pageTheme.textSec, transition: 'color 0.4s ease' }}>
                      Select a lecture to begin
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </div>
  ) : <Loading />
}

export default Player