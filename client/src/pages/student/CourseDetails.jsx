import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import { toast } from 'react-toastify'
import axios from 'axios'
import { theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const CourseDetails = () => {
  const { id } = useParams()
  const { pageTheme } = usePageTheme()  // ✅
  const [courseData, setCourseData]               = useState(null)
  const [openSection, setOpenSection]             = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData]               = useState(null)

  const { calculateRating, calculateNoofLectures, calculateCourseDuration,
    calculateChapterTime, currency, backendUrl, userData, getToken, trackCourseView } = useContext(AppContext)

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      if (data.success) setCourseData(data.course)
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const enrolledCourse = async () => {
    try {
      if (!userData) return toast.warn('Login to Enroll')
      if (isAlreadyEnrolled) return toast.warn('Already Enrolled')
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/purchase',
        { courseId: courseData._id }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) window.location.replace(data.session_url)
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { fetchCourseData() }, [])
  useEffect(() => {
    if (userData && courseData)
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
  }, [userData, courseData])

  useEffect(() => {
    if (courseData && userData) {
      trackCourseView(courseData._id)
    }
  }, [courseData, userData])

  const toggleSection = (index) =>
    setOpenSection(prev => ({ ...prev, [index]: !prev[index] }))

  const getYouTubeVideoId = (url) => {
    if (!url) return null
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const ratingCount = courseData
    ? (courseData.ratings || courseData.courseRatings || []).length : 0

  // theme-aware values
  const heroBg = pageTheme.isDark
    ? `linear-gradient(180deg, rgba(10,22,40,0.95) 0%, ${theme.navy.deepest} 100%)`
    : `linear-gradient(180deg, rgba(240,235,224,0.95) 0%, ${pageTheme.bg} 100%)`

  return courseData ? (
    <>
      <div className='min-h-screen' style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}>

        {/* Hero bg */}
        <div className='absolute top-0 left-0 w-full'
          style={{ height: '420px', background: heroBg, borderBottom: '1px solid rgba(212,168,67,0.1)', zIndex: 0, transition: 'background 0.4s ease' }} />
        <div className='absolute top-0 left-0 w-full pointer-events-none'
          style={{ height: '420px', backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.05) 1px, transparent 1px)`, backgroundSize: '36px 36px', zIndex: 0 }} />

        <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left pb-20'>

          {/* ── LEFT ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }} className='max-w-xl z-10'>

            <h1 className='md:text-course-details-heading-large text-course-details-heading-small font-semibold'
              style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
              {courseData.courseTitle}
            </h1>

            <p className='pt-4 md:text-base text-sm'
              style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }} />

            {/* Rating */}
            <div className='flex items-center space-x-2 pt-3 pb-1'>
              <p style={{ color: theme.gold.bright }}>{calculateRating(courseData)}</p>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />
                ))}
              </div>
              <p style={{ color: theme.gold.pure }}>({ratingCount} ratings)</p>
              <p style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>{courseData.enrolledStudents.length} students</p>
            </div>

            <p className='text-sm' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
              Course by <span style={{ color: theme.gold.bright, textDecoration: 'underline', cursor: 'pointer' }}>{courseData.educator.name}</span>
            </p>

            {/* Course Structure */}
            <div className='pt-8'>
              <h2 className='text-xl font-semibold mb-4'
                style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
                Course Structure
              </h2>
              {courseData.courseContent.map((chapter, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  className='mb-2 rounded-xl overflow-hidden'
                  style={{ border: `1px solid ${pageTheme.border}`, background: pageTheme.bgCard, transition: 'background 0.4s ease' }}>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                    onClick={() => toggleSection(index)}
                    style={{ borderBottom: openSection[index] ? `1px solid ${pageTheme.border}` : 'none' }}>
                    <div className='flex items-center gap-2'>
                      <motion.img animate={{ rotate: openSection[index] ? 180 : 0 }} transition={{ duration: 0.25 }}
                        src={assets.down_arrow_icon} alt="arrow"
                        style={{ filter: pageTheme.isDark ? 'brightness(4)' : 'brightness(0.3)' }} />
                      <p className='font-medium md:text-base text-sm'
                        style={{ color: pageTheme.text, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className='text-sm' style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>
                      {chapter.chapterContent.length} lectures · {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <AnimatePresence>
                    {openSection[index] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                        <ul className='md:pl-10 pl-4 pr-4 py-2'>
                          {chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex items-start gap-2 py-1.5'>
                              <img src={assets.play_icon} alt="play" className='w-4 h-4 mt-0.5 flex-shrink-0'
                                style={{ filter: 'sepia(1) saturate(4) hue-rotate(5deg)' }} />
                              <div className='flex items-center justify-between w-full text-xs md:text-sm gap-2'>
                                <p style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
                                  {lecture.lectureTitle}
                                </p>
                                <div className='flex gap-3 flex-shrink-0'>
                                  {/* Preview removed */}
                                  <p style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>
                                    {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Full Description */}
            <div className='py-10'>
              <h3 className='text-xl font-semibold'
                style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
                Course Description
              </h3>
              <p className='pt-3 rich-text'
                style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}
                dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} />
            </div>
          </motion.div>

          {/* ── RIGHT CARD ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className='z-10 rounded-2xl overflow-hidden md:sticky md:top-8 min-w-[300px] sm:min-w-[380px]'
            style={{
              background: pageTheme.bgCard,
              border: `1px solid ${pageTheme.border}`,
              backdropFilter: 'blur(16px)',
              boxShadow: pageTheme.shadow,
              transition: 'background 0.4s ease, border-color 0.4s ease',
            }}>

            {playerData
              ? (() => {
                const ytId = getYouTubeVideoId(playerData.lectureUrl)
                const isUpload = playerData.lectureSource === 'upload' || (!ytId && !!playerData.lectureUrl)
                if (isUpload) {
                  return <video className='w-full aspect-video' controls src={playerData.lectureUrl} />
                }
                if (ytId) {
                  return (
                    <YouTube
                      videoId={ytId}
                      opts={{
                        playerVars: {
                          autoplay: 1,
                          rel: 0,
                          modestbranding: 1,
                          iv_load_policy: 3,
                          fs: 1,
                          playsinline: 1,
                        }
                      }}
                      iframeClassName='w-full aspect-video'
                    />
                  )
                }
                return (
                  <div className='w-full aspect-video flex items-center justify-center' style={{ background: '#000' }}>
                    <p style={{ color: '#ff6b6b' }}>Invalid video URL</p>
                  </div>
                )
              })()
              : <img src={courseData.courseThumbnail} alt="thumbnail" className='w-full aspect-video object-cover' />
            }

            <div className='p-5'>
              <div className='flex items-center gap-2 mb-2'>
                <img className='w-3.5' src={assets.time_left_clock_icon} alt="clock" />
                <p className='text-sm' style={{ color: '#ff6b6b' }}>
                  <span className='font-semibold'>5 days</span> left at this price
                </p>
              </div>

              <div className='flex gap-3 items-center pt-1 pb-3'>
                <p className='md:text-4xl text-2xl font-bold'
                  style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', serif", transition: 'color 0.4s ease' }}>
                  {currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
                </p>
                <p className='md:text-lg line-through' style={{ color: pageTheme.textMuted, transition: 'color 0.4s ease' }}>
                  {currency}{courseData.coursePrice}
                </p>
                <p className='text-sm px-2 py-0.5 rounded-full'
                  style={{ color: theme.gold.bright, background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)' }}>
                  {courseData.discount}% off
                </p>
              </div>

              <div className='flex items-center text-sm gap-4 py-3'
                style={{ borderTop: `1px solid ${pageTheme.border}`, borderBottom: `1px solid ${pageTheme.border}` }}>
                <div className='flex items-center gap-1'>
                  <img src={assets.star} alt="star" className='w-4 h-4' />
                  <p style={{ color: theme.gold.bright }}>{calculateRating(courseData)}</p>
                </div>
                <div className='w-px h-4' style={{ background: pageTheme.border }} />
                <div className='flex items-center gap-1'>
                  <img src={assets.time_clock_icon} alt="clock" className='w-4 h-4'
                    style={{ filter: pageTheme.isDark ? 'brightness(3)' : 'brightness(0.3)' }} />
                  <p style={{ color: pageTheme.textSec, transition: 'color 0.4s ease' }}>{calculateCourseDuration(courseData)}</p>
                </div>
                <div className='w-px h-4' style={{ background: pageTheme.border }} />
                <div className='flex items-center gap-1'>
                  <img src={assets.lesson_icon} alt="lessons" className='w-4 h-4'
                    style={{ filter: pageTheme.isDark ? 'brightness(3)' : 'brightness(0.3)' }} />
                  <p style={{ color: pageTheme.textSec, transition: 'color 0.4s ease' }}>{calculateNoofLectures(courseData)} lessons</p>
                </div>
              </div>

              <motion.button onClick={enrolledCourse}
                whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(212,168,67,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className='md:mt-5 mt-4 w-full py-3 rounded-xl text-sm font-semibold'
                style={{
                  background: isAlreadyEnrolled ? pageTheme.bgCard : theme.gradients.gold,
                  color: isAlreadyEnrolled ? pageTheme.textMuted : theme.navy.deepest,
                  fontFamily: "'DM Sans', sans-serif",
                  border: isAlreadyEnrolled ? `1px solid ${pageTheme.border}` : 'none',
                  willChange: 'transform',
                }}>
                {isAlreadyEnrolled ? '✓ Already Enrolled' : 'Enroll Now'}
              </motion.button>

              <div className='pt-5'>
                <p className='md:text-base text-sm font-semibold mb-2'
                  style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
                  What's in the course?
                </p>
                <ul className='flex flex-col gap-1.5 text-sm' style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>
                  {['Lifetime access with free updates.', 'Step-by-step, hands-on project guidance.', 'Downloadable resources and source code.', 'Quizzes to test your knowledge.', 'Certificate of completion.'].map((item, i) => (
                    <li key={i} className='flex items-center gap-2' style={{ transition: 'color 0.4s ease' }}>
                      <span style={{ color: theme.gold.bright }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails
