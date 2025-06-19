import { connectToDB } from '@/utils/database';
import {
    NextRequest, NextResponse,
} from 'next/server';
import { getServerSession } from "next-auth/next"
import { calculateDateOfBirth } from '@/utils/helpers';
import Patient from '@/models/patient';

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({
            code: 401,
            message: 'Unauthorized'
        })
    }
    
    const { id, name, ageYears, ageMonths, address, phoneNo } = await req.json();

    if (!id) {
        return NextResponse.json({
            code: 400,
            message: 'Patient ID is required'
        })
    }

    try {
        await connectToDB();

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (ageYears !== undefined && ageMonths !== undefined) {
            const dob = calculateDateOfBirth(ageYears ?? 0, ageMonths ?? 0);
            updateData.dob = dob;
        }
        if (address !== undefined) updateData.address = address;
        if (phoneNo !== undefined) updateData.phoneNo = phoneNo;
        
        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedPatient) {
            return NextResponse.json({
                code: 404,
                message: 'Patient not found'
            })
        }
        
        return NextResponse.json({
            code: 200,
            data: updatedPatient,
            message: 'Patient updated successfully'
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        return NextResponse.json({
            code: 500,
            message: 'Failed to update patient'
        })
    }
}
