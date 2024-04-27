import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [formData, setFormData] = useState(new FormData());

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === 'achievement_certificate_path') {
      formData.set(id, files[0]);
    } else {
      formData.set(id, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/student/add/achievement',
        formData,
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer 1|s2wCi5nCxdjniFkTDdK9MNPdipHh46cc5JQ92tX759ff1712',
            'Content-Type': 'multipart/form-data',
          },
          maxBodyLength: Infinity,
        }
      );
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Upload Achievement Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="academic_year">Academic Year:</label>
        <input type="text" id="academic_year" name="academic_year" required onChange={handleChange} /><br /><br />

        <label htmlFor="student_year">Student Year:</label>
        <input type="text" id="student_year" name="student_year" required onChange={handleChange} /><br /><br />

        <label htmlFor="college_name">College Name:</label>
        <input type="text" id="college_name" name="college_name" required onChange={handleChange} /><br /><br />

        <label htmlFor="achievement_domain">Achievement Domain:</label>
        <input type="text" id="achievement_domain" name="achievement_domain" required onChange={handleChange} /><br /><br />

        <label htmlFor="achievement_level">Achievement Level:</label>
        <input type="text" id="achievement_level" name="achievement_level" required onChange={handleChange} /><br /><br />

        <label htmlFor="achievement_location">Achievement Location:</label>
        <input type="text" id="achievement_location" name="achievement_location" required onChange={handleChange} /><br /><br />

        <label htmlFor="achievement_date">Achievement Date:</label>
        <input type="text" id="achievement_date" name="achievement_date" required onChange={handleChange} /><br /><br />

        <label htmlFor="achievement_certificate_path">Achievement Certificate:</label>
        <input type="file" id="achievement_certificate_path" name="achievement_certificate_path" required onChange={handleChange} /><br /><br />

        <label htmlFor="prize">Prize:</label>
        <input type="text" id="prize" name="prize" required onChange={handleChange} /><br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadForm;
