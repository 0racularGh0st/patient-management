"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListByName from "@components/ListByName";
import AddPatient from "@components/addPatient/addPatient";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useInput from "@utils/hooks/useInput";
import useDebounce from "@utils/hooks/useDebounce";
import { PatientStored } from "@components/addPatient/types";
import { Loader2, UserPlusIcon } from "lucide-react";
import { typographyClass } from "@utils/typographyClasses";
import { Skeleton } from "@components/ui/skeleton";
import { Separator } from "@components/ui/separator";
import { Button } from "@components/ui/button";
const Dashboard = () => {
  const [keyword, setKeyword] = useInput("");
  const debouncedKeyword = useDebounce<string>(keyword, 500);
  const [patients, setPatients] = useState<Array<PatientStored>>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [patientCount, setPatientCount] = useState<number | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [returningPatientsCount, setReturningPatientsCount] = useState<number | null>(null);
  const [maleFemaleCount, setMaleFemaleCount] = useState<{
    male?: number;
    female?: number;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (debouncedKeyword) {
      setSearching(true);
      getPatientsByKeyword(debouncedKeyword);
      return;
    }
    setPatients([]);
  }, [debouncedKeyword]);

  const getPatientsByKeyword = async (keyword: string) => {
    const res = await fetch(`/api/patient?keyword=${keyword}`);
    const data = await res.json();
    if (data?.data) {
      setPatients([...data.data]);
      setSearching(false);
    }
  };

  const getPatientCount = async () => {
    const res = await fetch(`/api/patient?count=true`);
    const data = await res.json();
    setPatientCount(data?.patientCount);
    setVisitCount(data?.visitCount);
    setMaleFemaleCount(data?.maleFemaleCount);
    setReturningPatientsCount(data?.returningPatientsCount);
  };
  useEffect(() => {
    getPatientCount();
  }, []);
  const handlePatientSelect = (id: string) => {
    router.push(`/patient?id=${id}`);
  };
  const onAddedPatient = () => {
    getPatientCount();
  }
  return (
    <div>
      <div className="p-4 sm:p-9 flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-12 min-h-[400px] flex-wrap m-auto w-full">
        <Button
        type='button'
        onClick={() => router.push('/add-patient')}
        className="shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
        >
            <UserPlusIcon width={20} height={20} className='mr-2' />
            <p className={typographyClass['p']}>Add patient</p>
        </Button>
        <Command
          className="w-72 max-w-[calc(100vw-32px) rounded-lg border shadow-sm"
          onChange={setKeyword}
          value={keyword}
        >
          <CommandInput placeholder="Search by name..." className="h-[40px]" />
          <CommandList className="relative">
            {debouncedKeyword.length > 2 && patients.length === 0 && (
              <CommandEmpty>No patients found!</CommandEmpty>
            )}
            {searching && (
              <div className="flex justify-center p-1 z-1 absolute w-[100%] overflow-hidden">
                <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
              </div>
            )}
            {patients &&
              patients.length > 0 &&
              patients.map((patient, index) => (
                <CommandItem
                  key={index}
                  className="cursor-pointer hover:text-accent-foreground hover:bg-accent"
                  onSelect={() => handlePatientSelect(patient._id)}
                >
                  {patient.name}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
        <ListByName />
      </div>
      <div className="p-4 sm:p-9 flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-12 min-h-[400px] flex-wrap m-auto w-full">
        <Card className="w-[220px] shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300">
          <CardHeader>
            <CardTitle>
              <p className={`${typographyClass["p"]} text-lg`}>
                Total Patients
              </p>
            </CardTitle>
            <Separator className="mt-1 mb-1" />
          </CardHeader>
          <CardContent>
            {patientCount !== null ? (
              <CardDescription>
                <span className="text-md font-semibold">{patientCount}</span>
              </CardDescription>
            ) : (
              <Skeleton className="w-[150px] h-[28px]" />
            )}
          </CardContent>
        </Card>
        <Card className="w-[220px] shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300">
          <CardHeader>
            <CardTitle>
              <p className={`${typographyClass["p"]} text-lg`}>Total Visits</p>
            </CardTitle>
            <Separator className="mt-1 mb-1" />
          </CardHeader>
          <CardContent>
            {visitCount !== null ? (
              <CardDescription>
                <span className="text-md font-semibold">{visitCount}</span>
              </CardDescription>
            ) : (
              <Skeleton className="w-[150px] h-[28px]" />
            )}
          </CardContent>
        </Card>
        <Card className="w-[220px] shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300">
          <CardHeader>
            <CardTitle>
              <p className={`${typographyClass["p"]} text-lg`}>Gender Split</p>
            </CardTitle>
            <Separator className="mt-1 mb-1" />
          </CardHeader>
          <CardContent>
            {maleFemaleCount !== null ?
                <div className="flex justify-between">
                  <span className="text-md ">
                    <span className="font-bold">Male: </span>
                    {maleFemaleCount?.male}
                  </span>
                  <span className="text-md ">
                    <span className="font-bold">Female: </span>
                    {maleFemaleCount?.female}
                  </span>
                </div>
               :
              <Skeleton className="w-[150px] h-[28px]" />
            }
          </CardContent>
        </Card>
        <Card className="w-[220px] shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300">
          <CardHeader>
            <CardTitle>
              <span className={`${typographyClass["p"]} text-lg`}>Returning Patients</span>
            </CardTitle>
            <Separator className="mt-1 mb-1" />
          </CardHeader>
          <CardContent>
          {returningPatientsCount !== null ? (
              <CardDescription>
                <span className="text-md font-semibold">{returningPatientsCount}</span>
              </CardDescription>
            ) : (
              <Skeleton className="w-[150px] h-[28px]" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
