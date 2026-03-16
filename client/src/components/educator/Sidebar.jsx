import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { theme } from '../../hooks/useAnimationVariants'

const Sidebar = () => {
  const { isEducator } = useContext(AppContext)

  const menuItems = [
    { name: 'Dashboard',         path: '/educator',                  icon: assets.home_icon        },
    { name: 'Add Course',        path: '/educator/add-course',       icon: assets.add_icon         },
    { name: 'My Courses',        path: '/educator/my-courses',       icon: assets.my_course_icon   },
    { name: 'Students Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ]

  return isEducator && (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='md:w-64 w-16 min-h-screen flex flex-col py-4'
      style={{
        background: theme.navy.deep,
        borderRight: '1px solid rgba(212,168,67,0.15)',
      }}
    >
      {/* Top gold accent line */}
      <div
        className='w-full h-px mb-4'
        style={{ background: 'linear-gradient(to right, rgba(212,168,67,0.4), transparent)' }}
      />

      {menuItems.map((item, i) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/educator'}
        >
          {({ isActive }) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              whileHover={{ x: 4 }}
              style={{ willChange: 'transform' }}
              className='flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-6 gap-3 relative cursor-pointer'
            >
              {/* Active gold left border */}
              {isActive && (
                <motion.div
                  layoutId="activeBar"
                  className='absolute left-0 top-0 bottom-0 w-1 rounded-r'
                  style={{ background: theme.gradients.gold }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Active background */}
              <div
                className='absolute inset-0'
                style={{
                  background: isActive
                    ? 'rgba(212,168,67,0.08)'
                    : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              />

              {/* Icon */}
              <img
                src={item.icon}
                alt={item.name}
                className='w-5 h-5 relative z-10'
                style={{
                  filter: isActive
                    ? 'sepia(1) saturate(4) hue-rotate(5deg) brightness(1.2)'
                    : 'brightness(0.5)',
                  transition: 'filter 0.2s ease',
                }}
              />

              {/* Label */}
              <p
                className='md:block hidden text-sm font-medium relative z-10'
                style={{
                  color: isActive ? theme.gold.bright : theme.text.muted,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.02em',
                }}
              >
                {item.name}
              </p>
            </motion.div>
          )}
        </NavLink>
      ))}

      {/* Bottom gold accent line */}
      <div className='flex-1' />
      <div
        className='w-full h-px mt-4'
        style={{ background: 'linear-gradient(to right, rgba(212,168,67,0.2), transparent)' }}
      />
    </motion.div>
  )
}

export default Sidebar