"use client";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useGetAllTicketsForVisualization from "@/common/hooks/Admin/useGetAllTicketsForVisualization";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Label,
  Legend,
  CartesianGrid,
} from "recharts";

interface Violation {
  violationId: {
    _id: string;
    violationCode: string;
    violationDescription?: string;
    violationCategory?: {
      _id: string;
      violationCategoryName: string;
    };
  };
  penaltyId?: {
    _id: string;
    penaltyDescription: string;
    penalty: number;
  };
}

interface Ticket {
  _id: string;
  ticketNumber: string;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  address: {
    _id: string;
    street: {
      street: string;
      longitude: number;
      latitude: number;
      _id: string;
    };
    barangay: {
      barangay: string;
      longitude: number;
      latitude: number;
      _id: string;
    };
    createdAt: string;
    __v: number;
  };
  licenseNumber: string;
  plateNumber: string;
  violations: Violation[];
  otherViolations: Violation[];
  ticketStatus: string;
  paymentStatus: string;
  createdAt: string;
}

interface ChartData {
  penaltyDescription: string;
  count: number;
}

const ByFrequencyOfOffenseTypes2 = () => {
  const { data, isPending } = useGetAllTicketsForVisualization();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!isPending && data?.items) {
      const penaltyCounts: Record<string, number> = {};

      // Process violations and otherViolations
      (data.items as Ticket[]).forEach((ticket) => {
        ticket.violations.forEach((violation) => {
          const penaltyDescription =
            violation.penaltyId?.penaltyDescription || "Unknown";
          penaltyCounts[penaltyDescription] =
            (penaltyCounts[penaltyDescription] || 0) + 1;
        });

        ticket.otherViolations.forEach((violation) => {
          const penaltyDescription =
            violation.penaltyId?.penaltyDescription || "Unknown";
          penaltyCounts[penaltyDescription] =
            (penaltyCounts[penaltyDescription] || 0) + 1;
        });
      });

      // Convert to array and sort by count
      const formattedData = Object.entries(penaltyCounts)
        .map(([penaltyDescription, count]) => ({
          penaltyDescription,
          count,
        }))
        .sort((a, b) => b.count - a.count); // Sort by count in descending order

      setChartData(formattedData);
    }
  }, [data, isPending]);

  return (
    <WidthWrapper className=" rounded-lg p-4 shadow-lg">
      <p className="text-center text-sky-900 text-[8px] sm:text-sm mb-4">
        Frequency of Offense Types
      </p>

      {/* Chart Section */}
      <div className="flex flex-col items-center mt-2">
        {chartData.length > 0 ? (
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 30 }} // Increase bottom margin
              >
                <CartesianGrid strokeDasharray="3 3" />
                <Legend
                  verticalAlign="top"
                  align="left"
                  iconType="square"
                  wrapperStyle={{
                    position: "absolute",
                    top: -10,
                    left: 60,
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                />

                <XAxis
                  dataKey="penaltyDescription"
                  stroke="#8884d8"
                  tick={{ fontSize: 10, fill: "#666" }}
                  angle={-20} // Rotate labels by -30 degrees
                  textAnchor="end" // Align the end of the label text
                  height={30} // Increase height to accommodate rotated labels
                >
                  <Label
                    value="Offense Types"
                    position="insideBottom"
                    offset={-30} // Adjust offset to move the label further down
                    fill="#666"
                    style={{ fontSize: 10, textAnchor: "middle" }}
                  />
                </XAxis>

                <YAxis className="text-sm">
                  <Label
                    value="Count"
                    angle={-90}
                    position="insideLeft"
                    offset={-10}
                    fill="#999"
                    style={{ textAnchor: "middle", fontSize: 12 }}
                  />
                </YAxis>

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#32ADE6"
                  barSize={40}
                  className="text-sm"
                  name="Violations"
                >
                  <LabelList
                    dataKey="count"
                    position="top"
                    fill="#000"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 font-semibold mt-4">
            No data available.
          </div>
        )}
      </div>
    </WidthWrapper>
  );
};

export default ByFrequencyOfOffenseTypes2;
