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
  const [ageGroups, setAgeGroups] = useState<{
    '0-2': number;
    '3-12': number;
    '13-19': number;
    '20-30': number;
    '31-40': number;
    '41-50': number;
    '51-65': number;
    '65+': number;
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

  const getAnalyticsData = async () => {
    try {
      const res = await fetch(`/api/analytics`);
      const data = await res.json();
      if (data?.data?.ageDistribution) {
        setAgeGroups(data.data.ageDistribution);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };
  useEffect(() => {
    getPatientCount();
    getAnalyticsData();
  }, []);
  const handlePatientSelect = (id: string) => {
    router.push(`/patient?id=${id}`);
  };
  const onAddedPatient = () => {
    getPatientCount();
  }
  return (
    <div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Overview</span>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Dashboard</h1>
          </div>
          <Button type="button" size="lg" onClick={() => router.push('/add-patient')}>
            <UserPlusIcon width={18} height={18} />
            Add patient
          </Button>
        </div>

        {/* Stat strip */}
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border elevate lg:grid-cols-4">
          {[
            { label: 'Patients', value: patientCount },
            { label: 'Total visits', value: visitCount },
            { label: 'Returning', value: returningPatientsCount },
            {
              label: 'Avg visits / patient',
              value: patientCount && visitCount != null ? (visitCount / patientCount).toFixed(1) : null,
            },
          ].map((s) => (
            <div key={s.label} className="bg-card p-5 sm:p-6">
              <div className="eyebrow">{s.label}</div>
              {s.value === null || s.value === undefined ? (
                <Skeleton className="mt-3 h-9 w-16" />
              ) : (
                <div className="mt-1.5 font-serif text-4xl font-semibold tnum text-foreground sm:text-[2.6rem]">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search + browse */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="w-full lg:max-w-md">
            <span className="eyebrow">Find a patient</span>
            <Command
              className="mt-3 w-full overflow-visible rounded-xl border bg-card elevate"
              onChange={setKeyword}
              value={keyword}
            >
              <CommandInput placeholder="Search by name..." className="h-11" />
              <CommandList className="relative">
                {debouncedKeyword.length > 2 && patients.length === 0 && (
                  <CommandEmpty>No patients found!</CommandEmpty>
                )}
                {searching && (
                  <div className="absolute flex w-full justify-center overflow-hidden p-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {patients &&
                  patients.length > 0 &&
                  patients.map((patient, index) => (
                    <CommandItem
                      key={index}
                      className="cursor-pointer"
                      onSelect={() => handlePatientSelect(patient._id)}
                    >
                      {patient.name}
                    </CommandItem>
                  ))}
              </CommandList>
            </Command>
          </div>
          <ListByName />
        </div>
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
      <div className="pb-16 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <span className="eyebrow">Analytics</span>
          <h2 className="mb-6 mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            At a glance
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-8 overflow-hidden">
          {/* Gender Distribution Pie Chart */}
          <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300 w-full max-w-full overflow-hidden">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Gender Distribution
              </CardTitle>
              <CardDescription className="text-sm sm:text-sm">
                Patient distribution by gender
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2 sm:pt-6">
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
                        { name: "Male", value: maleFemaleCount?.male || 0, fill: "var(--color-male)" },
                        { name: "Female", value: maleFemaleCount?.female || 0, fill: "var(--color-female)" },
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
              <CardDescription className="text-sm sm:text-sm">
                Total patients vs returning patients
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2 sm:pt-6">
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
                      label={{ position: 'center', fontSize: 14, fill: 'var(--foreground)', fontWeight: 'bold' }}
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
              <CardDescription className="text-sm sm:text-sm">
                Average visits per patient
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2 sm:pt-6">
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
                      label={{ position: 'center', fontSize: 14, fill: 'var(--foreground)', fontWeight: 'bold' }}
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

          {/* Age Groups Distribution */}
          <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300 w-full max-w-full overflow-hidden">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Age Distribution
              </CardTitle>
              <CardDescription className="text-sm sm:text-sm">
                Patient distribution by age groups
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2 sm:pt-6">
              {ageGroups !== null ? (
                <ChartContainer
                  config={{
                    '0-2': {
                      label: "0-2 years",
                      color: "hsl(var(--chart-1))",
                    },
                    '3-12': {
                      label: "3-12 years",
                      color: "hsl(var(--chart-2))",
                    },
                    '13-19': {
                      label: "13-19 years",
                      color: "hsl(var(--chart-3))",
                    },
                    '20-30': {
                      label: "20-30 years",
                      color: "hsl(var(--chart-4))",
                    },
                    '31-40': {
                      label: "31-40 years",
                      color: "hsl(var(--chart-5))",
                    },
                    '41-50': {
                      label: "41-50 years",
                      color: "hsl(var(--chart-1))",
                    },
                    '51-65': {
                      label: "51-65 years",
                      color: "hsl(var(--chart-2))",
                    },
                    '65+': {
                      label: "65+ years",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[200px] sm:h-[250px]"
                >
                  <BarChart
                    data={[
                      {
                        category: "0-2",
                        value: ageGroups['0-2'],
                        label: "0-2 years",
                      },
                      {
                        category: "3-12",
                        value: ageGroups['3-12'],
                        label: "3-12 years",
                      },
                      {
                        category: "13-19",
                        value: ageGroups['13-19'],
                        label: "13-19 years",
                      },
                      {
                        category: "20-30",
                        value: ageGroups['20-30'],
                        label: "20-30 years",
                      },
                      {
                        category: "31-40",
                        value: ageGroups['31-40'],
                        label: "31-40 years",
                      },
                      {
                        category: "41-50",
                        value: ageGroups['41-50'],
                        label: "41-50 years",
                      },
                      {
                        category: "51-65",
                        value: ageGroups['51-65'],
                        label: "51-65 years",
                      },
                      {
                        category: "65+",
                        value: ageGroups['65+'],
                        label: "65+ years",
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
                      fill="var(--color-0-2)"
                      label={{ position: 'center', fontSize: 12, fill: 'var(--foreground)', fontWeight: 'bold' }}
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
              <CardDescription className="text-sm sm:text-sm">
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
