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
  Legend,
  CartesianGrid,
  Label,
} from "recharts";

interface ChartData {
  location: string;
  count: number;
}

const TopFiveByPlaceOfResidency2 = ({
  showAll = false,
}: {
  showAll?: boolean;
}) => {
  const { data, isPending } = useGetAllTicketsForVisualization();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!isPending && data?.items) {
      const locationCounts: Record<string, number> = {};

      data.items.forEach((ticket) => {
        const municipality = ticket.driver?.address?.municipality;
        const province = ticket.driver?.address?.province;
        const location =
          municipality && province
            ? `${municipality}, ${province}`
            : municipality;

        const totalViolations =
          ticket.violations.length + ticket.otherViolations.length;

        if (location && totalViolations > 0) {
          locationCounts[location] =
            (locationCounts[location] || 0) + totalViolations;
        }
      });

      const sortedData = Object.entries(locationCounts)
        .map(([location, count]) => ({
          location,
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setChartData(showAll ? sortedData : sortedData.slice(0, 5));
    }
  }, [data, isPending]);

  return (
    <WidthWrapper className=" rounded-lg p-4 shadow-lg">
      <p className="text-center text-sky-900 text-[8px] sm:text-sm">
        Top 5 Number of Cases by Address (Place of Residency)
      </p>

      {/* Chart Section */}
      <div className="flex flex-col items-center mt-2">
        {chartData.length > 0 ? (
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
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
                  dataKey="location"
                  stroke="#8884d8"
                  tick={{ fontSize: 10, fill: "#666" }}
                >
                  <Label
                    value="Place of Residency"
                    position="insideBottom"
                    offset={-20}
                    fill="#666"
                    style={{ fontSize: 10, textAnchor: "middle" }}
                  />
                </XAxis>

                <YAxis className="text-sm">
                  <Label
                    value="Number of Cases"
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

export default TopFiveByPlaceOfResidency2;
