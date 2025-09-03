import React from 'react'
import { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ScrollToTop from '../../components/ScrollToTop'

function LandingPage() {
    const naviagte = useNavigate()
  return (
    <div className='p-5 flex flex-col justify-center items-center h-screen'>
      <Toaster position="top-center" />
        <h1 className='text-xl font-bold mb-2'>ExamDemo</h1>
        <h2 className="head text-lg">
            A platform to participate and acknowledge your knowlegde.
        </h2>
        <div className="btnsToStart mt-5 flex gap-5">
        <button className="btnPrimary" onClick={()=>naviagte('/login')}>Get Started</button>
        <button className="btnSecondary" onClick={()=>naviagte('/signup')}>New Here?</button>
        </div>
    </div>
  )
}

export default LandingPage