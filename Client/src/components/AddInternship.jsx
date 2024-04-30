

import React, { useState } from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInternship = () => {
    const navigate = useNavigate()

    const [data, setData] = useState({
        academicYear: '',
        duration: '',
        domain: '',
        startDate: '',
        endDate: '',
        completionLetter: null,
        certificate: null,
        offerLetter: null,
        permissionLetter: null,
        year: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
        console.log(data);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setData({ ...data, [name]: files[0] });
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

    const handleSubmit = () => {
        // Check each individual field for whether it's filled or not
        if (!data.academicYear) {
            return toast.error("Please enter the academic year.");
        }
        if (!data.duration) {
            return toast.error("Please enter the duration.");
        }
        if (!data.domain) {
            return toast.error("Please enter the domain.");
        }
        if (!data.startDate) {
            return toast.error("Please enter the start date.");
        }
        if (!data.endDate) {
            return toast.error("Please enter the end date.");
        }
        if (!data.completionLetter) {
            return toast.error("Please upload the completion letter.");
        }
        if (!data.certificate) {
            return toast.error("Please upload the certificate.");
        }
        if (!data.offerLetter) {
            return toast.error("Please upload the offer letter.");
        }
        if (!data.permissionLetter) {
            return toast.error("Please upload the permission letter.");
        }
        if (!data.year) {
            return toast.error("Please enter the student year.");
        }

        // Check file size for completionLetter
        if (data.completionLetter.size > 512 * 1024) {
            return toast.error("Completion letter size should be less than 512 KB.");
        }
        // Check file size for certificate
        if (data.certificate.size > 512 * 1024) {
            return toast.error("Certificate size should be less than 512 KB.");
        }
        // Check file size for offerLetter
        if (data.offerLetter.size > 512 * 1024) {
            return toast.error("Offer letter size should be less than 512 KB.");
        }
        // Check file size for permissionLetter
        if (data.permissionLetter.size > 512 * 1024) {
            return toast.error("Permission letter size should be less than 512 KB.");
        }

        const loading = toast.loading('Wait. Internship details are being added.');

        let form = new FormData();
        form.append('academic_year', data.academicYear);
        form.append('duration', data.duration);
        form.append('domain', data.domain);
        form.append('start_date', data.startDate);
        form.append('end_date', data.endDate);
        form.append('completion_letter_path', data.completionLetter);
        form.append('certificate_path', data.certificate);
        form.append('offer_letter_path', data.offerLetter);
        form.append('permission_letter_path', data.permissionLetter);
        form.append('student_year', data.year);

        const token = getToken();
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/internship`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...data.getHeaders
            },
            data: form
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                toast.dismiss(loading);
                navigate('/dmce/internship');
                toast.success(response.data.message);
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


    return (
        <section className='w-full min-h-screen p-4 md:p-8'>


            <div className='w-full max-md:mt-8  max-md:mb-8'>
                <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Fill Internship Detail</h1>
            </div>
            <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                <div className='w-full md:p-8 md:mt-4 '>
                    <label className='label' htmlFor="academicYear">Select Academic Year</label>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl style={{ marginBottom: "12px" }} fullWidth>
                            <InputLabel
                                id="academic-year-label">Academic Year</InputLabel>
                            <Select
                                labelId="academic-year-label"
                                id="academicYear"
                                name="academicYear"
                                value={data.academicYear}
                                onChange={handleChange}
                            >
                                {years}
                            </Select>
                        </FormControl>
                    </Box>

                    <label className='label' htmlFor="year">Select Year</label>
                    <Box sx={{ minWidth: 120, }}>
                        <FormControl
                            style={{ marginBottom: "12px" }} fullWidth>
                            <InputLabel
                                id="year-label">Year</InputLabel>
                            <Select
                                labelId="year-label"
                                id="year"
                                name="year"
                                value={data.year}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>First Year</MenuItem>
                                <MenuItem value={2}>Second Year</MenuItem>
                                <MenuItem value={3}>Third Year</MenuItem>
                                <MenuItem value={4}>Fourth Year</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <label className='label' htmlFor="duration">Duration (in months)</label>
                    <input type="Number" id='duration' name="duration" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="startDate">Start Date</label>
                    <input type="Date" id='startDate' name="startDate" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="endDate">End Date</label>
                    <input type="Date" id='endDate' name="endDate" className='input' onChange={handleChange} />

                </div>
                <div className='w-full md:p-8 md:mt-4 '>
                    <label className='label' htmlFor="domain">Domain</label>
                    <input type="text" id='domain' name="domain" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="completionLetter">Completion Letter</label>
                    <div className="bg-gray-100 mb-[12px] ">
                        <label htmlFor="completionLetter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Completion Letter/ Certificate
                        </label>
                        <input id="completionLetter" name="completionLetter" type="file" className="hidden" onChange={handleFileChange} />
                        {data.completionLetter && (
                            <p className="mt-2 text-gray-700">Selected file: {data.completionLetter.name}</p>
                        )}
                    </div>

                    <label className='label' htmlFor="certificate">Certificate</label>
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

                    <label className='label' htmlFor="offerLetter">Offer Letter</label>
                    <div className="bg-gray-100 mb-[12px] ">
                        <label htmlFor="offerLetter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Offer Letter
                        </label>
                        <input id="offerLetter" name="offerLetter" type="file" className="hidden" onChange={handleFileChange} />
                        {data.offerLetter && (
                            <p className="mt-2 text-gray-700">Selected file: {data.offerLetter.name}</p>
                        )}
                    </div>

                    <label className='label' htmlFor="permissionLetter">Permission Letter</label>
                    <div className="bg-gray-100 mb-[12px] ">
                        <label htmlFor="permissionLetter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Permission Letter
                        </label>
                        <input id="permissionLetter" name="permissionLetter" type="file" className="hidden" onChange={handleFileChange} />
                        {data.permissionLetter && (
                            <p className="mt-2 text-gray-700">Selected file: {data.permissionLetter.name}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className='flex justify-center mt-4'>
                <button className='btn' onClick={handleSubmit}>Submit</button>
            </div>
        </section>
    )
}

export default AddInternship