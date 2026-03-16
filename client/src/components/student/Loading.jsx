import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { theme } from '../../hooks/useAnimationVariants'

// ── Animated Book ─────────────────────────────────────────────────────────────
const BookLoader = () => {
  return (
    <div className='flex flex-col items-center gap-8'>

      {/* Book */}
      <div
        className='relative flex items-center justify-center'
        style={{ width: '100px', height: '80px', perspective: '400px' }}
      >
        {/* Book spine */}
        <div
          className='absolute rounded-sm'
          style={{
            width: '10px',
            height: '72px',
            background: theme.gradients.gold,
            left: '45px',
            zIndex: 10,
            boxShadow: `0 0 16px rgba(212,168,67,0.5)`,
          }}
        />

        {/* Book cover left */}
        <motion.div
          className='absolute rounded-l-sm'
          style={{
            width: '44px',
            height: '72px',
            right: '51px',
            transformOrigin: 'right center',
            background: `linear-gradient(135deg, ${theme.navy.mid}, ${theme.navy.soft})`,
            border: '1px solid rgba(212,168,67,0.3)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: [0, -25, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Book cover right */}
        <motion.div
          className='absolute rounded-r-sm'
          style={{
            width: '44px',
            height: '72px',
            left: '51px',
            transformOrigin: 'left center',
            background: `linear-gradient(135deg, ${theme.navy.soft}, ${theme.navy.mid})`,
            border: '1px solid rgba(212,168,67,0.3)',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: [0, 25, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flipping pages */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className='absolute rounded-sm'
            style={{
              width: '38px',
              height: '66px',
              left: '50px',
              transformOrigin: 'left center',
              background: `rgba(240,196,85,${0.06 + i * 0.04})`,
              border: '1px solid rgba(212,168,67,0.15)',
              transformStyle: 'preserve-3d',
            }}
            animate={{ rotateY: [0, -160, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        ))}

        {/* Glow under book */}
        <motion.div
          className='absolute rounded-full blur-xl pointer-events-none'
          style={{
            width: '80px',
            height: '20px',
            bottom: '-12px',
            background: 'rgba(212,168,67,0.2)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Loading text */}
      <div className='flex flex-col items-center gap-2'>
        <motion.p
          className='text-sm font-semibold tracking-widest uppercase'
          style={{
            color: theme.gold.bright,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.2em',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading
        </motion.p>

        {/* Dot trail */}
        <div className='flex gap-1.5'>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className='rounded-full'
              style={{
                width: '6px',
                height: '6px',
                background: theme.gold.pure,
              }}
              animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Loading Page ──────────────────────────────────────────────────────────────
const Loading = () => {
  const { path } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [path, navigate])

  return (
    <motion.div
      className='min-h-screen flex items-center justify-center'
      style={{ background: theme.gradients.heroBase }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle dot grid */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.06) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orb */}
      <motion.div
        className='absolute rounded-full blur-3xl pointer-events-none'
        style={{
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className='relative z-10'>
        <BookLoader />
      </div>
    </motion.div>
  )
}

export default Loading