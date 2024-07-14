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
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (!formData.email) {
            return toast.error('please provide the email address');
        }

        if (!formData.password) {
            return toast.error('please provide the password');
        }

        const loading = toast.loading('wait! Login in progress');

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
                toast.success("login successful");
                if (response.data.user.role === 'admin') {
                    return navigate('/admin');
                }else if(response.data.user.role === 'professor'){
                    return navigate('/professor')
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
        <section className='relative w-full min-h-screen p-4 mt-8 md:p-8 overflow-hidden'>
            <AnimationWrapper className='mx-auto w-full'>
                <div className='w-full'>
                    <img src={logo} className='w-40 mx-auto mb-4' alt="" />
                </div>
                <div className='w-full max-md:mt-8'>
                    <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847] tracking-[3px]'>Login</h1>
                </div>
                <div className='w-full max-md:mt-4'>
                    <form className='space-y-4  lg:w-[60%] md:w-[80%] mx-auto p-2 md:p-8  relative z-10'>
                        <label className='label' htmlFor="email">Email</label>
                        <input type="email" id='email' name="email" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="password">Password</label>
                        <div className='w-full  flex items-center relative' >
                            <input type={show ? "text" : "password"} id='password' name="password" className='input' onChange={handleChange} />
                            <i onClick={handleEye} className={"fa-solid " + (show ? "fa-eye-slash" : "fa-eye") + " absolute right-2 top-1/3"}></i>
                        </div>

                        <div className='flex justify-center mt-4'>
                            <button type='button' className='btn' onClick={handleSubmit}>Login</button>
                        </div>
                        <p className='font-bold text-center'>Don't have an account? <span onClick={() => navigate('/sign-up')} className=' text-[13px] cursor-pointer text-blue-700 underline inline'>Sign Up</span> </p>
                    </form>
                </div>
            </AnimationWrapper>

        </section>
    );
};

export default LoginForm;
