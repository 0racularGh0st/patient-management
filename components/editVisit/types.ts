export type EditVisitData = {
    complaint?: string;
    provisionalDiagnosis?: string;
    treatment?: string;
    investigations?: string;
    weight?: number;
};

export type EditVisitProps = {
    visit: {
        complaint?: string;
        provisionalDiagnosis?: string;
        treatment?: string;
        investigations?: string;
        weight?: number;
        dateOfVisit?: string;
    };
    patientId: string;
    visitIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};
