import * as React from "react";
import { cn } from "@/common/helpers/cn";
import { Typography } from "./Typography";
import Asterisk from "./Asterisk";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, id, label, errorMessage, ...props }, ref) => {
    return (
      <div>
        <div
          className={cn(
            "relative bg-gray-50 focus:ring-blue-500 rounded-lg text-gray-900 px-3 pb-2.5 pt-2.5 ring-1 ring-inset ring-text-200 focus-within:z-10 focus-within:ring-2 focus-within:ring-blue-500",
            className,
          )}
        >
          <label
            htmlFor={id}
            className="block text-xs font-medium text-text-900"
          >
            {label} {props.required && <Asterisk />}
          </label>
          <input
            type={type}
            id={id}
            className="block w-full border-0 p-0 text-text-900 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent disabled:opacity-50"
            ref={ref}
            {...props}
          />
        </div>
        {errorMessage && (
          <Typography className="text-error-600 ml-1">
            {errorMessage}
          </Typography>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
