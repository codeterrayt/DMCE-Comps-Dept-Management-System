import React, { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';
import logo from '../assets/dmce.png';

const SignUpForm = () => {
    const { user, setUser } = useContext(userContext);

    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (!formData.firstName) {
            return toast.error('Please provide first name');
        }
        if (formData.firstName.split(' ').length > 1) {
            return toast.error('First name should only contain one word.');
        }

        if (!formData.email) {
            return toast.error('Please provide the email address');
        }

        if (!formData.password) {
            return toast.error('Please provide the password');
        }

        const loading = toast.loading('Wait! Sign up in progress');

        let data = new FormData();
        data.append('name', formData.firstName);
        data.append('email', formData.email);
        data.append('password', formData.password);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/register`,
            headers: {
                'Accept': 'application/json',
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                const user = {
                    name: response.data.user.name,
                    token: response.data.token,
                    role: 'student',
                    id: response.data.user.id
                };
                setUser(user);
                localStorage.setItem('dmceuser', JSON.stringify(user));
                toast.dismiss(loading);
                toast.success("Signup successful");
                return navigate('/dmce/home');
            })
            .catch((error) => {
                toast.dismiss(loading);
                return toast.error(getFirstErrorMessage(error.response.data));
            });
    };

    const [show, setShow] = useState(false);
    const handleEye = () => {
        setShow(prev => !prev);
    };

    return (
        <section className='relative w-full min-h-screen flex items-center justify-center p-4 bg-gray-50'>
            <AnimationWrapper className='w-full max-w-md p-6 bg-white shadow-lg rounded-lg'>
                <div className='text-center'>
                    <img src={logo} className='w-24 mx-auto mb-4' alt="DMCE Logo" />
                    <h1 className='text-3xl font-bold text-gray-800'>Sign Up</h1>
                </div>
                <form className='mt-6 space-y-6'>
                    <div>
                        <label className='block text-gray-700' htmlFor="firstName">First Name</label>
                        <input type="text" id='firstName' name="firstName" className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' onChange={handleChange} />
                    </div>
                    <div>
                        <label className='block text-gray-700' htmlFor="email">Email</label>
                        <input type="email" id='email' name="email" className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' onChange={handleChange} />
                    </div>
                    <div>
                        <label className='block text-gray-700' htmlFor="password">Password</label>
                        <div className='relative'>
                            <input type={show ? "text" : "password"} id='password' name="password" className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' onChange={handleChange} />
                            <i onClick={handleEye} className={"fa-solid " + (show ? "fa-eye-slash" : "fa-eye") + " absolute right-3 top-3 cursor-pointer text-gray-500"}></i>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <button type='button' className='w-full py-2 px-4 bg-[#262847] text-white font-semibold rounded-md shadow-md  focus:outline-none focus:ring-2 ' onClick={handleSubmit}>Sign Up</button>
                    </div>
                    <p className='text-center text-gray-700'>
                        Already have an account? <span onClick={() => navigate('/login')} className='text-indigo-600 cursor-pointer underline'>Login</span>
                    </p>
                </form>
            </AnimationWrapper>
        </section>
    );
};

export default SignUpForm;
