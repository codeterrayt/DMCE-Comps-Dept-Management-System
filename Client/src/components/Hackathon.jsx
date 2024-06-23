import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../helper/checkLogin';
import { getToken } from '../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loaders from './Loaders';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import CertificatePopup from './Pop';
import { formatDate } from '../helper/getDate';
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';

const Hackathon = () => {
    const [certificateUrl, setCertificateUrl] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false);
    const navigate = useNavigate();
    const [hackathon, setHackathon] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        getAllHackathons();
    }, []);

    function removeUnwantedFields(data) {
        let modifiedData = data.map(item => {
            let modifiedItem = {};
            for (let key in item) {
                modifiedItem[key.replace(/_path$/, '')] = item[key];
            }
            return modifiedItem;
        });
        return modifiedData;
    }

    const getAllHackathons = () => {
        setLoader(true);
        const token = getToken();

        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/hackathon`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                const modifiedData = removeUnwantedFields(response.data.hackathon_participations);
                setHackathon(modifiedData);
                setLoader(false);
            })
            .catch(error => {
                console.error(error);
                setLoader(false);
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/login');
                }
                toast.error(getFirstErrorMessage(error.response.data));
            });
    };

    const handleDelete = (id) => {
        try {
            const confirmOptions = {
                customUI: ({ onClose }) => (
                    <Modal open={true} onClose={onClose} center>
                        <div>
                            <h2 className='font-bold text-xl'>Confirm Deletion</h2>
                            <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this hackathon?</p>
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
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/hackathon`,
                                        headers: {
                                            'Accept': 'application/json',
                                            'Authorization': `Bearer ${token}`,
                                            ...data.getHeaders
                                        },
                                        data: data
                                    };

                                    axios.request(config)
                                        .then(response => {
                                            setHackathon(data => data.filter(value => value.id !== id));
                                            setCheckDelete(false);
                                            setLoader(false);
                                        })
                                        .catch(error => {
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

            confirmAlert(confirmOptions);
        } catch (error) {
            setCheckDelete(false);
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

            {loader ? (
                <Loaders className="capitalize" message={checkDelete ? "Deleting Your Hackathon" : "Fetching Your Hackathon"} />
            ) : (
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your Hackathons</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/hackathon')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/hackathon')}
                        >
                            Add Hackathons
                        </button>
                    </div>

                    <div className="table-responsive w-full mt-8">
                        {hackathon.length ? (
                            <table id="example" className="table table-striped text-black" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className='text-sm text-center'>AY</th>
                                        <th className='text-sm text-center'>College</th>
                                        <th className='text-sm text-center'>From Date</th>
                                        <th className='text-sm text-center'>To Date</th>
                                        <th className='text-sm text-center'>Level</th>
                                        <th className='text-sm text-center'>Location</th>
                                        <th className='text-sm text-center'>Position</th>
                                        <th className='text-sm text-center'>Prize</th>
                                        <th className='text-sm text-center'>Title</th>
                                        <th className='text-sm text-center'>Year</th>
                                        <th className='text-sm text-center'>Certificate</th>
                                        <th className='text-sm text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hackathon.map(item => (
                                        <tr key={item.id}>
                                            <td className='text-center text-sm' data-label="AY">{item.academic_year}</td>
                                            <td className='text-center text-sm' data-label="College">{item.hackathon_college_name}</td>
                                            <td className='text-center text-sm whitespace-nowrap' data-label="From Date">{formatDate(item.hackathon_from_date)}</td>
                                            <td className='text-center text-sm whitespace-nowrap' data-label="To Date">{formatDate(item.hackathon_to_date)}</td>
                                            <td className='text-center text-sm' data-label="Level">{item.hackathon_level}</td>
                                            <td className='text-center text-sm' data-label="Location">{item.hackathon_location}</td>
                                            <td className='text-center text-sm' data-label="Position">{item.hackathon_position}</td>
                                            <td className='text-center text-sm' data-label="Prize">{item.hackathon_prize}</td>
                                            <td className='text-center text-sm' data-label="Title">{item.hackathon_title}</td>
                                            <td className='text-center text-sm' data-label="Year">{item.student_year}</td>
                                            <td className='text-center text-sm' data-label="Certificate">
                                                <button onClick={() => openCertificate(item.hackathon_certificate)} className="certificate">
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                            </td>
                                            <td className='text-center text-sm' data-label="Actions">
                                                <div className='flex items-center gap-2 justify-center'>
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded mr-2" onClick={() => navigate(`/dmce/add/hackathon/${item.id}`)}>
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

export default Hackathon;
