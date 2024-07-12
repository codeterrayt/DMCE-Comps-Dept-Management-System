import React, { useEffect, useRef, useState } from 'react';
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
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';
import { getYearOptions } from '../helper/helper';
import { getRole } from '../helper/getRole';

const AddHigherStudies = () => {
    const [loader, setloader] = useState(false)

    const { id } = useParams()

    const [role, setRole] = useState('')
    const [roleLoading, setRoleLoading] = useState(true);  // New state for role loading

    useEffect(() => {
        const roleInsession = getRole();
        setRole(roleInsession)
        setRoleLoading(false)
    }, [])
    useEffect(() => {
        if (id && role) {
            getDataById(id)
        }

    }, [id, role])
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
        desc: ''
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
    const parentDivRef = useRef(null);

    // Handle form submission
    const handleSubmit = () => {
        // Check if all required fields are filled individually and provide error messages for each missing field
        if (!formData.academic_year) {
            return handleValidationError('academic_year', 'Please select the academic year.');
        }
        if (!formData.exam_type) {
            return handleValidationError('exam_type', 'Please enter the exam type.');
        }
        if (!formData.score) {
            return handleValidationError('score', 'Please enter the score.');
        }
        if (!formData.city) {
            return handleValidationError('city', 'Please enter the city.');
        }
        if (!formData.state) {
            return handleValidationError('state', 'Please enter the state.');
        }
        if (!formData.country) {
            return handleValidationError('country', 'Please enter the country.');
        }
        if (!formData.university_name) {
            return handleValidationError('university_name', 'Please enter the university name.');
        }
        if (!formData.course) {
            return handleValidationError('course', 'Please enter the course.');
        }
        if (!formData.guide) {
            return handleValidationError('guide', 'Please enter the project guide.');
        }
        if (!formData.desc || formData.desc.length > 400) {
            return handleValidationError('desc', 'Please enter the description in 400 character.');
        }
        if (!id && !formData.admission_letter) {
            return handleValidationError('admission_letter', 'Please upload the admission letter.');
        }

        // Check if the file size is less than 512 KB
        const fileSizeLimit = 512 * 1024;
        if (!id && formData.admission_letter.size > fileSizeLimit) {
            return toast.error('Admission letter file size should be less than 512 KB.');
        }

        // Proceed with form submission if all checks pass
        const loading = toast.loading('Adding your details...');

        const data = new FormData();
        data.append('student_academic_year', formData.academic_year);
        data.append('student_exam_type', formData.exam_type);
        data.append('student_score', formData.score);
        data.append('university_city', formData.city);
        data.append('university_state', formData.state);
        data.append('university_country', formData.country);
        data.append('university_name', formData.university_name);
        data.append('student_course', formData.course);
        data.append('student_project_guide', formData.guide);
        data.append('description', formData.desc);
        if (formData.admission_letter) {
            data.append('student_admission_letter', formData.admission_letter);
        }
        if (id) {
            data.append('id', id);
        }

        const token = getToken();

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/update/higher-studies` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/higher-studies`,
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
                role == 'admin' ? navigate(-1) : navigate('/dmce/higher-studies');
            })
            .catch((error) => {
                console.error(error);
                toast.dismiss(loading);
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                } else {
                    toast.error(getFirstErrorMessage(error.response.data));
                }
            });
    };




    const handleValidationError = (fieldId, errorMessage) => {
        const academicYearInput = parentDivRef.current.querySelector(`#${fieldId}`);
        if (academicYearInput) {
            academicYearInput.style.border = '3px solid red';

            // Scroll to the input field
            academicYearInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Reset border after 3 seconds
            setTimeout(() => {
                academicYearInput.style.border = '1px solid black';
            }, 3000);
        }

        toast.error(errorMessage);
    };


    const getDataById = (id) => {
        setloader(true)
        try {
            const token = getToken()

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/fetch/${role == 'admin' ? 'higher-study' : 'higher-studies'}/${id}`,
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
                        desc: response.data.description,

                    })
                })
                .catch((error) => {
                    setloader(false)
                    if (error.response && error.response.status === 401) {
                        localStorage.clear();
                        return navigate('/login');
                    }

                    console.log(error);
                });



        } catch (error) {
            console.log(error);

        }
    }

    const year = getYearOptions()

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {
                loader || roleLoading ? <Loaders /> : <AnimationWrapper>
                    <div className='w-full max-md:mt-8  max-md:mb-8'>
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "Higher Study Detail"}</h1>
                    </div>
                    <div ref={parentDivRef} className='w-full grid md:grid-cols-2 grid-cols-1'>
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
                                        {year.length > 0 && year.map((year) => (
                                            <MenuItem key={year.key} value={year.value}>
                                                {year.value}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Box>

                            <label className='label' htmlFor="exam_type">Exam Type <p className='example'>e.g:- GRE, VITEEE, NDA</p></label>
                            <input value={formData.exam_type} type="text" id='exam_type' name='exam_type' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="score">Score <p className='example'>e.g:- 60/100</p></label>
                            <input value={formData.score} type="text" id='score' name='score' className='input' onChange={handleChange} />

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
                            <label className='label' htmlFor="desc">Description</label>
                            <textarea type="text" id='desc' value={formData.desc} name='desc' className='input' onChange={handleChange} />
                            <p className='text-right text-sm font-bold '><span className='text-green-600'>{formData.desc.length}</span>/400</p>


                            <label className='label' htmlFor="admission_letter">Admission Letter <p className='example'>Max PDF Size 512KB</p></label>
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
                    </div></AnimationWrapper>
            }
        </section>
    );
};

export default AddHigherStudies;
