import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
function BackButton() {
    const navigate = useNavigate()
  return (
    <div className='py-2 flex justify-start my-5'>
        <button onClick={()=>navigate(-1)} className='cursor-pointer flex items-center'> <ArrowBackIosIcon sx={{ fontSize: 18  }}/> Back</button>
    </div>
  )
}

export default BackButton