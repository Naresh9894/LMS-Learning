import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { cinematic, theme } from '../../hooks/useAnimationVariants'

// ── Footer always stays navy — never changes with BB8 toggle ──────────────────
const Footer = () => {
  const { ref, inView } = useScrollAnimation({ margin: '-40px' })
  const { container, item } = cinematic

  return (
    <footer
      className='w-full'
      style={{
        background: 'linear-gradient(180deg, #050d1a 0%, #030810 100%)',
        borderTop: '1px solid rgba(212,168,67,0.15)',
      }}
    >
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className='flex flex-col md:flex-row items-start px-8 md:px-36 justify-between gap-10 md:gap-16 py-14'
        style={{ borderBottom: '1px solid rgba(212,168,67,0.08)' }}
      >
        {/* Brand */}
        <motion.div variants={item} className='flex flex-col gap-4 max-w-xs'>
          <img src={assets.logomine} alt='logo' className='w-36'
            style={{ filter: 'brightness(1.1)' }} />
          <p className='text-sm leading-relaxed'
            style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
            Empowering learners through accessible and effective online education.
            Your trusted platform for quality learning and skill development.
          </p>
          {/* Social icons */}
          <div className='flex gap-3 mt-1'>
            {[assets.facebook_icon, assets.twitter_icon, assets.instagram_icon].map((icon, i) => (
              <motion.a key={i} href='#'
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ willChange: 'transform' }}>
                <img src={icon} alt='social' className='w-5 h-5'
                  style={{ filter: 'brightness(0.6) sepia(0.3)', opacity: 0.7 }} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Company links */}
        <motion.div variants={item} className='flex flex-col gap-4'>
          <h2 className='text-xs uppercase tracking-widest font-semibold'
            style={{ color: theme.gold.pure, letterSpacing: '0.18em' }}>
            Company
          </h2>
          <ul className='flex flex-col gap-2.5'>
            {[
              { label: 'Home',           path: '/'            },
              { label: 'About us',       path: '/about'       },
              { label: 'Courses',     path: '/course-list'     },
              { label: 'Contact us',     path: '/contact'     },
            ].map(({ label, path }) => (
              <li key={label}>
                <Link to={path}>
                  <motion.span className='text-sm'
                    style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}
                    whileHover={{ color: theme.gold.bright, x: 3 }}
                    transition={{ type: 'spring', stiffness: 300 }}>
                    {label}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div variants={item} className='hidden md:flex flex-col gap-4 max-w-xs'>
          <h2 className='text-xs uppercase tracking-widest font-semibold'
            style={{ color: theme.gold.pure, letterSpacing: '0.18em' }}>
            Newsletter
          </h2>
          <p className='text-sm leading-relaxed'
            style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
            The latest news, articles, and resources sent to your inbox weekly.
          </p>
          <div className='flex items-center gap-2 mt-1'>
            <input
              type='email'
              placeholder='Enter your email'
              className='outline-none text-sm px-3 rounded h-9 w-52'
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(212,168,67,0.2)',
                color: theme.text.primary,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(212,168,67,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,168,67,0.2)'}
            />
            <motion.button
              className='h-9 px-4 rounded text-xs font-semibold'
              style={{
                background: 'linear-gradient(135deg, #d4a843, #f0c455)',
                color: theme.navy.deepest,
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: 'nowrap',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(212,168,67,0.4)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}>
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className='py-4 px-8 md:px-36 flex flex-col md:flex-row items-center justify-between gap-2'>
        <p className='text-xs'
          style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}>
          Copyright 2025 © SmartLearn Hub. All Rights Reserved.
        </p>
        <div className='w-16 h-px' style={{ background: theme.gradients.gold }} />
      </div>
    </footer>
  )
}

export default Footer
