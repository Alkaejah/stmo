import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/helpers/cn";

const checkboxVariants = cva("rounded", {
  variants: {
    variant: {
      default: "w-4 h-4 bg-gray-100 border-gray-300",
    },
    size: {
      default: "w-4 h-4",
      sm: "w-4 h-4",
      md: "w-6 h-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface CheckboxProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof checkboxVariants> {
  checkBoxValue: string;
  isChecked: boolean;
}

const CheckBox = React.forwardRef<HTMLElement, CheckboxProps>(
  ({ className, size, children, checkBoxValue, variant, ...props }) => {
    return (
      <div>
        <input
          type="checkbox"
          id="default-checkbox"
          className={cn(checkboxVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </input>
        <label htmlFor="default-checkbox" className="ms-2 text-sm text-gray-90">
          {checkBoxValue}
        </label>
      </div>
    );
  },
);
CheckBox.displayName = "CheckBox";

export { CheckBox, checkboxVariants };
