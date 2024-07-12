import React, { useEffect, useState } from 'react';
import { getToken } from '../../helper/getToken';
import axios from 'axios';
import { checkLogin } from '../../helper/checkLogin';
import { useNavigate } from 'react-router-dom';
import Loaders3 from '../Loader3';
import Loaders from '../Loaders';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import toast from 'react-hot-toast';
import { getFirstErrorMessage } from '../../helper/getErrorMessage';
import AnimationWrapper from '../Page-Animation';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import AdminNavBar from './AdminNavBar';
import { img } from '../../helper/pdfBackGround';
import { useQuery } from 'react-query';
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
      return navigate('/login');
    }

    const userInsession = localStorage.getItem('dmceuser')
    const { role } = JSON.parse(userInsession)
    if (role != 'admin') {
      return navigate('/dmce/home')
    }
    getAllStudent();
  }, [filters, admittedYears]);

  useEffect(() => {
    if (student.length > 0) {
      new DataTable('#example');
    }
  }, [student]);

  const [studentIds, setStudentId] = useState([])
  console.log(studentIds);

  const getAllStudent = () => {
    setStudentId([])
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
          const studentIds = response.data.map(student => student.id);
          // Store student IDs in state
          setStudentId(studentIds);
          setStudent(response.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status == 401) {
            setLoading(false);
            localStorage.clear()
            navigate('/login')
          }
        });
    }, 500);
  };



  const [selectedCheckbox, setSelectedCheckbox] = useState('');
  const [cats, setCats] = useState([]);

  const [pdfLoading, setPdfLoading] = useState(false)

  const handleCheckboxChange = (name, value) => {
    console.log(name, value);
    if (name == 'internship' || name == 'placements' || name == 'achievements' || name == 'hackathons' || name == 'higher_studies' || name == 'ecc') {
      // Add a new name to the cats array

      if (cats.includes(name)) {
        // If it exists, filter it out and update the state
        const updatedCats = cats.filter(cat => cat !== name);
        setCats(updatedCats);
      } else {
        // If it doesn't exist, add it to the state
        setCats(prevCats => [...prevCats, name]);
      }

      console.log("varad", cats);

      if (value && !selectedCheckbox) {
        setSelectedCheckbox(name);
      } else {
        setSelectedCheckbox('');
      }
    }
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
  // const [newPassword, setNeLwPassword] = useState('');

  const handleChangePassword = (info) => {
    try {
      const confirmOptions = {
        customUI: ({ onClose }) => (
          <Modal classNames={"rounded-md"} open={true} onClose={onClose} center>
            <div className="rounded-md p-6 -z-50 min-w-[200px]">
              <h2 className="font-bold text-xl mb-4">{'Change Password for ' + info.name}</h2>
              <input
                id='pass'
                type="text"
                placeholder="New Password"

                className="border rounded-md px-3 py-2 w-full mb-4"
              />
              <div className="flex items-center gap-4 justify-between">
                <button
                  id='btn'
                  className="py-2 px-4 rounded-md bg-[#262847] text-white"
                  onClick={() => {
                    const newPassword = document.getElementById('pass').value
                    const msgpara = document.getElementById('msg')

                    console.log(newPassword);
                    const btn = document.getElementById('btn')

                    let data = new FormData();
                    data.append('id', info.id);
                    data.append('new_password', newPassword);

                    const token = getToken();

                    let config = {
                      method: 'post',
                      maxBodyLength: Infinity,
                      url: `${import.meta.env.VITE_SERVER_DOMAIN}/admin/update/password`,
                      headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        ...data.getHeaders
                      },
                      data: data
                    };
                    btn.innerText = 'Loading';

                    axios.request(config)
                      .then((response) => {
                        console.log(JSON.stringify(response.data));
                        toast.success('Password changed successfully');
                        onClose(); // Close modal on success
                      })
                      .catch((error) => {
                        console.log(error.response.data);
                        const msg = getFirstErrorMessage(error.response.data)
                        msgpara.innerText = msg
                      });
                  }}

                >
                  Change
                </button>
                <button
                  className="py-2 px-4 rounded-md bg-[#262847] text-white"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
              <div>
                <p className='text-center py-4 p-2 font-bold text-sm text-red-600 underline' id='msg'></p>
              </div>
            </div>
          </Modal>
        ),
      };

      confirmAlert(confirmOptions);
    } catch (error) {
      toast.error(error.message);
    }
  }








  //pdf




  async function fetchDataForStudent(studentId) {
    try {
      const token = getToken()

      const category = cats.length == 1 && cats[0]




      const url = category
        ? `${import.meta.env.VITE_SERVER_DOMAIN}/admin/fetch/student/${category == 'higher_studies' ? 'higher-studies' : category}?student_id=${studentId}`
        : "";
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data[0];
    } catch (error) {
      console.error(`Error fetching data for student ${studentId}:`, error);
      setPdfLoading(false)
      return null;
    }
  }

  // Example usage
  const allResponses = [];

  async function fetchAllDataForStudents() {
    setPdfLoading(true)

    for (const studentId of studentIds) {
      const responseData = await fetchDataForStudent(studentId);
      if (responseData) {
        allResponses.push(responseData);
      }
    }

    // Once all responses are collected, you can process them as needed
    console.log('All responses:', allResponses);
    if (cats[0] === 'internship') {
      generatePDF(allResponses);
    } else if (cats[0] === 'placements') {
      generatePDFInternship(allResponses);
    } else if (cats[0] === 'achievements') {
      generatePDFAchievement(allResponses);
    } else if (cats[0] === 'hackathons') {
      generatePDFHackathon(allResponses);
    } else if (cats[0] === 'higher_studies') {
      generatePDFHigherStudy(allResponses);
    } else if (cats[0] === 'ecc') {
      generatePDFEcc(allResponses);
    }
  }


  //making pdf 

  async function generatePDF(data) {
    const doc = new jsPDF();

    const tableColumnNames = ['ID', 'First', 'Last', 'Year', 'Name', 'Domain', 'Duration'];
    const tableRows = [];

    data.forEach(student => {
      student.student_internship.forEach(internship => {
        tableRows.push([
          student.student_id,
          student.name,
          student.last_name,
          student.admitted_year,
          internship.company_name,
          internship.domain,
          `${internship.duration} months`,
        ]);
      });
    });
      // Calculate position for the logo
      const imgWidth = 15; 
      const imgHeight = 15; 
      const imgX = doc.internal.pageSize.getWidth() - imgWidth - 15; 
      const imgY = 5; 
    
     
    
      doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
    
    
      doc.setFontSize(14);
      doc.text('Internship Details', 14, 10);
      doc.setFontSize(9);
      doc.text('This Data Is From Official DMCE-Computer Data Management System', 14, 18);

    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 22, // Adjust startY to leave space for the title
      margin: { top: 20 }, // Adjust top margin to leave space for the title
      styles: {
        fontSize: 8 // Set the font size for the table data
      }
    });
    setPdfLoading(false)
    doc.save('Student Internship detail.pdf');
    console.log('PDF generated successfully');
  }

  async function generatePDFEcc(data) {
    const doc = new jsPDF();

    const tableColumnNames = ['ID', 'First', 'Last', 'Year', 'College', 'Level', 'Domain', 'Date', 'Prize'];
    const tableRows = [];

    data.forEach(student => {
      student.student_extra_curr.forEach(ecc => {
        tableRows.push([
          student.student_id,
          student.name,
          student.last_name,
          ecc.student_year,
          ecc.college_name,
          ecc.ecc_level,
          ecc.ecc_domain,
          ecc.ecc_date,
          ecc.prize,
        ]);
      });
    });

    const imgWidth = 15; 
    const imgHeight = 15; 
    const imgX = doc.internal.pageSize.getWidth() - imgWidth - 15; 
    const imgY = 5; 
  
   
  
    doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
  
  
    doc.setFontSize(14);
    doc.text('Extracurricular Activity Details', 14, 10);
    doc.setFontSize(9);
    doc.text('This Data Is From Official DMCE-Computer Data Management System', 14, 18);

    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 22, // Adjust startY to leave space for the title
      margin: { top: 20 }, // Adjust top margin to leave space for the title
      styles: {
        fontSize: 8 // Set the font size for the table data
      }
    }); setPdfLoading(false)

    doc.save('extracurricular_activity_data.pdf');
    console.log('PDF generated successfully');
  }

  async function generatePDFAchievement(data) {
    const doc = new jsPDF();

    const tableColumnNames = ['ID', 'First', 'Last', 'Year', 'College', 'Domain', 'Level', 'Duration', 'Prize'];
    const tableRows = [];

    data.forEach(student => {
      student.student_achievements.forEach(achievement => {
        tableRows.push([
          student.student_id,
          student.name,
          student.last_name,
          achievement.student_year,
          achievement.college_name,
          achievement.achievement_domain,
          achievement.achievement_level,
          achievement.achievement_date,
          achievement.prize,
        ]);
      });
    });

    const imgWidth = 15; 
    const imgHeight = 15; 
    const imgX = doc.internal.pageSize.getWidth() - imgWidth - 15; 
    const imgY = 5; 
  
   
  
    doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
  
  
    doc.setFontSize(14);
    doc.text('Achievement Details', 14, 10);
    doc.setFontSize(9);
    doc.text('This Data Is From Official DMCE-Computer Data Management System', 14, 18);

    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 22, // Adjust startY to leave space for the title
      margin: { top: 20 }, // Adjust top margin to leave space for the title
      styles: {
        fontSize: 8 // Set the font size for the table data
      }
    }); setPdfLoading(false)

    doc.save('achievement_data.pdf');
    console.log('PDF generated successfully');
  }

  async function generatePDFHackathon(data) {
    const doc = new jsPDF();

    const tableColumnNames = ['ID', 'FIrst', 'Last', 'Year', 'Title', 'Level', 'Date', 'Prize', 'Position', 'College'];
    const tableRows = [];

    data.forEach(student => {
      student.student_hackathons.forEach(hackathon => {
        tableRows.push([
          student.student_id,
          student.name,
          student.last_name,
          hackathon.student_year,
          hackathon.hackathon_title,
          hackathon.hackathon_level,
          hackathon.hackathon_from_date,
          hackathon.hackathon_prize,
          hackathon.hackathon_position,
          hackathon.hackathon_college_name
        ]);
      });
    });

    const imgWidth = 15; 
    const imgHeight = 15; 
    const imgX = doc.internal.pageSize.getWidth() - imgWidth - 15; 
    const imgY = 5; 
  
   
  
    doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
  
  
    doc.setFontSize(14);
    doc.text('Hackathons Details', 14, 10);
    doc.setFontSize(9);
    doc.text('This Data Is From Official DMCE-Computer Data Management System', 14, 18);

    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 22, // Adjust startY to leave space for the title
      margin: { top: 20 }, // Adjust top margin to leave space for the title
      styles: {
        fontSize: 8 // Set the font size for the table data
      }
    });
    setPdfLoading(false);

    doc.save('hackathon_data.pdf');
    console.log('PDF generated successfully');
  }


  async function generatePDFHigherStudy(data) {
    const doc = new jsPDF();

    const tableColumnNames = [
      'ID', 'First', 'Last', 'Exam', 'Score', 'City', 'State', 'Country', 'University Name', 'Course'
    ];
    const tableRows = [];



    
  
    data.forEach(student => {
      student.student_higher_studies.forEach(higherStudy => {
        tableRows.push([
          student.student_id,
          student.name,
          student.last_name,
          higherStudy.student_exam_type,
          higherStudy.student_score,
          higherStudy.university_city,
          higherStudy.university_state,
          higherStudy.university_country,
          higherStudy.university_name,
          higherStudy.student_course,
        ]);
      });
    });

  
  
  
    const imgWidth = 15; 
    const imgHeight = 15; 
    const imgX = doc.internal.pageSize.getWidth() - imgWidth - 15; 
    const imgY = 5; 
  
   
  
    doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
  
  
    doc.setFontSize(14);
    doc.text('Student Higher Studies Details', 14, 10);
    doc.setFontSize(9);
    doc.text('This Data Is From Official DMCE-Computer Data Management System', 14, 18);
  
    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 22, 
      margin: { top: 20 }, 
      styles: {
        fontSize: 8 
      }
    });
  
    setPdfLoading(false);
  
    // Save the PDF file
    doc.save('student_higher_studies_data.pdf');
    console.log('PDF generated successfully');
  }

 

//placemnet wala function
  async function generatePDFInternship(data) {
    const doc = new jsPDF();

    const tableColumnNames = ['ID', 'First', 'Last', 'Year', 'Company', 'Position', 'Country', 'City', 'State'];
    const tableRows = [];

    data.forEach(student => {
      student.student_placements.forEach(placement => {
        tableRows.push([
          student.student_id,
          student.name,
          student.last_name,
          student.admitted_year,
          placement.company_name,
          placement.position,
          placement.country,
          placement.city,
          placement.state,
        ]);
      });
    });

      // Calculate position for the logo
      const imgWidth = 15; 
    const imgHeight = 15; 
    const imgX = doc.internal.pageSize.getWidth() - imgWidth - 15; 
    const imgY = 5; 
  
   
  
    doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
  
  
    doc.setFontSize(14);
    doc.text('Student Placement Details', 14, 10);
    doc.setFontSize(9);
    doc.text('This Data Is From Official DMCE-Computer Data Management System', 14, 18);
    

    // Add title before the table


    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 22, // Adjust startY to leave space for the title
      margin: { top: 20 }, // Adjust top margin to leave space for the title
      styles: {
        fontSize: 8 // Set the font size for the table data
      }
    }); setPdfLoading(false)

    doc.save('student_placement_data.pdf');
    console.log('PDF generated successfully');
  }





  return (
    <section className='min-h-screen w-full  '>

      <AdminNavBar />
      <div className='w-full p-4 flex items-center gap-4 max-md:gap-3 border-b-2 '>
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
          {
            cats.length == 1 && <button onClick={fetchAllDataForStudents} className='p-2 text-red-600 text-2xl rounded-md' ><i className="fa-solid fa-file-pdf"></i> </button>
          }
        </div>

      </div>
      {pdfLoading ? (
        <Loaders3 />
      ) : loading ? <Loaders message={'Fetching student'} /> : (
        <AnimationWrapper>




          <div className="overflow-x-auto w-full mt-4 px-4 ">
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
                        <button onClick={() => navigate(`/admin/internship/${student.id}`)} className="certificate">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button onClick={() => navigate(`/admin/ecc/${student.id}`)} className="certificate">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button onClick={() => navigate(`/admin/achivement/${student.id}`)} className="certificate">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button onClick={() => navigate(`/admin/hackathon/${student.id}`)} className="certificate">
                          <i className="fa-solid fa-eye"></i>

                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button onClick={() => navigate(`/admin/higher-studies/${student.id}`)} className="certificate">
                          <i className="fa-solid fa-eye"></i>

                        </button>
                      </td>
                      <td className='text-center text-sm'>
                        <button onClick={() => navigate(`/admin/placement/${student.id}`)} className="certificate">
                          <i className="fa-solid fa-eye"></i>

                        </button>
                      </td>


                      <td className='text-center text-sm '>
                        <div className='flex items-center gap-3 justify-center'>
                          <abbr title="change password">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded " onClick={() => handleChangePassword({ name: student.name, id: student.id })}>
                              <i className='fa-solid fa-lock'></i>
                            </button>
                          </abbr>
                          <abbr title="Edit">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 px-3 rounded " onClick={() => navigate(`/admin/edit-profile/${student.id}`)}>
                              <i className='fa-solid fa-pen'></i>
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
        </AnimationWrapper>
      )}
    </section>
  );
};

export default HomeAdmin;
