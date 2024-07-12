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

import Loaders from './Loaders';
import CertificatePopup from './Pop';
import { formatDate } from '../helper/getDate';
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';
import { useQuery } from 'react-query';

const ExtraCurr = () => {
    const navigate = useNavigate();
    // const [activity, setActivity] = useState([]);
    const [loader, setLoader] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false);
    const [certificateUrl, setCertificateUrl] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }
    }, [navigate]);

    // useEffect(() => {
    //     getAllActivities();
    // }, []);

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

    const getAllActivities = async () => {
        setLoader(true);
        const token = getToken();

        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/extra-curricular-activities`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })

        return response.data.ecc;

    };

    const { data: activity, isLoading, isError, error, refetch } = useQuery('ecc', getAllActivities, {
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
    const handleDelete = (id) => {
        try {
            const confirmOptions = {
                customUI: ({ onClose }) => (
                    <Modal open={true} onClose={onClose} center>
                        <div>
                            <h2 className='font-bold text-xl'>Confirm Deletion</h2>
                            <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this activity?</p>
                            <div className='w-full flex items-center px-4 justify-between'>
                                <button className='py-2 px-4 rounded-md bg-[#262847] text-white' onClick={async () => {
                                    onClose();
                                    setLoader(true);

                                    let data = new FormData();
                                    data.append('id', id);

                                    const token = getToken();
                                    setCheckDelete(true);

                                    let config = {
                                        method: 'post',
                                        maxBodyLength: Infinity,
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/extra-curricular-activities`,
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
                                             refetch();
                                            setActivity(data => data.filter(value => value.id !== id));
                                            setCheckDelete(false);
                                            setLoader(false);
                                        })
                                        .catch((error) => {
                                            setCheckDelete(false);

                                            if (error.response && error.response.status === 401) {
                                                localStorage.clear();
                                                return navigate('/login');
                                            }
                                            console.log(error);
                                        });

                                }}>
                                    Yes
                                </button>
                                <button className='py-2 px-4 rounded-md bg-[#262847] text-white' onClick={() => {
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
            setLoader(false);
            toast.error(error.message);
        }
    };

    const openCertificate = (certificateUrl) => {
        setCertificateUrl(certificateUrl);
        setShowCertificate(true);
    };

    const closeCertificate = () => {
        setCertificateUrl('');
        setShowCertificate(false);
    };

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}

            {isLoading ? (
                <Loaders className="capitalize" message={checkDelete ? "Deleting Your Activity" : "Fetching Your Activity"} />
            ) : (
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your Activity</h2>
                        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                            <button
                                className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block md:text-xl"
                                onClick={() => navigate('/dmce/add/extra-curriculum')}
                            >
                                <i className="fa-solid fa-plus"></i> Add
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive w-full mt-8 ">
                        {activity.length ? (
                            <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className='text-sm text-center'>AY</th>
                                        <th className='text-sm text-center'>College</th>
                                        <th className='text-sm text-center'>Date</th>
                                        <th className='text-sm text-center'>Domain</th>
                                        <th className='text-sm text-center'>Level</th>
                                        <th className='text-sm text-center'>Location</th>
                                        <th className='text-sm text-center'>Prize</th>
                                        <th className='text-sm text-center'>Year</th>
                                        <th className='text-sm text-center'>Certificate</th>
                                        <th className='text-sm text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.map((item, index) => (
                                        <tr key={index}>
                                            <td className='md:text-center text-sm' data-label="AY">{item.academic_year}</td>
                                            <td className='md:text-center text-sm' data-label="College">{item.college_name}</td>
                                            <td className='md:text-center text-sm' data-label="Date">{formatDate(item.ecc_date)}</td>
                                            <td className='md:text-center text-sm' data-label="Domain">{item.ecc_domain}</td>
                                            <td className='md:text-center text-sm' data-label="Level">{item.ecc_level}</td>
                                            <td className='md:text-center text-sm' data-label="Location">{item.ecc_location}</td>
                                            <td className='md:text-center text-sm' data-label="Prize">{item.prize}</td>
                                            <td className='md:text-center text-sm' data-label="Year">{item.student_year}</td>
                                            <td className='md:text-center text-sm' data-label="Certificate">
                                                <button onClick={() => openCertificate(item.ecc_certificate)} className="certificate">
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                            </td>
                                            <td className='md:text-center text-sm' data-label="Actions">
                                                <div className='flex gap-2 items-center'>
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded" onClick={() => navigate(`/dmce/add/extra-curriculum/${item.id}`)}>
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(item.id)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
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

export default ExtraCurr;
