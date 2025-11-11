"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Typography } from "@/common/components/ui/Typography";
import Image from "next/image";
import { WidthWrapper } from "@/common/components/WidthWrapper";
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
} from "recharts";
import { LucideSearch } from "lucide-react";
import useGetAllTickets from "@/common/hooks/Enforcers/useGetAllTickets";
import useBackOfficeSessionStore from "@/common/store/useBackOfficeSessionStore";

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const session = useBackOfficeSessionStore((state) => state);
  const { data, isPending } = useGetAllTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState<{ date: string; total: number }[]>(
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isPending && data?.items) {
      const counts: Record<string, number> = {};

      data.items.forEach((ticket) => {
        const formattedDate = dayjs(ticket.createdAt).format("YYYY-MM-DD");
        counts[formattedDate] = (counts[formattedDate] || 0) + 1;
      });

      const formattedData = Object.entries(counts).map(([date, total]) => ({
        date,
        total,
      }));
      setChartData(formattedData);
    }
  }, [data, isPending]);

  const filteredData = chartData.filter(({ date }) => {
    const formattedDate = dayjs(date).format("MMM DD, YYYY");
    const monthAbbr = dayjs(date).format("MMM").toLowerCase();
    const fullMonth = dayjs(date).format("MMMM").toLowerCase();
    const yearMonth = dayjs(date).format("YYYY-MM");

    return (
      formattedDate.toLowerCase().includes(searchTerm) ||
      monthAbbr.includes(searchTerm) ||
      fullMonth.includes(searchTerm) ||
      yearMonth.includes(searchTerm)
    );
  });

  if (!isClient) {
    return null;
  }

  return (
    <WidthWrapper
      width="full"
      className="bg-sky-950 flex flex-col items-center justify-center min-h-screen px-4 md:px-8"
    >
      {/* Logo Container */}
      <div className="flex flex-col items-center justify-center mt-6 lg:mt-8">
        <Image
          src="/etravio.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="object-contain w-full h-24 md:h-32 mb-4"
        />
      </div>

      {/* Title */}
      <Typography className="text-xl md:text-2xl lg:text-4xl font-bold text-white text-center mb-4">
        TRAFFIC VIOLATION MANAGEMENT SYSTEM
      </Typography>

      {/* White Container */}
      <div className="bg-gray-50 py-4 px-2 md:py-6 md:px-4 rounded-md shadow-md w-full max-w-4xl mb-6">
        {/* Title */}
        <Typography
          variant="h5"
          fontWeight="semiBold"
          className="text-secondary text-center mb-2"
        >
          Number of Violators Daily
        </Typography>

        {/* Search Box */}
        <div className="flex justify-end mb-4 lg:mr-5">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by month"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 px-3 py-2 pr-10 rounded-md text-sm outline-none focus:ring-2 focus:text-secondary w-full"
              aria-label="Search by date"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
              <LucideSearch className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col items-center">
          {filteredData.length > 0 ? (
            <div className="w-full h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
                >
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
                    dataKey="date"
                    stroke="#8884d8"
                    tickFormatter={(tick) => dayjs(tick).format("MMM DD, YYYY")}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                    tick={{ fontSize: 10, fill: "#666" }}
                  >
                    <Label
                      value="Date"
                      position="insideBottom"
                      offset={-10}
                      fill="#666"
                      style={{ fontSize: 12, textAnchor: "middle" }}
                    />
                  </XAxis>
                  <YAxis className="text-sm">
                    <Label
                      value="Number of Violators"
                      angle={-90}
                      position="insideLeft"
                      offset={-10}
                      fill="#999"
                      style={{ textAnchor: "middle", fontSize: 12 }}
                    />
                  </YAxis>
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#32ADE6"
                    barSize={40}
                    className="text-sm"
                    name="Violators Ticketed"
                  >
                    <LabelList
                      dataKey="total"
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
              No matches found.
            </div>
          )}
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Dashboard;
