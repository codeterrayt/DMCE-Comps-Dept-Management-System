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

const Internship = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loader, setLoader] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false);

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
            return navigate('/login');
        }
    }, []);

    useEffect(() => {
        getAllInternships();
    }, []);

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
                const data = removeUnwantedFields(response.data.internships);
                setInternships(data);
                setLoader(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/login');
                }
                setLoader(false);
                return toast.error(getFirstErrorMessage(error.response.data));
            });
    };

    const handleDelete = (id) => {
        try {
            const confirmOptions = {
                customUI: ({ onClose }) => (
                    <Modal classNames={"rounded-md"} open={true} onClose={onClose} center>
                        <div className='rounded-md'>
                            <h2 className='font-bold text-xl'>Confirm Deletion</h2>
                            <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this internship?</p>
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
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/internship`,
                                        headers: {
                                            'Accept': 'application/json',
                                            'Authorization': `Bearer ${token}`,
                                            ...data.getHeaders,
                                        },
                                        data: data,
                                    };

                                    // Send delete request
                                    axios.request(config)
                                        .then((response) => {
                                            setInternships(prevInternships => prevInternships.filter(internship => internship.id !== id));
                                            setCheckDelete(false);
                                            setLoader(false);
                                        })
                                        .catch((error) => {
                                            if (error.response && error.response.status === 401) {
                                                localStorage.clear();
                                                return navigate('/login');
                                            }
                                            return toast.error(getFirstErrorMessage(error.response.data));
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

    return (
        <section className='w-full min-h-screen p-3 md:p-8'>
            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}

            {loader ? <Loaders message={checkDelete ? "Wait, Deleting Your Internship" : "Fetching Your Internships"} /> :
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8'>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847]'>Your Internships</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/internship')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/internship')}
                        >
                            Add Internship
                        </button>
                    </div>

                    <div className="table-responsive w-full mt-8">
                        {internships.length ? (
                            <table id="example" className="table table-striped text-black" style={{ width: '100%' }}>
                                <thead>
                                    <tr className='capitalize'>
                                        <th className='text-sm text-center'>AY</th>
                                        <th className='text-sm text-center'>Domain</th>
                                        <th className='text-sm text-center'>Company Name</th>
                                        <th className='text-sm text-center'>Duration in months</th>
                                        <th className='text-sm text-center'>Start</th>
                                        <th className='text-sm text-center'>End</th>
                                        <th className='text-sm text-center'>Year</th>
                                        <th className='text-sm text-center'>Certificate</th>
                                        <th className='text-sm text-center'>Completion Letter</th>
                                        <th className='text-sm text-center'>Offer Letter</th>
                                        <th className='text-sm text-center'>Permission Letter</th>
                                        <th className='text-sm text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {internships.map(internship => (
                                        <tr key={internship.id}>
                                            <td className='text-center text-sm' data-label="AY">{internship.academic_year}</td>
                                            <td className='text-center text-sm' data-label="Domain">{internship.domain}</td>
                                            <td className='text-center text-sm' data-label="Company Name">{internship.company_name}</td>
                                            <td className='text-center text-sm' data-label="Duration in months">{internship.duration}</td>
                                            <td className='text-center text-sm' data-label="Start">{formatDate(internship.start_date)}</td>
                                            <td className='text-center text-sm' data-label="End">{formatDate(internship.end_date)}</td>
                                            <td className='text-center text-sm' data-label="Year">{internship.student_year}</td>
                                            <td className='text-center text-sm' data-label="Certificate">
                                                <abbr title="See Certificate">
                                                    <button onClick={() => openCertificate(internship.certificate)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='text-center text-sm' data-label="Completion Letter">
                                                <abbr title="See Completion Letter">
                                                    <button onClick={() => openCertificate(internship.completion_letter)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='text-center text-sm' data-label="Offer Letter">
                                                <abbr title="See Offer Letter">
                                                    <button onClick={() => openCertificate(internship.offer_letter)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='text-center text-sm' data-label="Permission Letter">
                                                <abbr title="See Permission Letter">
                                                    <button onClick={() => openCertificate(internship.permission_letter)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='text-center text-sm' data-label="Actions">
                                                <div className='flex items-center gap-3 justify-center'>
                                                    <abbr title="Edit">
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded" onClick={() => navigate(`/dmce/add/internship/${internship.id}`)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                    </abbr>
                                                    <abbr title="Delete">
                                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(internship.id)}><i className="fa-solid fa-trash"></i></button>
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
            }
        </section>
    );
};

export default Internship;
