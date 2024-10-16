import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { getToken } from '../helper/getToken';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import Loaders from './Loaders';
import toast from 'react-hot-toast';
import AnimationWrapper from './Page-Animation';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { getFirstErrorMessage } from '../helper/getErrorMessage';

const EditProfile = () => {
    const [loader, setLoader] = useState(false);
    const [checkUpdate, setCheckUpdate] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        middle_name: '',
        last_name: '',
        admitted_year: '',
        div: '',
        roll_no: '',
        email: '',
        student_id: '' // Add student_id field
    });

    const [initialEmail, setInitialEmail] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        const isLogin = checkLogin();
        if (!isLogin) {
            navigate('/login');
        }
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    function formatName(input) {
        const lowercaseInput = input.toLowerCase();
        return lowercaseInput.charAt(0).toUpperCase() + lowercaseInput.slice(1);
    }

    const handleSubmit = () => {
        setCheckUpdate(true);
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
        setLoader(true);

        let data = new FormData();
        data.append('name', formatName(formData.name));
        data.append('middle_name', formatName(formData.middle_name));
        data.append('last_name', formatName(formData.last_name));
        data.append('email', formData.email);
        data.append('roll_no', formData.roll_no);
        data.append('student_id', formData.student_id.toUpperCase());
        data.append('admitted_year', formData.admitted_year);
        data.append('div', formData.div);
        const token = getToken();

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

                setLoader(false);
                setCheckUpdate(false);
                toast.success(response.data.message);

                // Check if email has changed
                if (formData.email !== initialEmail) {
                    setCountdown(5);
                    setOpenModal(true);
                } else {
                    return navigate('/dmce/edit-profile');
                }
            })
            .catch((error) => {
                setLoader(false);
                setCheckUpdate(false);
                toast.error(getFirstErrorMessage(error.response.data));
                console.log(error);
            });
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            if (countdown === 1) {
                localStorage.removeItem('dmceuser');
                navigate('/login');
            }
            return () => clearTimeout(timer);
        }
    }, [countdown, navigate]);

    const fetchUser = () => {
        setLoader(true);
        let data = new FormData();
        const token = getToken();

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
                setInitialEmail(response.data.email);
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                console.log(error);
            });
    };

    return (
        <section className="w-full min-h-screen p-4 md:p-8">
            {loader ? (
                <Loaders message={(checkUpdate ? 'Updating' : 'Fetching') + ' Your Profile'} />
            ) : (
                <AnimationWrapper>
                    <div className="w-full max-md:mt-8 max-md:mb-8">
                        <h1 className="text-center text-xl md:text-6xl font-bold text-[#262847]">Edit Profile</h1>
                    </div>
                    <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className="label" htmlFor="email">Email</label>
                            <input
                                className="input"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                            <label className="label" htmlFor="name">Name</label>
                            <input
                                className="input"
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                            <label className="label" htmlFor="middle_name">Middle Name</label>
                            <input
                                className="input"
                                id="middle_name"
                                name="middle_name"
                                type="text"
                                value={formData.middle_name}
                                onChange={handleChange}
                                placeholder="Enter your middle name"
                            />
                            <label className="label" htmlFor="last_name">Last Name</label>
                            <input
                                className="input"
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className="label" htmlFor="student_id">Student ID</label>
                            <input
                                className="input"
                                id="student_id"
                                name="student_id"
                                type="text"
                                value={formData.student_id}
                                onChange={handleChange}
                                placeholder="Enter your student ID"
                            />
                            <label className="label" htmlFor="admitted_year">Admitted Year</label>
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
                                    {Array.from({ length: 11 }, (_, i) => 2018 + i).map(year => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <label className="label" htmlFor="div">Division</label>
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
                            <label className="label" htmlFor="roll_no">Roll No</label>
                            <input
                                className="input"
                                id="roll_no"
                                name="roll_no"
                                type="text"
                                value={formData.roll_no}
                                onChange={handleChange}
                                placeholder="Enter your roll number"
                            />
                        </div>
                    </div>
                    <div className='flex justify-center mt-4 '>
                        <button className='btn mx-auto' onClick={handleSubmit}>Submit</button>
                    </div>
                    <Modal open={openModal} onClose={() => setOpenModal(false)} center>
                        <div className="p-12 bg-white rounded-md shadow-lg text-center">
                            <h2 className="text-3xl font-bold mb-4" style={{ color: '#262847' }}>Email Changed</h2>
                            <p className="text-xl" style={{ color: '#262847' }}>You will be logged out in</p>
                            <p className="text-5xl font-extrabold" style={{ color: '#262847' }}>{countdown}</p>
                            <p className="text-xl" style={{ color: '#262847' }}>seconds...</p>
                        </div>
                    </Modal>
                </AnimationWrapper>
            )}
        </section>
    );
};

export default EditProfile;
