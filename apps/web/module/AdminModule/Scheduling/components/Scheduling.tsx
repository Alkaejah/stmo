"use client";

import React, { useRef, useState } from "react";
import useGetAllEnforcersForScheduling from "@/common/hooks/Admin/useGetAllEnforcersForScheduling";
import useUpdateEnforcerScheduleTime from "@/common/hooks/Admin/useUpdateEnforcerScheduleTime";
import { Card } from "@/common/components/shadcn/ui/card";
import { Button } from "@/common/components/shadcn/ui/button";
import toast from "react-hot-toast";

const Scheduling = () => {
  const { data, refetch } = useGetAllEnforcersForScheduling();
  const { mutateAsync } = useUpdateEnforcerScheduleTime();
  const printRef = useRef<HTMLDivElement | null>(null);

  const [editedTimes, setEditedTimes] = useState<
    Record<
      string,
      {
        amStart: string;
        amEnd: string;
        pmStart: string;
        pmEnd: string;
      }
    >
  >({});

  const parseScheduleTime = (timeStr: string) => {
    const parts = timeStr.split("/");
    const [amStart = "", amEnd = ""] = parts[0]?.split("-") || [];
    const [pmStart = "", pmEnd = ""] = parts[1]?.split("-") || [];
    return { amStart, amEnd, pmStart, pmEnd };
  };

  const handleTimeChange = (
    id: string,
    field: keyof (typeof editedTimes)[string],
    value: string,
  ) => {
    setEditedTimes((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { amStart: "", amEnd: "", pmStart: "", pmEnd: "" }),
        [field]: value,
      },
    }));
  };

  const handleUpdateTime = async (id: string) => {
    const time = editedTimes[id];
    if (!time) return toast.error("Please complete the schedule time.");

    const finalTime = `${time.amStart}-${time.amEnd}/${time.pmStart}-${time.pmEnd}`;

    try {
      const res = await mutateAsync({
        enforcerId: id,
        scheduleTime: finalTime,
      });
      if (!res.error) {
        toast.success("Time updated.");
        refetch();
      } else {
        toast.error("Failed to update.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const formatTo12Hour = (time: string): string => {
    if (!time) return "";
    const [rawHour, rawMinute] = time.split(":");
    const hour = rawHour ?? "00";
    const minute = rawMinute ?? "00";
    const date = new Date();
    date.setHours(parseInt(hour, 10));
    date.setMinutes(parseInt(minute, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const monthYear = (() => {
    const date = new Date();
    const year = date.getFullYear();
    const monthName = date.toLocaleString("default", { month: "long" });
    const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
    return `${monthName.toUpperCase()} ${`1-${daysInMonth}, ${year}`}`;
  })();

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:py-8 lg:py-8">
      <div className="relative z-10 h-[90vh] bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14 w-full">
        <div
          ref={printRef}
          className="bg-white rounded-lg shadow-md w-full px-4 sm:px-8 md:px-12 py-6 sm:py-10"
        >
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-red-600">
              SINILOAN TRAFFIC MANAGEMENT OFFICE
            </h1>
            <h2 className="text-sm font-medium mt-1">
              SCHEDULE FOR {monthYear}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border border-black text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-4 py-2">PERSONNEL</th>
                  <th className="border border-black px-4 py-2">
                    AREA POSTING
                  </th>
                  <th className="border border-black px-4 py-2">TIME</th>
                  <th className="border border-black px-4 py-2 print:hidden">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((officer, idx) => {
                  const fullName = `${officer.firstName} ${officer.lastName}`;
                  const assignment = officer.assignment?.[0];
                  const location = assignment
                    ? `${assignment.street?.street || "-"} - ${
                        assignment.barangay?.barangay || "-"
                      }`
                    : "-";

                  const defaultParsed = parseScheduleTime(
                    officer.scheduleTime || "06:00-10:00/14:00-18:00",
                  );

                  const time = editedTimes[officer._id] || defaultParsed;

                  return (
                    <tr key={officer._id}>
                      <td className="border border-black px-4 py-2">{`${
                        idx + 1
                      }. ${fullName}`}</td>
                      <td className="border border-black px-4 py-2">
                        {location}
                      </td>
                      <td className="border border-black px-2 py-2">
                        <div className="flex flex-col items-center space-y-1 print:hidden">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">AM:</span>
                            <input
                              type="time"
                              value={time.amStart}
                              onChange={(e) =>
                                handleTimeChange(
                                  officer._id,
                                  "amStart",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-1 text-xs"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={time.amEnd}
                              onChange={(e) =>
                                handleTimeChange(
                                  officer._id,
                                  "amEnd",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-1 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">PM:</span>
                            <input
                              type="time"
                              value={time.pmStart}
                              onChange={(e) =>
                                handleTimeChange(
                                  officer._id,
                                  "pmStart",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-1 text-xs"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={time.pmEnd}
                              onChange={(e) =>
                                handleTimeChange(
                                  officer._id,
                                  "pmEnd",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-1 text-xs"
                            />
                          </div>
                        </div>
                        <div className="hidden print:block text-sm font-medium">
                          {`${formatTo12Hour(time.amStart)} - ${formatTo12Hour(
                            time.amEnd,
                          )} / ${formatTo12Hour(time.pmStart)} - ${formatTo12Hour(
                            time.pmEnd,
                          )}`}
                        </div>
                      </td>
                      <td className="border border-black px-4 py-2 print:hidden">
                        <Button
                          className="text-xs"
                          onClick={() => handleUpdateTime(officer._id)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-10 w-full flex flex-col items-center space-y-10 text-black text-sm font-medium">
            <div className="flex justify-between w-full max-w-xl">
              <div className="text-center">
                <p className="font-bold underline">EDWIN R. SANTELICES</p>
                <p>STMO-OIC</p>
              </div>
              <div className="text-center">
                <p className="font-bold underline">RICO S. SUÑEGA</p>
                <p>Municipal Administrator</p>
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold underline">
                ENGR. PATRICK ELLIS ZAMORA GO, Ph.D.
              </p>
              <p>Municipal Mayor</p>
            </div>
          </div>

          <div className="mt-6 print:hidden flex justify-center">
            <Button onClick={handlePrint} className="bg-secondary text-white">
              Print Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
