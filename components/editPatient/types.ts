export type EditPatientData = {
    name: string;
    ageYears: number;
    ageMonths: number;
    address?: string;
    phoneNo?: string;
};

export type EditPatientProps = {
    patient: {
        _id: string;
        name: string;
        ageYears: number;
        ageMonths: number;
        address?: string;
        phoneNo?: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};
