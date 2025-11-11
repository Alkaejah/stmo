"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { LucideArrowLeft, LucidePieChart, LucideUsers } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { E_Back_Officer_Role } from "@repo/contract";
import useGetAllEnforcersForEvaluation from "@/common/hooks/Admin/useGetAllEnforcerForEvaluation";
import Link from "next/link";
import PaginatedTable from "../../components/PaginatedTable";

const headers = [
  "First Name",
  "Last Name",
  "Current Assignment",
  "Status",
  "Action",
];

const OfficerEvaluationTable = () => {
  const { data } = useGetAllEnforcersForEvaluation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const handleRedirectBack = () => {
    router.push(`/admin`);
  };

  const filteredOfficers =
    (data?.items as any[])
      ?.filter((item) => item.role !== E_Back_Officer_Role.Admin)
      ?.filter((item) => {
        const firstName = item.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const lastName = item.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        return firstName || lastName;
      }) || [];

  const totalPages = Math.ceil(filteredOfficers.length / itemsPerPage);

  const renderRow = (row: any) => {
    const street = row.assignment?.street?.street || "N/A";
    const barangay = row.assignment?.barangay?.barangay || "N/A";
    return (
      <TableRow key={row._id}>
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
            {street + ", " + barangay}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            className={`text-sm ${
              row.deactivated ? "text-red-500" : "text-green-500"
            }`}
          >
            {row.deactivated ? "inactive" : "active"}
          </Typography>
        </TableCell>
        <TableCell>
          <div className="flex gap-2 justify-center">
            <Link href={`/admin/officer-evaluation/summary/${row._id}`}>
              <Button className="bg-secondary hover:bg-blue-400 text-white px-4 py-2">
                <LucideUsers size={18} className="mr-2" />
                Evaluation Report
              </Button>
            </Link>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-white rounded-lg p-6 w-full">
        <div className="flex justify-center gap-2 mb-6">
          <Typography className="text-2xl text-secondary font-semibold">
            ENFORCERS
          </Typography>
        </div>

        <div>
          <PaginatedTable
            data={filteredOfficers}
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
    </WidthWrapper>
  );
};

export default OfficerEvaluationTable;
