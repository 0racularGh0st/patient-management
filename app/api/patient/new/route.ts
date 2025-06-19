import { connectToDB } from '@utils/database';
import {
    NextRequest, NextResponse,
} from 'next/server';
import { getServerSession } from "next-auth/next"
import { Patient as PatientType } from '@app/add-patient/types';
import { calculateDateOfBirth } from '@utils/helpers';
import Patient from '@models/patient';

export const POST = async (req: NextRequest, res: NextResponse) => {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({
            code: 401,
            message: 'Unauthorized'
        })
    }
    const { name, sex, ageYears, ageMonths, address, phoneNo, complaint, provisionalDiagnosis, treatment, investigations, weight, dateOfVisit }: PatientType = await req.json();
    const dob = calculateDateOfBirth(ageYears ?? 0, ageMonths ?? 0);
    try {
        await connectToDB();
        const newPatient = new Patient({
            name,
            dob,
            address,
            phoneNo,
            sex,
            visits: [{
                complaint,
                provisionalDiagnosis,
                treatment,
                investigations,
                weight,
                dateOfVisit,
            }]
        })
        await newPatient.save();

        return new Response(JSON.stringify(newPatient), {
            status: 201,
        })
    } catch (error) {
        return new Response("Failed to create Patient", {
            status: 500,
        })
    }
}