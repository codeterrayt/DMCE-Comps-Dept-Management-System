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

const AddHigherStudies = () => {
    const [loader, setloader] = useState(false)

    const { id } = useParams()
    useEffect(() => {
        if (id) {
            getDataById(id)
        }

    }, [])
    const [formData, setFormData] = useState({
        academic_year: '',
        exam_type: '',
        score: '',
        city: '',
        state: '',
        country: '',
        university_name: '',
        course: '',
        guide: '',
        admission_letter: null,
    });

    // Handle input changes and update formData state
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Remove unwanted properties from the object
        const updatedFormData = { ...formData };
        if (value === '') {
            delete updatedFormData[name];
        } else {
            updatedFormData[name] = value;
        }

        setFormData(updatedFormData);
    };

    // Handle file input changes and update formData state
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0]
        }));
    };

    // Generate academic years for the select dropdown
    const years = [];
    for (let year = 2021; year <= 2030; year++) {
        const academicYear = `${year}-${year + 1}`;
        years.push(
            <MenuItem key={academicYear} value={academicYear}>
                {academicYear}
            </MenuItem>
        );
    }

    const navigate = useNavigate()

    // Handle form submission
    const handleSubmit = () => {
        // Check if all required fields are filled individually and provide error messages for each missing field
        if (!id && !formData.academic_year) {
            toast.error('Please select the academic year.');
            return;
        }
        if (!id && !formData.exam_type) {
            toast.error('Please enter the exam type.');
            return;
        }
        if (!id && !formData.score) {
            toast.error('Please enter the score.');
            return;
        }
        if (!id && !formData.city) {
            toast.error('Please enter the city.');
            return;
        }
        if (!id && !formData.state) {
            toast.error('Please enter the state.');
            return;
        }
        if (!id && !formData.country) {
            toast.error('Please enter the country.');
            return;
        }
        if (!id && !formData.university_name) {
            toast.error('Please enter the university name.');
            return;
        }
        if (!id && !formData.course) {
            toast.error('Please enter the course.');
            return;
        }
        if (!id && !formData.guide) {
            toast.error('Please enter the project guide.');
            return;
        }
        if (!id && !formData.admission_letter) {
            toast.error('Please upload the admission letter.');
            return;
        }

        if (!id && formData.admission_letter.size > 512 * 1024) {
            toast.error('Admission letter file size should be less than 512 KB.');
            return;
        }

        // Proceed with form submission if all checks pass
        const loading = toast.loading('Wait.. adding your details');

        let data = new FormData();
        data.append('student_academic_year', formData.academic_year);
        data.append('student_exam_type', formData.exam_type);
        data.append('student_score', formData.score);
        data.append('university_city', formData.city);
        data.append('university_state', formData.state);
        data.append('university_country', formData.country);
        data.append('university_name', formData.university_name);
        data.append('student_course', formData.course);
        data.append('student_project_guide', formData.guide);
        if (formData.admission_letter) {

            data.append('student_admission_letter', formData.admission_letter);
        }
        if (id) {
            data.append('id', id);
        }

        const token = getToken();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/student/update/higher-studies` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/higher-studies`,
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
                toast.dismiss(loading);
                toast.success(response.data.message);
                return navigate('/dmce/higher-studies')
            })
            .catch((error) => {
                console.error(error);
                toast.dismiss(loading);
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/dmce/login');
                }
                toast.error(error.response.data.message);
            });
    };

    const getDataById = (id) => {
        setloader(true)
        try {
            const token = getToken()

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/higher-studies/${id}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

            };

            axios.request(config)
                .then((response) => {
                    setloader(false)
                    setFormData({
                        academic_year: response.data.student_academic_year,
                        exam_type: response.data.student_exam_type,
                        score: response.data.student_score,
                        city: response.data.university_city,
                        state: response.data.university_state,
                        country: response.data.university_country,
                        university_name: response.data.university_name,
                        course: response.data.student_course,
                        guide: response.data.student_project_guide,

                    })
                })
                .catch((error) => {
                    setloader(false)
                    if (error.response && error.response.status === 401) {
                        localStorage.clear();
                        return navigate('/dmce/login');
                    }

                    console.log(error);
                });



        } catch (error) {
            console.log(error);

        }
    }


    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {
                loader ? <Loaders /> : <>
                    <div className='w-full max-md:mt-8  max-md:mb-8'>
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "Higher Study Detail"}</h1>
                    </div>
                    <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="academic_year">Select Academic Year</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl
                                    style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="academic-year-label">Academic Year</InputLabel>
                                    <Select
                                        labelId="academic-year-label"
                                        id="academic_year"
                                        name="academic_year"
                                        value={formData.academic_year || ''}
                                        onChange={handleChange}
                                    >
                                        {years}
                                    </Select>
                                </FormControl>
                            </Box>

                            <label className='label' htmlFor="exam_type">Exam Type <p className='example'>e.g:- GRE, VITEEE, NDA</p></label>
                            <input value={formData.exam_type} type="text" id='exam_type' name='exam_type' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="score">Score <p className='example'>e.g:- 60/100</p></label>
                            <input value={formData.score} type="number" id='score' name='score' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="city">City <p className='example'>e.g:- Los Angelous</p></label>
                            <input value={formData.city} type="text" id='city' name='city' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="state">State <p className='example'>e.g:- Miami</p></label>
                            <input value={formData.state} type="text" id='state' name='state' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="country">Country <p className='example'>e.g:- USA</p></label>
                            <input value={formData.country} type="text" id='country' name='country' className='input' onChange={handleChange} />
                        </div>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="university_name">University Name <p className='example'>e.g:- Oxford</p></label>
                            <input value={formData.university_name} type="text" id='university_name' name='university_name' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="course">Course <p className='example'>e.g:- MCE</p></label>
                            <input value={formData.course} type="text" id='course' name='course' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="guide">Guide Name</label>
                            <input value={formData.guide} type="text" id='guide' name='guide' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="admission_letter">Admission Letter <p className='example'>prefer pdf, size &lt; 512kb</p></label>
                            <div className="bg-gray-100 mb-[12px] ">
                                <label htmlFor="admission_letter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Admission Letter
                                </label>
                                <input id="admission_letter" name="admission_letter" type="file" className="hidden" onChange={handleFileChange} />
                                {formData.admission_letter && (
                                    <p className="mt-2 text-gray-700">Selected file: {formData.admission_letter.name}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <button className='btn' onClick={handleSubmit}>Submit</button>
                    </div></>
            }
        </section>
    );
};

export default AddHigherStudies;
