import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import { checkLogin } from '../../helper/checkLogin';
import Loaders from '../Loaders';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        academic_year: '',
        course_year: '',
        sem: '',
        file: null
    });
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState([]);
    const [saving, setSaving] = useState([]);
    const [addStudentLoading, setAddStudentLoadingtSaving] = useState(false);
    const [addStudentModalOpen, setAddStudentModalOpen] = useState(false); // State for add student modal
    const [newStudentData, setNewStudentData] = useState({
        student_id: '',
        roll_no: '',
        name: '',
        batch: '',
        academic_year: '',
        course_year: '',
        sem: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkLogin()) {
            return navigate('/login');
        }
        fetchData();
    }, []);
    

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveAll();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [editedData]);

    const getAcademicYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            years.push(`${i} - ${i + 1}`);
        }
        return years;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleNewStudentChange = (e) => {
        const { name, value } = e.target;
        setNewStudentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { academic_year, course_year, sem, file } = formData;

        if (!academic_year || !course_year || !sem || !file) {
            toast.error("All fields are required");
            return;
        }

        setSubmitLoading(true);
        let data = new FormData();
        data.append('academic_year', academic_year);
        data.append('course_year', course_year);
        data.append('sem', sem);
        data.append('file', file);

        try {
            const token = getToken();
            await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/upload/csv/students`, data, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFormData({
                academic_year: '',
                course_year: '',
                sem: '',
                file: null,
            });
            setOpenModal(false);
            setSubmitLoading(false);
            toast.success('Student data uploaded successfully');
            fetchData();
        } catch (error) {
            setSubmitLoading(false);
            console.error('Error uploading student data:', error);
            toast.error(error.response.data.message || "Failed to upload student data");
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/csv/students`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            setStudentData(response.data);
            setEditedData(response.data.map((student) => ({ ...student }))); // Copy student data to editedData
            setSaving(response.data.map(() => false)); // Initialize saving state for each student
            setLoading(false);
            toast.success('Students fetched successfully');
        } catch (error) {
            if (error.response.status == 401) {
                setLoading(false);
                localStorage.clear()    
                  navigate('/login') 
                  return toast.error("unauthenticated");
              }
            setLoading(false);
            toast.error(error.response.data.message || "Failed to fetch data");
            console.error(error.message);
        }
    };

    const handleEditChange = (e, index) => {
        const { name, value } = e.target;
        setEditedData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = {
                ...updatedData[index],
                [name]: value
            };
            return updatedData;
        });
    };

    const saveRow = async (index) => {
        const student = editedData[index];
        const token = getToken();

        // Prevent multiple save requests for the same row
        if (saving[index]) return;

        setSaving((prevSaving) => {
            const newSaving = [...prevSaving];
            newSaving[index] = true;
            return newSaving;
        });

        try {
            console.log('Saving student data:', student); // Log the data being saved
            await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/csv/student/${student.id}`, student, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            toast.success('Student data updated successfully');
            fetchData(); // Refresh data after successful save
        } catch (error) {
            toast.error('Failed to update student data');
            console.error(error.message);
        } finally {
            setSaving((prevSaving) => {
                const newSaving = [...prevSaving];
                newSaving[index] = false;
                return newSaving;
            });
        }
    };

    const saveAll = async () => {
        const token = getToken();
        const updatedStudents = editedData.filter((student, index) => hasChanges(index));

        if (updatedStudents.length === 0) {
            toast.info('No changes to save');
            return;
        }

        try {
            setLoading(true);
            for (const student of updatedStudents) {
                await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/csv/student/${student.id}`, student, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            toast.success('All changes saved successfully');
            fetchData(); // Refresh data after successful save
        } catch (error) {
            toast.error('Failed to save changes');
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = (index) => {
        const originalStudent = studentData[index];
        const editedStudent = editedData[index];
        return JSON.stringify(originalStudent) !== JSON.stringify(editedStudent);
    };

    const handleAddStudentSubmit = async (e) => {
        e.preventDefault()
        const { student_id, roll_no, name, batch, academic_year, course_year, sem } = newStudentData;
        const token = getToken();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/admin/add/csv/student`,
                null,
                {
                    params: {
                        student_id,
                        roll_no,
                        name,
                        batch,
                        academic_year,
                        course_year,
                        sem
                    },
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response.data);
            toast.success('Student added successfully');
            setAddStudentModalOpen(false);
            fetchData(); // Refresh data after successful add
        } catch (error) {
            console.error('Failed to add student:', error);
            toast.error(error.response.data.message || 'Failed to add student');
        }
    };


    const handleKeyDown = useCallback((event, rowIndex, cellName) => {
        if (!editMode) return;

        const cellOrder = ["student_id", "roll_no", "name", "batch", "academic_year", "course_year", "sem"];
        const currentCellIndex = cellOrder.indexOf(cellName);
        let nextCellIndex = currentCellIndex;
        let nextRowIndex = rowIndex;

        switch (event.key) {
            case "ArrowUp":
                nextRowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
                break;
            case "ArrowDown":
                nextRowIndex = rowIndex < studentData.length - 1 ? rowIndex + 1 : rowIndex;
                break;
            case "ArrowLeft":
                nextCellIndex = currentCellIndex > 0 ? currentCellIndex - 1 : currentCellIndex;
                break;
            case "ArrowRight":
                nextCellIndex = currentCellIndex < cellOrder.length - 1 ? currentCellIndex + 1 : currentCellIndex;
                break;
            default:
                break;
        }

        const nextCellName = cellOrder[nextCellIndex];
        const nextCell = document.querySelector(`input[name="${nextCellName}"][data-row-index="${nextRowIndex}"]`);
        if (nextCell) {
            nextCell.focus();
        }
    }, [editMode, studentData.length]);

    const handleFocus = (event, rowIndex, cellName) => {
        event.target.addEventListener("keydown", (e) => handleKeyDown(e, rowIndex, cellName));
    };

    const handleBlur = (event) => {
        event.target.removeEventListener("keydown", handleKeyDown);
    };
    return (
        <>
            <AdminNavBar />
            <div className="bg-gray-100 flex justify-center min-h-screen h-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-full ">
                    <div className='flex items-center justify-between'>
                        <h2 className="text-2xl font-bold mb-4">Manage Students</h2>
                       <div>
                       <div className='flex items-center gap-4 justify-center'>
                            <button
                                type="button"
                                className="bg-[#262847] text-white py-2 px-4 rounded "
                                onClick={() => setOpenModal(true)}
                            >
                                Upload CSV
                            </button>
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => setEditMode(!editMode)}
                            >
                                {editMode ? "Cancel" : "Edit Mode"}
                            </button>
                            <button
                                type="button"
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => setAddStudentModalOpen(true)}
                            >
                                Add Student
                            </button>
                            {editMode && (
                                <div className='flex flex-col items-center justify-center gap-1'>
                                    <button
                                        type="button"
                                        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                                        onClick={saveAll}
                                    >
                                        Save All
                                    </button>
                                    <p className='text-[12px] font-bold'>CTRL + S</p>
                                </div>
                            )}

                        </div>
                        <p className='mt-1 text-[12px] text-red-500 mx-auto font-bold w-fit'>If you edit multiple row, kindly click above <span className='text-[15px] underline '>(save all)</span> button, or press <span className='text-[15px] underline'> CTRL + S</span></p>
                       </div>
                    </div>

                    {loading ? (
                        <Loaders />
                    ) : (
                        <>
                            <table  id="example" className="w-full table table-striped mt-4 border-collapse border">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">ID</th>
                                        <th className="border px-4 py-2">Student ID</th>
                                        <th className="border px-4 py-2">Roll No</th>
                                        <th className="border px-4 py-2">Name</th>
                                        <th className="border px-4 py-2">Batch</th>
                                        <th className="border px-4 py-2">Academic Year</th>
                                        <th className="border px-4 py-2">Course Year</th>
                                        <th className="border px-4 py-2">Semester</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData.map((student, index) => (
                                        <tr key={student.id}>
                                            {editMode ? (
                                                <>
                                                    <td className="border px-4 py-2">{student.id}</td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="student_id"
                                                            value={editedData[index]?.student_id || ''}
                                                            onChange={(e) => handleEditChange(e, index)}
                                                            className="w-full px-2 py-1 border"
                                                            onFocus={(e) => handleFocus(e, index, "student_id")}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="roll_no"
                                                            value={editedData[index]?.roll_no || ''}
                                                            onChange={(e) => handleEditChange(e, index)}
                                                            className="w-full px-2 py-1 border"
                                                            onFocus={(e) => handleFocus(e, index, "student_id")}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={editedData[index]?.name || ''}
                                                            onChange={(e) => handleEditChange(e, index)}
                                                            className="w-full px-2 py-1 border"
                                                            onFocus={(e) => handleFocus(e, index, "student_id")}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="batch"
                                                            value={editedData[index]?.batch || ''}
                                                            onChange={(e) => handleEditChange(e, index)}
                                                            className="w-full px-2 py-1 border"
                                                            onFocus={(e) => handleFocus(e, index, "student_id")}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="academic_year"
                                                            value={editedData[index]?.academic_year || ''}
                                                            onChange={(e) => handleEditChange(e, index)}
                                                            className="w-full px-2 py-1 border"
                                                            onFocus={(e) => handleFocus(e, index, "student_id")}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="course_year"
                                                            value={editedData[index]?.course_year || ''}
                                                            onChange={(e) => handleEditChange(e, index)}
                                                            className="w-full px-2 py-1 border"
                                                            onFocus={(e) => handleFocus(e, index, "student_id")}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        <input
                                                            type="text"
                                                            name="sem"
                                                            value={editedData[index]?.sem || ''}
                                                            onChange={(e) => handleEditChange(e, index)}
                                                            className="w-full px-2 py-1 border"
                                                            onFocus={(e) => handleFocus(e, index, "student_id")}
                                                            onBlur={handleBlur}
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {hasChanges(index) && (
                                                            <button
                                                                type="button"
                                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                                                onClick={() => saveRow(index)}
                                                            >
                                                                Save
                                                            </button>
                                                        )}
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="border px-4 py-2">{student.id}</td>
                                                    <td className="border px-4 py-2">{student.student_id}</td>
                                                    <td className="border px-4 py-2">{student.roll_no}</td>
                                                    <td className="border px-4 py-2">{student.name}</td>
                                                    <td className="border px-4 py-2">{student.batch}</td>
                                                    <td className="border px-4 py-2">{student.academic_year}</td>
                                                    <td className="border px-4 py-2">{student.course_year}</td>
                                                    <td className="border px-4 py-2">{student.sem}</td>

                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </>
                    )}
                    <Modal open={openModal} onClose={() => setOpenModal(false)} center>
                        <h2 className="text-2xl font-bold mb-4">Upload Student CSV</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                                <select
                                    name="academic_year"
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md shadow-sm"
                                >
                                    <option value="">Select Academic Year</option>
                                    {getAcademicYears().map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Course Year</label>
                                <select
                                    name="course_year"
                                    value={formData.course_year}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md shadow-sm"
                                >
                                    <option value="">Select Course Year</option>
                                    <option value="FE">FE</option>
                                    <option value="SE">SE</option>
                                    <option value="TE">TE</option>
                                    <option value="BE">BE</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Semester</label>
                                <select
                                    name="sem"
                                    value={formData.sem}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md shadow-sm"
                                >
                                    <option value="">Select Semester</option>
                                    <option value="1">semester 1</option>
                                    <option value="2">semester 2</option>
                                    <option value="3">semester 3</option>
                                    <option value="4">semester 4</option>
                                    <option value="5">semester 5</option>
                                    <option value="6">semester 6</option>
                                    <option value="7">semester 7</option>
                                    <option value="8">semester 8</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Upload CSV</label>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    accept=".csv"
                                />
                            </div>
                            <div className="text-right">
                                <button
                                    type="submit"
                                    className="bg-[#262847] text-white py-2 px-4 rounded"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Add Student Modal */}
                    <Modal open={addStudentModalOpen} onClose={() => setAddStudentModalOpen(false)} center>
                        <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
                        <form onSubmit={handleAddStudentSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                                    <input
                                        type="text"
                                        name="student_id"
                                        value={newStudentData.student_id}
                                        onChange={handleNewStudentChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Roll No</label>
                                    <input
                                        type="text"
                                        name="roll_no"
                                        value={newStudentData.roll_no}
                                        onChange={handleNewStudentChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newStudentData.name}
                                        onChange={handleNewStudentChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                <label className="block text-sm font-medium text-gray-700">Batch</label>
                                    <select
                                        name="batch"
                                        value={newStudentData.batch}
                                        onChange={handleNewStudentChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    >
                                        <option value="">Select batch</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                                    <select
                                        name="academic_year"
                                        value={newStudentData.academic_year}
                                        onChange={handleNewStudentChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    >
                                        <option value="">Select Academic Year</option>
                                        {getAcademicYears().map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Course Year</label>
                                    <select
                                        name="course_year"
                                        value={newStudentData.course_year}
                                        onChange={handleNewStudentChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    >
                                        <option value="">Select Course Year</option>
                                        <option value="FE">FE</option>
                                        <option value="SE">SE</option>
                                        <option value="TE">TE</option>
                                        <option value="BE">BE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                                    <select
                                        name="sem"
                                        value={newStudentData.sem}
                                        onChange={handleNewStudentChange}
                                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                                    >
                                        <option value="">Select Semester</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-right mt-4">
                                <button
                                    type="submit"
                                    className="bg-[#262847] text-white py-2 px-4 rounded"
                                    disabled={addStudentLoading}
                                >
                                    {addStudentLoading ? 'Adding...' : 'Add Student'}
                                </button>
                            </div>
                        </form>
                    </Modal>

                </div>
            </div>
        </>
    );
};

export default AddStudent;

