import React, { useState, useEffect } from 'react';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getToken } from '../../helper/getToken';
import AdminNavBar from './AdminNavBar';
import Loaders from '../Loaders';

const ManageSubBatches = () => {
    const [subBatches, setSubBatches] = useState([]);
    const [formData, setFormData] = useState({ subBatch: '' });
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        fetchSubBatches(); // Fetch sub-batches when the component mounts
    }, []);

    const fetchSubBatches = async () => {
        try {
            const token = getToken();
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:8000/api/admin/fetch/sub_batches`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.request(config);
            console.log(response.data);
            setSubBatches(response.data);
            toast.success('Sub-batches fetched successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch sub-batches');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value.toUpperCase().slice(0, 2) }); // Limit to two characters and uppercase
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subBatch) {
            return toast.error('Please enter the sub-batch');
        }

        const token = getToken();

        try {
            setIsLoading(true);

            if (updateId) {
                await handleUpdate();
            } else {
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `http://127.0.0.1:8000/api/admin/add/sub_batch?batch_id=${subBatches[0].batch_id}&sub_batch=${formData.subBatch}`,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };

                await axios.request(config);
                fetchSubBatches();
                setFormData({ subBatch: '' });
                setOpenModal(false);
                toast.success('Sub-batch added successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to add sub-batch');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = getToken();
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:8000/api/admin/update/sub_batch/${updateId}?sub_batch=${formData.subBatch}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.request(config);
            fetchSubBatches();
            setFormData({ subBatch: '' });
            setOpenModal(false);
            setUpdateId(null);
            toast.success('Sub-batch updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update sub-batch');
        }
    };

    const handleDelete = async (subBatchId) => {
        try {
            const token = getToken();
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:8000/api/admin/delete/sub_batch/${subBatchId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.request(config);
            fetchSubBatches();
            toast.success('Sub-batch deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete sub-batch');
        }
    };

    const openUpdateModal = (subBatch) => {
        setUpdateId(subBatch.id);
        setFormData({ subBatch: subBatch.sub_batch });
        setOpenModal(true);
    };

    return (
        <>
            <AdminNavBar />
            <div className="bg-gray-100 min-h-screen flex justify-center p-4">
                <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Sub-batch List</h2>
                        <button
                            className="bg-[#262847] text-white py-2 px-4 rounded"
                            onClick={() => {
                                setUpdateId(null);
                                setOpenModal(true);
                            }}
                        >
                            Add Sub-batch
                        </button>
                    </div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 text-center">Sub-batch</th>
                                <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subBatches.map((subBatch, index) => (
                                <tr key={index} className="text-center border-b">
                                    <td className="py-2 px-4">{subBatch.sub_batch}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 mr-4"
                                            onClick={() => openUpdateModal(subBatch)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDelete(subBatch.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Component */}
            <Modal open={openModal} onClose={() => {
                setOpenModal(false);
                setUpdateId(null);
                setFormData({ subBatch: '' });
            }} center>
                <form onSubmit={handleSubmit} className="p-8 px-16">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="subBatch">Sub-batch</label>
                        <input
                            id="subBatch"
                            name="subBatch"
                            value={formData.subBatch}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            type="text"
                            maxLength="2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default ManageSubBatches;
