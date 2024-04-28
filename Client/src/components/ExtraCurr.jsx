import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loaders from './Loaders';

const ExtraCurr = () => {
    const navigate = useNavigate();
    const [activity, setActivity] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/dmce/login');
        }
        console.log(activity);

    }, [navigate]);

    useEffect(() => {
        getAllActivities();
    }, []);
    useEffect(() => {
        if (activity.length > 0) {
            // Initialize DataTable after the table has been rendered
            new DataTable('#example');
        }
    }, [activity]);

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

    const getAllActivities = () => {
        setLoader(true);
        const token = getToken();

        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/extra-curricular-activities`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                const modifiedData = removeUnwantedFields(response.data.ecc);
                setActivity(modifiedData);
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
            {
                loader ? (
                    <Loaders message={"loading your activity"} />
                ) : (
                    <div className='w-full'>
                        <div className='w-full flex items-center justify-between px-4 mt-8 '>
                            <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your Activity</h2>
                            <button
                                className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block md:hidden md:text-xl"
                                onClick={() => navigate('/dmce/add/extra-curriculum')}
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                            <button
                                className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block max-md:hidden md:text-xl"
                                onClick={() => navigate('/dmce/add/extra-curriculum')}
                            >
                                Add Activity
                            </button>
                        </div>

                        <div className="overflow-x-auto w-full mt-8 ">
                            {
                                activity.length ? (
                                    <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th className='text-sm text-center'>Academic Year</th>
                                                <th className='text-sm text-center'>College Name</th>
                                                <th className='text-sm text-center'>ECC Certificate</th>
                                                <th className='text-sm text-center'>ECC Date</th>
                                                <th className='text-sm text-center'>ECC Domain</th>
                                                <th className='text-sm text-center'>ECC Level</th>
                                                <th className='text-sm text-center'>ECC Location</th>
                                                <th className='text-sm text-center'>Prize</th>
                                                <th className='text-sm text-center'>Student Year</th>
                                                <th className='text-sm text-center'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activity.map((item, index) => (
                                                <tr key={index}>
                                                    <td className='text-center text-sm'>{item.academic_year}</td>
                                                    <td className='text-center text-sm'>{item.college_name}</td>
                                                    <td className='text-center text-sm'>
                                                        <a href={item.ecc_certificate} target="_blank" rel="noopener noreferrer">View Certificate</a>
                                                    </td>
                                                    <td className='text-center text-sm'>{item.ecc_date}</td>
                                                    <td className='text-center text-sm'>{item.ecc_domain}</td>
                                                    <td className='text-center text-sm'>{item.ecc_level}</td>
                                                    <td className='text-center text-sm'>{item.ecc_location}</td>
                                                    <td className='text-center text-sm'>{item.prize}</td>
                                                    <td className='text-center text-sm'>{item.student_year}</td>
                                                    <td className='text-center text-sm flex gap-2 items-center '>
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mr-2" onClick={() => handleEdit(item)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded" onClick={() => handleDelete(item.id)}><i className="fa-solid fa-trash"></i></button>
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
                )
            }


        </section>
    );
};

export default ExtraCurr;
