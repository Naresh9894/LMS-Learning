import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { theme } from '../../hooks/useAnimationVariants'

const CATEGORIES = [
 'Select Category','Technology', 'Web Development', 'AI & Machine Learning', 'Design','Programming Languages',
  'Photography', 'Travel', 'Business', 'Music',
  'Health & Fitness', 'Language', 'Finance', 'Marketing',
]

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle]   = useState('')
  const [coursePrice, setCoursePrice]   = useState(0)
  const [discount, setDiscount]         = useState(0)
  const [category, setCategory]         = useState('Select Category')
  const [image, setImage]               = useState(null)
  const [chapter, setChapter]           = useState([])
  const [showPopup, setShowPopup]       = useState(false)
  const [showQuizPopup, setShowQuizPopup] = useState(false)   // ✅ NEW
  const [currentChapterId, setCurrentChapterId] = useState(null)
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '', lectureDuration: '', lectureUrl: '', lectureSource: 'link', isPreviewFree: false,
  })
  const [lectureUploadLoading, setLectureUploadLoading] = useState(false)
  // ✅ NEW — quiz question being added
  const [quizQuestion, setQuizQuestion] = useState({
    question: '', options: ['', '', '', ''], correctAnswer: 0,
  })

  const handlechapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:')
      if (title) {
        setChapter([...chapter, {
          chapterId: uniqid(), chapterTitle: title, chapterContent: [],
          quiz: [], collapsed: false,
          chapterOrder: chapter.length > 0 ? chapter.slice(-1)[0].chapterOrder + 1 : 1,
        }])
      }
    } else if (action === 'remove') {
      setChapter(chapter.filter((c) => c.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapter(chapter.map((c) =>
        c.chapterId === chapterId ? { ...c, collapsed: !c.collapsed } : c
      ))
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') { setCurrentChapterId(chapterId); setShowPopup(true) }
    else if (action === 'remove') {
      setChapter(chapter.map((c) => {
        if (c.chapterId === chapterId) c.chapterContent.splice(lectureIndex, 1)
        return c
      }))
    }
  }

  // ✅ NEW — quiz handlers
  const handleAddQuiz = (chapterId) => {
    setCurrentChapterId(chapterId)
    setQuizQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 })
    setShowQuizPopup(true)
  }

  const handleRemoveQuiz = (chapterId, questionId) => {
    setChapter(chapter.map((c) => {
      if (c.chapterId === chapterId) {
        c.quiz = c.quiz.filter(q => q.questionId !== questionId)
      }
      return c
    }))
  }

  const addQuizQuestion = () => {
    if (!quizQuestion.question.trim()) { toast.error('Enter question'); return }
    if (quizQuestion.options.some(o => !o.trim())) { toast.error('Fill all 4 options'); return }

    setChapter(chapter.map((c) => {
      if (c.chapterId === currentChapterId) {
        c.quiz = [...(c.quiz || []), {
          questionId: uniqid(),
          question: quizQuestion.question,
          options: quizQuestion.options,
          correctAnswer: quizQuestion.correctAnswer,
        }]
      }
      return c
    }))
    setQuizQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 })
    setShowQuizPopup(false)
    toast.success('Question added!')
  }

  const uploadLectureVideo = async (file) => {
    if (!file) return
    try {
      setLectureUploadLoading(true)
      const formData = new FormData()
      formData.append('video', file)
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/educator/upload-lecture', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setLectureDetails(prev => ({ ...prev, lectureUrl: data.url, lectureSource: 'upload' }))
        toast.success('Lecture video uploaded')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLectureUploadLoading(false)
    }
  }

  const addLecture = () => {
    if (!lectureDetails.lectureTitle.trim()) { toast.error('Enter lecture title'); return }
    if (!lectureDetails.lectureDuration) { toast.error('Enter lecture duration'); return }
    if (!lectureDetails.lectureUrl) { toast.error('Add a lecture link or upload a video'); return }
    setChapter(chapter.map((c) => {
      if (c.chapterId === currentChapterId) {
        c.chapterContent.push({
          ...lectureDetails,
          lectureOrder: c.chapterContent.length > 0 ? c.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
          lectureId: uniqid(),
        })
      }
      return c
    }))
    setShowPopup(false)
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', lectureSource: 'link', isPreviewFree: false })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!image) { toast.error('Thumbnail Not Selected'); return }
      const courseData = {
        courseTitle, category,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapter,
      }
      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message)
        setCourseTitle(''); setCoursePrice(0); setDiscount(0)
        setCategory('Technology'); setImage(null); setChapter([])
        quillRef.current.root.innerHTML = ''
      } else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,67,0.2)',
    color: theme.text.primary, fontFamily: "'DM Sans', sans-serif",
    outline: 'none', borderRadius: '8px', padding: '10px 14px', width: '100%',
    transition: 'border-color 0.2s ease',
  }
  const labelStyle = {
    color: theme.text.secondary, fontSize: '0.8rem',
    fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em', marginBottom: '4px',
  }

  return (
    <div className='min-h-screen overflow-y-auto flex flex-col items-start md:p-8 md:pb-16 p-4 pt-6 pb-16'
      style={{ background: theme.navy.deepest }}>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className='flex flex-col gap-1 mb-6'>
        <p className='text-xs uppercase tracking-widest' style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Educator</p>
        <h1 className='text-2xl font-bold' style={{ color: theme.text.primary, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Add New Course</h1>
        <motion.div className='w-10 h-px mt-1' style={{ background: theme.gradients.gold }}
          initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }} />
      </motion.div>

      <motion.form onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className='flex flex-col gap-5 max-w-xl w-full'>

        {/* Course Title */}
        <div className='flex flex-col gap-1'>
          <p style={labelStyle}>Course Title</p>
          <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle}
            type="text" placeholder='Enter course title' style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
        </div>

        {/* Category */}
        <div className='flex flex-col gap-1'>
          <p style={labelStyle}>Category / Department</p>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} style={{ background: '#0a1628', color: theme.text.primary }}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className='flex flex-col gap-1'>
          <p style={labelStyle}>Course Description</p>
          <div ref={editorRef} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(212,168,67,0.2)', color: theme.text.primary }} />
        </div>

        {/* Price + Thumbnail */}
        <div className='flex items-start justify-between flex-wrap gap-4'>
          <div className='flex flex-col gap-1'>
            <p style={labelStyle}>Course Price</p>
            <input onChange={e => setCoursePrice(e.target.value)} value={coursePrice}
              type="number" placeholder='0' required style={{ ...inputStyle, width: '120px' }}
              onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
          </div>
          <div className='flex flex-col gap-1'>
            <p style={labelStyle}>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3 cursor-pointer'>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className='p-3 rounded-lg'
                style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)' }}>
                <img src={assets.file_upload_icon} alt="upload" className='w-5 h-5'
                  style={{ filter: 'sepia(1) saturate(4) hue-rotate(5deg)' }} />
              </motion.div>
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept='image/*' hidden />
              {image && (
                <motion.img initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className='max-h-12 rounded-lg' src={URL.createObjectURL(image)} alt="preview"
                  style={{ border: '1px solid rgba(212,168,67,0.3)' }} />
              )}
            </label>
          </div>
        </div>

        {/* Discount */}
        <div className='flex flex-col gap-1'>
          <p style={labelStyle}>Discount %</p>
          <input onChange={e => setDiscount(e.target.value)} value={discount}
            type="number" placeholder='0' min={0} max={100} required
            style={{ ...inputStyle, width: '100px' }}
            onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
        </div>

        {/* Chapters */}
        <div className='flex flex-col gap-3'>
          <p style={{ ...labelStyle, fontSize: '0.9rem' }}>Course Content</p>
          <AnimatePresence>
            {chapter.map((chap, chapterIndex) => (
              <motion.div key={chap.chapterId}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className='rounded-xl overflow-hidden'
                style={{ border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(255,255,255,0.03)' }}>

                {/* Chapter header */}
                <div className='flex justify-between items-center p-4'
                  style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                  <div className='flex items-center gap-2'>
                    <motion.img onClick={() => handlechapter('toggle', chap.chapterId)}
                      src={assets.dropdown_icon} width={14} alt="toggle" className='cursor-pointer'
                      animate={{ rotate: chap.collapsed ? -90 : 0 }} transition={{ duration: 0.2 }}
                      style={{ filter: 'brightness(3)' }} />
                    <span className='font-semibold text-sm'
                      style={{ color: theme.text.primary, fontFamily: "'DM Sans', sans-serif" }}>
                      {chapterIndex + 1}. {chap.chapterTitle}
                    </span>
                    {/* Quiz count badge */}
                    {chap.quiz && chap.quiz.length > 0 && (
                      <span className='text-xs px-2 py-0.5 rounded-full ml-1'
                        style={{ background: 'rgba(212,168,67,0.15)', color: theme.gold.bright, border: '1px solid rgba(212,168,67,0.3)' }}>
                        📝 {chap.quiz.length} Q
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-xs' style={{ color: theme.text.muted }}>{chap.chapterContent.length} Lectures</span>
                    <motion.img onClick={() => handlechapter('remove', chap.chapterId)}
                      src={assets.cross_icon} alt="remove" className='cursor-pointer w-4 h-4'
                      whileHover={{ scale: 1.2, rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }}
                      style={{ filter: 'brightness(3)' }} />
                  </div>
                </div>

                {/* Chapter content */}
                <AnimatePresence>
                  {!chap.collapsed && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                      className='p-4 flex flex-col gap-2'>

                      {/* Lectures */}
                      {chap.chapterContent.map((lecture, lectureIndex) => (
                        <div key={lectureIndex} className='flex justify-between items-center text-xs py-2 px-3 rounded-lg'
                          style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.08)', color: theme.text.secondary }}>
                          <span>
                            {lectureIndex + 1}. {lecture.lectureTitle} — {Number(lecture.lectureDuration || 0).toFixed(2)}mins —{' '}
                            <a href={lecture.lectureUrl} target='_blank' style={{ color: theme.gold.bright }}>Link</a> —{' '}
                            {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                          </span>
                          <motion.img src={assets.cross_icon} alt="remove"
                            onClick={() => handleLecture('remove', chap.chapterId, lectureIndex)}
                            className='cursor-pointer w-3 h-3 ml-3 flex-shrink-0'
                            whileHover={{ scale: 1.3, rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }}
                            style={{ filter: 'brightness(3)' }} />
                        </div>
                      ))}

                      {/* ✅ NEW — Quiz questions list */}
                      {chap.quiz && chap.quiz.length > 0 && (
                        <div className='mt-2 flex flex-col gap-1.5'>
                          <p className='text-xs uppercase tracking-wider'
                            style={{ color: theme.gold.pure, letterSpacing: '0.1em' }}>Quiz Questions</p>
                          {chap.quiz.map((q, qi) => (
                            <div key={q.questionId} className='flex justify-between items-start text-xs py-2 px-3 rounded-lg'
                              style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)', color: theme.text.secondary }}>
                              <div className='flex-1'>
                                <p className='font-medium mb-1' style={{ color: theme.text.primary }}>Q{qi + 1}. {q.question}</p>
                                <div className='flex flex-wrap gap-2'>
                                  {q.options.map((opt, oi) => (
                                    <span key={oi} className='px-2 py-0.5 rounded'
                                      style={{ background: oi === q.correctAnswer ? 'rgba(212,168,67,0.2)' : 'rgba(255,255,255,0.05)', color: oi === q.correctAnswer ? theme.gold.bright : theme.text.muted, border: `1px solid ${oi === q.correctAnswer ? 'rgba(212,168,67,0.4)' : 'transparent'}` }}>
                                      {oi === q.correctAnswer ? '✓ ' : ''}{opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <motion.button type='button' onClick={() => handleRemoveQuiz(chap.chapterId, q.questionId)}
                                whileHover={{ scale: 1.2 }} className='ml-2 flex-shrink-0'
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text.muted }}>✕</motion.button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className='flex gap-2 mt-1 flex-wrap'>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleLecture('add', chap.chapterId)}
                          className='inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-medium'
                          style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', color: theme.gold.bright }}>
                          + Add Lecture
                        </motion.div>

                        {/* ✅ NEW — Add Quiz button */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddQuiz(chap.chapterId)}
                          className='inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-medium'
                          style={{ background: 'rgba(212,168,67,0.06)', border: '1px dashed rgba(212,168,67,0.3)', color: theme.gold.pure }}>
                          📝 Add Quiz Question
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(212,168,67,0.15)' }}
            whileTap={{ scale: 0.98 }} onClick={() => handlechapter('add')}
            className='flex justify-center items-center gap-2 p-3 rounded-xl cursor-pointer text-sm font-medium'
            style={{ background: 'rgba(212,168,67,0.06)', border: '1px dashed rgba(212,168,67,0.3)', color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
            + Add Chapter
          </motion.div>
        </div>

        <motion.button type='submit'
          whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(212,168,67,0.4)' }} whileTap={{ scale: 0.97 }}
          className='w-max py-3 px-10 rounded-lg text-sm font-semibold my-4'
          style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif", willChange: 'transform' }}>
          Publish Course
        </motion.button>
      </motion.form>

      {/* ── Add Lecture Popup ── */}
      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 flex items-center justify-center z-50'
            style={{ background: 'rgba(5,13,26,0.85)', backdropFilter: 'blur(6px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className='relative p-6 rounded-2xl w-full max-w-sm'
              style={{ background: theme.navy.mid, border: '1px solid rgba(212,168,67,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
              <h2 className='text-lg font-semibold mb-5' style={{ color: theme.text.primary, fontFamily: "'Cormorant Garamond', serif" }}>Add Lecture</h2>
              {[
                { label: 'Lecture Title', key: 'lectureTitle', type: 'text' },
                { label: 'Duration (minutes)', key: 'lectureDuration', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key} className='mb-3 flex flex-col gap-1'>
                  <p style={labelStyle}>{label}</p>
                  <input type={type} style={inputStyle} value={lectureDetails[key]}
                    onChange={e => setLectureDetails({ ...lectureDetails, [key]: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
                </div>
              ))}
              <div className='mb-3 flex flex-col gap-1'>
                <p style={labelStyle}>Video Source</p>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={lectureDetails.lectureSource}
                  onChange={e => setLectureDetails({ ...lectureDetails, lectureSource: e.target.value })}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'}
                >
                  <option value="link" style={{ background: '#0a1628', color: theme.text.primary }}>Link</option>
                  <option value="upload" style={{ background: '#0a1628', color: theme.text.primary }}>Upload Video</option>
                </select>
              </div>

              {lectureDetails.lectureSource === 'link' ? (
                <div className='mb-3 flex flex-col gap-1'>
                  <p style={labelStyle}>Lecture URL</p>
                  <input type="text" style={inputStyle} value={lectureDetails.lectureUrl}
                    onChange={e => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
                </div>
              ) : (
                <div className='mb-3 flex flex-col gap-1'>
                  <p style={labelStyle}>Upload Lecture Video</p>
                  <input
                    type="file"
                    accept="video/*"
                    style={inputStyle}
                    onChange={e => uploadLectureVideo(e.target.files[0])}
                  />
                  <p className='text-xs' style={{ color: theme.text.muted }}>
                    {lectureUploadLoading ? 'Uploading...' : (lectureDetails.lectureUrl ? 'Video uploaded' : 'Choose a video file')}
                  </p>
                </div>
              )}
              <div className='flex items-center gap-3 my-4'>
                <p style={labelStyle}>Is Preview Free?</p>
                <input type="checkbox" className='scale-125 cursor-pointer'
                  checked={lectureDetails.isPreviewFree}
                  onChange={e => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  style={{ accentColor: theme.gold.bright }} />
              </div>
              <motion.button type='button' onClick={addLecture}
                className='w-full py-2.5 rounded-lg text-sm font-semibold'
                style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif" }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                Add Lecture
              </motion.button>
              <motion.img onClick={() => setShowPopup(false)} src={assets.cross_icon} alt="close"
                className='absolute top-4 right-4 w-4 cursor-pointer' style={{ filter: 'brightness(3)' }}
                whileHover={{ scale: 1.2, rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ NEW — Add Quiz Question Popup */}
      <AnimatePresence>
        {showQuizPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 flex items-center justify-center z-50'
            style={{ background: 'rgba(5,13,26,0.85)', backdropFilter: 'blur(6px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className='relative p-6 rounded-2xl w-full max-w-md overflow-y-auto'
              style={{ background: theme.navy.mid, border: '1px solid rgba(212,168,67,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', maxHeight: '90vh' }}>
              <h2 className='text-lg font-semibold mb-5' style={{ color: theme.text.primary, fontFamily: "'Cormorant Garamond', serif" }}>
                📝 Add Quiz Question
              </h2>

              {/* Question */}
              <div className='mb-4 flex flex-col gap-1'>
                <p style={labelStyle}>Question</p>
                <input type='text' style={inputStyle} placeholder='Enter your question...'
                  value={quizQuestion.question}
                  onChange={e => setQuizQuestion({ ...quizQuestion, question: e.target.value })}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
              </div>

              {/* Options */}
              <div className='mb-4 flex flex-col gap-2'>
                <p style={labelStyle}>Answer Options</p>
                {quizQuestion.options.map((opt, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <motion.button type='button'
                      onClick={() => setQuizQuestion({ ...quizQuestion, correctAnswer: i })}
                      className='w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold'
                      style={{
                        background: quizQuestion.correctAnswer === i ? theme.gradients.gold : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${quizQuestion.correctAnswer === i ? theme.gold.bright : 'rgba(212,168,67,0.3)'}`,
                        color: quizQuestion.correctAnswer === i ? theme.navy.deepest : theme.text.muted,
                      }}
                      whileHover={{ scale: 1.1 }}>
                      {String.fromCharCode(65 + i)}
                    </motion.button>
                    <input type='text' placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      style={{ ...inputStyle, fontSize: '0.8rem', padding: '8px 12px' }}
                      value={opt}
                      onChange={e => {
                        const newOptions = [...quizQuestion.options]
                        newOptions[i] = e.target.value
                        setQuizQuestion({ ...quizQuestion, options: newOptions })
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
                  </div>
                ))}
                <p className='text-xs' style={{ color: theme.text.muted }}>
                  💡 Click the letter button to mark the correct answer
                </p>
              </div>

              <motion.button type='button' onClick={addQuizQuestion}
                className='w-full py-2.5 rounded-lg text-sm font-semibold'
                style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif" }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                Add Question ✓
              </motion.button>

              <motion.img onClick={() => setShowQuizPopup(false)} src={assets.cross_icon} alt="close"
                className='absolute top-4 right-4 w-4 cursor-pointer' style={{ filter: 'brightness(3)' }}
                whileHover={{ scale: 1.2, rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddCourse
