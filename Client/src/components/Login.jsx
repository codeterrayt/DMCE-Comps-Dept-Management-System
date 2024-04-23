import React, { useState } from 'react';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        console.log(formData);
        // Perform login authentication with the form data
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
