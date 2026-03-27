import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { theme } from '../../hooks/useAnimationVariants'
import BB8Toggle from './BB8Toggle'
import { usePageTheme } from '../../context/ThemeContext'

const NAV_LINKS = [
  { title: 'Home',       path: '/',            gradientFrom: '#d4a843', gradientTo: '#f0c455' },
  { title: 'About Us',   path: '/about',       gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { title: 'Courses',    path: '/course-list', gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { title: 'Contact Us', path: '/contact',     gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
]

const NavPill = ({ title, path, gradientFrom, gradientTo, isActive }) => {
  const [hovered, setHovered] = useState(false)
  const expanded = hovered || isActive
  return (
    <Link to={path}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', height: '36px', width: expanded ? '118px' : '36px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, overflow: 'hidden', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)', background: expanded ? `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})` : 'rgba(255,255,255,0.06)', border: expanded ? 'none' : '1px solid rgba(212,168,67,0.18)', boxShadow: expanded ? `0 4px 20px ${gradientFrom}50` : 'none' }}>
        <div style={{ position: 'absolute', bottom: '-5px', left: '15%', width: '70%', height: '100%', borderRadius: '999px', background: `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})`, filter: 'blur(10px)', opacity: expanded ? 0.4 : 0, transition: 'opacity 0.35s ease', zIndex: -1, pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', color: '#fff', fontSize: '0.75rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', whiteSpace: 'nowrap', opacity: expanded ? 1 : 0, transform: expanded ? 'scale(1)' : 'scale(0.7)', transition: 'opacity 0.2s ease 0.1s, transform 0.2s ease 0.1s', pointerEvents: 'none' }}>{title}</span>
        <div style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', background: isActive ? `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})` : 'rgba(212,168,67,0.45)', boxShadow: isActive ? `0 0 8px ${gradientFrom}` : 'none', opacity: expanded ? 0 : 1, transform: expanded ? 'scale(0)' : 'scale(1)', transition: 'opacity 0.15s ease, transform 0.15s ease', pointerEvents: 'none' }} />
      </div>
    </Link>
  )
}

const MobileMenu = ({ open, onClose, isEducator, becomeEducator, user, openSignIn }) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}
        style={{ position: 'absolute', top: '100%', right: '16px', left: '16px', marginTop: '8px', borderRadius: '16px', background: 'rgba(10,22,40,0.97)', border: '1px solid rgba(212,168,67,0.2)', backdropFilter: 'blur(20px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', zIndex: 999, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px', gap: '2px' }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} onClick={onClose}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '10px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: `linear-gradient(45deg, ${link.gradientFrom}, ${link.gradientTo})` }} />
                <span style={{ color: theme.text.primary, fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem' }}>{link.title}</span>
              </div>
            </Link>
          ))}
          {user && (
            <>
              <div style={{ width: '100%', height: '1px', margin: '6px 0', background: 'rgba(212,168,67,0.1)' }} />
              <button onClick={() => { becomeEducator(); onClose() }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '10px', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.gradients.gold }} />
                <span style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem' }}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</span>
              </button>
              <Link to='/my-enrollments' onClick={onClose}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '10px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(212,168,67,0.4)' }} />
                  <span style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem' }}>My Enrollments</span>
                </div>
              </Link>
            </>
          )}
          {!user && (
            <>
              <div style={{ width: '100%', height: '1px', margin: '6px 0', background: 'rgba(212,168,67,0.1)' }} />
              <button onClick={() => { openSignIn(); onClose() }} style={{ margin: '4px 0', padding: '10px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, #d4a843, #f0c455)', border: 'none', cursor: 'pointer', color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600 }}>
                Create Account
              </button>
            </>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const location = useLocation()
  const { isDark, toggleTheme } = usePageTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const becomeEducator = async () => {
    try {
      if (isEducator) { navigate('/educator'); return }
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) { setIsEducator(true); toast.success(data.message) }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, willChange: 'transform' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 80px', background: scrolled ? 'rgba(5,13,26,0.88)' : 'transparent', backdropFilter: scrolled ? 'blur(18px)' : 'none', borderBottom: scrolled ? '1px solid rgba(212,168,67,0.15)' : '1px solid transparent', transition: 'all 0.3s ease' }}>

        {/* LEFT — Logo */}
        <motion.img onClick={() => navigate('/')} src={assets.logomine} alt='Logo'
          style={{ width: '160px', cursor: 'pointer', filter: 'brightness(1.1)', flexShrink: 0, willChange: 'transform' }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300 }} />

        {/* RIGHT — desktop */}
        <div className='hidden md:flex' style={{ alignItems: 'center', gap: '8px' }}>
          {NAV_LINKS.map((link) => (
            <NavPill key={link.path} {...link} isActive={link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path)} />
          ))}

          <div style={{ width: '1px', height: '22px', background: 'rgba(212,168,67,0.2)', flexShrink: 0, margin: '0 4px' }} />


          {user && (
            <>
              <motion.button onClick={becomeEducator}
                style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)', color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s ease' }}
                whileHover={{ color: theme.gold.bright, borderColor: 'rgba(212,168,67,0.5)', background: 'rgba(212,168,67,0.1)', scale: 1.04 }}
                whileTap={{ scale: 0.97 }}>
                {isEducator ? 'Dashboard' : 'Become Educator'}
              </motion.button>
              <span style={{ color: 'rgba(212,168,67,0.25)', fontSize: '0.75rem', userSelect: 'none' }}>|</span>
              <Link to='/my-enrollments'>
                <motion.span style={{ color: theme.text.secondary, fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}
                  whileHover={{ color: theme.gold.bright }} transition={{ duration: 0.15 }}>
                  My Enrollments
                </motion.span>
              </Link>
              <span style={{ color: 'rgba(212,168,67,0.25)', fontSize: '0.75rem', userSelect: 'none' }}>|</span>
            </>
          )}

          {user ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 300 }}
              style={{ padding: '2px', borderRadius: '50%', border: '1.5px solid rgba(212,168,67,0.45)', boxShadow: '0 0 10px rgba(212,168,67,0.15)', flexShrink: 0, willChange: 'transform' }}>
              <UserButton />
            </motion.div>
          ) : (
            <motion.button onClick={() => openSignIn()}
              style={{ padding: '8px 20px', borderRadius: '999px', background: 'linear-gradient(135deg, #d4a843, #f0c455)', color: theme.navy.deepest, fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', flexShrink: 0, willChange: 'transform' }}
              whileHover={{ scale: 1.06, boxShadow: '0 0 20px rgba(212,168,67,0.45)' }}
              whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 300 }}>
              Create Account
            </motion.button>
          )}
          {/* ✅ BB8 Toggle */}
          <BB8Toggle checked={!isDark} onChange={toggleTheme} />
        </div>
          
        {/* Mobile */}
        <div className='flex md:hidden' style={{ alignItems: 'center', gap: '10px' }}>
          <BB8Toggle checked={!isDark} onChange={toggleTheme} />
          {user ? (
            <motion.div whileHover={{ scale: 1.08 }} style={{ padding: '2px', borderRadius: '50%', border: '1.5px solid rgba(212,168,67,0.45)', flexShrink: 0 }}>
              <UserButton />
            </motion.div>
          ) : (
            <motion.button onClick={() => openSignIn()} whileTap={{ scale: 0.9 }}>
              <img src={assets.user_icon} alt="sign in" style={{ filter: 'brightness(2)', width: '24px' }} />
            </motion.button>
          )}
          <motion.button onClick={() => setMobileOpen(o => !o)} whileTap={{ scale: 0.9 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px', cursor: 'pointer', background: 'transparent', border: 'none' }}>
            {[0, 1, 2].map((i) => (
              <motion.div key={i} style={{ height: '2px', borderRadius: '999px', background: theme.gold.bright, willChange: 'transform, opacity' }}
                animate={{ width: mobileOpen && i === 1 ? 0 : 22, rotate: mobileOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0, y: mobileOpen ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0, opacity: mobileOpen && i === 1 ? 0 : 1 }}
                transition={{ duration: 0.2 }} />
            ))}
          </motion.button>
        </div>
      </div>

      <div style={{ position: 'relative' }} className='md:hidden'>
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isEducator={isEducator} becomeEducator={becomeEducator} user={user} openSignIn={openSignIn} />
      </div>
    </motion.nav>
  )
}

export default Navbar
