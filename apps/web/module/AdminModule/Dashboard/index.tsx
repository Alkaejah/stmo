"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/common/components/ui/Typography";
import Image from "next/image";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { MapPin, Clock } from "lucide-react";
import HistoricalTicketMap from "./components/HistoricalTicketMap";
import SystemGeneratedTicketMap from "./components/SystemGeneratedTicketMap";
import { Button } from "@/common/components/shadcn/ui/button";
import TopFiveByViolationCode2 from "@/module/AdminModule/Reports/components/analytics/system-generated/TopFiveByViolationCode2";
import useGetAllTickets from "@/common/hooks/Treasurers/useGetAllTickets";
import dayjs from "dayjs";
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
import ModalContainer from "@/common/components/ModalContainer";

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeMap, setActiveMap] = useState<"latest" | "historical">("latest");
  const [selectedChart, setSelectedChart] = useState<React.ReactNode | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalWithChart = (chart: React.ReactNode) => {
    setSelectedChart(chart);
    setIsModalOpen(true);
  };

  const { data, isPending } = useGetAllTickets();
  const [chartData, setChartData] = useState<
    { month: string; paid: number; unpaid: number }[]
  >([]);

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
        if (ticket.paymentStatus === "Paid") {
          counts[formattedMonth].paid += 1;
        } else if (ticket.paymentStatus === "Pending") {
          counts[formattedMonth].unpaid += 1;
        }
      });

      const formattedData = Object.entries(counts).map(
        ([month, { paid, unpaid }]) => ({ month, paid, unpaid }),
      );
      setChartData(formattedData);
    }
  }, [data, isPending]);

  if (!isClient) return null;

  return (
    <WidthWrapper
      width="full"
      className="bg-sky-950 px-4 md:px-8 flex flex-col min-h-screen py-8 relative z-10"
    >
      <div className="flex justify-center mb-6">
        <Image
          src="/etravio.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="object-contain w-full h-24 md:h-32"
        />
      </div>

      <Typography className="text-xl md:text-2xl lg:text-4xl font-bold text-white text-center mb-8">
        TRAFFIC VIOLATION MANAGEMENT SYSTEM
      </Typography>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Map Section */}
        <div className="bg-gray-50 p-4 rounded-md shadow-md w-full lg:w-[65%] flex flex-col justify-between">
          <Typography
            variant="h5"
            fontWeight="semiBold"
            className="text-secondary text-center mb-2"
          >
            DISTRIBUTION OF VIOLATIONS IN SINILOAN, LAGUNA
          </Typography>
          <div className="flex justify-center items-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={activeMap === "latest" ? "default" : "outline"}
                onClick={() => setActiveMap("latest")}
              >
                <MapPin className="w-4 h-4 mr-2" /> Latest
              </Button>
              <Button
                variant={activeMap === "historical" ? "default" : "outline"}
                onClick={() => setActiveMap("historical")}
              >
                <Clock className="w-4 h-4 mr-2" /> Historical
              </Button>
            </div>
          </div>
          <div className="flex-grow">
            {activeMap === "latest" ? (
              <SystemGeneratedTicketMap />
            ) : (
              <HistoricalTicketMap />
            )}
          </div>
        </div>

        {/* Right - Charts Stack */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6">
          {/* Paid/Unpaid Line Chart */}
          <div
            className="bg-gray-50 py-6 px-4 rounded-md shadow-md flex-1 cursor-pointer"
            onClick={() =>
              openModalWithChart(
                <div className="w-full flex justify-center">
                  <ResponsiveContainer width="90%" height={300}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <Legend
                        verticalAlign="top"
                        align="left"
                        iconType="square"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#8884d8"
                        tickFormatter={(tick) => dayjs(tick).format("MMMM")}
                        angle={-30}
                        textAnchor="end"
                        height={50}
                      >
                        <Label
                          value="Month"
                          position="insideBottom"
                          offset={-10}
                          fontSize={12}
                        />
                      </XAxis>
                      <YAxis tick={{ fontSize: 12 }}>
                        <Label
                          value="Number of Violators"
                          angle={-90}
                          position="center"
                          offset={5}
                          fontSize={12}
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
                </div>,
              )
            }
          >
            <p className="text-center text-sky-900 text-[8px] sm:text-sm mb-4">
              Top 5 Violations by Violation Code
            </p>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend verticalAlign="top" align="left" iconType="square" />
                  <XAxis
                    dataKey="month"
                    stroke="#8884d8"
                    tickFormatter={(tick) => dayjs(tick).format("MMMM")}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                  >
                    <Label
                      value="Month"
                      position="insideBottom"
                      offset={-10}
                      fontSize={12}
                    />
                  </XAxis>
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label
                      value="Number of Violators"
                      angle={-90}
                      position="center"
                      offset={5}
                      fontSize={12}
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
            </div>
          </div>

          {/* Violation Code Chart */}
          <div
            className="bg-gray-50 py-6 px-4 rounded-md shadow-md flex-1 cursor-pointer"
            onClick={() =>
              openModalWithChart(<TopFiveByViolationCode2 showAll={true} />)
            }
          >
            {/* <Typography
              variant="h5"
              fontWeight="semiBold"
              className="text-secondary text-center mb-4"
            >
              Top 5 Violations by Violation Code
            </Typography> */}
            <TopFiveByViolationCode2 showAll={false} />
          </div>
        </div>
      </div>

      <ModalContainer
        title="Top Violations by Code"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <div className="p-4 h-[80vh] flex justify-center items-center">
          {selectedChart}
        </div>
      </ModalContainer>
    </WidthWrapper>
  );
};

export default Dashboard;
