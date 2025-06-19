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
    <div className="w-full max-w-[calc(100vw-32px)]">
      <Button
        className="mb-1 flex justify-start items-center gap-2 md:sticky md:top-[64px] text-slate-500"
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
