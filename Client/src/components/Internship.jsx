import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Internship = () => {
    const [data, setData] = useState({
        academicYear: '',
        year: '',
        duration: '',
        startDate: '',
        endDate: '',
        domain: '',
        completionLetter: null,
        offerLetter: null,
        permissionLetter: null
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
        console.log(data);
        // Perform further actions with the data as needed
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
                    <Box sx={{ minWidth: 120,}}>
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

                    <label className='label' htmlFor="sdate">Start Date</label>
                    <input type="Date" id='startDate' name="startDate" className='input' onChange={handleChange} />

                    <label className='label' htmlFor="edate">End Date</label>
                    <input type="Date" id='endDate' name="endDate" className='input' onChange={handleChange} />

                </div>
                <div className='w-full md:p-8 md:p-2 md:mt-4 '>
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

                    <label className='label' htmlFor="offerLetter">Offer Letter</label>
                    <div className="bg-gray-100 mb-[12px] ">
                        <label htmlFor="offerLetter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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
                                <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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
    );
};

export default Internship;
