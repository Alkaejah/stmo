"use client";
import useGetAllTicketsForVisualization from "@/common/hooks/Admin/useGetAllTicketsForVisualization";
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

interface ChartData {
  monthYear: string;
  count: number;
}

const ByMonthlyCountOfViolations2 = () => {
  const { data, isPending } = useGetAllTicketsForVisualization();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!isPending && data?.items) {
      const monthCounts: Record<string, number> = {};

      data.items.forEach((ticket) => {
        const date = new Date(ticket.createdAt);
        const monthYear = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;

        const totalViolations =
          ticket.violations.length + ticket.otherViolations.length;

        if (totalViolations > 0) {
          monthCounts[monthYear] =
            (monthCounts[monthYear] || 0) + totalViolations;
        }
      });

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
    <div className="bg-white py-8 px-8 sm:py-10 sm:px-10 md:py-12 md:px-12 lg:py-14 lg:px-16 rounded-xl shadow-lg w-full mb-6">
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
    </div>
  );
};

export default ByMonthlyCountOfViolations2;
