

import React, { useEffect, useState, useRef } from 'react'
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
import { domains, getYearOptions } from '../helper/helper';
import { getRole } from '../helper/getRole';

const AddInternship = () => {
    const navigate = useNavigate()
    const [loader, setloader] = useState(false)
    const parentDivRef = useRef(null);

    const [emptyFields, setEmptyFields] = useState([]);

    const dmceuser = localStorage.getItem("dmceuser");
    
    
    const { id } = useParams()
    
    const [role, setRole] = useState('')
    const [roleLoading, setRoleLoading] = useState(true);  // New state for role loading

    useEffect(()=>{
        const roleInsession = getRole();
        setRole(roleInsession)
        setRoleLoading(false)
    },[])
    useEffect(() => {
     
        if (id && role) {
            getDataById(id)
        }

    }, [id , role])

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
        companyName: '',
        desc: ''
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

    // const years = [];
    // for (let year = 2021; year <= 2030; year++) {
    //     const academicYear = `${year}-${year + 1}`;
    //     years.push(
    //         <MenuItem key={academicYear} value={academicYear}>
    //             {academicYear}
    //         </MenuItem>
    //     );
    // }

    const handleSubmit = () => {
        if (!data.academicYear) {
            return handleValidationError('academicYear', "Please enter the academic year.");
        }
        if (!data.year) {
            return handleValidationError('year', "Please enter the student year.");
        }
        if (!data.duration) {
            return handleValidationError('duration', "Please enter the duration.");
        }
        if (!data.startDate) {
            return handleValidationError('startDate', "Please enter the start date.");
        }
        if (!data.endDate) {
            return handleValidationError('endDate', "Please enter the end date.");
        }
        if (!data.desc || data.desc.length > 400) {
            return handleValidationError('desc', "Please enter the description of 400 characters.");
        }
        if (!data.companyName) {
            return handleValidationError('companyName', "Please enter the company name.");
        }
        if (!data.domain) {
            return handleValidationError('domain', "Please enter the domain.");
        }

        if (!id && !data.completionLetter) {
            return handleValidationError('completionLetter', "Please upload the completion letter.");
        }
        if (!id && !data.certificate) {
            return handleValidationError('certificate', "Please upload the certificate.");
        }
        if (!id && !data.offerLetter) {
            return handleValidationError('offerLetter', "Please upload the offer letter.");
        }
        if (!id && !data.permissionLetter) {
            return handleValidationError('permissionLetter', "Please upload the permission letter.");
        }

        // Check file sizes
        const fileSizeLimit = 512 * 1024;
        if (!id && data.completionLetter.size > fileSizeLimit) {
            return toast.error("Completion letter size should be less than 512 KB.");
        }
        if (!id && data.certificate.size > fileSizeLimit) {
            return toast.error("Certificate size should be less than 512 KB.");
        }
        if (!id && data.offerLetter.size > fileSizeLimit) {
            return toast.error("Offer letter size should be less than 512 KB.");
        }
        if (!id && data.permissionLetter.size > fileSizeLimit) {
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
        form.append('description', data.desc);
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

        // Log the FormData contents
        for (let [key, value] of form.entries()) {
            console.log(`${key}: ${value}`);
        }

        const token = getToken();
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/update/internship` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/internship`,
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
                role == 'admin' ? navigate(-1) : navigate('/dmce/internship')
                toast.success(response.data.message);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/login');
                }
                console.log(error);
                toast.dismiss(loading);
                return toast.error(getFirstErrorMessage(error.response.data));
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
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/fetch/internship/${id}`,
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
                        companyName: response.data.company_name,
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
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "Internship Detail"}</h1>
                    </div>
                    <div ref={parentDivRef} className='w-full grid md:grid-cols-2 grid-cols-1'>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="academicYear">Select Academic Year</label>
                            <Box sx={{ minWidth: 120 }} >
                                <FormControl className='form-control' required style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="academic-year-label">Academic Year</InputLabel>
                                    <Select
                                        labelId="academic-year-label"
                                        id="academicYear"
                                        name="academicYear"
                                        value={data.academicYear}
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
                            <label className='label' htmlFor="desc">Description </label>
                            <textarea type="text" id='desc' value={data.desc} name="desc" className='input' onChange={handleChange} />
                            <p className='text-right text-sm font-bold '><span className='text-green-600'>{data.desc.length}</span>/400</p>

                        </div>
                        <div className='w-full md:p-8 md:mt-4 '>
                            <label className='label' htmlFor="companyName">Company Name</label>
                            <input type="text" value={data.companyName} id='companyName' name="companyName" className='input' onChange={handleChange} />
                            <label className='label' htmlFor="domain">Domain</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="domain-label">Domain</InputLabel>
                                    <Select
                                        labelId="domain-label"
                                        id="domain"
                                        name="domain"
                                        value={data.domain}
                                        onChange={handleChange}
                                    >
                                        {domains.map((domain) => (
                                            <MenuItem key={domain.value} value={domain.value}>
                                                {domain.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

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

                            <label className='label' htmlFor="certificate">Certificate <p className='example'>Max PDF Size 512KB - If available</p></label>
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

                            <label className='label' htmlFor="offerLetter">Offer Letter <p className='example'>Max PDF Size 512KB - If available</p></label>
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

                            <label className='label' htmlFor="permissionLetter">Permission Letter <p className='example'>Max PDF Size 512KB - If available</p></label>
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
                </AnimationWrapper>
            }

        </section>
    )
}

export default AddInternship