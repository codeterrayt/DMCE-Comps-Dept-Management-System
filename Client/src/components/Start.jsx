
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Start = () => {


    const navigate = useNavigate()

    useEffect(()=>{
        navigate('/dmce/home')

    },[])

  return (
    <div>Start</div>
  )
}

export default Start