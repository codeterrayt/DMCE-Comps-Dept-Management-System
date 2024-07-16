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

const Placement = () => {
    const [certificateUrl, setCertificateUrl] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);
    const [checkDelete, setCheckDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }
    }, [navigate]);

    const getAllPlacement = async () => {
        const token = getToken();
        const res = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/student/fetch/placement`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return res.data.placements;
    };

    const { data: placement, isLoading, isError, error, refetch } = useQuery('placements', getAllPlacement, {
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

    useEffect(() => {
        if (placement && placement.length > 0) {
            // Initialize DataTable after the table has been rendered
            const table = new DataTable('#example');
            return () => {
                table.destroy(); // Clean up on component unmount
            };
        }
    }, [placement]);

    const openCertificate = (certificateUrl) => {
        setCertificateUrl(certificateUrl);
        setShowCertificate(true);
    };

    const closeCertificate = () => {
        setCertificateUrl('');
        setShowCertificate(false);
    };

    const handleDelete = (id) => {
        const confirmOptions = {
            customUI: ({ onClose }) => (
                <Modal open={true} onClose={onClose} center>
                    <div>
                        <h2 className='font-bold text-xl'>Confirm Deletion</h2>
                        <p className='my-3 text-[#262847] font-bold'>Are you sure you want to delete this placement?</p>
                        <div className='w-full flex items-center px-4 justify-between'>
                            <button className='py-2 px-4 rounded-md bg-[#262847] text-white' onClick={async () => {
                                onClose();
                                setCheckDelete(true);

                                let data = new FormData();
                                data.append('id', id);

                                const token = getToken();

                                let config = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: `${import.meta.env.VITE_SERVER_DOMAIN}/student/delete/placement`,
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
                                }
                            }}>
                                Yes
                            </button>
                            <button className='py-2 px-4 rounded-md bg-[#262847] text-white' onClick={() => {
                                onClose();
                                setCheckDelete(false);
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
                <Loaders className="capitalize" message={(checkDelete ? "Deleting " : "Fetching ") + "Your Placement"} />
            ) : (
                <AnimationWrapper className='w-full'>
                    <div className='w-full flex items-center justify-between px-4 mt-8'>
                        <h2 className='text-center text-xl md:text-3xl font-bold text-[#262847]'>Your Placement</h2>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/placement')}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button
                            className="bg-[#262847] hover:bg-[#1e4f8f] p-2 px-4 text-white rounded-md w-fit block max-md:hidden md:text-xl"
                            onClick={() => navigate('/dmce/add/placement')}
                        >
                            Add Placement
                        </button>
                    </div>

                    <div className="table-responsive w-full mt-8">
                        {placement && placement.length > 0 ? (
                            <table id="example" className="table table-striped text-black" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className='text-sm text-center'>AY</th>
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
                                            <td className='md:text-center text-sm' data-label="AY">{row.academic_year}</td>
                                            <td className='md:text-center text-sm' data-label="Campus/Off campus">{row.campus_or_off_campus === 0 ? 'Campus' : 'Off Campus'}</td>
                                            <td className='md:text-center text-sm' data-label="City">{row.city}</td>
                                            <td className='md:text-center text-sm' data-label="Company Name">{row.company_name}</td>
                                            <td className='md:text-center text-sm' data-label="Country">{row.country}</td>
                                            <td className='md:text-center text-sm' data-label="Domain">{row.domain}</td>
                                            <td className='md:text-center text-sm' data-label="Package">{row.package} Lac</td>
                                            <td className='md:text-center text-sm' data-label="Passout Year">{row.passout_year}</td>
                                            <td className='md:text-center text-sm' data-label="Pincode">{row.pincode}</td>
                                            <td className='md:text-center text-sm' data-label="Position">{row.position}</td>
                                            <td className='md:text-center text-sm' data-label="State">{row.state}</td>
                                            <td className='md:text-center text-sm' data-label="Offer Letter">
                                                <abbr title="See Offer Letter">
                                                    <button onClick={() => openCertificate(row.offer_letter)} className="certificate">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </abbr>
                                            </td>
                                            <td className='md:text-center text-sm' data-label="Actions">
                                                <div className='flex items-center md:justify-center gap-2'>
                                                    <abbr title="Edit">
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded" onClick={() => navigate(`/dmce/add/placement/${row.id}`)}>
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

export default Placement;
