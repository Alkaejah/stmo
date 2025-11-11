import React, { useState } from "react";
import { Typography } from "./ui/Typography";

interface SwitchProps {
  label?: string;
  isOn: boolean;
  toggleSwitch: () => void;
}

const CustomSwitch = ({ label, isOn, toggleSwitch }: SwitchProps) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {label && <Typography fontWeight="semiBold">{label}</Typography>}
      <div
        className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition-colors duration-300 ${
          isOn ? "bg-primary" : "bg-gray-400"
        }`}
        onClick={toggleSwitch}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      <Typography fontWeight="semiBold">{isOn ? "On" : "Off"}</Typography>
    </div>
  );
};

export default CustomSwitch;
