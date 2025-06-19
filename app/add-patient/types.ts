export type Patient = {
    name: string;
    ageYears: number;
    ageMonths: number;
    sex: string;
    complaint?: string | undefined;
    provisionalDiagnosis?: string | undefined;
    treatment?: string | undefined;
    investigations?: string | undefined;
    weight?: number | undefined;
    dateOfVisit?: string | undefined;
    address?: string | undefined;
    phoneNo?: string | undefined;
}

export type Visit = {
    complaint?: string | undefined;
    provisionalDiagnosis?: string | undefined;
    treatment?: string | undefined;
    investigations?: string | undefined;
    weight?: number | undefined;
    dateOfVisit?: string | undefined;
}
export type PatientStored = {
    name: string;
    dob: string;
    address?: string | undefined;
    phoneNo?: string | undefined;
    sex?: string | undefined;
    _id: string;
    visits: Array<Visit>;
}