import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Hackathon = () => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        startDate: '',
        academicYear: '',
        year: '',
        domain: '',
        prize: '',
        completionLetter: null,
        collegeName: '',
        endDate: '',
        position: '',
        level: '', // Added level field
    });

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

    // Handle form submission
    const handleSubmit = () => {
        console.log(formData); // You can perform further actions with the data here
    };

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            <div className='w-full max-md:mt-8  max-md:mb-8'>
                <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Fill Your Hackathon Details</h1>
            </div>
            <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                <div className='w-full md:p-8 md:mt-4 '>
                    <label className='label' htmlFor="title">Hackathon Title</label>
                    <input type="text" id='title' name='title' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="location">Location</label>
                    <input type="text" id='location' name="location" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="level">Select Level</label>
                    <Box sx={{ minWidth: 120 }}>
                         <FormControl  
style={{marginBottom:"12px"}} fullWidth>
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
                    <label className='label' htmlFor="prize">Prize (In Rupee)</label>
                    <input type="number" id='prize' name="prize" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="domain">Domain</label>
                    <input type="text" id='domain' name="domain" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="completionLetter">Achievements Certificate</label>
                    <div className="bg-gray-100 mb-[12px] ">
                        <label htmlFor="completionLetter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Completion Letter/ Certificate
                        </label>
                        <input id="completionLetter" name="completionLetter" type="file" className="hidden" onChange={handleFileChange} />
                        {formData.completionLetter && (
                            <p className="mt-2 text-gray-700">Selected file: {formData.completionLetter.name}</p>
                        )}
                    </div>
                </div>
                <div className='w-full md:p-8 md:p-2 md:mt-4 '>
                    <label className='label' htmlFor="collegeName">Enter College Name</label>
                    <input type="text" id='collegeName' name='collegeName' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="startDate">Start Date</label>
                    <input type="date" id='startDate' name="startDate" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="endDate">End Date</label>
                    <input type="date" id='endDate' name="endDate" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="academicYear">Select Academic Year</label>
                    <Box sx={{ minWidth: 120 }}>
                         <FormControl  
style={{marginBottom:"12px"}} fullWidth>
                            <InputLabel id="academic-year-label">Academic Year</InputLabel>
                            <Select
                                labelId="academic-year-label"
                                id="academicYear"
                                name="academicYear"
                                value={formData.academicYear || ''}
                                onChange={handleChange}
                            >
                                {years}
                            </Select>
                        </FormControl>
                    </Box>

                    <label className='label' htmlFor="position">Position</label>
                    <Box sx={{ minWidth: 120 }}>
                         <FormControl  
style={{marginBottom:"12px"}} fullWidth>
                            <InputLabel id="position-label">Position</InputLabel>
                            <Select
                                labelId="position-label"
                                id="position"
                                name="position"
                                value={formData.position || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>First</MenuItem>
                                <MenuItem value={2}>Second</MenuItem>
                                <MenuItem value={3}>Third</MenuItem>
                                <MenuItem value={4}>Fourth</MenuItem>
                                <MenuItem value={5}>Fifth</MenuItem>
                                <MenuItem value={10}>Top 10</MenuItem>
                                <MenuItem value={25}>Top 25</MenuItem>
                                <MenuItem value={50}>Top 50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <label className='label' htmlFor="year">Select Year</label>
                    <Box sx={{ minWidth: 120 }}>
                         <FormControl  
style={{marginBottom:"12px"}} fullWidth>
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
                </div>
            </div>
            <div className='flex justify-center mt-4 '>
                <button className='btn' onClick={handleSubmit}>Submit</button>
            </div>
        </section>
    );
};

export default Hackathon;
