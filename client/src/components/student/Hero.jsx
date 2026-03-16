import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Cloud, fetchSimpleIcons, renderSimpleIcon } from 'react-icon-cloud'
import SearchBar from './SearchBar'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { cinematic, theme } from '../../hooks/useAnimationVariants'
import { usePageTheme } from '../../context/ThemeContext'

const TYPE_WORDS = ['fit your choice.', 'your schedule.', 'your ambition.', 'your future.']

const ICON_SLUGS = [
  'react', 'nodedotjs', 'javascript', 'typescript', 'python',
  'mongodb', 'postgresql', 'docker', 'git', 'github',
  'html5', 'css3', 'tailwindcss', 'figma', 'firebase',
  'amazonwebservices', 'vercel', 'nextdotjs', 'express', 'graphql',
  'redis', 'nginx', 'linux', 'cplusplus', 'jest',
]

const cloudProps = {
  containerProps: { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' } },
  options: { reverse: true, depth: 1, wheelZoom: false, imageScale: 2, activeCursor: 'default', tooltip: 'native', initial: [0.1, -0.1], clickToFront: 500, tooltipDelay: 0, outlineColour: '#0000', maxSpeed: 0.035, minSpeed: 0.015 },
}

// ── Icon Cloud — bgHex switches with theme ────────────────────────────────────
const TechIconCloud = ({ isDark }) => {
  const [iconData, setIconData] = useState(null)

  useEffect(() => {
    fetchSimpleIcons({ slugs: ICON_SLUGS }).then(setIconData)
  }, [])

  const renderedIcons = useMemo(() => {
    if (!iconData) return null
    return Object.values(iconData.simpleIcons).map((icon) =>
      renderSimpleIcon({
        icon,
        bgHex: isDark ? '#080510' : '#f8f6f0',   // ✅ switches with theme
        fallbackHex: '#d4a843',
        minContrastRatio: 1.5,
        size: 42,
        aProps: { href: undefined, target: undefined, rel: undefined, onClick: (e) => e.preventDefault() },
      })
    )
  }, [iconData, isDark])   // ✅ re-renders when theme changes

  // @ts-ignore
  return <Cloud {...cloudProps}><>{renderedIcons}</></Cloud>
}

// ── Particle Field ────────────────────────────────────────────────────────────
const ParticleField = ({ isDark }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4, dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(212,168,67,${0.07 * (1 - dist / 130)})`
            ctx.lineWidth = 0.6
            ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        grad.addColorStop(0, `rgba(240,196,85,${p.alpha})`); grad.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(240,196,85,${p.alpha + 0.2})`; ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: isDark ? 0.5 : 0.25 }} />  // ✅ dimmer in light mode
  )
}

// ── Typewriter ────────────────────────────────────────────────────────────────
const useTypewriter = (words, speed = 80, pause = 2000) => {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause)
        else setCharIdx(c => c + 1)
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(w => (w + 1) % words.length); setCharIdx(0) }
        else setCharIdx(c => c - 1)
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])
  return display
}

const TypewriterText = ({ words }) => {
  const typed = useTypewriter(words, 75, 2000)
  const longest = words.reduce((a, b) => a.length > b.length ? a : b, '')
  return (
    <span style={{ display: 'inline-block', position: 'relative' }}>
      <span style={{ visibility: 'hidden', pointerEvents: 'none' }}>{longest}</span>
      <span style={{ position: 'absolute', left: 0, top: 0, background: theme.gradients.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', whiteSpace: 'nowrap' }}>
        {typed}
        <motion.span style={{ WebkitTextFillColor: theme.gold.bright }} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.75, repeat: Infinity }}>|</motion.span>
      </span>
    </span>
  )
}

// ── Magnetic Wrapper ──────────────────────────────────────────────────────────
const MagneticWrapper = ({ children }) => {
  const ref = useRef(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const rotateX = useTransform(y, [-30, 30], [5, -5]); const rotateY = useTransform(x, [-30, 30], [-5, 5])
  const springX = useSpring(rotateX, { stiffness: 180, damping: 22 }); const springY = useSpring(rotateY, { stiffness: 180, damping: 22 })
  return (
    <motion.div ref={ref}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); x.set(e.clientX - r.left - r.width / 2); y.set(e.clientY - r.top - r.height / 2) }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900, willChange: 'transform' }}
      className="w-full flex justify-center">
      {children}
    </motion.div>
  )
}

// ── Glow Orb ─────────────────────────────────────────────────────────────────
const GlowOrb = ({ className, type = 'gold', isDark }) => (
  <motion.div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    style={{ background: type === 'gold' ? theme.gradients.glow : theme.gradients.glowBlue, willChange: 'transform, opacity' }}
    animate={{ scale: [1, 1.2, 1], opacity: isDark ? [0.5, 0.9, 0.5] : [0.2, 0.4, 0.2] }}  // ✅ dimmer in light
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
)

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { ref, inView } = useScrollAnimation()
  const { container, item } = cinematic
  const { isDark, pageTheme } = usePageTheme()  // ✅ theme

  // Hero background — dark navy vs warm white gradient
  const heroBg = isDark
    ? theme.gradients.heroBase
    : 'linear-gradient(180deg, #fdf8f0 0%, #f0ebe0 100%)'

  // Bottom fade matches page bg
  const bottomFade = `linear-gradient(to bottom, transparent, ${pageTheme.bg})`

  // Heading color — dark = cream, light = deep navy
  const headingColor = isDark ? theme.text.primary : '#1a1a2e'
  const subColor     = isDark ? theme.text.secondary : '#4a5568'
  const mutedColor   = isDark ? theme.text.muted : '#718096'

  return (
    <div ref={ref} className="relative w-full overflow-hidden"
      style={{ background: heroBg, transition: 'background 0.4s ease' }}>

      <ParticleField isDark={isDark} />
      <GlowOrb className="w-[500px] h-[500px] -top-40 left-1/4 -translate-x-1/2" type="gold" isDark={isDark} />
      <GlowOrb className="w-[300px] h-[300px] top-1/2 left-1/4" type="blue" isDark={isDark} />
      <GlowOrb className="w-[400px] h-[400px] top-1/3 right-10" type="gold" isDark={isDark} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, rgba(212,168,67,${isDark ? '0.07' : '0.12'}) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Top gold beam */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.4), transparent)' }} />

      {/* Two column layout */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto md:pt-36 pt-24 pb-24 px-7 md:px-16 gap-10">

        {/* LEFT */}
        <motion.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col items-start gap-7 max-w-2xl text-left">

          {/* Badge */}
          <motion.div variants={item}>
            <motion.span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold uppercase"
              style={{ background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.3)', color: theme.gold.bright, letterSpacing: '0.18em', backdropFilter: 'blur(8px)' }}
              whileHover={{ scale: 1.05, background: 'rgba(212,168,67,0.14)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.gold.bright }} />
              World-Class Learning Platform
            </motion.span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={item} className="font-bold leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: "'Cormorant Garamond', Georgia, serif", color: headingColor, letterSpacing: '-0.01em', willChange: 'transform, opacity', transition: 'color 0.4s ease' }}>
            Empower your future with
            <br />
            <span style={{ color: subColor, transition: 'color 0.4s ease' }}>courses designed to </span>
            <TypewriterText words={TYPE_WORDS} />
          </motion.h1>

          {/* Gold divider */}
          <motion.div variants={item} className="w-24 h-px" style={{ background: theme.gradients.gold }} />

          {/* Subtext */}
          <motion.p variants={item} className="hidden md:block leading-relaxed"
            style={{ fontSize: '1.05rem', color: subColor, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.4s ease' }}>
            We bring together world-class instructors, interactive content, and a
            supportive community to help you achieve your personal and professional goals.
          </motion.p>
          <motion.p variants={item} className="md:hidden max-w-sm leading-relaxed text-sm"
            style={{ color: subColor, transition: 'color 0.4s ease' }}>
            World-class instructors to help you achieve your professional goals.
          </motion.p>

          {/* SearchBar */}
          <motion.div variants={item} className="w-full mt-1 max-w-xl">
            <MagneticWrapper><SearchBar /></MagneticWrapper>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="flex items-center gap-8 mt-2">
            {[{ value: '50K+', label: 'Students' }, { value: '200+', label: 'Courses' }, { value: '4.9★', label: 'Rating' }].map((stat, i) => (
              <React.Fragment key={stat.label}>
                <motion.div className="text-center" whileHover={{ y: -4, scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} style={{ willChange: 'transform' }}>
                  <div className="font-bold" style={{ fontSize: '1.4rem', fontFamily: "'Cormorant Garamond', Georgia, serif", background: theme.gradients.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs tracking-widest uppercase mt-0.5"
                    style={{ color: mutedColor, letterSpacing: '0.12em', transition: 'color 0.4s ease' }}>
                    {stat.label}
                  </div>
                </motion.div>
                {i < 2 && <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,67,0.3), transparent)' }} />}
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Icon Cloud */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="hidden md:flex items-center justify-center relative flex-shrink-0"
          style={{ width: '420px', height: '420px' }}
        >
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)' }} />
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: '320px', height: '320px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid rgba(212,168,67,0.15)', boxShadow: '0 0 60px rgba(212,168,67,0.12), inset 0 0 60px rgba(212,168,67,0.05)' }}
            animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="absolute rounded-full pointer-events-none"
            style={{ width: '400px', height: '400px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px dashed rgba(212,168,67,0.08)' }}
            animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} />
          <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}>
            <TechIconCloud isDark={isDark} />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade — blends into page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: bottomFade }} />
    </div>
  )
}

export default Hero