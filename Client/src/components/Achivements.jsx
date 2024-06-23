import React, { useEffect, useState } from 'react';
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

const Achivements = () => {

    //pop up 
    const [certificateUrl, setCertificateUrl] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);

    const openCertificate = (certificateUrl) => {
        setCertificateUrl(certificateUrl);
        setShowCertificate(true);
    };

    const closeCertificate = () => {
        setCertificateUrl('');
        setShowCertificate(false);
    };


    ////
    const [checkDelete, setCheckDelete] = useState(false)

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
            return navigate('/login');
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
                    return navigate('/login')
                }
                setLoader(false);
                return toast.error(getFirstErrorMessage(error.response.data));

            });
    };

    const handleDelete = (id) => {
        try {
            const confirmOptions = {
                customUI: ({ onClose }) => (
                    <Modal open={true} onClose={onClose} center>
                        <div>
                            <h2 className='font-bold text-xl'>Confirm Deletion</h2>
                            <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this achievement?</p>
                            <div className='w-full flex items-center px-4 justify-between'>
                                <button className='py-2 px-4 rounded-md  bg-[#262847] text-white' onClick={async () => {
                                    onClose();
                                    setLoader(true);

                                    let data = new FormData();
                                    data.append('id', id);

                                    const token = getToken();
                                    setCheckDelete(true)

                                    let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/achievement`,
                                        headers: {
                                            'Accept': 'application/json',
                                            'Authorization': `Bearer ${token}`,
                                            ...data.getHeaders
                                        },
                                        data: data
                                    };

                                    // Send delete request
                                    axios.request(config)
                                        .then((response) => {
                                            setAchivement(data => data.filter(value => value.id !== id));
                                            setCheckDelete(false)

                                            setLoader(false)
                                        })
                                        .catch((error) => {
                                            setCheckDelete(false)

                                            if (error.response && error.response.status === 401) {
                                                localStorage.clear();
                                                return navigate('/login');
                                            }
                                            console.log(error);
                                        });

                                }}>
                                    Yes
                                </button>
                                <button className='py-2 px-4 rounded-md  bg-[#262847] text-white' onClick={() => {
                                    onClose();
                                    setLoader(false);
                                }}>
                                    No
                                </button>
                            </div>
                        </div>
                    </Modal>
                ),
            };

            // Display responsive confirmation dialog
            confirmAlert(confirmOptions);
        } catch (error) {
            setCheckDelete(false)

            setLoader(false);
            toast.error(error.message);
        }
    }


    return (
        <section className='w-full  min-h-screen p-4 md:p-8 '>

            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}

            {loader ? <Loaders message={(checkDelete ? "Deleting " : "Fetching") + "Your Achievement"} /> :
                <AnimationWrapper className='w-full'>
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

                    <div className="table-responsive w-full mt-8 ">
                        {
                            achivement.length ? (
                                <table id="example" className="table table-striped text-black" style={{ width: '100%' }}>
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
                                        {achivement.map(achievement => (
                                            <tr key={achievement.id}>
                                                <td className='text-center text-sm' data-label="AY">{achievement.academic_year}</td>
                                                <td className='text-center text-sm whitespace-nowrap' data-label="Date">{formatDate(achievement.achievement_date)}</td>
                                                <td className='text-center text-sm' data-label="Title">{achievement.achievement_domain}</td>
                                                <td className='text-center text-sm' data-label="Level">{achievement.achievement_level}</td>
                                                <td className='text-center text-sm' data-label="Location">{achievement.achievement_location}</td>
                                                <td className='text-center text-sm' data-label="College">{achievement.college_name}</td>
                                                <td className='text-center text-sm' data-label="Prize">{achievement.prize}</td>
                                                <td className='text-center text-sm' data-label="Year">{achievement.student_year}</td>
                                                <td className='text-center text-sm' data-label="Certificate">
                                                    <abbr title="See Certificate">
                                                        <button onClick={() => openCertificate(achievement.achievement_certificate)} className="certificate">
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                                <td className='text-center text-sm' data-label="Actions">
                                                    <div className='flex items-center gap-3 justify-center'>
                                                        <abbr title="Edit">
                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded mr-2" onClick={() => navigate(`/dmce/add/achivement/${achievement.id}`)}>
                                                                <i className="fa-solid fa-pen-to-square"></i>
                                                            </button>
                                                        </abbr>
                                                        <abbr title="Delete">
                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(achievement.id)}>
                                                                <i className="fa-solid fa-trash"></i>
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
                            )
                        }

                    </div>

                </AnimationWrapper>
            }
        </section>
    );
};

export default Achivements;
