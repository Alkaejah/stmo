import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/helpers/cn";

const alertVariants = cva(
  "inline-flex whitespace-wrap items-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: " p-2 text-sm text-blue-800 rounded-lg bg-blue-50",
        primary:
          "bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-300",
        danger: "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50",
        warning: "p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50",
        success: "p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50",
        dark: "p-4 text-sm text-gray-800 rounded-lg bg-gray-50 ",
      },
      size: {
        default: "h-12 px-4 py-2 w-full",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof alertVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  alertMessage?: string;
  message: string;
}

const Alert = React.forwardRef<HTMLSpanElement, AlertProps>(
  (
    { className, variant, size, message, alertMessage, icon, ...props },
    ref,
  ) => {
    return (
      <span
        className={cn(alertVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon}
        &nbsp;&nbsp;<div className="font-medium">{alertMessage}&nbsp;</div>
        {message}
      </span>
    );
  },
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
