import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { checkLogin } from '../helper/checkLogin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Achievements = () => {
    const [data, setData] = useState({
        academicYear: '',
        studentYear: '',
        collegeName: '',
        achievementDomain: '',
        achievementLevel: '',
        achievementLocation: '',
        achievementDate: '', // Added achievementDate
        achievementCertificate: null,
        prize: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!checkLogin()) {
            navigate('/dmce/login');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData((prevData) => ({
            ...prevData,
            achievementCertificate: file,
            achievementCertificatePath: e.target.value // Assuming e.target.value contains the file path
        }));
    }

    const years = [];
    for (let year = 2021; year <= 2030; year++) {
        const academicYear = `${year}-${year + 1}`;
        years.push(
            <MenuItem key={academicYear} value={academicYear}>
                {academicYear}
            </MenuItem>
        );
    }

    const handleSubmit = async () => {
        const loading = toast.loading('Adding your achievement');
        const userInSession = localStorage.getItem('dmceuser');
        const token = JSON.parse(userInSession).token;

        const formData = new FormData();
        formData.append('academic_year', data.academicYear);
        formData.append('student_year', data.studentYear);
        formData.append('college_name', data.collegeName);
        formData.append('achievement_domain', data.achievementDomain);
        formData.append('achievement_level', data.achievementLevel);
        formData.append('achievement_location', data.achievementLocation);
        formData.append('achievement_date', data.achievementDate);
        formData.append('prize', data.prize);
        formData.append('achievement_certificate', data.achievementCertificate); // Append the file object directly

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/student/add/achievement`,
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    maxBodyLength: Infinity,
                }
            );
            console.log(JSON.stringify(response.data));
            toast.dismiss(loading);
            toast.success('Achievement added successfully');
        } catch (error) {
            console.error(error);
            toast.dismiss(loading);
            toast.error('Something went wrong');
        }
    };

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            <div className='w-full max-md:mt-8 max-md:mb-8'>
                <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Fill Your Achievements</h1>
            </div>
            <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                <div className='w-full md:p-8 md:mt-4 '>
                    <label className='label' htmlFor="academicYear">Academic Year</label>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl style={{ marginBottom: "12px" }} fullWidth>
                            <InputLabel id="academic-year-label">Academic Year</InputLabel>
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

                    <label className='label' htmlFor="studentYear">Student Year</label>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl style={{ marginBottom: "12px" }} fullWidth>
                            <InputLabel id="student-year-label">Student Year</InputLabel>
                            <Select
                                labelId="student-year-label"
                                id="studentYear"
                                name="studentYear"
                                value={data.studentYear}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>First Year</MenuItem>
                                <MenuItem value={2}>Second Year</MenuItem>
                                <MenuItem value={3}>Third Year</MenuItem>
                                <MenuItem value={4}>Fourth Year</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <label className='label' htmlFor="collegeName">College Name</label>
                    <input type="text" id='collegeName' name="collegeName" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="achievementDomain">Domain / Title</label>
                    <input type="text" id='achievementDomain' name="achievementDomain" className='input' onChange={handleChange} />
                </div>
                <div className='w-full md:p-8 md:mt-4'>
                    <label className='label' htmlFor="achievementLevel">Achievement Level</label>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl style={{ marginBottom: "12px" }} fullWidth>
                            <InputLabel id="achievement-level-label">Achievement Level</InputLabel>
                            <Select
                                labelId="achievement-level-label"
                                id="achievementLevel"
                                name="achievementLevel"
                                value={data.achievementLevel}
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

                    <label className='label' htmlFor="achievementLocation">Achievement Location</label>
                    <input type="text" id='achievementLocation' name="achievementLocation" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="achievementDate">Achievement Date</label>
                    <input type="date" id='achievementDate' name="achievementDate" className='input' onChange={handleChange} />
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
                                <MenuItem value="First">First</MenuItem>
                                <MenuItem value="Second">Second</MenuItem>
                                <MenuItem value="Third">Third</MenuItem>
                                <MenuItem value="Fourth">Fourth</MenuItem>
                                <MenuItem value="Participated">Participated</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>


                    <label className='label' htmlFor="achievementCertificate">Achievement Certificate</label>
                    <div className="bg-gray-100 mb-[12px] ">
                        <label htmlFor="achievementCertificate" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Achievement Certificate
                        </label>
                        <input id="achievementCertificate" name="achievementCertificate" type="file" className="hidden" onChange={handleFileChange} />
                        {data.achievementCertificate && (
                            <p className="mt-2 text-gray-700">Selected file: {data.achievementCertificate.name}</p>
                        )}
                    </div>

                </div>
            </div>
            <div className='flex justify-center mt-4 '>
                <button className='btn' onClick={handleSubmit}>Submit</button>
            </div>
        </section>
    );
};

export default Achievements;
