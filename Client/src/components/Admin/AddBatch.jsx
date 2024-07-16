import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getToken } from '../../helper/getToken';
import Loaders from '../Loaders';
import { checkLogin } from '../../helper/checkLogin';

const AddBatch = () => {
    const [batches, setBatches] = useState([]);
    const [subBatches, setSubBatches] = useState([]);
    const [formData, setFormData] = useState({ batch: '' });
    const [subupdateFormData, setSubupdateFormData] = useState({ batchId: '', subBatch: '' });
    const [subFormData, setSubFormData] = useState({ subBatch: '' });
    const [openModal, setOpenModal] = useState(false); // State for controlling batch modal open/close
    const [openSubModal, setOpenSubModal] = useState(false); // State for controlling sub-batch modal open/close
    const [error, setError] = useState(''); // State for error message
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [AddSubId, setAddSubId] = useState(false); // State for loading indicator
    const [updateId, setUpdateId] = useState(null); // State to track batch ID for update
    const [updateSubId, setUpdateSubId] = useState(null); // State to track sub-batch ID for update
    const [track, setTrack] = useState(false); // State to track sub-batch ID for update
    const [loading, setLoading] = useState(false)
    const [addloading, setAddLoading] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }

        fetchBatches();
        fetchSubBatches()
    }, []);

    // ${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/sub_batches
    // ${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/sub_batches

    const fetchBatches = async () => {
        setLoading(true)
        try {
            const token = getToken();
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/batches`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.request(config);
            setBatches(response.data);
            setLoading(false)
            toast.success('Batches fetched successfully');
        } catch (error) {
            setLoading(false)
            console.error(error);
            toast.error('Failed to fetch batches');
        }
    };

    const fetchSubBatches = async (batchId) => {
        setLoading(true)
        try {
            const token = getToken();
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/sub_batches`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.request(config);
            setSubBatches(response.data);
            setLoading(false)
            toast.success('Sub-batches fetched successfully');
        } catch (error) {
            setLoading(false)
            console.error(error);
            toast.error('Failed to fetch sub-batches');
        }
    };






    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ [name]: value.toUpperCase().slice(0, 1) }); // Ensure only one character and uppercase
        setError(''); // Clear error message when input changes
    };

    const handleSubChange = (e) => {
        const { name, value } = e.target;
        setSubFormData({ ...subFormData, [name]: value.toUpperCase() }); // Update sub-batch form data
        setError(''); // Clear error message when input changes
    };


    //batch submit
    const handleSubmit = async (e) => {

        setAddLoading(true)
        e.preventDefault();

        if (!formData.batch) {
            return setError('Please enter the batch first');
        }

        if (formData.batch.length > 1) {
            return setError('Batch can have only one character');
        }

        const token = getToken();

        try {
            setIsLoading(true); // Start loading indicator

            if (updateId) {
                // If updateId is set, perform update instead of add
                await handleUpdate();
            } else {
                // Otherwise, perform add
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/batch?batch=${formData.batch}`,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };

                await axios.request(config);
                fetchBatches(); // Refresh the batch list after adding
                setFormData({ batch: '' });
                setOpenModal(false); // Close the batch modal after submittings
                setAddLoading(false)

                toast.success('Batch added successfully');
            }
        } catch (error) {
            setAddLoading(false)
            console.error(error);
            setError(error.response.data.message)
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };

    // bat handle
    const handleUpdate = async () => {
        try {

            if (!formData.batch) {
                return setError('Please enter the batch first');
            }

            if (formData.batch.length > 1) {
                return setError('Batch can have only one character');
            }
            setAddLoading(true)

            const token = getToken();
            const config = {
                method: 'post', // Adjust method as per your API endpoint (could be PUT or PATCH depending on your backend API)
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/batch/${updateId}?batch=${formData.batch}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.request(config);
            setFormData({ batch: '' });
            setOpenModal(false); // Close the batch modal after updating
            fetchBatches(); // Refresh the batch list after updating
            setUpdateId(null); // Clear updateId after updating
            setAddLoading(false)

            toast.success('Batch updated successfully');
        } catch (error) {
            setAddLoading(false)
            console.error(error);
            return toast.error(error.response.data.message)
            setError(error.response.data.message)
            // toast.error(error.request)
        }
    };

    const handleDelete = async (batchId) => {
        try {
            const loading = toast.loading('Deleting batch...');
            const token = getToken();
            const config = {
                method: 'post', // Adjust method as per your API endpoint (could be DELETE depending on your backend API)
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/delete/batch/${batchId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.request(config);
            fetchBatches(); // Refresh the batch list after deleting
            toast.dismiss(loading);
            toast.success('Batch deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete batch');
        }
    };

    const openUpdateModal = (batch) => {
        setError("")

        setUpdateId(batch.id); // Set the batch ID to update
        setFormData({ batch: batch.batch }); // Prefill the batch form with the current batch value
        setOpenModal(true); // Open the batch modal for update
    };


    const openSubBatchModal = (subbatch) => {
        setError("")
        setUpdateSubId(subbatch.id)
        setSubFormData({ subBatch: subbatch.sub_batch }); // Set the batch ID for the sub-batch form
        setOpenSubModal(true); // Open the sub-batch modal for add
    };
    const openSubBatchModal2 = (batch) => {
        setError("")
        setAddSubId(batch.id)
        setSubupdateFormData({ batchId: batch.id, subBatch: batch.batch_id })
        setOpenSubModal(true); // Open the sub-batch modal for add
    };

    const handleSubSubmit = async (e) => {
        e.preventDefault();
        setAddLoading(true)
        const { subBatch } = subFormData;
        const { batchId } = subupdateFormData;

        if (!subBatch) {
            return setError('Please enter the sub-batch');
        }

        const token = getToken();

        try {
            setIsLoading(true); // Start loading indicator

            if (updateSubId) {
                // If updateSubId is set, perform update instead of add
                await handleSubUpdate();
            } else {

                // Otherwise, perform add
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/sub_batch?batch_id=${batchId}&sub_batch=${subBatch}`,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };

                await axios.request(config);
                fetchSubBatches(batchId); // Refresh the sub-batch list after adding
                setSubFormData({ batchId, subBatch: '' });
                setOpenSubModal(false); // Close the sub-batch modal after submitting
                toast.success('Sub-batch added successfully');
                setAddLoading(false)
            }
        } catch (error) {
            console.error(error);
            setAddLoading(false)
            setError(error.response.data.message)
        } finally {
            setIsLoading(false); // Stop loading indicator
        }
    };


    // ${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/sub-batch?batch_id=7&sub_batch=A1
    // ${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/sub_batch?batch_id=3&sub_batch=B1

    const handleSubUpdate = async () => {
        setAddLoading(true)

        try {
            const { subBatch } = subFormData;
            const { batchId } = subupdateFormData;


            const token = getToken();
            const config = {
                method: 'post', // Adjust method as per your API endpoint (could be PUT or PATCH depending on your backend API)
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/sub_batch/${updateSubId}?batch_id=${batchId}&sub_batch=${subBatch}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            };

            await axios.request(config);
            fetchSubBatches(batchId); // Refresh the sub-batch list after updating
            setSubFormData({ subBatch: "" }); // Set the batch ID for the sub-batch form
            setOpenSubModal(false); // Close the sub-batch modal after updating
            setUpdateSubId(null); // Clear updateSubId after updating

            setAddLoading(false)

            toast.success('Sub-batch updated successfully');
        } catch (error) {
            setAddLoading(false)
            console.error(error);
            setError(error?.response?.data?.message)
        }
    };

    const handleSubDelete = async (subBatchId, batchId) => {
        console.log(subBatchId, " ", batchId);

        const loading = toast.loading('Deleting sub-batch...');
        try {
            const token = getToken();
            const config = {
                method: 'post', // Adjust method as per your API endpoint (could be DELETE depending on your backend API)
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/delete/sub_batch/${subBatchId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.request(config);
            fetchSubBatches(batchId); // Refresh the sub-batch list after deleting
            toast.dismiss(loading);
            return toast.success('Sub-batch deleted successfully');
        } catch (error) {
            toast.dismiss(loading);
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to delete sub-batch');

        }
    };

    return (
        <div className=' w-full bg-gray-200 min-h-screen h-auto'>
            <AdminNavBar />
            <div className="container mx-auto p-4 max-w-6xl bg-white rounded-md m-4">

                <div className="flex justify-between items-center ">
                    <h1 className="text-3xl font-semibold mb-4">Manage Batches</h1>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-[#262847] text-white font-bold py-2 px-4 rounded"
                    >
                        Add Batch
                    </button>
                </div>

                <Modal open={openModal} onClose={() => {
                    setUpdateId("")
                    setFormData({ batch: "" })
                    setOpenModal(false)
                }
                }
                >
                    <div className="w-full max-w-lg mx-auto p-4">
                        <h2 className="text-2xl font-semibold mb-4">Add Batch</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Batch</label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={formData.batch}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter Batch"
                                    maxLength="1"

                                />
                            </div>



                            <div className='flex items-center justify-center'>
                                <button
                                    className="bg-[#262847] mx-auto w-fit text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    {addloading ? "Loading..." : updateId ? 'Update' : 'Add'}
                                </button>

                            </div>


                        </form>
                    </div>
                </Modal>

                {
                    loading ? <Loaders message={"Loading"} />
                        :
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse  ">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border  border-gray-800 px-4 py-2 text-center">Batch</th>
                                        <th className="border border-gray-800 px-4 py-2 text-left">Sub Batches</th>
                                        <th className="border border-gray-800 px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {!subBatches.length && !batches.length ? <h1 className='text-xl mt-8 text-[#262847] font-bold w-fit mx-auto'>No data found</h1> : batches.map((batch) => (
                                        <tr key={batch.id}>
                                            <td className="border text-center border-gray-800 px-4 py-2">{batch.batch}</td>
                                            <td className="border text-center border-gray-800 px-4 py-2">
                                                {subBatches.length > 0 ? (
                                                    <div className="flex gap-4 text-center">
                                                        {subBatches
                                                            .filter((subBatch) => subBatch.batch_id === batch.id)
                                                            .map((subBatch) => (
                                                                <div key={subBatch.id} className="flex flex-col items-center justify-center gap-2 bg-slate-200 p-2 rounded-md">
                                                                    <span className="bg-gray-200 text-gray-700 px-3 py-1 text-sm font-semibold rounded-full">
                                                                        {subBatch.sub_batch}
                                                                    </span>
                                                                    <div className="space-x-2">
                                                                        <button
                                                                            onClick={() => openSubBatchModal(subBatch)}
                                                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                                        >
                                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSubDelete(subBatch.id, batch.id)}
                                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                                        >
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-600">No sub-batches created</span>
                                                )}
                                            </td>

                                            <td className="border border-gray-800 px-4 py-2">
                                                <button
                                                    onClick={() => openUpdateModal(batch)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                >
                                                    Edit Batch
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(batch.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                >
                                                    Delete Batch
                                                </button>
                                                <button
                                                    onClick={() => openSubBatchModal2(batch)}
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                                >
                                                    Add Sub-Batches
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                }

                {/* Sub-batch Modal */}
                <Modal open={openSubModal} onClose={
                    () => {
                        setSubFormData({ subBatch: "" });
                        setUpdateSubId("")
                        setAddSubId("")
                        setOpenSubModal(false)
                    }
                }
                >
                    <div className="w-full max-w-lg mx-auto p-4">
                        <h2 className="text-2xl font-semibold mb-4">{updateSubId ? "Update " : "Add "}Sub-Batches</h2>
                        <form onSubmit={handleSubSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Sub-Batch</label>
                                <input
                                    type="text"
                                    name="subBatch"
                                    value={subFormData.subBatch}
                                    onChange={handleSubChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter Sub-Batch"
                                    required
                                />
                                <input type="hidden" name="batchId" value={subFormData.batchId} />
                            </div>


                            <div className='flex items-center justify-center'>

                                <button
                                    className="bg-[#262847] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    {addloading ? "Loading..." : updateSubId ? 'Update' : 'Add'}
                                </button>
                            </div>


                        </form>
                    </div>
                </Modal>


            </div>

        </div>
    );
};

export default AddBatch;
