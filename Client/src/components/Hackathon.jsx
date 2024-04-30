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


const Hackathon = () => {
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
    const [hackathon, setHackathon] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/dmce/login');
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
                    return navigate('/dmce/login');
                }
                toast.error(error.response.data.message);
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
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/hackathon`,
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
                                            setHackathon(data => data.filter(value => value.id !== id));
                                            setCheckDelete(false)

                                            setLoader(false)
                                        })
                                        .catch((error) => {
                                            setCheckDelete(false)

                                            if (error.response && error.response.status === 401) {
                                                localStorage.clear();
                                                return navigate('/dmce/login');
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
                <Loaders message={(checkDelete ? "deleting " : "loading ") + "your hachathon"}  />
            ) : (
                <div className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your hackathons</h2>
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
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        {
                            hackathon.length ? (
                                <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-sm text-center'>Academic Year</th>
                                            <th className='text-sm text-center'>Hackathon College Name</th>
                                            <th className='text-sm text-center'>Hackathon From Date</th>
                                            <th className='text-sm text-center'>Hackathon To Date</th>
                                            <th className='text-sm text-center'>Hackathon Level</th>
                                            <th className='text-sm text-center'>Hackathon Location</th>
                                            <th className='text-sm text-center'>Hackathon Position</th>
                                            <th className='text-sm text-center'>Hackathon Prize</th>
                                            <th className='text-sm text-center'>Hackathon Title</th>
                                            <th className='text-sm text-center'>Student Year</th>
                                            <th className='text-sm text-center'>Hackathon Certificate</th>
                                            <th className='text-sm text-center'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hackathon.map(hackathon => (
                                            <tr key={hackathon.id}>
                                                <td className='text-center text-sm'>{hackathon.academic_year}</td>
                                               
                                                <td className='text-center text-sm'>{hackathon.hackathon_college_name}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_from_date}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_to_date}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_level}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_location}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_position}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_prize}</td>
                                                <td className='text-center text-sm'>{hackathon.hackathon_title}</td>
                                                <td className='text-center text-sm'>{hackathon.student_year}</td>
                                                <td className='text-center text-sm'>
                                                <button onClick={() => openCertificate(hackathon.hackathon_certificate)} className="certificate">
                                                        View Certificate
                                                    </button>                                                </td>
                                                <td className='text-center text-sm  '>
                                                  <div className='flex items-center gap-2 justify-center'>
                                                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mr-2" onClick={()=>navigate(`/dmce/add/hackathon/${hackathon.id}`)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded" onClick={() => handleDelete(hackathon.id)}><i className="fa-solid fa-trash"></i></button>
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
            )}
        </section>
    );
};

export default Hackathon;
