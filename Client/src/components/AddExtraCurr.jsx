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

const AddExtraCurr = () => {
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
        console.log("the role is " , role);
        if (id && role) {
            getDataById(id)
        }

    }, [id, role])

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
        desc:''
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

    const parentDivRef = useRef(null);

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
        if ( !data.academic_year) {
            handleValidationError('academic_year', 'Please enter the academic year.');
            return;
        }
        if ( !data.student_year) {
            handleValidationError('studentYear', 'Please select the student year.');
            return;
        }
        if ( !data.college_name) {
            handleValidationError('college_name', 'Please enter the college name.');
            return;
        }
        if ( !data.domain) {
            handleValidationError('domain', 'Please enter the domain.');
            return;
        }
        if ( !data.desc || data.desc.length > 400) {
            handleValidationError('desc', 'Please enter the description in 400 character.');
            return;
        }
        if ( !data.level) {
            handleValidationError('level', 'Please select the level.');
            return;
        }
        if ( !data.location) {
            handleValidationError('location', 'Please enter the location.');
            return;
        }
        if ( !data.date) {
            handleValidationError('date', 'Please select the date.');
            return;
        }
        if ( !data.prize) {
            handleValidationError('prize', 'Please select the prize.');
            return;
        }
        if (!id && !data.certificate) {
            handleValidationError('certificate', 'Please upload the certificate.');
            return;
        }


        // Check if the file size is less than 512 KB
        const fileSizeLimit = 512 * 1024;
        if (!id && data.certificate.size > fileSizeLimit) {
            return toast.error('Certificate file size should be less than 512 KB.');
        }

        // Proceed with form submission if all checks pass
        const loading = toast.loading('Wait. Adding your activity');

        let formData = new FormData();
        formData.append('academic_year', data.academic_year);
        formData.append('student_year', data.student_year);
        formData.append('college_name', data.college_name);
        formData.append('ecc_domain', data.domain);
        formData.append('ecc_level', data.level);
        formData.append('ecc_location', data.location);
        formData.append('ecc_date', data.date);
        formData.append('prize', data.prize);
        formData.append('description', data.desc);
        if (data.certificate) {
            formData.append('ecc_certificate_path', data.certificate);
        }
        if (id) {
            formData.append('id', id);
        }

        const token = getToken();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: id ? `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/update/extra-curricular-activities` : `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/extra-curricular-activities`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...data.getHeaders
            },
            data: formData
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                toast.dismiss(loading);
                toast.success(response.data.message);
                role == 'admin' ? navigate(-1) : navigate('/dmce/extra-curriculum');
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/login');
                }
                toast.dismiss(loading);
                toast.error(getFirstErrorMessage(error.response.data));
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
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/${role == 'admin' ? 'admin' : 'student'}/fetch/${ role =='admin' ? 'ecc' : 'extra-curricular-activities'}/${id}`,
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
                        prize: response.data.prize,
                        desc: response.data.description
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
                        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "Activity Detail"}</h1>
                    </div>
                    <div ref={parentDivRef} className='w-full grid md:grid-cols-2 grid-cols-1'>
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
                                        {year.length > 0 && year.map((year) => (
                                            <MenuItem key={year.key} value={year.value}>
                                                {year.value}
                                            </MenuItem>
                                        ))}
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

                            <label className='label' htmlFor="domain">Title <p className='example'>Achievement in CSI/NSS</p></label>
                            <input value={data.domain} type="text" id='domain' name="domain" className='input' onChange={handleChange} />

                            <label className='label' htmlFor="desc">Description </label>
                            <textarea type="text" id='desc' value={data.desc} name="desc" className='input' onChange={handleChange} />
                            <p className='text-right text-sm font-bold '><span className='text-green-600'>{data.desc.length}</span>/400</p>



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
                </AnimationWrapper>
            }
        </section>
    );
};

export default AddExtraCurr;
