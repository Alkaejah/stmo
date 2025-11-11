import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/shadcn/ui/table";
import { Typography } from "@/common/components/ui/Typography";
import { Input } from "@/common/components/shadcn/ui/input";
import {
  LucideBookOpen,
  LucideChevronLeft,
  LucideChevronRight,
  LucideSearch,
} from "lucide-react";

interface PaginatedTableProps<T> {
  data: T[];
  headers: string[];
  formatDate?: (date: string | Date | undefined) => string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (pageNumber: number) => void;
  totalPages: number;
  onSearchChange: (searchTerm: string) => void;
  searchTerm: string;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onEditClick?: (id: string) => void;
  onShowClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  renderRow: (item: T) => React.ReactNode;
  tableTitle?: string;
  icon?: ReactNode;
  showControls?: boolean;
}

const PaginatedTable = <T,>({
  data,
  headers,
  formatDate,
  currentPage,
  itemsPerPage,
  onPageChange,
  totalPages,
  onSearchChange,
  searchTerm,
  onItemsPerPageChange,
  renderRow,
  tableTitle,
  icon,
  showControls = true,
}: PaginatedTableProps<T>) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col h-full mt-4">
      <div className="overflow-x-auto">
        {showControls && (
          <div className="mb-4 flex justify-between items-center gap-2 p-1">
            <div className="flex items-center gap-2">
              {icon}
              <Typography variant="h4" fontWeight="semiBold">
                {tableTitle}
              </Typography>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="p-2 border rounded-md"
              >
                {[5, 10, 15, 20].map((option) => (
                  <option key={option} value={option}>
                    List {option}
                  </option>
                ))}
              </select>

              <div className="relative w-80">
                <LucideSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 border rounded-md w-full"
                />
              </div>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="bg-gray-200">
                  <Typography
                    fontWeight="semiBold"
                    className="flex justify-center"
                    variant="h5"
                  >
                    {header}
                  </Typography>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="mt-4 text-sm">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const key = (item as any).id || index; // Use `id` if available, otherwise fallback to index
                return (
                  <React.Fragment key={key}>{renderRow(item)}</React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-center text-gray-400"
                >
                  <Typography fontWeight="semiBold">No data found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showControls && (
        <div className="mt-4 h-12 flex justify-end items-center border-gray-200">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2"
          >
            <LucideChevronLeft
              size={24}
              className={currentPage === 1 ? "text-gray-400" : "text-black"}
            />
          </button>
          <Typography>
            Page {currentPage} of {totalPages}
          </Typography>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2"
          >
            <LucideChevronRight
              size={24}
              className={
                currentPage === totalPages ? "text-gray-400" : "text-black"
              }
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;
