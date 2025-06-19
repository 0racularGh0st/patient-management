import { connectToDB } from '@/utils/database';
import {
    NextRequest, NextResponse,
} from 'next/server';
import { getServerSession } from "next-auth/next"
import Patient from '@/models/patient';

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({
            code: 401,
            message: 'Unauthorized'
        })
    }
    
    const { patientId, visitIndex, complaint, provisionalDiagnosis, treatment, investigations, weight } = await req.json();

    if (!patientId || visitIndex === undefined) {
        return NextResponse.json({
            code: 400,
            message: 'Patient ID and visit index are required'
        })
    }
    
    try {
        await connectToDB();
        
        const patient = await Patient.findById(patientId);
        
        if (!patient) {
            return NextResponse.json({
                code: 404,
                message: 'Patient not found'
            })
        }
        
        if (visitIndex < 0 || visitIndex >= patient.visits.length) {
            return NextResponse.json({
                code: 400,
                message: 'Invalid visit index'
            })
        }
        
        // Update the specific visit
        const visit = patient.visits[visitIndex];
        if (complaint !== undefined) visit.complaint = complaint;
        if (provisionalDiagnosis !== undefined) visit.provisionalDiagnosis = provisionalDiagnosis;
        if (treatment !== undefined) visit.treatment = treatment;
        if (investigations !== undefined) visit.investigations = investigations;
        if (weight !== undefined) visit.weight = weight;

        // Save the updated patient
        await patient.save();
        
        return NextResponse.json({
            code: 200,
            data: patient,
            message: 'Visit updated successfully'
        });
    } catch (error) {
        console.error('Error updating visit:', error);
        return NextResponse.json({
            code: 500,
            message: 'Failed to update visit'
        })
    }
}
