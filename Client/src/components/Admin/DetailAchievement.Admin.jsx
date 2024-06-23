import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { checkLogin } from '../../helper/checkLogin';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getToken } from '../../helper/getToken';
import Loaders from '../Loaders';
import AnimationWrapper from '../Page-Animation';
import AdminNavBar from './AdminNavBar';
import { getFirstErrorMessage } from '../../helper/getErrorMessage';

const DetailAchievementAdmin = () => {

    
    const [loader, setloader] = useState(false);

    const [data, setData] = useState({
        academicYear: '',
        studentYear: '',
        collegeName: '',
        achievementDomain: '',
        achievementLevel: '',
        achievementLocation: '',
        achievementDate: '',
        achievementCertificate: null,
        prize: ''
    });

    const navigate = useNavigate();
    const { id } = useParams()
    useEffect(() => {
        if (id) {
            getDataById(id)
        }

    }, [])

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
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
        setData({
            ...data,
            achievementCertificate: file
        });
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
        // Check if any required field is empty
        if (!id && !data.academicYear) {
            return toast.error("Please enter the academic year.");
        }
        if (!id && !data.studentYear) {
            return toast.error("Please enter the student year.");
        }
        if (!id && !data.collegeName) {
            return toast.error("Please enter the college name.");
        }
        if (!id && !data.achievementDomain) {
            return toast.error("Please enter the achievement domain.");
        }
        if (!id && !data.achievementLevel) {
            return toast.error("Please enter the achievement level.");
        }
        if (!id && !data.achievementLocation) {
            return toast.error("Please enter the achievement location.");
        }
        if (!id && !data.achievementDate) {
            return toast.error("Please enter the achievement date.");
        }
        if (!id && !data.prize) {
            return toast.error("Please enter the prize.");
        }
        if (!id && !data.achievementCertificate) {
            return toast.error("Please upload the achievement certificate.");
        }

        // Check file size for achievementCertificate
        if (!id && data.achievementCertificate.size > 512 * 1024) {
            return toast.error("Achievement certificate size should be less than 512 KB.");
        }

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
        if (data.achievementCertificate) {

            formData.append('achievement_certificate_path', data.achievementCertificate);
        }
        if (id) {
            formData.append('id', id);
        }


        try {
            const url = id && `${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/achievement`
            const response = await axios.post(
                url,
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
            navigate('/dmce/achivement')
            toast.success(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                return navigate('/login');
            }
            console.error(error);
            toast.dismiss(loading);
            return toast.error(getFirstErrorMessage(error.response.data));

        }
    };


    const getDataById = (id) => {
        setloader(true)
        try {
            const token = getToken()

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/achievement/${id}`,
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
                        studentYear: response.data.student_year,
                        collegeName: response.data.college_name,
                        achievementDomain: response.data.achievement_domain,
                        achievementLevel: response.data.achievement_level,
                        achievementLocation: response.data.achievement_location,
                        achievementDate: response.data.achievement_date,
                        prize: response.data.prize
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
      <>
        <AdminNavBar/>
        <section className='w-full min-h-screen p-4 md:p-8'>
                  
                  {
                      loader ? <Loaders /> : <AnimationWrapper>
      
                          <div className='w-full max-md:mt-8 max-md:mb-8'>
                              <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>{(id ? "Update " : "Fill ") + "Your Achievement"}</h1>
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
                                              <MenuItem value={'FE'}>First Year</MenuItem>
                                              <MenuItem value={'SE'}>Second Year</MenuItem>
                                              <MenuItem value={'TE'}>Third Year</MenuItem>
                                              <MenuItem value={'BE'}>Fourth Year</MenuItem>
                                          </Select>
                                      </FormControl>
                                  </Box>
      
                                  <label className='label' htmlFor="collegeName">College Name</label>
                                  <input type="text" value={data.collegeName} id='collegeName' name="collegeName" className='input' onChange={handleChange} />
      
                                  <label className='label' htmlFor="achievementDomain">Domain / Title <p className='example'>e.g:- web-development , app-developement</p></label>
                                  <input type="text" value={data.achievementDomain} id='achievementDomain' name="achievementDomain" className='input' onChange={handleChange} />
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
      
                                  <label className='label' htmlFor="achievementLocation">Achievement Location <p className='example'>e.g:- Airoli, Thane</p></label>
                                  <input value={data.achievementLocation} type="text" id='achievementLocation' name="achievementLocation" className='input' onChange={handleChange} />
      
                                  <label className='label' htmlFor="achievementDate">Achievement Date</label>
                                  <input value={data.achievementDate} type="date" id='achievementDate' name="achievementDate" className='input' onChange={handleChange} />
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
      
      
                                  <label className='label' htmlFor="achievementCertificate">Achievement Certificate <p className='example'>Max PDF Size 512KB</p></label>
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
                      </AnimationWrapper>
                  }
              </section>
      </>
    );
};

export default DetailAchievementAdmin;
