import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/student/Footer'
import { theme, cinematic } from '../../hooks/useAnimationVariants'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { usePageTheme } from '../../context/ThemeContext'

// ── Timeline ──────────────────────────────────────────────────────────────────
const Timeline = ({ data, pageTheme }) => {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height)
  }, [])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 10%', 'end 50%'] })
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div ref={containerRef} className='w-full'>
      <div ref={ref} className='relative max-w-5xl mx-auto pb-20'>
        {data.map((item, index) => (
          <motion.div key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}
            className='flex justify-start pt-10 md:pt-24 md:gap-10'>
            <div className='sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full'>
              <motion.div className='h-10 w-10 absolute left-3 rounded-full flex items-center justify-center flex-shrink-0'
                style={{ background: pageTheme.isDark ? theme.navy.mid : '#fff', border: '2px solid rgba(212,168,67,0.4)' }}
                whileInView={{ boxShadow: ['0 0 0px rgba(212,168,67,0)', '0 0 20px rgba(212,168,67,0.5)', '0 0 8px rgba(212,168,67,0.2)'] }}
                viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.15 }}>
                <motion.div className='h-3 w-3 rounded-full' style={{ background: theme.gradients.gold }}
                  whileInView={{ scale: [0, 1.3, 1] }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }} />
              </motion.div>
              <motion.h3 className='hidden md:block text-4xl md:pl-20 font-bold'
                style={{ color: 'rgba(212,168,67,0.2)', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                whileInView={{ color: 'rgba(212,168,67,0.35)' }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}>
                {item.title}
              </motion.h3>
            </div>
            <div className='relative pl-20 pr-4 md:pl-4 w-full'>
              <h3 className='md:hidden block text-2xl mb-4 font-bold'
                style={{ color: theme.gold.pure, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {item.title}
              </h3>
              {item.content}
            </div>
          </motion.div>
        ))}

        {/* Animated vertical line */}
        <div className='absolute md:left-8 left-8 top-0 overflow-hidden w-[2px]'
          style={{ height: height + 'px', background: 'linear-gradient(to bottom, transparent, rgba(212,168,67,0.1), transparent)' }}>
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform, background: `linear-gradient(to top, ${theme.gold.bright}, rgba(212,168,67,0.4), transparent)` }}
            className='absolute inset-x-0 top-0 w-[2px] rounded-full' />
        </div>
      </div>
    </div>
  )
}

// ── Timeline item ─────────────────────────────────────────────────────────────
const TimelineItem = ({ year, heading, description, tags, pageTheme }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, ease: 'easeOut' }}
    whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(212,168,67,0.12)' }}
    className='rounded-2xl p-6 mb-4'
    style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, willChange: 'transform', transition: 'background 0.4s ease' }}>
    <motion.p className='text-xs uppercase tracking-widest mb-2'
      style={{ color: theme.gold.pure, letterSpacing: '0.15em' }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ delay: 0.2 }}>{year}</motion.p>
    <h4 className='text-xl font-semibold mb-3'
      style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
      {heading}
    </h4>
    <p className='text-sm leading-relaxed mb-4'
      style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
      {description}
    </p>
    {tags && (
      <motion.div className='flex flex-wrap gap-2'
        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.4 }}>
        {tags.map((tag, i) => (
          <motion.span key={i} className='text-xs px-3 py-1 rounded-full'
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', color: theme.gold.bright }}
            whileHover={{ scale: 1.08, background: 'rgba(212,168,67,0.14)' }}
            transition={{ type: 'spring', stiffness: 300 }}>{tag}</motion.span>
        ))}
      </motion.div>
    )}
  </motion.div>
)

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, delay, pageTheme }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(212,168,67,0.2)' }}
    className='flex flex-col items-center gap-2 p-6 rounded-2xl'
    style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, willChange: 'transform', transition: 'background 0.4s ease' }}>
    <motion.span className='text-4xl font-bold'
      style={{ background: theme.gradients.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: delay + 0.2, ease: 'backOut' }}>
      {value}
    </motion.span>
    <span className='text-xs uppercase tracking-widest'
      style={{ color: pageTheme.textMuted, letterSpacing: '0.15em', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
      {label}
    </span>
  </motion.div>
)

// ── Value card ────────────────────────────────────────────────────────────────
const ValueCard = ({ icon, title, description, delay, pageTheme }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(212,168,67,0.12)' }}
    className='p-6 rounded-2xl'
    style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, willChange: 'transform', transition: 'background 0.4s ease, border-color 0.2s ease' }}>
    <motion.div className='text-3xl mb-3' whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
      {icon}
    </motion.div>
    <h4 className='text-lg font-semibold mb-2'
      style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
      {title}
    </h4>
    <p className='text-sm leading-relaxed'
      style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
      {description}
    </p>
  </motion.div>
)

// ── Team card ─────────────────────────────────────────────────────────────────
const TeamCard = ({ name, role, image, delay, pageTheme }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(212,168,67,0.18)' }}
    className='flex flex-col items-center gap-4 p-6 rounded-2xl text-center'
    style={{ background: pageTheme.bgCard, border: `1px solid ${pageTheme.border}`, willChange: 'transform', transition: 'background 0.4s ease' }}>
    <motion.img src={image} alt={name} className='w-20 h-20 rounded-full object-cover'
      style={{ border: '2px solid rgba(212,168,67,0.4)', boxShadow: '0 0 20px rgba(212,168,67,0.15)' }}
      whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(212,168,67,0.35)' }}
      transition={{ type: 'spring', stiffness: 300 }} />
    <div>
      <p className='font-semibold text-base'
        style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}>
        {name}
      </p>
      <p className='text-xs mt-1' style={{ color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}>
        {role}
      </p>
    </div>
  </motion.div>
)

// ── Section heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ eyebrow, title, subtitle, pageTheme }) => {
  const { ref, inView } = useScrollAnimation()
  const { container, item } = cinematic
  return (
    <motion.div ref={ref} variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className='flex flex-col items-center text-center gap-3 mb-14'>
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

// ── About Page ────────────────────────────────────────────────────────────────
const About = () => {
  const navigate = useNavigate()
  const { ref: heroRef, inView: heroInView } = useScrollAnimation()
  const { pageTheme } = usePageTheme()  // ✅

  // Page bg
  const pageBg = pageTheme.isDark ? theme.navy.deepest : '#f8f6f0'
  const heroBg = pageTheme.isDark
    ? 'linear-gradient(180deg, #0a1628 0%, #050d1a 100%)'
    : 'linear-gradient(180deg, #fdf8f0 0%, #f0ebe0 100%)'
  const bottomFade = `linear-gradient(to bottom, transparent, ${pageBg})`

  // Timeline data — needs pageTheme so defined inside component
  const timelineData = [
    { title: '2022', content: <TimelineItem pageTheme={pageTheme} year="Founded" heading="The Idea Was Born" description="Two passionate developers with a dream — to make world-class tech education accessible to everyone. We started with just 3 courses and a small community of 100 students." tags={['3 Courses', 'First 100 Students', 'Bootstrap']} /> },
    { title: '2023', content: <TimelineItem pageTheme={pageTheme} year="Growth" heading="Building the Platform" description="Rebuilt the platform from scratch with React, Node.js and MongoDB. Launched our first paid cohort and reached 10,000 enrolled students across 15 courses." tags={['10K Students', '15 Courses', 'Full Stack Rebuild']} /> },
    { title: '2024', content: <TimelineItem pageTheme={pageTheme} year="Scale" heading="Going Premium" description="Partnered with industry educators, launched live mentorship and AI-powered learning paths. Our community grew to 35,000 learners with a 4.8★ average rating." tags={['35K Learners', 'AI Features', 'Live Mentorship', '4.8★ Rating']} /> },
    { title: '2025', content: <TimelineItem pageTheme={pageTheme} year="Today" heading="Sugoi Learn — World Class" description="200+ courses across web dev, AI, design and cloud. With 50,000+ students and counting, we are building the future of online learning — one course at a time." tags={['50K+ Students', '200+ Courses', 'Global Reach', 'Certificates']} /> },
  ]

  return (
    <div style={{ background: pageBg, transition: 'background 0.4s ease' }}>  {/* ✅ */}

      {/* ── HERO ── */}
      <section className='relative flex flex-col items-center justify-center text-center px-8 pt-36 pb-24 overflow-hidden'
        style={{ minHeight: '75vh', background: heroBg, transition: 'background 0.4s ease' }}>
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,${pageTheme.isDark ? '0.06' : '0.1'}) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <motion.div className='absolute rounded-full blur-3xl pointer-events-none'
          style={{ width: '600px', height: '600px', top: '-100px', left: '50%', transform: 'translateX(-50%)', background: theme.gradients.glow }}
          animate={{ scale: [1, 1.15, 1], opacity: pageTheme.isDark ? [0.2, 0.45, 0.2] : [0.1, 0.25, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className='absolute rounded-full blur-3xl pointer-events-none'
          style={{ width: '300px', height: '300px', bottom: '10%', right: '10%', background: theme.gradients.glowBlue }}
          animate={{ scale: [1, 1.2, 1], opacity: pageTheme.isDark ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
        <div className='absolute top-0 left-0 right-0 h-px'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.45), transparent)' }} />

        <motion.div ref={heroRef} variants={cinematic.container} initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          className='relative z-10 flex flex-col items-center gap-6 max-w-3xl'>

          <motion.div variants={cinematic.item}>
            <motion.span className='inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold uppercase'
              style={{ background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.3)', color: theme.gold.bright, letterSpacing: '0.18em', backdropFilter: 'blur(8px)' }}
              whileHover={{ scale: 1.05, background: 'rgba(212,168,67,0.14)' }}>
              <span className='w-1.5 h-1.5 rounded-full animate-pulse' style={{ background: theme.gold.bright }} />
              Our Story
            </motion.span>
          </motion.div>

          <motion.h1 variants={cinematic.item} className='font-bold leading-tight'
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: "'Cormorant Garamond', Georgia, serif", color: pageTheme.text, transition: 'color 0.4s ease' }}>
            We Exist to Make
            <br />
            <span style={{ background: theme.gradients.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Learning Fearless
            </span>
          </motion.h1>

          <motion.div variants={cinematic.item} className='w-20 h-px' style={{ background: theme.gradients.gold }}
            initial={{ scaleX: 0 }} animate={heroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }} />

          <motion.p variants={cinematic.item} className='text-lg leading-relaxed max-w-2xl'
            style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
            Sugoi Learn was built on one belief — that the right education can change anyone's life.
            We combine world-class instructors, practical projects, and a thriving community
            to give every learner the tools to build their future.
          </motion.p>

          <motion.div variants={cinematic.item} className='flex items-center gap-4 mt-2'>
            <motion.button onClick={() => navigate('/course-list')}
              className='px-8 py-3 rounded-full text-sm font-semibold'
              style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif" }}
              whileHover={{ scale: 1.06, boxShadow: '0 0 28px rgba(212,168,67,0.5)' }} whileTap={{ scale: 0.96 }}>
              Explore Courses
            </motion.button>
            <motion.button onClick={() => navigate('/contact')}
              className='px-8 py-3 rounded-full text-sm font-semibold'
              style={{ background: 'transparent', color: theme.gold.bright, border: '1px solid rgba(212,168,67,0.35)', fontFamily: "'DM Sans', sans-serif" }}
              whileHover={{ scale: 1.06, background: 'rgba(212,168,67,0.08)' }} whileTap={{ scale: 0.96 }}>
              Contact Us →
            </motion.button>
          </motion.div>
        </motion.div>

        <div className='absolute bottom-0 left-0 right-0 h-24 pointer-events-none'
          style={{ background: bottomFade }} />
      </section>

      {/* ── STATS ── */}
      <section className='px-8 md:px-20 py-16'>
        <div className='max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4'>
          <StatCard value="50K+" label="Students"    delay={0}   pageTheme={pageTheme} />
          <StatCard value="200+" label="Courses"     delay={0.1} pageTheme={pageTheme} />
          <StatCard value="50+"  label="Instructors" delay={0.2} pageTheme={pageTheme} />
          <StatCard value="4.9★" label="Avg Rating"  delay={0.3} pageTheme={pageTheme} />
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className='px-8 md:px-20 py-20'>
        <div className='max-w-6xl mx-auto'>
          <SectionHeading eyebrow="Our Mission" title="Why We Do This" pageTheme={pageTheme}
            subtitle="Education should never be gated by geography, background, or budget. We built Sugoi Learn to tear down those walls." />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            <ValueCard icon="🎯" title="Practical First"     delay={0}   pageTheme={pageTheme} description="Every course is built around real projects. No fluff — just skills you can use immediately in the real world." />
            <ValueCard icon="🌍" title="Accessible to All"   delay={0.1} pageTheme={pageTheme} description="Affordable pricing, regional support, and mobile-first design so no learner is left behind." />
            <ValueCard icon="🤝" title="Community Driven"    delay={0.2} pageTheme={pageTheme} description="Learning is better together. Our forums, live sessions, and peer reviews keep you connected." />
            <ValueCard icon="⚡" title="Always Current"      delay={0.3} pageTheme={pageTheme} description="Our curriculum is updated every quarter to match what the industry actually needs from developers." />
            <ValueCard icon="🏆" title="Recognized Certs"   delay={0.4} pageTheme={pageTheme} description="Our certificates are recognised by 100+ companies. Build your portfolio and land your dream job." />
            <ValueCard icon="🤖" title="AI-Powered Learning" delay={0.5} pageTheme={pageTheme} description="Personalised paths, smart recommendations, and an AI assistant available 24/7 to help you learn faster." />
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className='px-8 md:px-20 py-10'>
        <div className='max-w-6xl mx-auto'>
          <SectionHeading eyebrow="Our Journey" title="How We Got Here" pageTheme={pageTheme}
            subtitle="From a small idea to a platform trusted by 50,000+ learners — here's our story." />
        </div>
        <div className='max-w-5xl mx-auto px-4 md:px-20'>
          <Timeline data={timelineData} pageTheme={pageTheme} />
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className='px-8 md:px-20 py-20'>
        <div className='max-w-5xl mx-auto'>
          <SectionHeading eyebrow="The Team" title="People Behind Sugoi" pageTheme={pageTheme}
            subtitle="A small, passionate team obsessed with making learning better for everyone." />
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
            <TeamCard name="Manikandan A"  role="Founder & CEO"      pageTheme={pageTheme} image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" delay={0} />
            <TeamCard name="Priya Sharma"  role="Head of Curriculum" pageTheme={pageTheme} image="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face" delay={0.1} />
            <TeamCard name="Arjun Dev"     role="Lead Engineer"      pageTheme={pageTheme} image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" delay={0.2} />
            <TeamCard name="Divya Nair"    role="Community Lead"     pageTheme={pageTheme} image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className='px-8 py-28 relative overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.05) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className='absolute top-0 left-0 right-0 h-px'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />
        <div className='absolute bottom-0 left-0 right-0 h-px'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)' }} />
        <motion.div className='absolute rounded-full blur-3xl pointer-events-none'
          style={{ width: '500px', height: '500px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: theme.gradients.glow }}
          animate={{ scale: [1, 1.2, 1], opacity: pageTheme.isDark ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05] }}
          transition={{ duration: 6, repeat: Infinity }} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className='relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto'>

          <motion.h2 className='text-4xl md:text-5xl font-bold'
            style={{ color: pageTheme.text, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: 'color 0.4s ease' }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            Ready to Start
            <span style={{ background: theme.gradients.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Learning?</span>
          </motion.h2>

          <motion.p className='text-base leading-relaxed'
            style={{ color: pageTheme.textSec, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            Join 50,000+ learners already building their future with Sugoi Learn.
            Your first course is waiting.
          </motion.p>

          <motion.div className='w-16 h-px' style={{ background: theme.gradients.gold }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} />

          <motion.button onClick={() => navigate('/course-list')}
            className='px-10 py-4 rounded-full text-base font-semibold'
            style={{ background: theme.gradients.gold, color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif", willChange: 'transform' }}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 36px rgba(212,168,67,0.55)' }} whileTap={{ scale: 0.97 }}>
            Browse All Courses →
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default About