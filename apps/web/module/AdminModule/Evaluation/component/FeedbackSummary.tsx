"use client";
import { useState, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Typography } from "@/common/components/ui/Typography";
import useGetFeedbacksSummaryByEnforcerId from "@/common/hooks/Admin/useGetFeedbackSummaryByEnforcerId";
import { T_Feedback } from "@repo/contract";
import { useParams } from "next/navigation";
import { Button } from "@/common/components/shadcn/ui/button";
import { LucideClipboardList, LucideMessageSquareText } from "lucide-react";
import ReceivedFeedbacks from "./ReceivedFeedbacks";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const COLORS = ["#1E40AF", "#F97316"];

const FeedbackSummary = () => {
  const params = useParams<{ enforcerId: string }>();
  const enforcerId = params.enforcerId;
  const { data: feedbacks } = useGetFeedbacksSummaryByEnforcerId(enforcerId);
  const [activeFeedback, setActiveFeedback] = useState<
    "summary" | "receivedFeedback"
  >("summary");
  const chartRef = useRef<HTMLDivElement>(null);

  const feedbackList: T_Feedback[] = feedbacks?.item?.feedbacks || [];
  const officerName = `${feedbacks?.item?.firstName} ${feedbacks?.item?.lastName}`;

  const addressOptions = [
    "All Assignments",
    ...new Set(
      feedbackList
        .filter(
          (f) => f.address?.street?.street && f.address?.barangay?.barangay,
        )
        .map(
          (f) => `${f.address?.street.street}, ${f.address?.barangay.barangay}`,
        ),
    ),
  ];

  const [selectedAddress, setSelectedAddress] = useState("All Assignments");

  const filteredFeedbacks =
    selectedAddress === "All Assignments"
      ? feedbackList
      : feedbackList.filter(
          (f) =>
            `${f.address?.street?.street}, ${f.address?.barangay?.barangay}` ===
            selectedAddress,
        );

  const pieData = [
    {
      name: "Yes",
      value: filteredFeedbacks.filter((f) => f.isAccuratelyApprehended === true)
        .length,
    },
    {
      name: "No",
      value: filteredFeedbacks.filter(
        (f) => f.isAccuratelyApprehended === false,
      ).length,
    },
  ];

  const numberOfRespondents = filteredFeedbacks.length;

  const getCategoryAverage = (questions: (keyof T_Feedback)[]) => {
    const total = filteredFeedbacks.reduce((sum, f) => {
      return (
        sum +
        questions.reduce((subSum, q) => {
          return subSum + (typeof f[q] === "number" ? (f[q] as number) : 0);
        }, 0)
      );
    }, 0);
    const divisor = questions.length * numberOfRespondents;
    return divisor === 0 ? 0 : total / divisor;
  };

  const categoryRatings = [
    {
      label: "I. Professionalism and Conduct",
      score: getCategoryAverage(["q1", "q2", "q3"]),
    },
    {
      label: "II. Knowledge and Competence",
      score: getCategoryAverage(["q4", "q5", "q6"]),
    },
    {
      label: "III. Apprehension and Citation Issuance Skills",
      score: getCategoryAverage(["q7", "q8", "q9"]),
    },
    {
      label: "IV. Communication and Reporting",
      score: getCategoryAverage(["q10", "q11"]),
    },
  ];

  const totalScore =
    categoryRatings.reduce((sum, cat) => sum + cat.score, 0) /
    categoryRatings.length;

  const handleExportPDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const officerName = `${feedbacks?.item?.firstName} ${feedbacks?.item?.lastName}`;
    const chartElement = chartRef.current;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(16);
    doc.text(`OFFICERS EVALUATION | ${officerName}`, 40, 40);

    // Centered question
    doc.setFontSize(12);
    doc.text(
      "Did the apprehension officer accurately apprehend you?",
      pageWidth / 2,
      60,
      { align: "center" },
    );

    let currentY = 80;

    // Chart image
    if (chartElement) {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const maxWidth = 600;
      const aspectRatio = canvas.width / canvas.height;
      const width = maxWidth;
      const height = maxWidth / aspectRatio;

      const x = (pageWidth - width) / 2;
      doc.addImage(imgData, "PNG", x, currentY, width, height);

      currentY += height + 30;
    }

    // Top-left Total Respondents before ratings table
    doc.setFontSize(12);
    doc.text(
      `Total number of Respondents in (${selectedAddress}): ${numberOfRespondents}`,
      40,
      currentY,
    );

    // Ratings Table
    autoTable(doc, {
      startY: currentY + 10,
      head: [[...categoryRatings.map((c) => c.label), "TOTAL"]],
      body: [
        [
          ...categoryRatings.map((c) => c.score.toFixed(2)),
          totalScore.toFixed(2),
        ],
      ],
      styles: { halign: "center" },
      headStyles: { fillColor: [30, 64, 175], textColor: 255 },
      margin: { left: 40 },
      tableWidth: 700,
    });

    // Comments title
    const afterRatingsY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.text("Comments", 40, afterRatingsY);

    // Comments Table
    autoTable(doc, {
      startY: afterRatingsY + 10,
      head: [["#", "Comments"]],
      body: filteredFeedbacks
        .filter((f) => f.comments?.trim() !== "")
        .map((f, i) => [i + 1, f.comments]),
      headStyles: { fillColor: [200, 200, 200] },
      styles: { valign: "middle" },
      columnStyles: {
        0: { cellWidth: 40, halign: "center" },
        1: { cellWidth: 660 }, // Ensures alignment with rating table
      },
      margin: { left: 40 },
      tableWidth: 700,
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          doc.setFontSize(10);
          doc.text("Comments (continued)", 40, 30);
        }
      },
    });

    doc.save(`Feedback-Summary-${officerName}.pdf`);
  };

  return (
    <div className="relative w-full flex justify-center min-h-screen items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4">
      <div className="relative z-10 w-full max-w-full bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6">
        <div className="flex gap-2 justify-center mb-4">
          <Button
            variant={activeFeedback === "summary" ? "secondary" : "outline"}
            onClick={() => setActiveFeedback("summary")}
          >
            <LucideClipboardList className="w-4 h-4 mr-2" />
            Summary
          </Button>
          <Button
            variant={
              activeFeedback === "receivedFeedback" ? "secondary" : "outline"
            }
            onClick={() => setActiveFeedback("receivedFeedback")}
          >
            <LucideMessageSquareText className="w-4 h-4 mr-2" />
            Received Feedbacks
          </Button>
        </div>

        {activeFeedback === "summary" ? (
          <div className="bg-white rounded-lg shadow-md p-8 w-full">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h2" fontWeight="bold">
                OFFICERS EVALUATION | {officerName}
              </Typography>
              <div className="flex gap-2">
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  {addressOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <Button onClick={handleExportPDF}>Export Summary to PDF</Button>
              </div>
            </div>

            <Typography
              variant="h4"
              fontWeight="semiBold"
              className="mb-2 text-center"
            >
              Did the apprehension officer accurately apprehend you?
            </Typography>

            <div ref={chartRef} className="flex justify-center mb-6">
              <PieChart width={300} height={220}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  dataKey="value"
                  label={({
                    value,
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        {value}
                      </text>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </div>

            <Typography
              className="text-sm text-gray-700 mb-2"
              fontWeight="semiBold"
            >
              Total number of Respondents in ({selectedAddress}):{" "}
              {numberOfRespondents}
            </Typography>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {categoryRatings.map((cat, idx) => (
                      <th
                        key={idx}
                        className="border border-gray-300 px-3 py-2 text-center font-semibold"
                      >
                        {cat.label}
                      </th>
                    ))}
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {categoryRatings.map((cat, idx) => (
                      <td key={idx} className="border px-3 py-2 font-bold">
                        {cat.score.toFixed(2)}
                      </td>
                    ))}
                    <td className="border px-3 py-2 font-bold">
                      {totalScore.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Typography
              variant="h5"
              fontWeight="semiBold"
              className="mb-2 text-gray-800"
            >
              Comments
            </Typography>
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 w-12">#</th>
                  <th className="border px-3 py-1">Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks
                  .filter((f: T_Feedback) => f.comments?.trim() !== "")
                  .map((f: T_Feedback, idx: number) => (
                    <tr key={f._id}>
                      <td className="border px-2 py-1">{idx + 1}</td>
                      <td className="border px-3 py-1">{f.comments}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ReceivedFeedbacks />
        )}
      </div>
    </div>
  );
};

export default FeedbackSummary;
