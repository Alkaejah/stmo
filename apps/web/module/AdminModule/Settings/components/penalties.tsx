"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import useAddPenalty from "@/common/hooks/Admin/useAddPenalty";
import useGetAllPenalties from "@/common/hooks/Admin/useGetAllPenalties";
import { T_Penalty } from "@repo/contract";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PaginatedTable from "../../components/PaginatedTable";

const headers = ["Description", "Amount", "Action"];

const PenaltyTable = () => {
  const { data: penaltiesData, refetch } = useGetAllPenalties();
  const { mutateAsync: addPenalty } = useAddPenalty();
  const { register, handleSubmit, reset, watch } = useForm<T_Penalty>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = async (formData: T_Penalty) => {
    try {
      setIsLoading(true);
      const response = await addPenalty(formData);
      if (response?.error) {
        toast.error("Adding failed!");
      } else {
        toast.success("Penalty added successfully!");
        // Reset the form fields manually
        reset({
          penaltyDescription: "",
          penalty: undefined,
        });
        refetch(); // Refresh the list
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  const filteredPenalties = penaltiesData?.items
    ? penaltiesData.items.filter((item) => {
        const description = item.penaltyDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const amount = item.penalty?.toString().includes(searchTerm);
        return description || amount;
      })
    : [];

  const totalPages = Math.ceil(filteredPenalties.length / itemsPerPage);

  // Fixed renderRow with correct signature
  const renderRow = (item: Record<string, any>) => {
    if (item._id === "input-row") {
      return (
        <TableRow key="add-penalty-row">
          <TableCell>
            <Input
              type="text"
              placeholder="Enter Penalty Description"
              {...register("penaltyDescription", { required: true })}
              className="w-full"
              // Add value prop
              value={watch("penaltyDescription") || ""}
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              placeholder="Enter Penalty Amount"
              {...register("penalty", {
                required: true,
                valueAsNumber: true,
              })}
              className="w-full"
              // Add value prop
              value={watch("penalty") || ""}
            />
          </TableCell>
          <TableCell>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="bg-secondary hover:bg-blue-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </TableCell>
        </TableRow>
      );
    }
    // Data Rows
    return (
      <TableRow key={item._id}>
        <TableCell>{item.penaltyDescription}</TableCell>
        <TableCell>{item.penalty}</TableCell>
        <TableCell>
          <Button className="bg-gray-500 hover:bg-gray-600" disabled>
            Edit
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <WidthWrapper width="full">
      <div className="bg-white rounded-lg p-6 w-full">
        <div className="flex justify-center gap-2 mb-6">
          <Typography className="text-2xl text-secondary font-semibold">
            PENALTIES
          </Typography>
        </div>

        {/* Input Row + PaginatedTable */}
        <PaginatedTable
          data={[{ _id: "input-row" }, ...filteredPenalties]} // Add input row to data
          headers={headers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          onItemsPerPageChange={handleItemsPerPageChange}
          renderRow={renderRow} // Correct signature
        />
      </div>
    </WidthWrapper>
  );
};

export default PenaltyTable;
