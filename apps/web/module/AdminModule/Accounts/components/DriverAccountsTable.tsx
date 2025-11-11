"use client";

import { Button } from "@/common/components/shadcn/ui/button";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { LucideArrowLeft, LucideFileUp } from "lucide-react";
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import useGetAllDriversAccounts from "@/common/hooks/Admin/useGetAllDriversAccounts";
import toast from "react-hot-toast";
import { Spinner } from "@/common/components/ui/Spinner";
import useUploadDriverCSV from "@/common/hooks/Admin/useUploadDriverCSV"; // Import the hook
import PaginatedTable from "../../components/PaginatedTable";

const headers = [
  "Created",
  "Updated",
  "Deactivated/Activated",
  "Control No.",
  "First Name",
  "Last Name",
  "Username",
  "Street",
  "Barangay",
  "Municipality",
  "City/Province",
];

const DriverAccountsTable = () => {
  const { data, refetch } = useGetAllDriversAccounts();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    mutate: uploadCSV,
    isPending: isUploadPending,
    error: uploadError,
    data: uploadData,
  } = useUploadDriverCSV();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "--";
    if (typeof date === "string") {
      return format(parseISO(date), "MM/dd/yyyy");
    }
    if (date instanceof Date) {
      return format(date, "MM/dd/yyyy");
    }
    return "N/A";
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
    router.push(`/admin/dashboard`);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      uploadCSV(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    } else {
      toast.error("No file selected.");
    }
  };

  useEffect(() => {
    if (uploadData) {
      toast.success("Upload successful!");
      refetch(); // Refresh the table after successful upload
    }
  }, [uploadData]);

  useEffect(() => {
    if (uploadError) {
      toast.error(`Upload Error: ${uploadError.message}`);
    }
  }, [uploadError]);

  const filteredDrivers =
    (data?.items as any[])?.filter((item) => {
      const driverControlNumber = item.driverControlNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const firstName = item.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const lastName = item.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const username = item.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const street = item.address?.street
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const barangay = item.address?.barangay
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const municipality = item.address?.municipality
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const province = item.address?.province
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return (
        driverControlNumber ||
        firstName ||
        lastName ||
        username ||
        street ||
        barangay ||
        municipality ||
        province
      );
    }) || [];

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const renderRow = (row: any) => {
    return (
      <TableRow key={row._id}>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {formatDate(row.createdAt)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {formatDate(row.updatedAt)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {formatDate(row.deactivatedAt)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.driverControlNumber}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.firstName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.lastName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.username}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.address?.street || "N/A"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.address?.barangay || "N/A"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.address?.municipality || "N/A"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography className="text-sm text-gray-800">
            {row.address?.province || "N/A"}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-white rounded-lg  p-4 md:p-6 w-full">
        <div className="flex justify-center gap-2 mb-4 md:mb-6">
          <Typography className="text-xl md:text-2xl text-secondary font-semibold text-center">
            DRIVER ACCOUNTS
          </Typography>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-2">
            <LucideFileUp size={20} />
            <Typography variant="h4" fontWeight="semiBold">
              Upload Driver Accounts CSV
            </Typography>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="border border-gray-300 px-3 py-1.5 pr-10 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
              ref={fileInputRef} // Attach the ref to the file input
            />
            <Button
              className="w-full max-w-[100px] self-end mt-4"
              variant="default"
              size="lg"
              type="button"
              onClick={handleUploadClick}
            >
              {isUploadPending ? <Spinner size="md" /> : "Upload CSV"}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <PaginatedTable
            data={filteredDrivers}
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
          className="bg-gray-500 hover:bg-gray-600 text-white w-full sm:w-auto md:w-32 font-bold py-2 px-4 rounded flex items-center justify-center gap-2 mt-4"
          onClick={handleRedirectBack}
          aria-label="Go Back"
        >
          <LucideArrowLeft size={18} /> Back
        </Button>
      </div>
    </WidthWrapper>
  );
};

export default DriverAccountsTable;
