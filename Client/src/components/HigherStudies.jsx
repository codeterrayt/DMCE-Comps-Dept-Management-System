import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loaders from './Loaders';

const HigherStudies = () => {
    const navigate = useNavigate();
    const [study, setStudy] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/dmce/login');
        }


        console.log(study);
    }, [navigate]);

    useEffect(() => {
        getAllHackathons();
    }, []);
    useEffect(() => {
        if (study.length > 0) {
            // Initialize DataTable after the table has been rendered
            new DataTable('#example');
        }
    }, [study]);


    function removeUnwantedFields(data) {

        let AllmodifiedData = [];

        data.forEach(data => {

            let modifiedData = {};

            for (let key in data) {

                modifiedData[key.replace(/_path$/, '')] = data[key];
            }


            const { user_id, created_at, updated_at, ...rest } = modifiedData;


            AllmodifiedData.push(rest);
        });

        return AllmodifiedData;
    }

    const getAllHackathons = () => {
        setLoader(true);
        const token = getToken();

        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/higher-studies`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                const modifiedData = removeUnwantedFields(response.data.higher_studies);
                setStudy(modifiedData);
                setLoader(false);
            })
            .catch(error => {
                console.error(error);
                setLoader(false);
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/dmce/login');
                }
                toast.error(error.response.data.message);
            });
    };

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {loader ? (
                <Loaders message="Loading your higher study details..." />
            ) : (
                <div className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Higher Study</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/higher-studies')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/higher-studies')}
                        >
                            Add Higher Study
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        {study.length ? (
                            <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                <thead>
                                    <tr>

                                        <th className='text-sm text-center'>Student Academic Year</th>
                                        <th className='text-sm text-center'>Student Admission Letter</th>
                                        <th className='text-sm text-center'>Student Course</th>
                                        <th className='text-sm text-center'>Student Exam Type</th>
                                        <th className='text-sm text-center'>Student Project Guide</th>
                                        <th className='text-sm text-center'>Student Score</th>
                                        <th className='text-sm text-center'>University City</th>
                                        <th className='text-sm text-center'>University Country</th>
                                        <th className='text-sm text-center'>University Name</th>
                                        <th className='text-sm text-center'>University State</th>
                                        <th className='text-sm text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {study.map((study, rowIndex) => (
                                        <tr key={rowIndex}>

                                            <td className='text-center text-sm'>{study.student_academic_year}</td>
                                            <td className='text-center text-sm'>
                                                <a href={study.student_admission_letter} target="_blank" rel="noopener noreferrer">View Letter</a>
                                            </td>
                                            <td className='text-center text-sm'>{study.student_course}</td>
                                            <td className='text-center text-sm'>{study.student_exam_type}</td>
                                            <td className='text-center text-sm'>{study.student_project_guide}</td>
                                            <td className='text-center text-sm'>{study.student_score}</td>
                                            <td className='text-center text-sm'>{study.university_city}</td>
                                            <td className='text-center text-sm'>{study.university_country}</td>
                                            <td className='text-center text-sm'>{study.university_name}</td>
                                            <td className='text-center text-sm'>{study.university_state}</td>
                                            <td className='text-center text-sm'>
                                                <div className='flex items-center gap-2 justify-center'>
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mr-2" onClick={() => handleEdit(study)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded" onClick={() => handleDelete(study.id)}><i className="fa-solid fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <h1 className='text-xl md:text-2xl mt-3 text-center font-bold text-[#262847]'>No Data Available</h1>
                        )}

                    </div>
                </div>
            )}
        </section>
    );
};

export default HigherStudies;
