import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { theme } from '../../hooks/useAnimationVariants'

// ✅ categories match course.js model exactly
const CATEGORIES = [
  'Technology', 'Web Development', 'AI & Machine Learning', 'Design',
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
  const [category, setCategory]         = useState('Technology') // ✅ NEW
  const [image, setImage]               = useState(null)
  const [chapter, setChapter]           = useState([])
  const [showPopup, setShowPopup]       = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false,
  })

  const handlechapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:')
      if (title) {
        const newchapter = {
          chapterId: uniqid(), chapterTitle: title, chapterContent: [], collapsed: false,
          chapterOrder: chapter.length > 0 ? chapter.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapter([...chapter, newchapter])
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
    if (action === 'add') {
      setCurrentChapterId(chapterId); setShowPopup(true)
    } else if (action === 'remove') {
      setChapter(chapter.map((c) => {
        if (c.chapterId === chapterId) c.chapterContent.splice(lectureIndex, 1)
        return c
      }))
    }
  }

  const addLecture = () => {
    setChapter(chapter.map((c) => {
      if (c.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder: c.chapterContent.length > 0 ? c.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
          lectureId: uniqid(),
        }
        c.chapterContent.push(newLecture)
      }
      return c
    }))
    setShowPopup(false)
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!image) { toast.error('Thumbnail Not Selected'); return }
      const courseData = {
        courseTitle,
        category,                                         // ✅ NEW — send category
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
        setCategory('Technology')                         // ✅ NEW — reset
        setImage(null); setChapter([])
        quillRef.current.root.innerHTML = ''
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
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
    <div className='h-screen overflow-scroll flex flex-col items-start md:p-8 md:pb-0 p-4 pt-6 pb-0'
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

        {/* ✅ NEW — Category Dropdown */}
        <div className='flex flex-col gap-1'>
          <p style={labelStyle}>Category / Department</p>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}
                style={{ background: '#0a1628', color: theme.text.primary }}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Course Description */}
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
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-xs' style={{ color: theme.text.muted }}>{chap.chapterContent.length} Lectures</span>
                    <motion.img onClick={() => handlechapter('remove', chap.chapterId)}
                      src={assets.cross_icon} alt="remove" className='cursor-pointer w-4 h-4'
                      whileHover={{ scale: 1.2, rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }}
                      style={{ filter: 'brightness(3)' }} />
                  </div>
                </div>
                <AnimatePresence>
                  {!chap.collapsed && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                      className='p-4 flex flex-col gap-2'>
                      {chap.chapterContent.map((lecture, lectureIndex) => (
                        <div key={lectureIndex} className='flex justify-between items-center text-xs py-2 px-3 rounded-lg'
                          style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.08)', color: theme.text.secondary }}>
                          <span>
                            {lectureIndex + 1}. {lecture.lectureTitle} — {lecture.lectureDuration}mins —{' '}
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
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleLecture('add', chap.chapterId)}
                        className='inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-medium mt-1 w-fit'
                        style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', color: theme.gold.bright }}>
                        + Add Lecture
                      </motion.div>
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

      {/* Add Lecture Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 flex items-center justify-center z-50'
            style={{ background: 'rgba(5,13,26,0.85)', backdropFilter: 'blur(6px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className='relative p-6 rounded-2xl w-full max-w-sm'
              style={{ background: theme.navy.mid, border: '1px solid rgba(212,168,67,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
              <h2 className='text-lg font-semibold mb-5'
                style={{ color: theme.text.primary, fontFamily: "'Cormorant Garamond', serif" }}>Add Lecture</h2>
              {[
                { label: 'Lecture Title', key: 'lectureTitle', type: 'text' },
                { label: 'Duration (minutes)', key: 'lectureDuration', type: 'number' },
                { label: 'Lecture URL', key: 'lectureUrl', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key} className='mb-3 flex flex-col gap-1'>
                  <p style={labelStyle}>{label}</p>
                  <input type={type} style={inputStyle} value={lectureDetails[key]}
                    onChange={e => setLectureDetails({ ...lectureDetails, [key]: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'} />
                </div>
              ))}
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
    </div>
  )
}

export default AddCourse