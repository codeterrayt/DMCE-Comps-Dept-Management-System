import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import { checkLogin } from '../../helper/checkLogin';
import { getFirstErrorMessage } from '../../helper/getErrorMessage';
import Loaders from '../Loaders';

const AssignSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [batches, setBatches] = useState([]);
    const [subBatches, setSubBatches] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [addloading, setAddLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [professors, setProfessors] = useState([]);
    const [id, setId] = useState("");
    const [editmode, setEditMode] = useState([]);
    const [formData, setFormData] = useState({
        user_id: '',
        subject_id: '',
        batch: '',
        pr_th: null,
    
        sub_batch: "",
    });
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check login status before fetching data
        if (!checkLogin()) {
            navigate('/login');
        } else {
            fetchAllData();
        }
    }, []);

    const handleEdit = async (data) => {
        setFormData(data);
        setOpenModal(true);
        setId(data.id)
        setEditMode(true)
     



    }

    const fetchAllData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchInitialData(),
                fetchSubjects(),
                fetchBatches(),
                fetchSubBatches(),
                fetchProfessors(),
            ]);
            setLoading(false);
            toast.success("All data fetched successfully");
        } catch (error) {
            if (error.response.status == 401) {
                setLoading(false);
                localStorage.clear()     
                 navigate('/login') 
                 return toast.error("unauthenticated");
              }
            setLoading(false);
            toast.error("Failed to fetch data");
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'radio') {
            // For radio buttons, value should be converted to integer
            setFormData((prevData) => ({
                ...prevData,
                [name]: parseInt(value),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };


    const fetchProfessors = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/professors`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfessors(response.data);
        } catch (error) {
            console.error('Error fetching professors:', error);
            toast.error(error.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/subjects`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            toast.error(error.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/batches`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setBatches(response.data);
        } catch (error) {
            console.error('Error fetching batches:', error);
            toast.error(error.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubBatches = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/sub_batches`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setSubBatches(response.data);
        } catch (error) {
            console.error('Error fetching sub-batches:', error);
            toast.error(error.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/assigned-subjects`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setInitialData(response.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error(error.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { user_id, subject_id, batch, pr_th,  sub_batch } = formData;
        if (!user_id) {
            toast.error("Please select a professor");
            return;
        }
        if (!subject_id) {
            toast.error("Please select a subject");
            return;
        }
        if (!batch) {
            toast.error("Please select a batch");
            return;
        }
        if (pr_th === null) {
            toast.error("Please select Theory or Practical");
            return;
        }
     
        if (pr_th === 0 && !sub_batch) {
            toast.error("Please select a sub batch for practical subjects");
            return;
        }
        const queryParams = new URLSearchParams({
            user_id,
            subject_id,
            batch,
            pr_th,
  
            sub_batch
        }).toString();
        setAddLoading(true)



        if (id) {
            try {
                const url = `${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/assigned-subject/${id}?${queryParams}`;

                setLoading(true);
                const token = getToken();
                await axios.post(url, {}, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFormData({
                    user_id: '',
                    subject_id: '',
                    batch: '',
                    pr_th: null,
                
                    sub_batch: "",
                });
                setOpenModal(false);
                await fetchInitialData();
                setAddLoading(false)

                toast.success("Subject assigned successfully");
            } catch (error) {
                setAddLoading(false)
                console.error('Error adding subject:', error);
                return toast.error(getFirstErrorMessage(error.response?.data || error.message));
            } finally {
                setLoading(false);
            }

        } else {
            try {
                const url = `${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/assigned-subject?${queryParams}`;

                setLoading(true);
                const token = getToken();
                await axios.post(url, {}, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFormData({
                    user_id: '',
                    subject_id: '',
                    batch: '',
                    pr_th: null,
            
                    sub_batch: "",
                });
                setOpenModal(false);
                await fetchInitialData();
                setAddLoading(false)

                toast.success("Subject assigned successfully");
            } catch (error) {
                setAddLoading(false)
                console.error('Error adding subject:', error);
                return toast.error(getFirstErrorMessage(error.response?.data || error.message));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = getToken();
            await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/delete/assigned-subject/${id}`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            await fetchInitialData();
        } catch (error) {
            console.error('Error deleting subject:', error);
            toast.error(getFirstErrorMessage(error.response?.data));
        }
    };

    return (
        <>
            <AdminNavBar />
            <div className="bg-gray-100 flex justify-center min-h-screen h-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className="text-2xl font-bold">Assigned Subject List</h2>
                        <button
                            type="button"
                            className="bg-[#262847] text-white py-2 px-4 rounded "
                            onClick={() => setOpenModal(true)}
                        >
                            Assign Subject
                        </button>
                    </div>
                    {loading ? (
                        <Loaders message={"Loading..."} />
                    ) : (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4">Professor</th>

                                    <th className="py-2 px-4">Subject Name</th>
                            
                                    <th className="py-2 px-4">Batch</th>
                                    <th className="py-2 px-4">Sub Batch</th>
                                    <th className="py-2 px-4">PR/TH</th>
                                    <th className="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!initialData.length ? <h1 className='text-xl mt-8 text-[#262847] font-bold w-fit mx-auto'>No data found</h1> : initialData.map((data, index) => (
                                    <tr key={index} className="text-center border-b">
                                        <td className="py-2 px-4">{data.user.name}</td>
                                        <td className="py-2 px-4">{data.subject.subject_short}</td>
                               
                                        <td className="py-2 px-4">{data.batch}</td>
                                        <td className="py-2 px-4">{data.sub_batch || '-'}</td>
                                        <td className="py-2 px-4">{data.pr_th === 1 ? 'Theory' : 'Practical'}</td>
                                        <td className="py-2 px-4">
                                            <button onClick={() => handleEdit(data)} className="text-blue-500 hover:text-blue-700 mr-2">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(data.id)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Modal open={openModal} onClose={() => setOpenModal(false)} center>
                <form onSubmit={handleSubmit} className="p-8 px-16">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="user_id">
                            Professor
                        </label>
                        <select
                            id="user_id"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option disabled value="">
                                Select Professor
                            </option>
                  
                            {professors.map((professor) => (
                                <option key={professor.user.id} value={professor.user.id}>
                                    {professor.user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="subject_id">
                            Subject
                        </label>
                        <select
                            id="subject_id"
                            name="subject_id"
                            value={formData.subject_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option disabled value="">
                                Select Subject
                            </option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.subject_name}
                                </option>
                            ))}
                        </select>
                    </div>
                
                        <div className=" mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="batch">
                                Batch
                            </label>
                            <select
                                id="batch"
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            >
                                <option disabled value="">
                                    Select Batch
                                </option>
                                {batches.map((batch) => (
                                    <option key={batch.id} value={batch.batch}>
                                        {batch.batch}
                                    </option>
                                ))}
                            </select>
               
                       
                      
                    </div>
                   
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Theory / Practical</label>
                        <div className="flex">
                            <label className="flex items-center mr-4">
                                <input
                                    type="radio"
                                    name="pr_th"
                                    value={1}
                                    checked={formData.pr_th === 1}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Theory
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="pr_th"
                                    value={0}
                                    checked={formData.pr_th === 0}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Practical
                            </label>
                        </div>
                    </div>

                    {formData.pr_th === 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="sub_batch">
                                Select Sub Batch
                            </label>
                            <select
                                id="sub_batch"
                                name="sub_batch"
                                value={formData.sub_batch}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            >
                                <option disabled value="">
                                    Select Sub Batch
                                </option>
                                {subBatches.map((sub_batch) => (
                                    <option key={sub_batch.id} value={sub_batch.sub_batch}>
                                        {sub_batch.sub_batch}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        {addloading ? "Loading..." : "Assign"}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default AssignSubject;
