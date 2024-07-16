
import React, { useEffect, useState } from 'react'
import { checkLogin } from '../helper/checkLogin'
import { useNavigate } from 'react-router-dom'
import { isUserInfoCompleted } from '../helper/isUserInfoCompleted'
import Loaders2 from './Loader2'
import AnimationWrapper from './Page-Animation'
import logo from '../assets/dmce.png'

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

    // const isProfileComplete = JSON.parse(userInsession).profile_completed

    // if (!isProfileComplete) {


    const checkProfile = async () => {
      setLoading(true)

      const result = await isProfileCompleted();
      console.log(result);
      if (result == 401) {
        localStorage.clear()
        return navigate('/login');
      }
      if (result == false) {
        console.log('varad');
        return navigate('/profile');
      }

      setLoading(false)
    };
    checkProfile();
    // }

  }, []);

  const isProfileCompleted = async () => {
    try {
      const user = localStorage.getItem('dmceuser');
      if (user) {

        const userData = JSON.parse(user);
        if (userData.role != 'admin' && userData.profile_completed) {
          return true;
        }
      }

      const result = await isUserInfoCompleted();
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return (
    <>
      {
        loader ? <Loaders2 /> :
          <AnimationWrapper className="bg-gray-100 mb-[12px]  w-full h-screen flex items-center justify-center flex-col">
            <div className=' flex items-center justify-center'>
              <img className='w-[60%] max-md:w-[80%]' src={logo} alt="logo" />
            </div>
            <div className="container mx-auto px-4 py-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to DMCE Data Management System</h1>

              <h1 className="text-2xl font-bold mb-4">For Computer Department <i className="fa-solid fa-computer text-4xl m-4 text-[#00006A]"></i></h1>

            </div>

          </AnimationWrapper>
      }
    </>
  )
}

export default Home