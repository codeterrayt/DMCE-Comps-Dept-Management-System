import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const HigherStudies = () => {
    const [formData, setFormData] = useState({
        academicYear: '',
        examType: '',
        score: '',
        city: '',
        state: '',
        country: '',
        university: '',
        course: '',
        admissionLetter: null,
        projectGuide: '',
        collegeName: '', // Added collegeName field
    });

    // Handle input changes and update formData state
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Remove unwanted properties from the object
        const updatedFormData = { ...formData };
        if (value === '') {
            delete updatedFormData[name];
        } else {
            updatedFormData[name] = value;
        }

        setFormData(updatedFormData);
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
                <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Higher Studies Details</h1>
            </div>
            <div className='w-full grid md:grid-cols-2 grid-cols-1'>
                <div className='w-full md:p-8 md:mt-4 '>
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
                      {/* Additional field */}
                      <label className='label' htmlFor="collegeName">College Name</label>
                    <input type="text" id='collegeName' name='collegeName' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="examType">Exam Type</label>
                    <input type="text" id='examType' name='examType' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="score">Score</label>
                    <input type="number" id='score' name='score' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="city">City</label>
                    <input type="text" id='city' name='city' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="state">State</label>
                    <input type="text" id='state' name='state' className='input' onChange={handleChange} />


                </div>
                <div className='w-full md:p-8 md:mt-4 '>
                    <label className='label' htmlFor="country">Country</label>
                    <input type="text" id='country' name='country' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="university">University</label>
                    <input type="text" id='university' name='university' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="course">Course</label>
                    <input type="text" id='course' name='course' className='input' onChange={handleChange} />

                    <label className='label' htmlFor="admissionLetter">Admission Letter</label>
                    <div className="bg-gray-100 mb-[12px] ">
                        <label htmlFor="admissionLetter" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Admission Letter
                        </label>
                        <input id="admissionLetter" name="admissionLetter" type="file" className="hidden" onChange={handleFileChange} />
                        {formData.admissionLetter && (
                            <p className="mt-2 text-gray-700">Selected file: {formData.admissionLetter.name}</p>
                        )}
                    </div>

                    <label className='label' htmlFor="projectGuide">Project Guide</label>
                    <input type="text" id='projectGuide' name='projectGuide' className='input' onChange={handleChange} />

                  
                </div>
            </div>
            <div className='flex justify-center mt-4'>
                <button className='btn' onClick={handleSubmit}>Submit</button>
            </div>
        </section>
    );
};

export default HigherStudies;
