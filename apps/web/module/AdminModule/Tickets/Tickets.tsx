"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import {
  LucideCheck,
  LucideCircle,
  LucideClock,
  LucideTicket,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { T_Ticket } from "@repo/contract";
import { format, parseISO } from "date-fns";
import PaginatedTable from "../components/PaginatedTable";
import useGetAllTicketsForAdmin from "@/common/hooks/Admin/useGetAllTicketsForAdmin";
import toast from "react-hot-toast";

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

const TicketsForAdmin = () => {
  const { data } = useGetAllTicketsForAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleExportCSV = () => {
    if (!data?.items || data.items.length === 0) {
      toast.error("No ticket data to export.");
      return;
    }

    const csvHeaders = [
      "Ticket No.",
      "Date",
      "License No.",
      "Plate No.",
      "Driver",
      "Enforcer",
      "Address (Street)",
      "Address (Barangay)",
      "Violations",
      "Penalties",
      "Payment Status",
      "Ticket Status",
      "Receipt Number",
      "Receipt Agency",
      "Collecting Officer",
      "Total",
      "Amount In Words",
    ];

    const rows = data.items.map((item) => {
      const date = formatDate(item.createdAt);
      const driverName = `${item.driver?.firstName || ""} ${item.driver?.lastName || ""}`;
      const enforcerName = `${item.enforcer?.firstName || ""} ${item.enforcer?.lastName || ""}`;
      const street = item.address?.street?.street || "";
      const barangay = item.address?.barangay?.barangay || "";

      const violations = [
        ...(item.violations || []),
        ...(item.otherViolations || []),
      ]
        .map((v) => v.violationId?.violationDescription || "")
        .join("; ");
      const penalties = [
        ...(item.violations || []),
        ...(item.otherViolations || []),
      ]
        .map((v) => v.penaltyId?.penalty || "")
        .join("; ");

      const receipt = item.receipt;
      const receiptNumber = receipt?.receiptNumber || "";
      const agency = receipt?.agency || "";
      const collectingOfficer = receipt?.collectingOfficer
        ? `${receipt.collectingOfficer.firstName} ${receipt.collectingOfficer.lastName}`
        : "";
      const total = receipt?.total?.toString() || "";
      const amountInWords = receipt?.amountInWords || "";

      return [
        item.ticketNumber,
        date,
        item.licenseNumber,
        item.plateNumber,
        driverName,
        enforcerName,
        street,
        barangay,
        violations,
        penalties,
        item.paymentStatus,
        item.ticketStatus,
        receiptNumber,
        agency,
        collectingOfficer,
        total,
        amountInWords,
      ];
    });

    const csvContent = [
      csvHeaders.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tickets_full.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <Link href={`/admin/tickets/${row._id}/ticket-single-view`}>
              <Button className="bg-secondary hover:bg-blue-400 text-white px-4 py-2">
                <LucideTicket size={18} className="mr-2" /> View Ticket
              </Button>
            </Link>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <WidthWrapper width="full">
      <div className="relative w-full min-h-screen flex justify-center items-center bg-cover bg-center bg-[url('/Aerial_Shot.png')] px-4 sm:px-6 md:px-8 lg:px-8 md:py-8 lg:py-8">
        <div className="relative z-10 min-h-[90vh] w-full bg-primary bg-opacity-50 shadow-2xl rounded-xl flex flex-col items-center p-6 sm:p-10 md:p-12 lg:p-14">
          <div className="bg-white rounded-lg shadow-md w-full px-4 sm:px-8 md:px-12 py-6 sm:py-10">
            <div className="flex justify-center gap-2 mb-6">
              <Typography className="text-2xl text-secondary font-semibold">
                RECORD OF VIOLATIONS
              </Typography>
            </div>

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

            <div className="mt-6">
              <Button
                onClick={handleExportCSV}
                className="bg-secondary hover:bg-blue-400 text-white px-6 py-2"
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default TicketsForAdmin;
