import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const {currency}=useContext(AppContext)
  const [dashboardData, setDashboardData]=useState(null);

  const fetchDashboardData = async()=>{
    setDashboardData(dummyDashboardData)
  }

  useEffect(()=>{
    fetchDashboardData()
  },[])

  return dashboardData ?(
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 *
    md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
          <div className='flex flex-wrap gap-5 items-strech'>
          <div className='flex items-center gap-3 shadow-card border-2 border-double border-gray-600 p-4 w-56 rounded-md bg-orange-400/60 hover:bg-slate-500 hover:text-white'>
            <img src={assets.patients_icon} alt="patients_icon" />
          
          <div>
              <p className='text-2xl font-medium text-black-900 '>{dashboardData.enrolledStudentsData.length}</p>
               <p className='text-base text-black-900'>Total Enrollments</p>
          </div>
        </div>
           <div className='flex items-center gap-3 shadow-card border-2 border-double border-gray-600 p-4 w-56 rounded-md bg-orange-400/60 hover:bg-slate-500 hover:text-white'>
            <img src={assets.appointments_icon} alt="appointments_icon" />
          
          <div>
              <p className='text-2xl font-medium text-black-900'>{dashboardData.enrolledStudentsData.length}</p>
               <p className='text-base text-black-900'>Total Enrollments</p>
          </div>
        </div>
           <div className='flex items-center gap-3 shadow-card border-2 border-double border-gray-600 p-4 w-56 rounded-md bg-orange-400/60 hover:bg-slate-500 hover:text-white'>
            <img src={assets.earning_icon} alt="earning_icon" />
          
          <div>
              <p className='text-2xl font-medium text-black-900'>{currency}{dashboardData.totalEarnings}</p>
               <p className='text-base text-black-900'>Total Earnings</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className='pb-4 text-lg font-medium'>Latest Enrollments</h2>
        <div className='flex flex-col items-center max-w-4xl w-full
        overflow-hidden rounded-md bg-gray-500 border-2 border-solid border-black'>
          <table className='table-fixed md:table-auto w-full overflow-hidden border-collapse bg-gray-500 '>
            <thead className='text-gray-900 border-b border-gray-200 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>S.No</th>
                <th className='px-4 py-3 font-semibold'>Student Name</th>
                <th className='px-4 py-3 font-semibold'>Course Title</th>
              </tr>
            </thead>
            <tbody className='text-sm text-white '>
              {dashboardData.enrolledStudentsData.map((item,index)=>(
                <tr key={index} className='border-b border-gray-400  hover:bg-gray-200/20 hover:text-black '>
                  <td className='px-4 py-3 text-center hidden sm:table-cell'>{index+1}</td>
                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img src={item.student.imageUrl} alt="profile"  className='w-9 h-9 rounded-full'/>
                  <span className='truncate'>{item.student.name}</span>
                  </td>
                  <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  ):<Loading/>
}

export default Dashboard
