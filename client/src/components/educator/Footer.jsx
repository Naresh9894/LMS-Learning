import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import { theme } from '../../hooks/useAnimationVariants'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='flex md:flex-row flex-col-reverse items-center justify-between w-full px-8 py-4'
      style={{
        background: theme.navy.deep,
        borderTop: '1px solid rgba(212,168,67,0.15)',
      }}
    >
      {/* Left — logo + copyright */}
      <div className='flex items-center gap-4'>
        <img
          className='hidden md:block w-20'
          src={assets.logomine}
          alt='logo'
        />
        <div
          className='hidden md:block h-5 w-px'
          style={{ background: 'rgba(212,168,67,0.25)' }}
        />
        <p
          className='py-2 text-center text-xs md:text-sm'
          style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}
        >
          Copyright 2025 © LMS-TECHMANI. All Rights Reserved.
        </p>
      </div>

      {/* Right — social icons */}
      <div className='flex items-center gap-3 max-md:mt-4'>
        {[
          { src: assets.facebook_icon,  alt: 'Facebook'  },
          { src: assets.twitter_icon,   alt: 'Twitter'   },
          { src: assets.instagram_icon, alt: 'Instagram' },
        ].map((social) => (
          <motion.a
            key={social.alt}
            href='#'
            whileHover={{ y: -3, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{ willChange: 'transform' }}
          >
            <img
              src={social.src}
              alt={social.alt}
              className='w-4 h-4'
              style={{ filter: 'brightness(0.5)', opacity: 0.7 }}
            />
          </motion.a>
        ))}
      </div>
    </motion.footer>
  )
}

export default Footer