import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddHigherStudies = () => {
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
        if (!formData.academic_year) {
            toast.error('Please select the academic year.');
            return;
        }
        if (!formData.exam_type) {
            toast.error('Please enter the exam type.');
            return;
        }
        if (!formData.score) {
            toast.error('Please enter the score.');
            return;
        }
        if (!formData.city) {
            toast.error('Please enter the city.');
            return;
        }
        if (!formData.state) {
            toast.error('Please enter the state.');
            return;
        }
        if (!formData.country) {
            toast.error('Please enter the country.');
            return;
        }
        if (!formData.university_name) {
            toast.error('Please enter the university name.');
            return;
        }
        if (!formData.course) {
            toast.error('Please enter the course.');
            return;
        }
        if (!formData.guide) {
            toast.error('Please enter the project guide.');
            return;
        }
        if (!formData.admission_letter) {
            toast.error('Please upload the admission letter.');
            return;
        }

        if (formData.admission_letter.size > 512 * 1024) {
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
        data.append('student_admission_letter', formData.admission_letter);

        const token = getToken();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/higher-studies`,
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


    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            <div className='w-full max-md:mt-8  max-md:mb-8'>
                <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Higher Studies Details</h1>
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

                    <label className='label' htmlFor="exam_type">Exam Type <p className='text-sm inline'>e.g:- GRE, VITEEE, NDA</p></label>
                    <input type="text" id='exam_type' name='exam_type' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="score">Score</label>
                    <input type="number" id='score' name='score' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="city">City</label>
                    <input type="text" id='city' name='city' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="state">State</label>
                    <input type="text" id='state' name='state' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="country">Country</label>
                    <input type="text" id='country' name='country' className='input' onChange={handleChange} />
                </div>
                <div className='w-full md:p-8 md:mt-4 '>
                    <label className='label' htmlFor="university_name">University Name</label>
                    <input type="text" id='university_name' name='university_name' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="course">Course</label>
                    <input type="text" id='course' name='course' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="guide">Guide</label>
                    <input type="text" id='guide' name='guide' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="admission_letter">Admission Letter</label>
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
            </div>
        </section>
    );
};

export default AddHigherStudies;
