import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import CertificatePopup from './Pop';
import AnimationWrapper from './Page-Animation';
import Loaders from './Loaders';
import { formatDate } from '../helper/getDate';
import { getFirstErrorMessage } from '../helper/getErrorMessage';
import { useQuery } from 'react-query';

const Achivements = () => {
    const navigate = useNavigate();
    const [showCertificate, setShowCertificate] = useState(false);
    const [certificateUrl, setCertificateUrl] = useState('');
    const [checkDelete, setCheckDelete] = useState(false);

    const getAllAchievements = async () => {
        const token = getToken();

        const config = {
            method: 'get',
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/achievements`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        const response = await axios.request(config);
        return response.data.achievements;
    };

    const { data: achievements, isLoading, isError, error, refetch } = useQuery('achievements', getAllAchievements, {
        retry: 1, // Number of retries befor e triggering an error
        onError: (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            } else {
                toast.error(getFirstErrorMessage(error.response?.data || error.message));
            }
        },
    });

    const openCertificate = (certificateUrl) => {
        setCertificateUrl(certificateUrl);
        setShowCertificate(true);
    };

    const closeCertificate = () => {
        setCertificateUrl('');
        setShowCertificate(false);
    };

    const handleDelete = async (id) => {
        try {
            await confirmDelete(id);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const confirmDelete = async (id) => {
        const confirmOptions = {
            customUI: ({ onClose }) => (
                <Modal open={true} onClose={onClose} center>
                    <div>
                        <h2 className='font-bold text-xl'>Confirm Deletion</h2>
                        <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this achievement?</p>
                        <div className='w-full flex items-center px-4 justify-between'>
                            <button
                                className='py-2 px-4 rounded-md bg-[#262847] text-white'
                                onClick={async () => {
                                    onClose();
                                    setCheckDelete(true); // Start loading
                                    try {
                                        const token = getToken();
                                        const data = new FormData();
                                        data.append('id', id);

                                        const config = {
                                            method: 'post',
                                            url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/achievement`,
                                            headers: {
                                                'Accept': 'application/json',
                                                'Authorization': `Bearer ${token}`,
                                            },
                                            data: data,
                                        };

                                        await axios.request(config);
                                        await refetch(); // Manually trigger refetch after deletion
                                        setCheckDelete(false); // End loading
                                    } catch (error) {
                                        setCheckDelete(false); // End loading on error
                                        if (error.response && error.response.status === 401) {
                                            localStorage.clear();
                                            navigate('/login');
                                        } else {
                                            toast.error(getFirstErrorMessage(error.response?.data || error.message));
                                        }
                                    }
                                }}
                            >
                                Yes
                            </button>
                            <button className='py-2 px-4 rounded-md bg-[#262847] text-white' onClick={onClose}>
                                No
                            </button>
                        </div>
                    </div>
                </Modal>
            ),
        };

        confirmAlert(confirmOptions);
    };

    if (!checkLogin()) {
        return navigate('/login');
    }

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}
            {isLoading ? (
                <Loaders message={(checkDelete ? 'Deleting ' : 'Fetching') + 'Your Achievement'} />
            ) : (
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8'>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847]'>Your Achievements</h2>
                        <button
                            className='bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block md:hidden md:text-xl'
                            onClick={() => navigate('/dmce/add/achivement')}
                        >
                            <i className='fa-solid fa-plus'></i>
                        </button>
                        <button
                            className='bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block max-md:hidden md:text-xl'
                            onClick={() => navigate('/dmce/add/achivement')}
                        >
                            Add Achievements
                        </button>
                    </div>

                    <div className='table-responsive w-full mt-8'>
                        {achievements && achievements.length ? (
                            <table id='example' className='table table-striped text-black' style={{ width: '100%' }}>
                                <thead>
                                    <tr className='capitalize'>
                                        <th className='text-sm text-center'>AY</th>
                                        <th className='text-sm text-center'>Date</th>
                                        <th className='text-sm text-center'>Title</th>
                                        <th className='text-sm text-center'>Level</th>
                                        <th className='text-sm text-center'>Location</th>
                                        <th className='text-sm text-center'>College Name</th>
                                        <th className='text-sm text-center'>Prize</th>
                                        <th className='text-sm text-center'>Year</th>
                                        <th className='text-sm text-center'>Certificate</th>
                                        <th className='text-sm text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievements.map((achievement) => (
                                        <tr key={achievement.id}>
                                            <td className='md:text-center text-sm' data-label='AY'>
                                                {achievement.academic_year}
                                            </td>
                                            <td className='md:text-center text-sm whitespace-nowrap' data-label='Date'>
                                                {formatDate(achievement.achievement_date)}
                                            </td>
                                            <td className='md:text-center text-sm' data-label='Title'>
                                                {achievement.achievement_domain}
                                            </td>
                                            <td className='md:text-center text-sm' data-label='Level'>
                                                {achievement.achievement_level}
                                            </td>
                                            <td className='md:text-center text-sm' data-label='Location'>
                                                {achievement.achievement_location}
                                            </td>
                                            <td className='md:text-center text-sm' data-label='College'>
                                                {achievement.college_name}
                                            </td>
                                            <td className='md:text-center text-sm' data-label='Prize'>
                                                {achievement.prize}
                                            </td>
                                            <td className='md:text-center text-sm' data-label='Year'>
                                                {achievement.student_year}
                                            </td>
                                            <td className='md:text-center text-sm' data-label='Certificate'>
                                                <abbr title='See Certificate'>
                                                    <button
                                                        onClick={() => openCertificate(achievement.achievement_certificate)}
                                                        className='certificate'
                                                    >
                                                        <i className='fa-solid fa-eye'></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='md:text-center text-sm' data-label='Actions'>
                                                <div className='flex items-center gap-3 md:justify-center'>
                                                    <abbr title='Edit'>
                                                        <button
                                                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded mr-2'
                                                            onClick={() => navigate(`/dmce/add/achivement/${achievement.id}`)}
                                                        >
                                                            <i className='fa-solid fa-pen-to-square'></i>
                                                        </button>
                                                    </abbr>
                                                    <abbr title='Delete'>
                                                        <button
                                                            className='bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded'
                                                            onClick={() => handleDelete(achievement.id)}
                                                        >
                                                            <i className='fa-solid fa-trash'></i>
                                                        </button>
                                                    </abbr>
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
                </AnimationWrapper>
            )}
        </section>
    );
};

export default Achivements;
