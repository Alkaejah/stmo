import * as React from "react";
import { cn } from "@/common/helpers/cn";
import Asterisk from "./Asterisk";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, id, ...props }, ref) => {
    return (
      <div
        className={cn(
          " bg-gray-50 focus:ring-blue-500 pb-2.5 pt-2.5 rounded-lg ring-1 ring-inset ring-text-200 focus-within:z-10 focus-within:ring-2 focus-within:ring-blue-500",
          className,
        )}
      >
        <label
          htmlFor={id}
          className="block text-xs font-medium text-text-900 px-3"
        >
          {label} {props.required && <Asterisk />}
        </label>
        <select
          ref={ref}
          className="block w-full border-0 py-0 pl-3 text-text-900 placeholder:text-text-400 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent disabled:opacity-50"
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);

export interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const Option = React.forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option ref={ref} className={className} {...props}>
        {children}
      </option>
    );
  },
);

Select.displayName = "Select";
Option.displayName = "Option";

export { Select, Option };
