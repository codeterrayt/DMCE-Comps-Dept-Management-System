import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkLogin } from '../../helper/checkLogin';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import Loaders from '../Loaders';
import CertificatePopup from '../Pop';
import { formatDate } from '../../helper/getDate';
import AnimationWrapper from '../Page-Animation';
import AdminNavBar from './AdminNavBar';
import { getFirstErrorMessage } from '../../helper/getErrorMessage';

const InternshipAdmin = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loader, setLoader] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false)
    const [user, setUser] = useState()

    const { id } = useParams()


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
            url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/student/internship?student_id=${id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        axios.request(config)
            .then((response) => {
                setUser(response?.data?.data[0])

                const data = removeUnwantedFields(response?.data?.data[0]?.student_internship)
                setInternships(data);
                setLoader(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.clear();
                    return navigate('/login');
                }
                setLoader(false);
                console.log(error);
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
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/internship`,
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
                                            setInternships(prevInternships => prevInternships.filter(internship => internship.id !== id));
                                            setCheckDelete(false)

                                            setLoader(false)
                                        })
                                        .catch((error) => {
                                            if (error.response && error.response.status === 401) {
                                                localStorage.clear();
                                                return navigate('/login');
                                            }
                                            setLoader(false)
                                            console.log(error);
                                            return toast.error(getFirstErrorMessage(error.response.data));
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
            setLoader(false);
            toast.error(error.message);
        }
    }



    return (
        <>
        <AdminNavBar/>
        <section className='w-full  min-h-screen p-4 md:p-8 '>
            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}

            {loader ? <Loaders message={checkDelete ? "Wait , Deleting Your Internship" : "Fetching Your Internships"} /> :
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>{user && user.name}&rsquo;s Internships</h2>
                        {/* <button
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
                        </button> */}
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        {
                            internships.length ? (
                                <table id="example" className="table table-striped text-black" style={{ width: '100%' }}>
                                    <thead>
                                        <tr className='c capitalize'>
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
                                                <td className='text-center text-sm'>{internship.academic_year}</td>

                                                <td className='text-center text-sm'>{internship.domain}</td>
                                                <td className='text-center text-sm'>{internship.company_name}</td>
                                                <td className='text-center text-sm'>{internship.duration}</td>
                                                <td className='text-center text-sm whitespace-nowrap'>{formatDate(internship.start_date)}</td>
                                                <td className='text-center text-sm whitespace-nowrap'>{formatDate(internship.end_date)}</td>
                                                <td className='text-center text-sm'>{internship.student_year}</td>
                                                <td className='text-center text-sm'>
                                                    <abbr title="See Certificate">
                                                        <button onClick={() => openCertificate(internship.certificate)} className="certificate">
                                                            <i className="fa-solid fa-eye"></i>

                                                        </button>
                                                    </abbr>
                                                </td>
                                                <td className='text-center text-sm'>
                                                    <abbr title="See Completion Letter">
                                                        <button onClick={() => openCertificate(internship.completion_letter)} className="certificate">
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                                <td className='text-center text-sm'>
                                                    <abbr title="See Offer Letter">
                                                        <button onClick={() => openCertificate(internship.offer_letter)} className="certificate">
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                                <td className='text-center text-sm'>
                                                    <abbr title="See Permission Letter">
                                                        <button onClick={() => openCertificate(internship.permission_letter)} className="certificate">
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    </abbr>
                                                </td>

                                                <td className='text-center text-sm '>
                                                    <div className='flex items-center gap-3 justify-center'>
                                                        <abbr title="Edit">
                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded " onClick={() => navigate(`/admin/internship/detail/${internship.id}`)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                        </abbr>
                                                        {/* <abbr title="Delete">

                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(internship.id)}><i className="fa-solid fa-trash"></i></button>
                                                        </abbr> */}
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
        </>
       
    );
};

export default InternshipAdmin;
