"use client";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, PencilIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PatientStored } from "@/app/add-patient/types";
import { typographyClass } from "@/utils/typographyClasses";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import EditPatientModal from "@/components/editPatient/editPatientModal";
import EditVisitModal from "@/components/editVisit/editVisitModal";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateAgeFromDOB } from "@/utils/helpers";

import AddVisit from "@/components/addVisit/addVisit";
const Patient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [patient, setPatient] = useState<
    | (PatientStored & {
        ageYears: number;
        ageMonths: number;
        lastWeight: number | string;
        lastVisit: string;
      })
    | null
  >(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editVisitModal, setEditVisitModal] = useState<{
    isOpen: boolean;
    visitIndex: number;
    visit: any;
  }>({
    isOpen: false,
    visitIndex: -1,
    visit: null,
  });
  const getPatientDetails = useCallback(async (id: string) => {
    const res = await fetch(`/api/patient?id=${id}`);
    const data = await res.json();
    if (data?.data) {
      const lastVisit = data.data?.visits?.[data.data?.visits?.length - 1];
      const ageData = calculateAgeFromDOB(data.data.dob);
      setPatient({
        ...data.data,
        ageYears: ageData.years,
        ageMonths: ageData.months,
        lastWeight: lastVisit.weight || "-",
        lastVisit: formatDate(lastVisit.dateOfVisit) || "-",
        visits: data.data.visits?.reverse(),
      });
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getPatientDetails(id);
    }
  }, [id, getPatientDetails]);

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
  const onAddedVisit = () => {
    if (id) {
      getPatientDetails(id);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    if (id) {
      getPatientDetails(id);
    }
  };

  const handleEditVisitClick = (visitIndex: number, visit: any) => {
    // Since visits are reversed in the frontend, we need to calculate the correct database index
    const totalVisits = patient?.visits?.length || 0;
    const databaseIndex = totalVisits - 1 - visitIndex;

    setEditVisitModal({
      isOpen: true,
      visitIndex: databaseIndex,
      visit,
    });
  };

  const handleEditVisitModalClose = () => {
    setEditVisitModal({
      isOpen: false,
      visitIndex: -1,
      visit: null,
    });
  };

  const handleEditVisitSuccess = () => {
    if (id) {
      getPatientDetails(id);
    }
  };
  return (
    <div className="w-full max-w-[calc(100vw-32px)] pb-10">
      <Button
        className="mb-1 flex justify-start items-center gap-2 md:sticky md:top-[64px] text-slate-500 bg-[hsl(var(--background))]"
        variant="ghost"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        Back
      </Button>
      <h3
        className={`${typographyClass["h3"]} text-4xl text-center mb-8 text-slate-500`}
      >
        Patient Details
        <Separator className="mt-2" />
      </h3>
      <div className="m-auto flex flex-col gap-6 w-[900px] max-w-[calc(100vw-32px)]">
        <div className="flex gap-10 flex-col md:flex-row md:justify-between md:items-start">
          <div className="flex flex-col md:w-[37%] md:sticky md:top-[120px]">
            <h3 className={`${typographyClass["h3"]} text-3xl w-max`}>
              {loaded ? (
                patient?.name
              ) : (
                <Skeleton className="w-[200px] h-[38px]" />
              )}
              <Separator className="mt-1 mb-2" />
            </h3>

            {loaded ? (
              <>
                <p className={`${typographyClass["p"]} text-slate-500`}>
                    <span className="font-semibold">Age:</span>{" "}
                    {patient?.ageYears !== undefined && patient?.ageMonths !== undefined
                      ? `${patient.ageYears} yrs ${patient.ageMonths} months`
                      : "-"}
                </p>
                <p className={`${typographyClass["p"]} text-slate-500`}>
                    <span className="font-semibold">Sex:</span>{" "}
                    {`${patient?.sex || "-"}`}
                </p>
                <p className={`${typographyClass["p"]} text-slate-500`}>
                        <span className="font-semibold">Last visit:</span>{" "}
                        {`${patient?.lastVisit || "-"}`}
                </p>
                <p className={`${typographyClass["p"]} text-slate-500`}>
                        <span className="font-semibold">Weight during last visit:</span>{" "}
                        {`${patient?.lastWeight || "-"} Kgs`}
                </p>
                <p className={`${typographyClass["p"]} text-slate-500`}>
                        <span className="font-semibold">Address:</span>{" "}
                        {`${patient?.address || "-"}`}
                </p>
                <p className={`${typographyClass["p"]} text-slate-500`}>
                        <span className="font-semibold">Phone No:</span>{" "}
                        {`${patient?.phoneNo || "-"}`}
                </p>
              </>
            ) : (
              <><Skeleton className="w-[180px] h-[16px] mb-1" /><Skeleton className="w-[220px] h-[16px] mb-1" /><Skeleton className="w-[160px] h-[16px] mb-1" /><Skeleton className="w-[200px] h-[16px] mb-1" /><Skeleton className="w-[190px] h-[16px] mb-1" /></>
            )}
            <Button
                className="w-fit mt-2"
                variant="outline"
                onClick={handleEditClick}
                disabled={!loaded}
            >
                <PencilIcon className="mr-[6px] w-[14px] h-[14px]" />
                Edit
            </Button>
          </div>
          <div className="flex flex-col md:w-[63%]">
            <div className="sticky top-[72px] bg-[hsl(var(--background))] z-10">
              <div className="flex gap-2 justify-between items-center flex-wrap">
                <p className="w-[122px]"></p>
                <h3
                  className={`${typographyClass["h4"]} text-2xl w-max m-auto`}
                >
                  Visits{" "}
                  <span className="text-slate-500">{`(${
                    patient?.visits?.length || 0
                  })`}</span>
                </h3>
                <AddVisit id={id || ""} onSuccess={onAddedVisit} />
              </div>
              <Separator className="mt-2" />
            </div>
            <Accordion type="single" collapsible className="w-full">
              {patient?.visits?.map((visit, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="opacity-75 hover:no-underline group">
                    <div className="flex justify-between items-center w-full pr-4">
                      <p>
                        <span className="font-semibold text-slate-500">
                          Visit Date:{" "}
                        </span>
                        {formatDate(visit.dateOfVisit || "", false, false)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVisitClick(index, visit);
                        }}
                      >
                        <PencilIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-1 text-slate-500 text-[16px]">
                      <p>
                        <span className="font-semibold ">Complaint: </span>
                        {visit?.complaint?.split(/\n/g).map((line, index) => <span key={`${index}-complaint`}>{line}<br /></span>) || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold ">Investigations: </span>
                        {visit?.investigations?.split(/\n/g).map((line, index) => <span key={`${index}-investigation`}>{line}<br /></span>) || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold ">
                          Provisional Diagnosis:{" "}
                        </span>
                        {visit?.provisionalDiagnosis?.split(/\n/g).map((line, index) => <span key={`${index}-diagnosis`}>{line}<br /></span>) || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold ">Treatment: </span>
                        {visit?.treatment?.split(/\n/g).map((line, index) => <span key={`${index}-treatment`}>{line}<br /></span>) || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold ">
                          Weight during visit:{" "}
                        </span>
                        {visit?.weight || "-"} Kgs
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {!loaded && (
                <><Skeleton className="w-[100%] h-[16px] mt-[16px] mb-[16px]" /><Skeleton className="w-[100%] h-[16px] mt-[16px] mb-[16px]" /><Skeleton className="w-[100%] h-[16px] mt-[16px] mb-[16px]" /><Skeleton className="w-[100%] h-[16px] mt-[16px] mb-[16px]" /></>
            )}
          </div>
        </div>

        {/* Patient Charts Section */}
        {loaded && patient?.visits && patient.visits.length > 1 && (
          <div className="w-full mt-8">
            <h3 className={`${typographyClass["h4"]} text-2xl mb-4 text-center`}>
              Health Trends
              <Separator className="mt-2" />
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-full">
              {/* Weight Progression Chart */}
              {(() => {
                const formatDateWithOrdinal = (dateString: string) => {
                  if (!dateString) return '';
                  const date = new Date(dateString);
                  const day = date.getDate();
                  const month = date.toLocaleDateString('en-US', { month: 'long' });
                  const year = date.getFullYear();

                  const getOrdinalSuffix = (day: number) => {
                    if (day > 3 && day < 21) return 'th';
                    switch (day % 10) {
                      case 1: return 'st';
                      case 2: return 'nd';
                      case 3: return 'rd';
                      default: return 'th';
                    }
                  };

                  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
                };

                const weightData = patient.visits
                  .slice()
                  .reverse() // Reverse to show chronological order
                  .map((visit, index) => ({
                    visit: `Visit ${index + 1}`,
                    weight: visit.weight || null,
                    date: visit.dateOfVisit ? formatDateWithOrdinal(visit.dateOfVisit) : '',
                  }))
                  .filter(item => item.weight !== null && item.weight !== undefined);

                return weightData.length > 1 ? (
                  <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300">
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                        Weight Progression
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Weight changes over visits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 sm:pt-4 px-0">
                      <ChartContainer
                        config={{
                          weight: {
                            label: "Weight (kg)",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[200px] sm:h-[250px] max-w-[calc(100%-24px)]"
                      >
                        <LineChart data={weightData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="visit" />
                          <YAxis />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent
                              formatter={(value) => [
                                `${value} kg`
                              ]}
                              labelFormatter={(label, payload) => {
                                if (payload && payload[0]) {
                                  return `${label} - ${payload[0].payload.date}`;
                                }
                                return label;
                              }}
                            />}
                          />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="var(--color-weight)"
                            strokeWidth={2}
                            dot={{ fill: "var(--color-weight)", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                ) : null;
              })()}

              {/* Visit Frequency Chart */}
              {(() => {
                const visitsByMonth = patient.visits
                  .slice()
                  .reverse()
                  .reduce((acc, visit) => {
                    if (visit.dateOfVisit) {
                      const date = new Date(visit.dateOfVisit);
                      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
                      acc[monthYear] = (acc[monthYear] || 0) + 1;
                    }
                    return acc;
                  }, {} as Record<string, number>);

                const visitFrequencyData = Object.entries(visitsByMonth)
                  .map(([month, visits]) => ({
                    month,
                    visits,
                  }))
                  .slice(-6); // Last 6 months

                return visitFrequencyData.length > 1 ? (
                  <Card className="shadow-sm hover:shadow-md transition-shadow ease-in-out duration-300">
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                        Visit Frequency
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Visits per month (last 6 months)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 sm:pt-4 px-0">
                      <ChartContainer
                        config={{
                          visits: {
                            label: "Visits",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[200px] sm:h-[250px] max-w-[calc(100%-24px)]"
                      >
                        <BarChart data={visitFrequencyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                          />
                          <Bar
                            dataKey="visits"
                            fill="var(--color-visits)"
                            maxBarSize={50}
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Edit Patient Modal */}
      {patient && (
        <EditPatientModal
          patient={{
            _id: patient._id,
            name: patient.name,
            ageYears: patient.ageYears,
            ageMonths: patient.ageMonths,
            address: patient.address,
            phoneNo: patient.phoneNo,
          }}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Edit Visit Modal */}
      {editVisitModal.isOpen && editVisitModal.visit && (
        <EditVisitModal
          visit={editVisitModal.visit}
          patientId={patient?._id || ''}
          visitIndex={editVisitModal.visitIndex}
          isOpen={editVisitModal.isOpen}
          onClose={handleEditVisitModalClose}
          onSuccess={handleEditVisitSuccess}
        />
      )}
    </div>
  );
};

export default Patient;
