import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import NavBar from './ProfessorNav';
import Loaders2 from '../Loader2';
import { checkLogin } from '../../helper/checkLogin';
import axios from 'axios';

const AddAttendance = () => {
    const { subjectId } = useParams()
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (!checkLogin) {
            navigate('/login');
        }
        fetchStudentAttendance();
    }, [subjectId]);

    const fetchStudentAttendance = async () => {
        try {
            setLoading(true)
            const token = getToken()
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
            console.log(JSON.stringify(response.data));
            setLoading(false);
            toast.success("Attendance fetched successfully...");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoading(false);
                localStorage.clear();
                navigate('/login');
            }
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message || "Failed to fetch the attendance");
        }
    }

    return (
        <>
            <NavBar />
            {loading ? <Loaders2 message={"Fetching Attendance..."} /> : (
                <div className="container mx-auto mt-5">
                    <div className="overflow-x-auto">
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
                                {students.map((student) => (
                                    <tr key={student.id} className="border-b">
                                        <td className="px-4 py-2">{student.student_id}</td>
                                        <td className="px-4 py-2">{student.roll_no}</td>
                                        <td className="px-4 py-2">{student.name}</td>
                                        <td className="px-4 py-2">{student.batch}</td>
                                        <td className="px-4 py-2">{student.course_year}</td>
                                        <td className="px-4 py-2">{student.sem}</td>
                                        <td className="px-4 py-2">{student.attendances?.[0]?.m1 ?? '-'}</td>
                                        <td className="px-4 py-2">{student.attendances?.[0]?.m2 ?? '-'}</td>
                                        <td className="px-4 py-2">{student.attendances?.[0]?.m3 ?? '-'}</td>
                                        <td className="px-4 py-2">{student.attendances?.[0]?.m4 ?? '-'}</td>
                                        <td className="px-4 py-2">{student.attendances?.[0]?.total ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddAttendance;
