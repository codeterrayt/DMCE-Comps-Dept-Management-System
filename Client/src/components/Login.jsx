import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';

const LoginForm = () => {

    const { user, setUser } = useContext(userContext)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('dmceuser')
        if (token) {

            navigate('/dmce/home')

        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {

        const loading = toast.loading('wait! Login in progress')

        let data = new FormData();
        data.append('email', formData.email);
        data.append('password', formData.password);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/login',
            headers: {
                'Accept': 'application/json',
                // ...data.getHeaders()
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));

                const user = {
                    name: response.data.user.name,
                    token: response.data.token,
                    role: response.data.user.role
                }

                localStorage.setItem('dmceuser', JSON.stringify(user))
                toast.dismiss(loading)
                toast.success('login successful..')
                setUser(user)
                return navigate('/dmce/home')
            })
            .catch((error) => {
                console.log(error);
                toast.dismiss(loading)

            });

    };

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            <div className='mx-auto w-full'>
                <div className='w-full max-md:mt-8'>
                    <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Login</h1>
                </div>
                <div className='w-full max-md:mt-4'>
                    <form className='space-y-4 m
                    lg:w-[60%] md:w-[80%] mx-auto p-2 md:p-8 mt-4'>
                        <label className='label' htmlFor="email">Email</label>
                        <input type="email" id='email' name="email" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="password">Password</label>
                        <input type="password" id='password' name="password" className='input' onChange={handleChange} />

                        <div className='flex justify-center mt-4'>
                            <button type='button' className='btn' onClick={handleSubmit}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;
