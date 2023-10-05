export const calculateDateOfBirth = (age: number): Date => {
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the birth year based on the age
    const birthYear = currentDate.getFullYear() - age;
  
    // Create a new Date object with the calculated birth year
    const dateOfBirth = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
  
    return dateOfBirth;
  }