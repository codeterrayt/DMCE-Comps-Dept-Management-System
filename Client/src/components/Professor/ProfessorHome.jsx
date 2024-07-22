import React, { useEffect, useState } from 'react';
import { checkLogin } from '../../helper/checkLogin';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../helper/getToken';
import toast from 'react-hot-toast';
import NavBar from './ProfessorNav';
import Loaders2 from '../Loader2';

const ProfessorHome = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!checkLogin()) {
      return navigate('/login');
    } else {
      fetchProfessorSubjects();
    }
  }, []);

  const fetchProfessorSubjects = async () => {
    try {
      setLoading(true)
      const token = getToken();
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_SERVER_DOMAIN}/professor/fetch/assigned-subjects`,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.request(config);
      setSubjects(response.data);
      setLoading(false)
      toast.success("Subjects fetched successfully.");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoading(false)
        localStorage.clear();
        navigate('/login');
      }
      setLoading(false)
      toast.error("Failed to load the subjects.");
      console.error(error);
    }
  };

  return (
    <><NavBar />
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold my-4">Assigned Subjects</h1>
        {
          loading ? <Loaders2 message={"Fetching Your subject.."} /> : <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 table table-striped">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Subject Name</th>
                  <th className="px-4 py-2 border">Short Name</th>
                  <th className="px-4 py-2 border">Semester</th>
                  <th className="px-4 py-2 border">PR/TH</th>
                  <th className="px-4 py-2 border">Batch</th>
                  <th className="px-4 py-2 border">Add Attendance</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{sub.subject.subject_name}</td>
                    <td className="px-4 py-2 border">{sub.subject.subject_short}</td>
                    <td className="px-4 py-2 border">{sub.subject.subject_sem}</td>
                    <td className="px-4 py-2 border">{sub.pr_th == 1 ? "Theory" : "Practical"}</td>
                    <td className="px-4 py-2 border">{sub.batch}</td>

                    <td onClick={() => navigate(`/professor/add-attendance/${sub.subject_id}/${sub.pr_th}`)} className="px-4 py-2 border text-center cursor-pointer hover:bg-[#262847] hover:text-white duration-200"><i className="fa-solid fa-square-plus text-2xl mx-auto "></i></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
};

export default ProfessorHome;
