"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import {
  LucideArrowLeft,
  LucideCheck,
  LucideCircle,
  LucideClock,
  LucideReceiptText,
  LucideTicket,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { T_Ticket } from "@repo/contract";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import useGetAllTickets from "@/common/hooks/Enforcers/useGetAllTickets";
import PaginatedTable from "../components/PaginatedTable";

const headers = [
  "Ticket No.",
  "Date",
  "License No.",
  "Plate No.",
  "Driver's Name",
  "Payment Status",
  "Ticket Status",
  "Action",
];

const index = () => {
  const { data } = useGetAllTickets();
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

  const handleRedirectBack = () => {
    router.push(`/officer/dashboard`);
  };

  const filteredTickets =
    (data?.items as T_Ticket[])?.filter((item) => {
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

      return (
        ticketNumber ||
        licenseNumber ||
        plateNumber ||
        driversName ||
        paymentStatus ||
        ticketStatus
      );
    }) || [];

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const renderRow = (row: T_Ticket) => {
    // Determine Ticket Status Icon and Color
    const ticketStatusIcon =
      row.ticketStatus === "Confirmed" ? (
        <LucideCircle className="w-4 h-4 fill-current text-green-500" />
      ) : row.ticketStatus === "Pending" ? (
        <LucideCircle className="w-4 h-4 fill-current text-orange-500" />
      ) : row.ticketStatus === "Exceeded" ? (
        <LucideCircle className="w-4 h-4 fill-current text-red-500" />
      ) : (
        <LucideCircle className="w-4 h-4 fill-current text-gray-500" /> // Default for unknown status
      );

    // Determine Payment Status Icon and Color
    const paymentStatusIcon =
      row.paymentStatus === "Paid" ? (
        <LucideCheck className="w-4 h-4 text-green-500" />
      ) : row.paymentStatus === "Pending" ? (
        <LucideClock className="w-4 h-4 text-orange-500" />
      ) : (
        <LucideCircle className="w-4 h-4 fill-current text-gray-500" /> // Default for unknown status
      );

    return (
      <TableRow key={row._id}>
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
            {row.licenseNumber}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.plateNumber}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.driver?.firstName + " " + row.driver?.lastName}
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
            <Link
              href={`/officer/ticket-history/${row._id}/ticket-single-view`}
            >
              <Button className="bg-secondary hover:bg-blue-400 text-white px-4 py-2">
                <LucideTicket size={18} className="mr-2" /> View Ticket
              </Button>
            </Link>
            {/* <Link href={`/records-of-violation/view-receipt/${row._id}`}> */}
            <Link
              href={`/officer/ticket-history/view-receipt/${row.receipt?._id}`}
            >
              <Button className="bg-secondary hover:bg-blue-400 text-white px-4 py-2">
                <LucideReceiptText size={18} className="mr-2" /> View Receipt
              </Button>
            </Link>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <WidthWrapper width="full">
      <div className="w-full min-h-screen flex justify-center items-center p-8 bg-[url('/Aerial_Shot.png')] bg-cover bg-center">
        <div className="bg-primary bg-opacity-80 shadow-lg rounded-lg p-10 max-w-6xl">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            <div className="flex justify-center gap-2 mb-6">
              <Typography className="text-2xl text-secondary font-semibold">
                RECORD OF VIOLATIONS
              </Typography>
            </div>

            <div>
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
            <Button
              size="default"
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto md:w-32 font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              onClick={handleRedirectBack}
            >
              <LucideArrowLeft size={18} /> Back
            </Button>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default index;
