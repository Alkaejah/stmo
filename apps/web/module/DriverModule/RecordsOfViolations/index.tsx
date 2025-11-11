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
  const { data } = useGetAllViolationsRecord();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      return format(parseISO(date), "MMMM dd, yyyy");
    }
    if (date instanceof Date) {
      return format(date, "MM/dd/yyyy");
    }
    return "";
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const filteredTickets =
    (data?.items as Item[])?.filter((item) => {
      const ticketNumber = item.ticketNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const licenseNumber = item.licenseNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const plateNumber = item.plateNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const driversName = (item.driver?.firstName + " " + item.driver?.lastName)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const paymentStatus = item.paymentStatus
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const ticketStatus = item.ticketStatus
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const enforcerName = (
        item.enforcer?.firstName +
        " " +
        item.enforcer?.lastName
      )
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const violationAddress = (
        item.address?.street.street +
        " " +
        item.address?.barangay.barangay
      )
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return (
        ticketNumber ||
        licenseNumber ||
        plateNumber ||
        driversName ||
        paymentStatus ||
        ticketStatus ||
        enforcerName ||
        violationAddress
      );
    }) || [];

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const renderRow = (row: Item) => {
    const ticketStatusIcon =
      row.ticketStatus === "Confirmed" ? (
        <LucideCircle className="w-4 h-4 fill-current text-green-500" />
      ) : row.ticketStatus === "Pending" ? (
        <LucideCircle className="w-4 h-4 fill-current text-orange-500" />
      ) : row.ticketStatus === "Exceeded" ? (
        <LucideCircle className="w-4 h-4 fill-current text-red-500" />
      ) : (
        <LucideCircle className="w-4 h-4 fill-current text-gray-500" />
      );

    const paymentStatusIcon =
      row.paymentStatus === "Paid" ? (
        <LucideCheck className="w-4 h-4 text-green-500" />
      ) : row.paymentStatus === "Pending" ? (
        <LucideClock className="w-4 h-4 text-orange-500" />
      ) : (
        <LucideCircle className="w-4 h-4 fill-current text-gray-500" />
      );

    return (
      <TableRow key={row._id}>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.enforcer?.firstName + " " + row.enforcer?.lastName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.ticketNumber}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {formatDate(row.createdAt)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.address?.street.street + ", " + row.address?.barangay.barangay}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.driver?.firstName + " " + row.driver?.lastName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.licenseNumber || "--"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.plateNumber || "--"}
          </Typography>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {paymentStatusIcon}
            <Typography className="text-sm text-gray-800">
              {row.paymentStatus}
            </Typography>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {ticketStatusIcon}
            <Typography className="text-sm text-gray-800">
              {row.ticketStatus}
            </Typography>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Link href={`/driver/records-of-violation/view-ticket/${row._id}`}>
              <Button className="bg-secondary hover:bg-blue-400 text-white px-4 py-2">
                <LucideTicket size={18} className="mr-2" />
                Ticket
              </Button>
            </Link>

            {row.receipt ? (
              <Link
                href={`/driver/records-of-violation/view-receipt/${row.receipt}`}
              >
                <Button className="bg-secondary hover:bg-blue-400 text-white px-4 py-2">
                  <LucideReceiptText size={18} className="mr-2" />
                  Receipt
                </Button>
              </Link>
            ) : (
              <Button
                className="bg-gray-300 text-gray-500 px-4 py-2 cursor-not-allowed"
                disabled
              >
                <LucideReceiptText size={18} className="mr-2" />
                Receipt
              </Button>
            )}
            <Link
              href={`/driver/records-of-violation/add-feedback/${row._id}?enforcerId=${row.enforcer?._id}`}
            >
              <Button className="bg-secondary hover:bg-blue-400 text-white px-4 py-2">
                <LucideTicket size={18} className="mr-2" />
                Feedback
              </Button>
            </Link>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <WidthWrapper width="full">
      <div className="relative w-full flex justify-center min-h-screen items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:pt-8 lg:pt-8">
        <div className="relative z-10 w-full max-w-full bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="flex justify-center text-center mb-4 w-[550px] lg:w-full max-w-full">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-10 md:p-10 w-full md:max-w-[550px] lg:max-w-full">
              <div className="flex justify-center gap-2 mb-6">
                <Typography
                  fontWeight="semiBold"
                  className="text-center text-secondary mb-4 text-lg sm:text-lg md:text-xl lg:text-2xl px-4"
                >
                  RECORD OF VIOLATIONS
                </Typography>
              </div>

              <div className="w-full overflow-x-auto md:overflow-visible lg:overflow-visible">
                <div className="min-w-[400px]">
                  <PaginatedTable
                    data={filteredTickets}
                    headers={headers}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    totalPages={totalPages}
                    onSearchChange={handleSearchChange}
                    searchTerm={searchTerm}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    renderRow={renderRow}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default Index;
