"use client";

import React, { useState } from "react";
import { Button } from "@/common/components/shadcn/ui/button";
import { Typography } from "@/common/components/ui/Typography";

interface ApprehensionExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (explanation: string) => void; // Accepts a string argument
}

const ApprehensionExplanationModal: React.FC<
  ApprehensionExplanationModalProps
> = ({ isOpen, onClose, onSave }) => {
  const [explanation, setExplanation] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(explanation); // Pass the explanation string
    onClose(); // Close modal after saving
    setExplanation(""); // Reset input
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Typography className="text-lg font-bold mb-4 text-gray-800">
          Please explain why you believe the apprehension was inaccurate.
        </Typography>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={5}
          className="w-full bg-gray-200 rounded-md p-3 resize-none focus:outline-none"
          placeholder="Write your explanation here..."
        />

        <Button
          onClick={handleSave}
          className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ApprehensionExplanationModal;
