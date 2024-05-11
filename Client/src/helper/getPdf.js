import { jsPDF } from "jspdf";
import "jspdf-autotable";

export async function fetInternshipData(studentIds) {
  const allResponses = [];
  for (const studentId of studentIds) {
    const responseData = await fetchDataForStudent(studentId);
    if (responseData) {
      allResponses.push(responseData);
    }
  }

  // Once all responses are collected, you can process them as needed
  console.log("All responses:", allResponses);
  generatePDF(allResponses);
}

//making pdf

async function generatePDF(data) {
  const doc = new jsPDF();

  const tableColumnNames = [
    "Student ID",
    "Name",
    "Last Name",
    "Student Year",
    "Company Name",
    "Domain",
    "Duration",
  ];
  const tableRows = [];

  data.forEach((student) => {
    student.student_internship.forEach((internship) => {
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

  // Add title before the table
  doc.text("Internship Details", 14, 10);

  doc.autoTable({
    head: [tableColumnNames],
    body: tableRows,
    startY: 20, // Adjust startY to leave space for the title
    margin: { top: 20 }, // Adjust top margin to leave space for the title
  });

  doc.save("students_data.pdf");
  console.log("PDF generated successfully");
}

async function fetchDataForStudent(studentId) {
  try {
    setLoading(true);
    const token = getToken();
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVER_DOMAIN
      }/admin/fetch/student/internship?student_id=${studentId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
    return response.data.data[0];
  } catch (error) {
    console.error(`Error fetching data for student ${studentId}:`, error);
    setLoading(false);
    return null;
  }
}
