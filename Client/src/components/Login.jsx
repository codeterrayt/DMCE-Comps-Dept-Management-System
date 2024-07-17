import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';
import logo from '../assets/dmce.png';

const LoginForm = () => {
    const { user, setUser } = useContext(userContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('dmceuser');
        if (token) {
            navigate('/dmce/home');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (!formData.email) {
            return toast.error('Please provide the email address.');
        }

        if (!formData.password) {
            return toast.error('Please provide the password.');
        }

        const loading = toast.loading('Wait! Logging in...');

        let data = new FormData();
        data.append('email', formData.email);
        data.append('password', formData.password);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/login`,
            headers: {
                'Accept': 'application/json',
                ...data.getHeaders
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                const user = {
                    name: response.data.user.name,
                    token: response.data.token,
                    role: response.data.user.role,
                    id: response.data.user.id
                }

                localStorage.setItem('dmceuser', JSON.stringify(user));
                toast.dismiss(loading);
                setUser(user);
                toast.success("Login successful");
                if (response.data.user.role === 'admin') {
                    return navigate('/admin');
                } else if (response.data.user.role === 'professor') {
                    return navigate('/professor');
                }
                return navigate('/dmce/home');
            })
            .catch((error) => {
                toast.dismiss(loading);
                return toast.error(getFirstErrorMessage(error.response.data));
            });
    };

    const [show, setShow] = useState(false);
    const handleEye = () => {
        setShow(pre => !pre);
    }

    return (
        <section className='relative w-full min-h-screen flex items-center justify-center p-4 bg-gray-50'>
            <AnimationWrapper className='w-full max-w-md p-6 bg-white shadow-lg rounded-lg'>
                <div className='text-center'>
                    <img src={logo} className='w-24 mx-auto mb-4' alt="DMCE Logo" />
                    <h1 className='text-3xl font-bold text-gray-800'>Login</h1>
                </div>
                <form className='mt-6 space-y-6'>
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
                        <button type='button' className='w-full py-2 px-4 bg-[#262847] text-white font-semibold rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-indigo-500' onClick={handleSubmit}>Login</button>
                    </div>
                    <p className='text-center text-gray-700'>
                        Don't have an account? <span onClick={() => navigate('/sign-up')} className='text-indigo-600 cursor-pointer underline'>Sign Up</span>
                    </p>
                </form>
            </AnimationWrapper>
        </section>
    );
};

export default LoginForm;
