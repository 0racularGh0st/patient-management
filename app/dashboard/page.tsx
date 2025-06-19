"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListByName from "@/components/ListByName";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import useInput from "@/utils/hooks/useInput";
import useDebounce from "@/utils/hooks/useDebounce";
import { PatientStored } from "@/app/add-patient/types";
import { Loader2, UserPlusIcon, TrendingUp, Users, Activity } from "lucide-react";
import { typographyClass } from "@/utils/typographyClasses";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
      <div className="p-3 sm:p-9 flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-10 flex-wrap m-auto w-full max-w-[calc(100%-24px)]">
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
      {/* <div className="p-4 sm:p-9 flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-12 min-h-[400px] flex-wrap m-auto w-full">
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
      </div> */}

      {/* Analytics Charts Section */}
      <div className="pb-10">
        <h2 className={`${typographyClass["h2"]} text-xl sm:text-2xl mb-4 sm:mb-6 text-center`}>
          Analytics Dashboard
          <Separator className="mt-2" />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8 max-w-7xl mx-auto overflow-hidden">
          {/* Gender Distribution Pie Chart */}
          <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300 w-full max-w-full overflow-hidden">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Gender Distribution
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Patient distribution by gender
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-2 sm:pt-6">
              {maleFemaleCount !== null ? (
                <ChartContainer
                  config={{
                    male: {
                      label: "Male",
                      color: "hsl(var(--chart-1))",
                    },
                    female: {
                      label: "Female",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[200px] sm:h-[250px] max-w-[100%]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={[
                        { name: "Male", value: maleFemaleCount.male || 0, fill: "var(--color-male)" },
                        { name: "Female", value: maleFemaleCount.female || 0, fill: "var(--color-female)" },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                    />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="h-[200px] sm:h-[250px] flex items-center justify-center">
                  <Skeleton className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Overview Bar Chart */}
          <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300 w-full max-w-full overflow-hidden">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                Patient Overview
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Total patients vs returning patients
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-2 sm:pt-6">
              {patientCount !== null && returningPatientsCount !== null ? (
                <ChartContainer
                  config={{
                    total: {
                      label: "Total Patients",
                      color: "hsl(var(--chart-1))",
                    },
                    returning: {
                      label: "Returning Patients",
                      color: "hsl(var(--chart-2))",
                    },
                    new: {
                      label: "New Patients",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[200px] sm:h-[250px] max-w-[100%]"
                >
                  <BarChart
                    data={[
                      {
                        category: "Total",
                        value: patientCount,
                        label: "Total Patients",
                        fill: "hsl(var(--chart-1))",
                      },
                      {
                        category: "Returning",
                        value: returningPatientsCount,
                        label: "Returning Patients",
                        fill: "hsl(var(--chart-2))",
                      },
                      {
                        category: "New",
                        value: patientCount - returningPatientsCount,
                        label: "New Patients",
                        fill: "hsl(var(--chart-3))",
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="value"
                      label={{ position: 'top', fontSize: 14, fill: 'var(--foreground)' }}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[200px] sm:h-[250px] flex items-center justify-center">
                  <Skeleton className="w-full h-[160px] sm:h-[200px]" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visit Statistics */}
          <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300 w-full max-w-full overflow-hidden">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Visit Statistics
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Average visits per patient
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pt-2 sm:pt-6">
              {patientCount !== null && visitCount !== null ? (
                <ChartContainer
                  config={{
                    visits: {
                      label: "Visits",
                      color: "hsl(var(--chart-1))",
                    },
                    patients: {
                      label: "Patients",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[200px] sm:h-[250px] max-w-[100%]"
                >
                  <BarChart
                    data={[
                      {
                        category: "Visits",
                        value: visitCount,
                        label: "Total Visits",
                        fill: "hsl(var(--chart-1))",
                      },
                      {
                        category: "Patients",
                        value: patientCount,
                        label: "Total Patients",
                        fill: "hsl(var(--chart-2))",
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar
                      dataKey="value"
                      label={{ position: 'top', fontSize: 14, fill: 'var(--foreground)' }}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[200px] sm:h-[250px] flex items-center justify-center">
                  <Skeleton className="w-full h-[160px] sm:h-[200px]" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Metrics Summary */}
          <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300 w-full max-w-full overflow-hidden">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Key Metrics</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Important statistics at a glance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 sm:pt-6">
              <div className="space-y-4">
                {patientCount !== null && visitCount !== null ? (
                  <>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-muted rounded-lg">
                      <span className="font-medium text-sm sm:text-base">Average Visits per Patient</span>
                      <span className="text-lg sm:text-2xl font-bold text-primary">
                        {patientCount > 0 ? (visitCount / patientCount).toFixed(1) : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-muted rounded-lg">
                      <span className="font-medium text-sm sm:text-base">Return Rate</span>
                      <span className="text-lg sm:text-2xl font-bold text-primary">
                        {patientCount > 0 ? ((returningPatientsCount || 0) / patientCount * 100).toFixed(1) : "0"}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-muted rounded-lg">
                      <span className="font-medium text-sm sm:text-base">Male to Female Ratio</span>
                      <span className="text-lg sm:text-2xl font-bold text-primary">
                        {maleFemaleCount?.male && maleFemaleCount?.female
                          ? `${(maleFemaleCount.male / maleFemaleCount.female).toFixed(1)}:1`
                          : "N/A"
                        }
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="w-full h-[50px] sm:h-[60px]" />
                    <Skeleton className="w-full h-[50px] sm:h-[60px]" />
                    <Skeleton className="w-full h-[50px] sm:h-[60px]" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
