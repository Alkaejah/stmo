"use client";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useGetAllHistoricalTickets from "@/common/hooks/Admin/useGetAllHistoricalTickets";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Label,
} from "recharts";

interface HistoricalTicket {
  _id: string;
  violatorAddress: {
    municipality: string;
    cityProvince: string;
    _id: string;
  };
  violationAddress: {
    street: string;
    barangay: string;
    longitude: number;
    latitude: number;
    _id: string;
  };
  violationCode: string;
  violationDescription: string;
  offense: string;
  createdAt: string; // This is the field we need for the graph
  __v: number;
}

interface ChartData {
  monthYear: string;
  count: number;
}

const ByMonthlyCountOfViolations = () => {
  const { data, isPending } = useGetAllHistoricalTickets();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!isPending && data?.items) {
      const monthCounts: Record<string, number> = {};

      // Process historical tickets
      (data.items as HistoricalTicket[]).forEach((ticket) => {
        const date = new Date(ticket.createdAt);
        const monthYear = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;

        if (monthYear) {
          monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
        }
      });

      // Convert to array and sort by date
      const formattedData = Object.entries(monthCounts)
        .map(([monthYear, count]) => ({
          monthYear,
          count,
        }))
        .sort(
          (a, b) =>
            new Date(a.monthYear).getTime() - new Date(b.monthYear).getTime(),
        );

      setChartData(formattedData);
    }
  }, [data, isPending]);

  return (
    <WidthWrapper className="rounded-lg p-4 shadow-lg">
      <p className="text-center text-sky-900 text-xl sm:text-lg font-semibold mb-4">
        Monthly Count of Violations
      </p>

      <div className="flex flex-col items-center">
        {chartData.length > 0 ? (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
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
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />

                <XAxis
                  dataKey="monthYear"
                  stroke="#8884d8"
                  tick={{ fontSize: 12, fill: "#666" }}
                  angle={-50} // Rotate labels by -30 degrees
                  textAnchor="end" // Align the end of the label text
                  height={70} // Increase height to accommodate rotated labels
                >
                  <Label
                    value="Month"
                    position="insideBottom"
                    offset={-10}
                    fill="#666"
                    style={{ fontSize: 12, textAnchor: "middle" }}
                  />
                </XAxis>

                <YAxis className="text-sm">
                  <Label
                    value="Number of Violations"
                    angle={-90}
                    position="insideLeft"
                    offset={-10}
                    fill="#999"
                    style={{ textAnchor: "middle", fontSize: 12 }}
                  />
                </YAxis>

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#32ADE6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#32ADE6" }}
                  activeDot={{ r: 6 }}
                  name="Violations"
                />
              </LineChart>
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

export default ByMonthlyCountOfViolations;
