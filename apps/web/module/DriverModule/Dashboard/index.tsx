"use client";

import { Typography } from "@/common/components/ui/Typography";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useDriverSessionStore from "@/common/store/useDriverSessionStore";

const steps = [
  {
    title: "Confirm Ticket Violation",
    description:
      "The ticket will appear in your notifications. Click the 'Confirm' button to view the ticket issued by the apprehending officer, ensuring all details are accurate.",
  },
  {
    title: "Gather Necessary Requirements",
    description:
      "Prepare essential documents, such as your Driver's License or any Government-issued ID.",
  },
  {
    title: "View Receipts",
    description:
      "Review your receipt, which provides a detailed breakdown of your violations and the total amount that needs to be paid.",
  },
  {
    title: "Pay the amount due",
    description:
      "Go to the municipal treasury. Complete the payment process using cash, card, or other accepted methods. Wait for the payment confirmation.",
  },
];

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const session = useDriverSessionStore((state) => state);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <WidthWrapper
      width="full"
      className="bg-sky-950 flex flex-col items-center justify-center min-h-screen px-6"
    >
      {/* Logo & Title Container */}
      <div className="flex flex-col items-center justify-center mt-6 lg:mt-8">
        {/* Logo with Increased Spacing on Top */}
        <Image
          src="/etravio.png"
          alt="Logo"
          width={220}
          height={220}
          className="object-contain mb-4"
        />

        {/* Title (Hidden on Mobile) */}
        <div className="hidden md:block">
          <Typography
            variant="h1"
            className="text-white text-center font-bold mb-6 lg:text-4xl md:text-3xl sm:text-2xl"
          >
            TRAFFIC VIOLATION MANAGEMENT SYSTEM
          </Typography>
        </div>
      </div>

      {/* White Container with Increased Bottom Padding */}
      <div className="bg-white py-8 px-8 sm:py-10 sm:px-10 md:py-12 md:px-12 lg:py-14 lg:px-16 rounded-xl shadow-lg max-w-screen-lg w-full mb-6">
        {/* Subtitle */}
        <Typography
          variant="h2"
          fontWeight="bold"
          className="text-center text-sky-900 mb-8 text-xl sm:text-3xl"
        >
          HOW TO SETTLE YOUR VIOLATIONS
        </Typography>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-sky-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-sky-700 transition duration-300 ease-in-out"
            >
              {/* Step Number */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-sky-900 text-white font-bold text-lg rounded-full shadow-md">
                {index + 1}
              </div>

              {/* Step Title */}
              <Typography
                variant="h3"
                className="text-lg font-semibold text-center mt-4"
              >
                {step.title}
              </Typography>

              {/* Step Description */}
              <Typography className="text-sm text-center mt-2">
                {step.description}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Dashboard;
