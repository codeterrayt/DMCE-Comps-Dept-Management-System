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

const HigherStudies = () => {


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

    const navigate = useNavigate();
    const [study, setStudy] = useState([]);
    const [loader, setLoader] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false)


    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
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
                            <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this study detail?</p>
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
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/higher-studies`,
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
                                            setStudy(data => data.filter(value => value.id !== id));
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
        <section className='w-full min-h-screen p-4 md:p-8'>

            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}


            {loader ? (
                <Loaders
                    className="capitalize" message={(checkDelete ? "Deleting " : "Fetching ") + "Your Study Detail"} />
            ) : (
                <AnimationWrapper className='w-full'>
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
                                    <tr className='capitalize'>

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
                                    {study.map((study, rowIndex) => (
                                        <tr key={rowIndex}>

                                            <td className='text-center text-sm'>{study.student_academic_year}</td>

                                            <td className='text-center text-sm'>{study.student_course}</td>
                                            <td className='text-center text-sm'>{study.student_exam_type}</td>
                                            <td className='text-center text-sm'>{study.student_project_guide}</td>
                                            <td className='text-center text-sm'>{study.student_score}</td>
                                            <td className='text-center text-sm'>{study.university_city}</td>
                                            <td className='text-center text-sm'>{study.university_country}</td>
                                            <td className='text-center text-sm'>{study.university_name}</td>
                                            <td className='text-center text-sm'>{study.university_state}</td>
                                            <td className='text-center text-sm'>
                                                <abbr title="Admission Letter">

                                                    <button onClick={() => openCertificate(study.student_admission_letter)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='text-center text-sm'>
                                                <div className='flex items-center gap-2 justify-center'>
                                                    <abbr title="Edit">

                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded mr-2" onClick={() => navigate(`/dmce/add/higher-studies/${study.id}`)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                    </abbr>
                                                    <abbr title="Delete">

                                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(study.id)}><i className="fa-solid fa-trash"></i></button>
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
