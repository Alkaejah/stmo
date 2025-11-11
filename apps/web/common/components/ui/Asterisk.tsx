import React from "react";
import { cn } from "@/common/helpers/cn";

export interface SpanProps extends React.InputHTMLAttributes<HTMLSpanElement> {}

const Asterisk = ({ className }: SpanProps) => {
  return <span className={cn("text-error-500", className)}>*</span>;
};

export default Asterisk;
