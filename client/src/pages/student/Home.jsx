import React from 'react'
import Hero from '../../components/student/hero'
import Companies from '../../components/student/companies'
import CoursesSection from '../../components/student/CoursesSection'
import Testmonialsection from '../../components/student/Testmonialsection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
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
