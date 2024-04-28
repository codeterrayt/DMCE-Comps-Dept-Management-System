import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: ''
    });

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
                console.log(JSON.stringify(response.data));
                return toast.success('sign up successful')
            })
            .catch((error) => {
                console.log(error);
                return toast.error(error.response.data.message)
            });
    };

    const [show, setShow] = useState(false)
    const handleEye = () => {
        setShow(pre => !pre)

    }
    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            <div className='mx-auto w-full'>
                <div className='w-full max-md:mt-8  max-md:mb-8'>
                    <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Sign Up</h1>
                </div>
                <div className='grid grid-cols-1  mt-4 gap-4 w-full'>
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


                    </div>
                </div>
                <div className='flex justify-center mt-4'>
                    <button className='btn' onClick={handleSubmit}>Sign Up</button>
                </div>
            </div>
        </section>
    );
};

export default SignUpForm;
