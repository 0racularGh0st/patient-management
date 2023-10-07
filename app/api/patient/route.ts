import { connectToDB } from '@utils/database';
import {
    NextRequest, NextResponse,
} from 'next/server';
import { getServerSession } from "next-auth/next"
import { Patient as PatientType } from '@components/addPatient/types';
import Patient from '@models/patient';

export const GET = async (req: NextRequest) => {
    const session = await getServerSession();
    const url = new URL(req.url)
    const keyword = url.searchParams.get("keyword")
    if (!session) {
        return NextResponse.json({
            code: 401,
            message: 'Unauthorized'
        })
    }

    try {
        await connectToDB();
        const data = await Patient.find({ name: { $regex: keyword, $options: 'i' } }).limit(10);
        return NextResponse.json({
            code: 200,
            data,
        })
    } catch (error) {
        return new Response("Failed to create Patient", {
            status: 500,
        })
    }
}