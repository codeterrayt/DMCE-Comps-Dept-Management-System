export const domains = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app-development", label: "Mobile App Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "devops", label: "DevOps" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "full-stack-development", label: "Full Stack Development" },
  { value: "software-testing", label: "Software Testing/Quality Assurance" },
  { value: "ui-ux-design", label: "UI/UX Design" },
];

export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5;
  const endYear = currentYear + 1;
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    const academicYear = `${year}-${year + 1}`;
    years.push({
      key: academicYear,
      value: academicYear,
    });
  }
  console.log(years);
  return years;
};



