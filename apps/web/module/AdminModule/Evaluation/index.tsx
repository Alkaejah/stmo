"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import {
  LucideCheck,
  LucideCircle,
  LucideClock,
  LucideReceiptText,
  LucideTicket,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import PaginatedTable from "../components/PaginatedTable";
import useGetAllViolationsRecord from "@/common/hooks/Drivers/module/useGetAllViolationsRecord";
import { T_Ticket } from "@repo/contract";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import OfficerEvaluationTable from "./component/OfficerEvaluationTable";

const headers = [
  "Enforcer",
  "Ticket No.",
  "Date",
  "Violation Address",
  "Driver",
  "License No.",
  "Plate No.",
  "Payment Status",
  "Ticket Status",
  "Action",
];

interface Proof {
  description: string;
  tags: string;
  _id?: number;
  eventId?: number;
  driverId?: number;
  activityId?: number;
  gameFowlMaterialId?: number;
  advertiserId?: number;
  advertisementId?: number;
  key?: string;
  thumbKey?: string | null;
  isDeleted?: boolean;
  isMain?: string | boolean;
  file?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

interface OtherViolations {
  violationDescription: string;
  violationId: string;
  penaltyId: string;
}

interface Address {
  _id: string;
  street: {
    street: string;
  };
  barangay: {
    barangay: string;
  };
}

interface Person {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Item {
  _id: string;
  ticketNumber: string;
  driver: Person;
  enforcer: Person;
  receipt: string | null;
  address: Address;
  licenseNumber: string;
  plateNumber: string;
  ticketStatus: string;
  paymentStatus: string;
  createdAt: string;
  driverControlNumber: string;
  violations: string[];
  proof: Proof[];
  otherViolations?: OtherViolations;
}

const Index = () => {
  return (
    <WidthWrapper width="full">
      <div className="relative w-full flex justify-center min-h-screen items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:pt-8 lg:pt-8">
        <div className="relative z-10 w-full max-w-full bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="flex justify-center text-center mb-4 w-[550px] lg:w-full max-w-full">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-10 md:p-10 w-full md:max-w-[550px] lg:max-w-full">
              <OfficerEvaluationTable />
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Index;
