import React from "react";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";
import { LucideCheckCheck } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-55"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 items-center">
          <LucideCheckCheck size={20} color="green" />
          <Typography variant="h3" className="text-lg font-semibold">
            Confirmation
          </Typography>
        </div>

        <Typography className="py-4">{message}</Typography>

        {/* Align buttons to the right and move Cancel to the last */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="default"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </Button>
          <Button variant="destructive" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
