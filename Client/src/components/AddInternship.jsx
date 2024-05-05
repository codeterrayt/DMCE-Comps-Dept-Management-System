

import React, { useEffect, useState } from 'react'
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

const AddInternship = () => {
    const navigate = useNavigate()
    const [loader, setloader] = useState(false)



    const { id } = useParams()
    useEffect(() => {
        if (id) {
            getDataById(id)
        }

    }, [])

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
        companyName: ''
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
        if (!id && !data.academicYear) {
            return toast.error("Please enter the academic year.");
        }
        if (!id && !data.duration) {
            return toast.error("Please enter the duration.");
        }
        if (!id && !data.domain) {
            return toast.error("Please enter the domain.");
        }
        if (!id && !data.startDate) {
            return toast.error("Please enter the start date.");
        }
        if (!id && !data.endDate) {
            return toast.error("Please enter the end date.");
        }
        if (!id && !data.completionLetter) {
            return toast.error("Please upload the completion letter.");
        }
        if (!id && !data.certificate) {
            return toast.error("Please upload the certificate.");
        }
        if (!id && !data.offerLetter) {
            return toast.error("Please upload the offer letter.");
        }
        if (!id && !data.permissionLetter) {
            return toast.error("Please upload the permission letter.");
        }
        if (!id && !data.year) {
            return toast.error("Please enter the student year.");
        }
        if (!id && !data.companyName) {
            return toast.error("Please enter the company name.");
        }

        // Check file size for completionLetter
        if (!id && data.completionLetter.size > 512 * 1024) {
            return toast.error("Completion letter size should be less than 512 KB.");
        }
        // Check file size for certificate
        if (!id && data.certificate.size > 512 * 1024) {
            return toast.error("Certificate size should be less than 512 KB.");
        }
        // Check file size for offerLetter
        if (!id && data.offerLetter.size > 512 * 1024) {
            return toast.error("Offer letter size should be less than 512 KB.");
        }
        // Check file size for permissionLetter
        if (!id && data.permissionLetter.size > 512 * 1024) {
            return toast.error("Permission letter size should be less than 512 KB.");
        }

    
        const loading = toast.loading('Wait. Internship details are being processed.');



        let form = new FormData();
        form.append('academic_year', data.academicYear);
        form.append('duration', data.duration);
        form.append('domain', data.domain);
        form.append('start_date', data.startDate);
        form.append('end_date', data.endDate);
        form.append('student_year', data.year);
        form.append('company_name', data.companyName);
        if (data.completionLetter) {
            form.append('completion_letter_path', data.completionLetter);
        }
        if (data.certificate) {
            form.append('certificate_path', data.certificate);
        }
        if (data.offerLetter) {
            form.append('offer_letter_path', data.offerLetter);
        }
        if (data.permissionLetter) {
            form.append('permission_letter_path', data.permissionLetter);
        }
        if (id) {
            form.append('id', id);
        }

        const token = getToken();
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/student/update/internship` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/internship`,
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

    const getDataById = (id) => {
        setloader(true)
        try {
            const token = getToken()

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/internship/${id}`,
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
                        academicYear: response.data.academic_year,
                        duration: response.data.duration,
                        domain: response.data.domain,
                        startDate: response.data.start_date,
                        endDate: response.data.end_date,
                        year: response.data.student_year,
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
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "Internship Detail"}</h1>
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
                                        <MenuItem value={'FE'}>First Year</MenuItem>
                                        <MenuItem value={'SE'}>Second Year</MenuItem>
                                        <MenuItem value={'TE'}>Third Year</MenuItem>
                                        <MenuItem value={'BE'}>Fourth Year</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <label className='label' htmlFor="duration">Duration (in months)</label>
                            <input type="Number" value={data.duration} id='duration' name="duration" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="startDate">Start Date</label>
                            <input type="Date" value={data.startDate} id='startDate' name="startDate" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="endDate">End Date</label>
                            <input type="Date" value={data.endDate} id='endDate' name="endDate" className='input' onChange={handleChange} />

                        </div>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="companyName">Company Name</label>
                            <input type="text" value={data.companyName} id='companyName' name="companyName" className='input' onChange={handleChange} />
                            <label className='label' htmlFor="domain">Domain <p className='example'>e.g:- web-development , app-developement</p></label>
                            <input value={data.domain} type="text" id='domain' name="domain" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="completionLetter">Completion Letter <p className='example'>Max PDF Size 512KB</p></label>
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

                            <label className='label' htmlFor="offerLetter">Offer Letter <p className='example'>Max PDF Size 512KB</p></label>
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

                            <label className='label' htmlFor="permissionLetter">Permission Letter <p className='example'>Max PDF Size 512KB</p></label>
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
                </>
            }

        </section>
    )
}

export default AddInternship