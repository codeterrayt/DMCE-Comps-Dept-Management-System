import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { Modal } from 'react-responsive-modal';

const AddSubject = () => {
    const [subjects, setSubjects] = useState([
        { subjectName: 'Mathematics', shortName: 'Math', semester: 'Semester 1', year: 'FE' },
        { subjectName: 'Physics', shortName: 'Phy', semester: 'Semester 2', year: 'SE' },
        { subjectName: 'Computer Science', shortName: 'CS', semester: 'Semester 1', year: 'TE' },
    ]);

    const [formData, setFormData] = useState({
        subjectName: '',
        shortName: '',
        semester: 'Semester 1',
        year: 'FE'
    });

    const [openModal, setOpenModal] = useState(false); // State for controlling modal open/close
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubjects((prevSubjects) => [...prevSubjects, formData]);
        setFormData({
            subjectName: '',
            shortName: '',
            semester: 'Semester 1',
            year: 'FE'
        });
        setOpenModal(false); // Close the modal after submitting
        navigate('/subject-list');
    };

    return (
        <>
            <AdminNavBar />
            <div className="bg-gray-100 flex justify-center min-h-screen h-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
                    <div className='flex items-center justify-between '>
                        <h2 className="text-2xl font-bold mb-4">Subject List</h2>
                        <button
                            type="button"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2"
                            onClick={() => setOpenModal(true)}
                        >
                            Add Subject
                        </button>
                    </div>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4">Subject Name</th>
                                <th className="py-2 px-4">Short Name</th>
                                <th className="py-2 px-4">Semester</th>
                                <th className="py-2 px-4">Year</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={index} className="text-center border-b">
                                    <td className="py-2 px-4">{subject.subjectName}</td>
                                    <td className="py-2 px-4">{subject.shortName}</td>
                                    <td className="py-2 px-4">{subject.semester}</td>
                                    <td className="py-2 px-4">{subject.year}</td>
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
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="subjectName">Subject Name</label>
                        <input
                            type="text"
                            id="subjectName"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="shortName">Short Name</label>
                        <input
                            type="text"
                            id="shortName"
                            name="shortName"
                            value={formData.shortName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="semester">Semester</label>
                        <select
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="Semester 1">Semester 1</option>
                            <option value="Semester 2">Semester 2</option>
                            <option value="Semester 3">Semester 3</option>
                            <option value="Semester 4">Semester 4</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 mb-2" htmlFor="year">Year</label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="FE">FE</option>
                            <option value="SE">SE</option>
                            <option value="TE">TE</option>
                            <option value="BE">BE</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-[#262847] text-white py-2 rounded hover:bg-[#262847]"
                    >
                        Add Subject
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default AddSubject;
