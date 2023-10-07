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
    const keyword = url.searchParams.get("keyword");
    const id = url.searchParams.get("id");
    const count = url.searchParams.get("count");
    if (!session) {
        return NextResponse.json({
            code: 401,
            message: 'Unauthorized'
        })
    }
    try {
        await connectToDB();
        if (keyword && !id && !count) {
            const data = await Patient.find({ name: { $regex: keyword, $options: 'i' } }).limit(10);
            return NextResponse.json({
                code: 200,
                data,
            })
        }
        if (id && !count) {
            const data = await Patient.findById(id);
            return NextResponse.json({
                code: 200,
                data,
            })
        }
        if (count) {
            const patientCount = await Patient.countDocuments();
            // return the total number of visits in Patient collection by addiding the size of visits array in each document
            const visitCount = await Patient.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $size: "$visits" } }
                    }
                }
            ])
            
            const maleFemaleCount = await Patient.aggregate([
                {
                    $group: {
                        _id: "$sex",
                        total: { $sum: 1 }
                    }
                }
            ])
            const maleFemaleCountObj = maleFemaleCount.reduce((acc, curr) => {
                acc[curr._id.toLowerCase()] = curr.total;
                return acc;
            }, {})

            const returningPatientsCount = await Patient.aggregate([
                {
                    $match: {
                        $expr: {
                            $gt: [{ $size: "$visits" }, 1]
                        }
                    }
                },
                {
                    $count: "total"
                }
            ])
            return NextResponse.json({
                code: 200,
                patientCount,
                visitCount: (visitCount && visitCount.length > 0) ? visitCount[0]?.total : 0,
                maleFemaleCount: { male: maleFemaleCountObj?.male || 0, female: maleFemaleCountObj?.female || 0},
                returningPatientsCount: (returningPatientsCount && returningPatientsCount.length > 0) ? returningPatientsCount[0]?.total : 0,
            })
        }
    } catch (error) {
        return new Response("Failed to create Patient", {
            status: 500,
        })
    }
}