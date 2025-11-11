"use client";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Typography } from "@/common/components/ui/Typography";
import Image from "next/image";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
  CartesianGrid,
} from "recharts";
import { LucideSearch } from "lucide-react";
import useBackOfficeSessionStore from "@/common/store/useBackOfficeSessionStore";
import useGetAllTickets from "@/common/hooks/Treasurers/useGetAllTickets";

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const session = useBackOfficeSessionStore((state) => state);
  console.log("user logged in: ", session.id);

  const { data, isPending } = useGetAllTickets();
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState<
    { month: string; paid: number; unpaid: number }[]
  >([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isPending && data?.items) {
      const counts: Record<string, { paid: number; unpaid: number }> = {};

      data.items.forEach((ticket) => {
        const formattedMonth = dayjs(ticket.createdAt).format("YYYY-MM");
        if (!counts[formattedMonth]) {
          counts[formattedMonth] = { paid: 0, unpaid: 0 };
        }

        // Count Paid and Unpaid tickets based on paymentStatus
        if (ticket.paymentStatus === "Paid") {
          counts[formattedMonth].paid += 1;
        } else if (ticket.paymentStatus === "Pending") {
          counts[formattedMonth].unpaid += 1;
        }
      });

      const formattedData = Object.entries(counts).map(
        ([month, { paid, unpaid }]) => ({
          month,
          paid,
          unpaid,
        }),
      );
      setChartData(formattedData);
    }
  }, [data, isPending]);

  const filteredData = chartData.filter(({ month }) => {
    const formattedMonth = dayjs(month).format("MMMM YYYY").toLowerCase();
    const monthAbbr = dayjs(month).format("MMM").toLowerCase();
    const fullMonth = dayjs(month).format("MMMM").toLowerCase();
    const yearMonth = dayjs(month).format("YYYY-MM");

    return (
      formattedMonth.includes(searchTerm) ||
      monthAbbr.includes(searchTerm) ||
      fullMonth.includes(searchTerm) ||
      yearMonth.includes(searchTerm)
    );
  });

  if (!isClient) {
    return null;
  }

  return (
    <WidthWrapper width="full" className="bg-sky-950 px-8">
      <div className="px-0">
        <div className="flex justify-center items-center min-h-screen">
          <div>
            <div className="flex justify-center text-center">
              <Image
                src="/etravio.png"
                alt="Logo"
                width={1000}
                height={1000}
                className="object-fit w-fit h-32"
              />
            </div>
            <Typography className="sm:text-2xl lg:text-4xl font-bold ml-4 text-white text-center mb-4">
              TRAFFIC VIOLATION MANAGEMENT SYSTEM
            </Typography>

            <div className="flex justify-end mb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by month (e.g., February, Feb, 2025-02)..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border border-gray-300 px-3 py-2 pr-10 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                  <LucideSearch className="w-5 h-5" />
                </span>
              </div>
            </div>

            <div className="bg-gray-50 py-10 px-4 rounded-sm">
              <div className="flex justify-center items-center mb-4">
                <Typography
                  variant="h5"
                  fontWeight="semiBold"
                  className="text-secondary text-center"
                >
                  Monthly Number of Paid and Unpaid Violators
                </Typography>
              </div>
              {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={filteredData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }} // Increased bottom margin
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <Legend
                      verticalAlign="top"
                      align="left"
                      iconType="square"
                      wrapperStyle={{
                        marginLeft: 24,
                        top: 5,
                        fontSize: "13px",
                      }} // Legend font size
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#8884d8"
                      tickFormatter={(tick) => dayjs(tick).format("MMMM")}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                      tick={{ fontSize: 13 }} // Match legend font size
                    >
                      <Label
                        value="Month"
                        position="insideBottom"
                        offset={-10}
                        fontSize={12}
                      />
                    </XAxis>
                    <YAxis tick={{ fontSize: 12 }}>
                      {" "}
                      {/* Match legend font size */}
                      <Label
                        value="Number of Violators"
                        angle={-90}
                        position="center"
                        offset={5}
                        fontSize={12} // Match legend font size
                      />
                    </YAxis>
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="paid"
                      stroke="#32ADE6"
                      strokeWidth={2}
                      name="Paid Violators"
                    />
                    <Line
                      type="monotone"
                      dataKey="unpaid"
                      stroke="#FF5733"
                      strokeWidth={2}
                      name="Unpaid Violators"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 font-semibold mt-4">
                  No matches found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Dashboard;
