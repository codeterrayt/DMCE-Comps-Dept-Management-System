import React, { useState } from 'react';
import profilephoto from '../assets/profilephoto.jpg';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        rollNo: '',
        studentId: '',
        admittedYear: '',
        div: '',
        mobileNumber: '',
        password: '',
        photo: null // to store the selected photo file
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhotoChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = () => {
        console.log(formData);
        // Perform further actions with the form data as needed
    };

    const years = [];
    for (let year = 1; year <= 4; year++) {
        years.push(
            <option key={year} value={year}>
                {`Year ${year}`}
            </option>
        );
    }

    const academicYears = [];
    for (let year = 2021; year <= 2030; year++) {
        const academicYear = `${year}-${year + 1}`;
        academicYears.push(
            <option key={academicYear} value={academicYear}>
                {academicYear}
            </option>
        );
    }

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            <div className='mx-auto w-full'>
                <div className='w-full max-md:mt-8  max-md:mb-8'>
                    <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Sign Up</h1>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 mt-4 gap-4 w-full'>
                    <div className=' w-full p-2 md:p-8 mt-4'>
                        <div className="flex justify-center">
                            <div className="relative w-32 h-32 overflow-hidden rounded-full">
                                {formData.photo ? (
                                    <img src={URL.createObjectURL(formData.photo)} alt="Profile" className="object-cover w-full h-full rounded-full" />
                                ) : <img src={profilephoto} alt="Profile" className="object-cover w-full h-full rounded-full" />}
                            </div>
                        </div>

                        <label className='label' htmlFor="photo">Upload Photo</label>
                        <div className="bg-gray-100 mb-[12px] ">
                            <label htmlFor="photo" className="flex items-center justify-center px-4 py-2 bg-[#262847] text-white rounded-md cursor-pointer hover:bg-[#1e4f8f] transition duration-300 ease-in-out">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Choose Photo
                            </label>
                            <input id="photo" name="photo" type="file" className="hidden" onChange={handlePhotoChange} />
                            {formData.photo && (
                                <p className="mt-2 text-gray-700">Selected file: {formData.photo.name}</p>
                            )}
                        </div>

                        <label className='label' htmlFor="firstName">First Name</label>
                        <input type="text" id='firstName' name="firstName" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="middleName">Middle Name</label>
                        <input type="text" id='middleName' name="middleName" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="lastName">Last Name</label>
                        <input type="text" id='lastName' name="lastName" className='input' onChange={handleChange} />



                        <label className='label' htmlFor="rollNo">Roll No</label>
                        <input type="text" id='rollNo' name="rollNo" className='input' onChange={handleChange} />


                    </div>
                    <div className=' w-full md:p-8 md:mt-4 md:mt-8'>
                        <label className='label' htmlFor="admittedYear">Admitted Year</label>
                        <select id="admittedYear" name="admittedYear" className='input' onChange={handleChange}>
                            <option value="">Select Admitted Year</option>
                            {academicYears}
                        </select>
                        <label className='label' htmlFor="studentId">Student ID</label>
                        <input type="text" id='studentId' name="studentId" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="year">Year</label>
                        <select id="year" name="year" className='input' onChange={handleChange}>
                            <option value="">Select Year</option>
                            {years}
                        </select>

                        <label className='label' htmlFor="div">Division</label>
                        <select id="div" name="div" className='input' onChange={handleChange}>
                            <option value="">Select Division</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                        </select>

                        <label className='label' htmlFor="mobileNumber">Mobile Number</label>
                        <input type="tel" id='mobileNumber' name="mobileNumber" className='input' onChange={handleChange} />
                        <label className='label' htmlFor="email">Email</label>
                        <input type="email" id='email' name="email" className='input' onChange={handleChange} />

                        <label className='label' htmlFor="password">Password</label>
                        <input type="password" id='password' name="password" className='input' onChange={handleChange} />
                    </div>
                </div>
                <div className='flex justify-center mt-4'>
                    <button className='btn' onClick={handleSubmit}>Sign Up</button>
                </div>
            </div>
        </section>
    );
};

export default SignUpForm;
