import axios from "axios";
import FormData from "form-data";

// let data = new FormData();
// data.append("academic_year", "2021 - 2022");
// data.append("student_year", "TE");
// data.append("college_name", "DMCE");
// data.append("achievement_domain", "WebDev");
// data.append("achievement_level", "National");
// data.append("achievement_location", "airoli");
// data.append("achievement_date", "02-04-2024");

// // Get the file input element
// let fileInput = document.getElementById("fileInput"); // assuming your file input has id="fileInput"

// // Check if a file is selected
// if (fileInput.files.length > 0) {
//   // Append the file to FormData
//   data.append("achievement_certificate_path", fileInput.files[0]);
// }

// data.append("prize", "1");

// let config = {
//   method: "post",
//   maxBodyLength: Infinity,
//   url: "http://127.0.0.1:8000/api/student/add/achievement",
//   headers: {
//     Accept: "application/json",
//     Authorization: "Bearer 1|s2wCi5nCxdjniFkTDdK9MNPdipHh46cc5JQ92tX759ff1712",
//     ...data.getHeaders(),
//   },
//   data: data,
// };

// axios
//   .request(config)
//   .then((response) => {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch((error) => {
//     console.log(error);
//   });
