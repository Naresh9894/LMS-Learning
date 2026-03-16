import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'
import { theme } from '../../hooks/useAnimationVariants'

const Educator = () => {
  return (
    <div className='text-default min-h-screen flex flex-col' style={{ background: theme.navy.deepest }}>
      <Navbar />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 overflow-auto'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Educator