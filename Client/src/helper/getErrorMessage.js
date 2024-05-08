export function getFirstErrorMessage(responseJSON) {
    // Parse the JSON
    var responseData = responseJSON

    // Extract the error message dynamically
    var errorMessage;

    for (var key in responseData.errors) {
        if (responseData.errors.hasOwnProperty(key)) {
            errorMessage = responseData.errors[key][0];
            break; // Stop iteration after finding the first error message
        }
    }

    console.log('errorMessage');
    console.log(errorMessage);
    return errorMessage;
}