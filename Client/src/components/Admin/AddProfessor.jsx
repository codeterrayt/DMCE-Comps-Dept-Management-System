import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { getToken } from '../../helper/getToken';
import { checkLogin } from '../../helper/checkLogin';
import toast from 'react-hot-toast';
import Loaders from '../Loaders';

const AddProfessor = () => {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateloading, setUpdateLoading] = useState(false);
    const [formData, setFormData] = useState({
        professor_name: '',
        professor_phone_no: '',
        professor_gender: '',
        professor_email: '',
        password: '',
        professor_name_alias: ''
    });
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false); // State to determine if modal is in edit mode
    const [editProfessorId, setEditProfessorId] = useState(null); // State to store the ID of the professor being edited
    const navigate = useNavigate();

    // Fetch all professors on component mount
    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }

        fetchProfessors();
    }, []);

    // Fetch all professors
    const fetchProfessors = () => {
        setLoading(true)
        const token = getToken();
        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/professors`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Replace with actual auth token
            }
        })
            .then(response => {
                console.log('Fetched professors:', response.data);
                setProfessors(response.data); // Update professors state
                setLoading(false)
                return toast.success("professor data fetch successfully...")
            })
            .catch(error => {
                setLoading(false)
                console.error('Error fetching professors:', error);
                return toast.error(error.response.data.message || "failed to fetch data")
            });
    };

    // Add or update a professor based on editMode
    const handleAddOrUpdateProfessor = () => {
        if (editMode) {
            handleUpdateProfessor(editProfessorId);
        } else {
            handleAddProfessor();
        }
    };

    // Add a professor
    const handleAddProfessor = () => {
    
        const token = getToken();
        const { professor_name, professor_phone_no, professor_gender, professor_email, password, professor_name_alias } = formData;
        if (!professor_name) {
            toast.error("Professor name is required");
            return; // Exit or handle the error condition
        }

        if (!professor_phone_no) {
            toast.error("Professor phone number is required");
            return; // Exit or handle the error condition
        }

        if (!professor_gender) {
            toast.error("Professor gender is required");
            return; // Exit or handle the error condition
        }

        if (!professor_email) {
            toast.error("Professor email is required");
            return; // Exit or handle the error condition
        }

        if (!password) {
            toast.error("Password is required");
            return; // Exit or handle the error condition
        }

        if (!professor_name_alias) {
            toast.error("Professor alias is required");
            return; // Exit or handle the error condition
        }
        setUpdateLoading(true)
   
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/professor`, null, {
            params: {
                professor_name,
                professor_phone_no,
                professor_gender,
                professor_email,
                password,
                professor_name_alias: professor_name_alias.toUpperCase()
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Professor added successfully:', response.data);
                fetchProfessors(); // Fetch updated list after adding
                setFormData({
                    professor_name: '',
                    professor_phone_no: '',
                    professor_gender: '',
                    professor_email: '',
                    password: '',
                    professor_name_alias: ''
                });
                setUpdateLoading(false)
                setOpenModal(false);
                return toast.success("professor added successfully...")
            })
            .catch(error => {
                setUpdateLoading(false)
                setOpenModal(false);
                console.error('Error adding professor:', error);
                return toast.error(error.response.data.message || "failed to add professor")
            });
    };

    // Update a professor
    const handleUpdateProfessor = (professorId) => {
        const token = getToken();
    
        const { professor_name, professor_phone_no, professor_gender, professor_email, password, professor_name_alias } = formData;
        if (!professor_name) {
            toast.error("Professor name is required");
            return; // Exit or handle the error condition
        }

        if (!professor_phone_no) {
            toast.error("Professor phone number is required");
            return; // Exit or handle the error condition
        }

        if (!professor_gender) {
            toast.error("Professor gender is required");
            return; // Exit or handle the error condition
        }

        if (!professor_email) {
            toast.error("Professor email is required");
            return; // Exit or handle the error condition
        }

      

        if (!professor_name_alias) {
            toast.error("Professor alias is required");
            return; // Exit or handle the error condition
        }
        setUpdateLoading(true)
        axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/professor/${professorId}`, {
            professor_name,
            professor_phone_no,
            professor_gender,
            professor_email,
            password,
            professor_name_alias: professor_name_alias.toUpperCase()
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setUpdateLoading(false)
                console.log('Professor updated successfully:', response.data);
                fetchProfessors(); // Fetch updated list after updating
                setEditMode(false); // Exit edit mode
                setEditProfessorId(null); // Clear edit professor ID
                setOpenModal(false)
                return toast.success("professor updated successfully...")
            })
            .catch(error => {
                setUpdateLoading(false)
                setOpenModal(false)
                console.error('Error updating professor:', error);
                return toast.error(error.response.data.message || "failed to update professor")
            });
    };

    // Delete a professor
    const handleDeleteProfessor = (professorId) => {
        const token = getToken();
        console.log(token);
        try {

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/delete/professor/${professorId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    fetchProfessors();
                })
                .catch((error) => {
                    console.log(error);
                });

        } catch (error) {
            console.log(error);
        }
    };

    // Handle edit click - populate form data and open modal
    const handleEditClick = (professor) => {
        setFormData({
            professor_name: professor.user.name,
            professor_phone_no: professor.professor_phone_no,
            professor_gender: professor.professor_gender,
            professor_email: professor.user.email,
            password: professor.user.password,
            professor_name_alias: professor.professor_name_alias
        });
        setEditMode(true); // Set edit mode to true
        setEditProfessorId(professor.id); // Set the ID of the professor being edited
        setOpenModal(true); // Open the modal
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddOrUpdateProfessor();
    };

    return (
        <>
            <AdminNavBar />
            <div className="bg-gray-100 flex justify-center min-h-screen h-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                    <div className='flex items-center justify-between'>
                        <h2 className="text-2xl font-bold mb-4">Professor List</h2>
                        <button
                            type="button"
                            className="bg-[#262847] text-white py-2 px-4 rounded  mb-2"
                            onClick={() => {
                                setEditMode(false); // Ensure edit mode is false when adding new professor
                                setOpenModal(true);
                            }}
                        >
                            Add Professor
                        </button>
                    </div>
                    {
                        loading ? <Loaders message={"wait..."} /> : <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4">Name</th>
                                    <th className="py-2 px-4">Phone</th>
                                    <th className="py-2 px-4">Alias</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Gender</th>
                                    <th className="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!professors.length ? <h1 className='text-xl mt-8 text-[#262847] font-bold w-fit mx-auto'>No data found</h1> : professors.map((professor, index) => (
                                    <tr key={index} className="text-center border-b">
                                        <td className="py-2 px-4">{professor.user.name}</td>
                                        <td className="py-2 px-4">{professor.professor_phone_no}</td>
                                        <td className="py-2 px-4">{professor.professor_name_alias}</td>
                                        <td className="py-2 px-4">{professor.user.email}</td>
                                        <td className="py-2 px-4">{professor.professor_gender}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 mr-2"
                                                onClick={() => handleEditClick(professor)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 ml-3"
                                                onClick={() => handleDeleteProfessor(professor.id)}
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
                setOpenModal(false);
                setEditMode(false); // Reset edit mode when closing modal
                setEditProfessorId(null); // Reset edit professor ID when closing modal
                setFormData({
                    professor_name: '',
                    professor_phone_no: '',
                    professor_gender: '',
                    professor_email: '',
                    password: '',
                    professor_name_alias: ''
                });
            }} center>
                <form onSubmit={handleSubmit} className='p-8 px-16'>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="professor_name">Name</label>
                        <input
                            type="text"
                            id="professor_name"
                            name="professor_name"
                            value={formData.professor_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"

                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="professor_phone_no">Phone Number</label>
                        <input
                            type="text"
                            id="professor_phone_no"
                            name="professor_phone_no"
                            value={formData.professor_phone_no}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"

                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="professor_name_alias">Name Alias</label>
                        <input
                            type="text"
                            id="professor_name_alias"
                            name="professor_name_alias"
                            value={formData.professor_name_alias}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"

                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="professor_email">Email</label>
                        <input
                            type="email"
                            id="professor_email"
                            name="professor_email"
                            value={formData.professor_email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"

                        />
                    </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded"

                            />
                        </div>
                    
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="professor_gender">Gender</label>
                        <select
                            id="professor_gender"
                            name="professor_gender"
                            value={formData.professor_gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"

                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-[#262847] text-white py-2 rounded hover:bg-[#262847]"
                    >
                        {updateloading ? "Loading..." : editMode ? 'Update Professor' : 'Add Professor'}
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default AddProfessor;
