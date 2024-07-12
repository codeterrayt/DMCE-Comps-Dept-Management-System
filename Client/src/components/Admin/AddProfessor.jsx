import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { Modal } from 'react-responsive-modal';

const AddProfessor = () => {
    const [professors, setProfessors] = useState([
        { name: 'John Doe', phone: '1234567890', alias: 'JD', email: 'john.doe@example.com', password: '1234567890' },
        { name: 'Jane Smith', phone: '0987654321', alias: 'JS', email: 'jane.smith@example.com', password: '0987654321' },
        { name: 'Alice Johnson', phone: '5551234567', alias: 'AJ', email: 'alice.johnson@example.com', password: '5551234567' },
        { name: 'Bob Brown', phone: '4449876543', alias: 'BB', email: 'bob.brown@example.com', password: '4449876543' },
        { name: 'John Doe', phone: '1234567890', alias: 'JD', email: 'john.doe@example.com', password: '1234567890' },
        { name: 'Jane Smith', phone: '0987654321', alias: 'JS', email: 'jane.smith@example.com', password: '0987654321' },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        alias: '',
        email: '',
        password: ''
    });

    const [openModal, setOpenModal] = useState(false); // State for controlling modal open/close
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            password: name === 'phone' ? value : prevData.password
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProfessors((prevProfessors) => [...prevProfessors, formData]);
        setFormData({
            name: '',
            phone: '',
            alias: '',
            email: '',
            password: ''
        });
        setOpenModal(false); // Close the modal after submitting
        navigate('/professor-list');
    };

    return (
        <>
            <AdminNavBar />
            <div className="bg-gray-100 flex justify-center min-h-screen h-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                  <div className='flex items-center justify-between '>
                  <h2 className="text-2xl font-bold mb-4">Professor List</h2>
                    <button
                        type="button"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2"
                        onClick={() => setOpenModal(true)}
                    >
                        Add Professor
                    </button>
                  </div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Phone</th>
                                <th className="py-2 px-4">Alias</th>
                                <th className="py-2 px-4">Email</th>
                                <th className="py-2 px-4">Password</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professors.map((professor, index) => (
                                <tr key={index} className="text-center border-b">
                                    <td className="py-2 px-4">{professor.name}</td>
                                    <td className="py-2 px-4">{professor.phone}</td>
                                    <td className="py-2 px-4">{professor.alias}</td>
                                    <td className="py-2 px-4">{professor.email}</td>
                                    <td className="py-2 px-4">{professor.password}</td>
                                    <td className="py-2 px-4">
                                        <button className="text-blue-500 hover:text-blue-700 mr-2">
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Component */}
            <Modal open={openModal} onClose={() => setOpenModal(false)} center>
                <form onSubmit={handleSubmit} className='p-8 px-16 '>
                    <div className="mb-2 ">
                        <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="alias">Name Alias</label>
                        <input
                            type="text"
                            id="alias"
                            name="alias"
                            value={formData.alias}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
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
                            readOnly
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-[#262847] text-white py-2 rounded hover:bg-[#262847]"
                    >
                        Add Professor
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default AddProfessor;
