import React, { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';
import logo from '../assets/dmce.png';

const SignUpForm = () => {
    const { user, setUser } = useContext(userContext)

    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {


        if (!formData.firstName) {
            return toast.error('pleased provide first name')

        }
        if (!formData.firstName.split(' ').length > 1) {
            toast.error('First name should only contain one word.');
            return; // Exit the function if first name contains more than one word
        }

        if (!formData.email) {
            return toast.error('please provide the email address')
        }

        if (!formData.password) {
            return toast.error('please provide the password')
        }

        const loading = toast.loading('wait! Sign up in progress')

        let data = new FormData();
        data.append('name', formData.firstName);
        data.append('email', formData.email);
        data.append('password', formData.password);

        console.log("varad", data);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,

            url: `${import.meta.env.VITE_SERVER_DOMAIN}/register`,
            headers: {
                'Accept': 'application/json',

            },
            data: data
        };

        console.log(config);
        axios.request(config)
            .then((response) => {
                const user = {
                    name: response.data.user.name,
                    token: response.data.token,
                    role: response.data.user.role,
                    id: response.data.user.id

                }
                setUser(user)

                localStorage.setItem('dmceuser', JSON.stringify(user))
                toast.dismiss(loading)
                toast.success("signup successful")
                return navigate('/dmce/home')
            })
            .catch((error) => {
                console.log(error);
                toast.dismiss(loading)
                return toast.error(getFirstErrorMessage(error.response.data))
            });
    };

    const [show, setShow] = useState(false)
    const handleEye = () => {
        setShow(pre => !pre)

    }
    return (
        <section className='w-full min-h-screen p-4 md:p-2'>
            <AnimationWrapper className='mx-auto w-full'>
            <div className='w-full'>
                    <img src={logo} className='w-40 mx-auto mb-4' alt="" />
                </div>
                <div className='w-full max-md:mt-8  max-md:mb-8'>
                    <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847] tracking-[3px]'>Sign Up</h1>
                </div>
                <div className='grid grid-cols-1 gap-4 w-full'>
                    <div className=' w-full lg:w-[60%] mx-auto md:w-[80%] p-2 md:p-8 mt-4'>
                        <label className='label' htmlFor="firstName">First Name</label>
                        <input type="text" id='firstName' name="firstName" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="email">Email</label>
                        <input type="email" id='email' name="email" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="password">Password</label>
                        <div className='w-full  flex items-center relative' >
                            <input type={show ? "text" : "password"} id='password' name="password" className='input' onChange={handleChange} />
                            <i onClick={handleEye} className={"fa-solid " + (show ? "fa-eye-slash" : "fa-eye") + " absolute right-2 top-1/3"}></i>

                        </div>

                        <div className='flex justify-center mt-4'>
                            <button className='btn' onClick={handleSubmit}>Sign Up</button>
                        </div>
                        <p className='font-bold text-center mt-8'>Already have account? <p onClick={() => navigate('/login')} className=' text-[13px] cursor-pointer text-blue-700 underline inline'>Login</p> </p>


                    </div>

                </div>

            </AnimationWrapper>
        </section>
    );
};

export default SignUpForm;
