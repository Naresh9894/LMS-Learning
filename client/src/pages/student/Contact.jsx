import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../../components/student/Footer'
import { theme, cinematic } from '../../hooks/useAnimationVariants'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { usePageTheme } from '../../context/ThemeContext'
import axios from 'axios'
import { toast } from 'react-toastify'

// ── Info Card ─────────────────────────────────────────────────────────────────
const InfoCard = ({ icon, title, value, sub, delay, pageTheme }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(212,168,67,0.18)' }}
    className='flex flex-col items-center text-center gap-3 p-6 rounded-2xl'
    style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, willChange: 'transform', transition: 'background 0.4s ease' }}
  >
    <div className='w-12 h-12 rounded-full flex items-center justify-center text-2xl'
      style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)' }}>
      {icon}
    </div>
    <div>
      <p className='text-xs uppercase tracking-widest mb-1'
        style={{ color: theme.gold.pure, letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif" }}>
        {title}
      </p>
      <p className='font-semibold text-base'
        style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
        {value}
      </p>
      {sub && (
        <p className='text-xs mt-1'
          style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
          {sub}
        </p>
      )}
    </div>
  </motion.div>
)

// ── FAQ Item ──────────────────────────────────────────────────────────────────
const FAQItem = ({ question, answer, isOpen, onToggle, pageTheme }) => (
  <motion.div
    className='rounded-xl overflow-hidden'
    style={{ border: `1px solid ${pageTheme.border}`, background: pageTheme.bgCard, transition: 'background 0.4s ease' }}
  >
    <button
      onClick={onToggle}
      className='w-full flex items-center justify-between px-5 py-4 text-left'
    >
      <span className='font-medium text-sm md:text-base'
        style={{ color: pageTheme.text, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
        {question}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25 }}
        className='text-lg flex-shrink-0 ml-4'
        style={{ color: theme.gold.bright }}
      >
        ↓
      </motion.span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className='px-5 pb-4 text-sm leading-relaxed'
            style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", borderTop: `1px solid ${pageTheme.border}`, paddingTop: '12px', transition: 'color 0.4s ease' }}>
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

// ── Section Heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ eyebrow, title, subtitle, pageTheme }) => {
  const { ref, inView } = useScrollAnimation()
  const { container, item } = cinematic
  return (
    <motion.div ref={ref} variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className='flex flex-col items-center text-center gap-3 mb-12'>
      <motion.p variants={item} className='text-xs uppercase tracking-widest'
        style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>{eyebrow}</motion.p>
      <motion.h2 variants={item} className='text-4xl md:text-5xl font-bold'
        style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
        {title}
      </motion.h2>
      <motion.div variants={item} className='w-16 h-px' style={{ background: theme.gradients.gold }} />
      {subtitle && (
        <motion.p variants={item} className='max-w-xl text-base leading-relaxed'
          style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQ_DATA = [
  { question: 'How do I enroll in a course?', answer: 'Click on any course, then click "Enroll Now". You will be taken to a secure Stripe checkout. After payment, you get instant access to all course content.' },
  { question: 'Do I get a certificate after completing a course?', answer: 'Yes! Once you complete all lectures, you can download your certificate of completion from the My Enrollments page. Our certificates are recognised by 100+ companies.' },
  { question: 'Can I get a refund if I\'m not satisfied?', answer: 'We offer a 7-day refund policy. If you\'re not happy with the course, contact us within 7 days of purchase and we\'ll process a full refund, no questions asked.' },
  { question: 'How do I become an educator on Sugoi Learn?', answer: 'Click "Become Educator" in the navbar. Once approved, you can create and publish courses directly from your Educator Dashboard. We review all applications within 48 hours.' },
  { question: 'Is there a mobile app available?', answer: 'Our website is fully mobile-responsive and works great on all devices. A dedicated iOS and Android app is currently in development and will be released soon.' },
  { question: 'How can I reset my password?', answer: 'Your account is managed by Clerk authentication. Click the user avatar in the navbar, then go to Account Settings to change your password or manage your profile.' },
]

// ── Contact Page ──────────────────────────────────────────────────────────────
const Contact = () => {
  const { pageTheme } = usePageTheme()
  const { ref: heroRef, inView: heroInView } = useScrollAnimation()
  const [openFAQ, setOpenFAQ] = useState(null)

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setSending(true)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact/send`,
        form
      )
      if (data.success) {
        setSent(true)
        setForm({ name: '', email: '', subject: '', message: '' })
        toast.success('Message sent! We\'ll get back to you within 24 hours.')
      } else {
        toast.error(data.message || 'Failed to send message')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const heroBg = pageTheme.isDark
    ? 'linear-gradient(180deg, #0a1628 0%, #050d1a 100%)'
    : 'linear-gradient(180deg, #fdf8f0 0%, #f0ebe0 100%)'

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    background: pageTheme.inputBg,
    border: `1px solid ${pageTheme.border}`,
    color: pageTheme.text,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.4s ease',
    caretColor: theme.gold.bright,
  }

  const SOCIALS = [
    { icon: '🐦', label: 'Twitter',   href: '#', color: '#1DA1F2' },
    { icon: '💼', label: 'LinkedIn',  href: '#', color: '#0A66C2' },
    { icon: '📸', label: 'Instagram', href: '#', color: '#E1306C' },
    { icon: '▶️', label: 'YouTube',   href: '#', color: '#FF0000' },
  ]

  return (
    <div style={{ background: pageTheme.bg, transition: 'background 0.4s ease' }}>

      {/* ── HERO ── */}
      <section className='relative flex flex-col items-center justify-center text-center px-8 pt-36 pb-20 overflow-hidden'
        style={{ minHeight: '55vh', background: heroBg, transition: 'background 0.4s ease' }}>
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.06) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <motion.div className='absolute rounded-full blur-3xl pointer-events-none'
          style={{ width: '500px', height: '500px', top: '-80px', left: '50%', transform: 'translateX(-50%)', background: theme.gradients.glow }}
          animate={{ scale: [1, 1.15, 1], opacity: pageTheme.isDark ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <div className='absolute top-0 left-0 right-0 h-px'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.4), transparent)' }} />

        <motion.div ref={heroRef} variants={cinematic.container} initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          className='relative z-10 flex flex-col items-center gap-5 max-w-3xl'>

          <motion.div variants={cinematic.item}>
            <motion.span className='inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold uppercase'
              style={{ background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.3)', color: theme.gold.bright, letterSpacing: '0.18em', backdropFilter: 'blur(8px)' }}
              whileHover={{ scale: 1.05 }}>
              <span className='w-1.5 h-1.5 rounded-full animate-pulse' style={{ background: theme.gold.bright }} />
              Get In Touch
            </motion.span>
          </motion.div>

          <motion.h1 variants={cinematic.item} className='font-bold leading-tight'
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: "'Cormorant Garamond', Georgia, serif", color: pageTheme.text, transition: 'color 0.4s ease' }}>
            We'd Love to
            <br />
            <span style={{ background: theme.gradients.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Hear From You
            </span>
          </motion.h1>

          <motion.div variants={cinematic.item} className='w-20 h-px' style={{ background: theme.gradients.gold }} />

          <motion.p variants={cinematic.item} className='text-lg leading-relaxed max-w-2xl'
            style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
            Have a question, feedback, or just want to say hello?
            We respond to every message within 24 hours.
          </motion.p>
        </motion.div>

        <div className='absolute bottom-0 left-0 right-0 h-20 pointer-events-none'
          style={{ background: `linear-gradient(to bottom, transparent, ${pageTheme.bg})` }} />
      </section>

      {/* ── INFO CARDS ── */}
      <section className='px-8 md:px-20 py-16'>
        <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5'>
          <InfoCard icon="📧" title="Email Us" value="smartlearnhub3@gmail.com" sub="We reply within 24 hours" delay={0} pageTheme={pageTheme} />
          <InfoCard icon="📞" title="Call Us" value="+91 98765 43210" sub="Mon–Fri, 9am–6pm IST" delay={0.1} pageTheme={pageTheme} />
          <InfoCard icon="📍" title="Our Office" value="Chennai, Tamil Nadu" sub="India — 600001" delay={0.2} pageTheme={pageTheme} />
        </div>
      </section>

      {/* ── SOCIAL LINKS ── */}
      <section className='px-8 md:px-20 pb-16'>
        <div className='max-w-5xl mx-auto'>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className='flex flex-col items-center gap-6 p-8 rounded-2xl'
            style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, transition: 'background 0.4s ease' }}>
            <p className='text-xs uppercase tracking-widest' style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>
              Follow Us
            </p>
            <div className='flex items-center gap-4 flex-wrap justify-center'>
              {SOCIALS.map((s, i) => (
                <motion.a key={s.label} href={s.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.1, boxShadow: `0 8px 24px ${s.color}40` }}
                  whileTap={{ scale: 0.95 }}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium'
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}35`, color: pageTheme.text, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', willChange: 'transform', transition: 'color 0.4s ease' }}>
                  <span>{s.icon}</span>
                  {s.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT FORM + FAQ ── */}
      <section className='px-8 md:px-20 py-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12'>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className='flex flex-col gap-1 mb-8'>
              <p className='text-xs uppercase tracking-widest' style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Send a Message</p>
              <h2 className='text-3xl font-bold' style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
                Contact Form
              </h2>
              <div className='w-10 h-px mt-2' style={{ background: theme.gradients.gold }} />
            </div>

            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className='flex flex-col items-center text-center gap-4 p-10 rounded-2xl'
                style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.3)' }}>
                <span className='text-5xl'>🎉</span>
                <h3 className='text-2xl font-bold' style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', serif" }}>Message Sent!</h3>
                <p className='text-sm' style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif" }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <motion.button onClick={() => setSent(false)}
                  className='px-6 py-2 rounded-full text-sm font-medium mt-2'
                  style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif" }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  Send Another
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                {/* Name + Email */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs uppercase tracking-wider' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                      Name <span style={{ color: theme.gold.bright }}>*</span>
                    </label>
                    <input name='name' value={form.name} onChange={handleChange}
                      placeholder='Your name' style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                      onBlur={e => e.target.style.borderColor = pageTheme.border} />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs uppercase tracking-wider' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                      Email <span style={{ color: theme.gold.bright }}>*</span>
                    </label>
                    <input name='email' type='email' value={form.email} onChange={handleChange}
                      placeholder='your@email.com' style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                      onBlur={e => e.target.style.borderColor = pageTheme.border} />
                  </div>
                </div>

                {/* Subject */}
                <div className='flex flex-col gap-1'>
                  <label className='text-xs uppercase tracking-wider' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Subject</label>
                  <input name='subject' value={form.subject} onChange={handleChange}
                    placeholder='What is this about?' style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                    onBlur={e => e.target.style.borderColor = pageTheme.border} />
                </div>

                {/* Message */}
                <div className='flex flex-col gap-1'>
                  <label className='text-xs uppercase tracking-wider' style={{ color: pageTheme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    Message <span style={{ color: theme.gold.bright }}>*</span>
                  </label>
                  <textarea name='message' value={form.message} onChange={handleChange}
                    placeholder='Tell us what you need help with...'
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
                    onBlur={e => e.target.style.borderColor = pageTheme.border} />
                </div>

                {/* Submit */}
                <motion.button type='submit' disabled={sending}
                  className='w-full py-3 rounded-xl text-sm font-semibold mt-2'
                  style={{
                    background: sending ? 'rgba(212,168,67,0.3)' : theme.gradients.gold,
                    color: theme.navy.deepest,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: sending ? 'not-allowed' : 'pointer',
                    willChange: 'transform',
                  }}
                  whileHover={!sending ? { scale: 1.02, boxShadow: '0 0 24px rgba(212,168,67,0.4)' } : {}}
                  whileTap={!sending ? { scale: 0.98 } : {}}>
                  {sending ? 'Sending...' : 'Send Message →'}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className='flex flex-col gap-1 mb-8'>
              <p className='text-xs uppercase tracking-widest' style={{ color: theme.gold.pure, letterSpacing: '0.2em' }}>Common Questions</p>
              <h2 className='text-3xl font-bold' style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
                FAQ
              </h2>
              <div className='w-10 h-px mt-2' style={{ background: theme.gradients.gold }} />
            </div>

            <div className='flex flex-col gap-3'>
              {FAQ_DATA.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}>
                  <FAQItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQ === i}
                    onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                    pageTheme={pageTheme}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className='px-8 py-20 relative overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className='absolute top-0 left-0 right-0 h-px'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className='relative z-10 flex flex-col items-center text-center gap-4 max-w-xl mx-auto'>
          <p className='text-4xl'>🤝</p>
          <h2 className='text-3xl font-bold' style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
            Still have questions?
          </h2>
          <p className='text-base' style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
            Our team is happy to help. Reach out and we'll get back to you within a day.
          </p>
          <motion.a href='mailto:smartlearnhub3@gmail.com'
            className='px-8 py-3 rounded-full text-sm font-semibold'
            style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 28px rgba(212,168,67,0.45)' }}
            whileTap={{ scale: 0.97 }}>
            Email Us Directly →
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
