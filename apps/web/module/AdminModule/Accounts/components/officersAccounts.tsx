"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { LucideArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import useGetAllOfficersAccounts from "@/common/hooks/Admin/useGetAllOfficersAccounts";
import { E_Back_Officer_Role } from "@repo/contract";
import useActivateDeactivateOfficerAccount from "@/common/hooks/Admin/useActivateDeactivateOfficerAccount";
import toast from "react-hot-toast";
import { Switch } from "@/common/components/shadcn/ui/switch";
import PaginatedTable from "../../components/PaginatedTable";
import ConfirmationModal from "../../components/ConfirmationModal";

const headers = [
  "Created",
  "Updated",
  "Deactivated/Activated",
  "Control No.",
  "First Name",
  "Last Name",
  "Username",
  "Role",
  "Status",
  "Action",
];

interface T_Officer_Account_Status {
  _id: string;
  deactivated: boolean;
  firstName: string;
  lastName: string;
}

const OfficersAccountsTable = () => {
  const { data, refetch } = useGetAllOfficersAccounts();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountStatusToggle, setAccountStatusToggle] =
    useState<T_Officer_Account_Status | null>(null);

  const { mutate: mutateActivateDeactivate } =
    useActivateDeactivateOfficerAccount(accountStatusToggle?._id || undefined);

  const handleToggle = (row: T_Officer_Account_Status) => {
    if (!row._id || typeof row._id !== "string") {
      console.error("Invalid or missing ID for row:", row);
      toast.error("Invalid Officer ID.");
      return;
    }

    setAccountStatusToggle(row); // Set the driver to toggle
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmToggle = async () => {
    if (accountStatusToggle?._id) {
      try {
        const newStatus = !accountStatusToggle.deactivated;

        mutateActivateDeactivate(
          { deactivate: newStatus },
          {
            onSuccess: () => {
              toast.success(
                `Officer account ${newStatus ? "Deactivated" : "Activated"}`,
              );
              setIsModalOpen(false);
              refetch(); // Refetch data to update the UI
            },
            onError: (error) => {
              console.error("Error updating account status:", error);
              toast.error("Failed to update account status.");
            },
          },
        );
      } catch (error) {
        toast.error("Error updating account status");
      }
    } else {
      toast.error("Officer ID is missing or invalid");
    }
  };

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
    router.push(`/admin`);
  };

  const filteredOfficers =
    (data?.items as any[])
      ?.filter((item) => item.role !== E_Back_Officer_Role.Admin) // Exclude Admins
      ?.filter((item) => {
        const backOfficerControlNumber = item.backOfficerControlNumber
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
        const role = item.role
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        return (
          backOfficerControlNumber || firstName || lastName || username || role
        );
      }) || [];

  const totalPages = Math.ceil(filteredOfficers.length / itemsPerPage);

  const renderRow = (row: any) => {
    const isDeactivated = row.deactivated;
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
            {row.backOfficerControlNumber}
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
          <Typography className="text-sm text-gray-800">{row.role}</Typography>
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
          <Switch
            checked={!isDeactivated}
            onCheckedChange={() => handleToggle(row)}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-white rounded-lg p-6 w-full">
        <div className="flex justify-center gap-2 mb-6">
          <Typography className="text-2xl text-secondary font-semibold">
            OFFICERS ACCOUNTS
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
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmToggle}
        message={
          accountStatusToggle?.deactivated
            ? `Are you sure you want to Activate "${accountStatusToggle.firstName} ${accountStatusToggle.lastName}"?`
            : `Are you sure you want to Deactivate "${accountStatusToggle?.firstName} ${accountStatusToggle?.lastName}"?`
        }
      />
    </WidthWrapper>
  );
};

export default OfficersAccountsTable;
