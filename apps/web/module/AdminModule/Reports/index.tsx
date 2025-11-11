"use client";

import { WidthWrapper } from "@/common/components/WidthWrapper";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "@/common/components/shadcn/ui/button";
import { LucideFileClock, LucideNotebook, LucideFileUp } from "lucide-react";
import TopFiveByViolationCode2 from "@/module/AdminModule/Reports/components/analytics/system-generated/TopFiveByViolationCode2";
import ByFrequencyOfOffenseTypes2 from "@/module/AdminModule/Reports/components/analytics/system-generated/ByFrequencyOfOffenseTypes2";
import ByPlaceOfViolation2 from "@/module/AdminModule/Reports/components/analytics/system-generated/ByPlaceOfViolation2";
import TopFiveByPlaceOfResidency2 from "@/module/AdminModule/Reports/components/analytics/system-generated/TopFiveByPlaceOfResidency2";
import ByMonthlyCountOfViolations2 from "@/module/AdminModule/Reports/components/analytics/system-generated/ByMonthlyCountOfViolations2";
import TopFiveByViolationCode from "@/module/AdminModule/Reports/components/analytics/historical/TopFiveByViolationCode";
import ByFrequencyOfOffenseTypes from "@/module/AdminModule/Reports/components/analytics/historical/ByFrequencyOfOffenseTypes";
import ByPlaceOfViolation from "@/module/AdminModule/Reports/components/analytics/historical/ByPlaceOfViolation";
import TopFiveByPlaceOfResidency from "@/module/AdminModule/Reports/components/analytics/historical/TopFiveByPlaceOfResidency";
import ByMonthlyCountOfViolations from "@/module/AdminModule/Reports/components/analytics/historical/ByMonthlyCountOfViolations";
import ModalContainer from "@/common/components/ModalContainer";
import useUploadHistoricalTicketsCSV from "@/common/hooks/Admin/useUploadHistoricalTicketsCSV";
import useGetAllTicketsForVisualization from "@/common/hooks/Admin/useGetAllTicketsForVisualization";
import useGetAllHistoricalTickets from "@/common/hooks/Admin/useGetAllHistoricalTickets";
import toast from "react-hot-toast";
import { Spinner } from "@/common/components/ui/Spinner";
import HourlyViolationByPlaceOfViolation from "./components/analytics/historical/HourlyViolationByPlaceOfViolation";
import HourlyViolationByPlaceOfViolation2 from "./components/analytics/system-generated/HourlyViolationByPlaceOfViolation2";

const Reports = () => {
  const { data: ticketData } = useGetAllTicketsForVisualization();
  const { data: historicalData } = useGetAllHistoricalTickets();

  const [summary, setSummary] = useState<any>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const [activeChart, setActiveChart] = useState<"latest" | "historical">(
    "latest",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<React.ReactNode | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: uploadCSV,
    isPending: isUploadPending,
    error: uploadError,
    data: uploadData,
  } = useUploadHistoricalTicketsCSV();

  const openModalWithChart = (chart: React.ReactNode) => {
    setSelectedChart(chart);
    setIsModalOpen(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      uploadCSV(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      toast.error("No file selected.");
    }
  };

  useEffect(() => {
    if (uploadData) toast.success("Upload successful!");
  }, [uploadData]);

  useEffect(() => {
    if (uploadError) toast.error(`Upload Error: ${uploadError.message}`);
  }, [uploadError]);

  const getTopKeys = (obj: Record<string, number>, count = 5) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([key]) => key);
  };

  const generateSummary = () => {
    const source =
      activeChart === "latest" ? ticketData?.items : historicalData?.items;
    if (!source) return null;

    const areaCounts: Record<string, number> = {};
    const residencyCounts: Record<string, number> = {};
    const violationCodeCounts: Record<string, number> = {};
    const offenseTypeCounts: Record<string, number> = {};
    const monthlyCounts: Record<string, number> = {};

    source.forEach((ticket: any) => {
      const street =
        activeChart === "latest"
          ? ticket.address?.street?.street || "Unknown"
          : ticket.violationAddress?.street || "Unknown";
      areaCounts[street] = (areaCounts[street] || 0) + 1;

      const residence =
        activeChart === "latest"
          ? `${ticket.driver?.address?.municipality || "Unknown"}, ${ticket.driver?.address?.province || ""}`
          : `${ticket.violatorAddress?.municipality || "Unknown"}, ${ticket.violatorAddress?.cityProvince || ""}`;
      residencyCounts[residence] = (residencyCounts[residence] || 0) + 1;

      if (activeChart === "latest") {
        [...ticket.violations, ...ticket.otherViolations].forEach((v) => {
          const code = v.violationId?.violationCode;
          const type = v.violationId?.violationCategory?.violationCategoryName;
          if (code)
            violationCodeCounts[code] = (violationCodeCounts[code] || 0) + 1;
          if (type)
            offenseTypeCounts[type] = (offenseTypeCounts[type] || 0) + 1;
        });
      } else {
        const code = ticket.violationCode;
        const offense = ticket.offense;
        if (code)
          violationCodeCounts[code] = (violationCodeCounts[code] || 0) + 1;
        if (offense)
          offenseTypeCounts[offense] = (offenseTypeCounts[offense] || 0) + 1;
      }

      const date = new Date(ticket.createdAt);
      const key = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
      monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    });

    const describeTemplate = (
      entries: [string, number][],
      section: string,
    ): string => {
      let lines = entries.map(([k, v], idx) => {
        if (section === "area" && idx === 0)
          return `• ${k}: ${v} violations, making it the top hotspot.`;
        if (section === "residency" && idx === 0)
          return `• ${k}: ${v} cases, the highest number.`;
        if (section === "violationCode" && idx === 0)
          return `• Code ${k}: ${v} occurrences (highest).`;
        if (section === "offense" && idx === 0)
          return `• ${k}: ${v} cases (most frequent).`;
        if (section === "monthly" && idx === 0)
          return `• ${k}: Recorded the highest number of violations, peaking at ${v} cases, making it a critical period.`;
        return section === "violationCode"
          ? `• Code ${k}: ${v} occurrences.`
          : `• ${k}: ${v} ${section === "monthly" ? "cases" : ""}.`;
      });

      if (entries.length > 3 && section === "area") {
        const rest = entries.slice(3);
        const others = rest.map(([k]) => k).join(", ");
        const counts = rest.map(([, v]) => v);
        const min = Math.min(...counts);
        const max = Math.max(...counts);
        lines.push(
          `• Other streets (${others}): Ranged between ${min} and ${max} violations.`,
        );
      }

      return lines.join("\n");
    };

    const summarizeMonthlyRecommendation = (months: string[]) => {
      return [
        "• Focused Patrols in Peak Months: Strengthen enforcement efforts, particularly in " +
          months.join(" and ") +
          ", which consistently report higher violations.",
        "• Investigate Contributing Factors: Examine why peaks occurred in " +
          months.join(" and ") +
          ", including possible external influences or seasonal patterns.",
        "• Preventive Campaigns: Launch awareness and compliance drives before peak periods to minimize future spikes.",
      ].join("\n");
    };

    const area = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
    const residency = Object.entries(residencyCounts).sort(
      (a, b) => b[1] - a[1],
    );
    const codes = Object.entries(violationCodeCounts).sort(
      (a, b) => b[1] - a[1],
    );
    const offenses = Object.entries(offenseTypeCounts).sort(
      (a, b) => b[1] - a[1],
    );
    const months = Object.entries(monthlyCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k);

    return {
      areaSummary: describeTemplate(area, "area"),
      areaRecommendation: `Recommendation: Increase patrols and enforcement in high-violation areas, particularly ${area[0]?.[0]} and ${area[1]?.[0]}.`,

      residencySummary: describeTemplate(residency, "residency"),
      residencyRecommendation: `Recommendation: Conduct community-based awareness programs in ${residency[0]?.[0]} and ${residency[1]?.[0]} to promote adherence to regulations.`,

      codeSummary: describeTemplate(codes.slice(0, 5), "violationCode"),
      codeRecommendation: `Recommendation: Focus enforcement on the most common codes, particularly ${codes[0]?.[0]} and ${codes[1]?.[0]}, through targeted monitoring and penalties.`,

      offenseSummary: describeTemplate(offenses.slice(0, 5), "offense"),
      offenseRecommendation: `Recommendation: Strengthen campaigns to address ${offenses[0]?.[0]} and prevent repeat offenses.`,
      monthlySummary: describeTemplate(
        months.slice(0, 3).map((m) => [m, monthlyCounts[m]!]),
        "monthly",
      ),

      monthlyRecommendation: `Recommendation:\n${summarizeMonthlyRecommendation(months.slice(0, 2))}`,
    };
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-[url('/Aerial_Shot.png')] bg-cover bg-center w-full min-h-screen flex justify-center items-center">
        <div className="sm:p-2 md:p-8 w-full flex justify-center">
          <div className="bg-primary bg-opacity-80 rounded-lg w-fit max-w-6xl mx-auto min-h-[90vh] sm:px-8 md:px-32 shadow-lg flex flex-col justify-center relative">
            <div className="flex justify-center items-center mb-4 my-6">
              <div className="flex gap-2">
                <Button
                  variant={activeChart === "latest" ? "secondary" : "outline"}
                  onClick={() => setActiveChart("latest")}
                >
                  <LucideNotebook className="w-4 h-4 mr-2" />
                  Latest
                </Button>
                <Button
                  variant={
                    activeChart === "historical" ? "secondary" : "outline"
                  }
                  onClick={() => setActiveChart("historical")}
                >
                  <LucideFileClock className="w-4 h-4 mr-2" />
                  Historical
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md sm:p-8 md:p-10 w-full max-w-7xl mx-auto">
              {activeChart === "historical" && (
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <LucideFileUp size={20} />
                    <h2 className="text-lg font-semibold">
                      Upload Historical Tickets CSV
                    </h2>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="border border-gray-300 px-3 py-1.5 pr-10 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      ref={fileInputRef}
                    />
                    <Button
                      className="w-full max-w-[100px] self-end mt-4"
                      variant="default"
                      size="lg"
                      type="button"
                      onClick={handleUploadClick}
                    >
                      {isUploadPending ? <Spinner size="md" /> : "Upload CSV"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 w-full items-center p-4 gap-4">
                {activeChart === "latest" ? (
                  <>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        openModalWithChart(
                          <TopFiveByViolationCode2 showAll={true} />,
                        )
                      }
                    >
                      <TopFiveByViolationCode2 showAll={false} />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        openModalWithChart(<ByFrequencyOfOffenseTypes2 />)
                      }
                    >
                      <ByFrequencyOfOffenseTypes2 />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        openModalWithChart(<ByPlaceOfViolation2 />)
                      }
                    >
                      <ByPlaceOfViolation2 />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        openModalWithChart(
                          <TopFiveByPlaceOfResidency2 showAll={true} />,
                        )
                      }
                    >
                      <TopFiveByPlaceOfResidency2 showAll={false} />
                    </div>
                    <div
                      className="col-span-full cursor-pointer"
                      onClick={() =>
                        openModalWithChart(
                          <HourlyViolationByPlaceOfViolation2 />,
                        )
                      }
                    >
                      <HourlyViolationByPlaceOfViolation2 />
                    </div>
                    <div
                      className="col-span-full cursor-pointer"
                      onClick={() =>
                        openModalWithChart(<ByMonthlyCountOfViolations2 />)
                      }
                    >
                      <ByMonthlyCountOfViolations2 />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        openModalWithChart(
                          <TopFiveByViolationCode showAll={true} />,
                        )
                      }
                    >
                      <TopFiveByViolationCode showAll={false} />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        openModalWithChart(<ByFrequencyOfOffenseTypes />)
                      }
                    >
                      <ByFrequencyOfOffenseTypes />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => openModalWithChart(<ByPlaceOfViolation />)}
                    >
                      <ByPlaceOfViolation />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        openModalWithChart(
                          <TopFiveByPlaceOfResidency showAll={true} />,
                        )
                      }
                    >
                      <TopFiveByPlaceOfResidency showAll={false} />
                    </div>
                    <div
                      className="col-span-full cursor-pointer"
                      onClick={() =>
                        openModalWithChart(
                          <HourlyViolationByPlaceOfViolation />,
                        )
                      }
                    >
                      <HourlyViolationByPlaceOfViolation />
                    </div>
                    <div
                      className="col-span-full cursor-pointer"
                      onClick={() =>
                        openModalWithChart(<ByMonthlyCountOfViolations />)
                      }
                    >
                      <ByMonthlyCountOfViolations />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end mr-4">
                <Button
                  className="bg-blue-500 text-white px-6 py-2 rounded-md"
                  onClick={() => {
                    const generated = generateSummary();
                    setSummary(generated);
                    setShowSummaryModal(true);
                  }}
                >
                  Generate Summary Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalContainer
        title="Detailed Chart"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <div className="p-4 h-[80vh] text-white flex justify-center items-center">
          {selectedChart}
        </div>
      </ModalContainer>

      <ModalContainer
        title="Summary Analysis"
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        size="sm"
      >
        <div className="p-6 text-gray-800 space-y-4 text-sm max-h-[80vh] overflow-auto">
          {summary ? (
            <>
              <div>
                <div>
                  <p className="font-semibold">🗺️ Violations by Area</p>
                  <pre>{summary.areaSummary}</pre>
                  <p className="text-xs text-gray-500 italic">
                    {summary.areaRecommendation}
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <p className="font-semibold">
                    📍 Violations by Place of Residency
                  </p>
                  <pre>{summary.residencySummary}</pre>
                  <p className="text-xs text-gray-500 italic">
                    {summary.residencyRecommendation}
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <p className="font-semibold">
                    🧾 Violations by Violation Codes
                  </p>
                  <pre>{summary.codeSummary}</pre>
                  <p className="text-xs text-gray-500 italic">
                    {summary.codeRecommendation}
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <p className="font-semibold">
                    ⚖️ Violations by Offense Types
                  </p>
                  <pre>{summary.offenseSummary}</pre>
                  <p className="text-xs text-gray-500 italic">
                    {summary.offenseRecommendation}
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <p className="font-semibold">
                    📆 Violations by Monthly Count
                  </p>
                  <pre>{summary.monthlySummary}</pre>
                  <p className="text-xs text-gray-500 italic">
                    {summary.monthlyRecommendation}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>No data available for summary.</p>
          )}
        </div>
      </ModalContainer>
    </WidthWrapper>
  );
};

export default Reports;
