import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import NavBar from './ProfessorNav';
import Loaders2 from '../Loader2';
import { checkLogin } from '../../helper/checkLogin';
import axios from 'axios';

const AddAttendance = () => {
    const { subjectId  , pr_th} = useParams();
    const [students, setStudents] = useState([]);
    const [modifiedRows, setModifiedRows] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const tableRef = useRef();

    useEffect(() => {
        if (!checkLogin()) {
            navigate('/login');
        }
        fetchStudentAttendance();
    }, [subjectId]);

    useEffect(() => {
        const handleSaveShortcut = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveAttendance();
            }
        };
        window.addEventListener('keydown', handleSaveShortcut);

        return () => {
            window.removeEventListener('keydown', handleSaveShortcut);
        };
    }, [modifiedRows]);

    const fetchStudentAttendance = async () => {
        try {
            setLoading(true);
            const token = getToken();
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_SERVER_DOMAIN}/ap/fetch/student-attendances?subject_id=${subjectId}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.request(config);
            setStudents(response.data);
            setLoading(false);
            toast.success("Attendance fetched successfully...");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoading(false);
                localStorage.clear();
                navigate('/login');
            }
            setLoading(false);
            toast.error(error.response.data.message || "Failed to fetch the attendance");
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedStudent = { ...students[index], [field]: value };

        const updatedStudents = [...students];
        updatedStudents[index] = updatedStudent;
        setStudents(updatedStudents);

        const updatedModifiedRows = new Map(modifiedRows);
        updatedModifiedRows.set(index, updatedStudent);
        setModifiedRows(updatedModifiedRows);
    };

    function convertDateRange(dateRange) {
        return dateRange.replace(/\s-\s/, '-');
    }

    const saveAttendance = async () => {
        try {
            setLoading(true);
            const token = getToken();

            const promises = Array.from(modifiedRows.values()).map(student => {
                const { student_id, academic_year, course_year, sem, m1, m2, m3, m4, attendances } = student;

                let sid = null;
                attendances.map((at) => {
                    if (at.subject_id == subjectId) {
                        sid = at.id;
                    }
                });

                let url = `${import.meta.env.VITE_SERVER_DOMAIN}/ap/${sid ? 'update' : 'add'}/student-attendance${sid ? `/${sid}` : ''}?student_id=${student_id}&subject_id=${subjectId}&sem=${sem}&academic_year=${convertDateRange(academic_year)}&course_year=${course_year}&pr_th=${pr_th}`;
                if (m1 !== undefined) url += `&m1=${m1}`;
                if (m2 !== undefined) url += `&m2=${m2}`;
                if (m3 !== undefined) url += `&m3=${m3}`;
                if (m4 !== undefined) url += `&m4=${m4}`;

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: url,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                };

                return axios.request(config);
            });

            await Promise.all(promises);
            setLoading(false);
            setModifiedRows(new Map());
            toast.success("Attendance saved successfully...");
            fetchStudentAttendance();
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message || "Failed to save attendance");
        }
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        const rowCount = students.length;
        const colCount = 4; // Number of editable columns (m1, m2, m3, m4)

        let newRow = rowIndex;
        let newCol = colIndex;

        switch (e.key) {
            case 'ArrowUp':
                newRow = Math.max(0, rowIndex - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(rowCount - 1, rowIndex + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, colIndex - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(colCount - 1, colIndex + 1);
                break;
            default:
                break;
        }

        const cellId = `cell-${newRow}-${newCol}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.focus();
        }
    };

    return (
        <>
            <NavBar />
            {loading ? <Loaders2 message={"Fetching Attendance..."} /> : (
                <div className="container mx-auto mt-5">
                    <div className="overflow-x-auto mb-4">
                        <table ref={tableRef} className="table-auto w-full text-left whitespace-no-wrap table table-striped">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Student ID</th>
                                    <th className="px-4 py-2">Roll No</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Batch</th>
                                    <th className="px-4 py-2">Course Year</th>
                                    <th className="px-4 py-2">Sem</th>
                                    <th className="px-4 py-2">M1</th>
                                    <th className="px-4 py-2">M2</th>
                                    <th className="px-4 py-2">M3</th>
                                    <th className="px-4 py-2">M4</th>
                                    <th className="px-4 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, rowIndex) => {
                                    const attendance = student.attendances.find(att => att.subject_id == subjectId);
                                    return (
                                        <tr key={student.id} className="border-b">
                                            <td className="px-4 py-2">{student.student_id}</td>
                                            <td className="px-4 py-2">{student.roll_no}</td>
                                            <td className="px-4 py-2">{student.name}</td>
                                            <td className="px-4 py-2">{student.batch}</td>
                                            <td className="px-4 py-2">{student.course_year}</td>
                                            <td className="px-4 py-2">{student.sem}</td>
                                            <td
                                                id={`cell-${rowIndex}-0`}
                                                className="px-4 py-2 border"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={(e) => handleInputChange(rowIndex, 'm1', e.target.textContent)}
                                                onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)}
                                            >
                                                {attendance ? attendance.m1 : ' '}
                                            </td>
                                            <td
                                                id={`cell-${rowIndex}-1`}
                                                className="px-4 py-2 border"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={(e) => handleInputChange(rowIndex, 'm2', e.target.textContent)}
                                                onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                                            >
                                                {attendance ? attendance.m2 : ' '}
                                            </td>
                                            <td
                                                id={`cell-${rowIndex}-2`}
                                                className="px-4 py-2 border"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={(e) => handleInputChange(rowIndex, 'm3', e.target.textContent)}
                                                onKeyDown={(e) => handleKeyDown(e, rowIndex, 2)}
                                            >
                                                {attendance ? attendance.m3 : ' '}
                                            </td>
                                            <td
                                                id={`cell-${rowIndex}-3`}
                                                className="px-4 py-2 border"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={(e) => handleInputChange(rowIndex, 'm4', e.target.textContent)}
                                                onKeyDown={(e) => handleKeyDown(e, rowIndex, 3)}
                                            >
                                                {attendance ? attendance.m4 : ' '}
                                            </td>
                                            <td className="px-4 py-2 border font-bold">{attendance ? attendance.total : ' '}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={saveAttendance}
                        >
                            Save Attendance
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddAttendance;
