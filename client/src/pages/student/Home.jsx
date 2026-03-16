import React from 'react'
import Hero from '../../components/student/hero'
import Companies from '../../components/student/companies'
import CoursesSection from '../../components/student/CoursesSection'
import Testmonialsection from '../../components/student/Testmonialsection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/footer'
import { usePageTheme } from '../../context/ThemeContext'
const Home = () => {
  const { pageTheme } = usePageTheme()
  return (
    <div style={{ background: pageTheme.bg, color: pageTheme.text }}>
      <Hero/>
      <Companies/>
      <CoursesSection/>
      <Testmonialsection/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default Home
