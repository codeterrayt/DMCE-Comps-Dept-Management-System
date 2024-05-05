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

const Placement = () => {
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
    const [placement, setPlacement] = useState([]);
    const [loader, setLoader] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false)


    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/dmce/login');
        }

        console.log(placement);
    }, [navigate]);

    useEffect(() => {
        getAllPlacement();
    }, []);
    useEffect(() => {
        if (placement.length > 0) {
            // Initialize DataTable after the table has been rendered
            new DataTable('#example');
        }
    }, [placement]);


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

    const getAllPlacement = () => {
        setLoader(true);
        const token = getToken();

        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/placement`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                const modifiedData = removeUnwantedFields(response.data.placements);
                setPlacement(modifiedData);
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
                            <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this placement?</p>
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
                                        url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/placement`,
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
                                            setPlacement(data => data.filter(value => value.id !== id));
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
                <Loaders
                    className="capitalize" message={(checkDelete ? "Deleting " : "Fetching ") + "Your Placement"} />
            ) : (
                <div className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8 '>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847] '>Your Placement</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/placement')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit  block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/placement')}
                        >
                            Add Placement
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full mt-8 ">
                        {
                            placement.length ?
                                <table id="example" className="table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-sm text-center'>Academic Year</th>
                                            <th className='text-sm text-center'>Campus/Off Campus</th>
                                            <th className='text-sm text-center'>City</th>
                                            <th className='text-sm text-center'>Company Name</th>
                                            <th className='text-sm text-center'>Country</th>
                                            <th className='text-sm text-center'>Domain</th>
                                            <th className='text-sm text-center'>Package</th>
                                            <th className='text-sm text-center'>Passout Year</th>
                                            <th className='text-sm text-center'>Pincode</th>
                                            <th className='text-sm text-center'>Position</th>
                                            <th className='text-sm text-center'>State</th>
                                            <th className='text-sm text-center'>Offer Letter</th>
                                            <th className='text-sm text-center'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {placement.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td className='text-center text-sm'>{row.academic_year}</td>
                                                <td className='text-center text-sm'>{row.campus_or_off_campus === 1 ? 'Campus' : 'Off Campus'}</td>
                                                <td className='text-center text-sm'>{row.city}</td>
                                                <td className='text-center text-sm'>{row.company_name}</td>
                                                <td className='text-center text-sm'>{row.country}</td>
                                                <td className='text-center text-sm'>{row.domain}</td>
                                                <td className='text-center text-sm'>{row.package} Lac</td>
                                                <td className='text-center text-sm'>{row.passout_year}</td>
                                                <td className='text-center text-sm'>{row.pincode}</td>
                                                <td className='text-center text-sm'>{row.position}</td>
                                                <td className='text-center text-sm'>{row.state}</td>
                                                <td className='text-center text-sm'>
                                                    <abbr title="see offer letter">

                                                        <button onClick={() => openCertificate(row.offer_letter)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                                <td className='text-center text-sm'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <abbr title="Edit">

                                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded" onClick={() => navigate(`/dmce/add/placement/${row.id}`)}><i className="fa-solid fa-pen-to-square"></i></button>
                                                        </abbr>
                                                        <abbr title="Delete">

                                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(row.id)}><i className="fa-solid fa-trash"></i></button>
                                                        </abbr>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                : <h1 className='text-xl md:text-2xl mt-3 text-center font-bold text-[#262847]'>No Data Available</h1>
                        }
                    </div>
                </div>
            )}
        </section>
    );
};

export default Placement;
