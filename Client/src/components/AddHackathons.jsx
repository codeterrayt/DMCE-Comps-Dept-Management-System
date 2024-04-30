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

const AddHackathons = () => {
    const [loader, setloader] = useState(false)

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        academic_year: '',
        from_date: '',
        to_date: '',
        year: '',
        title: '',
        level: '',
        location: '',
        college_name: '',
        prize: '',
        position: '',
        certificate: null,
    });

    const { id } = useParams()
    useEffect(() => {
        if (id) {
            getDataById(id)
        }

    }, [])

    // Handle input changes and update formData state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle file input changes and update formData state
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0]
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        // Check if all required fields are filled individually and provide error messages for each missing field
        if (!id && !formData.academic_year) {
            toast.error('Please select the academic year.');
            return;
        }
        if (!id && !formData.from_date) {
            toast.error('Please select the starting date.');
            return;
        }
        if (!id && !formData.to_date) {
            toast.error('Please select the ending date.');
            return;
        }
        if (!id && !formData.year) {
            toast.error('Please select the student year.');
            return;
        }
        if (!id && !formData.title) {
            toast.error('Please enter the hackathon title.');
            return;
        }
        if (!id && !formData.level) {
            toast.error('Please select the hackathon level.');
            return;
        }
        if (!id && !formData.location) {
            toast.error('Please enter the hackathon location.');
            return;
        }
        if (!id && !formData.college_name) {
            toast.error('Please enter the college name.');
            return;
        }
        if (!id && !formData.prize) {
            toast.error('Please enter the hackathon prize.');
            return;
        }
        if (!id && !formData.position) {
            toast.error('Please enter the hackathon position.');
            return;
        }
        if (!id && !formData.certificate) {
            toast.error('Please upload the hackathon certificate.');
            return;
        }

        // Check if the file size is less than 512 KB
        if (!id && formData.certificate.size > 512 * 1024) {
            toast.error('Certificate file size should be less than 512 KB.');
            return;
        }

        const loading = toast.loading('Wait.. adding hackathon detail.');

        const data = new FormData();
        data.append('academic_year', formData.academic_year);
        data.append('hackathon_from_date', formData.from_date);
        data.append('hackathon_to_date', formData.to_date);
        data.append('student_year', formData.year);
        data.append('hackathon_title', formData.title);
        data.append('hackathon_level', formData.level);
        data.append('hackathon_location', formData.location);
        data.append('hackathon_college_name', formData.college_name);
        data.append('hackathon_prize', formData.prize);
        data.append('hackathon_position', formData.position);
        if (formData.certificate) {

            data.append('hackathon_certificate_path', formData.certificate);
        }
        if (id) {
            data.append('id', id);
        }




        const token = getToken();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/student/update/hackathon` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/hackathon`,
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
                return navigate('/dmce/hackathon')
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/dmce/login');
                }
                console.log(error);
                toast.dismiss(loading);
                return toast.error(error.response.data.message);
            });
    };


    const years = [];
    for (let year = 2021; year <= 2030; year++) {
        const academicYear = `${year}-${year + 1}`;
        years.push(
            <MenuItem key={academicYear} value={academicYear}>
                {academicYear}
            </MenuItem>
        );
    }

    const getDataById = (id) => {
        setloader(true)
        try {
            const token = getToken()

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/hackathon/${id}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

            };

            axios.request(config)
                .then((response) => {
                    setloader(false)
                    setFormData({
                        academic_year: response.data.academic_year,
                        from_date: response.data.hackathon_from_date,
                        to_date: response.data.hackathon_to_date,
                        year: response.data.student_year,
                        title: response.data.hackathon_title,
                        level: response.data.hackathon_level,
                        location: response.data.hackathon_location,
                        college_name: response.data.hackathon_college_name,
                        prize: response.data.hackathon_prize,
                        position: response.data.hackathon_position,
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
                loader ? <Loaders />
                    :
                    <>
                        <div className='w-full max-md:mt-8  max-md:mb-8'>
                            <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "hackathon Detail"}</h1>
                        </div>
                        <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                            <div className='w-full md:p-8 md:mt-4 '>
                                <label className='label' htmlFor="title">Hackathon Title</label>
                                <input value={formData.title} type="text" id='title' name='title' className='input' onChange={handleChange} />

                                <label className='label' htmlFor="location">Location <p className='example'>e.g:- Airoli, Thane</p></label>
                                <input value={formData.location} type="text" id='location' name="location" className='input' onChange={handleChange} />

                                <label className='label' htmlFor="level">Select Level</label>
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl
                                        style={{ marginBottom: "12px" }} fullWidth>
                                        <InputLabel id="level-label">Level</InputLabel>
                                        <Select
                                            labelId="level-label"
                                            id="level"
                                            name="level"
                                            value={formData.level || ''}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="college-level">College Level</MenuItem>
                                            <MenuItem value="inter-college-level">Inter College Level Year</MenuItem>
                                            <MenuItem value="district-level">District Level</MenuItem>
                                            <MenuItem value="state-level">State Level</MenuItem>
                                            <MenuItem value="national-level">National Level</MenuItem>
                                            <MenuItem value="inter-national-level">Inter National Level</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <label className='label' htmlFor="prize">Prize <p className='example'>In Rupees</p></label>
                                <input value={formData.prize} type="number" id='prize' name="prize" className='input' onChange={handleChange} />

                                <label className='label' htmlFor="college_name">Enter College Name</label>
                                <input value={formData.college_name} type="text" id='college_name' name='college_name' className='input' onChange={handleChange} />


                            </div>
                            <div className='w-full md:p-8 md:p-2 md:mt-4 '>
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

                                <label className='label' htmlFor="from_date">Start Date</label>
                                <input value={formData.from_date} type="date" id='from_date' name="from_date" className='input' onChange={handleChange} />

                                <label className='label' htmlFor="to_date">End Date</label>
                                <input value={formData.to_date} type="date" id='to_date' name="to_date" className='input' onChange={handleChange} />

                                <label className='label' htmlFor="position">Position</label>
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl
                                        style={{ marginBottom: "12px" }} fullWidth>
                                        <InputLabel id="position-label">Position</InputLabel>
                                        <Select
                                            labelId="position-label"
                                            id="position"
                                            name="position"
                                            value={formData.position || ''}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="first">First</MenuItem>
                                            <MenuItem value="second">Second</MenuItem>
                                            <MenuItem value="third">Third</MenuItem>
                                            <MenuItem value="fourth">Fourth</MenuItem>
                                            <MenuItem value="fifth">Fifth</MenuItem>
                                            <MenuItem value="top 10">Top 10</MenuItem>
                                            <MenuItem value="top 25">Top 25</MenuItem>
                                            <MenuItem value="top 50">Top 50</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <label className='label' htmlFor="year">Select Year</label>
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl
                                        style={{ marginBottom: "12px" }} fullWidth>
                                        <InputLabel id="year-label">Year</InputLabel>
                                        <Select
                                            labelId="year-label"
                                            id="year"
                                            name="year"
                                            value={formData.year || ''}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={1}>First Year</MenuItem>
                                            <MenuItem value={2}>Second Year</MenuItem>
                                            <MenuItem value={3}>Third Year</MenuItem>
                                            <MenuItem value={4}>Fourth Year</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <label className='label' htmlFor="certificate">Achievements Certificate <p className='example'>prefer in pdf form, size should be less that 512kb</p></label>
                                <div className="bg-gray-100 mb-[12px] ">
                                    <label htmlFor="certificate" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Completion Letter/ Certificate 
                                    </label>
                                    <input id="certificate" name="certificate" type="file" className="hidden" onChange={handleFileChange} />
                                    {formData.certificate && (
                                        <p className="mt-2 text-gray-700">Selected file: {formData.certificate.name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center mt-4 '>
                            <button className='btn' onClick={handleSubmit}>Submit</button>
                        </div></>
            }
        </section>
    );
};

export default AddHackathons;
