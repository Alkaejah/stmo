"use client";
import useGetAllHistoricalTickets from "@/common/hooks/Admin/useGetAllHistoricalTickets";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const HourlyViolationByPlaceOfViolation = () => {
  const { data, isPending } = useGetAllHistoricalTickets();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!isPending && data?.items) {
      const hourPlaceCount: Record<string, Record<string, number>> = {};

      data.items.forEach((ticket: any) => {
        const date = new Date(ticket.createdAt);
        const hour = new Date(date).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        });

        const place = ticket.violationAddress?.barangay || "Unknown";

        if (!hourPlaceCount[hour]) {
          hourPlaceCount[hour] = {};
        }

        hourPlaceCount[hour][place] = (hourPlaceCount[hour][place] || 0) + 1;
      });

      const structured = Object.entries(hourPlaceCount).map(
        ([hour, places]) => {
          return {
            hour,
            ...places,
          };
        },
      );

      setChartData(structured);
    }
  }, [data, isPending]);

  const colors = [
    "#5B8FD5",
    "#3973B7",
    "#8AB6E1",
    "#A4CCE6",
    "#C6DFF2",
    "#729AD2",
    "#82B4F0",
    "#A2C9F5",
  ];

  const placeKeys = Object.keys(chartData[0] || {}).filter(
    (key) => key !== "hour",
  );

  return (
    <WidthWrapper className="rounded-lg p-4 shadow-lg">
      <p className="text-center text-sky-900 text-xl sm:text-lg font-semibold mb-4">
        Hourly Violation Count by Place
      </p>
      {chartData.length > 0 ? (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                angle={-35}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {placeKeys.map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[idx % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-500 font-semibold mt-4">
          No data available.
        </div>
      )}
    </WidthWrapper>
  );
};

export default HourlyViolationByPlaceOfViolation;
