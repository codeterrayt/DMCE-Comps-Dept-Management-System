import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import NavBar from './ProfessorNav';
import Loaders2 from '../Loader2';
import { checkLogin } from '../../helper/checkLogin';
import axios from 'axios';

const AddAttendance = () => {
    const { subjectId } = useParams();
    const [students, setStudents] = useState([]);
    const [modifiedRows, setModifiedRows] = useState(new Map());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkLogin()) {
            navigate('/login');
        }
        fetchStudentAttendance();
    }, [subjectId]);

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
    // http://127.0.0.1:9000/api/api/ap/add/student-attendance/?student_id=2022FHCO108&subject_id=2&sem=2&academic_year=2021%20-%202022&course_year=SE&pr_th=0&m1=23

    // http://127.0.0.1:9000/api/ap/add/student-attendance/?student_id=2022FHCO108&subject_id=1&sem=3&academic_year=2020 - 2021&course_year=FE&pr_th=0&m1=5&m2=3&m3=5&m4=10'

    const addStudentAttendance = async () => {
        try {
            setLoading(true);
            const token = getToken();
    
            const promises = Array.from(modifiedRows.values()).map(student => {
                const { student_id, academic_year, course_year, sem, m1, m2, m3, m4 } = student;
                const pr_th = 0;
    
                // Construct the URL with only defined values
                let url = `${import.meta.env.VITE_SERVER_DOMAIN}/api/ap/add/student-attendance/?student_id=${student_id}&subject_id=${subjectId}&sem=${sem}&academic_year=2021-2022&course_year=${course_year}&pr_th=${pr_th}`;
                if (m1 !== undefined && m1 !== null) url += `&m1=${m1}`;
                if (m2 !== undefined && m2 !== null) url += `&m2=${m2}`;
                if (m3 !== undefined && m3 !== null) url += `&m3=${m3}`;
                if (m4 !== undefined && m4 !== null) url += `&m4=${m4}`;
    
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
            toast.success("Attendance added successfully...");
            fetchStudentAttendance();
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message || "Failed to add attendance");
        }
    };
    
    
    

    return (
        <>
            <NavBar />
            {loading ? <Loaders2 message={"Fetching Attendance..."} /> : (
                <div className="container mx-auto mt-5">
                    <div className="overflow-x-auto mb-4">
                        <table className="table-auto w-full text-left whitespace-no-wrap table table-striped">
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
                                {students.map((student, index) => (
                                    <tr key={student.id} className="border-b">
                                        <td className="px-4 py-2">{student.student_id}</td>
                                        <td className="px-4 py-2">{student.roll_no}</td>
                                        <td className="px-4 py-2">{student.name}</td>
                                        <td className="px-4 py-2">{student.batch}</td>
                                        <td className="px-4 py-2">{student.course_year}</td>
                                        <td className="px-4 py-2">{student.sem}</td>
                                        <td
                                            className="px-4 py-2"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(e) => handleInputChange(index, 'm1', e.target.textContent)}
                                        >
                                            {student.attendances?.m1 ?? '-'}
                                        </td>
                                        <td
                                            className="px-4 py-2"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(e) => handleInputChange(index, 'm2', e.target.textContent)}
                                        >
                                            {student.attendances?.m2 ?? '-'}
                                        </td>
                                        <td
                                            className="px-4 py-2"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(e) => handleInputChange(index, 'm3', e.target.textContent)}
                                        >
                                            {student.attendances?.m3 ?? '-'}
                                        </td>
                                        <td
                                            className="px-4 py-2"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(e) => handleInputChange(index, 'm4', e.target.textContent)}
                                        >
                                            {student.attendances?.m4 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2">{student.attendances?.total ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={addStudentAttendance}
                        >
                            Add Attendance
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddAttendance;
