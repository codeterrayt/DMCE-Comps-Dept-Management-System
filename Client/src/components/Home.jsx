
import React, { useEffect } from 'react'
import { checkLogin } from '../helper/checkLogin'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!checkLogin()) {
      return navigate('/dmce/login')
    }
  }, [])
  return (
    <div className="bg-gray-100 mb-[12px]  w-full h-screen flex items-center justify-center flex-col">
      <div className=' flex items-center justify-center'>
        <img className='w-[60%] max-md:w-[80%]' src="https://www.dmce.ac.in/assets/img/dmce.png" alt="logo" />
      </div>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to DMCE Data Management</h1>
        <p className="text-lg mb-6">Manage student data efficiently with our platform.</p>
        {/* Add more content or components as needed */}
      </div>

    </div>
  )
}

export default Home