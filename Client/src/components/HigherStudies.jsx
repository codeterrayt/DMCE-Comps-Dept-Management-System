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
import AnimationWrapper from './Page-Animation';
import { getFirstErrorMessage } from '../helper/getErrorMessage';
import { useQuery } from 'react-query';
// import DataTable from 'datatables.net';

const HigherStudies = () => {
    const [certificateUrl, setCertificateUrl] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);
    const [loader, setLoader] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }
    }, [navigate]);

    const openCertificate = (certificateUrl) => {
        setCertificateUrl(certificateUrl);
        setShowCertificate(true);
    };

    const closeCertificate = () => {
        setCertificateUrl('');
        setShowCertificate(false);
    };

    const getAllHackathons = async () => {
        setLoader(true);
        const token = getToken();

        const res = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/higher-studies`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        return res.data.higher_studies;
    };

    const { data: study, isLoading, isError, error, refetch } = useQuery('study', getAllHackathons, {
        retry: 1, 
        onError: (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            } else {
                toast.error(getFirstErrorMessage(error.response?.data || error.message));
            }
        },
    });

    // useEffect(() => {
    //     if (study && study.length > 0) {
    //         const table = new DataTable('#example');
    //         return () => {
    //             table.destroy();
    //         };
    //     }
    // }, [study]);

    const handleDelete = (id) => {
        const confirmOptions = {
            customUI: ({ onClose }) => (
                <Modal open={true} onClose={onClose} center>
                    <div>
                        <h2 className='font-bold text-xl'>Confirm Deletion</h2>
                        <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this study detail?</p>
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
                                    url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/higher-studies`,
                                    headers: {
                                        'Accept': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                    data: data
                                };

                                try {
                                    await axios.request(config);
                                    refetch();
                                } catch (error) {
                                    if (error.response && error.response.status === 401) {
                                        localStorage.clear();
                                        navigate('/login');
                                    } else {
                                        toast.error(getFirstErrorMessage(error.response?.data || error.message));
                                    }
                                } finally {
                                    setCheckDelete(false);
                                    setLoader(false);
                                }
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
    };

    return (
        <section className='w-full min-h-screen p-4 md:p-8'>
            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}

            {isLoading ? (
                <Loaders className="capitalize" message={(checkDelete ? "Deleting " : "Fetching ") + "Your Study Detail"} />
            ) : (
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8'>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847]'>Higher Study</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/higher-studies')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/higher-studies')}
                        >
                            Add Higher Study
                        </button>
                    </div>

                    <div className="table-responsive w-full mt-8">
                        {study && study.length > 0 ? (
                            <table id="example" className="table table-striped text-black" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className='text-sm text-center'>AY</th>
                                        <th className='text-sm text-center'>Course</th>
                                        <th className='text-sm text-center'>Exam Type</th>
                                        <th className='text-sm text-center'>Project Guide</th>
                                        <th className='text-sm text-center'>Score</th>
                                        <th className='text-sm text-center'>City</th>
                                        <th className='text-sm text-center'>Country</th>
                                        <th className='text-sm text-center'>University</th>
                                        <th className='text-sm text-center'>State</th>
                                        <th className='text-sm text-center'>Admission Letter</th>
                                        <th className='text-sm text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {study.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td className='md:text-center text-sm' data-label="AY">{row.student_academic_year}</td>
                                            <td className='md:text-center text-sm' data-label="Course">{row.student_course}</td>
                                            <td className='md:text-center text-sm' data-label="Exam">{row.student_exam_type}</td>
                                            <td className='md:text-center text-sm' data-label="Project">{row.student_project_guide}</td>
                                            <td className='md:text-center text-sm' data-label="Score">{row.student_score}</td>
                                            <td className='md:text-center text-sm' data-label="City">{row.university_city}</td>
                                            <td className='md:text-center text-sm' data-label="Country">{row.university_country}</td>
                                            <td className='md:text-center text-sm' data-label="University">{row.university_name}</td>
                                            <td className='md:text-center text-sm' data-label="State">{row.university_state}</td>
                                            <td className='md:text-center text-sm' data-label="Admission">
                                                <abbr title="Admission Letter">
                                                    <button onClick={() => openCertificate(row.student_admission_letter)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='md:text-center text-sm' data-label="Actions">
                                                <div className='flex items-center gap-2 md:justify-center'>
                                                    <abbr title="Edit">
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded" onClick={() => navigate(`/dmce/add/higher-studies/${row.id}`)}>
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                    </abbr>
                                                    <abbr title="Delete">
                                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(row.id)}>
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
                        )}
                    </div>
                </AnimationWrapper>
            )}
        </section>
    );
};

export default HigherStudies;
