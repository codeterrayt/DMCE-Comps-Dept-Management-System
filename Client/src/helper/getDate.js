export function getDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so we add 1
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatDate(inputDate) {
  // Split the date string into year, month, and day
  var parts = inputDate.split("-");
  var year = parts[0];
  var month = parts[1];
  var day = parts[2];

  // Define an array of short month names
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the short month name based on the month number
  var monthName = monthNames[parseInt(month) - 1];

  // Return the formatted date string
  return day + " " + monthName + ", " + year;
}

// Example usage:
var inputDate = "2024-04-30";
var formattedDate = formatDate(inputDate);
console.log(formattedDate); // Output: 30 Apr, 2024
