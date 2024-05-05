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

const AddExtraCurr = () => {
    const [loader, setloader] = useState(false)
    const { id } = useParams()
    useEffect(() => {
        if (id) {
            getDataById(id)
        }

    }, [])

    const [data, setData] = useState({
        student_year: '',
        college_name: '',
        academic_year: '',
        domain: '',
        level: '',
        location: '',
        date: '',
        certificate: null,
        prize: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: files[0]
        }));
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
    const navigate = useNavigate()
    const handleSubmit = () => {
        // Check if all required fields are filled individually and provide error messages for each missing field
        if (!id && !data.academic_year) {
            toast.error('Please enter the academic year.');
            return;
        }
        if (!id && !data.student_year) {
            toast.error('Please select the student year.');
            return;
        }
        if (!id && !data.college_name) {
            toast.error('Please enter the college name.');
            return;
        }
        if (!id && !data.domain) {
            toast.error('Please enter the domain.');
            return;
        }
        if (!id && !data.level) {
            toast.error('Please select the level.');
            return;
        }
        if (!id && !data.location) {
            toast.error('Please enter the location.');
            return;
        }
        if (!id && !data.date) {
            toast.error('Please select the date.');
            return;
        }
        if (!id && !data.certificate) {
            toast.error('Please upload the certificate.');
            return;
        }
        if (!id && !data.prize) {
            toast.error('Please select the prize.');
            return;
        }

        // Check if the file size is less than 512 KB
        if (!id && data.certificate.size > 512 * 1024) {
            toast.error('Certificate file size should be less than 512 KB.');
            return;
        }

        // Proceed with form submission if all checks pass
        const loading = toast.loading("Wait. Adding your activity");

        let formdata = new FormData();
        formdata.append('academic_year', data.academic_year);
        formdata.append('student_year', data.student_year);
        formdata.append('college_name', data.college_name);
        formdata.append('ecc_domain', data.domain);
        formdata.append('ecc_level', data.level);
        formdata.append('ecc_location', data.location);
        formdata.append('ecc_date', data.date);
        formdata.append('prize', data.prize);
        if (data.certificate) {

            formdata.append('ecc_certificate_path', data.certificate);
        }

        if (id) {
            formdata.append('id', id);
        }


        const token = getToken();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/student/update/extra-curricular-activities` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/extra-curricular-activities`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...data.getHeaders
            },
            data: formdata
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                toast.dismiss(loading);
                toast.success(response.data.message);
                return navigate('/dmce/extra-curriculum')
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/dmce/login');
                }
                toast.dismiss(loading);
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
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/extra-curricular-activities/${id}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...data.getHeaders
                },

            };

            axios.request(config)
                .then((response) => {
                    setloader(false)
                    setData({
                        academic_year: response.data.academic_year,
                        student_year: response.data.student_year,
                        college_name: response.data.college_name,
                        domain: response.data.ecc_domain,
                        level: response.data.ecc_level,
                        location: response.data.ecc_location,
                        date: response.data.ecc_date,
                        prize: response.data.prize
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
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "Activity Detail"}</h1>
                    </div>
                    <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="academic_year">Academic Year</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl
                                    style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="academic-year-label">Academic Year</InputLabel>
                                    <Select
                                        labelId="academic-year-label"
                                        id="academic_year"
                                        name="academic_year"
                                        value={data.academic_year}
                                        onChange={handleChange}
                                    >
                                        {years}
                                    </Select>
                                </FormControl>
                            </Box>
                            <label className='label' htmlFor="studentYear">Student Year</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="student-year-label">Student Year</InputLabel>
                                    <Select
                                        labelId="student-year-label"
                                        id="studentYear"
                                        name="student_year"
                                        value={data.student_year}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'FE'}>First Year</MenuItem>
                                        <MenuItem value={'SE'}>Second Year</MenuItem>
                                        <MenuItem value={'TE'}>Third Year</MenuItem>
                                        <MenuItem value={'BE'}>Fourth Year</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>


                            <label className='label' htmlFor="college_name">College Name</label>
                            <input value={data.college_name} type="text" id='college_name' name="college_name" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="domain">Domain <p className='example'>e.g:- web-development , app-developement</p></label>
                            <input value={data.domain} type="text" id='domain' name="domain" className='input' onChange={handleChange} />


                        </div>
                        <div className='w-full md:p-8 md:p-2 md:mt-4 '>
                            <label className='label' htmlFor="level">Select Level</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl
                                    style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="level-label">Level</InputLabel>
                                    <Select
                                        labelId="level-label"
                                        id="level"
                                        name="level"
                                        value={data.level}
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
                            <label className='label' htmlFor="location">Location <p className='example'>e.g:- Airoli, Thane</p></label>
                            <input value={data.location} type="text" id='location' name="location" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="date">Date</label>
                            <input value={data.date} type="date" id='date' name="date" className='input' onChange={handleChange} />


                            <label className='label' htmlFor="prize">Prize</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="prize-label">Prize</InputLabel>
                                    <Select
                                        labelId="prize-label"
                                        id="prize"
                                        name="prize"
                                        value={data.prize}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="first">First</MenuItem>
                                        <MenuItem value="second">Second</MenuItem>
                                        <MenuItem value="third">Third</MenuItem>
                                        <MenuItem value="fourth">Fourth</MenuItem>
                                        <MenuItem value="participated">Participated</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <label className='label' htmlFor="certificate">Certificate <p className='example'>Max PDF Size 512KB</p></label>
                            <div className="bg-gray-100 mb-[12px] ">
                                <label htmlFor="certificate" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Certificate
                                </label>
                                <input id="certificate" name="certificate" type="file" className="hidden" onChange={handleFileChange} />
                                {data.certificate && (
                                    <p className="mt-2 text-gray-700">Selected file: {data.certificate.name}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center mt-4 '>
                        <button className='btn' onClick={handleSubmit}>Submit</button>
                    </div>
                </>
            }
        </section>
    );
};

export default AddExtraCurr;
