"use client";
import { Button } from "@/common/components/shadcn/ui/button";
import { Input } from "@/common/components/shadcn/ui/input";
import { TableCell, TableRow } from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { WidthWrapper } from "@/common/components/WidthWrapper";
import { T_Violation_Address } from "@repo/contract";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PaginatedTable from "../../components/PaginatedTable";
import useAddViolationAddress from "@/common/hooks/Admin/useAddViolationAddress";
import useGetAllViolationAddress from "@/common/hooks/Admin/useGetAllViolationAddress";

const headers = [
  "Street",
  "Street(lng)",
  "Street(lat)",
  "Barangay",
  "Barangay(lng)",
  "Barangay(lat)",
  "Action",
];

const ViolationAddressTable = () => {
  const { data: violationAddressData, refetch } = useGetAllViolationAddress();
  const { mutateAsync: addViolationAddress } = useAddViolationAddress();
  const { register, handleSubmit, reset, watch } =
    useForm<T_Violation_Address>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = async (formData: T_Violation_Address) => {
    try {
      setIsLoading(true);
      const response = await addViolationAddress(formData);
      if (response?.error) {
        toast.error("Adding failed!");
      } else {
        toast.success("Violation Address Added");
        reset({
          street: {
            street: "",
            longitude: undefined,
            latitude: undefined,
          },
          barangay: {
            barangay: "",
            longitude: undefined,
            latitude: undefined,
          },
        });
        refetch();
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

  const filteredViolationAddress = violationAddressData?.items
    ? violationAddressData.items.filter((item) => {
        const search = searchTerm.toLowerCase();
        return (
          item.street.street.toLowerCase().includes(search) ||
          item.street.longitude.toString().includes(search) ||
          item.street.latitude.toString().includes(search) ||
          item.barangay.barangay.toLowerCase().includes(search) ||
          item.barangay.longitude.toString().includes(search) ||
          item.barangay.latitude.toString().includes(search)
        );
      })
    : [];

  const totalPages = Math.ceil(filteredViolationAddress.length / itemsPerPage);

  const renderRow = (item: Record<string, any>) => {
    if (item._id === "input-row") {
      return (
        <TableRow key="add-penalty-row">
          {/* Street Inputs */}
          <TableCell>
            <Input
              type="text"
              placeholder="Enter Street"
              {...register("street.street", { required: true })}
              value={watch("street.street") || ""}
              className="w-full"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              placeholder="Enter Longitude"
              {...register("street.longitude", {
                required: true,
                valueAsNumber: true,
              })}
              value={watch("street.longitude") || ""}
              className="w-full"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              placeholder="Enter Latitude"
              {...register("street.latitude", {
                required: true,
                valueAsNumber: true,
              })}
              value={watch("street.latitude") || ""}
              className="w-full"
            />
          </TableCell>

          {/* Barangay Inputs */}
          <TableCell>
            <Input
              type="text"
              placeholder="Enter Barangay"
              {...register("barangay.barangay", { required: true })}
              value={watch("barangay.barangay") || ""}
              className="w-full"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              placeholder="Enter Longitude"
              {...register("barangay.longitude", {
                required: true,
                valueAsNumber: true,
              })}
              value={watch("barangay.longitude") || ""}
              className="w-full"
            />
          </TableCell>
          <TableCell>
            <Input
              type="number"
              placeholder="Enter Latitude"
              {...register("barangay.latitude", {
                required: true,
                valueAsNumber: true,
              })}
              value={watch("barangay.latitude") || ""}
              className="w-full"
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
        <TableCell>{item.street.street}</TableCell>
        <TableCell>{item.street.longitude}</TableCell>
        <TableCell>{item.street.latitude}</TableCell>
        <TableCell>{item.barangay.barangay}</TableCell>
        <TableCell>{item.barangay.longitude}</TableCell>
        <TableCell>{item.barangay.latitude}</TableCell>
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-full">
        <div className="flex justify-center gap-2 mb-6">
          <Typography className="text-2xl text-secondary font-semibold">
            VIOLATION ADDRESSES
          </Typography>
        </div>

        <PaginatedTable
          data={[{ _id: "input-row" }, ...filteredViolationAddress]}
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

export default ViolationAddressTable;
