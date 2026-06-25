import { connectToDB } from '@utils/database';
import {
    NextRequest, NextResponse,
} from 'next/server';
import { auth } from "@/auth"
import { Visit as VisitType } from "@app/add-patient/types";
import Patient from '@models/patient';

export const PATCH = async (req: NextRequest) => {
    const session = await auth();
    if (!session) {
        return NextResponse.json({
            code: 401,
            message: 'Unauthorized'
        })
    }
    const { id, complaint, provisionalDiagnosis, treatment, investigations, weight, dateOfVisit }: VisitType & { id: string} = await req.json();
    try {
        await connectToDB();
        const newVisit = { complaint,
            provisionalDiagnosis,
            treatment,
            investigations,
            weight,
            dateOfVisit,
        }
        const existingPatient = await Patient.findById(id);
        
        existingPatient.visits.push(newVisit);
        await existingPatient.save();
        return new Response(JSON.stringify(existingPatient), {
            status: 201,
        });
    } catch (error) {
        console.error(error);
        return new Response("Failed to add Visit", {
            status: 500,
        })
    }
}