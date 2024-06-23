import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkLogin } from '../../helper/checkLogin';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import axios from 'axios';
import Loaders from '../Loaders';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import CertificatePopup from '../Pop';
import { formatDate } from '../../helper/getDate';
import AnimationWrapper from '../Page-Animation';
import AdminNavBar from './AdminNavBar';
import { getFirstErrorMessage } from '../../helper/getErrorMessage';



const HackathonAdmin = () => {
    //pop up 
    const { id } = useParams()
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
    const [hackathon, setHackathon] = useState([]);
    const [loader, setLoader] = useState(false);
    const [user, setUser] = useState()

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }
        console.log(hackathon);
    }, [navigate]);

    useEffect(() => {
        getAllHackathons();
    }, []);
    useEffect(() => {
        if (hackathon.length > 0) {
            // Initialize DataTable after the table has been rendered
            new DataTable('#example');
        }
    }, [hackathon]);


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

        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/student/hackathons?student_id=${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                setUser(response?.data?.data[0])
                const modifiedData = removeUnwantedFields(response.data?.data[0].student_hackathons);
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


    // const handleDelete = (id) => {
    //     try {
    //         const confirmOptions = {
    //             customUI: ({ onClose }) => (
    //                 <Modal open={true} onClose={onClose} center>
    //                     <div>
    //                         <h2 className='font-bold text-xl'>Confirm Deletion</h2>
    //                         <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this hackathon?</p>
    //                         <div className='w-full flex items-center px-4 justify-between'>
    //                             <button className='py-2 px-4 rounded-md  bg-[#262847] text-white' onClick={async () => {
    //                                 onClose();
    //                                 setLoader(true);

    //                                 let data = new FormData();
    //                                 data.append('id', id);

    //                                 const token = getToken();
    //                                 setCheckDelete(true)

    //                                 let config = {
    //                                     method: 'post',
    //                                     maxBodyLength: Infinity,
    //                                     url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/hackathon`,
    //                                     headers: {
    //                                         'Accept': 'application/json',
    //                                         'Authorization': `Bearer ${token}`,
    //                                         ...data.getHeaders
    //                                     },
    //                                     data: data
    //                                 };

    //                                 // Send delete request
    //                                 axios.request(config)
    //                                     .then((response) => {
    //                                         setHackathon(data => data.filter(value => value.id !== id));
    //                                         setCheckDelete(false)

    //                                         setLoader(false)
    //                                     })
    //                                     .catch((error) => {
    //                                         setCheckDelete(false)

    //                                         if (error.response && error.response.status === 401) {
    //                                             localStorage.clear();
    //                                             return navigate('/login');
    //                                         }
    //                                         console.log(error);
    //                                     });

    //                             }}>
    //                                 Yes
    //                             </button>
    //                             <button className='py-2 px-4 rounded-md  bg-[#262847] text-white' onClick={() => {
    //                                 onClose();
    //                                 setLoader(false);
    //                             }}>
    //                                 No
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </Modal>
    //             ),
    //         };

    //         // Display responsive confirmation dialog
    //         confirmAlert(confirmOptions);
    //     } catch (error) {
    //         setCheckDelete(false)

    //         setLoader(false);
    //         toast.error(error.message);
    //     }
    // }

    return (

        <>
        <AdminNavBar/>
        <section className='w-full min-h-screen p-4 md:p-8'>
            {showCertificate && <CertificatePopup certificateUrl={certificateUrl} onClose={closeCertificate} />}

            {loader ? (
                <Loaders
                    className="capitalize" message={(checkDelete ? "Deleting " : "Fetching ") + "Hachathon"} />
            ) : (
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                    <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>{user && user.name}&rsquo;s Hackathons</h2>
{/* 
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/hackathon')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/hackathon')}
                        >
                            Add hackathons
                        </button> */}
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        {
                            hackathon.length ? (
                                <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr className='capitalize'>
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
                                        {hackathon.map(hackathon => (
                                            <tr key={hackathon.id}>
                                                <td className='text-center text-sm'>{hackathon.academic_year}</td>

                                                <td className='text-center text-sm'>{hackathon.hackathon_college_name}</td>
                                                <td className='text-center text-sm whitespace-nowrap'>{formatDate(hackathon.hackathon_from_date)}</td>
                                                <td className='text-center text-sm whitespace-nowrap'>{formatDate(hackathon.hackathon_to_date)}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_level}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_location}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_position}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_prize}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_title}</td>
                                                <td className='text-center text-sm'>{hackathon.student_year}</td>
                                                <td className='text-center text-sm'>
                                                    <abbr title="see certificate">

                                                        <button onClick={() => openCertificate(hackathon.hackathon_certificate)} className="certificate">
                                                            <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                                <td className='text-center text-sm  '>
                                                    <div className='flex items-center gap-2 justify-center'>
                                                        <abbr title="Edit">

                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded mr-2" onClick={() => navigate(`/admin/hackathon/detail/${hackathon.id}`)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                        </abbr>
                                                        {/* <abbr title="Delete">

                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(hackathon.id)}><i className="fa-solid fa-trash"></i></button>
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
            )}
        </section>
        </>
        
    );
};

export default HackathonAdmin;
