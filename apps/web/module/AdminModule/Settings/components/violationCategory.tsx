"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { T_Violation_Category } from "@repo/contract";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PaginatedTable from "../../components/PaginatedTable";
import useAddViolationCategory from "@/common/hooks/Admin/useAddViolationCategory";
import useGetAllViolationCategory from "@/common/hooks/Admin/useGetAllViolationCategort";

const headers = ["Violation Category Name", "Action"];

const ViolationCategoryTable = () => {
  const { data: violationCategoryData, refetch } = useGetAllViolationCategory();
  const { mutateAsync: addViolationCategory } = useAddViolationCategory();
  const { register, handleSubmit, reset, watch } =
    useForm<T_Violation_Category>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = async (formData: T_Violation_Category) => {
    try {
      setIsLoading(true);
      const response = await addViolationCategory(formData);
      if (response?.error) {
        toast.error("Adding failed!");
      } else {
        toast.success("Violation Category Added");
        // Reset the form fields manually
        reset({
          violationCategoryName: "",
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

  const filteredViolationCategoryData = violationCategoryData?.items
    ? violationCategoryData.items.filter((item) => {
        const categoryName = item.violationCategoryName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        return categoryName;
      })
    : [];

  const totalPages = Math.ceil(
    filteredViolationCategoryData.length / itemsPerPage,
  );

  // Fixed renderRow with correct signature
  const renderRow = (item: Record<string, any>) => {
    if (item._id === "input-row") {
      return (
        <TableRow key="add-penalty-row">
          <TableCell>
            <Input
              type="text"
              placeholder="Enter Violation Category Name"
              {...register("violationCategoryName", { required: true })}
              className="w-full"
              // Add value prop
              value={watch("violationCategoryName") || ""}
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
        <TableCell>{item.violationCategoryName}</TableCell>
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
            VIOLATION CATEGORY
          </Typography>
        </div>

        {/* Input Row + PaginatedTable */}
        <PaginatedTable
          data={[{ _id: "input-row" }, ...filteredViolationCategoryData]} // Add input row to data
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

export default ViolationCategoryTable;
