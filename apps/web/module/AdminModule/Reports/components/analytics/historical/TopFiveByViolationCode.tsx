"use client";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useGetAllHistoricalTickets from "@/common/hooks/Admin/useGetAllHistoricalTickets";
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
  createdAt: string;
  __v: number;
}

interface ChartData {
  violationCode: string;
  count: number;
}

const TopFiveByViolationCode = ({ showAll = false }: { showAll?: boolean }) => {
  const { data, isPending } = useGetAllHistoricalTickets();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!isPending && data?.items) {
      const violationCounts: Record<string, number> = {};

      // Process historical tickets
      (data.items as HistoricalTicket[]).forEach((ticket) => {
        const code = ticket.violationCode;
        violationCounts[code] = (violationCounts[code] || 0) + 1;
      });

      // Convert to array and sort by count
      const sortedData = Object.entries(violationCounts)
        .map(([violationCode, count]) => ({
          violationCode,
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setChartData(showAll ? sortedData : sortedData.slice(0, 5));
    }
  }, [data, isPending]);

  return (
    <WidthWrapper className="rounded-lg p-4 shadow-lg">
      <p className="text-center text-sky-900 text-[8px] sm:text-sm">
        Top 5 Historical Violations by Violation Code
      </p>

      {/* Chart Section */}
      <div className="flex flex-col items-center mt-3">
        {chartData.length > 0 ? (
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
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
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                />

                <XAxis
                  dataKey="violationCode"
                  stroke="#8884d8"
                  tick={{ fontSize: 7, fill: "#666" }}
                  fontSize={10}
                  height={30}
                >
                  <Label
                    value="Violation Code"
                    position="insideBottom"
                    offset={-8}
                    fill="#666"
                    height={30}
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
                    style={{ textAnchor: "middle", fontSize: 10 }}
                  />
                </YAxis>

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#32ADE6"
                  barSize={40}
                  className="text-sm"
                  name="Violations"
                  fontSize={10}
                >
                  <LabelList
                    dataKey="count"
                    position="top"
                    fill="#000"
                    fontSize={10}
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

export default TopFiveByViolationCode;
