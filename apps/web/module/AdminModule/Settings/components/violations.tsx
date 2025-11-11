"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { T_Violation } from "@repo/contract";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PaginatedTable from "../../components/PaginatedTable";
import useAddViolation from "@/common/hooks/Admin/useAddViolations";
import useGetAllViolationCategory from "@/common/hooks/Admin/useGetAllViolationCategort";
import Dropdown from "../../components/Dropdown";
import { DropdownItem } from "../../components/Dropdown";
import useGetAllViolations from "@/common/hooks/Admin/useGetAllViolations";

const headers = [
  "Violation Category",
  "Violation Code",
  "Violation Description",
  "Action",
];

const ViolationTable = () => {
  const { mutateAsync: addViolation } = useAddViolation();
  const { register, handleSubmit, reset, watch } = useForm<T_Violation>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DropdownItem | null>(
    null,
  );

  // Fetch violation categories for dropdown
  const { data: categoriesData } = useGetAllViolationCategory();
  const { data: violationsData, refetch } = useGetAllViolations(); // Add this hook

  // Transform categories data for dropdown
  const violationCategories: DropdownItem[] =
    categoriesData?.items?.map((category: any) => ({
      id: category._id,
      item: category.violationCategoryName,
      value: category._id,
    })) || [];

  // Submission handler
  const onSubmit = async (formData: T_Violation) => {
    try {
      setIsLoading(true);
      if (!selectedCategory) {
        throw new Error("Please select a violation category");
      }

      const violationData = {
        violationCategory: selectedCategory.id,
        violationCode: formData.violationCode,
        violationDescription: formData.violationDescription,
      };

      //@ts-ignore
      const response = await addViolation(violationData);

      if (response?.error) {
        toast.error("Adding failed!");
      } else {
        toast.success("Violation Added");
        reset();
        setSelectedCategory(null);
        refetch();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Search and pagination handlers
  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };

  // Filter violations based on search term
  const filteredViolations =
    violationsData?.items?.filter((violation) => {
      const search = searchTerm.toLowerCase();
      return (
        violation.violationCode.toLowerCase().includes(search) ||
        violation.violationDescription.toLowerCase().includes(search) ||
        violation.violationCategory.violationCategoryName
          .toLowerCase()
          .includes(search)
      );
    }) || [];

  const totalPages = Math.ceil(filteredViolations.length / itemsPerPage);

  // Table row renderer
  const renderRow = (item: Record<string, any>) => {
    if (item._id === "input-row") {
      return (
        <TableRow key="add-violation-row">
          <TableCell>
            <Dropdown
              items={violationCategories}
              selectedItem={selectedCategory}
              onSelectItem={setSelectedCategory}
              placeholder="Select Category"
              className="w-full"
            />
          </TableCell>
          <TableCell>
            <Input
              type="text"
              placeholder="Violation Code"
              {...register("violationCode", { required: true })}
              className="w-full"
              value={watch("violationCode") || ""}
            />
          </TableCell>
          <TableCell>
            <Input
              type="text"
              placeholder="Violation Description"
              {...register("violationDescription", { required: true })}
              className="w-full"
              value={watch("violationDescription") || ""}
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

    return (
      <TableRow key={item._id}>
        <TableCell>{item.violationCategory.violationCategoryName}</TableCell>
        <TableCell>{item.violationCode}</TableCell>
        <TableCell>{item.violationDescription}</TableCell>
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
            VIOLATIONS
          </Typography>
        </div>

        <PaginatedTable
          data={[{ _id: "input-row" }, ...filteredViolations]}
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
    </WidthWrapper>
  );
};

export default ViolationTable;
