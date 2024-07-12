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
import { domains } from '../helper/helper';
import { getRole } from '../helper/getRole';

const AddPlacementDetails = () => {
    const [loader, setloader] = useState(false)
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

    const [formData, setFormData] = useState({
        academic_year: '',
        position: '',
        company_name: '',
        company_city: '',
        company_state: '',
        company_country: '',
        company_pincode: '',
        campus_type: '',
        passout_year: '',
        offer_letter: null,
        package_in_lakh: '',
        domain: ''
    });

    // Handle input changes and update formData state
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle file input changes and update formData state
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files[0]
        }));
    };

    const navigate = useNavigate();
    const parentDivRef = useRef(null);



    // Handle form submission
    const handleSubmit = () => {
        console.log(formData.campus_type);
        // Check if all required fields are filled individually and provide error messages for each missing field
        if (!formData.academic_year) {
            return handleValidationError('academic_year', 'Please select the academic year.');

        }
        if (!formData.company_name) {
            return handleValidationError('company_name', 'Please enter the company name.');
        }
        if (!formData.position) {
            return handleValidationError('position', 'Please enter the position.');
        }

        if (!formData.company_city) {
            return handleValidationError('company_city', 'Please enter the company city.');
        }
        if (!formData.company_pincode) {
            return handleValidationError('company_pincode', 'Please enter the company pincode.');
        }
        if (!formData.campus_type) {
            return handleValidationError('campus_type', 'Please select the campus type.');
        }
        if (!formData.company_state) {
            return handleValidationError('company_state', 'Please enter the company state.');
        }
        if (!formData.company_country) {
            return handleValidationError('company_country', 'Please enter the company country.');
        }


        if (!formData.passout_year) {
            return handleValidationError('passout_year', 'Please enter the passout year.');
        }
        if (!formData.package_in_lakh) {
            return handleValidationError('package_in_lakh', 'Please enter the package in lakh.');
        }
        if (!formData.domain) {
            return handleValidationError('domain', 'Please enter the domain.');
        }
        if (!id && !formData.offer_letter) {
            return handleValidationError('offer_letter', 'Please upload the offer letter.');
        }



        // Check if the file size is less than 512 KB
        const fileSizeLimit = 512 * 1024;
        if (!id && formData.offer_letter.size > fileSizeLimit) {
            return toast.error('Offer letter file size should be less than 512 KB.');
        }

        // Proceed with form submission if all checks pass
        const loading = toast.loading('Wait.. adding your details');

        let data = new FormData();
        data.append('academic_year', formData.academic_year);
        data.append('position', formData.position);
        data.append('pincode', formData.company_pincode);
        data.append('city', formData.company_city);
        data.append('state', formData.company_state);
        data.append('country', formData.company_country);
        data.append('company_name', formData.company_name);
        data.append('campus_or_off_campus', formData.campus_type);
        data.append('passout_year', formData.passout_year);
        data.append('package', formData.package_in_lakh);
        data.append('domain', formData.domain);
        if (formData.offer_letter) {
            data.append('offer_letter', formData.offer_letter);
        }
        if (id) {
            data.append('id', id);
        }

        const token = getToken();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/update/placement` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/placement`,
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
              role =='admin' ? navigate(-1):  navigate('/dmce/placement');
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


    const getDataById = (id) => {
        setloader(true)
        try {
            const token = getToken()

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/fetch/placement/${id}`,
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
                        position: response.data.position,
                        company_name: response.data.company_name,
                        company_city: response.data.city,
                        company_state: response.data.state,
                        company_country: response.data.country,
                        company_pincode: response.data.pincode,
                        campus_type: response.data.campus_or_off_campus,
                        passout_year: response.data.passout_year,
                        package_in_lakh: response.data.package,
                        domain: response.data.domain,
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

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {
                loader || roleLoading? <Loaders /> : <AnimationWrapper>
                    <div className='w-full max-md:mt-8  max-md:mb-8'>
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "placement Detail"}</h1>
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
                                        {years}
                                    </Select>
                                </FormControl>
                            </Box>
                            <label className='label' htmlFor="company_name">Company Name <p className='example'>e.g:- Softlink</p></label>
                            <input value={formData.company_name} type="text" id='company_name' name='company_name' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="position">Position  <p className='example'>e.g:- jr Developer, Tester</p></label>
                            <input value={formData.position} type="text" id='position' name='position' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="company_city">Company City  <p className='example'>e.g:- Mumbai</p></label>
                            <input value={formData.company_city} type="text" id='company_city' name='company_city' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="company_pincode">Company Pincode</label>
                            <input value={formData.company_pincode} type="text" id='company_pincode' name='company_pincode' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="campus_type">Campus Type</label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="campus-type-label">Campus Type</InputLabel>
                                    <Select
                                        labelId="campus-type-label"
                                        id="campus_type"
                                        name="campus_type"
                                        value={formData.campus_type}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'0'}>On Campus</MenuItem>
                                        <MenuItem value={'1'}>Off Campus</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>




                            {/* Add other input fields for placement details */}
                        </div>
                        <div className='w-full md:p-8 md:mt-4 '>


                            <label className='label' htmlFor="company_state">Company State  <p className='example'>e.g:- Maharashtra</p></label>
                            <input value={formData.company_state} type="text" id='company_state' name='company_state' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="company_country">Company Country  <p className='example'>e.g:- India</p></label>
                            <input value={formData.company_country} type="text" id='company_country' name='company_country' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="passout_year">Passout Year  <p className='example'>e.g:- 2022</p></label>
                            <input value={formData.passout_year} type="text" id='passout_year' name='passout_year' className='input' onChange={handleChange} />



                            <label className='label' htmlFor="package_in_lakh">Package in Lakh  <p className='example'>e.g:- 10</p></label>
                            <input value={formData.package_in_lakh} type="text" id='package_in_lakh' name='package_in_lakh' className='input' onChange={handleChange} />

                            <label className='label' htmlFor="domain">Domain <p className='example'>e.g:- web-development , app-developement</p></label>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl style={{ marginBottom: "12px" }} fullWidth>
                                    <InputLabel id="domain-label">Domain</InputLabel>
                                    <Select
                                        labelId="domain-label"
                                        id="domain"
                                        name="domain"
                                        value={formData.domain}
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
                            <label className='label' htmlFor="offer_letter">Offer Letter <p className='example'>Max PDF Size 512KB</p></label>
                            <div className="bg-gray-100 mb-[12px] ">
                                <label htmlFor="offer_letter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Offer Letter
                                </label>
                                <input id="offer_letter" name="offer_letter" type="file" className="hidden" onChange={handleFileChange} />
                                {formData.offer_letter && (
                                    <p className="mt-2 text-gray-700">Selected file: {formData.offer_letter.name}</p>
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

export default AddPlacementDetails;
