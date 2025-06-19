export const calculateDateOfBirth = (ageYears: number, ageMonths: number): Date => {
    // Get the current date
    const currentDate = new Date();

    // Calculate the birth date by subtracting years and months
    const birthDate = new Date(currentDate);
    birthDate.setFullYear(currentDate.getFullYear() - ageYears);
    birthDate.setMonth(currentDate.getMonth() - ageMonths);

    return birthDate;
  }

export const calculateAgeFromDOB = (dob: string | Date): { years: number; months: number } => {
    const birthDate = new Date(dob);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();

    // Adjust if the current month/day is before the birth month/day
    if (months < 0 || (months === 0 && currentDate.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
    }

    // Adjust for day of month
    if (currentDate.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) {
            months = 11;
            years--;
        }
    }

    return { years: Math.max(0, years), months: Math.max(0, months) };
  }