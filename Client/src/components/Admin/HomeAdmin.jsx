import React, { useEffect, useState } from 'react';
import { getToken } from '../../helper/getToken';
import axios from 'axios';
import { checkLogin } from '../../helper/checkLogin';
import { useNavigate } from 'react-router-dom';
import Loaders from '../Loaders';

const HomeAdmin = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    div: '',
    higher_studies: false,
    achievements: false,
    ecc: false,
    hackathons: false,
    placements: false,
    placement_type: false,
    internship: false,
    admitted_year: false,
  });

  const [admittedYears, setAdmittedYears] = useState({
    2019: false,
    2020: false,
    2021: false,
    2022: false,
    2023: false,
    2024: false,
    2025: false,
    2026: false,
    2027: false,
    2028: false,
    2029: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!checkLogin()) {
      return navigate('/dmce/login');
    }
    getAllStudent();
  }, [filters, admittedYears]);

  useEffect(() => {
    if (student.length > 0) {
      new DataTable('#example');
    }
  }, [student]);

  const getAllStudent = () => {
    const token = getToken();
    setLoading(true);
    let url = `${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/students`;

    const filterParams = Object.entries(filters)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return `${key}=${value ? '1' : '0'}`;
        }
        if (key === 'admitted_year') {
          return `${key}=${Object.keys(admittedYears).filter(year => admittedYears[year])}`;
        }
        return `${key}=${value}`;
      })
      .join('&');

    if (filterParams) {
      url += `?${filterParams}`;
    }

    setTimeout(() => {
      axios
        .get(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setStudent(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }, 500);
  };

  const handleCheckboxChange = (name, value) => {
    if (name === 'admitted_year') {
      setAdmittedYears((prevYears) => {
        const updatedYears = { ...prevYears };

        Object.keys(updatedYears).forEach((year) => {
          if (year !== value) {
            updatedYears[year] = false;
          }
        });

        return {
          ...updatedYears,
          [value]: !prevYears[value],
        };
      });
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  return (
    <section className='min-h-screen w-full p-4 '>
      <div className='w-full max-md:mt-8  max-md:mb-8'>
        <h1 className='text-center text-xl md:text-6xl font-bold text-[#262847]'>Admin Panel</h1>
      </div>

      {/* filters  */}
      <div className='w-full p-4 flex items-center gap-8 max-md:gap-3  '>
        <div className='font-bold'>
          <label htmlFor='divSelect' className='block text-sm font-medium text-gray-700'>Select Division:</label>
          <select
            id='divSelect'
            value={filters.div}
            onChange={(e) => handleCheckboxChange('div', e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value=''>All</option>
            <option value='a'>Div A</option>
            <option value='b'>Div B</option>
            <option value='c'>Div C</option>
            <option value='d'>Div D</option>
          </select>
        </div>


        <div className='font-bold'>
          <label htmlFor='admittedYearSelect' className='block text-sm font-medium text-gray-700'>Select Admitted Year:</label>
          <select
            id='admittedYearSelect'
            value={Object.keys(admittedYears).find(year => admittedYears[year]) || ''}
            onChange={(e) => handleCheckboxChange('admitted_year', e.target.value)}
            className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value=''>All</option>
            {Object.keys(admittedYears).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>


        <div className='flex gap-4 items-center mt-4 font-bold'>
          <div className="checkBox flex items-center">
            <input
              type='checkbox'
              id='internshipCheckbox'
              checked={filters.internship}
              onChange={(e) => handleCheckboxChange('internship', e.target.checked)}
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='internshipCheckbox' className='ml-2 text-sm text-gray-700'>Internship</label>
          </div>
          {/* ---- */}
          <div className="checkBox flex items-center">
            <input
              type='checkbox'
              id='placementCheckbox'
              checked={filters.placements}
              onChange={(e) => handleCheckboxChange('placements', e.target.checked)}
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='placementCheckbox' className='ml-2 text-sm text-gray-700'>Placement</label>
          </div>
          {/* ---- */}
          <div className="checkBox flex items-center">
            <input
              type='checkbox'
              id='AchievementChecked'
              checked={filters.achievements}
              onChange={(e) => handleCheckboxChange('achievements', e.target.checked)}
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='AchievementChecked' className='ml-2 text-sm text-gray-700'>Achievement</label>
          </div>
          {/* ---- */}
          <div className="checkBox flex items-center">
            <input
              type='checkbox'
              id='hackathonsChecked'
              checked={filters.hackathons}
              onChange={(e) => handleCheckboxChange('hackathons', e.target.checked)}
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='hackathonsChecked' className='ml-2 text-sm text-gray-700'>Hackathon</label>
          </div>
          {/* ---- */}
          <div className="checkBox flex items-center">
            <input
              type='checkbox'
              id='higher_studiesChecked'
              checked={filters.higher_studies}
              onChange={(e) => handleCheckboxChange('higher_studies', e.target.checked)}
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='higher_studiesChecked' className='ml-2 text-sm text-gray-700'>Higher Studies</label>
          </div>
          {/* ---- */}
          <div className="checkBox flex items-center">
            <input
              type='checkbox'
              id='eccChecked'
              checked={filters.ecc}
              onChange={(e) => handleCheckboxChange('ecc', e.target.checked)}
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='eccChecked' className='ml-2 text-sm text-gray-700'>Extra Activity</label>
          </div>
        </div>

      </div>
      {loading ? (
        <Loaders message={'Fetching Student'} />
      ) : (
        <>




          <div className="overflow-x-auto w-full mt-8">
            {student.length > 0 ? (
              <table id="example" className="table table-striped text-black" style={{ width: '100%' }}>
                <thead>
                  <tr className='capitalize text-center'>
                    <th className='text-sm text-center'>AY</th>
                    <th className='text-sm text-center'>Name</th>
                    <th className='text-sm text-center'>Roll No</th>
                    <th className='text-sm text-center'>Div</th>
                    <th className='text-sm text-center'>Id</th>
                    <th className='text-sm text-center'>Email</th>
                    <th className='text-sm text-center'>Internship</th>
                    <th className='text-sm text-center'>Activity</th>
                    <th className='text-sm text'>Achievement</th>
                    <th className='text-sm text-center'>Hackatons</th>
                    <th className='text-sm text-center'>Higher Study</th>
                    <th className='text-sm text-center'>Placement</th>

                    <th className='text-sm text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {student.length && student.map(student => (
                    <tr key={student.id} className=''>
                      <td className='text-center text-sm'>{student.admitted_year}</td>
                      <td className='text-center text-sm'>{`${student.name} ${student.middle_name} ${student.last_name}`}</td>

                      <td className='text-center text-sm'>{student.roll_no}</td>
                      <td className='text-center text-sm'>{student.div}</td>
                      <td className='text-center text-sm'>{student.student_id}</td>
                      <td className='text-center text-sm'>{student.email}</td>
                      <td className='text-center text-sm'>
                        <button className="certificate">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button className="certificate">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button className="certificate">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button className="certificate">
                          <i className="fa-solid fa-eye"></i>

                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button className="certificate">
                          <i className="fa-solid fa-eye"></i>

                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button className="certificate">
                          <i className="fa-solid fa-eye"></i>

                        </button>
                      </td>


                      <td className='text-center text-sm '>
                        <div className='flex items-center gap-3 justify-center'>
                          <abbr title="Edit">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded " onClick={() => navigate(`/edit/student/${student.id}`)}>
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                          </abbr>
                          <abbr title="Delete">
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 px-3 rounded" onClick={() => handleDelete(student.id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </abbr>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h1 className='text-xl md:text-2xl mt-3 text-center font-bold text-[#262847]'>No Data Available</h1>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default HomeAdmin;
