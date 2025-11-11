"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useGetAllTicketsForVisualization from "@/common/hooks/Admin/useGetAllTicketsForVisualization";
import { Typography } from "@/common/components/ui/Typography";
import { Card } from "@/common/components/shadcn/ui/card";

const HourlyViolationByPlaceOfViolation2 = () => {
  const { data } = useGetAllTicketsForVisualization();
  const chartData = useMemo(() => {
    if (!data?.items) return [];

    const hourBuckets: Record<string, Record<string, number>> = {};

    data.items.forEach((ticket: any) => {
      const hour = new Date(ticket.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
      const place = ticket.address?.street?.street || "Unknown";
      if (!hourBuckets[hour]) hourBuckets[hour] = {};
      if (!hourBuckets[hour][place]) hourBuckets[hour][place] = 0;
      hourBuckets[hour][place]++;
    });

    const sortedHours = Object.keys(hourBuckets).sort((a, b) => {
      const ah = new Date(`2020-01-01T${a}`).getHours();
      const bh = new Date(`2020-01-01T${b}`).getHours();
      return ah - bh;
    });

    return sortedHours.map((hour) => ({
      hour,
      ...hourBuckets[hour],
    }));
  }, [data]);

  const COLORS = ["#60a5fa", "#3b82f6", "#93c5fd"];
  const places = useMemo(() => {
    const placeSet = new Set<string>();
    chartData.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "hour") placeSet.add(key);
      });
    });
    return Array.from(placeSet);
  }, [chartData]);

  return (
    <Card className="w-full h-[350px] p-4">
      <Typography className="text-center text-sky-900 text-xl sm:text-lg font-semibold mb-2">
        Hourly Violation Count by Place
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis
            label={{
              value: "Count of Violations",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          {places.map((place, index) => (
            <Bar
              key={place}
              dataKey={place}
              fill={COLORS[index % COLORS.length]}
              stackId={undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default HourlyViolationByPlaceOfViolation2;
