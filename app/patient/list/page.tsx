"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PatientStored } from "@components/addPatient/types";
import { typographyClass } from "@utils/typographyClasses";
import { Button } from "@components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { calculateAgeFromDOB } from "@utils/helpers";
const PatientList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const letter = searchParams.get("letter");
  const [patients, setPatients] = useState<Array<PatientStored & { ageYears: number, ageMonths: number, lastWeight: number | string,lastVisit: string, noOfVisits: number}>>([]);

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (letter) {
        getPatientsWithLetter(letter);
    }
  }, [letter]);

  const getPatientsWithLetter= async (letter: string) => {
    setLoading(true);
    const res = await fetch(`/api/patient?letter=${letter}`);
    const data = await res.json();
    console.log('data ->', data.data)
    if (data?.data && data?.data?.length > 0) {
        const patients = data.data.map((patient: PatientStored) => {
            const lastVisit = patient?.visits?.[patient?.visits?.length - 1];
            const ageData = calculateAgeFromDOB(patient.dob);
            return {
                ...patient,
                ageYears: ageData.years,
                ageMonths: ageData.months,
                lastWeight: lastVisit.weight || "-",
                lastVisit: lastVisit.dateOfVisit ? formatDate(lastVisit.dateOfVisit) : "-",
                noOfVisits: patient.visits?.length || 0,
            }
        })
        setPatients(patients);
        setLoading(false);
        return;
    };
    setPatients([]);
    setLoading(false);
  };
  const formatDate = (date: string, withTime = true, withDay = true) => {
    const d = new Date(date);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[d.getDay()];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const dayofVisit = withDay ? `${day},` : "";
    const formattedTime = `${dayofVisit} ${month} ${d.getDate()}, ${year}`;
    const time = withTime ? ` ${hours}:${minutes} ${ampm}` : "";
    return formattedTime + time;
  };
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  return (
    <div className="w-full max-w-[calc(100vw-32px)]">
      <Button
        className="mb-1 mt-4 flex justify-start items-center gap-2 md:sticky md:top-[64px] text-slate-500"
        variant="ghost"
        onClick={() => router.push('/dashboard')}
      >
        <ArrowLeft />
        Back
      </Button>
      <h3
        className={`${typographyClass["h3"]} text-4xl text-center mb-8 text-slate-500`}
      >
        {`Patient List: '${letter?.toUpperCase()}'`}
        <Separator className="mt-2" />
      </h3>
      {letter && (
          <div className="overflow-x-scroll">
            <div className="w-max-[calc(100vw-32px)] flex justify-center gap-2 pb-4 w-fit">
                  {letters.map((letterValue) => 
                      <Button
                          variant={letter.toUpperCase() === letterValue ? 'default' : 'outline'}
                          key={letterValue}
                          onClick={() => { letter.toUpperCase() !== letterValue && router.push(`/patient/list?letter=${letterValue}`)}}
                      >
                          <p>{letterValue}</p>
                      </Button>
                  )}
          </div>
          </div>
      )}
      <Table className="mt-6">
        <TableHeader>
            <TableRow>
                <TableHead className="w-[175px] sticky left-0 bg-[hsl(var(--background))] font-[900]">Name</TableHead>
                <TableHead className="text-right font-[900]">Age</TableHead>
                <TableHead className="font-[900]">Sex</TableHead>
                <TableHead className="text-right w-[275px] font-[900]">Last Visit</TableHead>
                <TableHead className="text-right w-[120px] font-[900]">Last Weight</TableHead>
                <TableHead className="text-right w-[85px] font-[900]">Visits</TableHead>
                <TableHead className="font-[900]">Phone Number</TableHead>
                <TableHead className="font-[900]">Address</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {!loading && patients.length > 0 && patients.map((patient, index) => (
                <TableRow key={patient._id}>
                    <TableCell
                        className="font-medium sticky left-0 bg-[hsl(var(--background))] cursor-pointer flex justify-start items-center gap-2 group"
                        onClick={() => router.push(`/patient?id=${patient._id}`)}
                    >{patient.name} <ExternalLink className="opacity-0 w-4 h4 group-hover:opacity-80 transition-opacity ease-in-out child-element duration-300"/></TableCell>
                    <TableCell className="text-right">{`${patient.ageYears}y ${patient.ageMonths}m`}</TableCell>
                    <TableCell>{patient.sex}</TableCell>
                    <TableCell className="text-right">{patient.lastVisit}</TableCell>
                    <TableCell className="text-right">{patient.lastWeight || '-'} Kgs</TableCell>
                    <TableCell className="text-right">{patient.noOfVisits}</TableCell>
                    <TableCell>{patient.phoneNo  || '-'}</TableCell>
                    <TableCell>{patient.address  || '-'}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
        {!loading && patients.length === 0 && (
                <div>
                    <p className="text-center text-md text-slate-500 mt-6">No patients found!</p>
                </div>
        )}
        {loading && <div className="w-full flex justify-center mt-6">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            </div>}
    </div>
  );
};

export default PatientList;
