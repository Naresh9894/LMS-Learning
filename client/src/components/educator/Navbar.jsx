import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { theme } from '../../hooks/useAnimationVariants'

const Navbar = () => {
  const { user } = useUser()

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='flex items-center justify-between px-4 md:px-8 py-3'
      style={{
        background: theme.navy.deep,
        borderBottom: '1px solid rgba(212,168,67,0.15)',
        willChange: 'transform',
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ willChange: 'transform' }}
      >
        <Link to='/'>
          <img src={assets.logomine} alt='Logo' className='w-28 lg:w-32' />
        </Link>
      </motion.div>

      {/* Right side */}
      <div className='flex items-center gap-4'>

        {/* Greeting badge */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className='hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full'
          style={{
            background: 'rgba(212,168,67,0.07)',
            border: '1px solid rgba(212,168,67,0.2)',
          }}
        >
          <span
            className='text-xs'
            style={{ color: theme.text.muted, fontFamily: "'DM Sans', sans-serif" }}
          >
            Hi,
          </span>
          <span
            className='text-xs font-semibold'
            style={{ color: theme.gold.bright, fontFamily: "'DM Sans', sans-serif" }}
          >
            {user ? user.fullName : 'Educator'}
          </span>
        </motion.div>

        {/* User button / avatar */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{ willChange: 'transform' }}
        >
          {user
            ? <UserButton />
            : (
              <img
                className='w-8 h-8 rounded-full object-cover'
                src={assets.profile_img}
                alt='profile'
                style={{ border: '2px solid rgba(212,168,67,0.4)' }}
              />
            )}
        </motion.div>

      </div>
    </motion.div>
  )
}

export default Navbar