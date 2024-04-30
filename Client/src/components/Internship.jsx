import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';

import Loaders from './Loaders';

const Internship = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loader, setLoader] = useState(false);

    function removeUnwantedFields(internships) {

        let modifiedInternships = [];

        internships.forEach(internship => {

            let modifiedInternship = {};

            for (let key in internship) {

                modifiedInternship[key.replace(/_path$/, '')] = internship[key];
            }


            const { user_id, created_at, updated_at, ...rest } = modifiedInternship;


            modifiedInternships.push(rest);
        });

        return modifiedInternships;
    }


    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/dmce/login');
        }
        console.log('vaad');


    }, []);

    useEffect(() => {
        getAllInternships();
    }, []);

    useEffect(() => {
        if (internships.length > 0) {
            // Initialize DataTable after the table has been rendered
            new DataTable('#example');
        }
    }, [internships]);

    const getAllInternships = () => {
        setLoader(true);
        const token = getToken();

        let config = {
            method: 'get',
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/internships`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        axios.request(config)
            .then((response) => {
                console.log(response);

                const data = removeUnwantedFields(response.data.internships)
                setInternships(data);
                setLoader(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/dmce/login');
                }
                setLoader(false);
                console.log(error);
                return toast.error(error.response.data.message);

            });
    };


    console.log(internships);


    return (
        <section className='w-full  min-h-screen p-4 md:p-8 '>
            {loader ? <Loaders message={"loading your internships"} /> :
                <div className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your Internships</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/internship')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/internship')}
                        >
                            Add Internship
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        {
                            internships.length ? (
                                <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-sm text-center'>Academic Year</th>
                                            <th className='text-sm text-center'>Certificate</th>
                                            <th className='text-sm text-center'>Completion Letter</th>
                                            <th className='text-sm text-center'>Domain</th>
                                            <th className='text-sm text-center'>Duration</th>
                                            <th className='text-sm text-center'>Start Date</th>
                                            <th className='text-sm text-center'>End Date</th>
                                            <th className='text-sm text-center'>Offer Letter</th>
                                            <th className='text-sm text-center'>Permission Letter</th>
                                            <th className='text-sm text-center'>Student Year</th>
                                            <th className='text-sm text-center'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {internships.map(internship => (
                                            <tr key={internship.id}>
                                                <td className='text-center text-sm'>{internship.academic_year}</td>
                                                <td className='text-center text-sm'>
                                                    <a href={internship.certificate} target="_blank" rel="noopener noreferrer">View Certificate</a>
                                                </td>
                                                <td className='text-center text-sm'>
                                                    <a href={internship.completion_letter} target="_blank" rel="noopener noreferrer">View Completion Letter</a>
                                                </td>
                                                <td className='text-center text-sm'>{internship.domain}</td>
                                                <td className='text-center text-sm'>{internship.duration}</td>
                                                <td className='text-center text-sm'>{internship.start_date}</td>
                                                <td className='text-center text-sm'>{internship.end_date}</td>
                                                <td className='text-center text-sm'>
                                                    <a href={internship.offer_letter} target="_blank" rel="noopener noreferrer">View Offer Letter</a>
                                                </td>
                                                <td className='text-center text-sm'>
                                                    <a href={internship.permission_letter} target="_blank" rel="noopener noreferrer">View Permission Letter</a>
                                                </td>
                                                <td className='text-center text-sm'>{internship.student_year}</td>
                                                <td className='text-center text-sm '>
                                                    <div className='flex items-center gap-2 justify-center'>
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded " onClick={() => handleEdit(internship)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded" onClick={() => handleDelete(internship.id)}><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <h1 className='text-xl md:text-2xl mt-3 text-center font-bold text-[#262847]'>No Data Available</h1>
                            )
                        }


                    </div>

                </div>
            }
        </section>
    );
};

export default Internship;
