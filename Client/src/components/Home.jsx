
import React, { useEffect, useState } from 'react'
import { checkLogin } from '../helper/checkLogin'
import { useNavigate } from 'react-router-dom'
import { isUserInfoCompleted } from '../helper/isUserInfoCompleted'
import Loaders2 from './Loader2'
import AnimationWrapper from './Page-Animation'

const Home = () => {
  const navigate = useNavigate();
  const [loader, setLoading] = useState(false)

  useEffect(() => {


    if (!checkLogin()) {
      return navigate('/login');
    }
    const userInsession = localStorage.getItem('dmceuser')
    const { role } = JSON.parse(userInsession)
    if (role == 'admin') {
      return navigate('/admin')
    }

    const isProfileComplete = JSON.parse(userInsession).profile_completed

    if (!isProfileComplete) {


      const checkProfile = async () => {
        setLoading(true)

        const result = await isProfileCompleted();
        console.log(result);
        if (!result) {
          return navigate('/profile');
        }
        setLoading(false)
      };
      checkProfile();
    }

  }, []);

  const isProfileCompleted = async () => {
    try {
      const result = await isUserInfoCompleted();
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <>
      {
        loader ? <Loaders2 /> :
          <AnimationWrapper className="bg-gray-100 mb-[12px]  w-full h-screen flex items-center justify-center flex-col">
            <div className=' flex items-center justify-center'>
              <img className='w-[60%] max-md:w-[80%]' src="https://www.dmce.ac.in/assets/img/dmce.png" alt="logo" />
            </div>
            <div className="container mx-auto px-4 py-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to DMCE Data Management</h1>
              <p className="text-lg mb-6">Manage student data efficiently with our platform.</p>
              {/* Add more content or components as needed */}
            </div>

          </AnimationWrapper>
      }
    </>
  )
}

export default Home