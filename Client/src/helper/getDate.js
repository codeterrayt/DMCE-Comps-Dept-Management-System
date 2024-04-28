export function getDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1
    const year = date.getFullYear();

  
    return `${day}-${month}-${year}`;
}

