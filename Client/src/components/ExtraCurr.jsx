import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';

const ExtraCurr = () => {
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

    const handleSubmit = () => {

        const loading = toast.loading("wait. adding your activity")

        let formdata = new FormData();
        formdata.append('academic_year', data.academic_year);
        formdata.append('student_year', data.student_year);
        formdata.append('college_name', data.college_name);
        formdata.append('ecc_domain', data.domain);
        formdata.append('ecc_level', data.level);
        formdata.append('ecc_location', data.location);
        formdata.append('ecc_date', data.date);
        formdata.append('ecc_certificate_path', data.certificate);
        formdata.append('prize', data.prize);

        const token = getToken()


        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/extra-curricular-activities`,
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
                toast.dismiss(loading)
                toast.success('activity added successfully')
                return
            })
            .catch((error) => {
                console.log(error);
                toast.dismiss(loading)

            });

    };

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            <div className='w-full max-md:mt-8  max-md:mb-8'>
                <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Extra Curriculum Activities</h1>
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
                                <MenuItem value={1}>First Year</MenuItem>
                                <MenuItem value={2}>Second Year</MenuItem>
                                <MenuItem value={3}>Third Year</MenuItem>
                                <MenuItem value={4}>Fourth Year</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>


                    <label className='label' htmlFor="college_name">College Name</label>
                    <input type="text" id='college_name' name="college_name" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="domain">Domain</label>
                    <input type="text" id='domain' name="domain" className='input' onChange={handleChange} />

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
                </div>
                <div className='w-full md:p-8 md:p-2 md:mt-4 '>
                    <label className='label' htmlFor="location">Location</label>
                    <input type="text" id='location' name="location" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="date">Date</label>
                    <input type="date" id='date' name="date" className='input' onChange={handleChange} />

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
                </div>
            </div>
            <div className='flex justify-center mt-4 '>
                <button className='btn' onClick={handleSubmit}>Submit</button>
            </div>
        </section>
    );
};

export default ExtraCurr;
