import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';

import Loaders from './Loaders';

const Achivements = () => {
    const navigate = useNavigate();
    const [achivement, setAchivement] = useState([]);
    const [loader, setLoader] = useState(false);

    function removeUnwantedFields(achievements) {
        // Create an array to store modified achievement objects
        let modifiedAchievementsArray = [];

        achievements.forEach(achievement => {
            // Create a new object to store modified keys
            let modifiedAchievement = {};

            // Iterate over the keys of the current achievement object
            for (let key in achievement) {
                // If the key ends with '_path', remove the suffix
                // Otherwise, keep the key as it is
                modifiedAchievement[key.replace(/_path$/, '')] = achievement[key];
            }

            // Destructure the unwanted keys and store the rest
            const { user_id, created_at, updated_at, ...rest } = modifiedAchievement;

            // Push the modified object to the array
            modifiedAchievementsArray.push(rest);
        });

        // Return the array of modified achievement objects
        return modifiedAchievementsArray;
    }


    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/dmce/login');
        }
    }, []);

    useEffect(() => {
        getAllAchievements();

    }, []);

    useEffect(() => {
        if (achivement.length > 0) {
            // Initialize DataTable after the table has been rendered
            new DataTable('#example');
        }
    }, [achivement]);

    const getAllAchievements = () => {
        setLoader(true);
        const token = getToken();

        let config = {
            method: 'get',
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/achievements`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        axios.request(config)
            .then((response) => {
                const data = removeUnwantedFields(response.data.achievements)
                setAchivement(data);
                setLoader(false);
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    localStorage.clear()
                    return navigate('/dmce/login')
                }
                setLoader(false);
                return toast.error(error.response.data.message);

            });
    };


    return (
        <section className='w-full  min-h-screen p-4 md:p-8 '>
            {loader ? <Loaders message={"loading your achievement"} /> :
                <div className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your Achievements</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/achivement')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/achivement')}
                        >
                            Add Achievements
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        {
                            achivement.length ? (
                                <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-sm text-center'>Academic Year</th>
                                            <th className='text-sm text-center'>Achievement Certificate</th>
                                            <th className='text-sm text-center'>Achievement Date</th>
                                            <th className='text-sm text-center'>Achievement Domain</th>
                                            <th className='text-sm text-center'>Achievement Level</th>
                                            <th className='text-sm text-center'>Achievement Location</th>
                                            <th className='text-sm text-center'>College Name</th>
                                            <th className='text-sm text-center'>Prize</th>
                                            <th className='text-sm text-center'>Student Year</th>
                                            <th className='text-sm text-center'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {achivement.map(achievement => (
                                            <tr key={achievement.id}>
                                                <td className='text-center text-sm'>{achievement.academic_year}</td>
                                                <td className='text-center text-sm'>
                                                    <a href={achievement.achievement_certificate} target="_blank" rel="noopener noreferrer">View Certificate</a>
                                                </td>
                                                <td className='text-center text-sm'>{achievement.achievement_date}</td>
                                                <td className='text-center text-sm'>{achievement.achievement_domain}</td>
                                                <td className='text-center text-sm'>{achievement.achievement_level}</td>
                                                <td className='text-center text-sm'>{achievement.achievement_location}</td>
                                                <td className='text-center text-sm'>{achievement.college_name}</td>
                                                <td className='text-center text-sm'>{achievement.prize}</td>
                                                <td className='text-center text-sm'>{achievement.student_year}</td>
                                                <td className='text-center text-sm '>
                                                    <div className='flex items-center gap-2 justify-center'>
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mr-2" onClick={() => handleEdit(achievement)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded" onClick={() => handleDelete(achievement.id)}><i className="fa-solid fa-trash"></i></button>
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

export default Achivements;
