import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loaders from './Loaders';
import { checkLogin } from '../helper/checkLogin';
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';

const Profile = () => {
    const [loader, setLoader] = useState(false);
    const [step, setStep] = useState(1);
    const [checkUpdate, setCheckUpdate] = useState(false)

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        middle_name: '',
        last_name: '',
        email: '',
        roll_no: '',
        student_id: '',
        admitted_year: '',
        div: '',
    });


    useEffect(() => {
        const isLogin = checkLogin()
        if (!isLogin) {
            navigate('/login')
        }
        fetchUser()
    }, [])

    const fetchUser = () => {

        setLoader(true)
        let data = new FormData();

        const token = getToken()

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/fetch/profile`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...data.getHeaders
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setFormData({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    middle_name: response.data.middle_name || '',
                    last_name: response.data.last_name || '',
                    roll_no: response.data.roll_no || '',
                    student_id: response.data.student_id || '',
                    admitted_year: response.data.admitted_year || '',
                    div: response.data.div || '',
                });
                setLoader(false)
            })
            .catch((error) => {
                setLoader(false)
                console.log(error);
            });


    }

    // Handle input changes and update formData state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    function formatName(input) {
        // Convert the entire string to lowercase first
        const lowercaseInput = input.toLowerCase();

        // Capitalize the first letter
        const formattedName = lowercaseInput.charAt(0).toUpperCase() + lowercaseInput.slice(1);

        return formattedName;
    }


    // Handle form submission
    const handleSubmit = () => {
        setCheckUpdate(true)
        if (!formData.name) {
            toast.error("Please enter your name");
            return;
        }
        if (!formData.middle_name) {
            toast.error("Please enter your middle name");
            return;
        }
        if (!formData.last_name) {
            toast.error("Please enter your last name");
            return;
        }

        if (!formData.email) {
            toast.error("Please enter your email");
            return;
        }

        if (!formData.roll_no) {
            toast.error("Please enter your roll number");
            return;
        }

        if (!formData.student_id) {
            toast.error("Please enter your student ID");
            return;
        }

        if (!formData.admitted_year) {
            toast.error("Please select your admitted year");
            return;
        }

        if (!formData.div) {
            toast.error("Please select your division");
            return;
        }
        setLoader(true)


        let data = new FormData();
        data.append('name', formatName(formData.name));
        data.append('middle_name', formatName(formData.middle_name));
        data.append('last_name', formatName(formData.last_name));
        data.append('email', formData.email);
        data.append('roll_no', formData.roll_no);

        data.append('student_id', formData.student_id.toUpperCase());
        data.append('admitted_year', formData.admitted_year);
        data.append('div', formData.div);
        const token = getToken()

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/update/profile`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...data.getHeaders
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                const dmceUser = JSON.parse(localStorage.getItem('dmceuser')) || {};
                dmceUser.profile_completed = true;
                localStorage.setItem('dmceuser', JSON.stringify(dmceUser));

                setLoader(false)
                setCheckUpdate(false)
                return navigate('/dmce/home')

            })
            .catch((error) => {
                setLoader(false)
                setCheckUpdate(false)
                toast.error(getFirstErrorMessage(error.response.data))
                console.log(error);
            });

    };

    const nextStep = () => {
        if (step === 1 && !formData.name) {
            toast.error('Please enter your name.');
            return;
        }
        if (step === 1 && !formData.middle_name) {
            toast.error('Please enter your middle name.');
            return;
        }
        if (step === 1 && !formData.last_name) {
            toast.error('Please enter your last name.');
            return;
        }
        if (step === 2 && (!formData.email)) {
            toast.error('Please Enter Your Email.');
            return;
        }
        if (step === 2 && (!formData.roll_no)) {
            toast.error('Please Enter Your Roll NO.');
            return;
        }
        if (step === 2 && (!formData.student_id)) {
            toast.error('Please Enter Your student id.');
            return;
        }
        if (step === 3 && (!formData.admitted_year)) {
            toast.error('Please select admitted year');
            return;
        }
        if (step === 3 && (!formData.div)) {
            toast.error('Please select division.');
            return;
        }


        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const currentYear = new Date().getFullYear(); // Get the current year

    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {/* Loader */}
            {loader ? <Loaders message={(checkUpdate ? 'Updating' : 'Fetching') + 'Your Profile'} /> : (
                <AnimationWrapper className='md:w-[80%] mx-auto w-[98%]'>
                    {/* Form Title */}
                    <div className='w-full max-md:mt-8  max-md:mb-8'>
                        {/* <i onClick={()=>navigate()} class="fa-solid fa-right-from-bracket cursor-pointer rotate-180 text-3xl "></i> */}
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Add Student Detail</h1>
                    </div>
                
                    {/* Form Fields */}
                    {step === 1 && (
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="name">Name</label>
                            <input value={formData.name} type="text" id='name' name='name' className='input' onChange={handleChange} />

                            <label className='label' value={formData.middle_name} htmlFor="middle_name">Middle Name</label>
                            <input value={formData.middle_name} type="text" id='middle_name' name="middle_name" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="last_name">Last Name</label>
                            <input value={formData.last_name} type="text" id='last_name' name="last_name" className='input' onChange={handleChange} />

                            <div className='flex justify-center mt-4'>
                                <button className='btn' onClick={nextStep}>Next</button>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="email">Email </label>
                            <input disabled value={formData.email} type="email" id='email' name="email" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="roll_no">Roll No. <p className='example'>e.g:- 23</p></label>
                            <input value={formData.roll_no} type="Number" id='roll_no' name="roll_no" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="student_id">Student ID <p className='example'>e.g:- 2021FHCO131</p></label>
                            <input autoCapitalize='true' value={formData.student_id} type="text" id='student_id' name="student_id" className='input' onChange={handleChange} />

                            <div className='flex items-center mt-4 gap-4 max-md:flex-col'>
                                <button className='btn' onClick={prevStep}>Previous</button>
                                <button className='btn' onClick={nextStep}>Next</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="admitted_year-label">Admitted Year</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="admitted_year-label">Admitted Year</InputLabel>
                                    <Select
                                        labelId="admitted_year-label"
                                        id="admitted_year"
                                        name="admitted_year"
                                        value={formData.admitted_year || ''}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">Select Year</MenuItem>
                                        {years.map(year => (
                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>


                            <label className='label' htmlFor="div-label">Division</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="div-label">Division</InputLabel>
                                    <Select
                                        labelId="div-label"
                                        id="div"
                                        name="div"
                                        value={formData.div || ''}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">Select Division</MenuItem>
                                        <MenuItem value="A">A</MenuItem>
                                        <MenuItem value="B">B</MenuItem>
                                        <MenuItem value="C">C</MenuItem>
                                        <MenuItem value="D">D</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>


                            <div className='flex items-center mt-4 gap-4 max-md:flex-col'>
                                <button className='btn' onClick={prevStep}>Previous</button>
                                <button className='btn' onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    )}
                </AnimationWrapper>
            )}
        </section>
    );
};

export default Profile;
