import { connectToDB } from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import Patient from '@/models/patient';

export const GET = async (req: NextRequest) => {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({
            code: 401,
            message: 'Unauthorized'
        })
    }

    try {
        await connectToDB();

        // Get age distribution data
        const patients = await Patient.find({}, { dob: 1, sex: 1, visits: 1 });
        
        const ageGroups = {
            '0-18': 0,
            '19-35': 0,
            '36-50': 0,
            '51-65': 0,
            '65+': 0
        };

        const currentDate = new Date();
        
        patients.forEach(patient => {
            if (patient.dob) {
                const birthDate = new Date(patient.dob);
                const age = currentDate.getFullYear() - birthDate.getFullYear();
                
                if (age <= 18) ageGroups['0-18']++;
                else if (age <= 35) ageGroups['19-35']++;
                else if (age <= 50) ageGroups['36-50']++;
                else if (age <= 65) ageGroups['51-65']++;
                else ageGroups['65+']++;
            }
        });

        // Get monthly registration data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyData = await Patient.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Get visit frequency distribution
        const visitFrequency = await Patient.aggregate([
            {
                $project: {
                    visitCount: { $size: "$visits" }
                }
            },
            {
                $group: {
                    _id: "$visitCount",
                    patientCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        return NextResponse.json({
            code: 200,
            data: {
                ageDistribution: ageGroups,
                monthlyRegistrations: monthlyData,
                visitFrequency: visitFrequency
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({
            code: 500,
            message: 'Failed to fetch analytics data'
        })
    }
}
