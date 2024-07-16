import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import { checkLogin } from '../../helper/checkLogin';
import Loaders from '../Loaders';

const AddSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitloading, setSubmitLoading] = useState(false);


    const [formData, setFormData] = useState({
        subject_name: '',
        subject_short: '',
        subject_sem: '',
    });
    const [openModal, setOpenModal] = useState(false);
    const [editingSubjectId, setEditingSubjectId] = useState(null); // State to track the subject being edited
    const navigate = useNavigate();

    const fetchSubjects = async () => {
        try {
            setLoading(true)
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/subjects`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubjects(response.data);
            setLoading(false)
            return toast.success("subject fetch successfully...")
        } catch (error) {
            setLoading(false)
            console.error('Error fetching subjects:', error);
            return toast.error(error.response.data.message)
        }
    };



    useEffect(() => {

        if (!checkLogin) {
            return navigate('/dmce/login')
        }

        fetchSubjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { subject_name, subject_short, subject_sem } = formData;
        // Check each required field individually
        if (!subject_name) {
            toast.error("Subject name is required");
            return; // Exit or handle the error condition
        }

        if (!subject_short) {
            toast.error("Subject short name is required");
            return; // Exit or handle the error condition
        }

        if (!subject_sem) {
            toast.error("Subject semester is required");
            return; // Exit or handle the error condition
        }
        setSubmitLoading(true)

        if (editingSubjectId) {
            // If editing, update the subject
            const url = `${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/subject/${editingSubjectId}`;
            try {
                const token = getToken();
                await axios.post(url, {
                    subject_name,
                    subject_short: subject_short.toUpperCase(),
                    subject_sem
                }, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEditingSubjectId(null); // Reset editing state
                setOpenModal(false);
                fetchSubjects();
                setSubmitLoading(false)
                toast.success('Subject updated successfully');
            } catch (error) {
                setSubmitLoading(false)
                console.error('Error updating subject:', error);
                toast.error(error.response.data.message || "Failed to update subject");
            }
        } else {
            // Otherwise, add a new subject
            setSubmitLoading(true)
            const queryParams = new URLSearchParams({
                subject_name,
                subject_short: subject_short.toUpperCase(),
                subject_sem
            }).toString();

            const url = `${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/subject?${queryParams}`;

            try {
                const token = getToken();
                await axios.post(url, {}, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormData({
                    subject_name: '',
                    subject_short: '',
                    subject_sem: '',
                });
                setOpenModal(false);
                fetchSubjects();
                setSubmitLoading(false)
                toast.success('Subject added successfully');
            } catch (error) {
                setSubmitLoading(false)
                console.error('Error adding subject:', error);
                toast.error(error.response.data.message || "Failed to add subject");
            }
        }
    };

    const handleEdit = (subject) => {
        setFormData({
            subject_name: subject.subject_name,
            subject_short: subject.subject_short,
            subject_sem: subject.subject_sem,
        });
        setEditingSubjectId(subject.id);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true)
            const token = getToken();
            await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/delete/subject/${id}`, {}, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false)
            fetchSubjects();
            toast.success('Subject deleted successfully');
        } catch (error) {
            setLoading(false)
            console.error('Error deleting subject:', error);
            toast.error(error.response.data.message || "Failed to delete subject");
        }
    };

    return (
        <>
            <AdminNavBar />
            <div className="bg-gray-100 flex justify-center min-h-screen h-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                    <div className='flex items-center justify-between'>
                        <h2 className="text-2xl font-bold mb-4">Subject List</h2>
                        <button
                            type="button"
                            className="bg-[#262847] text-white py-2 px-4 rounded  mb-2"
                            onClick={() => {
                                setEditingSubjectId(null); // Reset editing state when opening modal
                                setOpenModal(true);
                            }}
                        >
                            Add Subject
                        </button>
                    </div>
                    {
                        loading ? <Loaders message={"wait..."} /> :

                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="py-2 px-4">Subject Name</th>
                                        <th className="py-2 px-4">Short Name</th>
                                        <th className="py-2 px-4">Semester</th>
                                        <th className="py-2 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!subjects.length ? <h1 className='text-xl mt-8 text-[#262847] font-bold w-fit mx-auto'>No data found</h1> : subjects.map((subject, index) => (
                                        <tr key={index} className="text-center border-b">
                                            <td className="py-2 px-4">{subject.subject_name}</td>
                                            <td className="py-2 px-4">{subject.subject_short}</td>
                                            <td className="py-2 px-4">{subject.subject_sem}</td>
                                            <td className="py-2 px-4">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                                    onClick={() => handleEdit(subject)}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(subject.id)}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    }
                </div>
            </div>

            {/* Modal Component */}
            <Modal open={openModal} onClose={() => {
                setFormData({
                    subject_name: '',
                    subject_short: '',
                    subject_sem: '',
                });
                setEditingSubjectId(null); // Reset editing state when closing modal
                setOpenModal(false);
            }} center>
                <form onSubmit={handleSubmit} className='p-8 px-16'>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="subject_name">Subject Name</label>
                        <input
                            type="text"
                            id="subject_name"
                            name="subject_name"
                            value={formData.subject_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="subject_short">Short Name</label>
                        <input
                            type="text"
                            id="subject_short"
                            name="subject_short"
                            value={formData.subject_short}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="subject_sem">Subject Semester</label>
                        <select
                            id="subject_sem"
                            name="subject_sem"
                            value={formData.subject_sem}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Semester</option>
                            <option value={2}>Semester 2</option>
                            <option value={3}>Semester 3</option>
                            <option value={4}>Semester 4</option>
                            <option value={5}>Semester 5</option>
                            <option value={6}>Semester 6</option>
                            <option value={7}>Semester 7</option>
                            <option value={8}>Semester 8</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-[#262847] text-white py-2 rounded hover:bg-[#262847]"
                    >
                        {submitloading ? "Loading..." : editingSubjectId ? 'Update Subject' : 'Add Subject'}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default AddSubject;
