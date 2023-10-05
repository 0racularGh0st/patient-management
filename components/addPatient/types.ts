export type Patient = {
    name: string;
    age: number;
    complaint?: string | undefined;
    provisionalDiagnosis?: string | undefined;
    treatment?: string | undefined;
    investigations?: string | undefined;
    weight?: number | undefined;
    dateOfVisit?: string | undefined;
    address?: string | undefined;
    phoneNo?: string | undefined;
}